import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Use this hook for navigation

const RoleAssignmentScreen = ({ route }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign a Role</Text>

      <Button title="Athlete" onPress={() => {}} />
      <Button title="Coach" onPress={() => {}} />
      <Button title="Scout" onPress={() => {}} />

      <View style={styles.buttonContainer}>
        <Button title="Assign Role" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default RoleAssignmentScreen;
