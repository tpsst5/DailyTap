import type { Habit } from '../models/habit';
import { apiRequest } from './client';

type ApiHabit = {
  Id?: string;
  id?: string;
  Name?: string;
  name?: string;
  Emoji?: string | null;
  emoji?: string | null;
  CreatedAt?: string;
  createdAt?: string;
  CompletedDates?: string[];
  completedDates?: string[];
};

type ApiHabitPayload = {
  Name: string;
  Emoji?: string;
  CreatedAt: string;
  CompletedDates: string[];
};

function toUiHabit(apiHabit: ApiHabit): Habit {
  const id = apiHabit.Id ?? apiHabit.id;
  const name = apiHabit.Name ?? apiHabit.name;
  const createdAt = apiHabit.CreatedAt ?? apiHabit.createdAt;
  const completedDates = apiHabit.CompletedDates ?? apiHabit.completedDates;

  if (!id || typeof id !== 'string') {
    throw new Error('Invalid habit response: missing id.');
  }

  if (!name || typeof name !== 'string') {
    throw new Error(`Invalid habit response for ${id}: missing name.`);
  }

  if (!createdAt || typeof createdAt !== 'string') {
    throw new Error(`Invalid habit response for ${id}: missing createdAt.`);
  }

  if (!Array.isArray(completedDates)) {
    throw new Error(`Invalid habit response for ${id}: completedDates must be an array.`);
  }

  return {
    id,
    name,
    emoji: apiHabit.Emoji ?? apiHabit.emoji ?? undefined,
    createdAt,
    completedDates,
  };
}

function toApiHabitPayload(habit: Habit): ApiHabitPayload {
  return {
    Name: habit.name,
    Emoji: habit.emoji,
    CreatedAt: habit.createdAt,
    CompletedDates: habit.completedDates,
  };
}

export async function fetchHabits(): Promise<Habit[]> {
  const habits = await apiRequest<ApiHabit[]>('/habits');
  return habits.map(toUiHabit);
}

export async function createHabitRemote(habit: Habit): Promise<Habit> {
  const created = await apiRequest<ApiHabit>('/habits', {
    method: 'POST',
    body: toApiHabitPayload(habit),
  });
  return toUiHabit(created);
}

export async function updateHabitRemote(habitId: string, habit: Habit): Promise<Habit> {
  const updated = await apiRequest<ApiHabit>(`/habits/${habitId}`, {
    method: 'PUT',
    body: toApiHabitPayload(habit),
  });
  return toUiHabit(updated);
}

export async function deleteHabitRemote(habitId: string): Promise<void> {
  await apiRequest<void>(`/habits/${habitId}`, { method: 'DELETE' });
}
