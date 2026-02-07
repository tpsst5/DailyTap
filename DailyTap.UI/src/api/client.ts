import { getStoredToken } from '../storage/userStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = await getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed.');
  }

  return (await response.json()) as T;
}
