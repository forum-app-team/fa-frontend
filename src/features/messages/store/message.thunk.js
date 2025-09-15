import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllMessages, sendMessage } from "../api/message.api";

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
