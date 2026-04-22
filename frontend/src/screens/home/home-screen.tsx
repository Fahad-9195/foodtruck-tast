import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { useQuery } from "@tanstack/react-query";

import { AppButton } from "@/components/buttons";
import { ErrorState } from "@/components/base/ui-states";
import { EmptyState } from "@/components/design/empty-state";
import { LoadingSkeleton } from "@/components/design/loading-skeleton";
import { FiltersBottomSheet } from "@/components/composite/filters-bottom-sheet";
import { HomeHeader } from "@/components/composite/home-header";
import { OrderCard } from "@/components/composite/order-card";
import { SearchBar } from "@/components/composite/search-bar";
import { TruckCard } from "@/components/composite/truck-card";
import { AppContainer } from "@/components/layout/app-container";
import { getMyPickupOrders } from "@/features/orders/api/orders.api";
import { useTrucksDiscovery } from "@/features/trucks/hooks/use-trucks-discovery";
import type { MainTabParamList } from "@/navigation/main-tabs";
import type { RootStackParamList } from "@/navigation/root-stack";
import { getReadableNetworkError } from "@/services/api/network-error";
import { useAuthStore } from "@/store/auth-store";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import type { DiscoveryFilters, TruckDiscoveryItem } from "@/types/truck";
import { formatDistanceKm, haversineKm } from "@/utils/geo";
import { sortTrucksByDistance } from "@/utils/trucks";

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

const statusLabel: Record<string, string> = {
  pending: "جديد",
  preparing: "قيد التحضير",
  ready: "جاهز للاستلام",
  picked_up: "تم الاستلام",
  cancelled: "ملغي"
};

const greetingForHour = () => {
  const h = new Date().getHours();
  if (h < 12) return "صباح الخير";
  if (h < 17) return "مساء الخير";
  return "مساء النور";
};

