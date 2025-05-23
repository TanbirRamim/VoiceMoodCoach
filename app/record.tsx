import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Record() {
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 30) {
            stopRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permission to record.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setTimer(0);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      setTimer(0);

      // Navigate to result page with the recording URI
      router.push({
        pathname: '/result',
        params: { recordingUri: uri }
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to stop recording');
      console.error('Failed to stop recording', err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{`${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`}</Text>
      
      <TouchableOpacity 
        style={[styles.recordButton, isRecording && styles.recordingButton]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <MaterialIcons 
          name={isRecording ? "stop" : "mic"} 
          size={48} 
          color="white" 
        />
      </TouchableOpacity>

      <Text style={styles.hint}>
        {isRecording ? "Tap to stop recording" : "Tap to start recording"}
      </Text>
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
  timer: {
    fontSize: 48,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  hint: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
}); 