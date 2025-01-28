import React, { useEffect, useState } from 'react'; 
import { View, Text, Image, ActivityIndicator, Alert, StyleSheet, Button } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

const ProfileScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch JWT token and decode user ID
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
        return decodedToken.id;
      } else {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to retrieve or decode token.');
      setIsLoading(false);
    }
  };

  // Fetch user role based on user ID
  const fetchUserRole = async (userId) => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/scoutbase/fetchrole?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve role');
      }

      const data = await response.json();
      if (data.role) {
        setRole(data.role); 
      } else {
        throw new Error('Role not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve user role.');
      setIsLoading(false);
    }
  };

  // Fetch profile data based on role
  const fetchProfileData = async (userId, role) => {
    try {
      const endpoint =
        role === 'Athlete'
          ? `http://10.0.2.2:8000/scoutbase/searchforathlete?user_id=${userId}`
          : `http://10.0.2.2:8000/scoutbase/searchforcoach?user_id=${userId}`;
  
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to retrieve profile data');
      }
  
      const data = await response.json();
      
      const profile = data[0]; 
      setProfileData(profile);
      
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to retrieve profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/scoutbase/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      Alert.alert('Success', 'You have been logged out.');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', error.message || 'Logout failed.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const userId = await fetchTokenAndDecode();
      if (!userId) return;

      await fetchUserRole(userId); 
      if (!role) return; 

      await fetchProfileData(userId, role);
    };

    fetchData();
  }, [role]); 

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
      {profileData.profile_picture && (
        <Image source={{ uri: profileData.profile_picture }} style={styles.profileImage} />
      )}
      {role === 'Athlete' ? (
        <>
          <Text style={styles.infoText}>High School: {profileData.high_school_name}</Text>
          <Text style={styles.infoText}>Positions: {profileData.positions}</Text>
          <Text style={styles.infoText}>Height: {profileData.height} ft</Text>
          <Text style={styles.infoText}>Weight: {profileData.weight} lbs</Text>
          <Text style={styles.infoText}>Bio: {profileData.bio || 'N/A'}</Text>
          <Text style={styles.infoText}>State: {profileData.state}</Text>
          {profileData.youtube_video_link && (
            <Text style={styles.infoText}>YouTube: {profileData.youtube_video_link}</Text>
          )}
        </>
      ) : (
        <>
          <Text style={styles.infoText}>Team Needs: {profileData.team_needs}</Text>
          <Text style={styles.infoText}>School Name: {profileData.school_name}</Text>
          <Text style={styles.infoText}>Bio: {profileData.bio || 'N/A'}</Text>
          <Text style={styles.infoText}>State: {profileData.state}</Text>
        </>
      )}
      <Button title="Logout" onPress={handleLogout} color="#d9534f" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default ProfileScreen;
