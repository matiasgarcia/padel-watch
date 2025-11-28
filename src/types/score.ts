export type GamePoint = 0 | 15 | 30 | 45 | 'V';

export interface GameScore {
  player1: GamePoint;
  player2: GamePoint;
}

export interface MatchScore {
  player1Sets: number;
  player2Sets: number;
  currentGame: GameScore;
  totalSets: number;
}

export interface PadelScoreState {
  matchScore: MatchScore;
  isGameWon: boolean;
  winner: 1 | 2 | null;
}

