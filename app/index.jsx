import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

export default function Home() {

  const [fontsLoaded] = useFonts({
        'FactoriaBoldItalic': require('../assets/fonts/FactoriaTest-BoldItalic.otf'),
        'FactoriaMediumItalic': require('../assets/fonts/FactoriaTest-MediumItalic.otf'),
        'FactoriaMedium': require('../assets/fonts/FactoriaTest-Medium.otf'),
        'IntegralCF-Regular': require('../assets/fonts/Fontspring-DEMO-integralcf-regular.otf'),
      });

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 100,
      }}
    >
      <Text style={{ fontSize: 45, fontFamily: 'FactoriaBoldItalic', lineHeight: 40 }}>
        <Text style={{ color: 'black' }}>Scout</Text>
        <Text style={{ color: '#1f8bde' }}>base</Text>
      </Text>


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
        <Link href="/login" style={{ color: 'white', fontFamily: 'FactoriaMediumItalic', fontSize: 20, textAlign: 'center', lineHeight: 30 }}>
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
        <Link href="/register" style={{ color: 'white', fontFamily: 'FactoriaMediumItalic', fontSize: 20, textAlign: 'center', lineHeight: 30 }}>
          Register
        </Link>
      </View>
    </View>
  );
}
