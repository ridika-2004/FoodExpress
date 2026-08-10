/**
 * User Service API client — talks to /api/users/* via the Vite proxy,
 * which forwards requests to the Spring Boot user-service on port 9005.
 */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE_URL = '/api/users';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // keep default
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

export interface ServiceUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  isAvailable?: boolean;
  restaurantId?: string;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

/** Current user's profile. */
export function getMe(token: string) {
  return request<ServiceUser>('/me', { headers: authHeaders(token) });
}

/** Current deliveryman's availability state. */
export function getMyAvailability(token: string) {
  return request<ServiceUser>('/me/availability', { headers: authHeaders(token) });
}

/** Set availability explicitly (omit `isAvailable` to flip the current value). */
export function setMyAvailability(token: string, isAvailable?: boolean) {
  return request<ServiceUser>('/me/availability', {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ isAvailable: isAvailable ?? null }),
  });
}

/** Deliverymen directory, optionally filtered to those currently available. */
export function getDeliverymen(available?: boolean) {
  const query = available === undefined ? '' : `?available=${available}`;
  return request<ServiceUser[]>(`/deliverymen${query}`);
}
