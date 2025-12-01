import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreenSplit } from './src/screens/GameScreenSplit';
import { VictoryScreen } from './src/screens/VictoryScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000000' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="Game" 
          component={GameScreenSplit}
          initialParams={{ totalSets: 3 }}
        />
        <Stack.Screen name="Victory" component={VictoryScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

