import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Input, Screen } from '../components';
import { colors, fontSizes, fontWeights } from '../theme';
import { useAuth } from '../context/AuthContext';
import type { OnboardingData, Gender, FitnessGoal, TrainingLevel, WorkoutLocation } from '../types/onboarding';

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const FITNESS_GOALS: { value: FitnessGoal; label: string }[] = [
  { value: 'lose_weight', label: 'Lose weight' },
  { value: 'build_muscle', label: 'Build muscle' },
  { value: 'improve_endurance', label: 'Improve endurance' },
  { value: 'general_fitness', label: 'General fitness' },
];

const TRAINING_LEVELS: { value: TrainingLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const WORKOUT_LOCATIONS: { value: WorkoutLocation; label: string }[] = [
  { value: 'gym', label: 'Gym' },
  { value: 'home', label: 'Home' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'mixed', label: 'Mixed' },
];

const STEPS = [
  { key: 'name', title: 'What should we call you?' },
  { key: 'about', title: 'About you' },
  { key: 'body', title: 'Body metrics' },
  { key: 'fitness', title: 'Your fitness' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

const defaultData: OnboardingData = {
  firstName: '',
  lastName: '',
  gender: 'prefer_not_to_say',
  fitnessGoal: 'general_fitness',
  trainingLevel: 'beginner',
  heightCm: 0,
  weightKg: 0,
  age: 0,
  workoutLocation: 'mixed',
};

function OptionChip<T extends string>({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function AccountSetupScreen() {
  const { setProfileComplete } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const validateAndNext = () => {
    setError('');
    if (step.key === 'name') {
      if (!data.firstName.trim()) {
        setError('First name is required');
        return;
      }
      if (!data.lastName.trim()) {
        setError('Last name is required');
        return;
      }
    }
    if (step.key === 'about') {
      if (!data.age || data.age < 13 || data.age > 120) {
        setError('Please enter a valid age (13–120)');
        return;
      }
    }
    if (step.key === 'body') {
      if (!data.heightCm || data.heightCm < 100 || data.heightCm > 250) {
        setError('Please enter height in cm (100–250)');
        return;
      }
      if (!data.weightKg || data.weightKg < 30 || data.weightKg > 300) {
        setError('Please enter weight in kg (30–300)');
        return;
      }
    }
    if (isLastStep) {
      submitOnboarding();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const submitOnboarding = async () => {
    setLoading(true);
    setError('');
    try {
      // TODO: PATCH /users/me with onboarding data
      await setProfileComplete();
      // Root navigator will switch to App stack
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step.key) {
      case 'name':
        return (
          <>
            <Input
              label="First name"
              placeholder="First name"
              value={data.firstName}
              onChangeText={(v) => setData((d) => ({ ...d, firstName: v }))}
              autoCapitalize="words"
            />
            <Input
              label="Last name"
              placeholder="Last name"
              value={data.lastName}
              onChangeText={(v) => setData((d) => ({ ...d, lastName: v }))}
              autoCapitalize="words"
            />
          </>
        );
      case 'about':
        return (
          <>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.chipRow}>
              {GENDERS.map((g) => (
                <OptionChip
                  key={g.value}
                  label={g.label}
                  selected={data.gender === g.value}
                  onPress={() => setData((d) => ({ ...d, gender: g.value }))}
                />
              ))}
            </View>
            <Input
              label="Age"
              placeholder="Your age"
              value={data.age ? String(data.age) : ''}
              onChangeText={(v) => setData((d) => ({ ...d, age: parseInt(v, 10) || 0 }))}
              keyboardType="number-pad"
            />
          </>
        );
      case 'body':
        return (
          <>
            <Input
              label="Height (cm)"
              placeholder="e.g. 170"
              value={data.heightCm ? String(data.heightCm) : ''}
              onChangeText={(v) => setData((d) => ({ ...d, heightCm: parseFloat(v) || 0 }))}
              keyboardType="decimal-pad"
            />
            <Input
              label="Weight (kg)"
              placeholder="e.g. 70"
              value={data.weightKg ? String(data.weightKg) : ''}
              onChangeText={(v) => setData((d) => ({ ...d, weightKg: parseFloat(v) || 0 }))}
              keyboardType="decimal-pad"
            />
          </>
        );
      case 'fitness':
        return (
          <>
            <Text style={styles.label}>Fitness goal</Text>
            <View style={styles.chipRow}>
              {FITNESS_GOALS.map((g) => (
                <OptionChip
                  key={g.value}
                  label={g.label}
                  selected={data.fitnessGoal === g.value}
                  onPress={() => setData((d) => ({ ...d, fitnessGoal: g.value }))}
                />
              ))}
            </View>
            <Text style={styles.label}>Training level</Text>
            <View style={styles.chipRow}>
              {TRAINING_LEVELS.map((l) => (
                <OptionChip
                  key={l.value}
                  label={l.label}
                  selected={data.trainingLevel === l.value}
                  onPress={() => setData((d) => ({ ...d, trainingLevel: l.value }))}
                />
              ))}
            </View>
            <Text style={styles.label}>Where do you usually train?</Text>
            <View style={styles.chipRow}>
              {WORKOUT_LOCATIONS.map((loc) => (
                <OptionChip
                  key={loc.value}
                  label={loc.label}
                  selected={data.workoutLocation === loc.value}
                  onPress={() => setData((d) => ({ ...d, workoutLocation: loc.value }))}
                />
              ))}
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Screen style={styles.screen} noPadding>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <Text style={styles.stepCount}>
            {stepIndex + 1} of {STEPS.length}
          </Text>
          <Text style={styles.title}>{step.title}</Text>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>{renderStep()}</View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title={isLastStep ? 'Complete setup' : 'Continue'}
            onPress={validateAndNext}
            variant="primary"
            loading={loading}
            style={styles.button}
          />
          {stepIndex > 0 ? (
            <Button
              title="Back"
              onPress={() => setStepIndex((i) => i - 1)}
              variant="text"
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  screen: { backgroundColor: colors.background },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  stepCount: {
    color: colors.violet,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    marginBottom: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
  form: { marginBottom: 16 },
  label: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    marginBottom: 8,
    marginTop: 8,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.violet,
    backgroundColor: colors.violet,
  },
  chipText: { color: colors.textPrimary, fontSize: fontSizes.sm },
  chipTextSelected: { color: colors.white },
  error: { color: colors.error, fontSize: fontSizes.sm, marginBottom: 12 },
  button: { marginTop: 8, marginBottom: 8 },
});
