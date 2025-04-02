/**
 * Registration Screen Component
 * Handles user registration functionality including form input and API integration.
 * @module RegistrationScreen
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text, Animated, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const formFadeAnim = React.useRef(new Animated.Value(0)).current;
  const formSlideAnim = React.useRef(new Animated.Value(30)).current;
  const buttonFadeAnim = React.useRef(new Animated.Value(0)).current;

  // Load custom fonts for the application
  const [fontsLoaded] = useFonts({
    'FactoriaBoldItalic': require('../assets/fonts/FactoriaTest-BoldItalic.otf'),
    'FactoriaMediumItalic': require('../assets/fonts/FactoriaTest-MediumItalic.otf'),
    'FactoriaMedium': require('../assets/fonts/FactoriaTest-Medium.otf'),
    'IntegralCF-Regular': require('../assets/fonts/Fontspring-DEMO-integralcf-regular.otf'),
    'SupraSans-Regular': require('../assets/fonts/HvDTrial_SupriaSans-Regular-BF64868e7702378.otf'),
    'SupraSans-HeavyOblique': require('../assets/fonts/HvDTrial_SupriaSans-HeavyOblique-BF64868e75ae1fa.otf'),
  });

  // Setup animations
  useEffect(() => {
    // Welcome message animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Form elements animation
      Animated.parallel([
        Animated.timing(formFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(formSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Button animation based on form completion
    if (name.length > 0 && email.length > 0 && password.length > 0) {
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(buttonFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [name, email, password]);

  // Add login function
  const loginAfterRegistration = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/scoutbase/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const token = data.jwt;

      if (!token) {
        throw new Error('No token found in response');
      }

      router.push('/roleassignment');

    } catch (error) {
      Alert.alert('Error', 'Auto-login failed. Please log in manually.');
      console.error('Login Error:', error);
      router.push('/login');
    }
  };

  /**
   * Handles the registration process
   * Validates form inputs and sends registration request to backend
   * @async
   * @function handleRegister
   */
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:8000/scoutbase/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      await loginAfterRegistration(email, password);

    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Registration failed. Please try again.');
      console.error('Registration Error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1f8bde" />
        <Text style={styles.loadingText}>Logging you in...</Text>
      </View>
    );
  }

  /**
   * Render the registration form interface
   */
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Animated Welcome Message */}
      <Animated.View 
        style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={[styles.welcomeSubtext, { 
          fontSize: 14,
          textAlign: 'center',
          paddingHorizontal: 20,
        }]}>
          Please enter the following details to create an account
        </Text>
      </Animated.View>

      {/* Animated Form Container */}
      <Animated.View 
        style={{
          width: '100%',
          opacity: formFadeAnim,
          transform: [{ translateY: formSlideAnim }],
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 45 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={24} 
              color="#666"
            />
          </Pressable>
        </View>

        {/* Animated Register Button */}
        <Animated.View
          style={{
            opacity: buttonFadeAnim,
            transform: [
              {
                translateY: buttonFadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity 
            style={[
              styles.registerButton,
              { pointerEvents: name.length > 0 && email.length > 0 && password.length > 0 ? 'auto' : 'none' }
            ]} 
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

/**
 * Styles for the RegistrationScreen component
 * Defines the visual appearance of all UI elements
 */
const styles = StyleSheet.create({
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
    fontFamily: 'SupraSans-Regular',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
  },
  backButtonText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    color: '#1f8bde',
  },
  welcomeContainer: {
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
    fontSize: 14, 
    color: '#666',
    textAlign: 'center', 
    paddingHorizontal: 20, 
  },
  registerButton: {
    backgroundColor: '#1f8bde',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontFamily: 'SupraSans-Regular',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#1f8bde',
    fontFamily: 'SupraSans-Regular',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 9
  },
});

export default RegistrationScreen;
