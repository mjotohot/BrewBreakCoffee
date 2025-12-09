import axiosInstance from "../api/axios";

// Get all employees
export const getAllEmployees = async () => {
  const { data } = await axiosInstance.get("/employees");
  return data;
};
