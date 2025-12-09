import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";
import bgImage from "../assets/images/bg-img.jpg";

export default function ProtectedRoute() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  // Show Access Denied if user is not logged in
  if (!user || !token) {
    return (
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
        className="flex h-screen flex-col items-center justify-center bg-gray-100 text-center px-4 font-mono absolute inset-0 bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-[#a66a30] opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white">Access Denied</h1>
          <p className="text-white text-lg mb-6">
            You do not have permission to access this page. Please login to
            continue.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-400 cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
