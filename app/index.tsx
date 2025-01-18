import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppColors = {
  darkGreen: '#283618',
  green : '#606C38',
  lightGreen: '#6B7F4F',
  cream: '#F5F1E6',
  lightBrown: '#D2B48C',
  darkBrown: '#8B4513',
};

export default function LandingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>SplitLah!</Text>
      <View style={styles.mainContent}>
        <Text style={styles.heading}>Split bills</Text>
        <Text style={styles.heading}>seamlessly</Text>
      </View>
      <Link href="./(tabs)/home" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.cream,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    color: AppColors.darkBrown,
    fontStyle: 'italic',
    fontFamily: 'Georgia',
    marginTop:10
  },
  mainContent: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 36,
    color: AppColors.darkGreen,
    fontWeight: '600',
    fontFamily: 'Inter',

  },
  dottedLine: {
    height: 200,
    width: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: AppColors.lightGreen,
    marginVertical: 20,
  },
  button: {
    backgroundColor: AppColors.green,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '80%',
    marginBottom:10
  },
  buttonText: {
    color: AppColors.cream,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Inter',

  },
}); 