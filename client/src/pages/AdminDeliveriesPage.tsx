import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getOrders,
  getDeliverymen,
  assignDeliveryman,
  updateOrderStatus,
  type DeliveryOrder,
  type Deliveryman,
} from '../api/deliveryApi';
import { Bike, Package, Clock, CheckCircle, MapPin, User, Phone, Search, RefreshCw } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:          { label: 'Pending',          color: 'text-yellow-600', bg: 'bg-yellow-50' },
  confirmed:        { label: 'Confirmed',         color: 'text-blue-600',   bg: 'bg-blue-50' },
  preparing:        { label: 'Preparing',         color: 'text-orange-600', bg: 'bg-orange-50' },
  out_for_delivery: { label: 'Out for Delivery',  color: 'text-primary',    bg: 'bg-primary/5' },
  delivered:        { label: 'Delivered',         color: 'text-green-600',  bg: 'bg-green-50' },
  cancelled:        { label: 'Cancelled',         color: 'text-red-600',    bg: 'bg-red-50' },
};

const statusFilters = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'] as const;

export default function AdminDeliveriesPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [deliverymen, setDeliverymen] = useState<Deliveryman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // orderId being actioned

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, deliverymenData] = await Promise.all([
        getOrders(),
        getDeliverymen(),
      ]);
      setOrders(ordersData);
      setDeliverymen(deliverymenData);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAssign = async (orderId: string, deliverymanId: string) => {
    setActionLoading(orderId);
    try {
      const updated = await assignDeliveryman(orderId, deliverymanId);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      setSelectedOrder(null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to assign deliveryman');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: DeliveryOrder['status']) => {
    setActionLoading(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    } catch (err: any) {
      setError(err?.message ?? 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = searchQuery === '' ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const availableDeliverymen = deliverymen.filter(dm => dm.isAvailable !== false);

  const stats = {
    pending:    orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    delivering: orders.filter(o => o.status === 'out_for_delivery').length,
    delivered:  orders.filter(o => o.status === 'delivered').length,
    unassigned: orders.filter(o => !o.deliverymanId && !['delivered', 'cancelled'].includes(o.status)).length,
  };

  // ── Loading skeleton ──────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded-xl w-64" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl" />)}
          </div>
          <div className="h-96 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <Package size={36} className="mx-auto text-red-400 mb-3" />
          <p className="text-lg font-bold text-red-700">Could not load deliveries</p>
          <p className="text-sm text-red-500 mt-1 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Delivery Management</h1>
          <p className="text-foreground-muted text-sm mt-1">Manage orders and assign delivery partners</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-xl text-sm font-medium text-foreground-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-xl">
            <User size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">{user?.name}</span>
            <span className="text-xs px-2 py-0.5 bg-primary text-white rounded-full font-semibold">Restaurant</span>
          </div>
        </div>
      </div>

      {/* Inline error banner (non-fatal) */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">Pending</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">Delivering</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.delivering}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Bike size={20} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">Delivered</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.delivered}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">Unassigned</p>
              <p className={`text-2xl font-bold mt-1 ${stats.unassigned > 0 ? 'text-red-500' : 'text-foreground'}`}>
                {stats.unassigned}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stats.unassigned > 0 ? 'bg-red-50' : 'bg-muted'}`}>
              <Package size={20} className={stats.unassigned > 0 ? 'text-red-500' : 'text-foreground-muted'} />
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 bg-muted p-1 rounded-xl flex-wrap">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize cursor-pointer ${
                statusFilter === s
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {s === 'all' ? 'All Orders' : s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Restaurant</th>
                <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Delivery Partner</th>
                <th className="text-right px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? filteredOrders.map(order => {
                const status = statusConfig[order.status] ?? statusConfig['pending'];
                const assignedDm = order.deliverymanId
                  ? deliverymen.find(d => d.id === order.deliverymanId)
                  : null;
                const isActioning = actionLoading === order.id;

                return (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-150">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-foreground font-mono text-xs">{order.id}</p>
                        <p className="text-xs text-foreground-muted mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {order.restaurantImage ? (
                          <img src={order.restaurantImage} alt={order.restaurantName} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground-muted text-xs font-bold">
                            {order.restaurantName?.[0]}
                          </div>
                        )}
                        <span className="font-medium text-foreground">{order.restaurantName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.color} ${status.bg}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">₱{order.total.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      {assignedDm ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {assignedDm.name[0]}
                          </div>
                          <div>
                            <p className="text-sm text-foreground">{assignedDm.name}</p>
                            {assignedDm.phone && (
                              <p className="text-xs text-foreground-muted">{assignedDm.phone}</p>
                            )}
                          </div>
                        </div>
                      ) : order.driverName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {order.driverName[0]}
                          </div>
                          <span className="text-sm text-foreground">{order.driverName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-foreground-muted">Not assigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!['delivered', 'cancelled'].includes(order.status) && (
                          <button
                            disabled={isActioning}
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 cursor-pointer active:scale-[0.97] disabled:opacity-50"
                          >
                            {order.deliverymanId ? 'Reassign' : 'Assign'}
                          </button>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <button
                            disabled={isActioning}
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 cursor-pointer active:scale-[0.97] disabled:opacity-50 flex items-center gap-1"
                          >
                            {isActioning ? <RefreshCw size={10} className="animate-spin" /> : null}
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Package size={36} className="mx-auto text-foreground-muted mb-3" />
                    <p className="text-lg font-bold text-foreground">No orders found</p>
                    <p className="text-sm text-foreground-muted mt-1">
                      {statusFilter !== 'all' || searchQuery ? 'Try adjusting your filters' : 'Orders will appear here once placed'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Delivery Partner Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Assign Delivery Partner</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors duration-200 cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-muted rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3 mb-2">
                  {selectedOrder.restaurantImage ? (
                    <img src={selectedOrder.restaurantImage} alt={selectedOrder.restaurantName} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center text-foreground-muted text-sm font-bold">
                      {selectedOrder.restaurantName?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-foreground">{selectedOrder.restaurantName}</p>
                    <p className="text-xs text-foreground-muted font-mono">{selectedOrder.id}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm mt-2">
                  <MapPin size={14} className="text-foreground-muted mt-0.5 shrink-0" />
                  <p className="text-foreground-muted text-xs">{selectedOrder.deliveryAddress}</p>
                </div>
                <p className="text-xs text-foreground-muted mt-1">
                  Total: <strong>₱{selectedOrder.total.toLocaleString()}</strong>
                </p>
              </div>

              <p className="text-sm font-semibold text-foreground mb-3">Available Delivery Partners</p>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableDeliverymen.length > 0 ? availableDeliverymen.map(dm => (
                  <button
                    key={dm.id}
                    disabled={actionLoading === selectedOrder.id}
                    onClick={() => handleAssign(selectedOrder.id, dm.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {dm.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{dm.name}</p>
                      <div className="flex items-center gap-3 text-xs text-foreground-muted mt-0.5">
                        <span className="flex items-center gap-1"><Bike size={12} />Delivery</span>
                        {dm.phone && (
                          <span className="flex items-center gap-1"><Phone size={12} />{dm.phone}</span>
                        )}
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Available
                    </span>
                  </button>
                )) : (
                  <div className="text-center py-8">
                    <Bike size={28} className="mx-auto text-foreground-muted mb-2" />
                    <p className="text-sm font-medium text-foreground">No delivery partners available</p>
                    <p className="text-xs text-foreground-muted mt-1">
                      Register a user with the <strong>deliveryman</strong> role to see them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
