import { BASE_URL, User } from "./api";

export interface AuthResponse {
  success: boolean;
  access_token?: string;
  user?: User;
  error?: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  // If the HTTP status is not OK, ensure we surface the error
  if (!res.ok) {
    return {
      success: false,
      error: data.error || `Login failed (${res.status})`,
    };
  }

  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: data.error || `Registration failed (${res.status})`,
    };
  }

  return data;
}

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

/**
 * Check if the stored token is still valid by calling /me.
 * Returns the user if valid, null otherwise (and clears stale token).
 */
export async function verifyToken(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      removeToken();
      return null;
    }

    const data = await res.json();
    return data.data ?? null;
  } catch {
    removeToken();
    return null;
  }
}
