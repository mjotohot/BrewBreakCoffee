import { BiSolidDashboard } from "react-icons/bi";
import { FaUser } from "react-icons/fa6";
import { MdGroupAdd } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
import { FaFilePen } from "react-icons/fa6";

export const staffNavItems = [
  {
    label: "Dashboard",
    path: "/staff/dashboard",
    icon: BiSolidDashboard,
  },
  {
    label: "Notification",
    path: "/staff/notification",
    icon: IoNotificationsSharp,
  },
  {
    label: "File Leave",
    path: "/staff/leave-request",
    icon: FaFilePen,
  },
  {
    label: "Profile",
    path: "/staff/profile",
    icon: FaUser,
  },
];

export const adminNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: BiSolidDashboard,
  },
  {
    label: "Staff List",
    path: "/admin/staffs",
    icon: MdGroupAdd,
  },
  {
    label: "Leave Requests",
    path: "/admin/requests",
    icon: FaFilePen,
  },
  {
    label: "Staff Payrolls",
    path: "/admin/payroll",
    icon: FaUser,
  },
    {
    label: "Notification",
    path: "/admin/notification",
    icon: IoNotificationsSharp,
  },
];
