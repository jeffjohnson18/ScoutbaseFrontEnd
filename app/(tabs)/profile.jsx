import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, StyleSheet, Button } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch token and decode
        const response = await fetch('http://10.0.2.2:8000/scoutbase/user');
        const token = await response.text();
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.id;
        if (!userId) throw new Error('Invalid token');
        setUserId(userId);

        // Fetch role
        const roleResponse = await fetch(`http://10.0.2.2:8000/scoutbase/fetchrole?user_id=${userId}`);
        const roleData = await roleResponse.json();
        setRole(roleData.role);

        // Fetch profile data
        const profileEndpoint = roleData.role === 'Athlete'
          ? `http://10.0.2.2:8000/scoutbase/searchforathlete?user_id=${userId}`
          : `http://10.0.2.2:8000/scoutbase/searchforcoach?user_id=${userId}`;

        const profileResponse = await fetch(profileEndpoint);
        const profileData = await profileResponse.json();
        setProfileData(profileData[0]);
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />;
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {profileData.profile_picture && <Image source={{ uri: profileData.profile_picture }} style={styles.profileImage} />}
      {role === 'Athlete' ? (
        <>
          <Text style={styles.infoText}>High School: {profileData.high_school_name}</Text>
          <Text style={styles.infoText}>Positions: {profileData.positions}</Text>
          <Text style={styles.infoText}>Height: {profileData.height} ft</Text>
          <Text style={styles.infoText}>Weight: {profileData.weight} lbs</Text>
          <Text style={styles.infoText}>Bio: {profileData.bio || 'N/A'}</Text>
          <Text style={styles.infoText}>State: {profileData.state}</Text>
        </>
      ) : (
        <>
          <Text style={styles.infoText}>Team Needs: {profileData.team_needs}</Text>
          <Text style={styles.infoText}>School Name: {profileData.school_name}</Text>
          <Text style={styles.infoText}>Bio: {profileData.bio || 'N/A'}</Text>
          <Text style={styles.infoText}>State: {profileData.state}</Text>
        </>
      )}

      {/* Edit Profile Button */}
      <Button
        title="Edit Profile"
        onPress={() => role === 'Athlete' ? router.push('/editathleteprofile') : router.push('/editcoachprofile')}
      />


      {/* Logout Button */}
      <Button title="Logout" onPress={async () => {
        await fetch('http://10.0.2.2:8000/scoutbase/logout', { method: 'POST' });
        router.replace('/');
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 20 },
  infoText: { fontSize: 16, marginBottom: 8 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
});

export default ProfileScreen;
