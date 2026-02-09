/**
 * BodyQ theme — modern & bold.
 * Inspired by GridsterGP: black, violet, lime, white.
 */
export const colors = {
  // Base
  black: '#000000',
  white: '#FFFFFF',

  // Brand
  violet: '#7D39EB',
  lime: '#C6FF33',

  // Surfaces
  background: '#000000',
  surface: '#0D0D0D',
  surfaceElevated: '#1A1A1A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textOnViolet: '#FFFFFF',
  textOnLime: '#000000',

  // Borders & inputs
  border: 'rgba(255,255,255,0.15)',
  inputBackground: '#1A1A1A',
  placeholder: 'rgba(255,255,255,0.4)',

  // Feedback
  error: '#FF4757',
  success: '#C6FF33',
} as const;

export type Colors = typeof colors;
