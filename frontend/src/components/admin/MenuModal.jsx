import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

const categories = ['Signature Roasts', 'Single Origin Pour-Over', 'Artisanal Pastries', 'Cold Extractions'];

const MenuModal = ({ isOpen, onClose, item, onSave, token }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Signature Roasts',
    price: 15,
    description: '',
    flavorNotes: '',
    origin: '',
    calories: 10,
    image: '',
    isChefSpecial: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'Signature Roasts',
        price: item.price || 15,
        description: item.description || '',
        flavorNotes: Array.isArray(item.flavorNotes) ? item.flavorNotes.join(', ') : item.flavorNotes || '',
        origin: item.origin || '',
        calories: item.calories || 10,
        image: item.image || '',
        isChefSpecial: item.isChefSpecial || false,
      });
    } else {
      setFormData({
        name: '',
        category: 'Signature Roasts',
        price: 15,
        description: '',
        flavorNotes: 'Smoked Oak, Dark Cocoa',
        origin: 'Guji, Ethiopia • 2,100m',
        calories: 10,
        image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1200&q=85',
        isChefSpecial: false,
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      calories: Number(formData.calories),
      flavorNotes: typeof formData.flavorNotes === 'string'
        ? formData.flavorNotes.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.flavorNotes,
    };

    const url = item
      ? `http://localhost:5000/api/menu/${item._id}`
      : 'http://localhost:5000/api/menu';
    const method = item ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (response.ok && json.success) {
        onSave(json.data);
        onClose();
      }
    } catch (err) {
      console.error('[CAVÉNO Menu Modal Error]', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-caveno-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl glass-card border border-caveno-gold/30 rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-cinzel text-xl text-caveno-cream">
              {item ? 'Edit Master Reserve Item' : 'Add New Master Reserve Item'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-caveno-muted hover:text-caveno-cream"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-caveno-muted">Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-caveno-muted">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-caveno-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-caveno-muted">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-caveno-muted">Calories (kcal)</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-caveno-muted">Origin / Craft Line</label>
              <input
                type="text"
                placeholder="Guji, Ethiopia • 2,100m"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-caveno-muted">Flavor Notes (Comma separated)</label>
              <input
                type="text"
                placeholder="Smoked Oak, Dark Cocoa, Black Cherry"
                value={formData.flavorNotes}
                onChange={(e) => setFormData({ ...formData, flavorNotes: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-caveno-muted">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-caveno-muted">Editorial Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isChefSpecial"
                checked={formData.isChefSpecial}
                onChange={(e) => setFormData({ ...formData, isChefSpecial: e.target.checked })}
                className="w-4 h-4 accent-caveno-gold rounded"
              />
              <label htmlFor="isChefSpecial" className="text-caveno-cream font-medium cursor-pointer">
                Highlight as Master Sommelier Special
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full glass-pill text-caveno-muted hover:text-caveno-cream"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-full bg-caveno-gold text-caveno-black font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-caveno-amber transition"
              >
                <Check size={14} />
                <span>{loading ? 'Saving...' : 'Save Item'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MenuModal;
