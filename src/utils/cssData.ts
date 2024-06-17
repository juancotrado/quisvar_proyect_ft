export const COLOR_CSS = {
  primary: 'var(--color-primary)',
  lightPrimary: 'var(--color-ligth-primary)',
  secondary: 'var(--color-secondary)',
  lightSecondary: 'var(--color-ligth-secondary)',
  tertiary: 'var(--color-tertiary)',
  quaternay: 'var(--color-quaternay)',
  dark: '#000',
  light: '#fff',
  gray: 'var(--color-gray)',
  grayTertiary: 'var(--color-gray-tertiary)',
  graySecondary: 'var(--color-gray-secondary)',
  grayLigth: 'var(--color-gray-ligth)',
  success: 'var(--color-done)',
  pass: 'var(--color-pass)',
  warning: 'var(--color-process)',
  danger: 'var(--color-unresolved)',
};
export type ColorKeys = keyof typeof COLOR_CSS;
