import { env } from "../constants/env";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const BASE_URL = env.CART_API_URL;

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;

    try {
      const body = await res.json();

      if (body?.message) {
        message = body.message;
      }
    } catch {
      // Keep default message
    }

    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}

export interface CartRequest {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  menuItemId: string;
  menuItemName: string;
  menuItemImage: string;
  menuItemPrice: number;
  quantity: number;
}

export interface CartItemResponse {
  menuItem: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItemResponse[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export function addItem(payload: CartRequest) {
  return request<CartResponse>("/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCart(userId: string) {
  return request<CartResponse>(`/${userId}`);
}

export function updateQuantity(
  userId: string,
  menuItemId: string,
  quantity: number
) {
  return request<CartResponse>(
    `/${userId}/items/${menuItemId}?quantity=${quantity}`,
    {
      method: "PUT",
    }
  );
}

export function removeItem(userId: string, menuItemId: string) {
  return request<CartResponse>(
    `/${userId}/items/${menuItemId}`,
    {
      method: "DELETE",
    }
  );
}

export function clearCart(userId: string) {
  return request<void>(`/${userId}`, {
    method: "DELETE",
  });
}