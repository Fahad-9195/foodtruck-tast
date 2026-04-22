import { apiClient } from "@/services/api/client";
import type { DiscoveryFilters, TruckDetails, TruckDiscoveryItem } from "@/types/truck";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const getDiscoveryTrucks = async (filters: DiscoveryFilters, accessToken?: string) => {
  const response = await apiClient.get<ApiEnvelope<{ items: TruckDiscoveryItem[] }>>("/trucks/discovery", {
    params: filters,
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`
        }
      : undefined
  });

  return response.data.data.items;
};

export const getTruckDetails = async (truckId: number, accessToken?: string) => {
  const response = await apiClient.get<ApiEnvelope<TruckDetails>>(`/trucks/${truckId}/details`, {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`
        }
      : undefined
  });

  return response.data.data;
};

export type OwnerTruckItem = {
  id: number;
  display_name: string;
  approval_status: "pending" | "approved" | "rejected";
  operational_status: "open" | "busy" | "closed" | "offline";
  created_at: string;
  review_note?: string | null;
  reviewed_at?: string | null;
};

export type OwnerNotificationItem = {
  id: number;
  title: string;
  body: string;
  type: "admin_action" | "order_update" | "system";
  is_read: boolean;
  metadata_json: string | null;
  created_at: string;
};

export type OwnerTruckDraft = {
  id: number;
  display_name: string | null;
  description: string | null;
  cover_image_url: string | null;
  working_hours: string | null;
  contact_phone: string | null;
  approval_status: "pending" | "approved" | "rejected";
  city: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  captured_at: string | null;
  license_number: string | null;
  document_url: string | null;
  expires_at: string | null;
  category_name: string | null;
};

export const getMyOwnerTrucks = async (accessToken: string) => {
  const response = await apiClient.get<ApiEnvelope<{ items: OwnerTruckItem[] }>>("/trucks/mine", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data.data.items;
};

export const getMyOwnerNotifications = async (accessToken: string) => {
  const response = await apiClient.get<ApiEnvelope<{ items: OwnerNotificationItem[] }>>("/trucks/mine/notifications", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data.data.items;
};

export const getMyOwnerTruckDraft = async (accessToken: string) => {
  const response = await apiClient.get<ApiEnvelope<{ item: OwnerTruckDraft | null }>>("/trucks/mine/draft", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data.data.item;
};

export const updateOwnerTruckProfile = async (
  truckId: number,
  payload: { workingHours: string },
  accessToken: string
) => {
  await apiClient.patch(
    `/trucks/${truckId}/profile`,
    { workingHours: payload.workingHours },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
};

export const updateOwnerTruckLocation = async (
  truckId: number,
  payload: { latitude: number; longitude: number; city: string; neighborhood: string },
  accessToken: string
) => {
  await apiClient.patch(`/trucks/${truckId}/location`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const updateOwnerTruckStatus = async (
  truckId: number,
  status: "open" | "closed",
  accessToken: string
) => {
  await apiClient.patch(
    `/trucks/${truckId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
};

type RegisterTruckPayload = {
  displayName: string;
  categoryName: string;
  description?: string;
  workingHours: string;
  contactPhone: string;
  coverImageUrl?: string;
  location: { latitude: number; longitude: number; neighborhood: string; city: string };
  license: { licenseNumber: string; documentUrl: string; expiresAt: string };
};

export const registerTruck = async (payload: RegisterTruckPayload, accessToken: string) => {
  const response = await apiClient.post<ApiEnvelope<{ truckId: number; approvalStatus: string }>>("/trucks", payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data.data;
};

export const uploadSingleFile = async (
  payload: { uri: string; fileName?: string; mimeType?: string },
  accessToken: string
) => {
  const inferredName = payload.fileName ?? payload.uri.split("/").pop() ?? `upload-${Date.now()}`;
  const inferredType =
    payload.mimeType ??
    (inferredName.toLowerCase().endsWith(".pdf")
      ? "application/pdf"
      : inferredName.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/)
        ? `image/${inferredName.split(".").pop() === "jpg" ? "jpeg" : inferredName.split(".").pop()}`
        : "application/octet-stream");

  const form = new FormData();
  form.append("file", {
    uri: payload.uri,
    name: inferredName,
    type: inferredType
  } as unknown as Blob);

  const response = await apiClient.post<ApiEnvelope<{ url: string; fileName: string }>>("/uploads/single", form, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data.data;
};
