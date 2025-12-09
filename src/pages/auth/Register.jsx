import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../../services/auth";
import { MdEmail, MdContactPhone } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { toast } from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setShowLoading(true);
    try {
      const data = {
        name,
        email,
        password,
      };
      const response = await registerUser(data);
      console.log("Registration success:", response);
      toast.success("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(err.message || "Registration failed.");
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <div className="font-mono">
      <form onSubmit={handleRegister} className="space-y-3">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[#4a2204] font-semibold">Name</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full border-b border-gray-300 focus:border-[#4a2204] outline-none py-3 text-[#4a2204]"
            />
            <FaUserAlt className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4a2204] text-xl" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-[#4a2204] font-semibold">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full border-b border-gray-300 focus:border-[#4a2204] outline-none py-3 text-[#4a2204]"
            />
            <MdEmail className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4a2204] text-xl" />
          </div>
        </div>

        {/* Password */}
        <div className="relative">
          <label className="text-[#4a2204] font-semibold">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            required
            className="w-full border-b border-gray-300 focus:border-[#4a2204] outline-none py-3 text-[#4a2204]"
          />
          {showPassword ? (
            <IoMdEyeOff
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4a2204] text-xl cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4a2204] text-xl cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="text-[#4a2204] font-semibold">
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter password"
            required
            className="w-full border-b border-gray-300 focus:border-[#4a2204] outline-none py-3 text-[#4a2204]"
          />
          {showConfirmPassword ? (
            <IoMdEyeOff
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4a2204] text-xl cursor-pointer"
              onClick={() => setShowConfirmPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4a2204] text-xl cursor-pointer"
              onClick={() => setShowConfirmPassword(true)}
            />
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          className={`w-full text-white font-bold py-3 rounded-xl cursor-pointer bg-[#4a2204] 
          ${
            showLoading
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-[#4a2204]/80"
          }`}
          disabled={showLoading}
        >
          {showLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              <span>Loading...</span>
            </>
          ) : (
            <span>Register</span>
          )}
        </button>
      </form>

      <div className="flex justify-center mt-5">
        <span>Already have an account ?</span> &nbsp;{" "}
        <Link to="/">
          <span className="font-bold underline cursor-pointer">Login</span>
        </Link>
      </div>
    </div>
  );
}
