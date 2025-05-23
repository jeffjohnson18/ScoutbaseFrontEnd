/**
 * Search Coach Screen Component
 * Provides functionality to search and display coach profiles based on various criteria.
 * This component allows users to filter coaches by team needs, school name, position, and bio information.
 * 
 * @module SearchCoachScreen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, Image, Animated, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the message box icon
import * as ImagePicker from 'expo-image-picker';

/**
 * SearchCoachScreen Component
 * Allows users to search for coaches using various filters.
 * 
 * @component
 */
const SearchCoachScreen = () => {
  // State management for search filters and results
  const [teamNeeds, setTeamNeeds] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [position_within_org, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [division, setDivision] = useState('');
  const [state, setState] = useState('');
  const [name, setName] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Animation values for UI transitions
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const formFadeAnim = React.useRef(new Animated.Value(0)).current;
  const formSlideAnim = React.useRef(new Animated.Value(30)).current;
  const resultsFadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation sequence for component entrance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(formSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Animation for results display
  useEffect(() => {
    if (results.length > 0) {
      Animated.timing(resultsFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [results]);

  /**
   * Handles the coach search process.
   * Constructs query parameters and fetches matching coach profiles from the backend.
   * 
   * @async
   * @function handleSearch
   */
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (name) queryParams.append('name', name);
      if (teamNeeds) queryParams.append('team_needs', teamNeeds);
      if (schoolName) queryParams.append('school_name', schoolName);
      if (position_within_org) queryParams.append('position_within_org', position_within_org);
      if (bio) queryParams.append('bio', bio);
      if (division) queryParams.append('division', division);
      if (state) queryParams.append('state', state);

      const response = await fetch(`http://localhost:8000/scoutbase/searchforcoach?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch coaches');
      }

      const data = await response.json();
      setResults(data);
      setFiltersVisible(false); // Hide filters after search
    } catch (error) {
      Alert.alert('Error', `Search failed. Please try again. ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches the email address for a specific user by user ID.
   * 
   * @async
   * @function fetchEmailForProfile
   * @param {number} userId - The ID of the user to fetch the email for
   */
  const fetchEmailForProfile = async (userId) => {
    const url = `http://127.0.0.1:8000/scoutbase/fetch-email/${userId}/`;
    console.log("Fetching email from:", url); // Log the request URL
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch email');
      }
      const data = await response.json();
      setSelectedEmail(data.email); // Assuming the response contains an email field
      setModalVisible(true); // Show the modal with the email
    } catch (error) {
      Alert.alert('Error', `Could not fetch email: ${error.message}`);
    }
  };

  const handleImagePicker = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileData({ ...profileData, profile_picture: uri });
      // Optionally, upload the image to the server here
      await uploadProfilePicture(uri);
    }
  };

  const uploadProfilePicture = async (uri) => {
    const formData = new FormData();
    formData.append('profile_picture', {
      uri,
      type: 'image/jpeg', // or the appropriate type
      name: 'profile_picture.jpg',
    });

    try {
      const response = await fetch(`http://localhost:8000/scoutbase/upload-profile-picture/${userId}/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      Alert.alert('Success', 'Profile picture updated successfully.');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to upload profile picture.');
    }
  };

  /**
   * Render the search interface and results.
   */
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior for keyboard
    >
      <Animated.View 
        style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Text style={styles.welcomeText}>Search Coaches</Text>
        <Text style={[styles.welcomeSubtext, { 
          fontSize: 14,
          textAlign: 'center',
          paddingHorizontal: 20,
        }]}>
          Connect with managers, coaches, and staff that meet your criteria.
        </Text>
      </Animated.View>

      <TouchableOpacity onPress={() => setFiltersVisible(!filtersVisible)}>
        <Text style={styles.toggleButton}>
          {filtersVisible ? 'Hide Filters' : 'Show Filters'}
        </Text>
      </TouchableOpacity>

      {filtersVisible && (
        <Animated.View
          style={{
            opacity: formFadeAnim,
            transform: [{ translateY: formSlideAnim }],
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Team Needs"
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
            placeholder="Position Within Organization"
            value={position_within_org}
            onChangeText={setPosition}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />
          <TextInput
            style={styles.input}
            placeholder="Division (e.g., Varsity, Junior Varsity)"
            value={division}
            onChangeText={setDivision}
          />
          <TextInput
            style={styles.input}
            placeholder="State (e.g., CA, NY)"
            value={state}
            onChangeText={setState}
          />
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleSearch}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Searching...' : 'Search'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Animated.View style={{ opacity: resultsFadeAnim, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          {results.length > 0 ? (
            results.map((item, index) => (
              <View key={index.toString()} style={styles.resultCard}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                  <View style={styles.profileContainer}>
                    {item.profile_picture && item.profile_picture.startsWith('http') ? (
                      <Image source={{ uri: item.profile_picture }} style={styles.profileImage} />
                    ) : (
                      <Text style={styles.profilePicture}>{item.profile_picture || '👤'}</Text>
                    )}
                    <View>
                      <Text style={styles.resultText}>Name: {item.name}</Text>
                      <Text style={styles.resultText}>Team Needs: {item.team_needs}</Text>
                      <Text style={styles.resultText}>School Name: {item.school_name}</Text>
                      <Text style={styles.resultText}>Position Within Org: {item.position_within_org}</Text>
                      <Text style={styles.resultText}>Bio: {item.bio}</Text>
                      <Text style={styles.resultText}>Division: {item.division}</Text>
                      <Text style={styles.resultText}>State: {item.state}</Text>
                      <TouchableOpacity 
                        onPress={() => fetchEmailForProfile(item.user_id)}
                      >
                        <Text style={styles.emailText}>View Email</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            ))
          ) : (
            !isLoading && (
              <Text style={styles.noResults}>
                No coaches found matching the criteria
              </Text>
            )
          )}
        </ScrollView>
      </Animated.View>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Email</Text>
            <Text style={styles.modalText}>{selectedEmail}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

/**
 * Styles for the SearchCoachScreen component
 * Defines the visual appearance of all UI elements
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  welcomeContainer: {
    marginTop: 60,
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'SupraSans-HeavyOblique',
    fontSize: 32,
    color: '#1f8bde',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    color: '#666',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontFamily: 'SupraSans-Regular',
  },
  primaryButton: {
    backgroundColor: '#1f8bde',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'SupraSans-Regular',
    color: 'white',
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 16,
    paddingBottom: 100, // Add padding to ensure the last item is visible
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: '90%',
    borderRadius: 10,
    marginRight: 16,
  },
  profilePicture: {
    fontSize: 40,
    marginRight: 16,
  },
  resultText: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  noResults: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  toggleButton: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 16,
    color: '#1f8bde',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#1f8bde',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  emailText: {
    color: '#1f8bde',
    marginTop: 10,
    textDecorationLine: 'none',
  },
});

export default SearchCoachScreen;
