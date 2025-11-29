import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { usePadelScoreV3 } from '../hooks/usePadelScoreV3';

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
  const { matchScore, addPoint, undo, canUndo, matchWinner, getSetsWon } = usePadelScoreV3();

  const player1Point = matchScore.currentGame.player1;
  const player2Point = matchScore.currentGame.player2;

  // Formatear puntaje para mostrar
  const formatPoint = (point: typeof player1Point): string => {
    if (point === 'V') return 'V';
    return point.toString();
  };

  // Si estamos en tie-break, mostrar puntos del tie-break
  const displayPlayer1Score = matchScore.isTieBreak && matchScore.tieBreakScore
    ? matchScore.tieBreakScore.player1.toString()
    : formatPoint(player1Point);
  
  const displayPlayer2Score = matchScore.isTieBreak && matchScore.tieBreakScore
    ? matchScore.tieBreakScore.player2.toString()
    : formatPoint(player2Point);

  // Obtener juegos del set actual
  const currentSetGames = matchScore.currentSetGames;
  
  // Obtener sets ganados
  const setsWon = getSetsWon();

  // Manejar long press para deshacer
  const handleLongPress = () => {
    if (canUndo) {
      undo();
      Vibration.vibrate(50);
    }
  };

  // Manejar swipe de derecha a izquierda para cancelar partido
  const handleSwipeEnd = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent;
      // Detectar swipe de derecha a izquierda (translationX negativo y mayor que un umbral)
      // Y que no sea principalmente vertical (translationY menor que translationX)
      if (translationX < -100 && Math.abs(translationY) < Math.abs(translationX) * 0.5) {
        navigation.navigate('Home');
      }
    }
  };

  // Si hay un ganador, mostrar pantalla de victoria
  if (matchWinner) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.victoryContainer}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={1}
        >
          <View style={[styles.victoryHalf, matchWinner === 1 ? styles.leftHalf : styles.rightHalf]}>
            <Text style={styles.victoryText}>¡Ganador!</Text>
            <Text style={styles.victoryPlayerText}>Equipo {matchWinner}</Text>
            <Text style={styles.victoryScoreText}>
              {setsWon.player1} - {setsWon.player2}
            </Text>
            <Text style={styles.tapHintText}>Toca para volver</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <PanGestureHandler
          onHandlerStateChange={handleSwipeEnd}
          activeOffsetX={-10}
          failOffsetY={[-10, 10]}
          minPointers={1}
          maxPointers={1}
        >
          <View style={styles.splitContainer}>
            {/* Mitad izquierda - Azul - Jugador 1 */}
            <TouchableOpacity
              style={styles.leftHalf}
              onPress={() => addPoint(1)}
              onLongPress={handleLongPress}
              activeOpacity={0.8}
            >
              <View style={styles.scoreContainer}>
                {/* Puntos del juego actual */}
                <Text style={styles.scoreText}>{displayPlayer1Score}</Text>
                
                {/* Juegos del set actual */}
                <Text style={styles.gamesText}>{currentSetGames.player1}</Text>
                
                {/* Historial de sets completados */}
                {matchScore.sets.length > 0 && (
                  <View style={styles.historyContainer}>
                    {matchScore.sets.map((set, index) => (
                      <Text key={index} style={styles.historyText}>
                        Set {index + 1}: {set.player1}-{set.player2}
                      </Text>
                    ))}
                  </View>
                )}
                
                {/* Sets ganados totales */}
                <Text style={styles.setsText}>{setsWon.player1}</Text>
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
                {/* Puntos del juego actual */}
                <Text style={styles.scoreText}>{displayPlayer2Score}</Text>
                
                {/* Juegos del set actual */}
                <Text style={styles.gamesText}>{currentSetGames.player2}</Text>
                
                {/* Historial de sets completados */}
                {matchScore.sets.length > 0 && (
                  <View style={styles.historyContainer}>
                    {matchScore.sets.map((set, index) => (
                      <Text key={index} style={styles.historyText}>
                        Set {index + 1}: {set.player1}-{set.player2}
                      </Text>
                    ))}
                  </View>
                )}
                
                {/* Sets ganados totales */}
                <Text style={styles.setsText}>{setsWon.player2}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </PanGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
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
    flex: 1,
    paddingVertical: 20,
  },
  scoreText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  gamesText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  historyContainer: {
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 40,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
    textAlign: 'center',
  },
  setsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
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
    padding: 16,
  },
  victoryText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  victoryPlayerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  victoryScoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
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

