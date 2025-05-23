import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { transcribeAudio } from '../services/speechToText';
import { analyzeAudio } from '../services/audioAnalysis';
import { analyzeMood } from '../services/openAI';

const MAX_RECORDING_DURATION = 30; // seconds
const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.32;

export default function RecordScreen() {
  const navigation = useNavigation();
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const timerRef = useRef(null);
  const waveformScale = useSharedValue(1);
  const fade = useSharedValue(0);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        Alert.alert('Error', 'Failed to request microphone permissions');
      }
    })();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recording) recording.stopAndUnloadAsync();
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      waveformScale.value = withRepeat(
        withSequence(
          withTiming(1.18, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      waveformScale.value = withTiming(1);
    }
  }, [isRecording]);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 900 });
  }, []);

  const waveformStyle = useAnimatedStyle(() => ({
    transform: [{ scale: waveformScale.value }],
    opacity: fade.value,
  }));
  const fadeInStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  const startRecording = async () => {
    try {
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Please grant microphone access to record audio');
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
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= MAX_RECORDING_DURATION) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      clearInterval(timerRef.current);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      setIsTranscribing(true);
      const transcript = await transcribeAudio(uri);
      const stressScore = await analyzeAudio(uri);
      const moodAnalysis = await analyzeMood(transcript);
      navigation.navigate('Result', {
        audioUri: uri,
        transcript,
        stressScore,
        moodAnalysis,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to process recording');
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Requesting microphone permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>No access to microphone</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerContainer, fadeInStyle]}>
        <Text style={styles.timer}>{formatTime(duration)}</Text>
        {/* Progress ring */}
        <View style={styles.progressRingBg}>
          <View style={[styles.progressRing, { width: `${(duration / MAX_RECORDING_DURATION) * 100}%` }]} />
        </View>
      </Animated.View>
      <Animated.View style={[styles.waveform, waveformStyle]}>
        <View style={styles.waveformInner} />
      </Animated.View>
      {isTranscribing ? (
        <Animated.View style={[styles.transcribingContainer, fadeInStyle]}>
          <ActivityIndicator size="large" color="#6A1B9A" />
          <Text style={styles.transcribingText}>Processing your recording...</Text>
        </Animated.View>
      ) : (
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name={isRecording ? 'stop' : 'mic'}
            size={44}
            color="#fff"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timer: {
    fontSize: 44,
    fontWeight: '700',
    color: '#6A1B9A',
    marginBottom: 8,
    letterSpacing: 1.2,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  progressRingBg: {
    width: BUTTON_SIZE + 16,
    height: 8,
    backgroundColor: '#E1BEE7',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressRing: {
    height: '100%',
    backgroundColor: '#6A1B9A',
    borderRadius: 4,
  },
  waveform: {
    width: BUTTON_SIZE * 1.2,
    height: BUTTON_SIZE * 0.3,
    borderRadius: BUTTON_SIZE * 0.15,
    backgroundColor: '#E1BEE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  waveformInner: {
    width: '80%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6A1B9A',
    opacity: 0.7,
  },
  recordButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#6A1B9A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  recordingButton: {
    backgroundColor: '#D32F2F',
  },
  transcribingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  transcribingText: {
    fontSize: 18,
    color: '#6A1B9A',
    marginTop: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 18,
    color: '#6A1B9A',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '500',
  },
}); 