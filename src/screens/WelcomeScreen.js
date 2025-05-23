import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const MIC_BUTTON_SIZE = width * 0.32;

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const scale = useSharedValue(1);
  const fade = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    fade.value = withTiming(1, { duration: 1200 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const fadeInStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  return (
    <LinearGradient
      colors={["#F8FAFC", "#E1BEE7"]}
      style={styles.container}
    >
      <Animated.View style={[fadeInStyle, { width: '100%' }]}> 
        <Text style={styles.title}>VoiceMood Coach</Text>
      </Animated.View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Record')}
          style={styles.micButtonContainer}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.micButton, animatedStyle, fadeInStyle]}>
            <MaterialIcons name="mic" size={54} color="#6A1B9A" />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <Animated.View style={[fadeInStyle, { width: '100%' }]}> 
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="history" size={24} color="#6A1B9A" />
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#6A1B9A',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
    letterSpacing: 1.2,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  micButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  micButton: {
    width: MIC_BUTTON_SIZE,
    height: MIC_BUTTON_SIZE,
    borderRadius: MIC_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  historyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6A1B9A',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
}); 