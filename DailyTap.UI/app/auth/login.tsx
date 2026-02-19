import { yupResolver } from '@hookform/resolvers/yup';
import { useHeaderHeight } from '@react-navigation/elements';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import * as yup from 'yup';

import { Link, router } from 'expo-router';

import { login as loginUser } from '../../src/services/authService';


type FormData = {
  email: string;
  password: string;
};

const validationSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginScreen() {
  const headerHeight = useHeaderHeight();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data.email, data.password);
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-semibold">Login</Text>
          <Text className="mt-2 text-base text-neutral-700">Welcome back!</Text>

        <Text className="mt-6 text-sm text-neutral-700">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              className="mt-2 rounded-lg border border-neutral-300 px-3 py-2.5 text-base text-neutral-900"
              placeholder="jane@doe.com"
              placeholderTextColor="#777"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email ? (
          <Text className="mt-1 text-sm text-red-500">{errors.email.message}</Text>
        ) : null}

        <Text className="mt-6 text-sm text-neutral-700">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              className="mt-2 rounded-lg border border-neutral-300 px-3 py-2.5 text-base text-neutral-900"
              placeholder="********"
              placeholderTextColor="#777"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password ? (
          <Text className="mt-1 text-sm text-red-500">{errors.password.message}</Text>
        ) : null}

        <Pressable
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2.5"
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-sm font-medium text-white">Login</Text>
          )}
        </Pressable>

        <Text className="mt-4 text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-blue-600">
            Register
          </Link>
        </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}