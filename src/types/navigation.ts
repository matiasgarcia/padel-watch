import { SetScore } from './score';

export type RootStackParamList = {
  Home: undefined;
  Game: { totalSets?: number };
  Victory: { 
    winner: 1 | 2; 
    setsWon: { player1: number; player2: number };
    sets: SetScore[];
  };
  History: undefined;
};

