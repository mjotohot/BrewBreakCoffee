import axiosInstance from "../api/axios";

export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post("/register", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/logout");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const employeesList = async () => {
  try {
    const response = await axiosInstance.get("/employees");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
