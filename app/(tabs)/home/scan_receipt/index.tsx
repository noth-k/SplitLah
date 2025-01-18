import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

interface Payee {
  name: string;
}

function ScanReceipt() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [payees, setPayees] = useState<Payee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleAddPayee = () => {
    if (name.trim() === "") {
      setError("Name cannot be empty");
      return;
    }
    if (payees.some((payee) => payee.name === name)) {
      setError("Name already exists");
      return;
    }
    setPayees([...payees, { name }]);
    setName("");
    setError(null);
  };

  const handleScanReceipt = () => {
    if (payees.length === 0) {
      setError("Please add at least one payee");
      return;
    }
    router.push("/home/scan_receipt/camera");
  };

  useEffect(() => {
    if (error) {
      opacity.value = withTiming(1);
      const timer = setTimeout(() => {
        opacity.value = withTiming(0);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.interTitle}>Add members</Text>
          <Text style={styles.interSubtitle}>Split bills effortlessly</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.interSectionTitle}>Payer</Text>
          <View style={styles.memberRow}>
            <Ionicons name="person-circle-outline" size={30} color="#333" />
            <Text style={styles.interMemberName}>Aiken</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.interSectionTitle}>Payee(s)</Text>
          {payees.map((payee) => (
            <View style={styles.memberRow} key={payee.name}>
              <Ionicons name="person-circle-outline" size={30} color="#333" />
              <Text style={styles.interMemberName}>{payee.name}</Text>
            </View>
          ))}
          <View style={styles.inputContainer}>
            <Ionicons name="person-circle-outline" size={30} color="#333" />
            <TextInput
              style={styles.interInput}
              placeholder="Enter Name..."
              value={name}
              onChangeText={setName}
              
            />
          </View>

          {error && (
            <Animated.Text style={[styles.errorText, animatedStyle]}>
              {error}
            </Animated.Text>
          )}

          <TouchableOpacity
            style={styles.addMemberButton}
            onPress={handleAddPayee}
          >
            <Text style={styles.interButtonText}>+ Add Member</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.scanButton} onPress={handleScanReceipt}>
        <Text style={styles.interScanText}>Scan my receipt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FEFAE0",
  },
  container: {
    flex: 1,
    backgroundColor: "#FEFAE0",
  },
  header: {
    marginBottom: 30,
    backgroundColor: "#283618",
    borderRadius: 12,
    padding: 20,
  },
  interTitle: {
    fontFamily: "Inter",
    fontSize: 32,
    marginTop: 70,
    fontWeight: "700",
    color: "#FEFAE0",
  },
  interSubtitle: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    color: "#FEFAE0",
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
    padding: 20,
  },
  endSection: {
    padding: 20,
  },
  interSectionTitle: {
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  interMemberName: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 10,
    color: "#333",
  },
  interPlaceholder: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "400",
    color: "#999",
  },
  addMemberButton: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  interButtonText: {
    fontFamily: "Inter",
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  scanButton: {
    backgroundColor: "#606C38",
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  interScanText: {
    fontFamily: "Inter",
    color: "#FEFAE0",
    fontSize: 16,
    fontWeight: "500",
  },
  interInput: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 10,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  errorText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    color: "red",
    marginVertical: 10,
  },
});

export default ScanReceipt;
