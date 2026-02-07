import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { deleteHabitById, getHabits, updateHabitById } from '../../src/services/habitsService';

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [habitFound, setHabitFound] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadHabit = async () => {
      try {
        const habits = await getHabits();
        const habit = habits.find((item) => item.id === id);
        if (isMounted) {
          if (habit) {
            setName(habit.name);
            setEmoji(habit.emoji ?? '');
          } else {
            setHabitFound(false);
          }
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setErrorMessage('Could not load habit.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHabit();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Habit name is required.');
      return;
    }

    try {
      if (id) {
        await updateHabitById(id, { name: trimmedName, emoji: emoji.trim() || undefined });
      }
      router.replace('/');
    } catch (error) {
      console.error(error);
      setErrorMessage('Could not save habit.');
    }
  };

  const handleDelete = () => {
    if (!id) {
      return;
    }

    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteHabitById(id);
            router.replace('/');
          } catch (error) {
            console.error(error);
            setErrorMessage('Could not delete habit.');
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 justify-center p-6">
      <Text className="text-2xl font-semibold">Edit Habit</Text>
      <Text className="mt-2 text-base text-neutral-700">Update your habit details.</Text>

      {isLoading ? (
        <Text className="mt-4 text-sm text-neutral-500">Loading...</Text>
      ) : !habitFound ? (
        <Text className="mt-4 text-sm text-red-700">Habit not found.</Text>
      ) : errorMessage ? (
        <Text className="mt-4 text-sm text-red-700">{errorMessage}</Text>
      ) : null}

      <Text className="mt-6 text-sm text-neutral-700">Habit name</Text>
      <TextInput
        className="mt-2 rounded-lg border border-neutral-300 px-3 py-2.5 text-base text-neutral-900"
        placeholder="e.g. Drink water"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />

      <Text className="mt-4 text-sm text-neutral-700">Emoji (optional)</Text>
      <TextInput
        className="mt-2 rounded-lg border border-neutral-300 px-3 py-2.5 text-base text-neutral-900"
        placeholder="e.g. 💧"
        placeholderTextColor="#777"
        value={emoji}
        onChangeText={setEmoji}
        maxLength={2}
      />

      <Pressable className="mt-6 rounded-lg bg-neutral-900 px-4 py-2.5" onPress={handleSave}>
        <Text className="text-sm font-semibold text-white">Save habit</Text>
      </Pressable>

      <Pressable className="mt-3 rounded-lg border border-red-300 px-4 py-2.5" onPress={handleDelete}>
        <Text className="text-sm font-semibold text-red-700">Delete habit</Text>
      </Pressable>
    </View>
  );
}
