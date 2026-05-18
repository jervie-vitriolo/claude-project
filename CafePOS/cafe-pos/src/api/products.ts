import client from './client';
import type { Product } from '../types';

export const getProducts = (categoryId?: number) =>
  client.get<Product[]>('/products', { params: categoryId ? { categoryId } : {} }).then((r) => r.data);

export const createProduct = (data: Omit<Product, 'id' | 'categoryName'>) =>
  client.post<Product>('/products', data).then((r) => r.data);

export const updateProduct = (id: number, data: Omit<Product, 'id' | 'categoryName'>) =>
  client.put<Product>(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: number) =>
  client.delete(`/products/${id}`);
