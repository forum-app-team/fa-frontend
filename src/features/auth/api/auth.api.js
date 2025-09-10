import apiClient from "@/libs/axios";

export const loginUser = async (credentials) => {
  const response = await apiClient.post("/api/auth/login", credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/api/auth/me");
  return response.data;
};
