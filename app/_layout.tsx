import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'VoiceMood Coach',
        }}
      />
      <Stack.Screen
        name="record"
        options={{
          title: 'Record Your Voice',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Analysis Result',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: 'Your History',
        }}
      />
    </Stack>
  );
}
