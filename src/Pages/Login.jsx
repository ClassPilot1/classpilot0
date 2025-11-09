import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../Store/Slices/AuthSlice";
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { RiGraduationCapFill } from "react-icons/ri";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate("/home");
    } catch (err) {
      console.log("Failed to login:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
                <RiGraduationCapFill className="text-white text-3xl" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">ClassPilot</h1>
            <p className="text-gray-600 text-sm mb-1">Teaching made magical</p>
            <p className="text-gray-600 text-sm">Empowering educators, inspiring students</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button className="flex-1 bg-purple-600 text-white font-semibold py-2 rounded-md transition">
              Sign In
            </button>
            <Link
              to="/register"
              className="flex-1 text-gray-700 font-semibold py-2 rounded-md text-center transition hover:bg-gray-200"
            >
              Create Account
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2 text-sm"
              >
                Email Address *
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 mt-1 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2 text-sm"
              >
                Password *
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 mt-1 text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Backend error display */}
            {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-purple-700 to-purple-400 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition mb-4"
            >
              {status === "loading" ? "Logging in..." : "Sign In to ClassPilot"}
            </button>

            {/* Forgot Password */}
            <div className="flex justify-center mb-6">
              <Link to="/forget-password" className="text-blue-600 text-sm hover:underline">
                Forgot your password?
              </Link>
            </div>

            {/* Feature Boxes */}
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <MdPerson className="text-white text-2xl" />
                </div>
                <span className="text-xs text-gray-600 text-center">
                  Student Management
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                  <RiGraduationCapFill className="text-white text-2xl" />
                </div>
                <span className="text-xs text-gray-600 text-center">
                  Class Organization
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                  <MdEmail className="text-white text-2xl" />
                </div>
                <span className="text-xs text-gray-600 text-center">
                  Communication
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Trusted by educators worldwide
        </p>
      </div>
    </div>
  );
};

export default Login;