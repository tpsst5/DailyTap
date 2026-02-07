import { randomUUID } from 'expo-crypto';
import { getDateKey } from '../utils/dates';

export type Habit = {
  id: string;
  name: string;
  emoji?: string;
  createdAt: string; // YYYY-MM-DD
  completedDates: string[]; // YYYY-MM-DD
};

export function createHabit(name: string, emoji?: string): Habit {
  return {
    id: randomUUID(),
    name,
    emoji,
    createdAt: getDateKey(new Date()),
    completedDates: [],
  };
}

export function isCompletedOnDate(habit: Habit, date: Date): boolean {
  return habit.completedDates.includes(getDateKey(date));
}

export function toggleCompletionForDate(habit: Habit, date: Date): Habit {
  const dateKey = getDateKey(date);
  const hasDate = habit.completedDates.includes(dateKey);
  const completedDates = hasDate
    ? habit.completedDates.filter((d) => d !== dateKey)
    : [...habit.completedDates, dateKey];

  return {
    ...habit,
    completedDates,
  };
}

export function getCurrentStreak(habit: Habit, today: Date): number {
  let streak = 0;
  const checkDate = new Date(today);

  while (isCompletedOnDate(habit, checkDate)) {
    streak += 1;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}