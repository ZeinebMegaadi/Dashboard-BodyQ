export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type FitnessGoal = 'lose_weight' | 'build_muscle' | 'improve_endurance' | 'general_fitness';

export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutLocation = 'gym' | 'home' | 'outdoor' | 'mixed';

export type OnboardingData = {
  firstName: string;
  lastName: string;
  gender: Gender;
  fitnessGoal: FitnessGoal;
  trainingLevel: TrainingLevel;
  heightCm: number;
  weightKg: number;
  age: number;
  workoutLocation: WorkoutLocation;
};
