import apiClient from "@/libs/axios";

import { API_CONFIG } from "@/config/api.config.js";

const AUTH_API = API_CONFIG.ENDPOINTS.AUTH;

const hitVerificationLink = async (token) => {
  const response = await apiClient.post(
    AUTH_API.EMAIL_VERIFICATION_VERIFY, 
    {token}
  );
  return response.data;
};

export {hitVerificationLink};
