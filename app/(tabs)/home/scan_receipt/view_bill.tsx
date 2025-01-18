import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";

type BillSummary = {
  [key: string]: number;
};

export default function ViewBill() {
  const {
    members,
    total,
    GST,
    SC,
    payer,
    payees: payeesJson,
    items,
  } = useLocalSearchParams<{
    members: string;
    total: string;
    GST: string;
    SC: string;
    payer: string;
    payees: string;
    items: string;
  }>();

  const parsedMembers = members
    ? (JSON.parse(members) as Record<string, string[]>)
    : {};
  const payeesList = payeesJson ? (JSON.parse(payeesJson) as string[]) : [];
  const itemsData = items ? (JSON.parse(items) as Record<string, number>) : {};
  const router = useRouter();

  const handleBack = () => {
    router.setParams({
      payer: payer,
      payees: payeesJson,
      items: JSON.stringify(itemsData),
    });
    router.back();
  };

  const calculateBills = (): BillSummary => {
    const bills: BillSummary = {};

    // Initialize bills for each payee
    payeesList.forEach((payee: string) => {
      bills[payee] = 0;
    });

    // Calculate amount per person for each item
    (Object.entries(parsedMembers) as [string, string[]][]).forEach(
      ([item, selectedMembers]) => {
        const itemPrice = itemsData[item] || 0;
        const membersCount = selectedMembers.length;
        if (membersCount > 0) {
          let pricePerPerson = itemPrice / membersCount;

          // Apply GST and service charge
          if (GST === "true") {
            pricePerPerson *= 1.09;
          }
          if (SC === "true") {
            pricePerPerson *= 1.1;
          }

          selectedMembers.forEach((member: string) => {
            if (member !== payer) {
              // Use payer instead of hardcoded "Aiken"
              bills[member] = (bills[member] || 0) + pricePerPerson;
            }
          });
        }
      }
    );

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
        <Text style={styles.payerText}>Pay to {payer}</Text>
        {Object.entries(bills)
          .filter(([member]) => member !== payer && bills[member] > 0)
          .map(([member, amount]) => (
            <View key={member} style={styles.personSection}>
              <Text style={styles.personName}>{member}</Text>
              <Text style={styles.owedAmount}>owes ${amount.toFixed(2)}</Text>
            </View>
          ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Link href="/home" asChild>
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
    fontFamily: "Inter",
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
    marginBottom: 4,
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
  payerText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#606C38",
    marginBottom: 20,
  },
});
