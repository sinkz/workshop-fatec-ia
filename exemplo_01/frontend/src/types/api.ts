export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  createdAt: string;
}

export interface Sale {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  customerName: string;
  saleDate: string;
  product?: Product;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
