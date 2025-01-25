import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { jwtDecode } from 'jwt-decode';

const CreateCoachProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [teamNeeds, setTeamNeeds] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); 

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
    if (!userId || !teamNeeds || !schoolName || !position || !bio) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const profileData = {
      user_id: userId,
      team_needs: teamNeeds,
      school_name: schoolName,
      position,
      bio,
      profile_picture: profilePicture || null,
    };

    try {
      const response = await fetch('http://10.0.2.2:8000/scoutbase/coach/createprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to create coach profile.');
      }

      Alert.alert('Success', 'Coach profile created successfully!');
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

export default CreateCoachProfileScreen;
