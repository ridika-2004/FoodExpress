import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, ArrowRight, Bike } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, deliveryFee, total, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-5">
          <ShoppingCart size={36} className="text-foreground-muted" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
        <p className="text-foreground-muted mt-1 text-sm">Looks like you haven't added anything yet</p>
        <Link
          to="/restaurants"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] shadow-md shadow-primary/20"
        >
          Browse Restaurants
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Your Cart</h1>
          <p className="text-foreground-muted text-sm mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''} from {items[0].restaurantName}</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors duration-200 cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white border border-border rounded-2xl p-4 mb-4 flex items-center gap-3 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bike size={22} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{items[0].restaurantName}</p>
          <p className="text-xs text-foreground-muted">{itemCount} items</p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.menuItem.id}
            className="bg-white border border-border rounded-xl p-4 flex gap-4 items-center hover:shadow-md transition-all duration-200 animate-slide-up"
          >
            <img
              src={item.menuItem.image}
              alt={item.menuItem.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-sm sm:text-base truncate">{item.menuItem.name}</h3>
              <p className="text-sm font-bold text-primary mt-1">₱{(item.menuItem.price * item.quantity).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-muted rounded-xl px-2 py-1.5">
                <button
                  onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                  className="p-1 hover:bg-border rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                  className="p-1 hover:bg-border rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.menuItem.id)}
                className="p-2 text-foreground-muted hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-6 bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-muted">Subtotal</span>
            <span className="font-medium text-foreground">₱{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">Delivery Fee</span>
            <span className={`font-medium ${deliveryFee === 0 ? 'text-success' : 'text-foreground'}`}>
              {deliveryFee === 0 ? 'Free' : `₱${deliveryFee}`}
            </span>
          </div>
          {subtotal < 500 && items.length > 0 && (
            <p className="text-xs text-foreground-muted bg-muted px-3 py-2 rounded-lg">
              Add ₱{(500 - subtotal).toLocaleString()} more for free delivery
            </p>
          )}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-bold text-lg text-foreground">₱{total.toLocaleString()}</span>
          </div>
        </div>

        <Link
          to="/checkout"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] shadow-md shadow-primary/20"
        >
          Proceed to Checkout
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Continue Shopping */}
      <div className="mt-4 text-center">
        <Link to="/restaurants" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200">
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}