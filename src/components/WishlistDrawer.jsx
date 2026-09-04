import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const WishlistDrawer = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart, formatPrice } = useShop();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-gray-100">
          
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-stone-50/80">
            <div className="flex items-center gap-2 text-slate-900">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="font-bold text-sm tracking-tight">Your Wishlist ({wishlist.length})</h3>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-gray-100">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="p-4 bg-rose-50 rounded-full text-rose-500">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Your wishlist is empty</h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  Save items you love to your wishlist and view them anytime.
                </p>
              </div>
            ) : (
              wishlist.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover object-top rounded border border-gray-200"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                    <p className="text-xs font-extrabold text-[#ff2056]">{formatPrice(item.price)}</p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          addToCart(item);
                          toggleWishlist(item);
                        }}
                        className="bg-[#ff2056] hover:bg-[#e01648] text-white px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(item)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
