import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SetSelectionScreen } from './src/screens/SetSelectionScreen';
import { GameScreenSplit } from './src/screens/GameScreenSplit';
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SetSelection"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000000' },
        }}
      >
        <Stack.Screen name="SetSelection" component={SetSelectionScreen} />
        <Stack.Screen name="Game" component={GameScreenSplit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

