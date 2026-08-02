import { env } from '../constants/env';
import type { Restaurant, MenuItem } from '../data/mockData';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE_URL = env.RESTAURANT_API_URL;

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
      // Keep default message
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

// We map the backend DTO to the frontend interface if needed.
// Based on our updates, the backend response should match closely.
export interface RestaurantResponse extends Omit<Restaurant, 'id'> {
  restaurantId: string;
  menuItems: MenuItemResponse[];
}

export interface MenuItemResponse extends Omit<MenuItem, 'id'> {
  menuItemId: string;
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const data = await request<RestaurantResponse[]>('');
  return data.map(r => ({
    ...r,
    id: r.restaurantId,
  }));
}

export async function getRestaurantById(id: string): Promise<Restaurant & { menuItems: MenuItem[] }> {
  const data = await request<RestaurantResponse>(`/${id}`);
  return {
    ...data,
    id: data.restaurantId,
    menuItems: data.menuItems ? data.menuItems.map(m => ({
      ...m,
      id: m.menuItemId,
    })) : []
  };
}
