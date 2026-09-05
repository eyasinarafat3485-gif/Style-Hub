import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const TrendingProducts = () => {
  const { products, formatPrice, addToCart, toggleWishlist, isWishlisted, setQuickViewProduct, searchQuery } = useShop();

  const filteredProducts = searchQuery
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending Now
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">Our most popular fashion picks this season</p>
          </div>
          
          <Link
            to="/shop"
            className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-[#ff2056] transition-colors group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid: 2 on mobile, 3 on tablet/medium, 5 on lg desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
          {filteredProducts.map((product) => {
            const wish = isWishlisted(product.id);
            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-lg border border-gray-100/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
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
                      className="bg-white/95 hover:bg-white text-slate-900 hover:text-[#ff2056] text-[9px] sm:text-[10px] font-bold tracking-[0.16em] uppercase px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xs shadow-md backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                    >
                      Quick View
                    </button>
                  </div>

                  {/* GlamNGrace Style: Bottom Full-Width Quick Add Button (Brand Theme Color #ff2056) */}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute inset-x-0 bottom-0 z-20 bg-[#ff2056] hover:bg-[#d6103e] active:bg-[#b80830] text-white text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.15em] py-2 sm:py-2.5 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 flex flex-col gap-1.5">
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#ff2056] transition-colors">
                    {product.name}
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
    </section>
  );
};

export default TrendingProducts;
