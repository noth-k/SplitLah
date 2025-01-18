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

interface Member {
  name: string;
}

function ScanReceipt() {
  const router = useRouter();
  const [payerInput, setPayerInput] = useState("");
  const [payeeInput, setPayeeInput] = useState("");
  const [payer, setPayer] = useState<Member | null>(null);
  const [payees, setPayees] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleAddPayer = () => {
    if (payerInput.trim() === "") {
      setError("Name cannot be empty");
      return;
    }
    setPayer({ name: payerInput.trim() });
    setPayerInput("");
    setError(null);
  };

  const handleAddPayee = () => {
    if (payeeInput.trim() === "") {
      setError("Name cannot be empty");
      return;
    }
    if (payees.some((payee) => payee.name === payeeInput)) {
      setError("Name already exists");
      return;
    }
    if (payer?.name === payeeInput) {
      setError("Payee cannot be the same as payer");
      return;
    }
    setPayees([...payees, { name: payeeInput.trim() }]);
    setPayeeInput("");
    setError(null);
  };

  const handleScanReceipt = () => {
    if (!payer) {
      setError("Please add a payer");
      return;
    }
    if (payees.length === 0) {
      setError("Please add at least one payee");
      return;
    }
    router.push({
      pathname: "/home/scan_receipt/camera",
      params: {
        payer: payer.name,
        payees: JSON.stringify(payees.map(p => p.name))
      }
    });
  };

  const handleDeletePayee = (nameToDelete: string) => {
    setPayees(payees.filter(payee => payee.name !== nameToDelete));
  };

  const handleEditPayer = () => {
    if (payer) {
      setPayerInput(payer.name);
      setPayer(null);
    }
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
          {payer ? (
            <View style={styles.memberRow}>
              <View style={styles.memberInfo}>
                <Ionicons name="person-circle-outline" size={30} color="#333" />
                <Text style={styles.interMemberName}>{payer.name}</Text>
              </View>
              <View style={styles.memberActions}>
                <TouchableOpacity onPress={handleEditPayer}>
                  <Ionicons name="pencil" size={20} color="#606C38" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-circle-outline" size={30} color="#333" />
                <TextInput
                  style={styles.interInput}
                  placeholder="Enter Payer Name..."
                  value={payerInput}
                  onChangeText={setPayerInput}
                />
              </View>
              <TouchableOpacity
                style={styles.addMemberButton}
                onPress={handleAddPayer}
              >
                <Text style={styles.interButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.interSectionTitle}>Payee(s)</Text>
          {payees.map((payee) => (
            <View style={styles.memberRow} key={payee.name}>
              <View style={styles.memberInfo}>
                <Ionicons name="person-circle-outline" size={30} color="#333" />
                <Text style={styles.interMemberName}>{payee.name}</Text>
              </View>
              <View style={styles.memberActions}>
                <TouchableOpacity 
                  onPress={() => {
                    setPayeeInput(payee.name);
                    handleDeletePayee(payee.name);
                  }}
                >
                  <Ionicons name="pencil" size={20} color="#606C38" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePayee(payee.name)}>
                  <Ionicons name="trash-outline" size={20} color="#606C38" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-circle-outline" size={30} color="#333" />
              <TextInput
                style={styles.interInput}
                placeholder="Enter Payee Name..."
                value={payeeInput}
                onChangeText={setPayeeInput}
              />
            </View>
            <TouchableOpacity
              style={styles.addMemberButton}
              onPress={handleAddPayee}
            >
              <Text style={styles.interButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <Animated.Text style={[styles.errorText, animatedStyle]}>
            {error}
          </Animated.Text>
        )}
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
    padding: 20,
    paddingLeft: 32,
    paddingBottom: 32,
    borderRadius: 32,
    marginBottom: 30,
    backgroundColor: "#283618",
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
    justifyContent: 'space-between',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 15,
    paddingRight: 5,
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
    backgroundColor: "#606C38",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  interButtonText: {
    color: "#FEFAE0",
    fontSize: 14,
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
    flex: 1,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    color: "red",
    marginVertical: 10,
    paddingLeft: 20,
  },
});

export default ScanReceipt;
