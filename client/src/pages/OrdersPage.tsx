import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Bike, CheckCircle, ChefHat, MapPin, Phone, AlertCircle } from 'lucide-react';
import { orders } from '../data/mockData';

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending: { label: 'Order Placed', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'text-orange-600', bg: 'bg-orange-50' },
  out_for_delivery: { label: 'Out for Delivery', icon: Bike, color: 'text-primary', bg: 'bg-primary/5' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-success', bg: 'bg-green-50' },
  cancelled: { label: 'Cancelled', icon: AlertCircle, color: 'text-destructive', bg: 'bg-red-50' },
};

const orderStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(
    orders.find(o => o.status === 'out_for_delivery')?.id || null
  );

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));
  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const trackingOrder = orders.find(o => o.id === selectedOrder);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Orders</h1>
      <p className="text-foreground-muted text-sm mt-1">Track and manage your orders</p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {(['active', 'past'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize cursor-pointer ${
              activeTab === tab
                ? 'bg-white text-foreground shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            {tab} Orders
          </button>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-5 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-3 space-y-3">
          {displayOrders.length > 0 ? displayOrders.map(order => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                className={`w-full text-left bg-white border rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
                  selectedOrder === order.id
                    ? 'border-primary shadow-md'
                    : 'border-border hover:shadow-md hover:border-border/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <img src={order.restaurantImage} alt={order.restaurantName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div>
                      <h3 className="font-bold text-foreground">{order.restaurantName}</h3>
                      <p className="text-xs text-foreground-muted mt-0.5">{order.id}</p>
                      <p className="text-xs text-foreground-muted">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${status.color} ${status.bg}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                    <p className="text-sm font-bold text-foreground mt-2">₱{order.total.toLocaleString()}</p>
                  </div>
                </div>
              </button>
            );
          }) : (
            <div className="text-center py-16 bg-white border border-border rounded-2xl">
              <Package size={36} className="mx-auto text-foreground-muted mb-3" />
              <h3 className="text-lg font-bold text-foreground">No {activeTab} orders</h3>
              <p className="text-sm text-foreground-muted mt-1">
                {activeTab === 'active' ? 'You have no active orders right now' : 'No past orders yet'}
              </p>
              <Link to="/restaurants" className="inline-block mt-4 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all">
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>

        {/* Tracking Panel */}
        <div className="lg:col-span-2">
          {trackingOrder && !['delivered', 'cancelled'].includes(trackingOrder.status) ? (
            <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-sm sticky top-24 animate-slide-up">
              <h2 className="text-lg font-bold text-foreground mb-5">Live Tracking</h2>

              {/* Driver Info */}
              {trackingOrder.driverName && (
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl mb-5">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={trackingOrder.driverImage} alt={trackingOrder.driverName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{trackingOrder.driverName}</p>
                    <p className="text-xs text-foreground-muted">Your delivery rider</p>
                    <a href={`tel:${trackingOrder.driverPhone}`} className="text-xs text-primary font-semibold hover:underline mt-0.5 inline-flex items-center gap-1">
                      <Phone size={10} />
                      {trackingOrder.driverPhone}
                    </a>
                  </div>
                </div>
              )}

              {/* Delivery Progress */}
              <div className="space-y-0">
                {orderStatuses.map((status, i) => {
                  const config = statusConfig[status];
                  const Icon = config.icon;
                  const currentIdx = orderStatuses.indexOf(trackingOrder.status);
                  const isCompleted = i <= currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div key={status} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted ? config.bg : 'bg-muted'
                        } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                          <Icon size={15} className={isCompleted ? config.color : 'text-foreground-muted'} />
                        </div>
                        {i < orderStatuses.length - 1 && (
                          <div className={`w-0.5 h-8 ${isCompleted && i < currentIdx ? 'bg-primary/30' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className={`pb-6 ${i < orderStatuses.length - 1 ? '' : 'pb-0'}`}>
                        <p className={`text-sm font-semibold ${isCompleted ? 'text-foreground' : 'text-foreground-muted'}`}>
                          {config.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-primary animate-pulse">In progress...</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Details */}
              <div className="pt-5 mt-5 border-t border-border space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Delivering to</p>
                    <p className="text-foreground-muted text-xs">{trackingOrder.deliveryAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Estimated delivery</p>
                    <p className="text-foreground-muted text-xs">{trackingOrder.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : trackingOrder && trackingOrder.status === 'delivered' ? (
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm sticky top-24 text-center animate-slide-up">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={32} className="text-success" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Delivered! 🎉</h3>
              <p className="text-sm text-foreground-muted mt-1">Enjoy your meal!</p>
              <div className="mt-4 pt-4 border-t border-border text-left">
                <p className="text-xs text-foreground-muted">Order ID: {trackingOrder.id}</p>
                <p className="text-xs text-foreground-muted">Total: ₱{trackingOrder.total.toLocaleString()}</p>
                <p className="text-xs text-foreground-muted">{trackingOrder.paymentMethod}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}