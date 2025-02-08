/**
 * Create Scout Profile Component
 * Handles the initial profile creation for scout users.
 * @module CreateScoutProfile
 */

import React, { useState, useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

/**
 * CreateScoutProfileScreen Component
 * Provides interface for creating a new scout profile after role assignment.
 * Currently implements basic profile creation with user ID verification.
 * @component
 */
const CreateScoutProfileScreen = () => {
  // State management for user identification
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  /**
   * Fetches and decodes user token on component mount
   * @async
   * @function fetchTokenAndDecode
   */
  useEffect(() => {
    fetchTokenAndDecode();
  }, []);

  /**
   * Retrieves and decodes JWT token to get user ID
   * @async
   * @function fetchTokenAndDecode
   */
  const fetchTokenAndDecode = async () => {
    try {
      // Fetch user token from backend
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

  /**
   * Handles the scout profile creation process
   * @async
   * @function handleCreateProfile
   */
  const handleCreateProfile = async () => {
    // Validate user ID presence
    if (!userId) {
      Alert.alert('Error', 'User ID is missing.');
      return;
    }

    const profileData = {
      user_id: userId,
    };

    try {
      // Send profile creation request to backend
      const response = await fetch('http://10.0.2.2:8000/scoutbase/scout/createprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to create scout profile.');
      }

      Alert.alert('Success', 'Scout profile created successfully!');
      router.push('/home');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create profile.');
      console.error(error);
    }
  };

  /**
   * Render the profile creation interface
   */
  return (
    <View style={styles.container}>
      {/* Profile creation button */}
      <Button title="Create Scout Profile" onPress={handleCreateProfile} />
    </View>
  );
};

/**
 * Styles for the CreateScoutProfileScreen component
 * Defines the visual appearance of all UI elements
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default CreateScoutProfileScreen;
