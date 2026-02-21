import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useFocusEffect } from '@react-navigation/native';

import { useRouter, type Href } from 'expo-router';

import { getCurrentStreak, type Habit } from '../src/models/habit';
import { addHabit, getHabits, toggleHabitToday } from '../src/services/habitsService';
import { logout as logoutUser } from '../src/services/authService';
import { getDateKey } from '../src/utils/dates';

export default function HomeScreen() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const today = new Date();
  const todayKey = getDateKey(today);

  const sortHabitsByCompletion = useCallback((items: Habit[]): Habit[] => {
    return items.slice().sort((a, b) => {
      const aCompleted = a.completedDates.includes(todayKey);
      const bCompleted = b.completedDates.includes(todayKey);
      if (aCompleted === bCompleted) return 0;
      return aCompleted ? 1 : -1;
    });
  }, [todayKey]);

  const loadHabits = useCallback(async () => {
    try {
      const storedHabits = await getHabits();
      setHabits(sortHabitsByCompletion(storedHabits));
      setErrorMessage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('(401)')) {
        router.replace('/auth/login');
      } else {
        console.error(error);
        setErrorMessage('Could not load habits.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, sortHabitsByCompletion]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits]),
  );

  const handleToggleHabit = async (habitId: string) => {
    try {
      const updatedHabits = await toggleHabitToday(habitId, today);
      setHabits(updatedHabits);
    } catch (error) {
      console.error(error);
      setErrorMessage('Could not save habits.');
    }
  };

  const handleEditHabit = (habitId: string) => {
    router.push({ pathname: '/habits/[id]', params: { id: habitId } } as unknown as Href);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setHabits([]);
      setErrorMessage(null);
      router.replace('/auth/login');
    } catch (error) {
      console.error(error);
      setErrorMessage('Could not log out.');
    }
  };

  return (
    <FlatList
      data={habits}
      keyExtractor={(habit) => habit.id}
      className="p-6"
      ListHeaderComponent={
        <>
          <Text className="text-2xl font-semibold">DailyTap</Text>
          <Text className="mt-2 text-base text-neutral-700">Minimal habit tracker</Text>
          <Pressable
            className="mt-3 self-start"
            onPress={handleLogout}
          >
            <Text className="text-sm text-red-500">Log out</Text>
          </Pressable>

          {isLoading ? (
            <Text className="mt-4 text-sm text-neutral-500">Loading habits...</Text>
          ) : errorMessage ? (
            <Text className="mt-4 text-sm text-red-700">{errorMessage}</Text>
          ) : habits.length === 0 ? (
            <Text className="mt-4 text-sm text-neutral-500">No habits yet.</Text>
          ) : null}
        </>
      }
      renderItem={({ item }) => (
        <View className="mt-3 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <BouncyCheckbox
              useBuiltInState={false}
              isChecked={item.completedDates.includes(todayKey)}
              onPress={() => handleToggleHabit(item.id)}
              onLongPress={() => handleEditHabit(item.id)}
              textComponent={
                <View className="flex-row items-center">
                  {item.emoji ? (
                    <Text className="mr-0" style={styles.habitEmoji}>
                      {` ${item.emoji}`}
                    </Text>
                  ) : null}
                  <Text
                    style={
                      item.completedDates.includes(todayKey)
                        ? styles.habitDoneText
                        : styles.habitNotDoneText
                    }
                  >
                    {` ${item.name}`}
                  </Text>
                </View>
              }
            />
          </View>
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => handleEditHabit(item.id)}>
              <Text className="text-sm text-neutral-700">✏️</Text>
            </Pressable>
            <Pressable onPress={() => handleEditHabit(item.id)}>
              <Text className="text-sm text-neutral-700" numberOfLines={1}>
                🔥 {getCurrentStreak(item, today)} days
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      ListFooterComponent={
        <View className="mt-5 w-full">
          <Pressable
            className="mt-5 rounded-lg bg-neutral-900 px-4 py-2.5"
            onPress={() => router.push('/habits/new' as Href)}
          >
            <Text className="text-sm font-semibold text-white">Add habit</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  habitDoneText: {
    color: '#777',
    textDecorationLine: 'line-through',
  },
  habitNotDoneText: {
    color: '#444',
  },
  habitEmoji: {
    textDecorationLine: 'none',
  },
});
