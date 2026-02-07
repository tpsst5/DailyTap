import type { Habit } from '../models/habit';
import { apiRequest } from './client';

export async function fetchHabits(): Promise<Habit[]> {
  return apiRequest<Habit[]>('/habits');
}

export async function createHabitRemote(habit: Habit): Promise<Habit> {
  return apiRequest<Habit>('/habits', {
    method: 'POST',
    body: habit,
  });
}

export async function updateHabitRemote(habitId: string, habit: Habit): Promise<Habit> {
  return apiRequest<Habit>(`/habits/${habitId}`, {
    method: 'PUT',
    body: habit,
  });
}

export async function deleteHabitRemote(habitId: string): Promise<void> {
  await apiRequest<void>(`/habits/${habitId}`, { method: 'DELETE' });
}
