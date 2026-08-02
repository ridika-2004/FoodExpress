import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { categories } from '../data/mockData';
import { getRestaurants } from '../api/restaurantApi';
import type { Restaurant } from '../data/mockData';

const sortOptions = ['Popular', 'Rating', 'Delivery Time', 'Min. Order'];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Popular');

  useEffect(() => {
    getRestaurants().then(setRestaurants).finally(() => setLoading(false));
  }, []);

  const filtered = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || r.categories.includes(activeCategory);
    return matchesSearch && matchesCategory && r.isOpen;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground">Restaurants</h1>
        <p className="text-foreground-muted mt-1">Discover the best food near you</p>
      </div>

      {loading && <div className="mt-8 text-center">Loading...</div>}
      
      {!loading && (
        <>
          {/* Search & Filter */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 animate-slide-up">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants or cuisines..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-3 border border-border rounded-xl text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted transition-all duration-200 cursor-pointer">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Categories */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {['All', ...categories.map(c => c.name)].map(cat => (
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

      {/* Sort */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-foreground-muted font-medium">Sort by:</span>
        {sortOptions.map(opt => (
          <button
            key={opt}
            onClick={() => setActiveSort(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
              activeSort === opt
                ? 'bg-primary/10 text-primary'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-8">
        {filtered.length > 0 ? (
          <>
            <p className="text-sm text-foreground-muted mb-4">{filtered.length} restaurants available</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((r, i) => (
                <div key={r.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <RestaurantCard restaurant={r} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-foreground-muted" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No restaurants found</h3>
            <p className="text-sm text-foreground-muted mt-1">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="mt-4 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}