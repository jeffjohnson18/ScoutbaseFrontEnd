/**
 * Profile Screen Component
 * Displays user profile information based on their role (Athlete or Coach).
 * @module ProfileScreen
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, StyleSheet, Button, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

/**
 * ProfileScreen Component
 * Fetches and displays user-specific profile information, including personal details,
 * athletic information, or coaching details based on user role.
 * @component
 */
const ProfileScreen = () => {
  // State management for user data and loading status
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Add animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const profileFadeAnim = React.useRef(new Animated.Value(0)).current;
  const profileSlideAnim = React.useRef(new Animated.Value(30)).current;
  const infoFadeAnim = React.useRef(new Animated.Value(0)).current;
  const infoSlideAnim = React.useRef(new Animated.Value(50)).current;

  /**
   * Fetches user profile data on component mount
   * Includes token verification, role checking, and profile data retrieval
   * @async
   * @function fetchData
   */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch and decode user token
        const response = await fetch('http://localhost:8000/scoutbase/user');
        const token = await response.text();
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.id;
        if (!userId) throw new Error('Invalid token');
        setUserId(userId);

        // Fetch user role
        const roleResponse = await fetch(`http://localhost:8000/scoutbase/fetchrole?user_id=${userId}`);
        const roleData = await roleResponse.json();
        setRole(roleData.role);

        // Fetch profile data based on user role
        const profileEndpoint = roleData.role === 'Athlete'
          ? `http://localhost:8000/scoutbase/searchforathlete?user_id=${userId}`
          : `http://localhost:8000/scoutbase/searchforcoach?user_id=${userId}`;

        const profileResponse = await fetch(profileEndpoint);
        const profileData = await profileResponse.json();
        setProfileData(profileData[0]);
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add animation sequence
  useEffect(() => {
    if (!isLoading && profileData) {
      Animated.sequence([
        // Welcome text animation
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
        // Profile picture animation
        Animated.parallel([
          Animated.timing(profileFadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(profileSlideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Info container animation
        Animated.parallel([
          Animated.timing(infoFadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(infoSlideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isLoading, profileData]);

  /**
   * Handles user logout process
   * @async
   * @function handleLogout
   */
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/scoutbase/logout', { method: 'POST' });
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#1f8bde" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.welcomeContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.welcomeText}>Your Profile</Text>
          <Text style={styles.welcomeSubtext}>
            {role === 'Athlete' ? 'Athlete Profile' : 'Coach Profile'}
          </Text>
        </Animated.View>

        <View style={styles.profileContainer}>
          <Animated.View
            style={{
              opacity: profileFadeAnim,
              transform: [{ translateY: profileSlideAnim }],
            }}
          >
            {profileData.profile_picture && profileData.profile_picture.startsWith('http') ? (
              <Image source={{ uri: profileData.profile_picture }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Text style={styles.defaultProfileText}>👤</Text>
              </View>
            )}
          </Animated.View>

          <Animated.View
            style={[
              styles.infoContainer,
              {
                opacity: infoFadeAnim,
                transform: [{ translateY: infoSlideAnim }],
                width: '100%',
              }
            ]}
          >
            {role === 'Athlete' ? (
              <>
                <Text style={styles.infoLabel}>High School</Text>
                <Text style={styles.infoText}>{profileData.high_school_name}</Text>
                
                <Text style={styles.infoLabel}>Positions</Text>
                <Text style={styles.infoText}>{profileData.positions}</Text>
                
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoText}>{profileData.height} ft</Text>
                
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoText}>{profileData.weight} lbs</Text>
                
                <Text style={styles.infoLabel}>State</Text>
                <Text style={styles.infoText}>{profileData.state}</Text>
                
                <Text style={styles.infoLabel}>Bio</Text>
                <Text style={styles.infoText}>{profileData.bio || 'N/A'}</Text>
              </>
            ) : (
              <>
                <Text style={styles.infoLabel}>Team Needs</Text>
                <Text style={styles.infoText}>{profileData.team_needs}</Text>
                
                <Text style={styles.infoLabel}>School Name</Text>
                <Text style={styles.infoText}>{profileData.school_name}</Text>
                
                <Text style={styles.infoLabel}>State</Text>
                <Text style={styles.infoText}>{profileData.state}</Text>
                
                <Text style={styles.infoLabel}>Bio</Text>
                <Text style={styles.infoText}>{profileData.bio || 'N/A'}</Text>
              </>
            )}
          </Animated.View>

          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: infoFadeAnim,
                transform: [{ translateY: infoSlideAnim }],
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => role === 'Athlete' ? router.push('/editathleteprofile') : router.push('/editcoachprofile')}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * Styles for the ProfileScreen component
 * Defines the visual appearance of all UI elements
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  welcomeContainer: {
    marginTop: 60,
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
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  defaultProfileText: {
    fontSize: 40,
  },
  infoContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoLabel: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  infoText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#1f8bde',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#e63946',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'SupraSans-Regular',
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 14,
    color: '#e63946',
    textAlign: 'center',
  },
});

export default ProfileScreen;
