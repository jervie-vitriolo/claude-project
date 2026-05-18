import client from './client';
import type { AuthResponse } from '../types';

export const login = (username: string, password: string) =>
  client.post<AuthResponse>('/auth/login', { username, password }).then((r) => r.data);

export const register = (username: string, email: string, password: string, role: number) =>
  client.post<AuthResponse>('/auth/register', { username, email, password, role }).then((r) => r.data);
