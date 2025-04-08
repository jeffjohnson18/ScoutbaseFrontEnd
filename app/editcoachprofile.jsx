/**
 * Edit Coach Profile Component
 * Allows coaches to view and update their profile information.
 * This component provides an interface for coaches to edit their profile details including
 * team needs, school name, position, and bio.
 * 
 * @module EditCoachProfile
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

/**
 * EditCoachProfile Component
 * Provides the user interface for coaches to edit their profile details.
 * 
 * @component
 */
const EditCoachProfile = () => {
  // State management for user data and loading status
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    team_needs: '',
    school_name: '',
    position_within_org: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * Fetches and populates coach profile data on component mount
   * 
   * @async
   * @function fetchData
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch and decode user token to get ID
        const response = await fetch('http://localhost:8000/scoutbase/user');
        const token = await response.text();
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.id;
        if (!userId) throw new Error('Invalid token');

        setUserId(userId);

        // Fetch coach profile data
        const profileResponse = await fetch(`http://localhost:8000/scoutbase/searchforcoach?user_id=${userId}`);
        const profile = await profileResponse.json();

        // Populate form with existing data if available
        if (profile.length > 0) {
          setProfileData({
            name: profile[0]?.name || '',
            team_needs: profile[0]?.team_needs || '',
            school_name: profile[0]?.school_name || '',
            position_within_org: profile[0]?.position_within_org || '',
            bio: profile[0]?.bio || '',
          });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Handles the profile update process
   * Validates and sends updated profile data to the backend
   * 
   * @async
   * @function handleSave
   */
  const handleSave = async () => {
    try {
      // Prepare request body with updated profile data
      const requestBody = {
        name: profileData.name || null,
        team_needs: profileData.team_needs || null,
        school_name: profileData.school_name || null,
        position_within_org: profileData.position_within_org || null,
        bio: profileData.bio || null,
      };

      // Send update request to backend
      const response = await fetch(`http://localhost:8000/scoutbase/editcoach/${userId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }

      Alert.alert('Success', 'Profile updated successfully.');
      router.push('/profile');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile.');
    }
  };

  // Display loading spinner while data is being fetched
  if (isLoading) {
    return <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />;
  }

  /**
   * Render the profile edit form interface
   */
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Edit Profile</Text>
          <Text style={styles.welcomeSubtext}>Update Your Information</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Name"
            value={profileData.name}
            onChangeText={(text) => setProfileData({ ...profileData, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Team Needs"
            value={profileData.team_needs}
            onChangeText={(text) => setProfileData({ ...profileData, team_needs: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="School Name"
            value={profileData.school_name}
            onChangeText={(text) => setProfileData({ ...profileData, school_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Position Within Organization"
            value={profileData.position_within_org}
            onChangeText={(text) => setProfileData({ ...profileData, position_within_org: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Bio"
            multiline
            value={profileData.bio}
            onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * Styles for the EditCoachProfile component
 * Defines the visual appearance of all UI elements
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
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
  formContainer: {
    padding: 16,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginTop: 24,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default EditCoachProfile;
