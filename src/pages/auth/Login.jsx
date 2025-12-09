import { useState } from "react";
import { loginUser } from "../../services/auth";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { MdEmail } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser, setRole, setToken, setUserId } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    try {
      const response = await loginUser({
        email,
        password,
      });
      setUserId(response.user.id);
      setUser(response.user);
      setRole(response.user.role);
      setToken(response.token);
      toast.success("Login successful!");
      const role = response.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/staff/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err.message || "Login failed.");
    }
    setShowLoading(false);
  };

  return (
    <div className="p-3 font-mono">
      <h1 className="text-4xl font-bold text-[#4a2204] mb-10 relative inline-block">
        Sign In
        <span className="absolute left-1/2 -bottom-5 w-20 h-1 bg-[#4a2204] -translate-x-1/2 rounded"></span>
      </h1>

      <form onSubmit={handleRegister} className="space-y-6">
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 text-[#4a2204] border-[#4a2204] cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-[#4a2204] font-semibold"
            >
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="text-sm text-[#4a2204] hover:underline font-semibold cursor-pointer"
            onClick={() => console.log("Forgot Password")}
          >
            Forgot Password?
          </button>
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
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>
      </form>

      <div className="flex justify-center mt-5">
        <span>Don't have an account ?</span> &nbsp;{" "}
        <Link to="/register">
          <span className="font-bold underline cursor-pointer">Register</span>
        </Link>
      </div>
    </div>
  );
}
