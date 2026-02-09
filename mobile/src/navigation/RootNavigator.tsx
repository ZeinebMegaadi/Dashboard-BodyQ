import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { OnboardingStack } from './OnboardingStack';
import { AppStack } from './AppStack';
import { colors } from '../theme';

export function RootNavigator() {
  const { isAuthenticated, profileComplete, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.lime} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  if (!profileComplete) {
    return <OnboardingStack />;
  }

  return <AppStack />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
