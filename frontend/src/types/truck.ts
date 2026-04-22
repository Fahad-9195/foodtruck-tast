export type TruckDiscoveryItem = {
  id: number;
  display_name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  working_hours?: string | null;
  category_name?: string | null;
  avg_rating: string | number;
  rating_count: number;
  operational_status: "open" | "busy" | "closed" | "offline";
  latitude: string | number;
  longitude: string | number;
  neighborhood: string;
  city: string;
};

export type TruckDetails = {
  id: number;
  display_name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  avg_rating: string | number;
  rating_count: number;
  operational_status: "open" | "busy" | "closed" | "offline";
  latitude: string | number;
  longitude: string | number;
  neighborhood: string;
  city: string;
  menuItems: Array<{
    id: number;
    name: string;
    description: string | null;
    price: string | number;
    image_url: string | null;
    is_available: number;
    category_id: number;
  }>;
};

export type DiscoveryFilters = {
  city?: string;
  neighborhood?: string;
  categoryId?: number;
};
