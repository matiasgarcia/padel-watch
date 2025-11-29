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

  // Formatear puntaje para la pantalla grande
  const formatPoint = (point: typeof player1Point): string => {
    if (point === 'V') return 'V';
    return point.toString();
  };

  const displayScore = `${formatPoint(player1Point)} : ${formatPoint(player2Point)}`;

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
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => navigation.navigate('SetSelection')}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.teamsContainer}>
          {/* Equipo 1 */}
          <TouchableOpacity
            style={styles.teamRow}
            onPress={() => addPoint(1)}
            activeOpacity={0.7}
          >
            <Text style={styles.team1Label}>Equipo 1</Text>
            <View style={[styles.setsBox, styles.team1Box]}>
              <Text style={styles.setsBoxText}>{matchScore.player1Sets}</Text>
            </View>
          </TouchableOpacity>

          {/* Equipo 2 */}
          <TouchableOpacity
            style={styles.teamRow}
            onPress={() => addPoint(2)}
            activeOpacity={0.7}
          >
            <Text style={styles.team2Label}>Equipo 2</Text>
            <View style={[styles.setsBox, styles.team2Box]}>
              <Text style={styles.setsBoxText}>{matchScore.player2Sets}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Pantalla grande de puntaje */}
        <View style={styles.largeScoreDisplay}>
          <Text style={styles.largeScoreText}>{displayScore}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 2,
    paddingBottom: 2,
    marginBottom: 2,
    height: 30,
  },
  headerLeft: {
    width: 36,
    alignItems: 'flex-start',
  },
  headerRight: {
    width: 36,
    alignItems: 'flex-end',
  },
  undoButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    height: 24,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  undoButtonDisabled: {
    backgroundColor: '#333333',
    opacity: 0.5,
  },
  undoButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  undoButtonTextDisabled: {
    color: '#666666',
  },
  resetButton: {
    backgroundColor: '#f44336',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    height: 24,
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  teamsContainer: {
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingVertical: 2,
    height: 32,
  },
  team1Label: {
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '600',
    flex: 1,
  },
  team2Label: {
    fontSize: 13,
    color: '#FFC107',
    fontWeight: '600',
    flex: 1,
  },
  setsBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  team1Box: {
    backgroundColor: '#8B5CF6',
  },
  team2Box: {
    backgroundColor: '#3B82F6',
  },
  setsBoxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  largeScoreDisplay: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    height: 80,
  },
  largeScoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});

