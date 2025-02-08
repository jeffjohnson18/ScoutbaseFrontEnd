import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useFonts } from 'expo-font';

/**
 * RoleAssignmentScreen Component
 * Handles the role selection and assignment process for new users.
 * Allows users to choose between Athlete, Coach, or Scout roles.
 * @component
 */
const RoleAssignmentScreen = () => {
  // State management for role selection, user ID, and loading status
  const [selectedRole, setSelectedRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load custom fonts for the application
  const [fontsLoaded] = useFonts({
    'FactoriaBoldItalic': require('../assets/fonts/FactoriaTest-BoldItalic.otf'),
    'FactoriaMediumItalic': require('../assets/fonts/FactoriaTest-MediumItalic.otf'),
  });

  /**
   * Fetches and decodes the JWT token to get the user ID
   * @async
   * @function fetchTokenAndDecode
   */
  const fetchTokenAndDecode = async () => {
    try {
      // Fetch token from backend
      const response = await fetch('http://10.0.2.2:8000/scoutbase/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve token');
      }

      // Decode token and extract user ID
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

  // Fetch token when component mounts
  useEffect(() => {
    fetchTokenAndDecode();
  }, []);

  /**
   * Handles the role assignment process
   * Sends selected role to backend and redirects user based on role
   * @async
   * @function assignRole
   */
  const assignRole = async () => {
    // Validation checks
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
      // Send role assignment request to backend
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
        // Route user to appropriate creation page based on role
        if (selectedRole === 'Athlete') {
          router.push('/createathlete'); 
        } else if (selectedRole === 'Coach') {
          router.push('/createcoach');
        } else if (selectedRole === 'Scout') {
          router.push('/createscout');
        }
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

  /**
   * Render the role selection interface
   */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scoutbase</Text>
      <Text style={styles.subtitle}>SIGN UP AS</Text>
      {/* Role selection buttons - green when selected, blue when not selected */}
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

// Styles for the component
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
    fontFamily: 'FactoriaBoldItalic',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'FactoriaMediumItalic',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default RoleAssignmentScreen;
