import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="view_receipt" />
            <Stack.Screen name="view_bill" />
        </Stack>
    );
}