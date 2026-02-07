import type { Habit } from '../models/habit';

export async function pullHabits(): Promise<Habit[]> {
  // TODO: implement cloud pull when auth + API exist.
  return [];
}

export async function pushHabits(_habits: Habit[]): Promise<void> {
  // TODO: implement cloud push when auth + API exist.
}
