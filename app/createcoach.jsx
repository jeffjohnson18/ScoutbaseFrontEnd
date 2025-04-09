/**
 * Create Coach Profile Component
 * Handles the initial profile creation for coach users.
 * This component provides an interface for creating a new coach profile including team needs,
 * school information, position, bio, and profile picture upload.
 * 
 * @module CreateCoachProfile
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, Platform, Text, TouchableOpacity } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

/**
 * CreateCoachProfileScreen Component
 * Provides the user interface for creating a new coach profile.
 * 
 * @component
 */
const CreateCoachProfileScreen = () => {
  // State management for form data and user identification
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const [teamNeeds, setTeamNeeds] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [position_within_org, setPositionWithinOrg] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTokenAndDecode();
  }, []);

  const fetchTokenAndDecode = async () => {
    try {
      const response = await fetch('http://localhost:8000/scoutbase/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve token');
      }

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

  const handleCreateProfile = async () => {
    if (!name || !userId || !teamNeeds || !schoolName || !position_within_org || !bio) {
      setError('Please fill in all required fields');
      return;
    }

    const profileData = new FormData();
    profileData.append('name', name);
    profileData.append('user_id', userId);
    profileData.append('team_needs', teamNeeds);
    profileData.append('school_name', schoolName);
    profileData.append('position_within_org', position_within_org);
    profileData.append('bio', bio);

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
      const response = await fetch('http://localhost:8000/scoutbase/coach/createprofile', {
        method: 'POST',
        body: profileData,
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.message || 'Failed to create profile');
      }

      setShowSplash(true);
      setTimeout(() => {
        router.push('/profile');
      }, 2000);

    } catch (error) {
      setError(error.message || 'Failed to create profile');
    }
  };

  return (
    <View style={styles.container}>
      {showSplash ? (
        <View style={styles.splashContainer}>
          <Text style={styles.splashText}>Profile Created!</Text>
          <Text style={styles.splashSubtext}>Redirecting to your profile...</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Create Coach Profile</Text>
            <Text style={styles.welcomeSubtext}>Tell us about your team needs</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.formContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your name how you would like it to be displayed on your account" 
              value={name} 
              onChangeText={setName} 
            />
            <TextInput
              style={styles.input}
              placeholder="Team Needs (e.g., Looking for pitchers, home run hitters)"
              value={teamNeeds}
              onChangeText={setTeamNeeds}
            />
            <TextInput
              style={styles.input}
              placeholder="School/Organization Name"
              value={schoolName}
              onChangeText={setSchoolName}
            />
            <TextInput
              style={styles.input}
              placeholder="Position Within Organization"
              value={position_within_org}
              onChangeText={setPositionWithinOrg}
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
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
        </>
      )}
    </View>
  );
};

/**
 * Styles for the CreateCoachProfileScreen component
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
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
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
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#1f8bde',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 1,
  },
  buttonText: {
    fontFamily: 'SupraSans-Regular',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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

export default CreateCoachProfileScreen;
