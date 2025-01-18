import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const AppColors = {
  darkGreen: '#4A5D32',
  cream: '#F5F1E6',
};

export default function HomeLayout() {
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
      }}
    >
      
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen 
        name="scan_receipt" 
        options={{
          title: 'Scan Receipt',
        }}
      />
      <Stack.Screen 
        name="manual_input" 
        options={{
          title: 'Manual Entry',
        }}
      />
      <Stack.Screen 
        name="history" 
        options={{
          title: 'History',
        }}
      />
    </Stack>
  );
}