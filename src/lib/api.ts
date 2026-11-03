import { decodeJwt } from "jose";

import { authClient } from "@/lib/auth-client";

export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function isUnauthorized(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 401;
}

export function getErrorMessage(
  error: unknown,
  fallback = "The studio service couldn't complete this request.",
): string {
  return error instanceof ApiError ? error.message : fallback;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(
  /\/+$/,
  "",
);

const TOKEN_EXPIRY_BUFFER_MS = 30 * 1000;

let cachedApiToken: string | null = null;
let cachedApiTokenExpiresAt = 0;
let pendingTokenPromise: Promise<string | null> | null = null;

export function clearCachedApiToken(): void {
  cachedApiToken = null;
  cachedApiTokenExpiresAt = 0;
}

async function getApiToken(): Promise<string | null> {
  const now = Date.now();

  if (
    cachedApiToken &&
    cachedApiTokenExpiresAt - now > TOKEN_EXPIRY_BUFFER_MS
  ) {
    return cachedApiToken;
  }

  if (pendingTokenPromise) {
    return pendingTokenPromise;
  }

  pendingTokenPromise = (async () => {
    try {
      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        return null;
      }

      const token = tokenResult.data.token;
      try {
        const payload = decodeJwt(token);
        cachedApiToken = token;
        cachedApiTokenExpiresAt =
          typeof payload.exp === "number"
            ? payload.exp * 1000
            : now + 60 * 60 * 1000;
      } catch {
        cachedApiToken = token;
        cachedApiTokenExpiresAt = now + 60 * 1000;
      }

      return token;
    } catch {
      return null;
    } finally {
      pendingTokenPromise = null;
    }
  })();

  return pendingTokenPromise;
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {};

  if (options.auth) {
    const token = await getApiToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}/api${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    cache: "no-store",
    headers: Object.keys(headers).length ? headers : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    clearCachedApiToken();
  }

  if (!response.ok) {
    throw new ApiError(
      (data as { message?: string } | null)?.message ??
        "The studio service couldn't complete this request.",
      response.status,
      data,
    );
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, options?: { auth?: boolean }) =>
    request<T>(path, options),
  post: <T>(
    path: string,
    body: unknown,
    options?: { auth?: boolean },
  ) => request<T>(path, { method: "POST", body, auth: options?.auth }),
  patch: <T>(
    path: string,
    body: unknown,
    options?: { auth?: boolean },
  ) => request<T>(path, { method: "PATCH", body, auth: options?.auth }),
  delete: <T>(path: string, options?: { auth?: boolean }) =>
    request<T>(path, { method: "DELETE", auth: options?.auth }),
};

interface ImgbbUploadResult {
  success: boolean;
  data?: { url?: string };
  error?: { message?: string };
}

export const imgbbApi = {
  async upload(file: File): Promise<{ url: string }> {
    const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
    if (!key) {
      throw new Error("Image upload is not configured. Paste an image URL instead.");
    }

    const body = new FormData();
    body.append("image", file);
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`,
      { method: "POST", body },
    );
    const result = (await response.json().catch(() => null)) as ImgbbUploadResult | null;
    const url = result?.data?.url;

    if (!response.ok || !result?.success || !url) {
      throw new ApiError(
        result?.error?.message ?? "The image couldn't be uploaded. Try again or paste an image URL.",
        response.status || 502,
        result,
      );
    }

    return { url };
  },
};

export interface StudioSearchParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "rating" | "price-asc" | "price-desc";
  page?: number;
  limit?: number;
  search?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface StudioRecord {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  image: string;
  gallery?: string[];
  amenities: string[];
  overview: string;
  rating: number;
  ownerId: string;
  ownerEmail: string;
  ownerPhoto?: string;
  ownerImage?: string;
  ownerName: string;
  createdAt: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface BookingRecord {
  _id: string;
  studioId: string;
  studioTitle: string;
  userEmail: string;
  customerEmail?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  startAt?: string;
  endAt?: string;
  durationHours?: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface ReviewRecord {
  _id: string;
  name: string;
  image?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewCreateInput {
  studioId: string;
  rating: number;
  comment: string;
}

export interface StudioListResult {
  studios: StudioRecord[];
  pagination: Pagination;
}

export interface StudioDetailResult {
  studio: StudioRecord;
}

export interface StudioMutationResult {
  message: string;
  studio?: StudioRecord;
}

export interface StudioDeleteResult {
  message: string;
}

export interface BookingCreateInput {
  studioId: string;
  startAt: string;
  endAt: string;
}

export interface BookingStatusInput {
  status: "Confirmed" | "Cancelled";
}

export interface BookingMutationResult {
  message: string;
  booking?: BookingRecord;
}

export interface ReviewListResult {
  reviews: ReviewRecord[];
}

export interface ReviewMutationResult {
  message: string;
  review: ReviewRecord;
}

export function studioListEndpoint(params: StudioSearchParams = {}): string {
  const query = new URLSearchParams();

  if (params.category) query.set("category", params.category);
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);

  const suffix = query.toString();
  return `/studios${suffix ? `?${suffix}` : ""}`;
}

export const studiosApi = {
  list: (params: StudioSearchParams = {}) =>
    apiClient.get<StudioListResult>(studioListEndpoint(params)),
  byId: (id: string) =>
    apiClient.get<StudioDetailResult>(`/studios/${encodeURIComponent(id)}`),
  mine: () => apiClient.get<{ studios: StudioRecord[] }>("/my-studios", { auth: true }),
  create: (input: Omit<StudioRecord, "_id" | "createdAt" | "rating" | "ownerId">) =>
    apiClient.post<StudioMutationResult>("/studios", input, { auth: true }),
  update: (
    id: string,
    input: Partial<Omit<StudioRecord, "_id" | "createdAt" | "rating" | "ownerId">>,
  ) =>
    apiClient.patch<StudioMutationResult>(
      `/studios/${encodeURIComponent(id)}`,
      input,
      { auth: true },
    ),
  remove: (id: string) =>
    apiClient.delete<StudioDeleteResult>(
      `/studios/${encodeURIComponent(id)}`,
      { auth: true },
    ),
};

export const bookingsApi = {
  create: (input: BookingCreateInput) =>
    apiClient.post<BookingMutationResult>("/bookings", input, { auth: true }),
  mine: () => apiClient.get<{ bookings: BookingRecord[] }>("/bookings/my", { auth: true }),
  host: () => apiClient.get<{ bookings: BookingRecord[] }>("/bookings/host", { auth: true }),
  cancel: (id: string) =>
    apiClient.patch<BookingMutationResult>(
      `/bookings/${encodeURIComponent(id)}/cancel`,
      {},
      { auth: true },
    ),
  updateStatus: (id: string, input: BookingStatusInput) =>
    apiClient.patch<BookingMutationResult>(
      `/bookings/${encodeURIComponent(id)}/status`,
      input,
      { auth: true },
    ),
};

export const reviewsApi = {
  forStudio: (studioId: string) =>
    apiClient.get<ReviewListResult>(
      `/reviews?studioId=${encodeURIComponent(studioId)}`,
    ),
  create: (input: ReviewCreateInput) =>
    apiClient.post<ReviewMutationResult>("/reviews", input, { auth: true }),
};
