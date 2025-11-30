export type RootStackParamList = {
  Home: undefined;
  Game: { totalSets?: number };
  Victory: { winner: 1 | 2; setsWon: { player1: number; player2: number } };
};

