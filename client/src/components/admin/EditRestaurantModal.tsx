import { useState, useEffect } from 'react';
import { X, Save, Clock, DollarSign, Package, Star } from 'lucide-react';
import type { Restaurant } from '../../data/mockData';
import ImageUpload from './ImageUpload';

interface EditRestaurantModalProps {
  restaurant: Restaurant;
  onSave: (updated: Restaurant) => void;
  onClose: () => void;
}

export default function EditRestaurantModal({ restaurant, onSave, onClose }: EditRestaurantModalProps) {
  const [draft, setDraft] = useState<Restaurant>({ ...restaurant });

  useEffect(() => {
    setDraft({ ...restaurant });
  }, [restaurant]);

  const update = <K extends keyof Restaurant>(field: K, value: Restaurant[K]) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (draft.name) {
      onSave(draft);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Edit Restaurant Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors duration-200 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Restaurant Name *</label>
              <input
                type="text"
                value={draft.name}
                onChange={e => update('name', e.target.value)}
                placeholder="e.g. Pizza Palace"
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Cuisine</label>
              <input
                type="text"
                value={draft.cuisine}
                onChange={e => update('cuisine', e.target.value)}
                placeholder="e.g. Italian • Pizza"
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              value={draft.image}
              onChange={img => update('image', img)}
              label="Restaurant Image"
            />

            {/* Delivery Time & Fee row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Delivery Time</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  <input
                    type="text"
                    value={draft.deliveryTime}
                    onChange={e => update('deliveryTime', e.target.value)}
                    placeholder="25-35 min"
                    className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Delivery Fee</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  <input
                    type="text"
                    value={draft.deliveryFee}
                    onChange={e => update('deliveryFee', e.target.value)}
                    placeholder="Free / ₱20"
                    className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Min Order & Rating row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Min Order</label>
                <div className="relative">
                  <Package size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  <input
                    type="text"
                    value={draft.minOrder}
                    onChange={e => update('minOrder', e.target.value)}
                    placeholder="₱150"
                    className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Rating</label>
                <div className="relative">
                  <Star size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  <input
                    type="number"
                    value={draft.rating}
                    onChange={e => update('rating', Math.max(0, Math.min(5, Number(e.target.value))))}
                    placeholder="4.8"
                    min={0}
                    max={5}
                    step={0.1}
                    className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Open/Closed Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.isOpen}
                  onChange={e => update('isOpen', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted border border-border rounded-full peer-checked:bg-green-500 peer-checked:border-green-500 transition-colors duration-200 after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <span className="text-sm font-medium text-foreground">
                Restaurant is{' '}
                <span className={draft.isOpen ? 'text-green-600' : 'text-red-500'}>
                  {draft.isOpen ? 'Open' : 'Closed'}
                </span>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-foreground rounded-xl hover:bg-muted transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!draft.name}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}