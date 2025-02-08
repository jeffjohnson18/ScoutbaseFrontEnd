/**
 * Not Found Screen Component
 * Displays a 404-like error page when a route is not found.
 * @module NotFoundScreen
 */

import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

/**
 * NotFoundScreen Component
 * Provides a user-friendly interface when navigating to non-existent routes.
 * Includes navigation option back to home screen.
 * @component
 */
export default function NotFoundScreen() {
  return (
    <>
      {/* Screen header configuration */}
      <Stack.Screen options={{ title: 'Oops!' }} />
      
      {/* Main content container */}
      <ThemedView style={styles.container}>
        {/* Error message */}
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        
        {/* Navigation link back to home */}
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

/**
 * Styles for the NotFoundScreen component
 * Defines the visual appearance of the error page elements
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
