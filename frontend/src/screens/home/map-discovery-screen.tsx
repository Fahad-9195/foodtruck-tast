import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { FiltersBottomSheet } from "@/components/composite/filters-bottom-sheet";
import { TruckCard } from "@/components/composite/truck-card";
import { useTrucksDiscovery } from "@/features/trucks/hooks/use-trucks-discovery";
import type { DiscoveryFilters } from "@/types/truck";
import type { RootStackParamList } from "@/navigation/root-stack";
import { getReadableNetworkError } from "@/services/api/network-error";
import { appConfig } from "@/config/app-config";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/base/ui-states";
import { SectionHeader } from "@/components/base/section-header";
import { useAuthStore } from "@/store/auth-store";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const MapDiscoveryScreen = ({ navigation }: Props) => {
  const [filters, setFilters] = useState<DiscoveryFilters>({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const accessToken = useAuthStore((s) => s.accessToken) ?? "";
  const { data, isLoading, isError, refetch, isFetching, error: discoveryError } = useTrucksDiscovery(filters, accessToken);

  const highlightedCount = useMemo(() => data?.length ?? 0, [data]);
  const discoveryErrorMessage = getReadableNetworkError(discoveryError);
  const showApiHint = !appConfig.isApiBaseUrlFromEnv;
  const items = data ?? [];
  const featuredTrucks = items.slice(0, Math.min(4, items.length));
  const nearbyTrucks = items.length > 4 ? items.slice(4) : [];

  const retry = () => {
    void refetch();
  };

  return (
    <View style={styles.screen}>
      <SectionHeader
        title="Discover Trucks"
        subtitle={`${highlightedCount} trucks near your filters`}
        actionLabel="Filters"
        onPressAction={() => setIsFilterVisible(true)}
      />

      <View style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapCardTitle}>Map Preview</Text>
          <Ionicons name="map-outline" size={18} color="#169BFF" />
        </View>
        <Text style={styles.mapCardSubtitle}>Production map integration (Mapbox/Google Maps) plugs here.</Text>
        <View style={styles.mapChipContainer}>
          {items.slice(0, 8).map((truck) => (
            <View key={truck.id} style={styles.mapChip}>
              <Text style={styles.mapChipText}>{truck.display_name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.listWrapper}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : null}

        {isError ? (
          <View>
            <ErrorState
              message={
                showApiHint
                  ? `${discoveryErrorMessage} Set EXPO_PUBLIC_API_BASE_URL in frontend/.env to your machine LAN IP.`
                  : discoveryErrorMessage
              }
              onRetry={retry}
            />
          </View>
        ) : null}

        {!isLoading && !isError ? (
          items.length === 0 ? (
            <EmptyState onRetry={retry} />
          ) : (
            <FlatList
              data={nearbyTrucks}
              keyExtractor={(item) => String(item.id)}
              refreshing={isFetching}
              onRefresh={() => void refetch()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 70 }}
              ListHeaderComponent={
                <View style={styles.featuredSection}>
                  <Text style={styles.sectionLabel}>Featured Trucks</Text>
                  <FlatList
                    horizontal
                    data={featuredTrucks}
                    keyExtractor={(item) => `featured-${item.id}`}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredListContent}
                    renderItem={({ item }) => (
                      <View style={styles.featuredCardWrap}>
                        <TruckCard
                          truck={item}
                          onPress={() => navigation.navigate("TruckDetails", { truckId: item.id, truckName: item.display_name })}
                        />
                      </View>
                    )}
                  />
                  <Text style={styles.sectionLabel}>Nearby</Text>
                </View>
              }
              renderItem={({ item }) => (
                <TruckCard
                  truck={item}
                  onPress={() => navigation.navigate("TruckDetails", { truckId: item.id, truckName: item.display_name })}
                />
              )}
            />
          )
        ) : null}
      </View>

      <FiltersBottomSheet
        visible={isFilterVisible}
        initialFilters={filters}
        onClose={() => setIsFilterVisible(false)}
        onApply={setFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F8FC",
    paddingHorizontal: 20,
    paddingTop: 56
  },
  mapCard: {
    marginTop: 18,
    height: 188,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D9E7F5",
    backgroundColor: "#FFFFFF",
    padding: 18
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  mapCardTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800"
  },
  mapCardSubtitle: {
    marginTop: 6,
    color: "#475569",
    fontSize: 14,
    lineHeight: 22
  },
  mapChipContainer: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  mapChip: {
    borderRadius: 999,
    backgroundColor: "#169BFF",
    paddingHorizontal: 11,
    paddingVertical: 5
  },
  mapChipText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700"
  },
  listWrapper: {
    marginTop: 20,
    flex: 1
  },
  featuredSection: {
    marginBottom: 10
  },
  sectionLabel: {
    color: "#0D8AF0",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 10
  },
  featuredListContent: {
    paddingBottom: 8,
    gap: 12
  },
  featuredCardWrap: {
    width: 310
  }
});