export const HomeScreen = () => {
  const navigation = useNavigation<HomeNav>();
  const accessToken = useAuthStore((s) => s.accessToken) ?? "";
  const user = useAuthStore((s) => s.user);

  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState<DiscoveryFilters>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const listRef = useRef<FlatList<TruckDiscoveryItem>>(null);

  const discoveryQuery = useTrucksDiscovery(filters, accessToken);
  const trucks = discoveryQuery.data ?? [];

  const ordersQuery = useQuery({
    queryKey: ["customer-pickup-orders", accessToken],
    queryFn: () => getMyPickupOrders(accessToken),
    enabled: !!accessToken
  });

  const requestLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        setLocationDenied(true);
        return;
      }
      setLocationDenied(false);
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLat(pos.coords.latitude);
      setUserLng(pos.coords.longitude);
    } catch {
      setLocationDenied(true);
    }
  }, []);

  useEffect(() => {
    void requestLocation();
  }, [requestLocation]);

  const orderedTrucks = useMemo(() => {
    const sorted = sortTrucksByDistance(trucks, userLat, userLng);
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((t) => t.display_name.toLowerCase().includes(q));
  }, [trucks, userLat, userLng, query]);

  const distanceForTruck = useCallback(
    (t: TruckDiscoveryItem) => {
      if (userLat === null || userLng === null) return null;
      const km = haversineKm(userLat, userLng, Number(t.latitude), Number(t.longitude));
      return formatDistanceKm(km);
    },
    [userLat, userLng]
  );

  const navigateTruck = useCallback(
    (truck: TruckDiscoveryItem) => {
      navigation.navigate("TruckDetails", { truckId: truck.id, truckName: truck.display_name });
    },
    [navigation]
  );

  const currentOrders = useMemo(
    () => (ordersQuery.data ?? []).filter((o) => ["pending", "preparing", "ready"].includes(o.status)),
    [ordersQuery.data]
  );

  const onRefresh = useCallback(async () => {
    await Promise.all([discoveryQuery.refetch(), ordersQuery.refetch(), requestLocation()]);
  }, [discoveryQuery, ordersQuery, requestLocation]);

  const locationLine = useMemo(() => {
    if (locationDenied) return "الموقع غير مفعّل";
    if (userLat !== null && userLng !== null) return "تم تحديد موقعك الحالي";
    return "جاري تحديد الموقع…";
  }, [locationDenied, userLat, userLng]);

  const greetingName = user?.fullName?.trim() ? user.fullName.trim() : "ضيفنا";

  const listData = useMemo(() => {
    if (discoveryQuery.isLoading || discoveryQuery.isError || orderedTrucks.length === 0) return [];
    return orderedTrucks;
  }, [discoveryQuery.isLoading, discoveryQuery.isError, orderedTrucks]);

  const listHeader = (
    <View style={styles.headerBlock}>
      <HomeHeader
        greeting={`${greetingForHour()}، ${greetingName}`}
        locationLine={locationLine}
        onSearchPress={() => setShowSearch((s) => !s)}
        onFiltersPress={() => setFilterOpen(true)}
        searchActive={showSearch}
      />

      {showSearch ? (
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChange={setQuery} />
        </View>
      ) : null}

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>التركات القريبة منك</Text>
        <Text style={styles.sectionSub}>{orderedTrucks.length} ترك في النتائج</Text>
      </View>

      {discoveryQuery.isLoading ? <LoadingSkeleton rows={4} /> : null}
      {discoveryQuery.isError ? (
        <ErrorState message={getReadableNetworkError(discoveryQuery.error)} onRetry={() => void discoveryQuery.refetch()} />
      ) : null}
      {!discoveryQuery.isLoading && !discoveryQuery.isError && orderedTrucks.length === 0 ? (
        <EmptyState
          title="لا توجد تركات"
          description="جرّب البحث أو الفلاتر، أو افتح الخريطة لاستكشاف المواقع بصريًا."
          icon="restaurant-outline"
          actionLabel="تحديث القائمة"
          onAction={() => void discoveryQuery.refetch()}
          secondaryLabel="فتح الخريطة"
          onSecondary={() => navigation.navigate("Map")}
          variant="card"
        />
      ) : null}
    </View>
  );

  const listFooter = (
    <View style={styles.footerBlock}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>طلباتي</Text>
        {!accessToken ? (
          <Text style={styles.sectionSub}>سجّل الدخول لمتابعة الطلب النشط</Text>
        ) : (
          <Text style={styles.sectionSub}>الطلبات الجارية فقط — التفاصيل الكاملة في تبويب الطلبات</Text>
        )}
      </View>

      {!accessToken ? (
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>تتبع طلبك لحظة بلحظة</Text>
          <Text style={styles.authBody}>سجّل الدخول لعرض حالة التحضير والاستلام للطلب الحالي.</Text>
          <AppButton label="تسجيل الدخول" onPress={() => navigation.navigate("Auth")} variant="primary" fullWidth />
        </View>
      ) : ordersQuery.isLoading ? (
        <LoadingSkeleton rows={2} />
      ) : ordersQuery.isError ? (
        <Text style={styles.muted}>{getReadableNetworkError(ordersQuery.error)}</Text>
      ) : currentOrders.length === 0 ? (
        <EmptyState
          title="لا طلب نشط حاليًا"
          description="اطلب من ترك قريب وستظهر حالة طلبك هنا فورًا."
          icon="receipt-outline"
          actionLabel="استكشف التركات"
          onAction={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          secondaryLabel="فتح الخريطة"
          onSecondary={() => navigation.navigate("Map")}
          variant="card"
        />
      ) : (
        <View style={styles.orderBlock}>
          {currentOrders.slice(0, 3).map((order) => (
            <OrderCard
              key={order.id}
              truckName={order.truck_name}
              orderNumber={order.order_number}
              statusLabel={statusLabel[order.status] ?? order.status}
              statusCode={order.status}
              eta={
                order.estimated_ready_minutes
                  ? `جاهز خلال ${order.estimated_ready_minutes.toLocaleString("ar-SA")} د`
                  : "قيد المعالجة"
              }
              isCurrent
            />
          ))}
          <AppButton label="تفاصيل الطلبات" onPress={() => navigation.navigate("Orders")} variant="ghost" fullWidth />
        </View>
      )}
    </View>
  );

  return (
    <AppContainer edges={["top"]}>
      <FlatList
        ref={listRef}
        data={listData}
        keyExtractor={(item) => `truck-${item.id}`}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        ListHeaderComponentStyle={styles.listHeaderStyle}
        ListFooterComponentStyle={styles.listFooterStyle}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={discoveryQuery.isFetching || ordersQuery.isFetching}
            onRefresh={() => void onRefresh()}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <TruckCard truck={item} distanceLabel={distanceForTruck(item)} onPress={() => navigateTruck(item)} />
        )}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({ offset: Math.max(0, info.averageItemLength * info.index), animated: true });
        }}
        showsVerticalScrollIndicator={false}
      />

      <FiltersBottomSheet visible={filterOpen} initialFilters={filters} onClose={() => setFilterOpen(false)} onApply={setFilters} />
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
    paddingTop: spacing.sm
  },
  listHeaderStyle: {},
  listFooterStyle: {
    paddingTop: spacing.md
  },
  headerBlock: {
    gap: 0
  },
  footerBlock: {
    gap: 0,
    paddingBottom: spacing.md
  },
  searchWrap: {
    marginBottom: spacing.sm
  },
  sectionHead: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    gap: 4
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: "800"
  },
  sectionSub: {
    color: colors.textMuted,
    fontSize: typography.caption
  },
  authCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  authTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: typography.h3
  },
  authBody: {
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: typography.bodySm
  },
  orderBlock: {
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  muted: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    marginBottom: spacing.md
  }
});
