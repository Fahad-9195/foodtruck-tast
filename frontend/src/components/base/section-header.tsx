import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, iconSize, radius, spacing, typography } from "@/theme/tokens";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export const SectionHeader = ({ title, subtitle, actionLabel, onPressAction }: SectionHeaderProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onPressAction ? (
        <Pressable style={styles.actionButton} onPress={onPressAction}>
          <Ionicons name="options-outline" size={iconSize.sm} color={colors.primaryDark} />
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textWrap: {
    flex: 1,
    paddingRight: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: typography.bodySm
  },
  actionButton: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  actionLabel: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: typography.bodySm
  }
});
