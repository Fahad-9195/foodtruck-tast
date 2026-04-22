import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, hitSlop, iconSize, radius, shadows, spacing, typography } from "@/theme/tokens";

type HomeHeaderProps = {
  greeting: string;
  locationLine: string;
  onSearchPress: () => void;
  onFiltersPress: () => void;
  searchActive?: boolean;
};

export const HomeHeader = ({ greeting, locationLine, onSearchPress, onFiltersPress, searchActive }: HomeHeaderProps) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.textBlock}>
        <Text style={styles.greeting}>{greeting}</Text>
        <View style={styles.locRow}>
          <Ionicons name="location-sharp" size={iconSize.sm} color={colors.primary} />
          <Text style={styles.location} numberOfLines={1}>
            {locationLine}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[styles.iconBtn, searchActive && styles.iconBtnActive]}
          onPress={onSearchPress}
          hitSlop={hitSlop}
          accessibilityRole="button"
          accessibilityLabel="بحث"
        >
          <Ionicons name="search" size={iconSize.md} color={searchActive ? colors.onPrimary : colors.primaryDark} />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={onFiltersPress} hitSlop={hitSlop} accessibilityRole="button" accessibilityLabel="فلاتر">
          <Ionicons name="options-outline" size={iconSize.md} color={colors.primaryDark} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.sm
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: 6
  },
  greeting: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: "800"
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  location: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    fontWeight: "600"
  },
  actions: {
    flexDirection: "row",
    gap: spacing.xs
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft
  },
  iconBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark
  }
});
