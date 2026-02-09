import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, fontSizes, fontWeights } from '../theme';

type Variant = 'primary' | 'secondary' | 'text';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const variantStyles: Record<Variant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: colors.lime },
    text: { color: colors.textOnLime, fontWeight: fontWeights.bold },
  },
  secondary: {
    container: { backgroundColor: colors.violet },
    text: { color: colors.textOnViolet, fontWeight: fontWeights.semibold },
  },
  text: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.lime, fontWeight: fontWeights.medium },
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isText = variant === 'text';
  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        v.container,
        isText && styles.textVariant,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.black : colors.white}
          size="small"
        />
      ) : (
        <Text style={[styles.label, v.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  textVariant: {
    minHeight: 48,
  },
  label: {
    fontSize: fontSizes.md,
  },
  disabled: {
    opacity: 0.5,
  },
});
