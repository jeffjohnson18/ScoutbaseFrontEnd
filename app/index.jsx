/**
 * Home/Landing Screen Component
 * Initial entry point of the application displaying the main logo and authentication options.
 * @module HomeScreen
 */

import React from 'react';
import { Text, View, Dimensions, Image, Animated } from 'react-native';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

/**
 * Home Component
 * Displays the Scoutbase logo and provides navigation options for login and registration.
 * @component
 */
export default function Home() {
  // Add fade-in animation value
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Start fade-in animation on component mount
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Load custom fonts for the application
  const [fontsLoaded] = useFonts({
    'FactoriaBoldItalic': require('../assets/fonts/FactoriaTest-BoldItalic.otf'),
    'FactoriaMediumItalic': require('../assets/fonts/FactoriaTest-MediumItalic.otf'),
    'FactoriaMedium': require('../assets/fonts/FactoriaTest-Medium.otf'),
    'IntegralCF-Regular': require('../assets/fonts/Fontspring-DEMO-integralcf-regular.otf'),
    'SupraSans-Regular': require('../assets/fonts/HvDTrial_SupriaSans-Regular-BF64868e7702378.otf'),
    'SupraSans-HeavyOblique': require('../assets/fonts/HvDTrial_SupriaSans-HeavyOblique-BF64868e75ae1fa.otf'),
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: height * 0.2,
      }}
    >
      {/* Logo Image */}
      <Image
        source={require('../assets/images/ScoutBase.png')}
        style={{
          width: width * 0.4,
          height: width * 0.4,
          marginBottom: 10, // Reduced from 20 to 10
          resizeMode: 'contain',
        }}
      />

      {/* Welcome Text with Animation */}
      <Animated.Text style={{
        opacity: fadeAnim,
        fontSize: 16,
        fontFamily: 'SupraSans-Regular',
        color: '#666',
        marginBottom: 5, // Small space between "welcome to" and "SCOUTBASE"
      }}>
        WELCOME TO
      </Animated.Text>

      {/* Application Text */}
      <Text style={{ 
        fontSize: 35, 
        fontFamily: 'SupraSans-HeavyOblique', 
        lineHeight: 40,
        marginBottom: 25,
      }}>
        <Text style={{ color: 'black' }}>SCOUT</Text>
        <Text style={{ color: '#1f8bde' }}>BASE</Text>
      </Text>

      {/* Register Button - Primary */}
      <View
        style={{
          backgroundColor: '#1f8bde',
          paddingVertical: 10,
          paddingHorizontal: 20,
          width: width * 0.75,
          alignSelf: 'center',
        }}
      >
        <Link 
          href="/register" 
          style={{ 
            color: 'white', 
            fontFamily: 'SupraSans-Regular',
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
            fontFamily: 'SupraSans-Regular',
            fontSize: 14, 
            textAlign: 'center' 
          }}
        >
          Have an account? Login 
        </Link>
      </View>
    </View>
  );
}
