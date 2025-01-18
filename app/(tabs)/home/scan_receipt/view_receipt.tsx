import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export type MenuItems = "Chicken rice" | "Roti Prata" | "Nasi Lemak" | "Teh Bing" | "Bandung";

export const items: { name: MenuItems; price: number }[] = [
  { name: "Chicken rice", price: 5.6 },
  { name: "Roti Prata", price: 4.3 },
  { name: "Nasi Lemak", price: 6.2 },
  { name: "Teh Bing", price: 1.2 },
  { name: "Bandung", price: 1.2 },
];

export default function ViewReceipt() {
  const [activeTab, setActiveTab] = useState("split-by-item");
  const [members, setMembers] = useState<Record<MenuItems, string[]>>(() => {
    const initialMembers: Record<MenuItems, string[]> = {} as Record<MenuItems, string[]>;
    items.forEach(item => {
      initialMembers[item.name] = [];
    });
    return initialMembers;
  });
  const memberOptions = [
    { key: "1", value: "Aiken" },
    { key: "2", value: "Dueet" },
    { key: "3", value: "Charlie" },
  ];

  const [charges, setCharges] = useState({
    gst: false,
    serviceCharge: false,
  });

  const [menuItems, setMenuItems] = useState(items);

  const calculateTotal = () => {
    const subtotal = menuItems.reduce((sum, item) => sum + item.price, 0);
    let total = subtotal;
    
    if (charges.gst) {
      total *= 1.09;
    }
    if (charges.serviceCharge) {
      total *= 1.10;
    }
    
    return total.toFixed(2);
  };

  const truncateMembers = (members: string[]) => {
    if (members.length === 0) return "Select...";
    const text = members.join(", ");
    return text.length > 20 ? text.substring(0, 20) + "..." : text;
  };

  const handleDeleteItem = (itemToDelete: MenuItems) => {
    const updatedMembers = { ...members };
    delete updatedMembers[itemToDelete];
    setMembers(updatedMembers);
    
    setMenuItems(menuItems.filter(item => item.name !== itemToDelete));
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
          <Text style={styles.tableHeaderItem}>Item</Text>
          <Text style={styles.tableHeaderPrice}>Price</Text>
          <Text style={styles.tableHeaderMembers}>Members</Text>
        </View>

        {menuItems.map((item) => (
          <View key={item.name} style={styles.row}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.selectContainer}>
              <Dropdown
                style={[styles.select]}
                data={memberOptions}
                labelField="value"
                valueField="key"
                value=""
                onChange={(selectedMember) => {
                  const currentMembers = members[item.name];
                  const updatedMembers = currentMembers.includes(selectedMember.value)
                    ? currentMembers.filter(m => m !== selectedMember.value)
                    : [...currentMembers, selectedMember.value];
                  setMembers({ ...members, [item.name]: updatedMembers });
                }}
                placeholder={truncateMembers(members[item.name])}
                renderItem={(dropdownItem) => (
                  <View style={[styles.dropdownItem, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={styles.dropdownText}>{dropdownItem.value}</Text>
                    {members[item.name].includes(dropdownItem.value) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                )}
                selectedTextStyle={styles.selectText}
                placeholderStyle={[
                  styles.selectText,
                  members[item.name].length === 0 && { color: '#666' },
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
        ))}

        <View style={styles.divider} />

        <View style={styles.chargesContainer}>
          <View style={styles.chargeRow}>
            <Text style={styles.chargeName}>GST</Text>
            <Text style={styles.chargeValue}>9%</Text>
            <Pressable 
              style={[styles.checkbox, charges.gst && styles.checkedBox]}
              onPress={() => setCharges(prev => ({ ...prev, gst: !prev.gst }))}
            >
              {charges.gst && <Text style={styles.checkboxTick}>✓</Text>}
            </Pressable>
          </View>
          <View style={styles.chargeRow}>
            <Text style={styles.chargeName}>Service Charge</Text>
            <Text style={styles.chargeValue}>10%</Text>
            <Pressable 
              style={[styles.checkbox, charges.serviceCharge && styles.checkedBox]}
              onPress={() => setCharges(prev => ({ ...prev, serviceCharge: !prev.serviceCharge }))}
            >
              {charges.serviceCharge && <Text style={styles.checkboxTick}>✓</Text>}
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
            SC: charges.serviceCharge.toString()
          }
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
  },
  tableHeaderItem: {
    flex: 2,
    color: "#666",
  },
  tableHeaderPrice: {
    flex: 1,
    color: "#666",
  },
  tableHeaderMembers: {
    flex: 2,
    color: "#666",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  itemInfo: {
    flex: 3,
    flexDirection: 'row',
  },
  itemName: {
    flex: 2,
    fontSize: 16,
    color: "#283618",
  },
  itemPrice: {
    flex: 1,
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
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
  },
  selectText: {
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 10,
    textAlignVertical: 'center',
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
    marginLeft: 'auto',
    color: '#4A5D3F',
    fontSize: 16,
  },
  checkedBox: {
    backgroundColor: '#606C38',
    borderColor: '#606C38',
  },
  checkboxTick: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
  },
});
