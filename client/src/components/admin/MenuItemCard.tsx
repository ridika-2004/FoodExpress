import { Pencil, Trash2, Leaf } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { MenuItem } from '../../data/mockData';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
}

export default function MenuItemCard({ item, index, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <div
      className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 animate-slide-up group"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex gap-1.5">
          {item.isPopular && (
            <span className="px-2 py-0.5 bg-primary/90 text-white text-[10px] font-bold rounded-md">Popular</span>
          )}
          {item.isVegetarian && (
            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf size={12} className="text-green-600" />
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
          <span className="text-base font-bold text-primary">₱{item.price}</span>
        </div>
        <div className="mt-1.5 text-xs text-foreground-muted line-clamp-2 prose prose-sm max-w-none">
          <ReactMarkdown>{item.description}</ReactMarkdown>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-[11px] font-medium text-foreground-muted bg-muted px-2 py-0.5 rounded">{item.category}</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}