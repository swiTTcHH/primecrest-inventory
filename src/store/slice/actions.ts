import type { AuthState, Cart } from "@/types/types";

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isAdmin: false
};

export const initialCartState: Cart = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
}