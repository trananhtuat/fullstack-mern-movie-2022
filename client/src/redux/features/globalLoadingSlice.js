import { createSlice } from "@reduxjs/toolkit";

export const globalLoadingSlice = createSlice({
  name: "AuthModal",
  initialState: {
    globalLoading: false
  },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    }
  }
});

export const {
  setGlobalLoading
} = globalLoadingSlice.actions;

export default globalLoadingSlice.reducer;