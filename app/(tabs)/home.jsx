/**
 * Home Screen Component
 * Main landing page after user authentication displaying featured articles and updates.
 * @module HomeScreen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

/**
 * Featured articles data
 * Static content displayed on the home screen
 * @constant {Array<Object>} articles
 */
const articles = [
  {
    id: 1,
    title: "5 Tips to Make Your Profile Stand Out",
    description: "Learn how to create a compelling profile to catch the attention of recruiters.",
  },
  {
    id: 2,
    title: "Upcoming College Recruiting Event",
    description: "Don't miss the recruiting event hosted by State University this weekend!",
  },
  {
    id: 3,
    title: "How to Showcase Your Skills Effectively",
    description: "Highlight your strengths with these proven techniques.",
  },
];

const arizonaEvents = [
  {
    id: 1,
    title: "ASU Baseball Showcase Camp",
    description: "Join ASU's coaching staff for their annual showcase camp. Perfect for high school players looking to play at the next level. Located at Phoenix Municipal Stadium.",
  },
  {
    id: 2,
    title: "GCU Baseball Prospect Camp",
    description: "Grand Canyon University is hosting a prospect camp for high school players. Meet the coaching staff and tour the facilities at GCU Ballpark.",
  },
  {
    id: 3,
    title: "University of Arizona Scout Day",
    description: "UA Baseball invites top prospects to showcase their skills at Hi Corbett Field in Tucson. Professional scouts will be in attendance.",
  },
  {
    id: 4,
    title: "Phoenix Area Scout League",
    description: "Weekly games featuring top high school talent from across the Valley. Games held at various locations in Phoenix metro area.",
  },
];

// ArticleCard component for collapsible cards
const ArticleCard = ({ title, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = React.useRef(new Animated.Value(0)).current;
  const cardFadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      delay: Math.random() * 300, // Random delay for staggered effect
    }).start();
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={{ opacity: cardFadeAnim }}>
      <TouchableOpacity style={styles.card} onPress={toggleExpand}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.dropdownArrow}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        </View>
        <Animated.View
          style={{
            height: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, contentHeight + 24], // Increased padding
            }),
            opacity: animatedHeight,
          }}
        >
          <View
            onLayout={(event) => {
              const height = event.nativeEvent.layout.height;
              if (height > 0 && height !== contentHeight) {
                setContentHeight(height);
              }
            }}
          >
            <Text style={styles.cardDescription}>
              {description}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * HomePage Component
 * Displays welcome message and featured articles for users
 * @component
 */
const HomePage = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'SupraSans-Regular': require('../../assets/fonts/HvDTrial_SupriaSans-Regular-BF64868e7702378.otf'),
    'SupraSans-HeavyOblique': require('../../assets/fonts/HvDTrial_SupriaSans-HeavyOblique-BF64868e75ae1fa.otf'),
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.welcomeSubtext}>Here's what's new on Scoutbase</Text>
      </View>

      {/* Buttons for searching */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.searchCoachButton]} 
          onPress={() => router.push('/searchcoach')}
        >
          <Text style={styles.buttonText}>Search for a Coach</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.searchAthleteButton]} 
          onPress={() => router.push('/searchathlete')}
        >
          <Text style={styles.buttonText}>Search for an Athlete</Text>
        </TouchableOpacity>
      </View>

      {/* Arizona Events Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Events in Arizona</Text>
        {arizonaEvents.map((event) => (
          <ArticleCard
            key={event.id}
            title={event.title}
            description={event.description}
          />
        ))}
      </View>
    </ScrollView>
  );
};

/**
 * Styles for the HomePage component
 * Defines the visual appearance of all UI elements
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeContainer: {
    alignItems: 'center',
    padding: 30,
    paddingBottom: 15,
    marginBottom: 0,
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
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: '90%',
    paddingVertical: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  searchCoachButton: {
    backgroundColor: '#e63946',
  },
  searchAthleteButton: {
    backgroundColor: '#1f8bde',
  },
  buttonText: {
    fontFamily: 'SupraSans-Regular',
    color: 'white',
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 20,
    color: '#666',
    marginBottom: 16,
    marginLeft: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 18,
    color: '#000',
    flex: 1,
  },
  cardDescription: {
    fontFamily: 'SupraSans-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#1f8bde',
    marginLeft: 8,
  },
});

export default HomePage;
