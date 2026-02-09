import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, fontSizes, fontWeights } from '../theme';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export function Input({
  label,
  error,
  containerStyle,
  style,
  placeholderTextColor = colors.placeholder,
  ...rest
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: fontSizes.md,
  },
  inputError: { borderColor: colors.error },
  error: {
    color: colors.error,
    fontSize: fontSizes.xs,
    marginTop: 4,
  },
});
