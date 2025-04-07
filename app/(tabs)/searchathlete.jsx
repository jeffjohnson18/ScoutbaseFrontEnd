/**
 * Search Athlete Screen Component
 * Provides functionality to search and display athlete profiles based on various criteria.
 * This component allows users to filter athletes by high school, positions, physical attributes, and bio information.
 * 
 * @module SearchAthleteScreen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, Image, Animated, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the message box icon

/**
 * SearchAthleteScreen Component
 * Allows users to search for athletes using various filters.
 * 
 * @component
 */
const SearchAthleteScreen = () => {
  // State management for search filters and results
  const [highSchool, setHighSchool] = useState('');
  const [positions, setPositions] = useState('');
  const [bio, setBio] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [throwing_arm, setThrowingArm] = useState('');
  const [batting_arm, setBattingArm] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [state, setState] = useState('');

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
   * Handles the athlete search process.
   * Constructs query parameters and fetches matching athlete profiles from the backend.
   * 
   * @async
   * @function handleSearch
   */
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (highSchool) queryParams.append('high_school_name', highSchool);
      if (positions) queryParams.append('positions', positions);
      if (bio) queryParams.append('bio', bio);
      if (height) queryParams.append('height', height);
      if (weight) queryParams.append('weight', weight);
      if (state) queryParams.append('state', state);

      const response = await fetch(`http://localhost:8000/scoutbase/searchforathlete?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch athletes');
      }

      const data = await response.json();
      setResults(data);
      setFiltersVisible(false); // Hide filters after search
    } catch (error) {
      Alert.alert('Error', `Search failed. Please try again. ${error.message}`);
      console.error('Search Error:', error);
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

  /**
   * Renders individual athlete profile cards in the results list.
   * 
   * @function renderItem
   * @param {Object} item - Athlete profile data to display
   */
  const renderItem = ({ item }) => (
    <View style={styles.resultCard}>
      <View style={styles.profileContainer}>
        {/* Profile picture display - shows image or default icon */}
        {item.profile_picture && item.profile_picture.startsWith('http') ? (
          <Image source={{ uri: item.profile_picture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profilePicture}>{item.profile_picture || '⚾'}</Text>
        )}
        {/* Athlete profile details */}
        <View>
          <Text style={styles.resultText}>{item.high_school_name}</Text>
          <Text style={styles.resultText}>{item.positions}</Text>
          <Text style={styles.resultText}>{item.height} feet/inches</Text>
          <Text style={styles.resultText}>{item.weight} lbs</Text>
          <Text style={styles.resultText}>{item.state}</Text>
          <Text style={styles.resultText}>{item.bio}</Text>
          <Text style={styles.resultText}>Throwing Arm: {item.throwing_arm}</Text>
          <Text style={styles.resultText}>Batting Arm: {item.batting_arm}</Text>
          <TouchableOpacity 
            onPress={() => fetchEmailForProfile(item.user_id)} // Directly fetch email on press
          >
            <Text style={styles.emailText}>View Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /**
   * Render the search interface and results.
   */
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Text style={styles.welcomeText}>Search Athletes</Text>
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
            placeholder="High School"
            value={highSchool}
            onChangeText={setHighSchool}
          />
          <TextInput
            style={styles.input}
            placeholder="Positions"
            value={positions}
            onChangeText={setPositions}
          />
          <TextInput
            style={styles.input}
            placeholder="Height (in inches)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Weight (in lbs)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />
          <TextInput
            style={styles.input}
            placeholder="Throwing Arm"
            value={throwing_arm}
            onChangeText={setThrowingArm}
          />
          <TextInput
            style={styles.input}
            placeholder="Batting Arm"
            value={batting_arm}
            onChangeText={setBattingArm}
          />
          <TextInput
            style={styles.input}
            placeholder="State (e.g., CA, OR, AZ)"
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

      <Animated.View style={{ opacity: resultsFadeAnim }}>
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.resultsContainer}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.noResults}>
                No athletes found matching the criteria
              </Text>
            )
          }
        />
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
    </View>
  );
};

/**
 * Styles for the SearchAthleteScreen component
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

export default SearchAthleteScreen;
