import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

const EditCoachProfile = () => {
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({
    team_needs: '',
    school_name: '',
    position: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8000/scoutbase/user');
        const token = await response.text();
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.id;
        if (!userId) throw new Error('Invalid token');

        setUserId(userId);

        const profileResponse = await fetch(`http://10.0.2.2:8000/scoutbase/searchforcoach?user_id=${userId}`);
        const profile = await profileResponse.json();

        if (profile.length > 0) {
          setProfileData({
            team_needs: profile[0]?.team_needs || '',
            school_name: profile[0]?.school_name || '',
            position: profile[0]?.position || '',
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

  const handleSave = async () => {
    try {
      const requestBody = {
        team_needs: profileData.team_needs || null,
        school_name: profileData.school_name || null,
        position: profileData.position || null,
        bio: profileData.bio || null,
      };

      const response = await fetch(`http://10.0.2.2:8000/scoutbase/editcoach/${userId}/`, {
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

  if (isLoading) {
    return <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Coach Profile</Text>

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
        placeholder="Position"
        value={profileData.position}
        onChangeText={(text) => setProfileData({ ...profileData, position: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Bio"
        multiline
        value={profileData.bio}
        onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
      />

      <Button title="Save Changes" onPress={handleSave} />
      <Button title="Cancel" color="red" onPress={() => router.push('/profile')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ccc' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default EditCoachProfile;
