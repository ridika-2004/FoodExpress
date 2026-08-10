import { env } from "../constants/env";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const BASE_URL = env.ORDER_API_URL;

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

export interface OrderItemRequest {
  menuItemId: string;
  menuItemName: string;
  menuItemImage: string;
  menuItemPrice: number;
  quantity: number;
}

export interface OrderRequest {
  userId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  menuItem: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItemResponse[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
}

export function placeOrder(payload: OrderRequest) {
  return request<OrderResponse>("", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrder(orderId: string) {
  return request<OrderResponse>(`/${orderId}`);
}

export function getOrdersByUser(userId: string) {
  return request<OrderResponse[]>(`/user/${userId}`);
}

export function getOrdersByRestaurant(restaurantId: string) {
  return request<OrderResponse[]>(`/restaurant/${restaurantId}`);
}

export function updateOrderStatus(
  orderId: string,
  status: string
) {
  return request<OrderResponse>(
    `/${orderId}/status?status=${status}`,
    {
      method: "PUT",
    }
  );
}