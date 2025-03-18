/**
 * Home Screen Component
 * Main landing page after user authentication displaying featured articles and updates.
 * @module HomeScreen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useFonts } from 'expo-font';

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
const HomePage = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'SupraSans-Regular': require('../../assets/fonts/HvDTrial_SupriaSans-Regular-BF64868e7702378.otf'),
    'SupraSans-HeavyOblique': require('../../assets/fonts/HvDTrial_SupriaSans-HeavyOblique-BF64868e75ae1fa.otf'),
  });

  // Add animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const featuredFadeAnim = React.useRef(new Animated.Value(0)).current;
  const featuredSlideAnim = React.useRef(new Animated.Value(30)).current;
  const eventsFadeAnim = React.useRef(new Animated.Value(0)).current;
  const eventsSlideAnim = React.useRef(new Animated.Value(50)).current;

  // Add animation sequence
  useEffect(() => {
    Animated.sequence([
      // Welcome text animation
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
      // Featured articles animation
      Animated.parallel([
        Animated.timing(featuredFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(featuredSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Events animation
      Animated.parallel([
        Animated.timing(eventsFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(eventsSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  /**
   * Render the home screen interface
   */
  return (
    <ScrollView style={styles.container}>
      <Animated.View 
        style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.welcomeSubtext}>Here's what's new on Scoutbase</Text>
      </Animated.View>

      {/* Featured Articles */}
      <Animated.View 
        style={[
          styles.sectionContainer,
          {
            opacity: featuredFadeAnim,
            transform: [{ translateY: featuredSlideAnim }],
          }
        ]}
      >
        <Text style={styles.sectionTitle}>Featured Articles</Text>
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            description={article.description}
          />
        ))}
      </Animated.View>

      {/* Arizona Events */}
      <Animated.View 
        style={[
          styles.sectionContainer,
          {
            opacity: eventsFadeAnim,
            transform: [{ translateY: eventsSlideAnim }],
          }
        ]}
      >
        <Text style={styles.sectionTitle}>Events in Arizona</Text>
        {arizonaEvents.map((event) => (
          <ArticleCard
            key={event.id}
            title={event.title}
            description={event.description}
          />
        ))}
      </Animated.View>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    // Card shadow styling
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
    paddingHorizontal: 4, // Added horizontal padding
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#1f8bde',
    marginLeft: 8,
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'SupraSans-Regular', // Changed from HeavyOblique to Regular
    fontSize: 20, // Slightly reduced from 24
    color: '#666', // Changed to match other secondary text
    marginBottom: 16,
    marginLeft: 16,
  },
});

export default HomePage;
