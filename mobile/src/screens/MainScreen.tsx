import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button, Screen } from '../components';
import { colors, fontSizes, fontWeights } from '../theme';
import { useAuth } from '../context/AuthContext';

export function MainScreen() {
  const { user, logout } = useAuth();

  return (
    <Screen style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>BodyQ</Text>
        <Text style={styles.welcome}>
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}.
        </Text>
        <Text style={styles.subtitle}>Main app placeholder. Tabs and features go here.</Text>
        <Button title="Sign out" onPress={logout} variant="secondary" style={styles.button} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, justifyContent: 'center' },
  content: { alignItems: 'center' },
  title: {
    color: colors.lime,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    marginBottom: 8,
  },
  welcome: { color: colors.textPrimary, fontSize: fontSizes.lg, marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: fontSizes.sm, marginBottom: 24 },
  button: { minWidth: 160 },
});
