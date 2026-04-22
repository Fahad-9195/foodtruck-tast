import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { StatusBadge } from "@/components/design/status-badge";
import { colors, iconSize, radius, shadows, spacing, typography } from "@/theme/tokens";
import type { TruckDiscoveryItem } from "@/types/truck";
import { formatPrepEstimate } from "@/utils/prep-time";
import { resolveMediaUrl } from "@/utils/media-url";

type TruckCardProps = {
  truck: TruckDiscoveryItem;
  onPress: () => void;
  distanceLabel?: string | null;
  selected?: boolean;
};

export const TruckCard = ({ truck, onPress, distanceLabel = null, selected }: TruckCardProps) => {
  const coverUrl = resolveMediaUrl(truck.cover_image_url);
  const category = truck.category_name?.trim() || "مأكولات متنوعة";
  const prep = formatPrepEstimate(truck.working_hours ?? null);
  const ratingNum = Number(truck.avg_rating);
  const hasRatings = (truck.rating_count ?? 0) > 0 && Number.isFinite(ratingNum) && ratingNum > 0;
  const locationLine = [truck.neighborhood, truck.city].filter(Boolean).join(" · ");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.mediaRow}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={styles.coverFallback}>
            <Ionicons name="restaurant-outline" size={iconSize.xl} color={colors.primary} />
          </View>
        )}
        <View style={styles.mediaBody}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {truck.display_name}
            </Text>
            <StatusBadge status={truck.operational_status} compact />
          </View>
          <Text style={styles.category} numberOfLines={1}>
            {category}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {locationLine}
          </Text>
          <View style={styles.metaRow}>
            {distanceLabel ? (
              <View style={styles.metaChip}>
                <Ionicons name="navigate-outline" size={iconSize.sm} color={colors.primaryDark} />
                <Text style={styles.metaText}>{distanceLabel}</Text>
              </View>
            ) : null}
            <View style={styles.metaChip}>
              <Ionicons name="timer-outline" size={iconSize.sm} color={colors.primary} />
              <Text style={styles.metaText}>{prep}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.ratingBlock}>
          <Ionicons name="star" size={iconSize.sm} color={hasRatings ? colors.warning : colors.textMuted} />
          {hasRatings ? (
            <>
              <Text style={styles.ratingValue}>{ratingNum.toLocaleString("ar-SA", { maximumFractionDigits: 1 })}</Text>
              <Text style={styles.ratingCount}>({truck.rating_count})</Text>
            </>
          ) : (
            <Text style={styles.noRating}>بدون تقييمات بعد</Text>
          )}
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>عرض المنيو</Text>
          <Ionicons name="chevron-back" size={iconSize.sm} color={colors.onPrimary} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.soft
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
    ...shadows.card
  },
  cardPressed: {
    opacity: 0.94
  },
  mediaRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  cover: {
    width: 108,
    height: 108,
    borderRadius: radius.md,
    backgroundColor: colors.section
  },
  coverFallback: {
    width: 108,
    height: 108,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.section,
    alignItems: "center",
    justifyContent: "center"
  },
  mediaBody: {
    flex: 1,
    gap: 4,
    minWidth: 0
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: "800"
  },
  category: {
    color: colors.primaryDark,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  location: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "500"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: 4
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.section,
    borderWidth: 1,
    borderColor: colors.border
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: typography.micro,
    fontWeight: "600"
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  ratingBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 0
  },
  ratingValue: {
    color: colors.text,
    fontSize: typography.bodySm,
    fontWeight: "800"
  },
  ratingCount: {
    color: colors.textMuted,
    fontSize: typography.micro
  },
  noRating: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    ...shadows.soft
  },
  ctaText: {
    color: colors.onPrimary,
    fontWeight: "800",
    fontSize: typography.caption
  }
});
