import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from '../screens';
import { AppStackParamList } from './types';
import { screenOptions } from './theme';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShown: true,
        title: 'BodyQ',
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  );
}
