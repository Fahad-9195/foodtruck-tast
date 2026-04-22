import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppButton } from "@/components/buttons";
import { EmptyState } from "@/components/design/empty-state";
import { AppContainer } from "@/components/layout/app-container";
import type { RootStackParamList } from "@/navigation/root-stack";
import { useCartStore } from "@/store/cart-store";
import { colors, iconSize, radius, shadows, spacing, typography } from "@/theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

export const CartScreen = ({ navigation }: Props) => {
  const {
    truckName,
    items,
    notes,
    subtotal,
    total,
    pickupTypeLabel,
    incrementItem,
    decrementItem,
    removeItem,
    setNotes,
    clearCart
  } = useCartStore();

  if (items.length === 0) {
    return (
      <AppContainer edges={["top"]}>
        <View style={styles.emptyWrap}>
          <Text style={styles.pageTitle}>السلة</Text>
          <EmptyState
            title="السلة فارغة"
            description="اختر أصنافك من أي ترك ثم أكمل الدفع من هنا."
            icon="basket-outline"
            actionLabel="العودة للتركات"
            onAction={() => navigation.navigate("MainTabs", { screen: "Home" })}
            variant="card"
          />
        </View>
      </AppContainer>
    );
  }

  return (
    <AppContainer edges={["top"]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.pageTitle}>السلة</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{truckName}</Text>
          <Text style={styles.summarySub}>{pickupTypeLabel}</Text>
        </View>

        <View style={styles.list}>
          {items.map((item) => (
            <View key={item.menuItemId} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Pressable onPress={() => removeItem(item.menuItemId)} hitSlop={12}>
                  <Ionicons name="trash-outline" size={iconSize.md} color={colors.danger} />
                </Pressable>
              </View>
              <Text style={styles.itemPrice}>
                {item.price.toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س
              </Text>
              <View style={styles.qtyRow}>
                <Pressable style={styles.qtyBtn} onPress={() => incrementItem(item.menuItemId)}>
                  <Ionicons name="add" size={18} color={colors.primaryDark} />
                </Pressable>
                <Text style={styles.qtyText}>{item.quantity.toLocaleString("ar-SA")}</Text>
                <Pressable style={styles.qtyBtn} onPress={() => decrementItem(item.menuItemId)}>
                  <Ionicons name="remove" size={18} color={colors.primaryDark} />
                </Pressable>
                <View style={styles.lineTotalWrap}>
                  <Text style={styles.lineTotal}>
                    {(item.price * item.quantity).toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>ملاحظة الطلب (اختياري)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="مثال: بدون بصل"
            placeholderTextColor={colors.textMuted}
            style={styles.notesInput}
            multiline
          />
        </View>

        <View style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>المجموع الفرعي</Text>
            <Text style={styles.totalValue}>{subtotal.toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelStrong}>الإجمالي</Text>
            <Text style={styles.totalValueStrong}>{total.toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <View>
            <AppButton
              label="المتابعة إلى الدفع"
              onPress={() => navigation.navigate("Checkout")}
              variant="primary"
              fullWidth
              size="lg"
            />
          </View>
          <View>
            <AppButton
              label="تفريغ السلة"
              onPress={() =>
                Alert.alert("تفريغ السلة", "هل تريد حذف كل الأصناف من السلة؟", [
                  { text: "إلغاء", style: "cancel" },
                  { text: "تفريغ", style: "destructive", onPress: clearCart }
                ])
              }
              variant="danger"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120,
    gap: spacing.sm
  },
  pageTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: typography.h1
  },
  summaryCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md
  },
  summaryTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: typography.h3
  },
  summarySub: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.bodySm
  },
  list: { gap: spacing.sm },
  itemCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
    ...shadows.soft
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  itemName: {
    flex: 1,
    color: colors.text,
    fontWeight: "700",
    fontSize: typography.body
  },
  itemPrice: {
    color: colors.textSecondary,
    fontSize: typography.caption
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center"
  },
  qtyText: {
    minWidth: 28,
    textAlign: "center",
    color: colors.text,
    fontWeight: "700"
  },
  lineTotalWrap: {
    marginStart: "auto"
  },
  lineTotal: {
    color: colors.primaryDark,
    fontWeight: "800",
    fontSize: typography.bodySm
  },
  notesCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs
  },
  notesTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: typography.bodySm
  },
  notesInput: {
    minHeight: 80,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    color: colors.text,
    textAlignVertical: "top"
  },
  totalsCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  totalLabel: {
    color: colors.textSecondary,
    fontSize: typography.bodySm
  },
  totalValue: {
    color: colors.text,
    fontWeight: "700"
  },
  totalLabelStrong: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800"
  },
  totalValueStrong: {
    color: colors.primaryDark,
    fontSize: typography.h3,
    fontWeight: "900"
  },
  actions: {
    marginTop: spacing.sm,
    gap: spacing.sm
  }
});
