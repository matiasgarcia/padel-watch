import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type SetSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SetSelection'
>;

interface SetSelectionScreenProps {
  navigation: SetSelectionScreenNavigationProp;
}

export const SetSelectionScreen: React.FC<SetSelectionScreenProps> = ({
  navigation,
}) => {
  const [selectedSets, setSelectedSets] = useState<number>(3);

  const setOptions = [1, 3, 5];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Seleccionar Sets</Text>
        <Text style={styles.subtitle}>Elige la cantidad de sets</Text>

        <View style={styles.optionsContainer}>
          {setOptions.map((sets) => (
            <TouchableOpacity
              key={sets}
              style={[
                styles.optionButton,
                selectedSets === sets && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedSets(sets)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSets === sets && styles.optionTextSelected,
                ]}
              >
                {sets} {sets === 1 ? 'Set' : 'Sets'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => navigation.navigate('Game', { totalSets: selectedSets })}
        >
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  optionButton: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#333333',
    alignItems: 'center',
    minHeight: 60,
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
  },
  optionTextSelected: {
    color: '#000000',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    minWidth: 180,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

