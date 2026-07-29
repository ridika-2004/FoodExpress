import { Star, Clock, DollarSign, Package, Pencil } from 'lucide-react';
import type { Restaurant } from '../../data/mockData';

interface RestaurantInfoCardProps {
  restaurant: Restaurant;
  menuItemCount: number;
  onEdit: () => void;
}

export default function RestaurantInfoCard({ restaurant, menuItemCount, onEdit }: RestaurantInfoCardProps) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground">{restaurant.name}</h2>
          <p className="text-sm text-foreground-muted">{restaurant.cuisine}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-lg">
              <Star size={12} className="fill-yellow-500 text-yellow-500" /> {restaurant.rating}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground-muted text-xs rounded-lg">
              <Clock size={12} /> {restaurant.deliveryTime}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground-muted text-xs rounded-lg">
              <DollarSign size={12} /> {restaurant.deliveryFee}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground-muted text-xs rounded-lg">
              <Package size={12} /> Min: {restaurant.minOrder}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium text-foreground-muted">{menuItemCount} items</span>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
            title="Edit restaurant details"
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}