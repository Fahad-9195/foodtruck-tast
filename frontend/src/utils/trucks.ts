import type { TruckDiscoveryItem } from "@/types/truck";

import { haversineKm } from "./geo";

/** Stable unique list by truck id (API or UI bugs may still duplicate). */
export const dedupeTrucksById = (items: TruckDiscoveryItem[]): TruckDiscoveryItem[] => {
  const map = new Map<number, TruckDiscoveryItem>();
  for (const t of items) {
    const id = Number(t.id);
    if (!Number.isFinite(id)) continue;
    if (!map.has(id)) map.set(id, t);
  }
  return [...map.values()];
};

export const sortTrucksByDistance = (
  items: TruckDiscoveryItem[],
  userLat: number | null,
  userLng: number | null
): TruckDiscoveryItem[] => {
  if (userLat === null || userLng === null) return [...items];
  return [...items].sort((a, b) => {
    const da = haversineKm(userLat, userLng, Number(a.latitude), Number(a.longitude));
    const db = haversineKm(userLat, userLng, Number(b.latitude), Number(b.longitude));
    return da - db;
  });
};
