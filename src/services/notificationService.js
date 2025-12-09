import axiosInstance from "../api/axios";

export const getNotifications = async (userId) => {
  const res = await axiosInstance.get(`/notification/${userId}`);
  return res.data;
};

export const createNotification = async (payload) => {
  const res = await axiosInstance.post(`/notification`, payload);
  return res.data;
};
