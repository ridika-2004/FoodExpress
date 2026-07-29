import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { CartItem, MenuItem } from '../data/mockData';
import { env } from '../constants/env';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  restaurantId: string | null;
  restaurantName: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((menuItem: MenuItem, restaurantId: string, restaurantName: string) => {
    setItems(prev => {
      // If cart has items from a different restaurant, clear it first
      if (prev.length > 0 && prev[0].restaurantId !== restaurantId) {
        return [{ menuItem, restaurantId, restaurantName, quantity: 1 }];
      }
      const existing = prev.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(i =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem, restaurantId, restaurantName, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems(prev => prev.filter(i => i.menuItem.id !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.menuItem.id !== menuItemId));
      return;
    }
    setItems(prev =>
      prev.map(i => (i.menuItem.id === menuItemId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0), [items]);
  const deliveryFee = useMemo(() => (subtotal > env.FREE_DELIVERY_THRESHOLD ? 0 : items.length > 0 ? env.DELIVERY_FEE : 0), [subtotal, items.length]);
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);
  const restaurantId = useMemo(() => items[0]?.restaurantId ?? null, [items]);
  const restaurantName = useMemo(() => items[0]?.restaurantName ?? null, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, deliveryFee, total, restaurantId, restaurantName }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}