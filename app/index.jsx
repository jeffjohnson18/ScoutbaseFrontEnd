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
    'SupraSans-Regular': require('../assets/fonts/HvDTrial_SupriaSans-Regular-BF64868e7702378.otf'),
    'SupraSans-HeavyOblique': require('../assets/fonts/HvDTrial_SupriaSans-HeavyOblique-BF64868e7702378.otf'),

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
      <Text style={{ fontSize: 25, fontFamily: 'IntegralCF-Regular', lineHeight: 40 }}>
        <Text style={{ color: 'black' }}>Scout</Text>
        <Text style={{ color: '#1f8bde' }}>base</Text>
      </Text>

      {/* Register Button - Primary */}
      <View
        style={{
          backgroundColor: '#1f8bde',
          paddingVertical: 10,
          paddingHorizontal: 20,
          width: width * 0.75,
          alignSelf: 'center',
          marginTop: 50,
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

      {/* Login Text Link */}
      <View style={{ marginTop: 20 }}>
        <Link 
          href="/login" 
          style={{ 
            color: '#666', 
            fontFamily: 'FactoriaMedium', 
            fontSize: 16, 
            textAlign: 'center' 
          }}
        >
          Already have an account? Login
        </Link>
      </View>
    </View>
  );
}
