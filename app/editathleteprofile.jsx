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
          setProfileData({
            high_school_name: profile[0]?.high_school_name || '',
            positions: profile[0]?.positions || '',
            youtube_video_link: profile[0]?.youtube_video_link || '',
            profile_picture: profile[0]?.profile_picture || '',
            height: profile[0]?.height ? profile[0].height.toString() : '',
            weight: profile[0]?.weight ? profile[0].weight.toString() : '',
            bio: profile[0]?.bio || '',
            state: profile[0]?.state || '',
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
        high_school_name: profileData.high_school_name || null,
        positions: profileData.positions || null,
        youtube_video_link: profileData.youtube_video_link || null,
        profile_picture: profileData.profile_picture || null,
        height: profileData.height ? parseFloat(profileData.height) : null,
        weight: profileData.weight ? parseFloat(profileData.weight) : null,
        bio: profileData.bio || null,
        state: profileData.state || null,
      };
  
      const response = await fetch(`http://10.0.2.2:8000/scoutbase/editathlete/${userId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }
  
      Alert.alert("Success", "Profile updated successfully.");
      router.push("/profile");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile.");
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
        value={profileData.height}
        onChangeText={(text) => setProfileData({ ...profileData, height: text })}
      />

      <TextInput 
        style={styles.input} 
        placeholder="Weight (lbs)"
        keyboardType="numeric"
        value={profileData.weight}
        onChangeText={(text) => setProfileData({ ...profileData, weight: text })}
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
