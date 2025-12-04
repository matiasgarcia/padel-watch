import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { getMatchHistory, removeMatchFromHistory } from '../utils/storage';
import { MatchHistoryEntry } from '../types/matchHistory';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

interface HistoryScreenProps {
  navigation: HistoryScreenNavigationProp;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [matches, setMatches] = useState<MatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  // Recargar historial cuando la pantalla recibe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await getMatchHistory();
      // Ordenar por fecha descendente (más recientes primero)
      const sortedHistory = history.sort((a, b) => b.date - a.date);
      setMatches(sortedHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const handleDeleteMatch = async (matchId: string) => {
    try {
      await removeMatchFromHistory(matchId);
      // Actualizar el estado local removiendo el partido eliminado
      setMatches(prevMatches => prevMatches.filter(match => match.id !== matchId));
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  const renderMatchItem = ({ item }: { item: MatchHistoryEntry }) => {
    const isPlayer1Winner = item.winner === 1;
    const winnerColor = isPlayer1Winner ? '#2196F3' : '#F44336';
    const winnerText = isPlayer1Winner ? 'Equipo 1' : 'Equipo 2';
    const setScoreText = item.sets.map((set, index) => {
      return `${set.player1}-${set.player2}`;
    }).join(', ');

    return (
      <View style={[styles.matchItem, { borderLeftColor: winnerColor }]}>
        <View style={styles.matchHeader}>
          <View style={[styles.winnerBadge]}>
            <Text style={[styles.winnerText, { color: winnerColor }]}>{winnerText + ':'}</Text>
            <Text style={styles.setsWonText}>
              {item.setsWon.player1} - {item.setsWon.player2}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteMatch(item.id)}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.matchContent}>
          <View style={styles.setsDetail}>
            <Text style={styles.setScore}>{setScoreText}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Historial</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (matches.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Historial</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No hay partidos guardados</Text>
          <Text style={styles.emptySubtext}>
            Los partidos se guardarán automáticamente al finalizar
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Historial</Text>
      </View>
      <FlatList
        data={matches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  matchItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  dateText: {
    fontSize: 10,
    color: '#999999',
    flex: 1,
  },
  winnerBadge: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flex: 1,
    flexDirection: 'row',
    gap: 2,
  },
  winnerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchContent: {
    marginTop: 0,
  },
  setsWonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  setsDetail: {
    gap: 0,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  setLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginRight: 8,
    minWidth: 50,
  },
  setScore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 18,
    color: '#999999',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

