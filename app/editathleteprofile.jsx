import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

const EditAthleteProfile = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch token and decode user ID
        const response = await fetch('http://10.0.2.2:8000/scoutbase/user');
        const token = await response.text();
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.id;
        if (!userId) throw new Error('Invalid token');
        setUserId(userId);

        // Fetch athlete profile data
        const profileResponse = await fetch(`http://10.0.2.2:8000/scoutbase/searchforathlete?user_id=${userId}`);
        const profile = await profileResponse.json();
        
        if (profile.length > 0) {
          setProfileData(profile[0]); // Set existing data into the form
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
      const response = await fetch(`http://10.0.2.2:8000/scoutbase/editathlete/${userId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      Alert.alert('Success', 'Profile updated successfully.');
      router.push('/profile'); // Navigate back to profile page
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile.');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      
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
        value={profileData.height.toString()}
        onChangeText={(text) => setProfileData({ ...profileData, height: parseFloat(text) || '' })}
      />

      <TextInput 
        style={styles.input} 
        placeholder="Weight (lbs)"
        keyboardType="numeric"
        value={profileData.weight.toString()}
        onChangeText={(text) => setProfileData({ ...profileData, weight: parseFloat(text) || '' })}
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

      <Button title="Save Changes" onPress={handleSave} />
      <Button title="Cancel" color="red" onPress={() => router.push('/profile')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ccc' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default EditAthleteProfile;
