import axiosInstance from "../api/axios";

export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    console.log("API login response:", response);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post("/register", data);
    console.log("API register response:", response);
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
