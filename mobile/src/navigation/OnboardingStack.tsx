import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountSetupScreen } from '../screens';
import { OnboardingStackParamList } from './types';
import { screenOptions } from './theme';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen name="AccountSetup" component={AccountSetupScreen} />
    </Stack.Navigator>
  );
}
