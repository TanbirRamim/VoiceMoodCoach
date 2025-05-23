import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Mood Coach</Text>
      <TouchableOpacity 
        style={styles.recordButton}
        onPress={() => router.push('/record')}
      >
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <MaterialIcons name="mic" size={48} color="white" />
        </Animated.View>
        <Text style={styles.buttonText}>Start Recording</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.historyButton}
        onPress={() => router.push('/history')}
      >
        <Text style={styles.historyButtonText}>View History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  recordButton: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  historyButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    elevation: 3,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 16,
  },
}); 