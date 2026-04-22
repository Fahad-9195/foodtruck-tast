import { StyleSheet, Text, View } from "react-native";

import { colors, radius, typography } from "@/theme/tokens";

type Operational = "open" | "busy" | "closed" | "offline";

const config: Record<Operational, { label: string; fg: string; bg: string; border: string }> = {
  open: {
    label: "مفتوح",
    fg: "#0B8F5A",
    bg: colors.successMuted,
    border: "rgba(25, 195, 125, 0.35)"
  },
  busy: {
    label: "مزدحم",
    fg: "#C27803",
    bg: colors.warningMuted,
    border: "rgba(255, 176, 32, 0.4)"
  },
  closed: {
    label: "مغلق",
    fg: colors.textMuted,
    bg: "rgba(123, 138, 160, 0.12)",
    border: "rgba(123, 138, 160, 0.28)"
  },
  offline: {
    label: "غير متصل",
    fg: "#E11D48",
    bg: colors.dangerMuted,
    border: "rgba(255, 90, 107, 0.35)"
  }
};

type StatusBadgeProps = {
  status: Operational;
  compact?: boolean;
};

export const StatusBadge = ({ status, compact }: StatusBadgeProps) => {
  const c = config[status] ?? config.offline;
  return (
    <View style={[styles.wrap, { backgroundColor: c.bg, borderColor: c.border }, compact && styles.compact]}>
      <Text style={[styles.text, { color: c.fg }, compact && styles.textCompact]}>{c.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1
  },
  compact: {
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  text: {
    fontSize: typography.caption,
    fontWeight: "800",
    letterSpacing: 0.2
  },
  textCompact: {
    fontSize: typography.micro
  }
});
