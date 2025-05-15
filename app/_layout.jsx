import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';
import { router } from 'expo-router';
import { useColorScheme } from '../hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('./index');
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="login"/>
      <Stack.Screen name="signup"/>
      <Stack.Screen name="dashboard"/>
      <Stack.Screen name="cart"/>
      <Stack.Screen name="profile"/>
      <Stack.Screen name="circuits"/>
      <Stack.Screen name="chess"/>
      <Stack.Screen name="csc"/>
      <Stack.Screen name="symbioses"/>
      <Stack.Screen name="access"/>
      <Stack.Screen name="storm"/>
      <Stack.Screen name="+not-found"/>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="circuits" options={{ headerShown: false }} />
        <Stack.Screen name="chess" options={{ headerShown: false }} />
        <Stack.Screen name="csc" options={{ headerShown: false }} />
        <Stack.Screen name="symbiosis" options={{ headerShown: false }} />
        <Stack.Screen name="access" options={{ headerShown: false }} />
        <Stack.Screen name="storm" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
