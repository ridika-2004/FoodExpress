import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'gcash', name: 'GCash', icon: Smartphone },
  { id: 'cod', name: 'Cash on Delivery', icon: CheckCircle },
];

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total } = useCart();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/orders'), 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <CheckCircle size={40} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Order Placed! 🎉</h2>
          <p className="text-foreground-muted mt-2">Your food is being prepared</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-foreground">Nothing to checkout</h2>
        <p className="text-foreground-muted mt-1 text-sm">Add items to your cart first</p>
        <Link to="/restaurants" className="mt-4 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Cart
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left - Form */}
        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>

          {/* Delivery Address */}
          <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                Delivery Address
              </h2>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-xl">
              <MapPin size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Home</p>
                <p className="text-xs text-foreground-muted">123 Main Street, Apt 4B, Downtown</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-primary" />
              Payment Method
            </h2>
            <div className="space-y-2">
              {paymentMethods.map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedPayment === pm.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border/80 hover:bg-muted'
                  }`}
                >
                  <pm.icon size={20} className={selectedPayment === pm.id ? 'text-primary' : 'text-foreground-muted'} />
                  <span className={`text-sm font-medium ${selectedPayment === pm.id ? 'text-primary' : 'text-foreground'}`}>
                    {pm.name}
                  </span>
                  {selectedPayment === pm.id && (
                    <CheckCircle size={16} className="ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.menuItem.id} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <img src={item.menuItem.image} alt={item.menuItem.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.menuItem.name}</p>
                    <p className="text-xs text-foreground-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-foreground">₱{(item.menuItem.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-4">Payment Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Subtotal</span>
                <span className="font-medium">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Delivery Fee</span>
                <span className={`font-medium ${deliveryFee === 0 ? 'text-success' : ''}`}>
                  {deliveryFee === 0 ? 'Free' : `₱${deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-xl text-foreground">₱{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full mt-5 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Place Order'
              )}
            </button>

            <p className="text-xs text-foreground-muted text-center mt-3">
              By placing this order you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}