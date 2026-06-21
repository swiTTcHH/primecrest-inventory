import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialAuthState, initialCartState } from "./actions";
import type { User } from "@/types/types";

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
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
    logout: () => {
      return {
        ...initialAuthState,
        ...initialCartState
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;