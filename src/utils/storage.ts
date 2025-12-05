import AsyncStorage from '@react-native-async-storage/async-storage';
import { MatchHistoryEntry, VersionedMatchHistory } from '../types/matchHistory';
import { CURRENT_VERSION, migrateToVersion } from './migrations';

const MATCH_HISTORY_KEY = '@padel_match_history';

/**
 * Obtiene el historial versionado desde AsyncStorage
 * Detecta automáticamente si los datos están en formato antiguo (sin versión)
 * y los migra al formato versionado
 */
const getVersionedHistory = async (): Promise<VersionedMatchHistory> => {
  try {
    const data = await AsyncStorage.getItem(MATCH_HISTORY_KEY);
    if (data === null) {
      return { version: CURRENT_VERSION, data: [] };
    }

    const parsed = JSON.parse(data);

    // Detectar formato antiguo (array directo) - versión 0
    if (Array.isArray(parsed)) {
      // Tratar datos antiguos como versión 0 (sin versión)
      return { version: 0, data: parsed };
    }

    // Si es un objeto pero no tiene versión, tratarlo como versión 0
    if (typeof parsed === 'object' && parsed !== null && !('version' in parsed)) {
      return { version: 0, data: parsed.data || parsed };
    }

    // Si tiene versión, retornar tal cual
    if ('version' in parsed && 'data' in parsed) {
      return parsed as VersionedMatchHistory;
    }

    // Fallback: tratar como versión 0
    return { version: 0, data: Array.isArray(parsed) ? parsed : [] };
  } catch (error) {
    console.error('Error loading versioned history:', error);
    return { version: CURRENT_VERSION, data: [] };
  }
};

/**
 * Guarda el historial versionado en AsyncStorage
 */
const saveVersionedHistory = async (versionedHistory: VersionedMatchHistory): Promise<void> => {
  try {
    await AsyncStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(versionedHistory));
  } catch (error) {
    console.error('Error saving versioned history:', error);
    throw error;
  }
};

/**
 * Inicializa el almacenamiento y ejecuta migraciones si es necesario
 * Debe ser llamado una vez al inicio de la aplicación
 */
export const initializeStorage = async (): Promise<void> => {
  try {
    const versionedHistory = await getVersionedHistory();

    // Si ya está en la versión actual, no hay nada que hacer
    if (versionedHistory.version === CURRENT_VERSION) {
      return;
    }

    // Migrar a la versión actual
    const migratedData = migrateToVersion(
      CURRENT_VERSION,
      versionedHistory.data,
      versionedHistory.version
    );

    // Guardar la versión migrada
    await saveVersionedHistory({
      version: CURRENT_VERSION,
      data: migratedData,
    });
  } catch (error) {
    console.error('Error initializing storage:', error);
    // No lanzar el error para que la app pueda continuar funcionando
  }
};

/**
 * Obtiene los datos del historial asumiendo que ya están en la versión actual
 * (las migraciones se ejecutan en initializeStorage al inicio de la app)
 * Incluye un safety check que loguea un warning si la versión no es la esperada
 */
const getMatchHistoryData = async (): Promise<MatchHistoryEntry[]> => {
  const versionedHistory = await getVersionedHistory();

  // Safety check: si la versión no es la actual, algo salió mal con la inicialización
  if (versionedHistory.version !== CURRENT_VERSION) {
    console.warn(
      `Match history version mismatch: expected ${CURRENT_VERSION}, got ${versionedHistory.version}. ` +
      `This should not happen if initializeStorage() ran successfully.`
    );
    // Aún así retornamos los datos para que la app pueda continuar funcionando
  }

  return versionedHistory.data;
};

/**
 * Guarda un partido en el historial
 */
export const saveMatchToHistory = async (match: MatchHistoryEntry): Promise<void> => {
  try {
    const existingHistory = await getMatchHistoryData();
    const updatedHistory = [match, ...existingHistory];
    await saveVersionedHistory({
      version: CURRENT_VERSION,
      data: updatedHistory,
    });
  } catch (error) {
    console.error('Error saving match to history:', error);
    throw error;
  }
};

/**
 * Obtiene todo el historial de partidos
 * Nota: Las migraciones se ejecutan en initializeStorage() al inicio de la app
 */
export const getMatchHistory = async (): Promise<MatchHistoryEntry[]> => {
  try {
    return await getMatchHistoryData();
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
    const existingHistory = await getMatchHistoryData();
    const updatedHistory = existingHistory.filter(match => match.id !== matchId);
    await saveVersionedHistory({
      version: CURRENT_VERSION,
      data: updatedHistory,
    });
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

