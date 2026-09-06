import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const TrendingProducts = () => {
  const { products, formatPrice, addToCart, toggleWishlist, isWishlisted, setQuickViewProduct, searchQuery } = useShop();
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredProducts = searchQuery
    ? products.filter((p) =>
        (p.name || p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // Check scroll position to enable/disable arrow controls
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Timed Auto Carousel (every 3.5 seconds)
  useEffect(() => {
    if (isPaused || !scrollRef.current || filteredProducts.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          // Reached end, loop back smoothly to start
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll right to next products batch
          const scrollAmount = scrollRef.current.clientWidth * 0.7;
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, filteredProducts]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, [filteredProducts]);

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ff2056] animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#ff2056]">
                Glam & Grace Showcase
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending Now
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Our most popular luxury fashion picks this season
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Left & Right Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'border-gray-300 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                }`}
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  canScrollRight
                    ? 'border-gray-300 text-slate-800 hover:bg-[#ff2056] hover:text-white hover:border-[#ff2056]'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                }`}
                title="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/shop"
              className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-[#ff2056] transition-colors group ml-2"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Timed Auto Carousel Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative"
        >
          <div
            ref={scrollRef}
            className="flex gap-4 lg:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProducts.map((product) => {
              const wish = isWishlisted(product.id);
              const productName = product.name || product.title || 'StyleHub Item';
              return (
                <div
                  key={product.id}
                  className="w-[210px] sm:w-[240px] md:w-[250px] lg:w-[260px] shrink-0 snap-start group relative bg-white rounded-xl border border-gray-100/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Image & Badges Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
                    {/* Badge */}
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

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2.5 right-2.5 z-20 p-2 bg-white/95 hover:bg-white rounded-full text-gray-600 hover:text-[#ff2056] shadow-sm backdrop-blur-sm transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 -translate-y-1 sm:-translate-y-1.5 sm:group-hover:translate-y-0 cursor-pointer"
                      title={wish ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          wish ? 'fill-[#ff2056] text-[#ff2056]' : ''
                        }`}
                      />
                    </button>

                    {/* Product Image with Zoom */}
                    <img
                      src={product.image}
                      alt={productName}
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
                        className="bg-white/95 hover:bg-white text-slate-900 hover:text-[#ff2056] text-[9px] sm:text-[10px] font-bold tracking-[0.16em] uppercase px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xs shadow-md backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                      >
                        Quick View
                      </button>
                    </div>

                    {/* GlamNGrace Style: Bottom Quick Add Button */}
                    <button
                      onClick={() => addToCart(product)}
                      className="absolute inset-x-0 bottom-0 z-20 bg-[#ff2056] hover:bg-[#d6103e] active:bg-[#b80830] text-white text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.15em] py-2 sm:py-2.5 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 flex flex-col gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-[#ff2056] transition-colors">
                      {productName}
                    </h3>

                    {/* Pricing */}
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

                    {/* Rating Stars */}
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
      </div>
    </section>
  );
};

export default TrendingProducts;
