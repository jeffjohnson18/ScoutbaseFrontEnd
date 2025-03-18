import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
  const [error, setError] = useState('');
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
      console.error('Token Error:', error);
      setError('Unable to verify your session. Please try logging in again.');
      setTimeout(() => router.push('/login'), 2000);
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
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }

    if (!userId) {
      await fetchTokenAndDecode();
      if (!userId) {
        setError('Session expired. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/scoutbase/assignrole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: userId,
          role_name: selectedRole,
        }),
      });

      if (response.ok) {
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
        throw new Error(errorData?.message || 'Failed to assign role');
      }
    } catch (error) {
      console.error('Role Assignment Error:', error);
      setError('Unable to set role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render the role selection interface
   */
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Choose Your Role</Text>
        <Text style={styles.welcomeSubtext}>Select the role that best describes you</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.rolesContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            styles.athleteButton,
            selectedRole === 'Athlete' && styles.selectedButton
          ]}
          onPress={() => setSelectedRole('Athlete')}
        >
          <Text style={styles.roleTitle}>Athlete</Text>
          <Text style={styles.roleDescription}>
            For players looking to showcase their skills and connect with coaches and scouts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            styles.coachButton,
            selectedRole === 'Coach' && styles.selectedButton
          ]}
          onPress={() => setSelectedRole('Coach')}
        >
          <Text style={styles.roleTitle}>Coach</Text>
          <Text style={styles.roleDescription}>
            For team leaders who develop talent and guide athletes to their full potential
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            styles.scoutButton,
            selectedRole === 'Scout' && styles.selectedButton
          ]}
          onPress={() => setSelectedRole('Scout')}
        >
          <Text style={styles.roleTitle}>Scout</Text>
          <Text style={styles.roleDescription}>
            For talent evaluators seeking promising athletes for their organizations
          </Text>
        </TouchableOpacity>

        {selectedRole && (
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={assignRole}
            disabled={isLoading}
          >
            <Text style={styles.continueButtonText}>
              {isLoading ? 'Setting up your profile...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Styles for the component
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
  rolesContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 16,
  },
  roleButton: {
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  athleteButton: {
    backgroundColor: '#e63946',
  },
  coachButton: {
    backgroundColor: '#1f8bde',
  },
  scoutButton: {
    backgroundColor: '#495057',
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  roleTitle: {
    fontFamily: 'SupraSans-HeavyOblique',
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  roleDescription: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#1f8bde',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    fontFamily: 'SupraSans-Regular',
    color: 'white',
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 14,
    color: '#e63946',
    textAlign: 'center',
    marginTop: 8,
    padding: 8,
  },
});

export default RoleAssignmentScreen;
