/**
 * Search Coach Screen Component
 * Provides functionality to search and display coach profiles based on various criteria.
 * @module SearchCoachScreen
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Image } from 'react-native';

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
      const response = await fetch(`http://10.0.2.2:8000/scoutbase/searchforcoach?${queryParams.toString()}`, {
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
      {/* Search filters */}
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
      
      {/* Search button */}
      <Button 
        title={isLoading ? 'Searching...' : 'Search'} 
        onPress={handleSearch} 
        disabled={isLoading} 
      />

      {/* Results list */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.resultsContainer}
        ListEmptyComponent={
          !isLoading && <Text style={styles.noResults}>No coaches found matching the criteria</Text>
        }
      />
    </View>
  );
};

/**
 * Styles for the SearchCoachScreen component
 * Defines the visual appearance of all UI elements
 */
const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',  
    alignItems: 'center',  
  },
  profilePicture: {
    fontSize: 40,          
    marginRight: 12,       
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  resultsContainer: {
    marginTop: 16,
  },
  resultCard: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
  },
  noResults: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
});

export default SearchCoachScreen;
