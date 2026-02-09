import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Start: undefined;
  SignUp: undefined;
  Login: undefined;
};

export type OnboardingStackParamList = {
  AccountSetup: undefined;
};

export type AppStackParamList = {
  Main: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;
export type OnboardingStackScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;
export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList, OnboardingStackParamList, AppStackParamList {}
  }
}
