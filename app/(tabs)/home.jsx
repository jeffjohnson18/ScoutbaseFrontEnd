import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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

const HomePage = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome to Scoutbase!</Text>
      {articles.map((article) => (
        <TouchableOpacity
          key={article.id}
          style={styles.card}
          onPress={() => {
            Alert.alert("Article Clicked", `You selected: ${article.title}`);
          }}
        >
          <Text style={styles.cardTitle}>{article.title}</Text>
          <Text style={styles.cardDescription}>{article.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomePage;
