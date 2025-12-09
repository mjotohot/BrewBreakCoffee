import { Routes, Route } from "react-router";
import AuthLayout from "../components/layouts/AuthLayout.jsx";
import MainLayout from "../components/layouts/MainLayout.jsx";
import HomeRedirect from "./HomeRedirect.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register.jsx";
import Dashboard from "../pages/staff/Dashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import Notification from "../components/commons/Notification.jsx";
import FileLeave from "../pages/staff/FileLeave.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to Login page */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes for Staff */}
      <Route element={<ProtectedRoute />}>
        <Route path="/staff" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notification" element={<Notification />} />
          <Route path="leave-request" element={<FileLeave />} />
        </Route>
      </Route>

      {/* Protected routes for Admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<MainLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
