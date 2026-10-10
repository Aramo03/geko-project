import { createSlice } from "@reduxjs/toolkit";

const initialToken = typeof window !== "undefined" ? localStorage.getItem("geko_access_token") : null;

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    token: initialToken,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("geko_access_token", action.payload);
      } else {
        localStorage.removeItem("geko_access_token");
      }
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("geko_access_token");
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;