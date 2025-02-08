/**
 * Login Screen Component
 * Handles user authentication and role-based routing.
 * @module LoginScreen
 */

import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; 
import { jwtDecode } from 'jwt-decode';
import { useFonts } from 'expo-font';

/**
 * LoginScreen Component
 * Provides user authentication interface and handles login flow including
 * role verification and profile completion checks.
 * @component
 */
const LoginScreen = () => {
  // State management for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  // Load custom fonts for the application
  const [fontsLoaded] = useFonts({
    'FactoriaBoldItalic': require('../assets/fonts/FactoriaTest-BoldItalic.otf'),
    'FactoriaMediumItalic': require('../assets/fonts/FactoriaTest-MediumItalic.otf'),
    'FactoriaMedium': require('../assets/fonts/FactoriaTest-Medium.otf'),
    'IntegralCF-Regular': require('../assets/fonts/Fontspring-DEMO-integralcf-regular.otf'),
  });

  /**
   * Handles the login process, user role verification, and appropriate routing
   * @async
   * @function handleLogin
   */
  const handleLogin = async () => {
    // Form validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
  
    try {
      // Attempt user authentication
      const response = await fetch('http://10.0.2.2:8000/scoutbase/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login');
      }
  
      // Extract and validate JWT token
      const data = await response.json();
      const token = data.jwt;
  
      if (!token) {
        throw new Error('No token found in response');
      }
  
      // Decode token to get user information
      const decodedToken = jwtDecode(token); 
      const userId = decodedToken.id;
  
      // Step 1: Fetch and verify user's role
      const roleResponse = await fetch(`http://10.0.2.2:8000/scoutbase/fetchrole?user_id=${userId}`);
      const roleData = await roleResponse.json();
  
      if (!roleData.role) {
        // If no role is assigned, redirect to role assignment
        router.push('/roleassignment');
      } else {
        // Step 2: Fetch user's profile based on their role
        let profileResponse;
        let profileData;
  
        // Make appropriate API call based on user role
        if (roleData.role === 'Athlete') {
          profileResponse = await fetch(`http://10.0.2.2:8000/scoutbase/searchforathlete?user_id=${userId}`);
        } else if (roleData.role === 'Coach') {
          profileResponse = await fetch(`http://10.0.2.2:8000/scoutbase/searchforcoach?user_id=${userId}`);
        } else if (roleData.role === 'Scout') {
          profileResponse = await fetch(`http://10.0.2.2:8000/scoutbase/searchforscout?user_id=${userId}`);
        }
  
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }
  
        profileData = await profileResponse.json();
  
        // Step 3: Check profile completion status
        const isProfileComplete = Object.values(profileData).some(value => value !== null && value !== '');
        
        // Route user based on profile completion status
        if (!isProfileComplete) {
          // Redirect to appropriate profile creation page
          if (roleData.role === 'Athlete') {
            router.push('/createathlete');
          } else if (roleData.role === 'Coach') {
            router.push('/createcoach');
          } else if (roleData.role === 'Scout') {
            router.push('/createscout');
          }
        } else {
          // Profile is complete, proceed to home page
          Alert.alert('Success', 'Login successful!');
          router.push('/home');
        }
      }
    } catch (error) {
      Alert.alert('Error', `Login failed. Please try again. ${error.message}`);
      console.error('Login Error:', error);
    }
  };
  
  /**
   * Render the login form interface
   */
  return (
    <View style={styles.container}>
      {/* Email input field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {/* Password input field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* Login submit button */}
      <Button title="Login" style={styles.button} onPress={handleLogin} />
    </View>
  );
};

/**
 * Styles for the LoginScreen component
 * Defines the visual appearance of all UI elements
 */
const styles = StyleSheet.create({
  button: {
    fontFamily: 'IntegralCF-Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 13,
    backgroundColor: '#1f8bde',
    paddingVertical: 5,
    paddingHorizontal: 20,
    color: 'white',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    fontFamily: 'FactoriaMedium',
  },
});

export default LoginScreen;
