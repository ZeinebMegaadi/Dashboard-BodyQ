import { colors } from '../theme';

export const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontWeight: '600' as const, fontSize: 18 },
  contentStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  animation: 'slide_from_right' as const,
};
