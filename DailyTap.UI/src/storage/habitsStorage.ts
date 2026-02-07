import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Habit } from '../models/habit';

const HABITS_STORAGE_KEY = 'dailytap.habits';

export const loadHabits = async (): Promise<Habit[]> => {
    try {
        const habits = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
        return habits ? JSON.parse(habits) : [];
    } catch (error) {
        console.error('Error loading habits:', error);
        throw error;
    }
};

export const saveHabits = async (habits: Habit[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
        console.error('Error saving habits:', error);
        throw error;
    }
};

export const deleteHabit = async (habitId: string): Promise<Habit[]> => {
    try {
        const habits = await loadHabits();
        const updatedHabits = habits.filter((habit) => habit.id !== habitId);
        await saveHabits(updatedHabits);
        return updatedHabits;
    } catch (error) {
        console.error('Error deleting habit:', error);
        throw error;
    }
};