import axiosInstance from "../api/axios";

// Submit a new leave request
export const submitLeave = async (payload) => {
  const res = await axiosInstance.post(`/leave`, payload);
  return res.data;
};

// Update leave request (e.g., approve/reject)
export const updateLeave = async (id, payload) => {
  const res = await axiosInstance.patch(`/leave/${id}`, payload);
  return res.data;
};

// Get all leave requests
export const getLeaves = async () => {
  const res = await axiosInstance.get(`/leave`);
  return res.data;
};

// Get leave requests for a specific employee
export const getLeavesByEmployee = async (userId) => {
  const res = await axiosInstance.get(`/leave/employee/${userId}`);
  return res.data;
};

// Get pending leave requests
export const getPendingLeaves = async () => {
  const res = await axiosInstance.get(`/leave/pending`);
  return res.data;
};
