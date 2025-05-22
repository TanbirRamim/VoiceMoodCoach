import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  useSharedValue,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const MIC_BUTTON_SIZE = width * 0.3;

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const scale = useSharedValue(1);

  // Start the pulsing animation when component mounts
  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <LinearGradient
      colors={['#E0F7FA', '#E1BEE7']}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome to VoiceMood Coach</Text>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Record')}
        style={styles.micButtonContainer}
      >
        <Animated.View style={[styles.micButton, animatedStyle]}>
          <MaterialIcons name="mic" size={40} color="#4A148C" />
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
      >
        <MaterialIcons name="history" size={24} color="#4A148C" />
        <Text style={styles.historyButtonText}>History</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A148C',
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  micButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: MIC_BUTTON_SIZE,
    height: MIC_BUTTON_SIZE,
    borderRadius: MIC_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A148C',
    marginLeft: 8,
  },
}); 