import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, formatPrice } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-gray-100">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-stone-50/80">
            <div className="flex items-center gap-2 text-slate-900">
              <ShoppingCart className="w-5 h-5 text-[#ff2056]" />
              <h3 className="font-bold text-sm tracking-tight">Your Shopping Cart ({cart.length})</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="p-4 bg-rose-50 rounded-full text-[#ff2056]">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Your cart is empty</h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  Looks like you haven't added any items to your shopping cart yet.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2 bg-[#ff2056] text-white text-xs font-bold rounded shadow hover:bg-[#e01648]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover object-top rounded border border-gray-200"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-gray-500">Size: <span className="font-semibold text-slate-800">{item.selectedSize}</span></p>
                    <p className="text-xs font-extrabold text-[#ff2056]">{formatPrice(item.price)}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-gray-200 rounded text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 text-gray-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-extrabold text-slate-900 text-sm">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Shipping (Bangladesh)</span>
                <span className="font-bold text-[#ff2056]">
                  {cartTotal >= 1499 ? 'FREE' : '৳60'}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-2 flex items-center justify-between text-sm font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-[#ff2056] text-base">
                  {formatPrice(cartTotal >= 1499 ? cartTotal : cartTotal + 60)}
                </span>
              </div>

              <button
                onClick={() => alert("Redirecting to Cash on Delivery / bKash Secure Checkout...")}
                className="w-full bg-[#ff2056] hover:bg-[#e01648] text-white py-3 rounded-md text-xs font-bold transition-all shadow flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-[10px] text-center text-gray-500 font-medium">
                🔒 100% Secure Checkout with Cash on Delivery, bKash & Nagad
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
