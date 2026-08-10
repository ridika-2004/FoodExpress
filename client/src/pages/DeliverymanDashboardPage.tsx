import { useEffect, useState } from 'react';
import { allOrders } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import * as userApi from '../api/userApi';
import { Bike, Clock, CheckCircle, MapPin, User } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  confirmed: { label: 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-50' },
  preparing: { label: 'Preparing', color: 'text-orange-600', bg: 'bg-orange-50' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-primary', bg: 'bg-primary/5' },
  delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
};

export default function DeliverymanDashboardPage() {
  const { user, token, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const myOrders = allOrders.filter(o => o.deliverymanId === user?.id);
  const activeOrders = myOrders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const historyOrders = myOrders.filter(o => ['delivered', 'cancelled'].includes(o.status));
  const displayOrders = activeTab === 'active' ? activeOrders : historyOrders;

  // Sync availability from the user-service on mount so the toggle reflects
  // the persisted state (it may have been changed from another device).
  useEffect(() => {
    if (!token || user?.role !== 'deliveryman') return;
    let cancelled = false;
    userApi
      .getMyAvailability(token)
      .then(me => {
        if (!cancelled) updateUser({ isAvailable: me.isAvailable ?? false });
      })
      .catch(() => {
        /* offline or unauthorized — keep whatever the session has */
      });
    return () => {
      cancelled = true;
    };
  }, [token, user?.role, updateUser]);

  const toggleAvailability = async () => {
    if (!user || !token || isTogglingAvailability) return;

    const next = !user.isAvailable;
    setAvailabilityError(null);
    setIsTogglingAvailability(true);
    // Optimistic update — rolled back if the request fails.
    updateUser({ isAvailable: next });

    try {
      const updated = await userApi.setMyAvailability(token, next);
      updateUser({ isAvailable: updated.isAvailable ?? next });
    } catch (e) {
      updateUser({ isAvailable: !next });
      setAvailabilityError(
        e instanceof userApi.ApiError
          ? e.message
          : "Can't reach the user service. Please try again.",
      );
    } finally {
      setIsTogglingAvailability(false);
    }
  };

  const handleMarkDelivered = (orderId: string) => {
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
      order.status = 'delivered';
      // Force re-render by updating state through reference
      setActiveTab(prev => prev);
    }
  };

  const deliveryStats = {
    today: activeOrders.length,
    completed: historyOrders.filter(o => o.status === 'delivered').length,
    earnings: historyOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total * 0.1, 0),
    rating: 4.8,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover shadow-sm"
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
              user?.isAvailable ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              <Bike size={12} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{user?.name}</h1>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-semibold">Delivery Partner</span>
            </div>
            <p className="text-sm text-foreground-muted mt-1">{user?.email} · {user?.phone}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground-muted font-medium">
                {user?.isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <button
                onClick={toggleAvailability}
                disabled={isTogglingAvailability}
                role="switch"
                aria-checked={!!user?.isAvailable}
                className={`relative w-12 h-7 rounded-full transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                  user?.isAvailable ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label="Toggle availability"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                    user?.isAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {availabilityError && (
              <p className="text-xs text-red-600">{availabilityError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">Active Deliveries</p>
              <p className="text-2xl font-bold text-foreground mt-1">{deliveryStats.today}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Bike size={20} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">Completed</p>
              <p className="text-2xl font-bold text-foreground mt-1">{deliveryStats.completed}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">Earnings Today</p>
              <p className="text-2xl font-bold text-foreground mt-1">₱{deliveryStats.earnings.toFixed(0)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">Rating</p>
              <p className="text-2xl font-bold text-foreground mt-1">{deliveryStats.rating} ⭐</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <User size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit mb-6">
        {(['active', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize cursor-pointer ${
              activeTab === tab
                ? 'bg-white text-foreground shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            {tab === 'active' ? 'Active Deliveries' : 'Delivery History'}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {displayOrders.length > 0 ? displayOrders.map(order => {
          const status = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={order.restaurantImage} alt={order.restaurantName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">{order.restaurantName}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${status.color} ${status.bg}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-muted mt-0.5">{order.id}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-xs text-foreground-muted">
                        <MapPin size={12} />
                        {order.deliveryAddress}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-foreground-muted">
                        <Clock size={12} />
                        {order.estimatedDelivery}
                      </div>
                    </div>
                    <p className="text-xs text-foreground-muted mt-1">
                      <strong>Items:</strong> {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-foreground">₱{order.total.toLocaleString()}</p>
                    <p className="text-xs text-foreground-muted">{order.paymentMethod}</p>
                  </div>
                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() => handleMarkDelivered(order.id)}
                      className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 cursor-pointer active:scale-[0.97] flex items-center gap-1.5"
                    >
                      <CheckCircle size={16} />
                      Delivered
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-xl">
                      <Clock size={14} />
                      Waiting at restaurant
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-16 bg-white border border-border rounded-2xl">
            <Bike size={40} className="mx-auto text-foreground-muted mb-3" />
            <h3 className="text-lg font-bold text-foreground">
              {activeTab === 'active' ? 'No active deliveries' : 'No delivery history'}
            </h3>
            <p className="text-sm text-foreground-muted mt-1">
              {activeTab === 'active'
                ? 'You\'ll see new orders here once the restaurant assigns them to you'
                : 'Your completed deliveries will show up here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}