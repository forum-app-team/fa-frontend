import apiClient from "@/libs/axios";

const loginUser = async (credentials) => {
  // TODO: validate endpoint
  const response = await apiClient.post("/api/auth/login", credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/api/auth/identity");
  return response.data;
};

export { loginUser, getCurrentUser };
