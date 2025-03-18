/**
 * Search Coach Screen Component
 * Provides functionality to search and display coach profiles based on various criteria.
 * @module SearchCoachScreen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Image, Animated, TouchableOpacity } from 'react-native';

/**
 * SearchCoachScreen Component
 * Allows users to search for coaches using filters such as team needs,
 * school name, position, and bio information.
 * @component
 */
const SearchCoachScreen = () => {
  // State management for search filters and results
  const [teamNeeds, setTeamNeeds] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const formFadeAnim = React.useRef(new Animated.Value(0)).current;
  const formSlideAnim = React.useRef(new Animated.Value(30)).current;
  const resultsFadeAnim = React.useRef(new Animated.Value(0)).current;

  // Add animation sequence
  useEffect(() => {
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

  // Add animation for results
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
   * Handles the coach search process
   * Constructs query parameters and fetches matching coach profiles
   * @async
   * @function handleSearch
   */
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Construct query parameters from filled fields
      const queryParams = new URLSearchParams();
      if (teamNeeds) queryParams.append('team_needs', teamNeeds);
      if (schoolName) queryParams.append('school_name', schoolName);
      if (position) queryParams.append('position', position);
      if (bio) queryParams.append('bio', bio);

      // Send search request to backend
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
    } catch (error) {
      Alert.alert('Error', `Search failed. Please try again. ${error.message}`);
      console.error('Search Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renders individual coach profile cards in the results list
   * @function renderItem
   * @param {Object} item - Coach profile data to display
   */
  const renderItem = ({ item }) => (
    <View style={styles.resultCard}>
      <View style={styles.profileContainer}>
        {/* Profile picture display - shows image or default icon */}
        {item.profile_picture && item.profile_picture.startsWith('http') ? (
          <Image source={{ uri: item.profile_picture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profilePicture}>{item.profile_picture || '👤'}</Text>
        )}
        {/* Coach profile details */}
        <View>
          <Text style={styles.resultText}>Team Needs: {item.team_needs}</Text>
          <Text style={styles.resultText}>School Name: {item.school_name}</Text>
          <Text style={styles.resultText}>Position: {item.position}</Text>
          <Text style={styles.resultText}>Bio: {item.bio}</Text>
        </View>
      </View>
    </View>
  );

  /**
   * Render the search interface and results
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
        <Text style={styles.welcomeText}>Search Coaches</Text>
        <Text style={styles.welcomeSubtext}>Find coaching opportunities</Text>
      </Animated.View>

      <Animated.View
        style={{
          opacity: formFadeAnim,
          transform: [{ translateY: formSlideAnim }],
        }}
      >
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
          placeholder="Position"
          value={position}
          onChangeText={setPosition}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
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

      <Animated.View style={{ opacity: resultsFadeAnim }}>
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.resultsContainer}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.noResults}>
                No coaches found matching the criteria
              </Text>
            )
          }
        />
      </Animated.View>
    </View>
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
    height: 60,
    borderRadius: 30,
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
});

export default SearchCoachScreen;
