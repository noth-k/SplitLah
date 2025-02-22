import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

export type MenuItem = {
  name: string;
  price: number;
};

export default function ViewReceipt() {
  const {
    payer,
    payees: payeesJson,
    items: itemsJson,
    hasGst,
    hasServiceCharge,
  } = useLocalSearchParams<{
    payer: string;
    payees: string;
    items: string;
    hasGst: string;
    hasServiceCharge: string;
  }>();

  console.log("Received params:", {
    payer,
    payeesJson,
    itemsJson,
    hasGst,
    hasServiceCharge,
  });

  const payeesList = payeesJson ? (JSON.parse(payeesJson) as string[]) : [];
  const itemsData = itemsJson ? JSON.parse(itemsJson) : {};

  const memberOptions = [
    { key: "0", value: payer },
    ...payeesList.map((name, index) => ({
      key: (index + 1).toString(),
      value: name,
    })),
  ];

  console.log("Member options:", memberOptions);

  const [activeTab, setActiveTab] = useState("split-by-item");
  const [members, setMembers] = useState<Record<string, string[]>>(() => {
    const initialMembers: Record<string, string[]> = {} as Record<
      string,
      string[]
    >;
    Object.keys(itemsData).forEach((item) => {
      initialMembers[item] = [];
    });
    return initialMembers;
  });

  const [charges, setCharges] = useState({
    gst: false,
    serviceCharge: false,
  });

  const [menuItems, setMenuItems] = useState(() => {
    return Object.entries(itemsData).map(([name, price]) => ({
      name: name as string,
      price: Number(price),
    }));
  });

  const calculateTotal = () => {
    const subtotal = menuItems.reduce((sum, item) => sum + item.price, 0);
    let total = subtotal;

    if (charges.gst) {
      total *= 1.09;
    }
    if (charges.serviceCharge) {
      total *= 1.1;
    }

    return total.toFixed(2);
  };

  const truncateMembers = (members: string[]) => {
    if (members.length === 0) return "Select...";
    const text = members.join(", ");
    return text.length > 20 ? text.substring(0, 20) + "..." : text;
  };

  const handleDeleteItem = (itemToDelete: string) => {
    const updatedMembers = { ...members };
    delete updatedMembers[itemToDelete];
    setMembers(updatedMembers);

    setMenuItems(menuItems.filter((item) => item.name !== itemToDelete));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>View receipt</Text>
        <Text style={styles.subtitle}>Edit details</Text>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "split-evenly" && styles.activeTab]}
          onPress={() => setActiveTab("split-evenly")}
        >
          <Text style={styles.tabText}>Split evenly</Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === "split-by-item" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("split-by-item")}
        >
          <Text style={styles.tabText}>Split by item</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderItem, { flex: 3 }]}>Item</Text>
          <Text style={[styles.tableHeaderPrice, { flex: 2, paddingLeft: 10 }]}>
            Price
          </Text>
          <Text style={[styles.tableHeaderMembers, { flex: 3 }]}>Members</Text>
        </View>

        {menuItems.map((item) => (
          <View key={item.name} style={styles.row}>
            <Text style={[styles.itemName, { flex: 3 }]}>{item.name}</Text>
            <Text style={[styles.itemPrice, { flex: 2, paddingLeft: 10 }]}>
              {item.price.toFixed(2)}
            </Text>
            <View style={{ flex: 3, flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Dropdown
                  style={[styles.select]}
                  data={memberOptions}
                  labelField="value"
                  valueField="value"
                  value=""
                  onChange={(selectedMember) => {
                    const currentMembers = members[item.name];
                    const updatedMembers = currentMembers.includes(
                      selectedMember.value
                    )
                      ? currentMembers.filter((m) => m !== selectedMember.value)
                      : [...currentMembers, selectedMember.value];
                    setMembers({ ...members, [item.name]: updatedMembers });
                  }}
                  placeholder={truncateMembers(members[item.name])}
                  renderItem={(dropdownItem) => (
                    <View
                      style={[
                        styles.dropdownItem,
                        { flexDirection: "row", alignItems: "center" },
                      ]}
                    >
                      <Text style={styles.dropdownText}>
                        {dropdownItem.value}
                      </Text>
                      {members[item.name].includes(dropdownItem.value) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  )}
                  selectedTextStyle={styles.selectText}
                  placeholderStyle={[
                    styles.selectText,
                    members[item.name].length === 0 && { color: "#666" },
                  ]}
                  containerStyle={styles.dropdown}
                />
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteItem(item.name)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#606C38" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.chargesContainer}>
          <View style={styles.chargeRow}>
            <Text style={styles.chargeName}>GST</Text>
            <Text style={styles.chargeValue}>9%</Text>
            <Pressable
              style={[styles.checkbox, charges.gst && styles.checkedBox]}
              onPress={() =>
                setCharges((prev) => ({ ...prev, gst: !prev.gst }))
              }
            >
              {charges.gst && <Text style={styles.checkboxTick}>✓</Text>}
            </Pressable>
          </View>
          <View style={styles.chargeRow}>
            <Text style={styles.chargeName}>Service Charge</Text>
            <Text style={styles.chargeValue}>10%</Text>
            <Pressable
              style={[
                styles.checkbox,
                charges.serviceCharge && styles.checkedBox,
              ]}
              onPress={() =>
                setCharges((prev) => ({
                  ...prev,
                  serviceCharge: !prev.serviceCharge,
                }))
              }
            >
              {charges.serviceCharge && (
                <Text style={styles.checkboxTick}>✓</Text>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${calculateTotal()}</Text>
        </View>
      </ScrollView>

      <Link
        href={{
          pathname: "/home/scan_receipt/view_bill",
          params: {
            members: JSON.stringify(members),
            total: calculateTotal(),
            GST: charges.gst.toString(),
            SC: charges.serviceCharge.toString(),
            payer: payer,
            payees: JSON.stringify(payeesList),
            items: JSON.stringify(itemsData),
          },
        }}
        asChild
      >
        <Pressable style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </Link>
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
  tabContainer: {
    paddingTop: 20,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#606C38",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#283618",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tableHeader: {
    flexDirection: "row",
    marginBottom: 10,
    paddingRight: 40,
  },
  tableHeaderItem: {
    color: "#666",
  },
  tableHeaderPrice: {
    color: "#666",
  },
  tableHeaderMembers: {
    color: "#666",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  itemInfo: {
    flex: 3,
    flexDirection: "row",
  },
  itemName: {
    fontSize: 16,
    color: "#283618",
  },
  itemPrice: {
    fontSize: 16,
    color: "#283618",
  },
  selectContainer: {
    flex: 2,
  },
  select: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#606C38",
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  dropdown: {
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
  },
  selectText: {
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 10,
    textAlignVertical: "center",
    flex: 1,
  },
  arrowIcon: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  chargesContainer: {
    marginBottom: 20,
  },
  chargeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chargeName: {
    flex: 2,
    fontSize: 16,
  },
  chargeValue: {
    flex: 1,
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#4A5D3F",
    borderRadius: 4,
    marginLeft: "auto",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#606C38",
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  checkmark: {
    marginLeft: "auto",
    color: "#4A5D3F",
    fontSize: 16,
  },
  checkedBox: {
    backgroundColor: "#606C38",
    borderColor: "#606C38",
  },
  checkboxTick: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  deleteButton: {
    padding: 8,
  },
});
