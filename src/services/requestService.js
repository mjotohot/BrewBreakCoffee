import axiosInstance from "../api/axios";

// Fetch all leave requests (for admin)
export const getAllLeaves = async () => {
  const { data } = await axiosInstance.get("/leave");
  return data;
};

// Update leave status (approve/reject)
export const updateLeaveStatus = async (leaveId, payload) => {
  const { data } = await axiosInstance.patch(`/leave/${leaveId}`, payload);
  return data;
};
