import { Routes, Route } from "react-router";
import AuthLayout from "../components/layouts/AuthLayout.jsx";
import MainLayout from "../components/layouts/MainLayout.jsx";
import HomeRedirect from "./HomeRedirect.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register.jsx";
import Dashboard from "../pages/staff/Dashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import StaffNotification from "../pages/staff/StaffNotification.jsx";
import FileLeave from "../pages/staff/FileLeave.jsx";
import Profile from "../pages/staff/Profile.jsx";
import StaffPayroll from "../pages/admin/StaffPayroll.jsx";
import StaffList from "../pages/admin/StaffList.jsx";
import LeaveRequests from "../pages/admin/LeaveRequests.jsx";
import AdminNotification from "../pages/admin/AdminNotification.jsx";

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
          <Route path="notification" element={<StaffNotification />} />
          <Route path="leave-request" element={<FileLeave />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Protected routes for Admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<MainLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="payroll" element={<StaffPayroll />} />
          <Route path="staffs" element={<StaffList />} />
          <Route path="requests" element={<LeaveRequests />} />
          <Route path="notification" element={<AdminNotification />} />
        </Route>
      </Route>
    </Routes>
  );
}
