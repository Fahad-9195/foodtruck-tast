/**
 * Light premium design system — bright, airy, marketplace / fintech inspired.
 * Customer-facing UI: use these tokens for consistent light surfaces and clarity.
 */
export const colors = {
  /** App canvas */
  bg: "#F4F8FC",
  /** Section bands / hero tint */
  section: "#EEF5FF",
  /** Primary cards */
  surface: "#FFFFFF",
  /** Soft alternate surface */
  surface2: "#F7FBFF",
  /** Selected row / subtle emphasis */
  surfaceElevated: "#EEF5FF",
  /** Inset tracks, subtle fills (never as full screen bg) */
  bgDeep: "#E8F2FB",

  primary: "#169BFF",
  primaryDark: "#0D8AF0",
  primaryMuted: "rgba(22, 155, 255, 0.14)",
  accent: "#6DD3FF",
  accentPurple: "rgba(124, 77, 255, 0.14)",
  accentPurpleSolid: "#8B7CFF",

  text: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#7B8AA0",

  border: "#D9E7F5",
  borderStrong: "rgba(22, 155, 255, 0.28)",

  success: "#19C37D",
  successMuted: "rgba(25, 195, 125, 0.16)",
  warning: "#FFB020",
  warningMuted: "rgba(255, 176, 32, 0.2)",
  danger: "#FF5A6B",
  dangerMuted: "rgba(255, 90, 107, 0.12)",
  neutral: "#94A3B8",

  onPrimary: "#FFFFFF",
  overlay: "rgba(15, 23, 42, 0.4)"
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999
} as const;

export const shadows = {
  card: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6
  },
  soft: {
    shadowColor: "#169BFF",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4
  },
  tabBar: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8
  },
  none: {
    shadowOpacity: 0,
    elevation: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 }
  }
} as const;

export const typography = {
  display: 32,
  h1: 26,
  h2: 20,
  h3: 17,
  body: 15,
  bodySm: 13,
  caption: 12,
  micro: 11
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28
} as const;

export const hitSlop = { top: 12, bottom: 12, left: 12, right: 12 } as const;
