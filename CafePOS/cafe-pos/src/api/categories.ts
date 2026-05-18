import client from './client';
import type { Category } from '../types';

export const getCategories = () =>
  client.get<Category[]>('/categories').then((r) => r.data);

export const createCategory = (data: { name: string; description: string }) =>
  client.post<Category>('/categories', data).then((r) => r.data);

export const updateCategory = (id: number, data: { name: string; description: string; isActive: boolean }) =>
  client.put<Category>(`/categories/${id}`, data).then((r) => r.data);

export const deleteCategory = (id: number) =>
  client.delete(`/categories/${id}`);
