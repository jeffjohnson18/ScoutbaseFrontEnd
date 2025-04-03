/**
 * Create Scout Profile Component
 * Handles the initial profile creation for scout users.
 * This component provides an interface for creating a new scout profile after role assignment.
 * 
 * @module CreateScoutProfile
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

/**
 * CreateScoutProfileScreen Component
 * Provides the user interface for creating a new scout profile.
 * 
 * @component
 */
const CreateScoutProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const router = useRouter();

  /**
   * Fetches and decodes user token on component mount
   * 
   * @async
   * @function fetchTokenAndDecode
   */
  useEffect(() => {
    fetchTokenAndDecode();
  }, []);

  /**
   * Retrieves and decodes JWT token to get user ID
   * 
   * @async
   * @function fetchTokenAndDecode
   */
  const fetchTokenAndDecode = async () => {
    try {
      const response = await fetch('http://localhost:8000/scoutbase/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve token');
      }

      const token = await response.text();
      const decodedToken = jwtDecode(token);

      if (decodedToken?.id) {
        setUserId(decodedToken.id);
        setError('');
      } else {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      setError('Session expired. Please log in again.');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  /**
   * Handles the scout profile creation process
   * Validates user ID and sends request to backend
   * 
   * @async
   * @function handleCreateProfile
   */
  const handleCreateProfile = async () => {
    if (!userId) {
      setError('Unable to create profile. Please try logging in again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/scoutbase/scout/createprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create scout profile');
      }

      setIsLoading(false);
      // Show splash screen
      setShowSplash(true);
      // Wait 2 seconds then navigate to home page
      setTimeout(() => {
        router.push('/home'); // Redirect to home page
      }, 2000);

    } catch (error) {
      setIsLoading(false);
      setError(error.message || 'Failed to create profile');
    }
  };

  /**
   * Render the profile creation interface
   */
  return (
    <View style={styles.container}>
      {showSplash ? (
        <View style={styles.splashContainer}>
          <Text style={styles.splashText}>Profile Created!</Text>
          <Text style={styles.splashSubtext}>Redirecting to home page...</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Create Scout Profile</Text>
            <Text style={styles.welcomeSubtext}>Start discovering talent</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.contentContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleCreateProfile}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Profile...' : 'Create Scout Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    color: '#1f8bde',
  },
  welcomeContainer: {
    marginTop: 100,
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'SupraSans-HeavyOblique',
    fontSize: 32,
    color: '#1f8bde',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 14,
    color: '#e63946',
    textAlign: 'center',
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#1f8bde',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontFamily: 'SupraSans-Regular',
    color: 'white',
    fontSize: 16,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  splashText: {
    fontFamily: 'SupraSans-HeavyOblique',
    fontSize: 32,
    color: '#1f8bde',
    marginBottom: 16,
  },
  splashSubtext: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 18,
    color: '#666',
  },
});

export default CreateScoutProfileScreen;
