import client from './client';
import type { Order, CreateOrderRequest, ProcessPaymentRequest } from '../types';

export const getOrders = () =>
  client.get<Order[]>('/orders').then((r) => r.data);

export const getOrder = (id: number) =>
  client.get<Order>(`/orders/${id}`).then((r) => r.data);

export const createOrder = (data: CreateOrderRequest) =>
  client.post<Order>('/orders', data).then((r) => r.data);

export const updateOrderStatus = (id: number, status: number) =>
  client.put<Order>(`/orders/${id}/status`, { status }).then((r) => r.data);

export const processPayment = (id: number, data: ProcessPaymentRequest) =>
  client.post<Order>(`/orders/${id}/payment`, data).then((r) => r.data);
