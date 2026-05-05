/** Relative `/api` matches Docker Nginx and local Vite proxy (see vite.config.ts). */
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  avatar_url?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

import { getToken, removeToken } from "./auth";

/** Dispatched when an authenticated API call gets 401 (listener updates UI without full reload). */
export const AUTH_SESSION_EXPIRED_EVENT = "app:auth-session-expired";

/**
 * Helper: build auth headers. If no token, returns empty object.
 */
function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function notifySessionExpired(detail: { notify: boolean }) {
  removeToken();
  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_EXPIRED_EVENT, { detail })
  );
}

/**
 * Handle 401 from protected routes — avoid location.reload() (duplicate requests / noisy console).
 */
function handleUnauthorized(res: Response, opts?: { notify?: boolean }) {
  if (res.status === 401) {
    notifySessionExpired({ notify: opts?.notify !== false });
  }
}

//  GET USERS (search + pagination)
export async function fetchUsers(
  page: number,
  limit: number,
  search: string
): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));

  const url = `${BASE_URL}/users?${params.toString()}`;
  const res = await fetch(url, {
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const result = await res.json().catch(() => ({}));
    throw new Error(result.error || "Failed to fetch users");
  }

  const result = await res.json();

  return {
    data: result.data.users,
    total: result.data.pagination?.total || result.data.users.length,
    page: result.data.pagination?.page || 1,
    limit: result.data.pagination?.limit || limit,
  };
}

// GET USER BY ID
export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const result = await res.json().catch(() => ({}));
    throw new Error(result.error || "User not found");
  }

  const result = await res.json();
  return result.data;
}

//  CREATE USER (uses /register endpoint)
export async function createUser(
  data: Pick<User, "name" | "email" | "role"> & { password?: string, avatar_url?: string }
): Promise<User> {
  const payload = {
    ...data,
    password: data.password || "defaultPass123", // provide a default if not specified
  };

  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to create user");
  }

  return result.data;
}

//  DELETE USER
export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const result = await res.json().catch(() => ({}));
    throw new Error(result.error || "Failed to delete user");
  }
}