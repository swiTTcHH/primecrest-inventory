import type { PRODUCT, User } from "./types"

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
  // isAuthenticated: true | false;
};

export interface ProductResponse {
  data: PRODUCT[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }; 
}

export interface EditProductResponse {
  data: PRODUCT;
  message: string
  
}

export interface AddProductResponse {
  data: PRODUCT;
  message: string

}

export interface AddCategoryResponse {
  data: Category
}