import React from "react";
import { Stack } from "expo-router";

export default function ScanReceiptLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="camera" options={{ headerShown: false }} />
      <Stack.Screen name="view_receipt" options={{ headerShown: false }} />
      <Stack.Screen name="view_bill" options={{ headerShown: false }} />
    </Stack>
  );
}
