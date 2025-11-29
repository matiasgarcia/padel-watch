import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GamePoint } from '../types/score';

interface ScoreDisplayProps {
  point: GamePoint;
  sets: number;
  isActive?: boolean;
  hasAdvantage?: boolean;
  backgroundColor?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  point,
  sets,
  isActive = false,
  hasAdvantage = false,
  backgroundColor = '#1a1a1a',
}) => {
  const displayPoint = point === 'V' ? 'V' : point.toString();

  return (
    <View style={[styles.container, { backgroundColor }, isActive && styles.activeContainer]}>
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
    padding: 12,
    minHeight: 0,
  },
  activeContainer: {
    backgroundColor: '#2a2a2a',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  pointText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  activeText: {
    color: '#4CAF50',
  },
  setsText: {
    fontSize: 18,
    color: '#cccccc',
    marginTop: 6,
    fontWeight: '500',
  },
  advantageText: {
    fontSize: 14,
    color: '#FFC107',
    marginTop: 4,
    fontWeight: '700',
  },
});

