import { Text, View, ActivityIndicator, Dimensions } from "react-native";
import { Link } from "expo-router";
import React from "react";
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window'); // Get the screen width

const Home = () => {
  const [fontsLoaded] = useFonts({
    'Factoria': require('../assets/fonts/FactoriaTest-BoldItalic-BF65c2f4a92f9ad.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 100,
      }}
    >
      <Text
        style={{
          fontSize: 45,
          fontFamily: "Factoria",
        }}
      >
        Scoutbase
      </Text>

      <View
        style={{
          backgroundColor: '#9c0b0b',
          paddingVertical: 10,
          paddingHorizontal: 20,
          width: width * 0.75, // 75% of screen width
          alignSelf: "center", // Center the button
          marginTop: 20
        }}
      >
        <Link href="/login" style={{ color: "white", fontFamily: 'Factoria', fontSize: 20, textAlign: 'center' }}>
          Login
        </Link>
      </View>

      <View
        style={{
          backgroundColor: '#1f8bde',
          paddingVertical: 10,
          paddingHorizontal: 20,
          width: width * 0.75, // 75% of screen width
          alignSelf: "center", // Center the button
          marginTop: 10
        }}
      >
        <Link href="/register" style={{ color: "white", fontFamily: 'Factoria', fontSize: 20, textAlign: 'center' }}>
          Register
        </Link>
      </View>
    </View>
  );
};

export default Home;
