import { loginRequest, registerRequest } from '../api/authApi';
import type { User } from '../models/user';
import { clearStoredUser, getStoredUser, saveAuthSession } from '../storage/userStorage';

export async function login(email: string, password: string): Promise<User> {
  const { token } = await loginRequest(email, password);
  const user: User = { id: email, email };
  await saveAuthSession(user, token);
  return user;
}

export async function register(email: string, password: string, name?: string): Promise<User> {
  const { token } = await registerRequest(email, password, name);
  const user: User = { id: email, email, name };
  await saveAuthSession(user, token);
  return user;
}

export async function logout(): Promise<void> {
  await clearStoredUser();
}

export async function getCachedUser(): Promise<User | null> {
  return getStoredUser();
}
