import React from 'react';
import { View, StyleSheet, ViewStyle, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
  noPadding?: boolean;
};

export function Screen({ children, style, scroll = false, noPadding }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const padding = { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right };
  const content = (
    <View style={[styles.inner, !noPadding && styles.padding, padding, style]}>
      {children}
    </View>
  );

  if (scroll) {
    return (
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.fill}
          contentContainerStyle={[styles.scrollContent, !noPadding && styles.padding, padding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return <View style={styles.fill}>{content}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  inner: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  padding: { paddingHorizontal: 24 },
});
