import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import type { TruckDiscoveryItem } from "@/types/truck";

type MapCardProps = {
  trucks: TruckDiscoveryItem[];
};

export const MapCard = ({ trucks }: MapCardProps) => {
  const first = trucks[0];
  const initialLatitude = Number(first?.latitude ?? 24.7136);
  const initialLongitude = Number(first?.longitude ?? 46.6753);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>خريطة التركات المباشرة</Text>
        <Ionicons name="map-outline" size={18} color="#A6B4CF" />
      </View>
      <Text style={styles.subtitle}>استعرض المواقع القريبة لاكتشاف عربات الطعام المتاحة حولك.</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: Number.isFinite(initialLatitude) ? initialLatitude : 24.7136,
          longitude: Number.isFinite(initialLongitude) ? initialLongitude : 46.6753,
          latitudeDelta: 0.14,
          longitudeDelta: 0.14
        }}
      >
        {trucks
          .filter((truck) => Number.isFinite(Number(truck.latitude)) && Number.isFinite(Number(truck.longitude)))
          .map((truck) => (
            <Marker
              key={`map-pin-${truck.id}`}
              coordinate={{ latitude: Number(truck.latitude), longitude: Number(truck.longitude) }}
              title={truck.display_name}
              description={`${truck.neighborhood}, ${truck.city}`}
            />
          ))}
      </MapView>

      <View style={styles.pinRow}>
        {trucks.slice(0, 4).map((truck) => (
          <View key={`pin-label-${truck.id}`} style={styles.pinChip}>
            <Ionicons name="location" size={12} color="#BFDBFE" />
            <Text style={styles.pinText}>{truck.display_name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#CDE7FF",
    backgroundColor: "#FFFFFF",
    padding: 16,
    overflow: "hidden",
    shadowColor: "#60A5FA",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 18
  },
  subtitle: {
    marginTop: 6,
    color: "#475569",
    fontSize: 13,
    lineHeight: 20
  },
  map: {
    marginTop: 12,
    width: "100%",
    height: 320,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE"
  },
  pinRow: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  pinChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CDE7FF",
    backgroundColor: "#EAF5FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  pinText: {
    color: "#0369A1",
    fontSize: 11,
    fontWeight: "600"
  }
});
