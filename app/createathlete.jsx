import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';


const CreateAthleteProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [highSchoolName, setHighSchoolName] = useState('');
  const [positions, setPositions] = useState('');
  const [youtubeVideoLink, setYoutubeVideoLink] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bio, setBio] = useState('');
  const [state, setState] = useState('');
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

  const handleCreateProfile = async () => {
    if (!userId || !highSchoolName || !positions || !height || !weight || !bio || !state) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const profileData = {
      user_id: userId,
      high_school_name: highSchoolName,
      positions,
      youtube_video_link: youtubeVideoLink || null,
      profile_picture: profilePicture || null,
      height: parseFloat(height),
      weight: parseFloat(weight),
      bio,
      state,
    };

    try {
      const response = await fetch('http://10.0.2.2:8000/scoutbase/athlete/createprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to create athlete profile.');
      }

      Alert.alert('Success', 'Athlete profile created successfully!');
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
});

export default CreateAthleteProfileScreen;
