import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HistoryItem {
  id: string;
  date: string;
  mood: string;
  stressLevel: number;
}

// Mock data - in a real app, this would come from storage or an API
const mockHistory: HistoryItem[] = [
  { id: '1', date: '2024-03-20', mood: 'Positive', stressLevel: 30 },
  { id: '2', date: '2024-03-19', mood: 'Neutral', stressLevel: 50 },
  { id: '3', date: '2024-03-18', mood: 'Stressed', stressLevel: 75 },
];

export default function History() {
  const router = useRouter();

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => {
        // In a real app, this would navigate to a detailed view
        router.push({
          pathname: '/result',
          params: { id: item.id }
        });
      }}
    >
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.moodContainer}>
        <Text style={styles.mood}>{item.mood}</Text>
        <View style={styles.stressBar}>
          <View style={[styles.stressLevel, { width: `${item.stressLevel}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood History</Text>
      <FlatList
        data={mockHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mood: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  stressBar: {
    flex: 2,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginLeft: 10,
  },
  stressLevel: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 