import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Screen } from '../components';
import { colors, fontSizes, fontWeights } from '../theme';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Start'>;

export function StartYourJourneyScreen({ navigation }: Props) {
  return (
    <Screen style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>BodyQ</Text>
        <Text style={styles.subtitle}>
          Your AI-powered Fitness & Health Assistant. Modern, bold, built for you.
        </Text>
        <View style={styles.actions}>
          <Button
            title="Start Your Journey"
            onPress={() => navigation.navigate('SignUp')}
            variant="primary"
            style={styles.primaryButton}
          />
          <Button
            title="I already have an account"
            onPress={() => navigation.navigate('Login')}
            variant="text"
            style={styles.textButton}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: { alignItems: 'center' },
  title: {
    color: colors.lime,
    fontSize: fontSizes.hero,
    fontWeight: fontWeights.bold,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 48,
    lineHeight: 24,
  },
  actions: { width: '100%', alignItems: 'center' },
  primaryButton: { width: '100%', maxWidth: 320 },
  textButton: { marginTop: 12 },
});
