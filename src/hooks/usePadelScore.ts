import { useState, useCallback, useRef } from 'react';
import { GamePoint, MatchScore, PadelScoreState } from '../types/score';

const POINT_SEQUENCE: GamePoint[] = [0, 15, 30, 40];

export const usePadelScore = (totalSets: number) => {
  const initialScore: MatchScore = {
    player1Sets: 0,
    player2Sets: 0,
    currentGame: {
      player1: 0,
      player2: 0,
    },
    totalSets,
    isTieBreak: false,
  };

  const [matchScore, setMatchScore] = useState<MatchScore>(initialScore);
  const historyRef = useRef<MatchScore[]>([initialScore]);

  // Verificar si se gana un set
  const checkSetWin = (player1Sets: number, player2Sets: number): boolean => {
    // Gana con 6 juegos y ventaja de 2
    if (player1Sets >= 6 && player1Sets - player2Sets >= 2) return true;
    if (player2Sets >= 6 && player2Sets - player1Sets >= 2) return true;
    // Gana con 7-5
    if (player1Sets === 7 && player2Sets === 5) return true;
    if (player2Sets === 7 && player1Sets === 5) return true;
    return false;
  };

  // Verificar si se debe jugar tie-break
  const shouldPlayTieBreak = (player1Sets: number, player2Sets: number): boolean => {
    return player1Sets === 6 && player2Sets === 6;
  };

  // Verificar si se gana el tie-break
  const checkTieBreakWin = (player1Points: number, player2Points: number): boolean => {
    // Gana con 7 puntos y ventaja de 2
    if (player1Points >= 7 && player1Points - player2Points >= 2) return true;
    if (player2Points >= 7 && player2Points - player1Points >= 2) return true;
    return false;
  };

  // Verificar si se gana el partido (2 de 3 sets)
  const checkMatchWin = (player1Sets: number, player2Sets: number, totalSets: number): 1 | 2 | null => {
    const setsToWin = Math.ceil(totalSets / 2); // Para 3 sets, se necesitan 2
    if (player1Sets >= setsToWin) return 1;
    if (player2Sets >= setsToWin) return 2;
    return null;
  };

  // Manejar cuando se gana un juego
  const handleGameWin = (prev: MatchScore, player: 1 | 2): MatchScore => {
    const newPlayer1Sets = player === 1 ? prev.player1Sets + 1 : prev.player1Sets;
    const newPlayer2Sets = player === 2 ? prev.player2Sets + 1 : prev.player2Sets;

    // Verificar si se debe jugar tie-break (6-6)
    if (shouldPlayTieBreak(newPlayer1Sets, newPlayer2Sets)) {
      return {
        ...prev,
        player1Sets: newPlayer1Sets,
        player2Sets: newPlayer2Sets,
        currentGame: {
          player1: 0 as GamePoint,
          player2: 0 as GamePoint,
        },
        isTieBreak: true,
        tieBreakScore: {
          player1: 0,
          player2: 0,
        },
      };
    }

    // Verificar si se gana el set
    if (checkSetWin(newPlayer1Sets, newPlayer2Sets)) {
      return {
        ...prev,
        player1Sets: newPlayer1Sets,
        player2Sets: newPlayer2Sets,
        currentGame: {
          player1: 0 as GamePoint,
          player2: 0 as GamePoint,
        },
        isTieBreak: false,
        tieBreakScore: undefined,
      };
    }

    // Continuar el set
    return {
      ...prev,
      player1Sets: newPlayer1Sets,
      player2Sets: newPlayer2Sets,
      currentGame: {
        player1: 0 as GamePoint,
        player2: 0 as GamePoint,
      },
    };
  };

  const getNextPoint = (currentPoint: GamePoint, opponentPoint: GamePoint): GamePoint | 'WIN' => {
    if (currentPoint === 0) return 15;
    if (currentPoint === 15) return 30;
    if (currentPoint === 30) return 40;
    // Si está en 40, solo puede ir a V si el oponente también está en 40
    // Si el oponente está por debajo de 40, puede ganar directamente
    if (currentPoint === 40) {
      if (opponentPoint === 40) {
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
        // Si estamos en tie-break, manejar puntos del tie-break directamente
        if (prev.isTieBreak && prev.tieBreakScore) {
          const newTieBreakScore = {
            player1: player === 1 ? prev.tieBreakScore.player1 + 1 : prev.tieBreakScore.player1,
            player2: player === 2 ? prev.tieBreakScore.player2 + 1 : prev.tieBreakScore.player2,
          };

          // Verificar si se gana el tie-break (7 puntos con ventaja de 2)
          if (checkTieBreakWin(newTieBreakScore.player1, newTieBreakScore.player2)) {
            // Gana el tie-break y el set (el set se incrementa a 7)
            const newPlayer1Sets = player === 1 ? prev.player1Sets + 1 : prev.player1Sets;
            const newPlayer2Sets = player === 2 ? prev.player2Sets + 1 : prev.player2Sets;
            
            return {
              ...prev,
              player1Sets: newPlayer1Sets,
              player2Sets: newPlayer2Sets,
              currentGame: {
                player1: 0 as GamePoint,
                player2: 0 as GamePoint,
              },
              isTieBreak: false,
              tieBreakScore: undefined,
            };
          }

          // Continuar tie-break
          return {
            ...prev,
            tieBreakScore: newTieBreakScore,
          };
        }

        const { currentGame, player1Sets, player2Sets } = prev;
        const currentPoint = currentGame[`player${player}` as 'player1' | 'player2'];
        const opponentPoint = currentGame[`player${player === 1 ? 2 : 1}` as 'player1' | 'player2'];

        // Caso especial: ambos en 40 (deuce)
        if (currentPoint === 40 && opponentPoint === 40) {
          return {
            ...prev,
            currentGame: {
              ...currentGame,
              [`player${player}`]: 'V',
            },
          };
        }

        // Caso: jugador tiene ventaja y oponente tiene 40
        if (currentPoint === 'V' && opponentPoint === 40) {
          // Gana el juego
          return handleGameWin(prev, player);
        }

        // Caso: jugador tiene 40 y oponente tiene ventaja
        if (currentPoint === 40 && opponentPoint === 'V') {
          // Reset a 40-40 (deuce)
          return {
            ...prev,
            currentGame: {
              player1: 40,
              player2: 40,
            },
          };
        }

        // Caso: jugador tiene ventaja y oponente no está en 40
        if (currentPoint === 'V' && opponentPoint !== 40) {
          // Gana el juego
          return handleGameWin(prev, player);
        }

        // Caso normal: incrementar punto
        const nextPoint = getNextPoint(currentPoint, opponentPoint);
        if (nextPoint === 'WIN') {
          // Gana el juego
          return handleGameWin(prev, player);
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
      isTieBreak: false,
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
  const matchWinner = checkMatchWin(matchScore.player1Sets, matchScore.player2Sets, totalSets);

  return {
    matchScore,
    addPoint,
    resetGame,
    resetMatch,
    undo,
    canUndo,
    matchWinner,
  };
};

