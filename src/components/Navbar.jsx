import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, ChevronDown, X, Menu } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Navbar = () => {
  const { cartItemCount, wishlist, setIsCartOpen, setIsWishlistOpen, searchQuery, setSearchQuery } = useShop();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop');
      setShowSearch(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-1 font-semibold transition-all hover:text-[#ff2056] ${isActive ? 'text-[#ff2056] font-bold border-b-2 border-[#ff2056]' : 'text-gray-700'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">

        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-[#ff2056] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex flex-col group">
            <span className="font-serif text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#ff2056] transition-colors">
              StyleHub<span className="text-[#ff2056]">.</span>
            </span>
            <span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold -mt-1">
              Wear Your Style
            </span>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-700">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>

          <div className="relative group cursor-pointer py-1 flex items-center gap-1 hover:text-[#ff2056] transition-colors">
            <Link to="/shop" className="hover:text-[#ff2056]">Shop</Link>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff2056] transition-transform group-hover:rotate-180" />
            <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white border border-gray-100 shadow-xl rounded-b-lg py-2 z-50 animate-fade-in">
              <Link to="/shop" className="block px-4 py-2 text-xs hover:bg-rose-50 hover:text-[#ff2056]">All Products</Link>
              <Link to="/trending" className="block px-4 py-2 text-xs hover:bg-rose-50 hover:text-[#ff2056]">Trending Tops</Link>
              <Link to="/new-arrivals" className="block px-4 py-2 text-xs hover:bg-rose-50 hover:text-[#ff2056]">Festive Collection</Link>
            </div>
          </div>

          <div className="relative group cursor-pointer py-1 flex items-center gap-1 hover:text-[#ff2056] transition-colors">
            <Link to="/categories" className="hover:text-[#ff2056]">Categories</Link>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff2056] transition-transform group-hover:rotate-180" />
            <div className="absolute top-full left-0 hidden group-hover:block w-52 bg-white border border-gray-100 shadow-xl rounded-b-lg py-2 z-50 animate-fade-in">
              <Link to="/shop?category=Panjabi" className="block px-4 py-2 text-xs hover:bg-rose-50 hover:text-[#ff2056]">Panjabi & Kurtis</Link>
              <Link to="/men" className="block px-4 py-2 text-xs hover:bg-rose-50 hover:text-[#ff2056]">Men's Casual Wear</Link>
              <Link to="/shop?category=T-Shirts" className="block px-4 py-2 text-xs hover:bg-rose-50 hover:text-[#ff2056]">T-Shirts & Polos</Link>
              <Link to="/shop?category=Shirts" className="block px-4 py-2 text-xs hover:bg-rose-50 hover:text-[#ff2056]">Denim & Trousers</Link>
              <Link to="/women" className="block px-4 py-2 text-xs hover:bg-rose-50 hover:text-[#ff2056]">Women's Ethnic</Link>
            </div>
          </div>

          <NavLink to="/men" className={navLinkClass}>Men</NavLink>
          <NavLink to="/women" className={navLinkClass}>Women</NavLink>
          <NavLink to="/kids" className={navLinkClass}>Kids</NavLink>
          <NavLink to="/new-arrivals" className={navLinkClass}>New Arrivals</NavLink>
          <NavLink to="/about-us" className={navLinkClass}>About Us</NavLink>
        </nav>

        {/* Right Icon Tools */}
        <div className="flex items-center gap-4">

          {/* Search Toggle */}
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 transition-all w-48 md:w-64">
                <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs w-full focus:outline-none text-gray-800"
                  autoFocus
                />
                <button type="button" onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600 ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-700 hover:text-[#ff2056] hover:bg-rose-50 rounded-full transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Account */}
          <button
            className="p-2 text-gray-700 hover:text-[#ff2056] hover:bg-rose-50 rounded-full transition-colors hidden sm:block"
            title="Account"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-gray-700 hover:text-[#ff2056] hover:bg-rose-50 rounded-full transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#ff2056] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-[#ff2056] hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#ff2056] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 font-semibold text-sm animate-fade-in shadow-lg">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#ff2056] font-bold">Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-700">Shop All</Link>
          <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-700">Categories</Link>
          <Link to="/men" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-700">Men</Link>
          <Link to="/women" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-700">Women</Link>
          <Link to="/kids" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-700">Kids</Link>
          <Link to="/new-arrivals" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-700">New Arrivals</Link>
          <Link to="/about-us" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-gray-700">About Us</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
