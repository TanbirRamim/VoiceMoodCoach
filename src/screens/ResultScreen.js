import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getMoodEmoji = (mood) => {
  switch (mood) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'anxious': return '😰';
    case 'neutral': return '😐';
    default: return '😐';
  }
};

const getSuggestions = (mood, stressScore) => {
  const suggestions = {
    happy: [
      "Share your positive energy with others",
      "Document what made you happy today",
      "Plan something to look forward to"
    ],
    sad: [
      "Practice self-care activities",
      "Reach out to a friend or loved one",
      "Try some gentle exercise"
    ],
    anxious: [
      "Take deep breaths for 2 minutes",
      "Write down your worries",
      "Try a quick meditation"
    ],
    neutral: [
      "Reflect on your current state",
      "Set small goals for the day",
      "Practice mindfulness"
    ]
  };

  return suggestions[mood] || suggestions.neutral;
};

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { transcript, stressScore, moodAnalysis } = route.params;

  const saveSession = async () => {
    try {
      const session = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        transcript,
        stressScore,
        moodAnalysis
      };

      const existingSessions = await AsyncStorage.getItem('sessions');
      const sessions = existingSessions ? JSON.parse(existingSessions) : [];
      sessions.unshift(session);
      await AsyncStorage.setItem('sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  React.useEffect(() => {
    saveSession();
  }, []);

  const getStressColor = (score) => {
    if (score <= 3) return '#4CAF50'; // Green
    if (score <= 7) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{getMoodEmoji(moodAnalysis.mood)}</Text>
        
        <Text style={styles.moodText}>
          {moodAnalysis.mood.charAt(0).toUpperCase() + moodAnalysis.mood.slice(1)}
        </Text>
        
        <Text style={styles.summary}>{moodAnalysis.summary}</Text>

        <View style={styles.stressContainer}>
          <Text style={styles.stressLabel}>Stress Level</Text>
          <View style={styles.stressMeter}>
            <View 
              style={[
                styles.stressBar, 
                { 
                  width: `${(stressScore / 10) * 100}%`,
                  backgroundColor: getStressColor(stressScore)
                }
              ]} 
            />
          </View>
          <Text style={styles.stressScore}>{stressScore}/10</Text>
        </View>

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestions</Text>
          {getSuggestions(moodAnalysis.mood, stressScore).map((suggestion, index) => (
            <View key={index} style={styles.suggestionCard}>
              <MaterialIcons name="lightbulb" size={24} color="#4A148C" />
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.recordButton]}
            onPress={() => navigation.navigate('Record')}
          >
            <MaterialIcons name="mic" size={24} color="white" />
            <Text style={styles.buttonText}>Record Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => navigation.navigate('Welcome')}
          >
            <MaterialIcons name="home" size={24} color="white" />
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  moodText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 10,
  },
  summary: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  stressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  stressLabel: {
    fontSize: 18,
    color: '#4A148C',
    marginBottom: 10,
  },
  stressMeter: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  stressBar: {
    height: '100%',
    borderRadius: 10,
  },
  stressScore: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
  suggestionsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  suggestionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 15,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    width: '48%',
  },
  recordButton: {
    backgroundColor: '#4A148C',
  },
  homeButton: {
    backgroundColor: '#7B1FA2',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 