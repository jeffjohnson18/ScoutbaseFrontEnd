import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Use this hook for navigation
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize the router

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
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

      const data = await response.json();
      const token = data.jwt;

      if (!token) {
        throw new Error('No token found in response');
      }

      const decodedToken = jwtDecode(token); // Decode the JWT to extract user info
      const userId = decodedToken.id;

      // Check if the user has a role assigned
      const roleResponse = await fetch(`http://10.0.2.2:8000/scoutbase/fetchrole?user_id=${userId}`);
      const roleData = await roleResponse.json();

      // If no role is assigned, navigate to the RoleAssignment screen
      if (!roleData.role) {
        router.push('/roleassignment'); // No need to include userId
      } else {
        Alert.alert('Success', 'Login successful!');
        // Navigate to next screen, e.g., home or dashboard
        // router.push('/home');
      }
      
    } catch (error) {
      Alert.alert('Error', `Login failed. Please try again. ${error.message}`);
      console.error('Login Error:', error);
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Login" onPress={handleLogin} />
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
  input: {
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

export default LoginScreen;
