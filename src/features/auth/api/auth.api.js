import apiClient from "@/libs/axios";

import { API_CONFIG } from "@/config/api.config.js";

const AUTH_API = API_CONFIG.ENDPOINTS.AUTH;

const loginUser = async (credentials) => {
  // TODO: validate endpoint
  const response = await apiClient.post(
    AUTH_API.LOGIN, 
    credentials
  );
  return response.data;
};

const registerUser = async (credentials) => {
  const response = await apiClient.post(
    API_CONFIG.REGISTER,
    credentials
  );
  return response.data;
}

const logoutUser = async () => {
  const response = await apiClient.get(AUTH_API.LOGOUT);
  return response.data;
}

const updateUserIdentity = async (credentials) => {
  const response = apiClient.put(
    API_CONFIG.UPDATE_IDENTITY,
    credentials
  );
  return response.data;
}

const refreshToken = async () => {
  const response = await apiClient.post(
    API_CONFIG.REFRESH,
    null, 
    {
      withCredentials: true // refresh token required
    }
  );
  return response.data;
};

export { loginUser, registerUser, logoutUser, updateUserIdentity, refreshToken };
