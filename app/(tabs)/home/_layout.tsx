import React from "react";
import { Stack } from "expo-router";

export default function ScanReceiptLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="scan_receipt" />
      <Stack.Screen name="manual_input" />
    </Stack>
  );
}
