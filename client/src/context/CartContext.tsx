import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

import type { CartItem, MenuItem } from "../data/mockData";
import { useAuth } from "./AuthContext";

import {
  addItem as addItemApi,
  getCart,
  updateQuantity as updateQuantityApi,
  removeItem as removeItemApi,
  clearCart as clearCartApi,
} from "../api/cartApi";

interface CartContextValue {
  items: CartItem[];

  addItem: (
    item: MenuItem,
    restaurantId: string,
    restaurantName: string
  ) => void;

  removeItem: (menuItemId: string) => void;

  updateQuantity: (
    menuItemId: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  restaurantId: string | null;
  restaurantName: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  const { user } = useAuth();

  // Load user's cart
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    getCart(user.id)
      .then((cart) => {
        const mappedItems: CartItem[] = cart.items.map((item) => ({
          restaurantId: cart.restaurantId,
          restaurantName: cart.restaurantName,

          quantity: item.quantity,

          menuItem: {
            id: item.menuItem.id,
            name: item.menuItem.name,
            image: item.menuItem.image,
            price: item.menuItem.price,

            description: "",
            category: "",
            isPopular: false,
            isVegetarian: false,
          },
        }));

        setItems(mappedItems);
      })
      .catch(() => {
        setItems([]);
      });
  }, [user]);

  // Add item
  const addItem = useCallback(
    async (
      menuItem: MenuItem,
      restaurantId: string,
      restaurantName: string
    ) => {
      if (!user) return;

      try {
        const cart = await addItemApi({
          userId: user.id,
          restaurantId,
          restaurantName,
          menuItemId: menuItem.id,
          menuItemName: menuItem.name,
          menuItemImage: menuItem.image,
          menuItemPrice: menuItem.price,
          quantity: 1,
        });

        const mappedItems: CartItem[] = cart.items.map((item) => ({
          restaurantId: cart.restaurantId,
          restaurantName: cart.restaurantName,

          quantity: item.quantity,

          menuItem: {
            id: item.menuItem.id,
            name: item.menuItem.name,
            image: item.menuItem.image,
            price: item.menuItem.price,

            description: "",
            category: "",
            isPopular: false,
            isVegetarian: false,
          },
        }));

        setItems(mappedItems);
      } catch (err) {
        console.error(err);
      }
    },
    [user]
  );

  // Remove item
  const removeItem = useCallback(
    async (menuItemId: string) => {
      if (!user) return;

      try {
        const cart = await removeItemApi(
          user.id,
          menuItemId
        );

        const mappedItems: CartItem[] = cart.items.map((item) => ({
          restaurantId: cart.restaurantId,
          restaurantName: cart.restaurantName,

          quantity: item.quantity,

          menuItem: {
            id: item.menuItem.id,
            name: item.menuItem.name,
            image: item.menuItem.image,
            price: item.menuItem.price,

            description: "",
            category: "",
            isPopular: false,
            isVegetarian: false,
          },
        }));

        setItems(mappedItems);
      } catch (err) {
        console.error(err);
      }
    },
    [user]
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (
      menuItemId: string,
      quantity: number
    ) => {
      if (!user) return;

      try {
        const cart = await updateQuantityApi(
          user.id,
          menuItemId,
          quantity
        );

        const mappedItems: CartItem[] = cart.items.map((item) => ({
          restaurantId: cart.restaurantId,
          restaurantName: cart.restaurantName,

          quantity: item.quantity,

          menuItem: {
            id: item.menuItem.id,
            name: item.menuItem.name,
            image: item.menuItem.image,
            price: item.menuItem.price,

            description: "",
            category: "",
            isPopular: false,
            isVegetarian: false,
          },
        }));

        setItems(mappedItems);
      } catch (err) {
        console.error(err);
      }
    },
    [user]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    if (!user) return;

    try {
      await clearCartApi(user.id);

      setItems([]);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  // Restaurant information
  const restaurantId = useMemo(
    () => items[0]?.restaurantId ?? null,
    [items]
  );

  const restaurantName = useMemo(
    () => items[0]?.restaurantName ?? null,
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        restaurantId,
        restaurantName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return ctx;
}