import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { usePadelScore } from '../hooks/usePadelScore';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { RootStackParamList } from '../types/navigation';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface GameScreenProps {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  navigation,
  route,
}) => {
  const totalSets = route.params.totalSets;
  const { matchScore, addPoint, undo, canUndo } = usePadelScore(totalSets);

  const player1Point = matchScore.currentGame.player1;
  const player2Point = matchScore.currentGame.player2;

  const player1HasAdvantage = player1Point === 'V';
  const player2HasAdvantage = player2Point === 'V';
  const isDeuce = player1Point === 45 && player2Point === 45;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.undoButton, !canUndo && styles.undoButtonDisabled]}
            onPress={undo}
            disabled={!canUndo}
          >
            <Text style={[styles.undoButtonText, !canUndo && styles.undoButtonTextDisabled]}>
              ←
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Partido de Padel</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => navigation.navigate('SetSelection')}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <TouchableOpacity
          style={styles.playerSection}
          onPress={() => addPoint(1)}
          activeOpacity={0.7}
        >
          <ScoreDisplay
            point={player1Point}
            sets={matchScore.player1Sets}
            isActive={player1HasAdvantage}
            hasAdvantage={player1HasAdvantage}
          />
          <Text style={styles.playerLabel}>Jugador 1</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.playerSection}
          onPress={() => addPoint(2)}
          activeOpacity={0.7}
        >
          <ScoreDisplay
            point={player2Point}
            sets={matchScore.player2Sets}
            isActive={player2HasAdvantage}
            hasAdvantage={player2HasAdvantage}
          />
          <Text style={styles.playerLabel}>Jugador 2</Text>
        </TouchableOpacity>
      </View>

      {isDeuce && (
        <View style={styles.deuceIndicator}>
          <Text style={styles.deuceText}>Deuce (45-45)</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  headerLeft: {
    width: 60,
    alignItems: 'flex-start',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  undoButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minHeight: 36,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  undoButtonDisabled: {
    backgroundColor: '#333333',
    opacity: 0.5,
  },
  undoButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  undoButtonTextDisabled: {
    color: '#666666',
  },
  resetButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    minHeight: 36,
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scoreContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  playerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 2,
    backgroundColor: '#333333',
  },
  playerLabel: {
    fontSize: 18,
    color: '#cccccc',
    marginTop: 10,
    fontWeight: '600',
  },
  deuceIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  deuceText: {
    fontSize: 18,
    color: '#FFC107',
    fontWeight: '700',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

