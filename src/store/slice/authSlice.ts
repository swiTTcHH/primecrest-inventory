import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialAuthState, initialCartState } from "./actions";
import type { User } from "@/types/types";

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
        isAuthenticated: boolean;
      }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAdmin = action.payload.user.role === "admin" ? true : false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
    lockSession: (state) => {
      // Locks the screen while keeping the refresh token for biometric quick-unlock
      state.isAuthenticated = false;
      state.accessToken = null;
    },
  },
});

export const { login, setUser, logout, lockSession } = authSlice.actions;
export default authSlice.reducer;