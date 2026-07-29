import { Link } from 'react-router-dom';
import { Star, Clock, Bike, ShieldCheck } from 'lucide-react';
import type { Restaurant } from '../data/mockData';

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group block bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {restaurant.isPromoted && (
            <span className="px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-lg shadow-sm flex items-center gap-1">
              <ShieldCheck size={12} />
              Promoted
            </span>
          )}
          {!restaurant.isOpen && (
            <span className="px-2.5 py-1 bg-black/70 text-white text-[11px] font-semibold rounded-lg backdrop-blur-sm">
              Closed
            </span>
          )}
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-foreground flex items-center gap-1 shadow-sm">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          {restaurant.rating}
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-white text-xs">
          <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
            <Clock size={12} />
            {restaurant.deliveryTime}
          </span>
          <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
            <Bike size={12} />
            {restaurant.deliveryFee}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
          {restaurant.name}
        </h3>
        <p className="text-sm text-foreground-muted mt-0.5 truncate">{restaurant.cuisine}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-xs text-foreground-muted">
            Min. {restaurant.minOrder}
          </span>
          <span className={`text-xs font-medium ${restaurant.isOpen ? 'text-success' : 'text-destructive'}`}>
            {restaurant.isOpen ? 'Open now' : 'Closed'}
          </span>
        </div>
      </div>
    </Link>
  );
}