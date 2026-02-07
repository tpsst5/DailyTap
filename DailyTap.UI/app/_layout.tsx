import '../global.css';

import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { getCachedUser } from '../src/services/authService';

if (__DEV__) {
  try {
    // Helps diagnose NativeWind setup issues in development.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('nativewind').verifyInstallation();
  } catch (error) {
    console.error(error);
  }
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [hasUser, setHasUser] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const user = await getCachedUser();
        if (isMounted) {
          setHasUser(Boolean(user));
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setHasUser(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading || hasUser === null) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';

    if (!hasUser && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (hasUser && inAuthGroup) {
      router.replace('/');
    }
  }, [hasUser, isLoading, router, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <>
      <Stack />
      <StatusBar style="auto" />
    </>
  );
}
