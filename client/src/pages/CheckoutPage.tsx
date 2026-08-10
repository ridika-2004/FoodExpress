import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Smartphone,
  CheckCircle,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/orderApi";

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
  },
  {
    id: "gcash",
    name: "GCash",
    icon: Smartphone,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: CheckCircle,
  },
];

export default function CheckoutPage() {
  const { items, restaurantId, restaurantName, clearCart } = useCart();

  const { user } = useAuth();

  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] = useState("card");

  const [isProcessing, setIsProcessing] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const [order, setOrder] = useState<Awaited<
    ReturnType<typeof placeOrder>
  > | null>(null);

  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    if (!user) {
      setError("Please log in before placing an order.");
      return;
    }

    if (!restaurantId || !restaurantName) {
      setError("Restaurant information is missing.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const createdOrder = await placeOrder({
        userId: user.id,

        customerName: user.name ?? "",

        phone: user.phone ?? "",

        deliveryAddress: "123 Main Street, Apt 4B, Downtown",

        restaurantId,

        restaurantName,

        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          menuItemName: item.menuItem.name,
          menuItemImage: item.menuItem.image,
          menuItemPrice: item.menuItem.price,
          quantity: item.quantity,
        })),
      });

      // Store the backend response
      setOrder(createdOrder);

      // Clear the cart after successful order creation
      await clearCart();

      setIsProcessing(false);
      setIsSuccess(true);

      // Navigate to orders page
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (err) {
      console.error("Failed to place order:", err);

      setIsProcessing(false);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to place order. Please try again.");
      }
    }
  };

  if (isSuccess && order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle
            size={64}
            className="text-success mx-auto mb-4"
          />

          <h1 className="text-2xl font-bold text-foreground">
            Order Placed! 🎉
          </h1>

          <p className="text-foreground-muted mt-2">
            Your food is being prepared
          </p>

          <p className="text-sm text-foreground-muted mt-4">
            Order ID: {order.id}
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Nothing to checkout
          </h1>

          <p className="text-foreground-muted mt-2">
            Add items to your cart first
          </p>

          <Link
            to="/restaurants"
            className="inline-block mt-5 px-5 py-3 bg-primary text-white rounded-xl"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} />
        Back to Cart
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-2xl font-bold text-foreground">
            Checkout
          </h1>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Delivery Address */}
          <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-primary" />
              Delivery Address
            </h2>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-xl">
              <MapPin
                size={16}
                className="text-primary mt-0.5"
              />

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Home
                </p>

                <p className="text-xs text-foreground-muted">
                  123 Main Street, Apt 4B, Downtown
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <CreditCard
                size={18}
                className="text-primary"
              />
              Payment Method
            </h2>

            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() =>
                    setSelectedPayment(pm.id)
                  }
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedPayment === pm.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-border/80 hover:bg-muted"
                  }`}
                >
                  <pm.icon
                    size={20}
                    className={
                      selectedPayment === pm.id
                        ? "text-primary"
                        : "text-foreground-muted"
                    }
                  />

                  <span
                    className={`text-sm font-medium ${
                      selectedPayment === pm.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {pm.name}
                  </span>

                  {selectedPayment === pm.id && (
                    <CheckCircle
                      size={16}
                      className="ml-auto text-primary"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Order Items
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.menuItem.name}
                    </p>

                    <p className="text-xs text-foreground-muted">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-foreground">
                    ₱
                    {(
                      item.menuItem.price *
                      item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Payment Summary
            </h2>

            {!order ? (
              <p className="text-sm text-foreground-muted">
                The final price will be calculated when you place
                the order.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">
                    Subtotal
                  </span>

                  <span className="font-medium">
                    ₱{order.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-foreground-muted">
                    Delivery Fee
                  </span>

                  <span
                    className={`font-medium ${
                      order.deliveryFee === 0
                        ? "text-success"
                        : ""
                    }`}
                  >
                    {order.deliveryFee === 0
                      ? "Free"
                      : `₱${order.deliveryFee}`}
                  </span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground">
                    Total
                  </span>

                  <span className="font-bold text-xl text-foreground">
                    ₱{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full mt-5 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Place Order"
              )}
            </button>

            <p className="text-xs text-foreground-muted text-center mt-3">
              By placing this order you agree to our Terms &
              Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}