import { useAuthStore } from "../../stores/useAuthStore";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router";
import { FiMenu, FiX } from "react-icons/fi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { staffNavItems, adminNavItems } from "../../lib/sidebarNavItems";
import { getInitials } from "../../utils/getInitials";
import Modal from "../commons/Modal";

export default function Sidebar() {
  // Zustand store selectors
  const { user, logout, role } = useAuthStore();

  const modalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const navItems = role === "admin" ? adminNavItems : staffNavItems;

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    const id = setTimeout(() => setIsSidebarOpen(false), 0);
    return () => clearTimeout(id);
  }, [location.pathname]);

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    try {
      await logout();
      if (modalRef.current?.open) modalRef.current.close();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="flex flex-col md:flex-row max-h-screen lg:fixed lg:h-screen overflow-y-auto font-mono">
      {/* Mobile header with menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#d6ba73] z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={toggleSidebar} className="p-2 rounded-md">
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="text-xl font-bold">Retinalyze.ai</div>
          <img
            src="/logo.jpg"
            alt="logo"
            className="w-8 h-8 rounded-full border-2 border-gray-600"
          />
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static flex flex-col h-screen bg-[#d6ba73] shadow-4xl w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } top-0 left-0 md:translate-x-0 md:w-64`}
      >
        <div className="flex items-center justify-center">
          <img src="/logo.png" alt="logo" className="object-cover h-30 w-50" />
        </div>

        <div className="border-t mt-5 border-gray-300"></div>
        <nav className="flex-1 p-4 items-center justify-center py-4">
          <ul className="space-y-2 text-sm">
            {/* Navigation items */}
            {/* eslint-disable-next-line no-unused-vars */}
            {navItems.map(({ label, path, icon: IconComponent }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 font-semibold rounded-lg ${
                      isActive
                        ? "bg-[#a66a30] text-white"
                        : "hover:bg-[#f0ab6a]"
                    }`
                  }
                >
                  <IconComponent className="mr-3" size={16} />
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <div
                className="flex items-center px-4 font-semibold py-2.5 cursor-pointer hover:bg-[#f0ab6a] hover:rounded-lg"
                onClick={() => {
                  if (modalRef.current && !modalRef.current.open) {
                    modalRef.current.showModal();
                  }
                }}
              >
                <RiLogoutCircleLine className="mr-3" size={16} />
                Sign out
              </div>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-300">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-10 h-10 bg-[#4a2204] text-white rounded-full flex items-center justify-center">
              {getInitials(user.name)}
            </span>
            <div>
              <p className="text-sm font-bold">{user.name || "No name"}</p>
              <p className="text-xs text-gray-700">
                Role: {user.role || "User"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout confirmation modal */}
      <Modal
        ref={modalRef}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Yes, Logout"
        color="bg-red-500"
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
}
