/**
 * Edit Athlete Profile Component
 * Allows athletes to view and update their profile information.
 * @module EditAthleteProfile
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

/**
 * EditAthleteProfile Component
 * Provides interface for athletes to edit their profile details including
 * school information, positions, measurements, and personal details.
 * @component
 */
const EditAthleteProfile = () => {
  // State management for user data and loading status
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({
    high_school_name: '',
    positions: '',
    youtube_video_link: '',
    profile_picture: '',
    height: '',
    weight: '',
    bio: '',
    state: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * Fetches and populates athlete profile data on component mount
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

        // Fetch athlete profile data
        const profileResponse = await fetch(`http://localhost:8000/scoutbase/searchforathlete?user_id=${userId}`);
        const profile = await profileResponse.json();
        
        // Populate form with existing data if available
        if (profile.length > 0) {
          setProfileData({
            high_school_name: profile[0]?.high_school_name || '',
            positions: profile[0]?.positions || '',
            youtube_video_link: profile[0]?.youtube_video_link || '',
            profile_picture: profile[0]?.profile_picture || '',
            height: profile[0]?.height ? profile[0].height.toString() : '',
            weight: profile[0]?.weight ? profile[0].weight.toString() : '',
            bio: profile[0]?.bio || '',
            state: profile[0]?.state || '',
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
   * @async
   * @function handleSave
   */
  const handleSave = async () => {
    try {
      // Prepare request body with updated profile data
      const requestBody = {
        high_school_name: profileData.high_school_name || null,
        positions: profileData.positions || null,
        youtube_video_link: profileData.youtube_video_link || null,
        height: profileData.height ? parseFloat(profileData.height) : null,
        weight: profileData.weight ? parseFloat(profileData.weight) : null,
        bio: profileData.bio || null,
        state: profileData.state || null,
      };
  
      console.log("Edit Profile Request:", JSON.stringify(requestBody, null, 2));
  
      // Send update request to backend
      const response = await fetch(`http://localhost:8000/scoutbase/editathlete/${userId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }
  
      Alert.alert("Success", "Profile updated successfully.");
      router.push("/profile");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile.");
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
            placeholder="High School Name"
            value={profileData.high_school_name}
            onChangeText={(text) => setProfileData({ ...profileData, high_school_name: text })}
          />

          <TextInput 
            style={styles.input} 
            placeholder="Positions"
            value={profileData.positions}
            onChangeText={(text) => setProfileData({ ...profileData, positions: text })}
          />

          <TextInput 
            style={styles.input} 
            placeholder="YouTube Video Link"
            value={profileData.youtube_video_link}
            onChangeText={(text) => setProfileData({ ...profileData, youtube_video_link: text })}
          />

          <TextInput 
            style={styles.input} 
            placeholder="Height (ft)"
            keyboardType="numeric"
            value={profileData.height}
            onChangeText={(text) => setProfileData({ ...profileData, height: text })}
          />

          <TextInput 
            style={styles.input} 
            placeholder="Weight (lbs)"
            keyboardType="numeric"
            value={profileData.weight}
            onChangeText={(text) => setProfileData({ ...profileData, weight: text })}
          />

          <TextInput 
            style={styles.input} 
            placeholder="Bio"
            multiline
            value={profileData.bio}
            onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
          />

          <TextInput 
            style={styles.input} 
            placeholder="State"
            value={profileData.state}
            onChangeText={(text) => setProfileData({ ...profileData, state: text })}
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
 * Styles for the EditAthleteProfile component
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

export default EditAthleteProfile;
