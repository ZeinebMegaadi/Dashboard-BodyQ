import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StartYourJourneyScreen,
  SignUpScreen,
  LoginScreen,
} from '../screens';
import { AuthStackParamList } from './types';
import { screenOptions } from './theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
      initialRouteName="Start"
    >
      <Stack.Screen name="Start" component={StartYourJourneyScreen} />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: true, title: 'Sign up' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: true, title: 'Sign in' }}
      />
    </Stack.Navigator>
  );
}
