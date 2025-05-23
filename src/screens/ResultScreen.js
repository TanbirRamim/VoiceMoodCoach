import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

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

  // Animations
  const fade = useSharedValue(0);
  const emojiScale = useSharedValue(0.7);
  const stressBarWidth = useSharedValue(0);

  React.useEffect(() => {
    fade.value = withTiming(1, { duration: 900 });
    emojiScale.value = withSpring(1, { damping: 6 });
    stressBarWidth.value = withTiming((stressScore / 10) * 100, { duration: 1200 });
    saveSession();
  }, []);

  const fadeInStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const emojiStyle = useAnimatedStyle(() => ({ transform: [{ scale: emojiScale.value }] }));
  const stressBarStyle = useAnimatedStyle(() => ({ width: `${stressBarWidth.value}%` }));

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

  const getStressColor = (score) => {
    if (score <= 3) return '#4CAF50'; // Green
    if (score <= 7) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <Animated.View style={[styles.content, fadeInStyle]}> 
        <Animated.Text style={[styles.emoji, emojiStyle]}>{getMoodEmoji(moodAnalysis.mood)}</Animated.Text>
        <Text style={styles.moodText}>
          {moodAnalysis.mood.charAt(0).toUpperCase() + moodAnalysis.mood.slice(1)}
        </Text>
        <Text style={styles.summary}>{moodAnalysis.summary}</Text>
        <View style={styles.stressContainer}>
          <Text style={styles.stressLabel}>Stress Level</Text>
          <View style={styles.stressMeter}>
            <Animated.View 
              style={[styles.stressBar, stressBarStyle, { backgroundColor: getStressColor(stressScore) }]} 
            />
          </View>
          <Text style={styles.stressScore}>{stressScore}/10</Text>
        </View>
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestions</Text>
          {getSuggestions(moodAnalysis.mood, stressScore).map((suggestion, index) => (
            <Animated.View key={index} style={[styles.suggestionCard, fadeInStyle]}> 
              <MaterialIcons name="lightbulb" size={24} color="#6A1B9A" />
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </Animated.View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.recordButton]}
            onPress={() => navigation.navigate('Record')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="mic" size={24} color="white" />
            <Text style={styles.buttonText}>Record Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => navigation.navigate('Welcome')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="home" size={24} color="white" />
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  emoji: {
    fontSize: 84,
    marginBottom: 18,
  },
  moodText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6A1B9A',
    marginBottom: 10,
    letterSpacing: 1.1,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  summary: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '400',
    lineHeight: 26,
  },
  stressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  stressLabel: {
    fontSize: 18,
    color: '#6A1B9A',
    marginBottom: 10,
    fontWeight: '600',
  },
  stressMeter: {
    height: 20,
    backgroundColor: '#E1BEE7',
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
    fontWeight: '500',
  },
  suggestionsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  suggestionsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6A1B9A',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 17,
    color: '#4A148C',
    marginLeft: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 25,
    marginHorizontal: 8,
    backgroundColor: '#6A1B9A',
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  recordButton: {
    backgroundColor: '#6A1B9A',
  },
  homeButton: {
    backgroundColor: '#9575CD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
}); 