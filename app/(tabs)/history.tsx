import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

type Session = {
  id: string;
  date: string;
  transcript: string;
  stressScore: number;
  moodAnalysis: {
    mood: string;
    sentiment: string;
    summary: string;
  };
};

type RootStackParamList = {
  result: {
    audioUri: string;
    transcript: string;
    stressScore: number;
    moodAnalysis: {
      mood: string;
      sentiment: string;
      summary: string;
    };
  };
};

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const getMoodEmoji = (mood: string) => {
  switch (mood.toLowerCase()) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'anxious': return '😰';
    case 'neutral': return '😐';
    default: return '😐';
  }
};

export default function HistoryScreen() {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const storedSessions = await AsyncStorage.getItem('sessions');
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: Session }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => navigation.navigate('result', {
        audioUri: '', // We don't store audio files in history
        transcript: item.transcript,
        stressScore: item.stressScore,
        moodAnalysis: item.moodAnalysis,
      })}
    >
      <View style={styles.sessionHeader}>
        <ThemedText style={styles.emoji}>{getMoodEmoji(item.moodAnalysis.mood)}</ThemedText>
        <ThemedText style={styles.date}>{formatDate(item.date)}</ThemedText>
      </View>
      
      <ThemedText style={styles.summary} numberOfLines={2}>
        {item.moodAnalysis.summary}
      </ThemedText>
      
      <View style={styles.stressContainer}>
        <ThemedText style={styles.stressLabel}>Stress Level:</ThemedText>
        <ThemedText style={styles.stressScore}>{item.stressScore}/10</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Your History</ThemedText>
      {sessions.length > 0 ? (
        <FlatList
          data={sessions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="history" size={64} color="#4A148C" />
          <ThemedText style={styles.emptyText}>No recordings yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Your mood analysis history will appear here
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A148C',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContent: {
    padding: 16,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 24,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  summary: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  stressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  stressLabel: {
    fontSize: 14,
    color: '#666',
  },
  stressScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
}); 