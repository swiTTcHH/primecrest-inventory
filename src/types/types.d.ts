export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface Cart {
  cartItems: CartItem[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
}

export interface PRODUCT {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  unit: string;
  sku: string;
  image?: string | null;
}

export interface CartItem {
  product: PRODUCT;
  quantity: number;
}