import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { MenuItems, items } from "./view_receipt";

type BillSummary = {
  [key: string]: number;
};

export default function ViewBill() {
  const { members, total } = useLocalSearchParams<{ members: string, total: string }>();
  const parsedMembers = members ? JSON.parse(members) as Record<MenuItems, string[]> : {};
  const parsedTotal = parseFloat(total || "0");

  const calculateBills = (): BillSummary => {
    const bills: BillSummary = {};
    
    // Initialize bills for each member
    (Object.values(parsedMembers).flat() as string[]).forEach((member: string) => {
      if (member !== "Aiken" && !bills[member]) {
        bills[member] = 0;
      }
    });

    // Calculate amount per person for each item
    (Object.entries(parsedMembers) as [MenuItems, string[]][]).forEach(([item, selectedMembers]) => {
      const itemPrice = items.find(i => i.name === item)?.price || 0;
      const membersCount = selectedMembers.length;
      if (membersCount > 0) {
        const pricePerPerson = itemPrice / membersCount;
        selectedMembers.forEach((member: string) => {
          if (member !== "Aiken") {
            bills[member] += pricePerPerson;
          }
        });
      }
    });

    return bills;
  };

  const bills = calculateBills();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settle bills</Text>
        <Text style={styles.subtitle}>Split bills effortlessly</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(bills).map(([member, amount]) => (
          <View key={member} style={styles.personSection}>
            <Text style={styles.personName}>{member}</Text>
            <Text style={styles.owedAmount}>
              {member} owes Aiken ${amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Link href="/home/scan_receipt/view_receipt" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </Link>
        <Link href="/home/scan_receipt" asChild>
          <Pressable style={styles.homeButton}>
            <Text style={styles.homeButtonText}>Home</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Inter',
    flex: 1,
    backgroundColor: "#FEFAE0",
  },
  header: {
    padding: 20,
    paddingLeft: 32,
    paddingBottom: 32,
    backgroundColor: "#283618",
    borderRadius: 32,
  },
  title: {
    marginTop: 70,
    fontSize: 32,
    fontWeight: "600",
    color: "#FEFAE0",
  },
  subtitle: {
    fontSize: 16,
    color: "#606C38",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  personSection: {
    marginBottom: 24,
  },
  personName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#283618",
    marginBottom: 8,
  },
  owedAmount: {
    fontSize: 16,
    color: "#606C38",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  backButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#606C38",
  },
  homeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#606C38",
  },
  backButtonText: {
    color: "#606C38",
    fontSize: 16,
    fontWeight: "500",
  },
  homeButtonText: {
    color: "#FEFAE0",
    fontSize: 16,
    fontWeight: "500",
  },
});
