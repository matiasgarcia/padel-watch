export type GamePoint = 0 | 15 | 30 | 40 | 'V';

export interface GameScore {
  player1: GamePoint;
  player2: GamePoint;
}

export interface MatchScore {
  player1Sets: number;
  player2Sets: number;
  currentGame: GameScore;
  totalSets: number;
  isTieBreak: boolean;
  tieBreakScore?: {
    player1: number;
    player2: number;
  };
}

export interface PadelScoreState {
  matchScore: MatchScore;
  isGameWon: boolean;
  winner: 1 | 2 | null;
}

// Nuevos tipos para el sistema V3
export interface SetScore {
  player1: number;
  player2: number;
}

export interface MatchScoreV3 {
  sets: SetScore[]; // Array de sets completados con sus juegos
  currentSetGames: SetScore; // Juegos del set actual en progreso
  currentGame: GameScore; // Puntos del juego actual
  isTieBreak: boolean;
  tieBreakScore?: {
    player1: number;
    player2: number;
  };
  totalSets: number;
  matchWinner: 1 | 2 | null;
}

