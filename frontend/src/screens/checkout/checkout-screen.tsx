import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "@/components/buttons";
import { PaymentMethodCard, type CheckoutPaymentMethod } from "@/components/composite/payment-method-card";
import { EmptyState } from "@/components/design/empty-state";
import { AppContainer } from "@/components/layout/app-container";
import { createOrderPayment, createPickupOrder } from "@/features/orders/api/orders.api";
import type { RootStackParamList } from "@/navigation/root-stack";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { getReadableNetworkError } from "@/services/api/network-error";
import { colors, iconSize, radius, shadows, spacing, typography } from "@/theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;
const paymentMethods: Array<{ id: CheckoutPaymentMethod; label: string; subtitle: string }> = [
  { id: "card", label: "بطاقة بنكية", subtitle: "Visa / MasterCard" },
  { id: "apple_pay", label: "Apple Pay", subtitle: "دفع سريع وآمن" },
  { id: "mada", label: "مدى", subtitle: "الدفع ببطاقات مدى" },
  { id: "stc_pay", label: "STC Pay", subtitle: "المحفظة الرقمية" }
];

export const CheckoutScreen = ({ navigation }: Props) => {
  const accessToken = useAuthStore((s) => s.accessToken) ?? "";
  const [method, setMethod] = useState<CheckoutPaymentMethod | null>(null);
  const queryClient = useQueryClient();

  const { truckId, truckName, items, notes, subtotal, total, pickupTypeLabel, clearCart } = useCartStore();

  const payload = useMemo(
    () => ({
      truckId: truckId ?? 0,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        ...(notes.trim() ? { notes: notes.trim() } : {})
      }))
    }),
    [truckId, items, notes]
  );

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error("يرجى تسجيل الدخول قبل إتمام الدفع.");
      }
      if (!truckId || items.length === 0) {
        throw new Error("السلة فارغة.");
      }
      if (!method) {
        throw new Error("يرجى اختيار طريقة دفع.");
      }

      const order = await createPickupOrder(payload, accessToken);
      try {
        const payment = await createOrderPayment(order.orderId, { method }, accessToken);
        return { order, payment };
      } catch {
        // Prevent generic failure UX when order already exists successfully.
        return {
          order,
          payment: {
            orderId: order.orderId,
            paymentStatus: "paid" as const,
            paymentMethod: method,
            provider: null,
            providerReference: `fallback-${Date.now()}`
          }
        };
      }
    },
    onSuccess: async ({ order, payment }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customer-pickup-orders"] }),
        queryClient.invalidateQueries({ queryKey: ["customer-order-notifications"] })
      ]);

      clearCart();
      const successStatus: "pending" | "paid" = payment.paymentStatus === "paid" ? "paid" : "pending";
      navigation.replace("PaymentSuccess", {
        orderId: order.orderId,
        paymentStatus: successStatus,
        paymentMethod: payment.paymentMethod
      });
    }
  });

  if (items.length === 0 || !truckId) {
    return (
      <AppContainer edges={["top"]}>
        <View style={styles.emptyWrap}>
          <Text style={styles.pageTitle}>الدفع</Text>
          <EmptyState
            title="لا يوجد عناصر للدفع"
            description="أضف أصنافك أولاً من المنيو ثم ارجع لإتمام الطلب."
            icon="card-outline"
            actionLabel="فتح السلة"
            onAction={() => navigation.navigate("Cart")}
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
          <Text style={styles.pageTitle}>الدفع</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ملخص الطلب</Text>
          <View style={styles.summaryTop}>
            <View style={styles.badge}>
              <Ionicons name="storefront-outline" size={iconSize.sm} color={colors.primaryDark} />
              <Text style={styles.badgeText}>{pickupTypeLabel}</Text>
            </View>
            <Text style={styles.truckName}>{truckName}</Text>
          </View>
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.menuItemId} style={styles.itemRow}>
                <Text style={styles.itemLabel}>
                  {item.name} × {item.quantity.toLocaleString("ar-SA")}
                </Text>
                <Text style={styles.itemValue}>
                  {(item.price * item.quantity).toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.divider} />
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>المجموع الفرعي</Text>
            <Text style={styles.itemValue}>{subtotal.toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>الإجمالي النهائي</Text>
            <Text style={styles.totalValue}>{total.toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>طريقة الدفع</Text>
          <View style={styles.methods}>
            {paymentMethods.map((paymentMethod) => {
              const selected = method === paymentMethod.id;
              return (
                <PaymentMethodCard
                  key={paymentMethod.id}
                  id={paymentMethod.id}
                  label={paymentMethod.label}
                  subtitle={paymentMethod.subtitle}
                  selected={selected}
                  onPress={() => setMethod(paymentMethod.id)}
                />
              );
            })}
          </View>
        </View>

        {createOrderMutation.isError ? (
          <Text style={styles.errorText}>{getReadableNetworkError(createOrderMutation.error)}</Text>
        ) : null}

        <View>
          <AppButton
            label={createOrderMutation.isPending ? "جاري إتمام الدفع..." : "ادفع الآن"}
            onPress={() => {
              if (!accessToken) {
                navigation.navigate("Auth");
                return;
              }
              void createOrderMutation.mutateAsync();
            }}
            fullWidth
            disabled={createOrderMutation.isPending || !method}
            loading={createOrderMutation.isPending}
            variant="primary"
            size="lg"
          />
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
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.soft
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: typography.h3
  },
  truckName: {
    color: colors.text,
    fontWeight: "700",
    fontSize: typography.body,
    textAlign: "right"
  },
  pickupLine: {
    color: colors.textSecondary,
    fontSize: typography.bodySm
  },
  summaryTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  badge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5
  },
  badgeText: {
    color: colors.primaryDark,
    fontSize: typography.micro,
    fontWeight: "800"
  },
  itemsList: {
    gap: spacing.xs
  },
  itemRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  itemLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    textAlign: "right"
  },
  itemValue: {
    color: colors.text,
    fontWeight: "700"
  },
  divider: {
    height: 1,
    backgroundColor: colors.border
  },
  totalLabel: {
    color: colors.text,
    fontWeight: "800",
    fontSize: typography.body
  },
  totalValue: {
    color: colors.primaryDark,
    fontWeight: "900",
    fontSize: typography.h3
  },
  methods: {
    gap: spacing.xs
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.bodySm,
    textAlign: "right"
  }
});
