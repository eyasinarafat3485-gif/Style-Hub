import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Star, ShoppingCart, Eye, Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ShopPage = ({ initialCategory = '', initialFilter = '' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category') || initialCategory;

  const { products, formatPrice, addToCart, toggleWishlist, isWishlisted, setQuickViewProduct, searchQuery, setSearchQuery } = useShop();

  const [selectedCategory, setSelectedCategory] = useState(queryCategory || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(3000);

  const categories = ['All', 'Men', 'Women', 'Kids', 'T-Shirts', 'Shirts', 'Panjabi'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        if (selectedCategory === 'Men' && product.category !== 'Men' && product.category !== 'T-Shirts' && product.category !== 'Shirts') {
          return false;
        }
        if (selectedCategory !== 'Men') return false;
      }

      // Quick tab filter (trending, new, sale)
      if (initialFilter === 'trending' && !product.isTrending) return false;
      if (initialFilter === 'new' && product.discountBadge !== 'New') return false;
      if (initialFilter === 'sale' && !product.oldPrice) return false;

      // Price filter
      if (product.price > priceRange) return false;

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchCat = product.category.toLowerCase().includes(query);
        if (!matchName && !matchCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0;
    });
  }, [products, selectedCategory, initialFilter, priceRange, searchQuery, sortBy]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#ff2056] uppercase tracking-widest">StyleHub Collection</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold mt-1">
              {initialFilter === 'sale'
                ? 'Special Sale & Offers'
                : initialFilter === 'new'
                ? 'New Arrivals 2025'
                : selectedCategory !== 'All'
                ? `${selectedCategory} Collection`
                : 'Shop All Products'}
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Showing {filteredProducts.length} items available in store
            </p>
          </div>

          {/* Search bar inside header */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ff2056] placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="space-y-6">
            
            {/* Category Filter */}
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-gray-100">
                <Filter className="w-4 h-4 text-[#ff2056]" />
                <span>Categories</span>
              </h3>

              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-[#ff2056] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-gray-100">
                Max Price: {formatPrice(priceRange)}
              </h3>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#ff2056] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                <span>৳500</span>
                <span>৳3,000</span>
              </div>
            </div>

          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Control Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <SlidersHorizontal className="w-4 h-4 text-[#ff2056]" />
                <span>Showing <strong>{filteredProducts.length}</strong> products</span>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-100 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5 focus:outline-none font-medium"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200/80 p-12 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 bg-rose-50 text-[#ff2056] rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">No products found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  We couldn't find any products matching your selected category or price filter. Try resetting filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange(3000);
                    setSearchQuery('');
                  }}
                  className="bg-[#ff2056] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#e01648] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => {
                  const wish = isWishlisted(product.id);
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
                        {product.discountBadge && (
                          <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900 text-white">
                            {product.discountBadge}
                          </span>
                        )}

                        {/* Wishlist Button (slides on hover) */}
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="absolute top-2.5 right-2.5 z-20 p-2 bg-white/95 hover:bg-white rounded-full text-gray-600 hover:text-[#ff2056] shadow-sm backdrop-blur-sm transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 -translate-y-1 sm:-translate-y-1.5 sm:group-hover:translate-y-0 cursor-pointer"
                          title={wish ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wish ? 'fill-[#ff2056] text-[#ff2056]' : ''}`} />
                        </button>

                        {/* Product Image with Zoom */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* GlamNGrace Style: Center Quick View Overlay */}
                        <div
                          onClick={() => setQuickViewProduct(product)}
                          className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer pointer-events-none group-hover:pointer-events-auto"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="bg-white/95 hover:bg-white text-slate-900 hover:text-[#ff2056] text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] uppercase px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xs shadow-md backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                          >
                            Quick View
                          </button>
                        </div>

                        {/* GlamNGrace Style: Bottom Full-Width Quick Add Button (Brand Theme Color #ff2056) */}
                        <button
                          onClick={() => addToCart(product)}
                          className="absolute inset-x-0 bottom-0 z-20 bg-[#ff2056] hover:bg-[#d6103e] active:bg-[#b80830] text-white text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.15em] py-2.5 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>

                      <div className="p-3.5 flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-[#ff2056] uppercase tracking-wide">
                          {product.category}
                        </span>
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#ff2056] transition-colors">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-extrabold text-slate-900">
                            {formatPrice(product.price)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-amber-500">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-gray-500 text-[10px] font-medium">
                            ({product.reviewCount || 45})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};

export default ShopPage;
