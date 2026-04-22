import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LoadingSkeleton } from "@/components/design/loading-skeleton";
import { EmptyState } from "@/components/design/empty-state";
import { CustomerOrderCard } from "@/components/composite/customer-order-card";
import { AppContainer } from "@/components/layout/app-container";
import { AppButton } from "@/components/buttons";
import { getMyPickupOrders, submitOrderReview } from "@/features/orders/api/orders.api";
import type { MainTabParamList } from "@/navigation/main-tabs";
import type { RootStackParamList } from "@/navigation/root-stack";
import { getReadableNetworkError } from "@/services/api/network-error";
import { useAuthStore } from "@/store/auth-store";
import { colors, iconSize, radius, shadows, spacing, typography } from "@/theme/tokens";

const statusLabel: Record<string, string> = {
  pending: "جديد",
  preparing: "قيد التحضير",
  ready: "جاهز للاستلام",
  picked_up: "تم الاستلام",
  cancelled: "ملغي"
};

type OrdersNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Orders">,
  NativeStackNavigationProp<RootStackParamList>
>;

const activeStatuses: ReadonlyArray<string> = ["pending", "preparing", "ready"];

export const OrdersScreen = () => {
  const navigation = useNavigation<OrdersNav>();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken) ?? "";
  const [selectedTab, setSelectedTab] = useState<"current" | "history">("current");
  const [draftRatings, setDraftRatings] = useState<Record<number, { stars: number; comment: string }>>({});
  const ordersQuery = useQuery({
    queryKey: ["customer-pickup-orders", accessToken],
    queryFn: () => getMyPickupOrders(accessToken),
    enabled: !!accessToken
  });

  const submitReviewMutation = useMutation({
    mutationFn: ({ orderId, rating, comment }: { orderId: number; rating: number; comment?: string }) =>
      submitOrderReview(orderId, { rating, comment }, accessToken),
    onSuccess: async (_, variables) => {
      setDraftRatings((prev) => {
        const next = { ...prev };
        delete next[variables.orderId];
        return next;
      });
      await queryClient.invalidateQueries({ queryKey: ["customer-pickup-orders"] });
    }
  });

  const currentOrders = useMemo(
    () => (ordersQuery.data ?? []).filter((order) => activeStatuses.includes(order.status)),
    [ordersQuery.data]
  );
  const pastOrders = useMemo(
    () => (ordersQuery.data ?? []).filter((order) => !activeStatuses.includes(order.status)),
    [ordersQuery.data]
  );

  const onRefresh = useCallback(async () => {
    await ordersQuery.refetch();
  }, [ordersQuery]);

  if (!accessToken) {
    return (
      <AppContainer edges={["top"]}>
        <View style={styles.guest}>
          <Text style={styles.pageTitle}>الطلبات</Text>
          <View style={styles.guestCard}>
            <View style={styles.guestIconWrap}>
              <Ionicons name="receipt-outline" size={iconSize.xl} color={colors.primary} />
            </View>
            <Text style={styles.guestTitle}>سجّل دخولك</Text>
            <Text style={styles.guestBody}>تابع حالة التحضير والاستلام للطلب النشط من مكان واحد.</Text>
            <AppButton label="تسجيل الدخول" onPress={() => navigation.navigate("Auth")} variant="primary" fullWidth />
          </View>
        </View>
      </AppContainer>
    );
  }

  if (ordersQuery.isLoading) {
    return (
      <AppContainer edges={["top"]}>
        <View style={styles.pad}>
          <Text style={styles.pageTitle}>الطلبات</Text>
          <LoadingSkeleton rows={5} />
        </View>
      </AppContainer>
    );
  }

  if (ordersQuery.isError) {
    return (
      <AppContainer edges={["top"]}>
        <View style={styles.pad}>
          <Text style={styles.pageTitle}>الطلبات</Text>
          <View style={styles.errorCard}>
            <Text style={styles.error}>{getReadableNetworkError(ordersQuery.error)}</Text>
            <AppButton label="إعادة المحاولة" onPress={() => void ordersQuery.refetch()} variant="primary" fullWidth />
          </View>
        </View>
      </AppContainer>
    );
  }

  return (
    <AppContainer edges={["top"]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={ordersQuery.isFetching} onRefresh={() => void onRefresh()} tintColor={colors.primary} />
        }
      >
        <Text style={styles.pageTitle}>الطلبات</Text>
        <Text style={styles.pageSub}>تابع طلباتك الحالية والسابقة في واجهة منظمة وسهلة المسح.</Text>

        <View style={styles.tabsWrap}>
          <Pressable
            style={[styles.tabBtn, selectedTab === "current" && styles.tabBtnActive]}
            onPress={() => setSelectedTab("current")}
          >
            <Text style={[styles.tabText, selectedTab === "current" && styles.tabTextActive]}>
              الحالية ({currentOrders.length.toLocaleString("ar-SA")})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, selectedTab === "history" && styles.tabBtnActive]}
            onPress={() => setSelectedTab("history")}
          >
            <Text style={[styles.tabText, selectedTab === "history" && styles.tabTextActive]}>
              السابقة ({pastOrders.length.toLocaleString("ar-SA")})
            </Text>
          </Pressable>
        </View>

        {selectedTab === "current" ? (
          currentOrders.length === 0 ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                title="لا يوجد لديك طلب حالي"
                description="عندما تنشئ طلبًا جديدًا ستظهر حالة التحضير والاستلام هنا مباشرة."
                icon="receipt-outline"
                actionLabel="استكشاف التركات"
                onAction={() => navigation.navigate("Home")}
                secondaryLabel="الخريطة"
                onSecondary={() => navigation.navigate("Map")}
                variant="card"
              />
            </View>
          ) : (
            <View style={styles.stack}>
              {currentOrders.map((order) => (
                <CustomerOrderCard
                  key={order.id}
                  order={order}
                  isCurrent
                  statusLabel={statusLabel[order.status] ?? order.status}
                  onPressDetails={() => navigation.navigate("OrderDetails", { orderId: order.id })}
                />
              ))}
            </View>
          )
        ) : pastOrders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              title="لا توجد طلبات سابقة بعد"
              description="بعد اكتمال أول طلب لديك، ستظهر هنا بطاقات الطلبات السابقة والتقييم."
              icon="time-outline"
              actionLabel="ابدأ طلب جديد"
              onAction={() => navigation.navigate("Home")}
              variant="card"
            />
          </View>
        ) : (
          <View style={styles.stack}>
            {pastOrders.map((order) => {
              const draft = draftRatings[order.id] ?? { stars: 0, comment: "" };
              return (
                <CustomerOrderCard
                  key={order.id}
                  order={order}
                  isCurrent={false}
                  statusLabel={statusLabel[order.status] ?? order.status}
                  onPressDetails={() => navigation.navigate("OrderDetails", { orderId: order.id })}
                  onPressReorder={() =>
                    navigation.navigate("TruckDetails", { truckId: Number(order.truck_id), truckName: order.truck_name })
                  }
                  ratingValue={draft.stars}
                  ratingComment={draft.comment}
                  onRatingChange={(value) =>
                    setDraftRatings((prev) => ({ ...prev, [order.id]: { stars: value, comment: prev[order.id]?.comment ?? "" } }))
                  }
                  onRatingCommentChange={(value) =>
                    setDraftRatings((prev) => ({ ...prev, [order.id]: { stars: prev[order.id]?.stars ?? 0, comment: value } }))
                  }
                  onSubmitRating={() =>
                    submitReviewMutation.mutate({
                      orderId: order.id,
                      rating: draft.stars,
                      comment: draft.comment?.trim() || undefined
                    })
                  }
                  isSubmittingRating={submitReviewMutation.isPending && submitReviewMutation.variables?.orderId === order.id}
                />
              );
            })}
            {submitReviewMutation.isError ? (
              <Text style={styles.ratingError}>{getReadableNetworkError(submitReviewMutation.error)}</Text>
            ) : null}
          </View>
        )}
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pad: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120
  },
  guest: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md
  },
  guestCard: {
    marginTop: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.soft
  },
  guestIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.section,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  guestTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: "800"
  },
  guestBody: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xs
  },
  pageTitle: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: "800"
  },
  pageSub: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    lineHeight: 22
  },
  tabsWrap: {
    marginBottom: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 4,
    flexDirection: "row-reverse",
    gap: 4
  },
  tabBtn: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    alignItems: "center",
    justifyContent: "center"
  },
  tabBtnActive: {
    backgroundColor: colors.primaryMuted
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  tabTextActive: {
    color: colors.primaryDark
  },
  emptyWrap: {
    marginTop: spacing.md
  },
  stack: {
    gap: spacing.sm
  },
  errorCard: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
    ...shadows.soft
  },
  error: {
    color: colors.danger,
    fontSize: typography.bodySm,
    lineHeight: 22
  },
  ratingError: {
    marginTop: spacing.xs,
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: "700",
    textAlign: "right"
  }
});
