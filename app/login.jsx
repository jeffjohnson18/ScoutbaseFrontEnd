import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; 
import { jwtDecode } from 'jwt-decode';

const LoginScreen = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

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
  
      const decodedToken = jwtDecode(token); 
      const userId = decodedToken.id;
  
      // Step 1: Check user's role
      const roleResponse = await fetch(`http://10.0.2.2:8000/scoutbase/fetchrole?user_id=${userId}`);
      const roleData = await roleResponse.json();
  
      if (!roleData.role) {
        router.push('/roleassignment');
      } else {
        // Step 2: Fetch the user's profile based on their role
        let profileResponse;
        let profileData;
  
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
  
        // Step 3: Check if profile attributes are null
        const isProfileComplete = Object.values(profileData).some(value => value !== null && value !== '');
        
        if (!isProfileComplete) {
          if (roleData.role === 'Athlete') {
            router.push('/createathlete');
          } else if (roleData.role === 'Coach') {
            router.push('/createcoach');
          } else if (roleData.role === 'Scout') {
            router.push('/createscout');
          }
        } else {
          // Profile is complete, navigate to home page
          Alert.alert('Success', 'Login successful!');
          router.push('/home');
        }
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
