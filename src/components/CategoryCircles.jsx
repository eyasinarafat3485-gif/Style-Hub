import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Men',
    slug: 'Men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Women',
    slug: 'Women',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kids',
    slug: 'Kids',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Panjabi',
    slug: 'Panjabi',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'T-Shirts',
    slug: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Shirts',
    slug: 'Shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Accessories',
    slug: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80',
  },
];

const CategoryCircles = () => {
  return (
    <section className="py-12 bg-gray-50/70 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between overflow-x-auto gap-6 sm:gap-8 px-3 sm:px-4 pt-3 pb-4 scrollbar-none justify-start lg:justify-between">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center group shrink-0 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-white shadow-md border-2 border-transparent group-hover:border-[#ff2056] transition-all">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="mt-3 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#ff2056] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;
