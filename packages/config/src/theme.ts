// Theme configuration
export const theme = {
  colors: {
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    accent: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
}

// CSS Variables for Tailwind
export const cssVariables = {
  '--color-primary': theme.colors.primary[500],
  '--color-primary-foreground': theme.colors.neutral[50],
  '--color-secondary': theme.colors.secondary[500],
  '--color-secondary-foreground': theme.colors.neutral[50],
  '--color-accent': theme.colors.accent[500],
  '--color-accent-foreground': theme.colors.neutral[900],
  '--color-background': theme.colors.neutral[50],
  '--color-foreground': theme.colors.neutral[900],
  '--color-muted': theme.colors.neutral[100],
  '--color-muted-foreground': theme.colors.neutral[500],
  '--color-destructive': theme.colors.error[500],
  '--color-destructive-foreground': theme.colors.neutral[50],
  '--color-border': theme.colors.neutral[200],
  '--color-input': theme.colors.neutral[200],
  '--color-ring': theme.colors.primary[500],
  '--radius': theme.borderRadius.md,
}

// Export theme utilities
export const getColorValue = (color: string, shade: number = 500) => {
  const [colorName, colorShade] = color.split('-')
  const colorObj = theme.colors[colorName as keyof typeof theme.colors]
  if (colorObj && typeof colorObj === 'object' && colorShade in colorObj) {
    return (colorObj as any)[colorShade] || color
  }
  return color
}

export const getSpacing = (size: keyof typeof theme.spacing) => theme.spacing[size]
export const getBorderRadius = (size: keyof typeof theme.borderRadius) => theme.borderRadius[size]
export const getShadow = (size: keyof typeof theme.shadows) => theme.shadows[size]
export const getBreakpoint = (size: keyof typeof theme.breakpoints) => theme.breakpoints[size]
export const getZIndex = (level: keyof typeof theme.zIndex) => theme.zIndex[level]
