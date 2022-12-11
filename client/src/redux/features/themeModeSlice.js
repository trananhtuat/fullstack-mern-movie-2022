import { createSlice } from "@reduxjs/toolkit";

export const themeModeSlice = createSlice({
  name: "ThemeMode",
  initialState: {
    themeMode: "dark"
  },
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    }
  }
});

export const {
  setThemeMode
} = themeModeSlice.actions;

export default themeModeSlice.reducer;