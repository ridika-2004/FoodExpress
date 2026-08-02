import { Link } from 'react-router-dom';
import { Search, Bike, Clock, ShieldCheck, Star, ChevronRight, ArrowRight } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { useState, useEffect } from 'react';
import { categories } from '../data/mockData';
import { getRestaurants } from '../api/restaurantApi';
import type { Restaurant } from '../data/mockData';

const features = [
  { icon: Bike, title: 'Fast Delivery', desc: '30 min average delivery time' },
  { icon: Clock, title: 'Live Tracking', desc: 'Track your order in real-time' },
  { icon: ShieldCheck, title: 'Safe Payment', desc: 'Secure payment processing' },
];

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurants().then(setRestaurants).finally(() => setLoading(false));
  }, []);

  const promoted = restaurants.filter(r => r.isPromoted);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-up">
              <span className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                <Star size={14} className="mr-1.5 fill-primary text-primary" />
                500+ Restaurants Partnered
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Delicious food
                <span className="text-primary block">delivered to you</span>
              </h1>
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-foreground-muted max-w-lg leading-relaxed">
                Order from the best local restaurants with easy tracking and fast delivery right to your doorstep.
              </p>

              {/* Search Bar */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  <input
                    type="text"
                    placeholder="Search for restaurants or dishes..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 shadow-sm"
                  />
                </div>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] shadow-md shadow-primary/20"
                >
                  Search
                  <Search size={16} />
                </Link>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="hidden lg:flex justify-center items-center animate-fade-in">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-primary/10 absolute -top-10 -right-10 blur-3xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=500&fit=crop"
                    alt="Delicious food"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                        alt="Chef"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-foreground">Chef's Special</p>
                        <p className="text-xs text-foreground-muted">Butter Chicken • 4.9 ⭐</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                <p className="text-xs text-foreground-muted mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">What's craving?</h2>
          <Link to="/restaurants" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-200 flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to="/restaurants"
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-200 shadow-sm group-hover:shadow-md">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
              </div>
              <span className="text-xs font-medium text-foreground-muted group-hover:text-primary transition-colors duration-200">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promoted Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Featured Restaurants</h2>
          <Link to="/restaurants" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-200 flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {promoted.map((r, i) => (
            <div key={r.id} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <RestaurantCard restaurant={r} />
            </div>
          ))}
        </div>
      </section>

      {/* All Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">All Restaurants</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {restaurants.map((r, i) => (
            <div key={r.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <RestaurantCard restaurant={r} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-12 lg:p-16 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Hungry? Let's fix that!</h2>
              <p className="text-white/80 mt-2 max-w-lg">Order now and enjoy fast delivery from the best restaurants near you.</p>
            </div>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-all duration-200 active:scale-[0.97] shadow-lg"
            >
              Order Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}