import { useQuery } from "@tanstack/react-query";

import { getDiscoveryTrucks } from "../api/trucks.api";
import type { DiscoveryFilters } from "@/types/truck";
import { dedupeTrucksById } from "@/utils/trucks";

export const useTrucksDiscovery = (filters: DiscoveryFilters, accessToken?: string) => {
  return useQuery({
    queryKey: ["trucks-discovery", filters],
    queryFn: () => getDiscoveryTrucks(filters, accessToken),
    enabled: true,
    select: (items) => dedupeTrucksById(items)
  });
};
