import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AppRegistry } from 'react-native';
import GameScreen from './screens/GameScreen';
import HomeScreen from './screens/HomeScreen';
import ResultsScreen from './screens/ResultsScreen';

export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  Results: {
    score: number;
    foundWords: string;
    possibleWords: string;
    targetWord: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => App);
