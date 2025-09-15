import { createSlice } from "@reduxjs/toolkit";
import { getMessagesThunk, sendMessageThunk } from "./message.thunk";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    loading: false,
    success: false,
    error: null,
    messages: [],
  },
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(sendMessageThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMessagesThunk.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const selectMessageLoading = (state) => {
  return state.message?.loading || false;
};
export const selectMessageSuccess = (state) => {
  return state.message?.success || false;
};
export const selectMessageError = (state) => {
  return state.message?.error || null;
};

export const selectMessages = (state) => state.message?.messages || [];

export const { resetStatus } = messageSlice.actions;
export default messageSlice.reducer;
