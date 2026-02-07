import { createHabit, toggleCompletionForDate, type Habit } from '../models/habit';
import { loadHabits, saveHabits } from '../storage/habitsStorage';
import { getDateKey } from '../utils/dates';

export async function getHabits(): Promise<Habit[]> {
  return loadHabits();
}

export async function addHabit(name: string, emoji?: string): Promise<Habit[]> {
  const habits = await loadHabits();
  const updatedHabits = [...habits, createHabit(name, emoji)];
  await saveHabits(updatedHabits);
  return updatedHabits;
}

export async function toggleHabitToday(habitId: string, today = new Date()): Promise<Habit[]> {
  const habits = await loadHabits();
  const updatedHabits = habits.map((habit) =>
    habit.id === habitId ? toggleCompletionForDate(habit, today) : habit,
  );

  const todayKey = getDateKey(today);
  const sortedHabits = updatedHabits.slice().sort((a, b) => {
    const aCompleted = a.completedDates.includes(todayKey);
    const bCompleted = b.completedDates.includes(todayKey);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  await saveHabits(sortedHabits);
  return sortedHabits;
}

export async function deleteHabitById(habitId: string): Promise<Habit[]> {
  const habits = await loadHabits();
  const updatedHabits = habits.filter((habit) => habit.id !== habitId);
  await saveHabits(updatedHabits);
  return updatedHabits;
}

export async function updateHabitById(
  habitId: string,
  updates: Pick<Habit, 'name' | 'emoji'>,
): Promise<Habit[]> {
  const habits = await loadHabits();
  const updatedHabits = habits.map((habit) =>
    habit.id === habitId ? { ...habit, ...updates } : habit,
  );
  await saveHabits(updatedHabits);
  return updatedHabits;
}
