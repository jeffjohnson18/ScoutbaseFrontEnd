import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';

const RoleAssignmentScreen = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTokenAndDecode = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/scoutbase/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve token');
      }

      const token = await response.text(); 
      const decodedToken = jwtDecode(token);

      if (decodedToken?.id) {
        setUserId(decodedToken.id);
      } else {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to retrieve or decode token.');
    }
  };

  useEffect(() => {
    fetchTokenAndDecode();
  }, []);

  const assignRole = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role before assigning.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://10.0.2.2:8000/scoutbase/assignrole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          role_name: selectedRole,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', `Role "${selectedRole}" assigned successfully!`);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData?.message || 'Failed to assign role.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while assigning the role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign a Role</Text>

      <Button
        title="Athlete"
        onPress={() => setSelectedRole('Athlete')}
        color={selectedRole === 'Athlete' ? '#4caf50' : '#2196f3'}
      />
      <Button
        title="Coach"
        onPress={() => setSelectedRole('Coach')}
        color={selectedRole === 'Coach' ? '#4caf50' : '#2196f3'}
      />
      <Button
        title="Scout"
        onPress={() => setSelectedRole('Scout')}
        color={selectedRole === 'Scout' ? '#4caf50' : '#2196f3'}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? 'Assigning...' : 'Assign Role'}
          onPress={assignRole}
          disabled={isLoading}
        />
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
