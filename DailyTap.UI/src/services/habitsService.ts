import { createHabit, toggleCompletionForDate, type Habit } from '../models/habit';
import {
  createHabitRemote,
  deleteHabitRemote,
  fetchHabits,
  updateHabitRemote,
} from '../api/habitsApi';
import { getDateKey } from '../utils/dates';

export async function getHabits(): Promise<Habit[]> {
  return fetchHabits();
}

export async function addHabit(name: string, emoji?: string): Promise<Habit[]> {
  const newHabit = createHabit(name, emoji);
  await createHabitRemote(newHabit);
  const habits = await fetchHabits();
  return sortHabitsByCompletion(habits, new Date());
}

export async function toggleHabitToday(habitId: string, today = new Date()): Promise<Habit[]> {
  const habits = await fetchHabits();
  const target = habits.find((habit) => habit.id === habitId);
  if (!target) {
    return sortHabitsByCompletion(habits, today);
  }

  const updated = toggleCompletionForDate(target, today);
  await updateHabitRemote(habitId, updated);
  const refreshed = await fetchHabits();
  return sortHabitsByCompletion(refreshed, today);
}

export async function deleteHabitById(habitId: string): Promise<Habit[]> {
  await deleteHabitRemote(habitId);
  const habits = await fetchHabits();
  return sortHabitsByCompletion(habits, new Date());
}

export async function updateHabitById(
  habitId: string,
  updates: Pick<Habit, 'name' | 'emoji'>,
): Promise<Habit[]> {
  const habits = await fetchHabits();
  const target = habits.find((habit) => habit.id === habitId);
  if (!target) {
    return sortHabitsByCompletion(habits, new Date());
  }

  await updateHabitRemote(habitId, { ...target, ...updates });
  const refreshed = await fetchHabits();
  return sortHabitsByCompletion(refreshed, new Date());
}

function sortHabitsByCompletion(habits: Habit[], today: Date): Habit[] {
  const todayKey = getDateKey(today);
  return habits.slice().sort((a, b) => {
    const aCompleted = a.completedDates.includes(todayKey);
    const bCompleted = b.completedDates.includes(todayKey);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });
}
