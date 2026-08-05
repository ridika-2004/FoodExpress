/**
 * Delivery Service API client — talks to /api/delivery/* via the Vite proxy,
 * which forwards requests to the Spring Boot delivery-service on port 9004.
 */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE_URL = '/api/delivery';

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

// ── Types ────────────────────────────────────────────────────

export interface OrderItem {
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface DeliveryOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: string;
  estimatedDelivery: string;
  deliverymanId?: string;
  driverName?: string;
  driverPhone?: string;
  driverImage?: string;
  createdAt: string;
}

export interface Deliveryman {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isAvailable?: boolean;
}

// ── Orders ───────────────────────────────────────────────────

export async function getOrders(status?: string): Promise<DeliveryOrder[]> {
  const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
  return request<DeliveryOrder[]>(`/orders${query}`);
}

export async function assignDeliveryman(orderId: string, deliverymanId: string): Promise<DeliveryOrder> {
  return request<DeliveryOrder>(`/orders/${orderId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ deliverymanId }),
  });
}

export async function updateOrderStatus(orderId: string, status: string): Promise<DeliveryOrder> {
  return request<DeliveryOrder>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ── Deliverymen ──────────────────────────────────────────────

export async function getDeliverymen(): Promise<Deliveryman[]> {
  return request<Deliveryman[]>('/deliverymen');
}
