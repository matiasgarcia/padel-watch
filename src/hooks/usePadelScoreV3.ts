import { useState, useCallback, useRef } from 'react';
import { GamePoint, MatchScoreV3, SetScore } from '../types/score';

/**
 * Hook para manejar el sistema de puntuación de pádel V3
 * 
 * Reglas implementadas:
 * - Partido al mejor de 3 sets (gana quien gane 2 sets)
 * - Set se gana con 6 juegos y diferencia de 2, o 7-5, o 7-6 tras tie-break
 * - Set 1 y 2: tie-break a 6-6 (primero a 7 con diferencia de 2)
 * - Set 3: NO hay tie-break, se juega hasta diferencia de 2 juegos
 * - Puntos: 0 → 15 → 30 → 40 → ventaja → juego ganado
 * - Deuce (40-40): requiere ventaja y luego punto de juego
 */
export const usePadelScoreV3 = () => {
  const initialScore: MatchScoreV3 = {
    sets: [],
    currentSetGames: { player1: 0, player2: 0 },
    currentGame: {
      player1: 0,
      player2: 0,
    },
    isTieBreak: false,
    totalSets: 3,
    matchWinner: null,
  };

  const [matchScore, setMatchScore] = useState<MatchScoreV3>(initialScore);
  const historyRef = useRef<MatchScoreV3[]>([initialScore]);

  /**
   * Obtiene el número de set actual (1, 2 o 3)
   */
  const getCurrentSetNumber = (): number => {
    return matchScore.sets.length + 1;
  };

  /**
   * Obtiene el número de sets ganados por cada jugador
   */
  const getSetsWon = (): { player1: number; player2: number } => {
    return {
      player1: matchScore.sets.filter(s => s.player1 > s.player2).length,
      player2: matchScore.sets.filter(s => s.player2 > s.player1).length,
    };
  };

  /**
   * Verifica si se debe jugar tie-break en el set actual
   * Regla: Set 1 y 2 sí tienen tie-break a 6-6, Set 3 NO
   */
  const shouldPlayTieBreak = (
    player1Games: number,
    player2Games: number
  ): boolean => {
    if (player1Games === 6 && player2Games === 6) {
      const currentSet = getCurrentSetNumber();
      // En el tercer set NO hay tie-break
      if (currentSet === 3) {
        return false;
      }
      return true;
    }
    return false;
  };

  /**
   * Verifica si se gana un set
   * Reglas:
   * - 6 juegos con diferencia mínima de 2
   * - 7-5 (si llega a 5-5)
   * - 7-6 si gana el tie-break
   * - En set 3: se juega hasta diferencia de 2 (sin tie-break)
   */
  const checkSetWin = (
    player1Games: number,
    player2Games: number
  ): { won: boolean; winner: 1 | 2 | null } => {
    const currentSet = getCurrentSetNumber();

    // En el set 3, no hay tie-break, se juega hasta diferencia de 2
    if (currentSet === 3) {
      if (player1Games >= 6 && player1Games - player2Games >= 2) {
        return { won: true, winner: 1 };
      }
      if (player2Games >= 6 && player2Games - player1Games >= 2) {
        return { won: true, winner: 2 };
      }
      return { won: false, winner: null };
    }

    // Sets 1 y 2: gana con 6 juegos y ventaja de 2
    if (player1Games >= 6 && player1Games - player2Games >= 2) {
      return { won: true, winner: 1 };
    }
    if (player2Games >= 6 && player2Games - player1Games >= 2) {
      return { won: true, winner: 2 };
    }

    // Gana con 7-5
    if (player1Games === 7 && player2Games === 5) {
      return { won: true, winner: 1 };
    }
    if (player2Games === 7 && player1Games === 5) {
      return { won: true, winner: 2 };
    }

    return { won: false, winner: null };
  };

  /**
   * Verifica si se gana el tie-break
   * Gana con 7 puntos y ventaja mínima de 2
   */
  const checkTieBreakWin = (
    player1Points: number,
    player2Points: number
  ): { won: boolean; winner: 1 | 2 | null } => {
    if (player1Points >= 7 && player1Points - player2Points >= 2) {
      return { won: true, winner: 1 };
    }
    if (player2Points >= 7 && player2Points - player1Points >= 2) {
      return { won: true, winner: 2 };
    }
    return { won: false, winner: null };
  };

  /**
   * Verifica si se gana el partido
   * Gana quien gane 2 sets de 3
   */
  const checkMatchWin = (sets: SetScore[]): 1 | 2 | null => {
    const setsWon = {
      player1: sets.filter(s => s.player1 > s.player2).length,
      player2: sets.filter(s => s.player2 > s.player1).length,
    };

    if (setsWon.player1 >= 2) return 1;
    if (setsWon.player2 >= 2) return 2;
    return null;
  };

  /**
   * Obtiene el siguiente punto en la secuencia del juego
   */
  const getNextPoint = (
    currentPoint: GamePoint,
    opponentPoint: GamePoint
  ): GamePoint | 'WIN' => {
    if (currentPoint === 0) return 15;
    if (currentPoint === 15) return 30;
    if (currentPoint === 30) return 40;

    // Si está en 40
    if (currentPoint === 40) {
      // Si el oponente también está en 40, va a ventaja
      if (opponentPoint === 40) {
        return 'V';
      }
      // Si el oponente está por debajo de 40, gana el juego
      return 'WIN';
    }

    // Si tiene ventaja, gana el juego
    if (currentPoint === 'V') return 'WIN';

    return currentPoint;
  };

  /**
   * Maneja cuando un jugador gana un juego
   */
  const handleGameWin = (prev: MatchScoreV3, player: 1 | 2): MatchScoreV3 => {
    const newPlayer1Games =
      player === 1
        ? prev.currentSetGames.player1 + 1
        : prev.currentSetGames.player1;
    const newPlayer2Games =
      player === 2
        ? prev.currentSetGames.player2 + 1
        : prev.currentSetGames.player2;

    const newCurrentSetGames: SetScore = {
      player1: newPlayer1Games,
      player2: newPlayer2Games,
    };

    // Verificar si se debe jugar tie-break (6-6)
    if (shouldPlayTieBreak(newPlayer1Games, newPlayer2Games)) {
      return {
        ...prev,
        currentSetGames: newCurrentSetGames,
        currentGame: {
          player1: 0,
          player2: 0,
        },
        isTieBreak: true,
        tieBreakScore: {
          player1: 0,
          player2: 0,
        },
      };
    }

    // Verificar si se gana el set
    const setWin = checkSetWin(newPlayer1Games, newPlayer2Games);
    if (setWin.won) {
      // Agregar el set completado al historial
      const completedSet: SetScore = {
        player1: newPlayer1Games,
        player2: newPlayer2Games,
      };
      const newSets = [...prev.sets, completedSet];

      // Verificar si se gana el partido
      const matchWinner = checkMatchWin(newSets);

      return {
        ...prev,
        sets: newSets,
        currentSetGames: { player1: 0, player2: 0 },
        currentGame: {
          player1: 0,
          player2: 0,
        },
        isTieBreak: false,
        tieBreakScore: undefined,
        matchWinner,
      };
    }

    // Continuar el set (aún no se ha ganado)
    return {
      ...prev,
      currentSetGames: newCurrentSetGames,
      currentGame: {
        player1: 0,
        player2: 0,
      },
    };
  };

  /**
   * Maneja cuando un jugador gana el tie-break (y por tanto el set)
   */
  const handleTieBreakWin = (
    prev: MatchScoreV3,
    player: 1 | 2
  ): MatchScoreV3 => {
    // El ganador del tie-break gana el set (7-6)
    const completedSet: SetScore = {
      player1: prev.currentSetGames.player1,
      player2: prev.currentSetGames.player2,
    };
    // El ganador del tie-break gana el set
    if (player === 1) {
      completedSet.player1 = 7;
      completedSet.player2 = 6;
    } else {
      completedSet.player1 = 6;
      completedSet.player2 = 7;
    }

    const newSets = [...prev.sets, completedSet];

    // Verificar si se gana el partido
    const matchWinner = checkMatchWin(newSets);

    return {
      ...prev,
      sets: newSets,
      currentSetGames: { player1: 0, player2: 0 },
      currentGame: {
        player1: 0,
        player2: 0,
      },
      isTieBreak: false,
      tieBreakScore: undefined,
      matchWinner,
    };
  };

  /**
   * Agrega un punto al jugador especificado
   */
  const addPoint = useCallback(
    (player: 1 | 2) => {
      setMatchScore((prev) => {
        // Si ya hay un ganador, no hacer nada
        if (prev.matchWinner) {
          return prev;
        }

        // Guardar estado actual en historial
        historyRef.current.push({ ...prev });
        if (historyRef.current.length > 50) {
          historyRef.current.shift();
        }

        // Si estamos en tie-break
        if (prev.isTieBreak && prev.tieBreakScore) {
          const newTieBreakScore = {
            player1:
              player === 1
                ? prev.tieBreakScore.player1 + 1
                : prev.tieBreakScore.player1,
            player2:
              player === 2
                ? prev.tieBreakScore.player2 + 1
                : prev.tieBreakScore.player2,
          };

          // Verificar si se gana el tie-break
          const tieBreakWin = checkTieBreakWin(
            newTieBreakScore.player1,
            newTieBreakScore.player2
          );

          if (tieBreakWin.won) {
            return handleTieBreakWin(prev, tieBreakWin.winner!);
          }

          // Continuar tie-break
          return {
            ...prev,
            tieBreakScore: newTieBreakScore,
          };
        }

        // Juego normal
        const { currentGame } = prev;
        const currentPoint =
          currentGame[`player${player}` as 'player1' | 'player2'];
        const opponentPoint =
          currentGame[`player${player === 1 ? 2 : 1}` as 'player1' | 'player2'];

        // Caso: ambos en 40 (deuce)
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
          return handleGameWin(prev, player);
        }

        // Caso: jugador tiene 40 y oponente tiene ventaja (pierde la ventaja)
        if (currentPoint === 40 && opponentPoint === 'V') {
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
          return handleGameWin(prev, player);
        }

        // Caso normal: incrementar punto
        const nextPoint = getNextPoint(currentPoint, opponentPoint);
        if (nextPoint === 'WIN') {
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

  /**
   * Reinicia el partido completo
   */
  const resetMatch = useCallback(() => {
    const resetScore: MatchScoreV3 = {
      sets: [],
      currentSetGames: { player1: 0, player2: 0 },
      currentGame: {
        player1: 0,
        player2: 0,
      },
      isTieBreak: false,
      totalSets: 3,
      matchWinner: null,
    };
    setMatchScore(resetScore);
    historyRef.current = [resetScore];
  }, []);

  /**
   * Deshace el último punto
   */
  const undo = useCallback(() => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      const previousState = historyRef.current[historyRef.current.length - 1];
      setMatchScore({ ...previousState });
    }
  }, []);

  const canUndo = historyRef.current.length > 1;
  const setsWon = getSetsWon();

  return {
    matchScore,
    addPoint,
    resetMatch,
    undo,
    canUndo,
    matchWinner: matchScore.matchWinner,
    getSetsWon: () => setsWon,
    getCurrentSet: getCurrentSetNumber,
  };
};

