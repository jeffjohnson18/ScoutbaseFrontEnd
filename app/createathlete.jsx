/**
 * Create Athlete Profile Component
 * Handles the initial profile creation for athlete users.
 * @module CreateAthleteProfile
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

/**
 * CreateAthleteProfileScreen Component
 * Provides interface for creating a new athlete profile including school information,
 * physical attributes, positions, media links, and profile picture upload.
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
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to retrieve token');

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
   * Handles the athlete profile creation process
   * @async
   * @function handleCreateProfile
   */
  const handleCreateProfile = async () => {
    // Validate required fields
    if (!userId || !highSchoolName || !positions || !height || !weight || !bio || !state) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Prepare form data for profile creation
    const profileData = new FormData();
    profileData.append('user_id', userId);
    profileData.append('high_school_name', highSchoolName);
    profileData.append('positions', positions);
    profileData.append('youtube_video_link', youtubeVideoLink || '');
    profileData.append('height', parseFloat(height));
    profileData.append('weight', parseFloat(weight));
    profileData.append('bio', bio);
    profileData.append('state', state);

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
      const response = await fetch('http://10.0.2.2:8000/scoutbase/athlete/createprofile', {
        method: 'POST',
        body: profileData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.message || 'Failed to create athlete profile.');
      }

      // Update uploaded image URL if provided in response
      if (responseData.profile_picture) {
        setUploadedImageUrl(`http://10.0.2.2:8000${responseData.profile_picture}`);
      }

      Alert.alert('Success', 'Athlete profile created successfully!');
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
      {/* High School Name input field */}
      <TextInput 
        style={styles.input} 
        placeholder="High School Name" 
        value={highSchoolName} 
        onChangeText={setHighSchoolName} 
      />

      {/* Positions input field */}
      <TextInput 
        style={styles.input} 
        placeholder="Positions (e.g., Pitcher, Outfielder)" 
        value={positions} 
        onChangeText={setPositions} 
      />

      {/* YouTube Video Link input field */}
      <TextInput 
        style={styles.input} 
        placeholder="YouTube Video Link (optional)" 
        value={youtubeVideoLink} 
        onChangeText={setYoutubeVideoLink} 
      />

      {/* Height input field */}
      <TextInput 
        style={styles.input} 
        placeholder="Height (e.g., 6.1)" 
        value={height} 
        onChangeText={setHeight} 
        keyboardType="numeric" 
      />

      {/* Weight input field */}
      <TextInput 
        style={styles.input} 
        placeholder="Weight (e.g., 180)" 
        value={weight} 
        onChangeText={setWeight} 
        keyboardType="numeric" 
      />

      {/* Bio input field */}
      <TextInput 
        style={styles.input} 
        placeholder="Bio" 
        value={bio} 
        onChangeText={setBio} 
        multiline 
      />

      {/* State input field */}
      <TextInput 
        style={styles.input} 
        placeholder="State" 
        value={state} 
        onChangeText={setState} 
      />

      {/* Profile picture preview */}
      {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profileImage} />}

      {/* Image selection button */}
      <Button title="Select Profile Picture" onPress={pickImage} />
      {profilePicture && <Text>Image Selected: {profilePicture.split('/').pop()}</Text>}

      {/* Profile creation button */}
      <Button title="Create Profile" onPress={handleCreateProfile} />

      {/* Uploaded profile picture preview */}
      {uploadedImageUrl ? <Image source={{ uri: uploadedImageUrl }} style={styles.profileImage} /> : null}
    </View>
  );
};

/**
 * Styles for the CreateAthleteProfileScreen component
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
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default CreateAthleteProfileScreen;
