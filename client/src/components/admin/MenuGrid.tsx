import { Plus, ChefHat } from 'lucide-react';
import type { MenuItem } from '../../data/mockData';
import MenuItemCard from './MenuItemCard';

interface MenuGridProps {
  items: MenuItem[];
  onAdd: () => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
}

export default function MenuGrid({ items, onAdd, onEdit, onDelete }: MenuGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Menu Items</h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-sm"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <MenuItemCard
              key={item.id}
              item={item}
              index={i}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <ChefHat size={48} className="mx-auto text-foreground-muted mb-4" />
          <h3 className="text-lg font-bold text-foreground">Your menu is empty</h3>
          <p className="text-sm text-foreground-muted mt-2 mb-4">Add your first menu item to start receiving orders</p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] cursor-pointer"
          >
            <Plus size={16} /> Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
}