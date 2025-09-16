import apiClient from "../../../libs/axios";
import { API_CONFIG } from "@/config/api.config";

export const sendMessage = async (messageData) => {
  try {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.MESSAGES.SEND,
      messageData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

export const getAllMessages = async () => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.MESSAGES.LIST);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get messages");
  }
};

export const updateMessageStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(API_CONFIG.ENDPOINTS.MESSAGES.PATCH(id), {
      status,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update message status"
    );
  }
};
