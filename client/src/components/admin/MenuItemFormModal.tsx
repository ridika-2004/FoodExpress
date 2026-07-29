import { useState, useEffect } from 'react';
import { X, Save, DollarSign, Tag, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { MenuItem, MenuItemInput } from '../../data/mockData';
import { CATEGORIES } from './constants';
import ImageUpload from './ImageUpload';

interface MenuItemFormModalProps {
  editingItem: MenuItem | null;
  form: MenuItemInput;
  onChange: (form: MenuItemInput) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function MenuItemFormModal({
  editingItem,
  form,
  onChange,
  onSave,
  onClose,
}: MenuItemFormModalProps) {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setShowPreview(false);
  }, [editingItem]);

  const isValid = form.name && form.description && form.price > 0;

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
            <h3 className="text-lg font-bold text-foreground">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
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
              <label className="block text-sm font-semibold text-foreground mb-1.5">Item Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => onChange({ ...form, name: e.target.value })}
                placeholder="e.g. Margherita Pizza"
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* Description (Markdown) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-foreground">Description (Markdown supported) *</label>
                <button
                  type="button"
                  onClick={() => setShowPreview(p => !p)}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors duration-200 cursor-pointer"
                >
                  {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
              {showPreview ? (
                <div className="w-full min-h-[100px] px-4 py-3 bg-muted border border-border rounded-xl text-sm prose prose-sm max-w-none">
                  {form.description ? (
                    <ReactMarkdown>{form.description}</ReactMarkdown>
                  ) : (
                    <span className="text-foreground-muted">Nothing to preview</span>
                  )}
                </div>
              ) : (
                <textarea
                  value={form.description}
                  onChange={e => onChange({ ...form, description: e.target.value })}
                  placeholder="**Fresh mozzarella**, tomato sauce, basil&#10;&#10;*Served with a side of olives*"
                  rows={4}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y font-mono"
                />
              )}
            </div>

            {/* Price & Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Price (₱) *</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={e => onChange({ ...form, price: Math.max(0, Number(e.target.value)) })}
                    placeholder="299"
                    min={0}
                    className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <div className="relative">
                  <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  <select
                    value={form.category}
                    onChange={e => onChange({ ...form, category: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <ImageUpload
              value={form.image}
              onChange={img => onChange({ ...form, image: img })}
              label="Item Image"
            />

            {/* Toggles */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={e => onChange({ ...form, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Mark as Popular</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isVegetarian}
                  onChange={e => onChange({ ...form, isVegetarian: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Vegetarian</span>
              </label>
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
              onClick={onSave}
              disabled={!isValid}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              <Save size={16} />
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}