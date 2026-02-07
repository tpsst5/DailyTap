import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import * as yup from 'yup';

import { Link, router } from 'expo-router';

import { register as registerUser } from '../../src/services/authService';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.email, data.password, data.name);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 justify-center p-6">
      <Text className="text-2xl font-semibold">Create account</Text>
      <Text className="mt-2 text-base text-neutral-700">Start tracking your habits.</Text>

      <Text className="mt-6 text-sm text-neutral-700">Name</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mt-2 rounded-lg border border-neutral-300 px-3 py-2.5 text-base text-neutral-900"
            placeholder="Jane Doe"
            placeholderTextColor="#777"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name ? <Text className="mt-1 text-sm text-red-700">{errors.name.message}</Text> : null}

      <Text className="mt-4 text-sm text-neutral-700">Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            className="mt-2 rounded-lg border border-neutral-300 px-3 py-2.5 text-base text-neutral-900"
            placeholder="you@example.com"
            placeholderTextColor="#777"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email ? (
        <Text className="mt-1 text-sm text-red-700">{errors.email.message}</Text>
      ) : null}

      <Text className="mt-4 text-sm text-neutral-700">Password</Text>
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
        <Text className="mt-1 text-sm text-red-700">{errors.password.message}</Text>
      ) : null}

      <Pressable
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2.5"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text className="text-sm font-semibold text-white">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Text>
      </Pressable>

      <Text className="mt-4 text-sm text-neutral-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-600">
          Login
        </Link>
      </Text>
    </View>
  );
}
