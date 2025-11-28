import { useState, useCallback, useRef } from 'react';
import { GamePoint, MatchScore, PadelScoreState } from '../types/score';

const POINT_SEQUENCE: GamePoint[] = [0, 15, 30, 45];

export const usePadelScore = (totalSets: number) => {
  const initialScore: MatchScore = {
    player1Sets: 0,
    player2Sets: 0,
    currentGame: {
      player1: 0,
      player2: 0,
    },
    totalSets,
  };

  const [matchScore, setMatchScore] = useState<MatchScore>(initialScore);
  const historyRef = useRef<MatchScore[]>([initialScore]);

  const getNextPoint = (currentPoint: GamePoint, opponentPoint: GamePoint): GamePoint | 'WIN' => {
    if (currentPoint === 0) return 15;
    if (currentPoint === 15) return 30;
    if (currentPoint === 30) return 45;
    // Si está en 45, solo puede ir a V si el oponente también está en 45
    // Si el oponente está por debajo de 45, puede ganar directamente
    if (currentPoint === 45) {
      if (opponentPoint === 45) {
        return 'V'; // Deuce: necesita ventaja
      } else {
        return 'WIN'; // Puede ganar directamente
      }
    }
    if (currentPoint === 'V') return 'WIN';
    return currentPoint;
  };

  const resetGame = useCallback(() => {
    setMatchScore((prev) => {
      const resetScore: MatchScore = {
        ...prev,
        currentGame: {
          player1: 0 as GamePoint,
          player2: 0 as GamePoint,
        },
      };
      // Guardar el estado antes del reset en el historial
      historyRef.current.push({ ...prev });
      if (historyRef.current.length > 50) {
        historyRef.current.shift();
      }
      return resetScore;
    });
  }, []);

  const addPoint = useCallback(
    (player: 1 | 2) => {
      setMatchScore((prev) => {
        // Guardar el estado actual en el historial antes de modificarlo
        historyRef.current.push({ ...prev });
        
        // Limitar el historial a los últimos 50 estados para evitar problemas de memoria
        if (historyRef.current.length > 50) {
          historyRef.current.shift();
        }
        const { currentGame, player1Sets, player2Sets } = prev;
        const currentPoint = currentGame[`player${player}` as 'player1' | 'player2'];
        const opponentPoint = currentGame[`player${player === 1 ? 2 : 1}` as 'player1' | 'player2'];

        // Caso especial: ambos en 45 (deuce)
        if (currentPoint === 45 && opponentPoint === 45) {
          return {
            ...prev,
            currentGame: {
              ...currentGame,
              [`player${player}`]: 'V',
            },
          };
        }

        // Caso: jugador tiene ventaja y oponente tiene 45
        if (currentPoint === 'V' && opponentPoint === 45) {
          // Gana el juego
          const newSets: MatchScore = {
            ...prev,
            [`player${player}Sets`]: prev[`player${player}Sets` as 'player1Sets' | 'player2Sets'] + 1,
            currentGame: {
              player1: 0 as GamePoint,
              player2: 0 as GamePoint,
            },
          };
          return newSets;
        }

        // Caso: jugador tiene 45 y oponente tiene ventaja
        if (currentPoint === 45 && opponentPoint === 'V') {
          // Reset a 45-45 (deuce)
          return {
            ...prev,
            currentGame: {
              player1: 45,
              player2: 45,
            },
          };
        }

        // Caso: jugador tiene ventaja y oponente no está en 45
        if (currentPoint === 'V' && opponentPoint !== 45) {
          // Gana el juego
          const newSets: MatchScore = {
            ...prev,
            [`player${player}Sets`]: prev[`player${player}Sets` as 'player1Sets' | 'player2Sets'] + 1,
            currentGame: {
              player1: 0 as GamePoint,
              player2: 0 as GamePoint,
            },
          };
          return newSets;
        }

        // Caso normal: incrementar punto
        const nextPoint = getNextPoint(currentPoint, opponentPoint);
        if (nextPoint === 'WIN') {
          // Gana el juego
          const newSets: MatchScore = {
            ...prev,
            [`player${player}Sets`]: prev[`player${player}Sets` as 'player1Sets' | 'player2Sets'] + 1,
            currentGame: {
              player1: 0 as GamePoint,
              player2: 0 as GamePoint,
            },
          };
          return newSets;
        }

        return {
          ...prev,
          currentGame: {
            ...currentGame,
            [`player${player}`]: nextPoint,
          },
        };
      });
    },
    []
  );

  const resetMatch = useCallback(() => {
    const resetScore: MatchScore = {
      player1Sets: 0,
      player2Sets: 0,
      currentGame: {
        player1: 0,
        player2: 0,
      },
      totalSets,
    };
    setMatchScore(resetScore);
    historyRef.current = [resetScore];
  }, [totalSets]);

  const undo = useCallback(() => {
    if (historyRef.current.length > 1) {
      // Remover el estado actual del historial
      historyRef.current.pop();
      // Restaurar el estado anterior
      const previousState = historyRef.current[historyRef.current.length - 1];
      setMatchScore({ ...previousState });
    }
  }, []);

  const canUndo = historyRef.current.length > 1;

  return {
    matchScore,
    addPoint,
    resetGame,
    resetMatch,
    undo,
    canUndo,
  };
};

