import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const AppColors = {
  darkGreen: '#4A5D32',
  lightGreen: '#6B7F4F',
  cream: '#F5F1E6',
};

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: AppColors.cream,
        },
        ...Platform.select({
          ios: {
            headerSafeAreaInsets: { top: true },
          },
        }),
      }}>
      <Stack.Screen name="home" />
      {/* Add other screens here */}
    </Stack>
  );
}