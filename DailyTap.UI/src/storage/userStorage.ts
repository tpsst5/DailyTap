import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../models/user';

type AuthSession = {
  user: User;
  token: string;
};

const SESSION_STORAGE_KEY = 'dailytap.session';

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  const session = JSON.parse(raw) as AuthSession;
  return session.user ?? null;
}

export async function getStoredToken(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  const session = JSON.parse(raw) as AuthSession;
  return session.token ?? null;
}

export async function saveAuthSession(user: User, token: string): Promise<void> {
  const session: AuthSession = { user, token };
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function clearStoredUser(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}
