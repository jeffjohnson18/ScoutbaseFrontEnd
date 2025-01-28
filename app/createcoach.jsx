import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const CreateCoachProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [teamNeeds, setTeamNeeds] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    fetchTokenAndDecode();
  }, []);

  const fetchTokenAndDecode = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/scoutbase/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve token');
      }

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

  // Image picker function
  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'You need to grant permission to select an image.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfilePicture(pickerResult.uri); // Store the image URI
    }
  };

  const handleCreateProfile = async () => {
    if (!userId || !teamNeeds || !schoolName || !position || !bio) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const profileData = new FormData();
    profileData.append('user_id', userId);
    profileData.append('team_needs', teamNeeds);
    profileData.append('school_name', schoolName);
    profileData.append('position', position);
    profileData.append('bio', bio);

    if (profilePicture) {
      const uri = profilePicture;
      const localUri = uri;
      const filename = localUri.split('/').pop();
      const type = `image/${filename.split('.').pop()}`;

      profileData.append('profile_picture', {
        uri: localUri,
        name: filename,
        type,
      });
    }

    try {
      const response = await fetch('http://10.0.2.2:8000/scoutbase/coach/createprofile', {
        method: 'POST',
        body: profileData,
      });

      if (!response.ok) {
        throw new Error('Failed to create coach profile.');
      }

      Alert.alert('Success', 'Coach profile created successfully!');
      router.push('/home');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create profile.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Team Needs (e.g., Looking for pitchers)"
        value={teamNeeds}
        onChangeText={setTeamNeeds}
      />
      <TextInput
        style={styles.input}
        placeholder="School Name"
        value={schoolName}
        onChangeText={setSchoolName}
      />
      <TextInput
        style={styles.input}
        placeholder="Position (e.g., Head Coach)"
        value={position}
        onChangeText={setPosition}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      
      {/* Display selected profile picture */}
      {profilePicture && (
        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
      )}

      <Button title="Choose Profile Picture" onPress={handleImagePicker} />
      {profilePicture && <Text>Image Selected: {profilePicture.split('/').pop()}</Text>}
      
      <Button title="Create Profile" onPress={handleCreateProfile} />
    </View>
  );
};

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
