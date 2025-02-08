/**
 * Home/Landing Screen Component
 * Initial entry point of the application displaying the main logo and authentication options.
 * @module HomeScreen
 */

import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

// Get device window width for responsive layouts
const { width } = Dimensions.get('window');

/**
 * Home Component
 * Displays the Scoutbase logo and provides navigation options for login and registration.
 * @component
 */
export default function Home() {
  // Load custom fonts for the application
  const [fontsLoaded] = useFonts({
    'FactoriaBoldItalic': require('../assets/fonts/FactoriaTest-BoldItalic.otf'),
    'FactoriaMediumItalic': require('../assets/fonts/FactoriaTest-MediumItalic.otf'),
    'FactoriaMedium': require('../assets/fonts/FactoriaTest-Medium.otf'),
    'IntegralCF-Regular': require('../assets/fonts/Fontspring-DEMO-integralcf-regular.otf'),
  });

  /**
   * Render the home screen interface
   */
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 100,
      }}
    >
      {/* Application Logo */}
      <Text style={{ fontSize: 45, fontFamily: 'FactoriaBoldItalic', lineHeight: 40 }}>
        <Text style={{ color: 'black' }}>Scout</Text>
        <Text style={{ color: '#1f8bde' }}>base</Text>
      </Text>

      {/* Login Button */}
      <View
        style={{
          backgroundColor: '#9c0b0b',
          paddingVertical: 10,
          paddingHorizontal: 20,
          width: width * 0.75,
          alignSelf: 'center',
          marginTop: 50,
        }}
      >
        <Link 
          href="/login" 
          style={{ 
            color: 'white', 
            fontFamily: 'FactoriaMediumItalic', 
            fontSize: 20, 
            textAlign: 'center', 
            lineHeight: 30 
          }}
        >
          Login
        </Link>
      </View>

      {/* Register Button */}
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
        <Link 
          href="/register" 
          style={{ 
            color: 'white', 
            fontFamily: 'FactoriaMediumItalic', 
            fontSize: 20, 
            textAlign: 'center', 
            lineHeight: 30 
          }}
        >
          Register
        </Link>
      </View>
    </View>
  );
}
