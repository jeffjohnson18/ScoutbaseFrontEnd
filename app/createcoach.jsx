/**
 * Create Coach Profile Component
 * Handles the initial profile creation for coach users.
 * @module CreateCoachProfile
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Image, Platform, Text } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

/**
 * CreateCoachProfileScreen Component
 * Provides interface for creating a new coach profile including team needs,
 * school information, position, bio, and profile picture upload.
 * @component
 */
const CreateCoachProfileScreen = () => {
  // State management for form data and user identification
  const [userId, setUserId] = useState(null);
  const [teamNeeds, setTeamNeeds] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();

  /**
   * Fetches and decodes user token on component mount
   * @async
   * @function fetchTokenAndDecode
   */
  useEffect(() => {
    fetchTokenAndDecode();
  }, []);

  /**
   * Retrieves and decodes JWT token to get user ID
   * @async
   * @function fetchTokenAndDecode
   */
  const fetchTokenAndDecode = async () => {
    try {
      // Fetch user token from backend
      const response = await fetch('http://10.0.2.2:8000/scoutbase/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve token');
      }

      // Decode token and extract user ID
      const token = await response.text();
      const decodedToken = jwtDecode(token);

      if (decodedToken?.id) {
        setUserId(decodedToken.id);
      } else {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to retrieve or decode token.');
    }
  };

  /**
   * Handles image selection from device library
   * @async
   * @function pickImage
   */
  const pickImage = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'You need to grant permission to select an image.');
      return;
    }

    // Launch image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      let localUri = pickerResult.assets[0].uri;

      // Handle iOS file path format
      if (Platform.OS === 'ios') {
        localUri = localUri.replace('file://', '');
      }

      setProfilePicture(localUri);
    }
  };

  /**
   * Handles the coach profile creation process
   * @async
   * @function handleCreateProfile
   */
  const handleCreateProfile = async () => {
    // Validate required fields
    if (!userId || !teamNeeds || !schoolName || !position || !bio) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Prepare form data for profile creation
    const profileData = new FormData();
    profileData.append('user_id', userId);
    profileData.append('team_needs', teamNeeds);
    profileData.append('school_name', schoolName);
    profileData.append('position', position);
    profileData.append('bio', bio);

    // Append profile picture if selected
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
      // Send profile creation request to backend
      const response = await fetch('http://10.0.2.2:8000/scoutbase/coach/createprofile', {
        method: 'POST',
        body: profileData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.message || 'Failed to create coach profile.');
      }

      Alert.alert('Success', 'Coach profile created successfully!');
      router.push('/home');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create profile.');
      console.error(error);
    }
  };

  /**
   * Render the profile creation form interface
   */
  return (
    <View style={styles.container}>
      {/* Team Needs input field */}
      <TextInput
        style={styles.input}
        placeholder="Team Needs (e.g., Looking for pitchers)"
        value={teamNeeds}
        onChangeText={setTeamNeeds}
      />

      {/* School Name input field */}
      <TextInput
        style={styles.input}
        placeholder="School Name"
        value={schoolName}
        onChangeText={setSchoolName}
      />

      {/* Position input field */}
      <TextInput
        style={styles.input}
        placeholder="Position (e.g., Head Coach)"
        value={position}
        onChangeText={setPosition}
      />

      {/* Bio input field */}
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      
      {/* Profile picture preview */}
      {profilePicture && (
        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
      )}

      {/* Image selection button */}
      <Button title="Choose Profile Picture" onPress={pickImage} />
      {profilePicture && <Text>Image Selected: {profilePicture.split('/').pop()}</Text>}
      
      {/* Profile creation button */}
      <Button title="Create Profile" onPress={handleCreateProfile} />
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
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default CreateCoachProfileScreen;
