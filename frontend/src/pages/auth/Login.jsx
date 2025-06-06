import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    const response = await axios.post("http://localhost:3000/app/login", form);
    console.log(response.data);
    console.log("form submitted");
    // Handle login logic here
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-blue-100 p-8 rounded-lg shadow-md ">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full px-3 py-2 bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <div className="mb-4 relative">
            <label className="block mb-1 font-medium">
              Password
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 w-full px-3 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="button"
                className="absolute right-3 top-11 text-xl text-gray-500 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </label>
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            <MdLogin className="text-xl" />
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/app/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;