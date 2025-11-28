import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GamePoint } from '../types/score';

interface ScoreDisplayProps {
  point: GamePoint;
  sets: number;
  isActive?: boolean;
  hasAdvantage?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  point,
  sets,
  isActive = false,
  hasAdvantage = false,
}) => {
  const displayPoint = point === 'V' ? 'V' : point.toString();

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <Text style={[styles.pointText, isActive && styles.activeText]}>
        {displayPoint}
      </Text>
      <Text style={[styles.setsText, isActive && styles.activeText]}>
        Sets: {sets}
      </Text>
      {hasAdvantage && (
        <Text style={styles.advantageText}>Ventaja</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  activeContainer: {
    backgroundColor: '#2a2a2a',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  pointText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  activeText: {
    color: '#4CAF50',
  },
  setsText: {
    fontSize: 20,
    color: '#cccccc',
    marginTop: 10,
    fontWeight: '500',
  },
  advantageText: {
    fontSize: 16,
    color: '#FFC107',
    marginTop: 6,
    fontWeight: '700',
  },
});

