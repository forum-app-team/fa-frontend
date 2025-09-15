import apiClient from "../../../libs/axios";

export const sendMessage = async (messageData) => {
  try {
    const response = await apiClient.post("/api/messages", messageData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

export const getAllMessages = async () => {
  try {
    const response = await apiClient.get("/api/messages");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to get messages"
    );
  }
};
