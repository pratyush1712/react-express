import { Slice, createSlice } from "@reduxjs/toolkit";

const authSlice: Slice = createSlice({
  name: "auth",
  initialState: { user: null, accessToken: null, refreshToken: null },
  reducers: {
    logIn: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logOut: (state, action) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state: any) => state.auth.user;
export const selectAccessToken = (state: any) => state.auth.accessToken;
