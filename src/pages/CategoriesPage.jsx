import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid, Sparkles, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const categoryList = [
  {
    name: 'Men',
    slug: 'Men',
    description: 'Casual & formal wear tailored for modern men',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80',
    tags: ['Shirts', 'Polo', 'Denim', 'Panjabi', 'Hoodie']
  },
  {
    name: 'Women',
    slug: 'Women',
    description: 'Chic ethnic & western fashion for every occasion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    tags: ['Kurtis', 'Tops', 'Dresses', 'Accessories']
  },
  {
    name: 'Panjabi',
    slug: 'Panjabi',
    description: 'Exclusive festive & traditional designer Panjabis',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    tags: ['Silk', 'Cotton', 'Embroidered', 'Festive']
  },
  {
    name: 'T-Shirts',
    slug: 'T-Shirts',
    description: 'Basic, graphic & oversized drop-shoulder tees',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    tags: ['Polo', 'Oversized', 'Crewneck', 'Graphic']
  },
  {
    name: 'Shirt',
    slug: 'Shirt',
    description: 'Breathable linen, casual plaid & formal cotton shirts',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    tags: ['Formal', 'Casual', 'Linen', 'Plaid']
  },
  {
    name: 'Kurtis',
    slug: 'Kurtis',
    description: 'Elegant ethnic and contemporary designer Kurtis',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    tags: ['Ethnic', 'Embroidery', 'Festive']
  },
  {
    name: 'Kids',
    slug: 'Kids',
    description: 'Cute, soft & comfy outfits for kids',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop&q=80',
    tags: ['T-Shirts', 'Frocks', 'Sets', 'Festive']
  },
];

const CategoriesPage = () => {
  const { products } = useShop();

  const getProductCount = (catName) => {
    if (!products || products.length === 0) return 'Collection Available';
    const count = products.filter((p) => {
      if (!p.category) return false;
      const pCat = p.category.toLowerCase().trim();
      const cName = catName.toLowerCase().trim();
      return (
        pCat === cName ||
        pCat.startsWith(cName.replace(/s$/, '')) ||
        cName.startsWith(pCat.replace(/s$/, ''))
      );
    }).length;

    return count > 0 ? `${count} Product${count > 1 ? 's' : ''}` : 'Collection Available';
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-[#ff2056] text-white py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-rose-700/80 px-3.5 py-1 rounded-full text-xs font-semibold text-rose-100 border border-rose-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Explore All Categories
          </h1>
          <p className="text-gray-100 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Browse through our wide range of premium fashion categories crafted for comfort, style and confidence.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#ff2056]" />
            <span>Available Categories</span>
          </h2>
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200">
            <ShoppingBag className="w-3.5 h-3.5 text-[#ff2056]" />
            {categoryList.length} Categories
          </span>
        </div>

        {/* Categories Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryList.map((cat, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[11px] font-bold text-rose-300 uppercase tracking-widest">
                    {getProductCount(cat.name)}
                  </span>
                  <h3 className="font-serif text-2xl font-extrabold">{cat.name}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-grow flex flex-col justify-between bg-white">
                <div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {cat.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.slug || cat.name)}`}
                    className="inline-flex items-center justify-between w-full bg-slate-900 hover:bg-[#ff2056] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm group-hover:shadow"
                  >
                    <span>Browse {cat.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
