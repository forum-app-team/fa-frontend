import apiClient from "@/libs/axios";

const loginUser = async (credentials) => {
  // TODO: validate endpoint
  const response = await apiClient.post("/api/auth/login", credentials);
  return response.data;
};

const getCurrentUser = async () => {
  // TODO: validate endpoint
  const response = await apiClient.get("/api/auth/me");
  return response.data;
};

export { loginUser, getCurrentUser };
