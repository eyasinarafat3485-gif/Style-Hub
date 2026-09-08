import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Star, ShoppingCart, Eye, Heart, ShoppingBag, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ITEMS_PER_PAGE = 6;

const ShopPage = ({ initialCategory = '', initialFilter = '' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category') || initialCategory;

  const { products, formatPrice, addToCart, toggleWishlist, isWishlisted, setQuickViewProduct, searchQuery, setSearchQuery, categories: dbCategories } = useShop();

  const maxProductPrice = useMemo(() => {
    if (!products || products.length === 0) return 10000;
    const max = Math.max(...products.map((p) => Number(p.price) || 0));
    return Math.max(max, 10000);
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState(queryCategory || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(10000);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Mobile Auto Carousel State & Ref
  const mobileScrollRef = useRef(null);
  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sync selectedCategory instantly whenever URL search parameter changes
  useEffect(() => {
    setSelectedCategory(queryCategory || 'All');
  }, [queryCategory]);

  // Sync priceRange when products load if it was at default
  useEffect(() => {
    if (maxProductPrice > priceRange && priceRange === 3000) {
      setPriceRange(maxProductPrice);
    }
  }, [maxProductPrice]);

  // Reset page to 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, initialFilter, priceRange, searchQuery, sortBy]);

  // Dynamic Categories list from default + DB + loaded products
  const categoriesList = useMemo(() => {
    const set = new Set(['All', 'Men', 'Women', 'Kids', 'T-Shirts', 'Shirt', 'Panjabi']);
    if (Array.isArray(dbCategories)) {
      dbCategories.forEach((c) => {
        if (c.name) {
          const name = c.name.trim().toLowerCase() === 'shirts' ? 'Shirt' : c.name;
          set.add(name);
        }
      });
    }
    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p.category) {
          const name = p.category.trim().toLowerCase() === 'shirts' ? 'Shirt' : p.category;
          set.add(name);
        }
      });
    }
    set.delete('Shirts');
    return Array.from(set);
  }, [dbCategories, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const prodCat = (product.category || '').trim().toLowerCase();
      const selCat = (selectedCategory || '').trim().toLowerCase();

      // Category filter
      if (selCat !== 'all') {
        const isShirtMatch = (selCat === 'shirt' || selCat === 'shirts') && (prodCat === 'shirt' || prodCat === 'shirts');
        if (!isShirtMatch && prodCat !== selCat) {
          if (selCat === 'men' && (prodCat === 'men' || prodCat === 't-shirts' || prodCat === 'shirt' || prodCat === 'shirts')) {
            // Include Men subcategories
          } else {
            return false;
          }
        }
      }

      // Quick tab filter (trending, new, sale)
      if (initialFilter === 'trending' && !product.isTrending) return false;
      if (initialFilter === 'new' && product.discountBadge !== 'New') return false;
      if (initialFilter === 'sale' && !product.oldPrice) return false;

      // Price filter
      const price = Number(product.price) || 0;
      if (price > priceRange) return false;

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = (product.name || '').toLowerCase().includes(query);
        const matchCat = prodCat.includes(query);
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

  // Desktop Paginated Products (6 items per page)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 280, behavior: 'smooth' });
    }
  };

  // Mobile Auto Carousel (every 3.5s)
  useEffect(() => {
    if (isMobilePaused || !mobileScrollRef.current || filteredProducts.length === 0) return;

    const interval = setInterval(() => {
      if (mobileScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = mobileScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          mobileScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const scrollAmount = mobileScrollRef.current.clientWidth * 0.75;
          mobileScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isMobilePaused, filteredProducts]);

  const updateMobileScrollButtons = () => {
    if (mobileScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = mobileScrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const handleMobileScroll = (direction) => {
    if (mobileScrollRef.current) {
      const scrollAmount = mobileScrollRef.current.clientWidth * 0.75;
      mobileScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-gray-50 lg:min-h-screen pb-6 sm:pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-8 sm:py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#ff2056] uppercase tracking-widest">StyleHub Collection</span>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold mt-1">
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

      <div className="max-w-7xl mx-auto px-4 pt-4 pb-4 sm:py-8">
        
        {/* Mobile Horizontal Category Pills (Quick 1-tap swipeable filter) */}
        <div className="lg:hidden mb-4 overflow-x-auto scrollbar-none flex items-center gap-2 pb-1">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff2056] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Sidebar Filters (Hidden on Mobile) */}
          <div className="hidden lg:block space-y-6">
            
            {/* Category Filter */}
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-gray-100">
                <Filter className="w-4 h-4 text-[#ff2056]" />
                <span>Categories</span>
              </h3>

              <div className="space-y-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
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
                max={maxProductPrice}
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#ff2056] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                <span>৳500</span>
                <span>{formatPrice(maxProductPrice)}</span>
              </div>
            </div>

          </div>

          {/* Product Grid & Carousel Area */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            
            {/* Control Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <SlidersHorizontal className="w-4 h-4 text-[#ff2056]" />
                <span className="hidden sm:inline">Showing <strong>{filteredProducts.length}</strong> products</span>
                <span className="sm:hidden"><strong>{filteredProducts.length}</strong> items</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Scroll Arrows */}
                <div className="flex lg:hidden items-center gap-1.5">
                  <button
                    onClick={() => handleMobileScroll('left')}
                    disabled={!canScrollLeft}
                    className="p-1.5 rounded-md border border-gray-200 bg-gray-50 text-gray-700 disabled:opacity-40"
                    title="Previous"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMobileScroll('right')}
                    disabled={!canScrollRight}
                    className="p-1.5 rounded-md border border-gray-200 bg-gray-50 text-gray-700 disabled:opacity-40"
                    title="Next"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    isMobileFilterOpen || priceRange < maxProductPrice || selectedCategory !== 'All'
                      ? 'bg-rose-50 border-[#ff2056] text-[#ff2056]'
                      : 'bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {priceRange < maxProductPrice && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff2056]"></span>
                  )}
                  {isMobileFilterOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="hidden sm:inline text-gray-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-100 border border-gray-200 text-gray-800 rounded-lg px-2.5 sm:px-3 py-1.5 focus:outline-none font-medium text-xs cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Collapsible Filter Dropdown Drawer */}
            {isMobileFilterOpen && (
              <div className="lg:hidden bg-white p-4 rounded-xl border border-rose-100 shadow-lg space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#ff2056]" />
                    <span>Quick Filter Options</span>
                  </h4>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setPriceRange(maxProductPrice);
                      setIsMobileFilterOpen(false);
                    }}
                    className="text-[11px] font-bold text-[#ff2056] hover:underline"
                  >
                    Reset
                  </button>
                </div>

                {/* Category Dropdown on Mobile */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-700">Select Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-[#ff2056] outline-none"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Slider on Mobile */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Max Price:</span>
                    <span className="text-[#ff2056]">{formatPrice(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max={maxProductPrice}
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#ff2056] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                    <span>৳500</span>
                    <span>{formatPrice(maxProductPrice)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Apply & Close
                  </button>
                </div>
              </div>
            )}

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
                    setPriceRange(maxProductPrice);
                    setSearchQuery('');
                  }}
                  className="bg-[#ff2056] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#e01648] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                {/* 1. MOBILE AUTO-SCROLLING CAROUSEL (Home Page Style Cards) */}
                <div
                  className="lg:hidden relative"
                  onMouseEnter={() => setIsMobilePaused(true)}
                  onMouseLeave={() => setIsMobilePaused(false)}
                  onTouchStart={() => setIsMobilePaused(true)}
                  onTouchEnd={() => setIsMobilePaused(false)}
                >
                  <div
                    ref={mobileScrollRef}
                    onScroll={updateMobileScrollButtons}
                    className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {filteredProducts.map((product) => {
                      const wish = isWishlisted(product.id);
                      const productName = product.name || product.title || 'StyleHub Item';
                      return (
                        <div
                          key={`mob-${product.id}`}
                          className="w-[220px] sm:w-[250px] shrink-0 snap-start group relative bg-white rounded-xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                        >
                          <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
                            {product.discountBadge && (
                              <span
                                className={`absolute top-2.5 left-2.5 z-10 text-[10px] font-extrabold px-2 py-0.5 rounded ${
                                  product.discountBadge === 'New'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-[#ff2056] text-white'
                                }`}
                              >
                                {product.discountBadge}
                              </span>
                            )}

                            <button
                              onClick={() => toggleWishlist(product)}
                              className="absolute top-2.5 right-2.5 z-20 p-2 bg-white/95 hover:bg-white rounded-full text-gray-600 hover:text-[#ff2056] shadow-sm backdrop-blur-sm transition-all duration-300 cursor-pointer"
                              title={wish ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  wish ? 'fill-[#ff2056] text-[#ff2056]' : ''
                                }`}
                              />
                            </button>

                            <img
                              src={product.image}
                              alt={productName}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                            />

                            <button
                              onClick={() => addToCart(product)}
                              className="absolute inset-x-0 bottom-0 z-20 bg-[#ff2056] hover:bg-[#d6103e] text-white text-[10px] font-bold uppercase tracking-wider py-2.5 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          </div>

                          <div className="p-3 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-[#ff2056] uppercase tracking-wide">
                              {product.category}
                            </span>
                            <h3 className="text-xs font-bold text-slate-800 line-clamp-1">
                              {productName}
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
                </div>

                {/* 2. DESKTOP & TABLET 3-COLUMN PRODUCT GRID (6 Products Per Page) */}
                <div className="hidden lg:grid grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => {
                    const wish = isWishlisted(product.id);
                    const productName = product.name || product.title || 'StyleHub Item';
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

                          {/* Wishlist Button */}
                          <button
                            onClick={() => toggleWishlist(product)}
                            className="absolute top-2.5 right-2.5 z-20 p-2 bg-white/95 hover:bg-white rounded-full text-gray-600 hover:text-[#ff2056] shadow-sm backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-1.5 group-hover:translate-y-0 cursor-pointer"
                            title={wish ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart className={`w-4 h-4 ${wish ? 'fill-[#ff2056] text-[#ff2056]' : ''}`} />
                          </button>

                          {/* Product Image with Zoom */}
                          <img
                            src={product.image}
                            alt={productName}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          />

                          {/* Quick View Overlay */}
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
                              className="bg-white/95 hover:bg-white text-slate-900 hover:text-[#ff2056] text-[10px] font-bold tracking-[0.16em] uppercase px-4 py-2 rounded-xs shadow-md backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                            >
                              Quick View
                            </button>
                          </div>

                          {/* Quick Add Button */}
                          <button
                            onClick={() => addToCart(product)}
                            className="absolute inset-x-0 bottom-0 z-20 bg-[#ff2056] hover:bg-[#d6103e] active:bg-[#b80830] text-white text-[10.5px] font-bold uppercase tracking-[0.15em] py-2.5 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
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
                            {productName}
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

                {/* 3. DESKTOP PAGINATION BAR (6 Items Per Page) */}
                {totalPages > 1 && (
                  <div className="hidden lg:flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs mt-6">
                    <span className="text-xs font-medium text-gray-500">
                      Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{' '}
                      <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</strong> of{' '}
                      <strong>{filteredProducts.length}</strong> products
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-[#ff2056] text-white shadow-sm'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};

export default ShopPage;
