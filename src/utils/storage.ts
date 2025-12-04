import AsyncStorage from '@react-native-async-storage/async-storage';
import { MatchHistoryEntry } from '../types/matchHistory';

const MATCH_HISTORY_KEY = '@padel_match_history';

/**
 * Guarda un partido en el historial
 */
export const saveMatchToHistory = async (match: MatchHistoryEntry): Promise<void> => {
  try {
    const existingHistory = await getMatchHistory();
    const updatedHistory = [match, ...existingHistory];
    await AsyncStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving match to history:', error);
    throw error;
  }
};

/**
 * Obtiene todo el historial de partidos
 */
export const getMatchHistory = async (): Promise<MatchHistoryEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(MATCH_HISTORY_KEY);
    if (data === null) {
      return [];
    }
    return JSON.parse(data) as MatchHistoryEntry[];
  } catch (error) {
    console.error('Error loading match history:', error);
    return [];
  }
};

/**
 * Elimina un partido específico del historial por su ID
 */
export const removeMatchFromHistory = async (matchId: string): Promise<void> => {
  try {
    const existingHistory = await getMatchHistory();
    const updatedHistory = existingHistory.filter(match => match.id !== matchId);
    await AsyncStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error removing match from history:', error);
    throw error;
  }
};

/**
 * Limpia todo el historial de partidos
 */
export const clearMatchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(MATCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing match history:', error);
    throw error;
  }
};

