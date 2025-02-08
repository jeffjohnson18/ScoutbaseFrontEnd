/**
 * Profile Screen Component
 * Displays user profile information based on their role (Athlete or Coach).
 * @module ProfileScreen
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, StyleSheet, Button } from 'react-native';
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
        const response = await fetch('http://10.0.2.2:8000/scoutbase/user');
        const token = await response.text();
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.id;
        if (!userId) throw new Error('Invalid token');
        setUserId(userId);

        // Fetch user role
        const roleResponse = await fetch(`http://10.0.2.2:8000/scoutbase/fetchrole?user_id=${userId}`);
        const roleData = await roleResponse.json();
        setRole(roleData.role);

        // Fetch profile data based on user role
        const profileEndpoint = roleData.role === 'Athlete'
          ? `http://10.0.2.2:8000/scoutbase/searchforathlete?user_id=${userId}`
          : `http://10.0.2.2:8000/scoutbase/searchforcoach?user_id=${userId}`;

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

  /**
   * Handles user logout process
   * @async
   * @function handleLogout
   */
  const handleLogout = async () => {
    try {
      await fetch('http://10.0.2.2:8000/scoutbase/logout', { method: 'POST' });
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  // Display loading spinner while data is being fetched
  if (isLoading) {
    return <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />;
  }

  // Display error message if profile data fails to load
  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile data.</Text>
      </View>
    );
  }

  /**
   * Render the profile interface
   */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      {/* Profile Picture Section */}
      <View style={styles.profileContainer}>
        {profileData.profile_picture && profileData.profile_picture.startsWith('http') ? (
          <Image source={{ uri: profileData.profile_picture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profilePicture}>{profileData.profile_picture || '👤'}</Text>
        )}
      </View>

      {/* Role-specific Profile Information */}
      {role === 'Athlete' ? (
        // Athlete Profile Details
        <>
          <Text style={styles.infoText}>High School: {profileData.high_school_name}</Text>
          <Text style={styles.infoText}>Positions: {profileData.positions}</Text>
          <Text style={styles.infoText}>Height: {profileData.height} ft</Text>
          <Text style={styles.infoText}>Weight: {profileData.weight} lbs</Text>
          <Text style={styles.infoText}>Bio: {profileData.bio || 'N/A'}</Text>
          <Text style={styles.infoText}>State: {profileData.state}</Text>
        </>
      ) : (
        // Coach Profile Details
        <>
          <Text style={styles.infoText}>Team Needs: {profileData.team_needs}</Text>
          <Text style={styles.infoText}>School Name: {profileData.school_name}</Text>
          <Text style={styles.infoText}>Bio: {profileData.bio || 'N/A'}</Text>
          <Text style={styles.infoText}>State: {profileData.state}</Text>
        </>
      )}

      {/* Action Buttons */}
      <Button
        title="Edit Profile"
        onPress={() => role === 'Athlete' ? router.push('/editathleteprofile') : router.push('/editcoachprofile')}
      />
      <Button title="Logout" onPress={handleLogout} />
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
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  profilePicture: { 
    fontSize: 40, 
    marginRight: 12 
  },
  profileImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    marginRight: 12 
  },
  infoText: { 
    fontSize: 16, 
    marginBottom: 8 
  },
  errorText: { 
    fontSize: 18, 
    color: 'red', 
    textAlign: 'center' 
  },
});

export default ProfileScreen;
