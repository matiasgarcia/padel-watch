import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { saveMatchToHistory } from '../utils/storage';
import { MatchHistoryEntry } from '../types/matchHistory';

type VictoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Victory'>;
type VictoryScreenRouteProp = RouteProp<RootStackParamList, 'Victory'>;

interface VictoryScreenProps {
  navigation: VictoryScreenNavigationProp;
  route: VictoryScreenRouteProp;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  navigation,
  route,
}) => {
  const { winner, setsWon, sets } = route.params;

  // Guardar el partido en el historial al montar el componente
  useEffect(() => {
    const saveMatch = async () => {
      const matchEntry: MatchHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: Date.now(),
        winner,
        sets,
        setsWon,
      };
      try {
        await saveMatchToHistory(matchEntry);
      } catch (error) {
        console.error('Error saving match to history:', error);
      }
    };
    saveMatch();
  }, [winner, sets, setsWon]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.victoryContainer}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={1}
      >
        <View style={[styles.victoryHalf, winner === 1 ? styles.leftHalf : styles.rightHalf]}>
          <Text style={styles.victoryText}>¡Ganador!</Text>
          <Text style={styles.victoryPlayerText}>Equipo {winner}</Text>
          <Text style={styles.victoryScoreText}>
            {setsWon.player1} - {setsWon.player2}
          </Text>
          <Text style={styles.tapHintText}>Toca para volver</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  victoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  victoryHalf: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftHalf: {
    backgroundColor: '#2196F3',
  },
  rightHalf: {
    backgroundColor: '#F44336',
  },
  victoryText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  victoryPlayerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  victoryScoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.9,
    textAlign: 'center',
  },
  tapHintText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
  },
});

