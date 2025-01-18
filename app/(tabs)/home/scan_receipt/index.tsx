import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanReceipt() {
    return (
        <SafeAreaView>
            <Link href="/home/scan_receipt/view_receipt">
                <Text>View Receipt</Text>
            </Link>
        </SafeAreaView>
    );
}

