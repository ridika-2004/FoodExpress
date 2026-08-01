import { env } from '../constants/env';
import type { UserRole } from '../data/mockData';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  isAvailable?: boolean;
  restaurantId?: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE_URL = env.AUTH_API_URL;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // On network failure (backend offline) fetch rejects with TypeError —
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
      /* keep default message */
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

export function login(credentials: { email: string; password: string }) {
  return request<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function register(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  secretCode?: string;
}) {
  return request<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function me(token: string) {
  return request<ApiUser>('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
