import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MENU_CATEGORIES, MENU_ITEMS as staticMenuItems } from '../constants/menuData';
import ItemModal from '../components/ui/ItemModal';
import { Search, LayoutGrid, LayoutList, Sparkles, Plus } from 'lucide-react';

const Menu = () => {
  const [menuItems, setMenuItems] = useState(staticMenuItems);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('magazine'); // 'magazine' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch API items from Express backend with static fallback
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu');
        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data && json.data.length > 0) {
            // Map MongoDB _id to id for component key compatibility
            const mapped = json.data.map((item) => ({
              ...item,
              id: item._id || item.id,
            }));
            setMenuItems(mapped);
          }
        }
      } catch (err) {
        console.log('[CAVÉNO Menu] Backend API offline; using local luxury menu dataset.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filter items by category and search term
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.origin && item.origin.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-caveno-black text-caveno-cream pt-32 pb-36 px-6 md:px-16 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-caveno-gold/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Editorial Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-caveno-gold font-light block">
            Master Reserve Collection
          </span>
          <h1 className="font-cinzel text-5xl sm:text-7xl text-caveno-cream font-medium tracking-wide">
            The Craft Menu
          </h1>
          <p className="font-sans text-sm md:text-base text-caveno-muted font-light leading-relaxed">
            Every pour-over, ristretto, and pastry is meticulously prepared to celebrate single-origin harvests and artisanal French bakery traditions.
          </p>
        </div>

        {/* Search & Layout View Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 glass-card p-4 rounded-2xl border border-white/10">
          {/* Category Filter Pills with Framer Motion layoutId */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {MENU_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 py-2 rounded-full font-sans text-xs uppercase tracking-wider transition duration-300 ${
                    isActive ? 'text-caveno-black font-semibold' : 'text-caveno-muted hover:text-caveno-cream'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-caveno-gold rounded-full shadow-lg shadow-caveno-gold/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input & View Switcher */}
          <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 justify-end">
            <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caveno-muted" />
              <input
                type="text"
                placeholder="Search roasts or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 font-sans text-xs text-caveno-cream placeholder-caveno-muted focus:outline-none focus:border-caveno-gold/50 transition"
              />
            </div>

            {/* Layout Mode Switcher */}
            <div className="flex items-center glass-pill p-1 rounded-full border border-white/10 shrink-0">
              <button
                onClick={() => setViewMode('magazine')}
                className={`p-2 rounded-full transition ${
                  viewMode === 'magazine' ? 'bg-caveno-gold text-caveno-black' : 'text-caveno-muted hover:text-caveno-cream'
                }`}
                title="Editorial Magazine View"
              >
                <LayoutList size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition ${
                  viewMode === 'grid' ? 'bg-caveno-gold text-caveno-black' : 'text-caveno-muted hover:text-caveno-cream'
                }`}
                title="Quick Grid View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items Container */}
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <p className="font-cinzel text-xl text-caveno-cream">
              No menu items match your criteria
            </p>
            <p className="font-sans text-xs text-caveno-muted">
              Try resetting your category filter or search terms.
            </p>
          </div>
        ) : viewMode === 'magazine' ? (
          /* Magazine Layout View */
          <div className="space-y-8">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleOpenModal(item)}
                data-cursor="CUSTOMIZE"
                className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-caveno-gold/50 transition-all duration-500 cursor-pointer group flex flex-col md:flex-row gap-8 items-center justify-between"
              >
                <div className="w-full md:w-56 h-48 sm:h-52 rounded-xl overflow-hidden shrink-0 relative border border-white/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  {item.isChefSpecial && (
                    <div className="absolute top-3 left-3 glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-mono text-caveno-gold">
                      <Sparkles size={12} />
                      <span>Chef's Reserve</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-caveno-gold block">
                        {item.origin || item.category}
                      </span>
                      <h3 className="font-cinzel text-2xl sm:text-3xl text-caveno-cream group-hover:text-caveno-gold transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    <span className="font-cinzel text-2xl text-caveno-gold font-semibold shrink-0">
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-caveno-muted font-light leading-relaxed max-w-2xl">
                    {item.description}
                  </p>

                  {/* Flavor Notes Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {item.flavorNotes?.map((note, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-[10px] font-sans bg-caveno-gold/10 text-caveno-gold border border-caveno-gold/20"
                      >
                        {note}
                      </span>
                    ))}
                    {item.calories && (
                      <span className="font-mono text-[10px] text-caveno-muted ml-auto">
                        {item.calories} kcal
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-4 md:pt-0 w-full md:w-auto">
                  <button className="w-full md:w-auto px-6 py-3 rounded-full bg-caveno-gold/10 text-caveno-gold border border-caveno-gold/30 font-sans text-xs uppercase tracking-widest group-hover:bg-caveno-gold group-hover:text-caveno-black transition duration-300 flex items-center justify-center gap-2">
                    <span>Customize</span>
                    <Plus size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* 3-Column Luxury Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleOpenModal(item)}
                data-cursor="CUSTOMIZE"
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-caveno-gold/50 transition-all duration-500 cursor-pointer group flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="h-48 rounded-xl overflow-hidden relative border border-white/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    {item.isChefSpecial && (
                      <div className="absolute top-3 left-3 glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-mono text-caveno-gold">
                        <Sparkles size={12} />
                        <span>Reserve</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-caveno-gold block">
                      {item.category}
                    </span>
                    <h3 className="font-cinzel text-xl text-caveno-cream group-hover:text-caveno-gold transition">
                      {item.name}
                    </h3>
                  </div>

                  <p className="font-sans text-xs text-caveno-muted font-light leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-cinzel text-xl text-caveno-gold font-semibold">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                  </span>
                  <button className="px-4 py-2 rounded-full glass-pill text-caveno-cream text-xs uppercase tracking-wider group-hover:border-caveno-gold/60 group-hover:text-caveno-gold transition">
                    Configure
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Menu;
