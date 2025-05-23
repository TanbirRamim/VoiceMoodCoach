import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Result() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [analysis, setAnalysis] = useState({
    mood: 'Analyzing...',
    stressLevel: 50,
    suggestions: ['Loading suggestions...']
  });

  useEffect(() => {
    // Mock analysis - in a real app, this would call your API
    setTimeout(() => {
      setAnalysis({
        mood: 'Positive',
        stressLevel: 30,
        suggestions: [
          'Great job maintaining a positive attitude!',
          'Consider sharing your success with others',
          'Keep up the good work with your current routine'
        ]
      });
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analysis Results</Text>
      
      <View style={styles.resultCard}>
        <Text style={styles.label}>Detected Mood:</Text>
        <Text style={styles.value}>{analysis.mood}</Text>
        
        <Text style={styles.label}>Stress Level:</Text>
        <View style={styles.stressBar}>
          <View style={[styles.stressLevel, { width: `${analysis.stressLevel}%` }]} />
        </View>
        
        <Text style={styles.label}>Suggestions:</Text>
        {analysis.suggestions.map((suggestion, index) => (
          <Text key={index} style={styles.suggestion}>• {suggestion}</Text>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#666',
  },
  value: {
    fontSize: 24,
    color: '#4CAF50',
    marginBottom: 10,
  },
  stressBar: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  stressLevel: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  suggestion: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 