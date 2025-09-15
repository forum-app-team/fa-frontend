import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";

// https://redux-toolkit.js.org/api/createEntityAdapter
const usersAdapter = createEntityAdapter({
  selectId: (u) => u.id,
  sortComparer: (a, b) => a.email.localeCompare(b.email),
});

const usersSlice = createSlice({
  name: "users",
  initialState: booksAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder;
  },
});

// Action creators are generated for each case reducer function
//export const {  } =
//  usersSlice.actions;

export default usersSlice.reducer;

// Memoized selectors:
export const usersSelectors = usersAdapter.getSelectors((s) => s.users);
