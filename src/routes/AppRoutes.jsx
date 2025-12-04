import { Routes, Route } from "react-router";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to Login page */}
      {/* <Route path="/" element={<HomeRedirect />} /> */}

      {/* Public auth routes */}
      {/* <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route> */}

      {/* Protected routes for Admin */}
      {/* <Route path="/admin" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add" element={<AddDoctor />} />
        <Route path="doctors" element={<AllDoctors />} />
      </Route> */}
    </Routes>
  );
}
