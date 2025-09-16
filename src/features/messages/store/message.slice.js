import { createSlice } from "@reduxjs/toolkit";
import {
  getMessagesThunk,
  sendMessageThunk,
  updateMessageStatusThunk,
} from "./message.thunk";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    loading: false,
    updating: false,
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
      .addCase(getMessagesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMessageStatusThunk.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateMessageStatusThunk.fulfilled, (state, action) => {
        state.updating = false;
        const updated = action.payload;
        const idx = state.messages.findIndex((m) => m.id === updated.id);
        if (idx !== -1) {
          state.messages[idx] = { ...state.messages[idx], ...updated };
        }
      })
      .addCase(updateMessageStatusThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const selectMessageLoading = (state) => {
  return state.message?.loading || false;
};
export const selectMessageUpdating = (state) => {
  return state.message?.updating || false;
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
