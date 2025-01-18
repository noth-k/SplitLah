import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, LinkProps } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AppColors = {
  darkGreen: '#283618',
  lightGreen: '#606C38',
  cream: '#F5F1E6',
  arrow:'#606C38'
};

interface MenuItemProps {
  icon: string;
  title: string;
  description: string;
  href: LinkProps['href'];
}

const MenuItem = ({ icon, title, description, href }: MenuItemProps) => (
  <Link href={href} asChild>
    <Pressable style={styles.menuItem}>
      <Icon name={icon} size={35} color={AppColors.darkGreen} style={styles.icon} />
      <View style={styles.menuItemText}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemDescription}>{description}</Text>
      </View>
      <Icon name="chevron-right" size={40} color={AppColors.arrow} />
    </Pressable>
  </Link>
);

export default function HomeScreen() {

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Split & Share</Text>
        <Text style={styles.subtitle}>Split bills effortlessly</Text>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon="receipt"
          title="Scan Receipt"
          description="Scan and split instantly"
          href="/home/scan_receipt"
        />
        <MenuItem
          icon="edit"
          title="Manual Entry"
          description="Enter bill details manually"
          href="/home/manual_input"
        />
        <MenuItem
          icon="history"
          title="History"
          description="View past splits"
          href="/home/scan_receipt"
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
    marginBottom:50,
    paddingTop:70,
    paddingLeft:20,
    fontFamily: 'Inter',

  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: AppColors.cream,
    marginBottom: 4,
    fontFamily: 'Inter',

  },
  subtitle: {
    fontSize: 16,
    color: '#7A8748',
    opacity: 0.8,
    fontFamily: 'Inter',

  },
  menuContainer: {
    padding: 16,
    gap: 40,
    marginTop: -20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:AppColors.cream,
    borderWidth:1,
    borderColor:AppColors.darkGreen,
    
    padding: 23,
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
  icon: {
    width: 32,
    height: 32,
    paddingRight:40
  },
  menuItemText: {
    flex: 1,
    gap: 2,
  },
  menuItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.darkGreen,
    fontFamily: 'Inter',

  },
  menuItemDescription: {
    fontSize: 14,
    color: AppColors.lightGreen,
    fontFamily: 'Inter',

  },
}); 