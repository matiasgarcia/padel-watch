import { SetScore } from './score';

export interface MatchHistoryEntry {
  id: string;
  date: number; // timestamp
  winner: 1 | 2;
  sets: SetScore[]; // Array de sets completados con sus juegos
  setsWon: { player1: number; player2: number };
}

export interface VersionedMatchHistory {
  version: number;
  data: MatchHistoryEntry[];
}

