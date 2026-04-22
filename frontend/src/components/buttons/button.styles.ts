import { StyleSheet } from "react-native";

import { colors, radius, shadows, spacing, typography } from "@/theme/tokens";

export const buttonPalette = {
  primary: {
    background: "#2563EB",
    border: "#1D4ED8",
    text: "#FFFFFF"
  },
  secondary: {
    background: "#F8FAFC",
    border: "#CBD5E1",
    text: "#334155"
  },
  danger: {
    background: "#FEF2F2",
    border: "#FECACA",
    text: "#DC2626"
  },
  ghost: {
    background: "#FFFFFF",
    border: "#CBD5E1",
    text: "#334155"
  },
  disabled: {
    background: "#CBD5E1",
    border: "#94A3B8",
    text: "#64748B"
  }
} as const;

export const buttonStyles = StyleSheet.create({
  pressableBase: {
    alignSelf: "flex-start"
  },
  pressableFullWidth: {
    width: "100%"
  },
  surfaceBase: {
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    minWidth: 0
  },
  surfaceFullWidth: {
    width: "100%"
  },
  sm: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: 8
  },
  md: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 12
  },
  lg: {
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14
  },
  primary: {
    backgroundColor: buttonPalette.primary.background,
    borderColor: buttonPalette.primary.border,
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  secondary: {
    backgroundColor: buttonPalette.secondary.background,
    borderColor: buttonPalette.secondary.border,
    ...shadows.none
  },
  danger: {
    backgroundColor: buttonPalette.danger.background,
    borderColor: buttonPalette.danger.border,
    ...shadows.none
  },
  ghost: {
    backgroundColor: buttonPalette.ghost.background,
    borderColor: buttonPalette.ghost.border,
    ...shadows.none
  },
  disabled: {
    backgroundColor: buttonPalette.disabled.background,
    borderColor: buttonPalette.disabled.border
  },
  pressed: {
    transform: [{ scale: 0.97 }]
  },
  label: {
    fontSize: typography.bodySm,
    fontWeight: "700"
  },
  labelPrimary: { color: buttonPalette.primary.text },
  labelSecondary: { color: buttonPalette.secondary.text },
  labelDanger: { color: buttonPalette.danger.text },
  labelGhost: { color: buttonPalette.ghost.text },
  labelDisabled: { color: buttonPalette.disabled.text },
  spinnerWrap: {
    minWidth: 18,
    minHeight: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%"
  },
  modalActionWrap: {
    flex: 1
  },
  iconOnly: {
    width: 42,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  ctaShadow: {
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4
  },
  localInlineAction: {
    minHeight: 38,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8
  },
  localInlineActionText: {
    fontSize: typography.caption,
    fontWeight: "700"
  },
  dangerText: {
    color: colors.danger
  }
});
