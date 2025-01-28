import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

const EditCoachProfile = () => {
  const [userId, setUserId] = useState(null);
  const [teamNeeds, setTeamNeeds] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTokenAndDecode = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8000/scoutbase/user', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to retrieve token');

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

    fetchTokenAndDecode();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:8000/scoutbase/editcoach/${userId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_needs: teamNeeds }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      Alert.alert('Success', 'Profile updated successfully!');
      router.replace('/(tabs)/profile'); // Navigate back to profile
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Coach Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Team Needs"
        value={teamNeeds}
        onChangeText={setTeamNeeds}
      />
      <Button title="Save Changes" onPress={handleSave} disabled={!userId} />
    </View>
  );
};

export default EditCoachProfile;
