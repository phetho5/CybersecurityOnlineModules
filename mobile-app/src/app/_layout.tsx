import {
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/archivo';
import { setAudioModeAsync } from 'expo-audio';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

import '@/i18n';
import { BadgeCelebration } from '@/components/badge-celebration';
import { ReminderSync } from '@/components/daily-reminder';
import { Colors } from '@/constants/theme';
import { ensureAnonymousSession } from '@/lib/auth';
import { pullRemoteState } from '@/lib/sync';
import { useAppStore } from '@/store/useAppStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
  });
  const setUserId = useAppStore((s) => s.setUserId);
  const hydrateRemoteState = useAppStore((s) => s.hydrateRemoteState);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Lets lesson audio keep playing when the student backgrounds the app or locks the screen,
  // like a podcast/music app. Requires the expo-audio config plugin's enableBackgroundPlayback
  // (app.json) baked into a real dev/production build — this has no effect in Expo Go.
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch((error) => {
      console.error('Failed to set background-capable audio mode', error);
    });
  }, []);

  // Runs independently of font loading: the app is fully usable offline on the local,
  // already-persisted Zustand state, so remote sync never blocks or gates the UI.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await ensureAnonymousSession();
      if (cancelled) return;
      setUserId(session?.user.id ?? null);
      if (!session) return;

      const remote = await pullRemoteState(session.user.id);
      if (cancelled || !remote) return;
      hydrateRemoteState(remote);
    })();
    return () => {
      cancelled = true;
    };
  }, [setUserId, hydrateRemoteState]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="language" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="module/[id]" />
        <Stack.Screen name="lesson/[moduleId]/[lessonN]" />
        <Stack.Screen name="quiz/[id]" />
        <Stack.Screen name="quiz/[moduleId]/[lessonN]" />
        <Stack.Screen name="result/[id]" />
        <Stack.Screen name="certificate/[moduleId]" options={{ animation: 'fade' }} />
      </Stack>
      <BadgeCelebration />
      <ReminderSync />
    </>
  );
}
