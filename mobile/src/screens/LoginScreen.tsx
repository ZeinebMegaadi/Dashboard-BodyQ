import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, Screen } from '../components';
import { colors, fontSizes, fontWeights } from '../theme';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Navigator switches to Onboarding or App based on profileComplete
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll style={styles.screen}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to continue to BodyQ.</Text>

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Password"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title="Sign In"
        onPress={handleLogin}
        variant="primary"
        loading={loading}
        style={styles.button}
      />
      <Button
        title="Create an account"
        onPress={() => navigation.navigate('SignUp')}
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
