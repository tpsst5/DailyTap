import { apiRequest } from './client';

type AuthResponse = {
  token: string;
};

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function registerRequest(
  email: string,
  password: string,
  name?: string,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: { email, password, name },
  });
}
