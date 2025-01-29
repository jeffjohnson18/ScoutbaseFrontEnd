import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity , Alert, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  const [fontsLoaded] = useFonts({
    'FactoriaBoldItalic': require('../assets/fonts/FactoriaTest-BoldItalic.otf'),
    'FactoriaMediumItalic': require('../assets/fonts/FactoriaTest-MediumItalic.otf'),
    'FactoriaMedium': require('../assets/fonts/FactoriaTest-Medium.otf'),
    'IntegralCF-Regular': require('../assets/fonts/Fontspring-DEMO-integralcf-regular.otf'),
  });

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
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

  return (
    <View style={styles.container}>
      <Text style={styles.guidedText}>Create an Account</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.button}>Continue</Text>
      </TouchableOpacity>     
    </View>
  );
};

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
