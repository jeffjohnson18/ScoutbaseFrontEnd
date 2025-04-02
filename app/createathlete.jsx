/**
 * Create Athlete Profile Component
 * Handles the initial profile creation for athlete users.
 * This component provides an interface for creating a new athlete profile including school information,
 * physical attributes, positions, media links, and profile picture upload.
 * 
 * @module CreateAthleteProfile
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

/**
 * CreateAthleteProfileScreen Component
 * Provides the user interface for creating a new athlete profile.
 * 
 * @component
 */
const CreateAthleteProfileScreen = () => {
  // State management for form data and user identification
  const [userId, setUserId] = useState(null);
  const [highSchoolName, setHighSchoolName] = useState('');
  const [positions, setPositions] = useState('');
  const [youtubeVideoLink, setYoutubeVideoLink] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bio, setBio] = useState('');
  const [state, setState] = useState('');
  const [throwing_arm, setThrowingArm] = useState('');
  const [batting_arm, setBattingArm] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(false);

  /**
   * Fetches and decodes user token on component mount
   * 
   * @async
   * @function fetchTokenAndDecode
   */
  useEffect(() => {
    fetchTokenAndDecode();
  }, []);

  /**
   * Retrieves and decodes JWT token to get user ID
   * 
   * @async
   * @function fetchTokenAndDecode
   */
  const fetchTokenAndDecode = async () => {
    try {
      const response = await fetch('http://localhost:8000/scoutbase/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to retrieve token');

      const token = await response.text();
      const decodedToken = jwtDecode(token);

      if (decodedToken?.id) {
        setUserId(decodedToken.id);
        setError('');
      } else {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      setError('Session expired. Please log in again.');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  /**
   * Handles image selection from device library
   * 
   * @async
   * @function pickImage
   */
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      setError('Permission to access photos is required');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      let localUri = pickerResult.assets[0].uri;
      if (Platform.OS === 'ios') {
        localUri = localUri.replace('file://', '');
      }
      setProfilePicture(localUri);
    }
  };

  /**
   * Handles the athlete profile creation process
   * Validates form inputs and sends profile data to the backend
   * 
   * @async
   * @function handleCreateProfile
   */
  const handleCreateProfile = async () => {
    if (!userId || !highSchoolName || !positions || !height || !weight || !bio || !state || !throwing_arm || !batting_arm) {
      setError('Please fill in all required fields');
      return;
    }

    const profileData = new FormData();
    profileData.append('user_id', userId);
    profileData.append('high_school_name', highSchoolName);
    profileData.append('positions', positions);
    profileData.append('youtube_video_link', youtubeVideoLink || '');
    profileData.append('height', parseFloat(height));
    profileData.append('weight', parseFloat(weight));
    profileData.append('bio', bio);
    profileData.append('state', state);
    profileData.append('throwing_arm', throwing_arm);
    profileData.append('batting_arm', batting_arm);

    if (profilePicture) {
      const filename = profilePicture.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';

      profileData.append('profile_picture', {
        uri: profilePicture,
        name: filename,
        type,
      });
    }

    try {
      const response = await fetch('http://localhost:8000/scoutbase/athlete/createprofile', {
        method: 'POST',
        body: profileData,
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.message || 'Failed to create profile');
      }

      if (responseData.profile_picture) {
        setUploadedImageUrl(`http://localhost:8000${responseData.profile_picture}`);
      }

      // Show splash screen
      setShowSplash(true);
      // Wait 2 seconds then navigate
      setTimeout(() => {
        router.push('/profile');
      }, 2000);

    } catch (error) {
      setError(error.message || 'Failed to create profile');
    }
  };

  /**
   * Render the profile creation form interface
   */
  return (
    <ScrollView>
      <View style={styles.container}>
        {showSplash ? (
          <View style={styles.splashContainer}>
            <Text style={styles.splashText}>Profile Created!</Text>
            <Text style={styles.splashSubtext}>Redirecting to your profile...</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Create Your Profile</Text>
          <Text style={styles.welcomeSubtext}>Tell us about yourself</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="High School Name" 
            value={highSchoolName} 
            onChangeText={setHighSchoolName} 
          />

          <TextInput 
            style={styles.input} 
            placeholder="Positions (e.g., Pitcher, Outfielder)" 
            value={positions} 
            onChangeText={setPositions} 
          />

          <TextInput 
            style={styles.input} 
            placeholder="YouTube Video Link (optional)" 
            value={youtubeVideoLink} 
            onChangeText={setYoutubeVideoLink} 
          />

          <TextInput 
            style={styles.input} 
            placeholder="Height (e.g., 6.1)" 
            value={height} 
            onChangeText={setHeight} 
            keyboardType="numeric" 
          />

          <TextInput 
            style={styles.input} 
            placeholder="Weight (e.g., 180)" 
            value={weight} 
            onChangeText={setWeight} 
            keyboardType="numeric" 
          />

          <TextInput 
            style={styles.input} 
            placeholder="Bio" 
            value={bio} 
            onChangeText={setBio} 
            multiline 
          />

          <TextInput 
            style={styles.input} 
            placeholder="State" 
            value={state} 
            onChangeText={setState} 
          />

          <TextInput 
            style={styles.input} 
            placeholder="Throwing Arm" 
            value={throwing_arm} 
            onChangeText={setThrowingArm} 
          />

          <TextInput 
            style={styles.input} 
            placeholder="Batting Arm" 
            value={batting_arm} 
            onChangeText={setBattingArm} 
          />
          
          {profilePicture && (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          )}

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Select Profile Picture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleCreateProfile}>
            <Text style={styles.buttonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

/**
 * Styles for the CreateAthleteProfileScreen component
 * Defines the visual appearance of all UI elements
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    color: '#1f8bde',
  },
  welcomeContainer: {
    marginTop: 100,
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
  errorText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 14,
    color: '#e63946',
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    flex: 1,
    gap: 12,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontFamily: 'SupraSans-Regular',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#495057',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1f8bde',
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
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  splashText: {
    fontFamily: 'SupraSans-HeavyOblique',
    fontSize: 32,
    color: '#1f8bde',
    marginBottom: 16,
  },
  splashSubtext: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 18,
    color: '#666',
  },
});

export default CreateAthleteProfileScreen;
