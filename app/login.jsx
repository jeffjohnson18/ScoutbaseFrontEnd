/**
 * Login Screen Component
 * Handles user authentication and role-based routing.
 * @module LoginScreen
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text, Animated, ActivityIndicator } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter(); 

  // Load custom fonts for the application
  const [fontsLoaded] = useFonts({
    'FactoriaBoldItalic': require('../assets/fonts/FactoriaTest-BoldItalic.otf'),
    'FactoriaMediumItalic': require('../assets/fonts/FactoriaTest-MediumItalic.otf'),
    'FactoriaMedium': require('../assets/fonts/FactoriaTest-Medium.otf'),
    'IntegralCF-Regular': require('../assets/fonts/Fontspring-DEMO-integralcf-regular.otf'),
    'SupraSans-Regular': require('../assets/fonts/HvDTrial_SupriaSans-Regular-BF64868e7702378.otf'),
    'SupraSans-HeavyOblique': require('../assets/fonts/HvDTrial_SupriaSans-HeavyOblique-BF64868e75ae1fa.otf'),
  });

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const formFadeAnim = React.useRef(new Animated.Value(0)).current;
  const formSlideAnim = React.useRef(new Animated.Value(30)).current;
  const buttonFadeAnim = React.useRef(new Animated.Value(0)).current;

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

    // Add effect to handle button animation
    if (email.length > 0 && password.length > 0) {
      // Fade in button when both fields have content
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out button when either field is empty
      Animated.timing(buttonFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [email, password]);

  /**
   * Handles the login process, user role verification, and appropriate routing
   * @async
   * @function handleLogin
   */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true); // Start loading

      const response = await fetch('http://localhost:8000/scoutbase/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      const token = data.jwt;

      if (!token) {
        throw new Error('No token found in response');
      }

      const decodedToken = jwtDecode(token); 
      const userId = decodedToken.id;
      setUserName(decodedToken.name || email.split('@')[0]); // Set user name from token or email

      // Show welcome splash for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      const roleResponse = await fetch(`http://localhost:8000/scoutbase/fetchrole?user_id=${userId}`);
      const roleData = await roleResponse.json();

      if (!roleData.role) {
        router.push('/roleassignment');
      } else {
        let profileResponse;
        let profileData;

        if (roleData.role === 'Athlete') {
          profileResponse = await fetch(`http://localhost:8000/scoutbase/searchforathlete?user_id=${userId}`);
        } else if (roleData.role === 'Coach') {
          profileResponse = await fetch(`http://localhost:8000/scoutbase/searchforcoach?user_id=${userId}`);
        } else if (roleData.role === 'Scout') {
          profileResponse = await fetch(`http://localhost:8000/scoutbase/searchforscout?user_id=${userId}`);
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
          // Profile is complete, proceed to home page without alert
          router.push('/home');
        }
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', `Login failed. Please try again. ${error.message}`);
      console.error('Login Error:', error);
    }
  };
  
  // Add splash screen render
  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Text style={styles.splashWelcome}>Welcome back,</Text>
          <Text style={styles.splashName}>{userName}</Text>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1f8bde" />
            <Text style={styles.loadingText}>Logging you in...</Text>
          </View>
        </View>
      </View>
    );
  }

  /**
   * Render the login form interface
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
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.welcomeSubtext}>Please sign in to continue</Text>
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
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {/* Animated Login Button */}
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
              styles.loginButton,
              { pointerEvents: email.length > 0 && password.length > 0 ? 'auto' : 'none' }
            ]} 
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
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
    fontSize: 16,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#1f8bde',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontFamily: 'SupraSans-Regular',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    padding: 20,
  },
  splashWelcome: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 24,
    color: '#666',
    marginBottom: 8,
  },
  splashName: {
    fontFamily: 'SupraSans-HeavyOblique',
    fontSize: 32,
    color: '#1f8bde',
    marginBottom: 30,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
});

export default LoginScreen;
