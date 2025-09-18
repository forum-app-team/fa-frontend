import apiClient from "@/libs/axios";

import { API_CONFIG } from "@/config/api.config.js";

const USERS_API = API_CONFIG.ENDPOINTS.USERS;
const AUTH_API = API_CONFIG.ENDPOINTS.AUTH;

const getMyProfile = async () => {
  const response = await apiClient.post(
    USERS_API.ME, 
  );
  return response.data;
};

const getUserProfile = async (id) => {
  if (!id) {
    throw new Error("User ID required");

  }
  const response = await apiClient.get(
    USERS_API.PROFILE(id), 
  );
  return response.data;
};

const updateUserProfile = async (id, profile) => {
    if (!id) {
    throw new Error("User ID required");

  }
  if (!profile) {
    throw new Error("No updates provided");
  }

  console.log(profile);
  
  const response = await apiClient.patch(
    USERS_API.PROFILE(id),
    profile
  );
  return response.data;
}

const resendVerificationEmail = async () => {
  const response = await apiClient.post(
    AUTH_API.EMAIL_VERIFICATION_SEND
  );
  return response.data;
} 

export {getMyProfile, getUserProfile, updateUserProfile, resendVerificationEmail};