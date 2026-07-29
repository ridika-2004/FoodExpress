import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Bike, Plus, Minus, ShoppingCart, Check, Leaf } from 'lucide-react';
import { restaurants, menuItems } from '../data/mockData';
import { useCart } from '../context/CartContext';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const restaurant = restaurants.find(r => r.id === id);
  const { addItem, items, updateQuantity, itemCount } = useCart();

  const [activeCategory, setActiveCategory] = useState('All');
  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);

  const menu = id ? menuItems[id] || [] : [];
  const categories = useMemo(() => ['All', ...new Set(menu.map(i => i.category))], [menu]);

  const filtered = activeCategory === 'All' ? menu : menu.filter(i => i.category === activeCategory);

  const handleAdd = (item: typeof menu[0]) => {
    if (!restaurant) return;
    addItem(item, restaurant.id, restaurant.name);
    setAddedAnimation(item.id);
    setTimeout(() => setAddedAnimation(null), 800);
  };

  const getItemQuantity = (menuItemId: string) => {
    return items.find(i => i.menuItem.id === menuItemId)?.quantity || 0;
  };

  if (!restaurant) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-foreground">Restaurant not found</h2>
        <Link to="/restaurants" className="mt-4 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-48 sm:h-56 lg:h-72 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <Link
          to="/restaurants"
          className="absolute top-4 left-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md cursor-pointer"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Restaurant Info */}
        <div className="relative -mt-8 bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-lg animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{restaurant.name}</h1>
              <p className="text-foreground-muted mt-1">{restaurant.cuisine}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-lg">
                  <Star size={12} className="fill-yellow-500 text-yellow-500" />
                  {restaurant.rating}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted text-foreground-muted text-xs rounded-lg">
                  <Clock size={12} />
                  {restaurant.deliveryTime}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted text-foreground-muted text-xs rounded-lg">
                  <Bike size={12} />
                  {restaurant.deliveryFee}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] shadow-md shadow-primary/20"
              >
                <ShoppingCart size={16} />
                Cart
                {itemCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded-md text-xs font-bold">{itemCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="mt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-muted text-foreground-muted hover:text-foreground hover:bg-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-6 space-y-3 pb-12">
          {filtered.map((item, i) => {
            const qty = getItemQuantity(item.id);
            return (
              <div
                key={item.id}
                className="flex gap-4 bg-white border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    {item.isPopular && (
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded shrink-0 mt-0.5">
                        Popular
                      </span>
                    )}
                    {item.isVegetarian && (
                      <Leaf size={14} className="text-success shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-foreground-muted mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-base font-bold text-foreground mt-2">₱{item.price}</p>
                </div>
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                    loading="lazy"
                  />
                  {qty > 0 ? (
                    <div className="flex items-center gap-2 bg-primary text-white rounded-xl px-2 py-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, qty - 1)}
                        className="p-0.5 hover:bg-white/20 rounded transition-colors duration-200 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{qty}</span>
                      <button
                        onClick={() => handleAdd(item)}
                        className="p-0.5 hover:bg-white/20 rounded transition-colors duration-200 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      className={`px-4 py-1.5 border-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.95] cursor-pointer ${
                        addedAnimation === item.id
                          ? 'bg-success border-success text-white'
                          : 'border-primary text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      {addedAnimation === item.id ? (
                        <Check size={14} className="animate-scale-in" />
                      ) : (
                        'Add'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground-muted">No items in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}