import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const categories = [
  {
    name: 'Panjabi',
    slug: 'Panjabi',
    tag: 'Royal Ethnic',
    // Handsome male model in authentic ethnic Kurta / Panjabi
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Shirt',
    slug: 'Shirt',
    tag: 'Casual & Formal',
    // Model wearing a crisp stylish plaid/casual shirt
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'T-Shirts',
    slug: 'T-Shirts',
    tag: 'Oversized & Polos',
    // Trendy model wearing stylish cotton graphic tee
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Men',
    slug: 'Men',
    tag: 'Men Fashion',
    // Handsome fashion male model wearing modern blazer outfit
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Women',
    slug: 'Women',
    tag: 'Women Collection',
    // High-fashion female model in elegant stylish outfit
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kurtis',
    slug: 'Kurtis',
    tag: 'Ethnic & Festive',
    // Elegant female model in traditional South Asian attire
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kids',
    slug: 'Kids',
    tag: 'Kids Festive',
    // Cute stylish kids in modern wear
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&auto=format&fit=crop&q=80',
  },
];

const CategoryCircles = () => {
  return (
    <section className="py-10 sm:py-14 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff2056] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Collections</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-gray-700 hover:text-[#ff2056] transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        {/* Circular Categories Grid / Carousel */}
        <div className="flex items-center justify-between overflow-x-auto gap-5 sm:gap-7 pt-3.5 pb-4 px-2 scrollbar-none justify-start lg:justify-between">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className="flex flex-col items-center group shrink-0 transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Outer Glowing Ring */}
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-gray-200 via-stone-100 to-gray-200 group-hover:from-[#ff2056] group-hover:via-rose-400 group-hover:to-[#ff2056] transition-all duration-500 shadow-sm group-hover:shadow-md group-hover:shadow-rose-500/25">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white p-0.5">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full rounded-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Category Name & Tag */}
              <div className="mt-3 text-center">
                <span className="block text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#ff2056] transition-colors">
                  {cat.name}
                </span>
                <span className="block text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">
                  {cat.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryCircles;
