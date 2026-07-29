export const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  confirmed: { label: 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-50' },
  preparing: { label: 'Preparing', color: 'text-orange-600', bg: 'bg-orange-50' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-primary', bg: 'bg-primary/5' },
  delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
};

export const ORDER_STATUS_FILTERS = [
  'all',
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
] as const;

export const CATEGORIES = [
  'Pizza', 'Burgers', 'Sushi', 'Pasta', 'Curry', 'Desserts', 'Drinks',
  'Sides', 'Salads', 'BBQ', 'Rice', 'Breads', 'Soups', 'Cakes',
  'Pastries', 'Nigiri', 'Rolls', 'Sandwiches',
] as const;