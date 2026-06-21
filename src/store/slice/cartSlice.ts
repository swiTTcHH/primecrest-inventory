import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart, CartItem } from "@/types/types";
import { initialCartState } from "./actions";

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            // check for existing items
            if (state.cartItems.find((cartItem: CartItem) => cartItem.product._id.toString() === action.payload.product._id.toString())) {
                updateQuantity({ productId: action.payload.product._id.toString(), quantity: action.payload.quantity + 1, stockQuantity: action.payload.product.stockQuantity });
                return;
            }
            else {
                if (action.payload.quantity > action.payload.product.stockQuantity) {
                    return;
                }
                state.cartItems.push(action.payload);
                state.cartTotalQuantity += action.payload.quantity;
                state.cartTotalAmount += action.payload.product.price * action.payload.quantity;
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const cartItem = state.cartItems.find((cartItem: CartItem) => cartItem.product._id.toString() === action.payload);
            if (cartItem) {
                state.cartTotalQuantity -= cartItem.quantity;
                state.cartTotalAmount -= cartItem.product.price * cartItem.quantity;
                state.cartItems = state.cartItems.filter(
                    (cartItem: CartItem) => cartItem.product._id.toString() !== action.payload
                );
            }
        },
        updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number, stockQuantity: number }>) => {
            const { productId, quantity, stockQuantity } = action.payload;
            const cartItem = state.cartItems.find((cartItem: CartItem) => cartItem.product._id.toString() === productId);
            if (cartItem) {
                if (quantity > stockQuantity) {
                    return;
                }
                state.cartTotalQuantity -= cartItem.quantity;
                state.cartTotalAmount -= cartItem.product.price * cartItem.quantity;
                cartItem.quantity = quantity;
                state.cartTotalQuantity += cartItem.quantity;
                state.cartTotalAmount += cartItem.product.price * cartItem.quantity;
            }
        },
        clearCart: () => {
            return { ...initialCartState };
        },
        calculateTotal: (state) => {
            state.cartTotalAmount = state.cartItems.reduce(
                (total: number, cartItem: CartItem) => total + cartItem.product.price * cartItem.quantity,
                0
            );
            state.cartTotalQuantity = state.cartItems.reduce(
                (total: number, cartItem: CartItem) => total + cartItem.quantity,
                0
            );
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, calculateTotal } = cartSlice.actions;
export default cartSlice.reducer;