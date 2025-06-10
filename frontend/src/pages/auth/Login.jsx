import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { postLogin } from "../../api/axios_api";
import Context from "../../Context";
import toast from "react-hot-toast";


const Login = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);
  const navigateTo = useNavigate();

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
    try {
      const res = await postLogin(form);
      console.log(res.data);

      if (res.status === 201) {
        toast.success(res?.data?.message || "Login Successful");
        setForm({ email: "", password: "" });
        setIsAuthenticated(true);
        setUser(res.data.user);
        navigateTo("/app/profile");
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed. Try again."
      );
    }
  };

  const handleGoogle = async () => {
    try {
      window.location.href = "http://localhost:3000/google";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid place-items-center min-h-[70vh] bg-gray-100 px-4">
      <div className="w-full max-w-md bg-blue-100 p-8 rounded-lg shadow-md">
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
            </label>
            <button
              type="button"
              className="absolute right-3 top-[42px] text-xl text-gray-500 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <LuEye /> : <LuEyeClosed />}
            </button>
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 hover:cursor-pointer transition flex justify-center items-center gap-2"
          >
            <MdLogin className="text-xl" />
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-2 flex items-center justify-center gap-2">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleGoogle}
            className=" bg-gray-100 text-white border-white-800 p-1 rounded-full hover:bg-white transition-all hover:scale-102 ease-in-out hover:cursor-pointer"
          >
            <FcGoogle className="text-2xl" />
          </button>

          <button
            type="button"
            className=" bg-gray-600 text-white border-gray-800 p-1 rounded-full hover:bg-gray-800 transition-all hover:scale-102 ease-in-out hover:cursor-pointer"
          >
            <FaGithub className="text-2xl" />
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/app/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
