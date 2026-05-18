export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Card' | 'GCash';

export interface Payment {
  id: number;
  amount: number;
  method: string;
  paidAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  cashierName: string;
  items: OrderItem[];
  payment?: Payment;
}

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
}

export interface ProcessPaymentRequest {
  orderId: number;
  method: number;
  amount: number;
}
