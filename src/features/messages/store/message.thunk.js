import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllMessages,
  sendMessage,
  updateMessageStatus,
} from "../api/message.api";

export const sendMessageThunk = createAsyncThunk(
  "messages/send",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await sendMessage(messageData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMessagesThunk = createAsyncThunk(
  "messages/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllMessages();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMessageStatusThunk = createAsyncThunk(
  "messages/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await updateMessageStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
