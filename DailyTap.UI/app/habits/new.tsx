import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { router } from 'expo-router';

import { addHabit } from '../../src/services/habitsService';

export default function NewHabitScreen() {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Habit name is required.');
      return;
    }

    try {
      setIsSaving(true);
      await addHabit(trimmedName, emoji.trim() || undefined);
      router.replace('/');
    } catch (error) {
      console.error(error);
      setErrorMessage('Could not save habit.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6">
      <Text className="text-2xl font-semibold">Add Habit</Text>
      <Text className="mt-2 text-base text-neutral-700">Create a new habit to track.</Text>

      {errorMessage ? (
        <Text className="mt-4 text-sm text-red-700">{errorMessage}</Text>
      ) : null}

      <Text className="mt-6 text-sm text-neutral-700">Habit name</Text>
      <TextInput
        className="mt-2 rounded-lg border border-neutral-300 px-3 py-2.5 text-base text-neutral-900"
        placeholder="e.g. Drink water"
        placeholderTextColor="#777"
        autoCapitalize="sentences"
        autoFocus={true}
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

      <Pressable
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2.5"
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text className="text-sm font-semibold text-white">
          {isSaving ? 'Saving...' : 'Save habit'}
        </Text>
      </Pressable>

      <Pressable className="mt-3 px-4 py-2.5" onPress={() => router.back()}>
        <Text className="text-sm font-semibold text-neutral-700">Cancel</Text>
      </Pressable>
    </View>
  );
}
