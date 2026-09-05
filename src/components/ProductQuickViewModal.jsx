import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ProductQuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, formatPrice, addToCart, toggleWishlist, isWishlisted } = useShop();
  const [selectedSize, setSelectedSize] = useState('M');

  if (!quickViewProduct) return null;

  const wish = isWishlisted(quickViewProduct.id);
  const sizes = quickViewProduct.sizes || ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 animate-fade-in border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-[3/4] md:aspect-auto bg-gray-50 overflow-hidden">
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover object-top"
          />
          {quickViewProduct.discountBadge && (
            <span className="absolute top-3 left-3 bg-[#ff2056] text-white text-xs font-extrabold px-2.5 py-1 rounded">
              {quickViewProduct.discountBadge}
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-[#ff2056] tracking-wider">
              {quickViewProduct.category}
            </span>
            <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">{quickViewProduct.name}</h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2 text-amber-400 text-xs">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-gray-500 font-medium">({quickViewProduct.reviewCount || 92} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl font-black text-slate-900">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(quickViewProduct.oldPrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              {quickViewProduct.description || "Premium Bangladesh fashion tailored for maximum comfort and high durability."}
            </p>

            {/* Size Selector */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-900 block mb-1.5">Select Size</label>
              <div className="flex items-center gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-9 h-9 rounded text-xs font-bold transition-all border ${
                      selectedSize === sz
                        ? 'border-[#ff2056] bg-[#ff2056] text-white shadow'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                addToCart(quickViewProduct, 1, selectedSize);
                setQuickViewProduct(null);
              }}
              className="w-full bg-[#ff2056] hover:bg-[#e01648] text-white py-3 rounded-md text-xs font-bold transition-all shadow flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart ({formatPrice(quickViewProduct.price)})</span>
            </button>

            <button
              onClick={() => toggleWishlist(quickViewProduct)}
              className="w-full border border-gray-300 hover:bg-gray-50 text-slate-800 py-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Heart className={`w-4 h-4 ${wish ? 'fill-[#ff2056] text-[#ff2056]' : ''}`} />
              <span>{wish ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductQuickViewModal;
