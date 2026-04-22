import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, iconSize, radius, shadows, spacing, typography } from "@/theme/tokens";

type AdminDashboardStatCardProps = {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  tone?: "primary" | "warning" | "danger" | "neutral";
  helper?: string;
};

const toneByType = {
  primary: {
    bg: colors.primaryMuted,
    border: colors.borderStrong,
    icon: colors.primaryDark
  },
  warning: {
    bg: colors.warningMuted,
    border: "rgba(255, 176, 32, 0.35)",
    icon: colors.warning
  },
  danger: {
    bg: colors.dangerMuted,
    border: "rgba(255, 90, 107, 0.35)",
    icon: colors.danger
  },
  neutral: {
    bg: colors.surface2,
    border: colors.border,
    icon: colors.textMuted
  }
} as const;

export const AdminDashboardStatCard = ({ label, value, icon, tone = "neutral", helper }: AdminDashboardStatCardProps) => {
  const palette = toneByType[tone];
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: palette.bg, borderColor: palette.border }]}>
        <Ionicons name={icon} size={iconSize.md} color={palette.icon} />
      </View>
      <Text style={styles.value}>{value.toLocaleString("ar-SA")}</Text>
      <Text style={styles.label}>{label}</Text>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
    ...shadows.soft
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  value: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: "800",
    textAlign: "right"
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "right",
    writingDirection: "rtl"
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.micro,
    textAlign: "right",
    writingDirection: "rtl"
  }
});
