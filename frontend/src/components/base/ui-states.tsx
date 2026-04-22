import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "@/components/buttons";
import { EmptyState as EmptyStateFull } from "@/components/design/empty-state";
import { colors, iconSize, spacing, typography } from "@/theme/tokens";

export { LoadingSkeleton } from "@/components/design/loading-skeleton";

export const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  return (
    <View style={styles.center}>
      <View style={styles.iconBadge}>
        <Ionicons name="cloud-offline-outline" size={iconSize.lg} color={colors.danger} />
      </View>
      <Text style={styles.errorTitle}>تعذر الاتصال</Text>
      <Text style={styles.errorBody}>{message}</Text>
      <AppButton label="إعادة المحاولة" onPress={onRetry} variant="primary" fullWidth />
    </View>
  );
};

export const EmptyState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <EmptyStateFull
      title="لا توجد تركات في النتائج"
      description="جرّب تعديل الفلاتر أو حدّث القائمة لعرض أحدث التركات المعتمدة."
      icon="map-outline"
      actionLabel="تحديث"
      onAction={onRetry}
      variant="card"
    />
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.sm
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.section,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  errorTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: "800"
  },
  errorBody: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: typography.bodySm,
    lineHeight: 22
  }
});
