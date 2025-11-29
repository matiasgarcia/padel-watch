import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { usePadelScore } from '../hooks/usePadelScore';
import { RootStackParamList } from '../types/navigation';

type GameScreenSplitNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenSplitRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface GameScreenSplitProps {
  navigation: GameScreenSplitNavigationProp;
  route: GameScreenSplitRouteProp;
}

export const GameScreenSplit: React.FC<GameScreenSplitProps> = ({
  navigation,
  route,
}) => {
  const totalSets = route.params.totalSets;
  const { matchScore, addPoint, undo, canUndo } = usePadelScore(totalSets);

  const player1Point = matchScore.currentGame.player1;
  const player2Point = matchScore.currentGame.player2;

  // Formatear puntaje para mostrar
  const formatPoint = (point: typeof player1Point): string => {
    if (point === 'V') return 'V';
    return point.toString();
  };

  // Manejar long press para deshacer
  const handleLongPress = () => {
    if (canUndo) {
      undo();
      Vibration.vibrate(50);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.splitContainer}>
        {/* Mitad izquierda - Azul - Jugador 1 */}
        <TouchableOpacity
          style={styles.leftHalf}
          onPress={() => addPoint(1)}
          onLongPress={handleLongPress}
          activeOpacity={0.8}
        >
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{formatPoint(player1Point)}</Text>
            <Text style={styles.setsText}>{matchScore.player1Sets}</Text>
          </View>
        </TouchableOpacity>

        {/* Mitad derecha - Rojo - Jugador 2 */}
        <TouchableOpacity
          style={styles.rightHalf}
          onPress={() => addPoint(2)}
          onLongPress={handleLongPress}
          activeOpacity={0.8}
        >
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{formatPoint(player2Point)}</Text>
            <Text style={styles.setsText}>{matchScore.player2Sets}</Text>
          </View>
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
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftHalf: {
    flex: 1,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightHalf: {
    flex: 1,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  setsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 0,
    opacity: 0.9,
  },
});

