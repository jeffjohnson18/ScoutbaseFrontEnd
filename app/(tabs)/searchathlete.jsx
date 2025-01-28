import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';

const SearchAthleteScreen = () => {
  const [highSchoolName, setHighSchoolName] = useState('');
  const [positions, setPositions] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bio, setBio] = useState('');
  const [state, setState] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Construct the query string based on provided input
      const queryParams = new URLSearchParams();
      if (highSchoolName) queryParams.append('high_school_name', highSchoolName);
      if (positions) queryParams.append('positions', positions);
      if (height) queryParams.append('height', height);
      if (weight) queryParams.append('weight', weight);
      if (bio) queryParams.append('bio', bio);
      if (state) queryParams.append('state', state);

      const response = await fetch(`http://10.0.2.2:8000/scoutbase/searchforathlete?${queryParams.toString()}`, {
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
    } catch (error) {
      Alert.alert('Error', `Search failed. Please try again. ${error.message}`);
      console.error('Search Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultCard}>
      <View style={styles.profileContainer}>
        {/* Check if there is a profile picture URL or use a default emoji */}
        <Text style={styles.profilePicture}>{item.profile_picture || '👤'}</Text>
        <Text style={styles.resultText}>High School: {item.high_school_name}</Text>
        <Text style={styles.resultText}>Positions: {item.positions}</Text>
        <Text style={styles.resultText}>Height: {item.height}</Text>
        <Text style={styles.resultText}>Weight: {item.weight}</Text>
        <Text style={styles.resultText}>Bio: {item.bio}</Text>
        <Text style={styles.resultText}>State: {item.state}</Text>
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="High School Name"
        value={highSchoolName}
        onChangeText={setHighSchoolName}
      />
      <TextInput
        style={styles.input}
        placeholder="Positions"
        value={positions}
        onChangeText={setPositions}
      />
      <TextInput
        style={styles.input}
        placeholder="Height"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
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
        placeholder="State"
        value={state}
        onChangeText={setState}
      />
      <Button title={isLoading ? 'Searching...' : 'Search'} onPress={handleSearch} disabled={isLoading} />

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.resultsContainer}
        ListEmptyComponent={
          !isLoading && <Text style={styles.noResults}>No athletes found matching the criteria</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',  
    alignItems: 'center',  
  },
  profilePicture: {
    fontSize: 40,          
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

export default SearchAthleteScreen;
