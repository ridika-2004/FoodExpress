import { useState, useMemo, useEffect, useCallback } from 'react';
import { Store, ChefHat, Package } from 'lucide-react';
import {
  restaurants, menuItems,
  type MenuItem, type MenuItemInput, type Restaurant,
} from '../data/mockData';
import {
  getOrders, getDeliverymen, assignDeliveryman, updateOrderStatus,
  type DeliveryOrder, type Deliveryman,
} from '../api/deliveryApi';
import { useAuth } from '../context/AuthContext';
import RestaurantInfoCard from '../components/admin/RestaurantInfoCard';
import MenuGrid from '../components/admin/MenuGrid';
import MenuItemFormModal from '../components/admin/MenuItemFormModal';
import OrderStatsCards from '../components/admin/OrderStatsCards';
import OrderFilters from '../components/admin/OrderFilters';
import OrdersTable from '../components/admin/OrdersTable';
import DeliveryAssignModal from '../components/admin/DeliveryAssignModal';
import EditRestaurantModal from '../components/admin/EditRestaurantModal';

const INITIAL_FORM: MenuItemInput = {
  name: '', description: '', price: 0, image: '', category: 'Pizza', isPopular: false, isVegetarian: false,
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId || '1';

  // ── Restaurant / Menu (still managed locally) ──────────────
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(
    () => restaurants.find(r => r.id === restaurantId)
  );
  const [menu, setMenu] = useState<MenuItem[]>(() => menuItems[restaurantId] || []);

  // ── Orders / Deliverymen (real API) ────────────────────────
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [deliverymen, setDeliverymen] = useState<Deliveryman[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MenuItemInput>(INITIAL_FORM);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);

  // Fetch orders + deliverymen when the orders tab is opened
  const fetchOrdersData = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const [allOrders, dms] = await Promise.all([getOrders(), getDeliverymen()]);
      // Filter to only this restaurant's orders
      setOrders(allOrders.filter(o => o.restaurantId === restaurantId));
      setDeliverymen(dms);
    } catch (err: any) {
      setOrdersError(err?.message ?? 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrdersData();
    }
  }, [activeTab, fetchOrdersData]);

  const filteredOrders = useMemo(() =>
    orders.filter(o => {
      const matchesStatus = orderFilter === 'all' || o.status === orderFilter;
      const matchesSearch = searchQuery === '' ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }),
    [orders, orderFilter, searchQuery]
  );

  const orderStats = useMemo(() => ({
    pending:    orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    delivering: orders.filter(o => o.status === 'out_for_delivery').length,
    delivered:  orders.filter(o => o.status === 'delivered').length,
    unassigned: orders.filter(o => !o.deliverymanId && !['delivered', 'cancelled'].includes(o.status)).length,
  }), [orders]);

  // ── Menu handlers ──────────────────────────────────────────
  const openAddForm = () => {
    setEditingItem(null);
    setForm(INITIAL_FORM);
    setShowForm(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      isPopular: item.isPopular || false,
      isVegetarian: item.isVegetarian || false,
    });
    setShowForm(true);
  };

  const handleSaveMenuItem = () => {
    if (!form.name || !form.description || form.price <= 0) return;
    if (editingItem) {
      setMenu(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...form } : i));
    } else {
      const newItem: MenuItem = { id: `${restaurantId}${Date.now()}`, ...form };
      setMenu(prev => [...prev, newItem]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenu(prev => prev.filter(i => i.id !== itemId));
  };

  // ── Order handlers (real API) ──────────────────────────────
  const handleAssign = async (orderId: string, deliverymanId: string) => {
    try {
      const updated = await assignDeliveryman(orderId, deliverymanId);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      setSelectedOrder(null);
    } catch (err: any) {
      setOrdersError(err?.message ?? 'Failed to assign deliveryman');
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      const updated = await updateOrderStatus(orderId, 'delivered');
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    } catch (err: any) {
      setOrdersError(err?.message ?? 'Failed to update order status');
    }
  };

  // ── Restaurant handlers ────────────────────────────────────
  const handleSaveRestaurant = (updated: Restaurant) => setRestaurant(updated);

  // ── Empty state ────────────────────────────────────────────
  if (!restaurant) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Store size={48} className="text-foreground-muted mb-4" />
        <h2 className="text-xl font-bold text-foreground">No restaurant assigned</h2>
        <p className="text-foreground-muted mt-2">Contact support to link your restaurant.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Restaurant Dashboard</h1>
          <p className="text-foreground-muted text-sm mt-1">Manage your menu, orders, and deliveries</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-xl">
          <Store size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">{restaurant.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <RestaurantInfoCard
        restaurant={restaurant}
        menuItemCount={menu.length}
        onEdit={() => setShowRestaurantForm(true)}
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-white text-foreground shadow-sm'
              : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          <ChefHat size={16} />
          Menu Management
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white text-foreground shadow-sm'
              : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          <Package size={16} />
          Orders & Delivery
        </button>
      </div>

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <MenuGrid
          items={menu}
          onAdd={openAddForm}
          onEdit={openEditForm}
          onDelete={handleDeleteMenuItem}
        />
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {ordersError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {ordersError}
            </div>
          )}
          {ordersLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-2xl" />)}
              </div>
              <div className="h-64 bg-muted rounded-2xl" />
            </div>
          ) : (
            <>
              <OrderStatsCards stats={orderStats} />
              <OrderFilters
                activeFilter={orderFilter}
                searchQuery={searchQuery}
                onFilterChange={setOrderFilter}
                onSearchChange={setSearchQuery}
              />
              <OrdersTable
                orders={filteredOrders}
                deliverymen={deliverymen}
                onAssign={setSelectedOrder}
                onMarkDelivered={handleMarkDelivered}
              />
            </>
          )}
        </div>
      )}

      {/* Add/Edit Menu Item Modal */}
      {showForm && (
        <MenuItemFormModal
          editingItem={editingItem}
          form={form}
          onChange={setForm}
          onSave={handleSaveMenuItem}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}

      {/* Assign Delivery Partner Modal */}
      {selectedOrder && (
        <DeliveryAssignModal
          order={selectedOrder}
          deliverymen={deliverymen}
          onAssign={handleAssign}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Edit Restaurant Modal */}
      {showRestaurantForm && restaurant && (
        <EditRestaurantModal
          restaurant={restaurant}
          onSave={handleSaveRestaurant}
          onClose={() => setShowRestaurantForm(false)}
        />
      )}
    </div>
  );
}
