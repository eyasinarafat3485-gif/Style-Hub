import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid, Filter, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const categoryList = [
  {
    name: 'Men',
    slug: 'men',
    description: 'Casual & formal wear tailored for modern men',
    count: '42 Products',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
    tags: ['Shirts', 'Polo', 'Denim', 'Panjabi']
  },
  {
    name: 'Women',
    slug: 'women',
    description: 'Chic ethnic & western fashion for every occasion',
    count: '38 Products',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    tags: ['Kurtis', 'Tops', 'Dresses', 'Accessories']
  },
  {
    name: 'Kids',
    slug: 'kids',
    description: 'Cute, soft & comfy outfits for kids',
    count: '24 Products',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&auto=format&fit=crop&q=80',
    tags: ['T-Shirts', 'Frocks', 'Sets']
  },
  {
    name: 'Panjabi',
    slug: 'panjabi',
    description: 'Exclusive festive & traditional designer Panjabis',
    count: '29 Products',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    tags: ['Silk', 'Cotton', 'Embroidered']
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Basic, graphic & oversized drop-shoulder tees',
    count: '55 Products',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    tags: ['Polo', 'Oversized', 'Crewneck']
  },
  {
    name: 'Shirts',
    slug: 'shirts',
    description: 'Breathable linen, casual plaid & formal cotton shirts',
    count: '31 Products',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    tags: ['Formal', 'Casual', 'Linen']
  },
];

const CategoriesPage = () => {
  const { products, formatPrice, addToCart, setQuickViewProduct } = useShop();
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredProducts = selectedCat === 'All'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCat.toLowerCase());

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
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        
        {/* Categories Grid Cards */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Grid className="w-5 h-5 text-[#ff2056]" />
              <span>Main Categories</span>
            </h2>
            <span className="text-xs font-semibold text-gray-500">{categoryList.length} Categories</span>
          </div>

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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[11px] font-bold text-rose-200 uppercase tracking-widest">
                      {cat.count}
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
                      to={`/shop?category=${cat.name}`}
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

        {/* Interactive Filter & Product Showcase */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#ff2056]" />
                <span>Featured Products by Category</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Filter items dynamically</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {['All', 'Men', 'Shirts', 'T-Shirts'].map((catName) => (
                <button
                  key={catName}
                  onClick={() => setSelectedCat(catName)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedCat === catName
                      ? 'bg-[#ff2056] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {catName}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all p-3 flex flex-col justify-between"
              >
                <div className="aspect-square w-full rounded-md overflow-hidden bg-gray-50 mb-3 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discountBadge && (
                    <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                      {product.discountBadge}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#ff2056] uppercase">{product.category}</span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                  <div className="text-xs font-extrabold text-slate-900">
                    {formatPrice(product.price)}
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-3 w-full bg-rose-50 hover:bg-[#ff2056] text-[#ff2056] hover:text-white text-xs font-bold py-1.5 rounded transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CategoriesPage;
