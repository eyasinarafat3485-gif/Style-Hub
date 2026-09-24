import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CategoryCircles = () => {
  const { categories, products } = useShop();
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Map 100% organic database categories without any hardcoded category fallback
  const displayCategories = React.useMemo(() => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return [];
    }

    return categories.map((c) => {
      const rawName = c.name?.trim() || 'Category';
      const catName = rawName.toLowerCase() === 'shirts' ? 'Shirt' : rawName;

      // Find first matching product from database for high quality category image
      const matchingProduct = (products || []).find((p) => {
        const pCat = p.category?.trim()?.toLowerCase();
        return pCat === catName.toLowerCase() || pCat === rawName.toLowerCase();
      });

      // Count products in this category from real database
      const productCount = (products || []).filter((p) => {
        const pCat = p.category?.trim()?.toLowerCase();
        return pCat === catName.toLowerCase() || pCat === rawName.toLowerCase();
      }).length;

      const fallbackImage = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80';
      const imageUrl = c.image || matchingProduct?.image || fallbackImage;

      const tagText = c.description?.trim()
        ? c.description
        : productCount > 0
        ? `${productCount} ${productCount === 1 ? 'Item' : 'Items'}`
        : 'Explore Collection';

      return {
        id: c._id || c.id || catName,
        name: catName,
        slug: catName,
        tag: tagText,
        image: imageUrl,
      };
    });
  }, [categories, products]);

  // Auto-slide carousel for smooth experience
  useEffect(() => {
    if (isHovered || displayCategories.length <= 2) return;
    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft >= scrollWidth - clientWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered, displayCategories.length]);

  if (!displayCategories || displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-white via-slate-50/40 to-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Clean 1-Line Section Header */}
        <div className="flex items-center justify-between gap-2 mb-6 border-b border-gray-100 pb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold text-[#ff2056] uppercase tracking-wider whitespace-nowrap">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>Explore Collections</span>
            </div>
            <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 mt-0.5 whitespace-nowrap truncate">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#ff2056] transition-colors whitespace-nowrap shrink-0 pl-2 cursor-pointer group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Responsive Mobile Carousel Container */}
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsHovered(false), 3000)}
        >
          {/* Edge Blur Fades for smooth carousel visual feedback */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrollable Carousel Line */}
          <div
            ref={scrollRef}
            className="flex items-center gap-4 sm:gap-7 overflow-x-auto scrollbar-none pt-2 pb-4 px-2 scroll-smooth snap-x snap-mandatory flex-nowrap w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {displayCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className="flex flex-col items-center group/item shrink-0 snap-center transition-transform duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Outer Ring */}
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-gray-200 via-rose-100/60 to-gray-200 group-hover/item:from-[#ff2056] group-hover/item:via-rose-400 group-hover/item:to-[#ff2056] transition-all duration-500 shadow-xs group-hover/item:shadow-lg group-hover/item:shadow-rose-500/20">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white p-0.5 border border-white">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full rounded-full object-cover object-top transition-transform duration-700 ease-out group-hover/item:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Category Name & Item Count */}
                <div className="mt-2.5 text-center max-w-[105px] sm:max-w-[130px]">
                  <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover/item:text-[#ff2056] transition-colors truncate">
                    {cat.name}
                  </span>
                  <span className="block text-[10px] text-gray-500 font-medium tracking-tight mt-0.5 truncate">
                    {cat.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryCircles;
