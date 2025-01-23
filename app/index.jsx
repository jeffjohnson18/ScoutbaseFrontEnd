import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { Link } from 'expo-router';  // Use Link for navigation

const { width } = Dimensions.get('window');

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 100,
      }}
    >
      <Text style={{ fontSize: 45, fontFamily: 'Factoria' }}>Scoutbase</Text>
      <View
        style={{
          backgroundColor: '#9c0b0b',
          paddingVertical: 10,
          paddingHorizontal: 20,
          width: width * 0.75,
          alignSelf: 'center',
          marginTop: 20,
        }}
      >
        <Link href="/login" style={{ color: 'white', fontFamily: 'Factoria', fontSize: 20, textAlign: 'center' }}>
          Login
        </Link>
      </View>
      <View
        style={{
          backgroundColor: '#1f8bde',
          paddingVertical: 10,
          paddingHorizontal: 20,
          width: width * 0.75,
          alignSelf: 'center',
          marginTop: 10,
        }}
      >
        <Link href="/register" style={{ color: 'white', fontFamily: 'Factoria', fontSize: 20, textAlign: 'center' }}>
          Register
        </Link>
      </View>
    </View>
  );
}
