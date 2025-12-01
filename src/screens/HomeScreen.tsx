import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Game', { totalSets: 3 })}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Empezar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
          activeOpacity={0.8}
        >
          <Text style={styles.historyButtonText}>Historial</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  startButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 140,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  historyButton: {
    backgroundColor: '#333333',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#555555',
  },
  historyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

