import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, Screen } from '../components';
import { colors, fontSizes, fontWeights } from '../theme';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password, (displayName || email.trim()).trim());
      // Navigator will switch to Onboarding stack automatically (auth state changed, profile not complete)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll style={styles.screen}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>We’ll use this to personalize your experience.</Text>

      <Input
        label="Name"
        placeholder="Your name"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Input
        label="Password"
        placeholder="At least 8 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title="Sign Up"
        onPress={handleSignUp}
        variant="primary"
        loading={loading}
        style={styles.button}
      />
      <Button
        title="I already have an account"
        onPress={() => navigation.navigate('Login')}
        variant="text"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: 24,
  },
  error: {
    color: colors.error,
    fontSize: fontSizes.sm,
    marginBottom: 12,
  },
  button: { marginTop: 8, marginBottom: 8 },
});
