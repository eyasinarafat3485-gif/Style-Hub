import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Search, ArrowRight, AlertCircle, Compass, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { setSearchQuery } = useShop();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-stone-100 via-rose-50/20 to-white flex items-center justify-center py-16 px-4">
      <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
        
        {/* Glowing 404 Hero Graphic */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-[#ff2056]/20 rounded-full blur-3xl transform scale-150"></div>
          
          <div className="relative bg-white/80 backdrop-blur-xl border border-rose-100 shadow-2xl rounded-3xl p-8 sm:p-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-rose-100/80 px-4 py-1.5 rounded-full text-[#ff2056] text-xs font-black tracking-widest uppercase border border-rose-200">
              <AlertCircle className="w-4 h-4 text-[#ff2056]" />
              <span>Error 404</span>
            </div>

            <h1 className="font-serif text-6xl sm:text-8xl font-black text-slate-900 tracking-tighter">
              4<span className="text-[#ff2056]">0</span>4
            </h1>

            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-800">
              Page Not Found / পৃষ্ঠাটি পাওয়া যায়নি
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
              Oops! The page you are looking for might have been moved, renamed, or doesn't exist. Let's get you back on track!
            </p>

            {/* Quick Product Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-md mx-auto">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Search products or categories..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-gray-200 text-slate-800 text-xs rounded-full pl-10 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff2056] focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-[#ff2056] hover:bg-[#e01648] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-[#ff2056] hover:bg-[#e01648] text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white hover:bg-rose-50 text-slate-800 hover:text-[#ff2056] border border-gray-300 px-6 py-3 rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs hover:shadow"
              >
                <ShoppingBag className="w-4 h-4 text-[#ff2056]" />
                <span>Browse All Products</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Popular Quick Links */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200/80 p-6 shadow-sm max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800">
            <Compass className="w-4 h-4 text-[#ff2056]" />
            <span>Popular Destinations</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/categories"
              className="p-3 bg-stone-50 hover:bg-rose-50 rounded-xl border border-gray-100 text-center transition-all group"
            >
              <span className="block text-xs font-bold text-slate-800 group-hover:text-[#ff2056]">
                Categories
              </span>
              <span className="text-[10px] text-gray-500 font-medium">All collections</span>
            </Link>

            <Link
              to="/men"
              className="p-3 bg-stone-50 hover:bg-rose-50 rounded-xl border border-gray-100 text-center transition-all group"
            >
              <span className="block text-xs font-bold text-slate-800 group-hover:text-[#ff2056]">
                Men's Wear
              </span>
              <span className="text-[10px] text-gray-500 font-medium">Polos & Shirts</span>
            </Link>

            <Link
              to="/women"
              className="p-3 bg-stone-50 hover:bg-rose-50 rounded-xl border border-gray-100 text-center transition-all group"
            >
              <span className="block text-xs font-bold text-slate-800 group-hover:text-[#ff2056]">
                Women's
              </span>
              <span className="text-[10px] text-gray-500 font-medium">Ethnic & Casual</span>
            </Link>

            <Link
              to="/trending"
              className="p-3 bg-stone-50 hover:bg-rose-50 rounded-xl border border-gray-100 text-center transition-all group"
            >
              <span className="block text-xs font-bold text-[#ff2056] group-hover:text-[#ff2056]">
                Trending Items 🔥
              </span>
              <span className="text-[10px] text-gray-500 font-medium">Top Picks</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
