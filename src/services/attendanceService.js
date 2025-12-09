import axiosInstance from "../api/axios";

// Fetch all attendance of a user
export const getAttendanceByUser = async (userId) => {
  const { data } = await axiosInstance.get(`/attendance/${userId}`);
  return data;
};

export const getMonthlyAttendance = async (month) => {
  const { data } = await axiosInstance.get(`/attendance-month/${month}`);
  return data;
};

// Time in
export const timeInRequest = async (payload) => {
  const { data } = await axiosInstance.post("/attendance", payload);
  return data;
};

// Time out
export const timeOutRequest = async (attendanceId, payload) => {
  const { data } = await axiosInstance.patch(
    `/attendance/${attendanceId}`,
    payload
  );
  return data;
};
