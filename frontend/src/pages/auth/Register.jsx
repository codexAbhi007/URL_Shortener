import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import { generateEmail, postRegister } from "../../api/axios_api";
import { IoMdSend } from "react-icons/io";
import toast from "react-hot-toast";

import { LuEye, LuEyeClosed } from "react-icons/lu";
import Context from "../../Context";
const Register = () => {
  const navigateTo = useNavigate();
  const { setIsAuthenticated } = useContext(Context);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgreeChange = (e) => {
    setAgree(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    try {
      const res = await postRegister(form);
      // console.log(res);

      if (res.status === 201) {
        toast.success(res?.data?.message || "Registration Successful");
        setForm({ username: "", email: "", password: "" });
        setAgree(false);
        setIsAuthenticated(true);
        navigateTo("/app/profile");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed. Try again."
      );
    }
  };

  const handleVerify = async () => {
    if (!form.username || !form.email || !form.password) {
      toast.error("Please fill the form first!");
      return
    }
    if(!agree){
      toast.error("You must Accept our terms and conditions")
      return
    }
    try {
      const res = await generateEmail(form);
      console.log(res)
       if (res.status === 200) {
        toast.success(res?.data?.message || "Verification Code Sent");
        setForm({ username: "", email: "", password: "" });
        setAgree(false);
        setIsAuthenticated(true);
        navigateTo(`/app/email/verify?email=${res.data.user.email}&id=${res.data.user.id}`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Request failed. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4 ">
      <div className="w-full max-w-md bg-blue-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

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
                className="bg-white mt-2 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </label>
            <div className="mt-4 ">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-blue-600 px-2 py-1 rounded-lg text-10px text-white hover:cursor-pointer hover:scale-101 transition-all ease-in-out "
                onClick={handleVerify}
              >
                <p>Verify Email </p>
                <IoMdSend size={18} />
              </button>
            </div>
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
                {showPassword ? <LuEye /> : <LuEyeClosed />}
              </button>
            </label>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={agree}
              onChange={handleAgreeChange}
              className="mr-2"
            />
            <label htmlFor="agree" className="text-sm">
              I agree to the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 flex justify-center items-center gap-2  hover:cursor-pointer hover:scale-101 transition-all ease-in-out "
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
