import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import { postRegister } from "../../api/axios_api";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(""); // Clear error on input change
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgreeChange = (e) => {
    setAgree(e.target.checked);
    setError(""); // Clear error when checkbox changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!agree) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    try {
      const res = await postRegister(form);
      console.log(res);

      if (res.status === 201 || res.data.success) {
        setSuccess("Account created successfully!");
        setForm({ username: "", email: "", password: "" });
        // setAgree(false);
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.error || err.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 ">
      <div className="w-full max-w-md bg-blue-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              User Name
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="bg-white mt-2 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-white mt-2 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-white mt-2 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={agree}
              onChange={handleAgreeChange}
              required
              className="mr-2"
            />
            <label htmlFor="agree" className="text-sm">
              I agree to the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition flex justify-center items-center gap-2"
          
          >
            <MdLogin className="text-xl" />
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already a user?{" "}
          <Link to="/app/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
