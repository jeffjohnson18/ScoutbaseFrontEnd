/**
 * Registration Screen Component
 * Handles user registration functionality including form input and API integration.
 * @module RegistrationScreen
 */

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

/**
 * RegistrationScreen Component
 * Provides a user interface for new user registration with form validation
 * and API integration for account creation.
 * @component
 */
const RegistrationScreen = () => {
  // State management for form inputs
  const [name, setName] = useState('');
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
   * Handles the registration process
   * Validates form inputs and sends registration request to backend
   * @async
   * @function handleRegister
   */
  const handleRegister = async () => {
    // Form validation
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Send registration request to backend
      const response = await fetch('http://10.0.2.2:8000/scoutbase/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Show success message and redirect to login
      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',
          onPress: () => router.push('/login'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
      console.error(error);
    }
  };

  /**
   * Render the registration form interface
   */
  return (
    <View style={styles.container}>
      <Text style={styles.guidedText}>Create an Account</Text>
      {/* Name input field */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      {/* Email input field */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
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
        secureTextEntry={true}
      />
      {/* Registration submit button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.button}>Continue</Text>
      </TouchableOpacity>     
    </View>
  );
};

/**
 * Styles for the RegistrationScreen component
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
  guidedText: {
    fontFamily: 'IntegralCF-Regular',
    fontSize: 14,
    lineHeight: 30,
    marginBottom: 20,
    alignItems: 'left'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    fontFamily: 'FactoriaMedium',
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
});

export default RegistrationScreen;
