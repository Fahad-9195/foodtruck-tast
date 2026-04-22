import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";

import { colors, radius, spacing, typography } from "@/theme/tokens";
import type { DiscoveryFilters } from "@/types/truck";

type FiltersBottomSheetProps = {
  visible: boolean;
  initialFilters: DiscoveryFilters;
  onClose: () => void;
  onApply: (filters: DiscoveryFilters) => void;
};

export const FiltersBottomSheet = ({ visible, initialFilters, onClose, onApply }: FiltersBottomSheetProps) => {
  const [city, setCity] = useState(initialFilters.city ?? "");
  const [neighborhood, setNeighborhood] = useState(initialFilters.neighborhood ?? "");
  const [categoryId, setCategoryId] = useState(initialFilters.categoryId ? String(initialFilters.categoryId) : "");

  const handleApply = () => {
    onApply({
      city: city || undefined,
      neighborhood: neighborhood || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.overlayTapArea} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>فلاتر الاستكشاف</Text>
          <Text style={styles.subtitle}>حدّد المدينة أو الحي أو رقم الفئة.</Text>

          <View style={styles.inputGroup}>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="المدينة"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <TextInput
              value={neighborhood}
              onChangeText={setNeighborhood}
              placeholder="الحي"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <TextInput
              value={categoryId}
              onChangeText={setCategoryId}
              placeholder="رقم الفئة (اختياري)"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.buttonRow}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>إلغاء</Text>
            </Pressable>
            <Pressable onPress={handleApply} style={styles.applyButton}>
              <Text style={styles.applyText}>تطبيق</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.overlay
  },
  overlayTapArea: {
    flex: 1
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: typography.bodySm
  },
  inputGroup: {
    marginTop: spacing.md,
    gap: spacing.sm
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: typography.bodySm,
    textAlign: "right"
  },
  buttonRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm
  },
  cancelButton: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    paddingVertical: 14
  },
  applyButton: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    paddingVertical: 14
  },
  cancelText: {
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "700",
    fontSize: typography.bodySm
  },
  applyText: {
    color: colors.onPrimary,
    textAlign: "center",
    fontWeight: "800",
    fontSize: typography.bodySm
  }
});
