import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const AppColors = {
  darkGreen: '#4A5D32',
  lightGreen: '#6B7F4F',
  cream: '#F5F1E6',
};

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const MenuItem = ({ icon, title, description, href }: MenuItemProps) => (
  <Link href={href as any} asChild>
    <Pressable style={styles.menuItem}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.menuItemText}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemDescription}>{description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>   
    </Pressable>
  </Link>
);

// Custom icons using text characters that match the design
const ReceiptIcon = () => (
  <Text style={[styles.icon, { fontSize: 28 }]}>☷</Text>
);

const PencilIcon = () => (
  <Text style={[styles.icon, { fontSize: 26 }]}>✎</Text>
);

const HistoryIcon = () => (
  <Text style={[styles.icon, { fontSize: 26 }]}>↻</Text>
);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Split & Share</Text>
        <Text style={styles.subtitle}>Split bills effortlessly</Text>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon={<ReceiptIcon />}
          title="Scan Receipt"
          description="Scan and split instantly"
          href="/(tabs)/home/scan_receipt"
        />
        <MenuItem
          icon={<PencilIcon />}
          title="Manual Entry"
          description="Enter bill details manually"
          href="/(tabs)/home/manual_input"
        />
        <MenuItem
          icon={<HistoryIcon />}
          title="History"
          description="View past splits"
          href="/(tabs)/home/history"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.cream,
  },
  header: {
    backgroundColor: AppColors.darkGreen,
    padding: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  menuContainer: {
    padding: 16,
    gap: 12,
    marginTop: -20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: AppColors.darkGreen,
  },
  menuItemText: {
    flex: 1,
    gap: 2,
  },
  menuItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  menuItemDescription: {
    fontSize: 14,
    color: AppColors.lightGreen,
  },
  chevron: {
    fontSize: 20,
    color: AppColors.lightGreen,
    marginRight: -4,
  },
}); 