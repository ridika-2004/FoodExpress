import { Search } from 'lucide-react';
import { ORDER_STATUS_FILTERS } from './constants';

interface OrderFiltersProps {
  activeFilter: string;
  searchQuery: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (query: string) => void;
}

export default function OrderFilters({
  activeFilter,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex gap-1 bg-muted p-1 rounded-xl flex-wrap">
        {ORDER_STATUS_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => onFilterChange(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize cursor-pointer ${
              activeFilter === s
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
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search orders..."
          className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
    </div>
  );
}