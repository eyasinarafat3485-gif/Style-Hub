import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, ChevronDown, X, Menu, LogIn, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { cartItemCount, wishlist, setIsCartOpen, setIsWishlistOpen, searchQuery, setSearchQuery } = useShop();
  const { user, isAuthenticated, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);


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

          {/* Search Toggle Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              showSearch
                ? 'text-[#ff2056] bg-rose-50'
                : 'text-gray-700 hover:text-[#ff2056] hover:bg-rose-50'
            }`}
            title="Search"
            aria-label="Toggle Search"
          >
            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* User Authentication: Login Button OR Avatar Dropdown */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-[#ff2056] text-white text-xs font-bold transition-all shadow-xs cursor-pointer group shrink-0"
              title="Sign in to your account"
            >
              <User className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Login</span>
            </Link>
          ) : (
            <div
              ref={userMenuRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-[#ff2056]/30 transition-all cursor-pointer focus:outline-none"
                title={user?.name || 'My Account'}
                aria-label="User profile menu"
                aria-expanded={userMenuOpen}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextSibling) {
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }
                    }}
                    className="w-8 h-8 rounded-full object-cover border border-rose-200"
                  />
                ) : null}
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white font-bold text-xs items-center justify-center shadow-xs border border-white"
                  style={{ display: user?.avatar ? 'none' : 'flex' }}
                >
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              </button>

              {/* Click-Triggered Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-100 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in divide-y divide-gray-100">
                  <div className="px-3.5 py-2">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Customer'}</p>
                      {user?.role === 'admin' && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-50 text-[#ff2056] text-[9px] font-extrabold uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:text-[#ff2056] hover:bg-rose-50/70 font-semibold transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-gray-400" />
                      <span>{user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</span>
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        logout();
                        toast.info('Logged out safely. See you soon! 👋');
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-gray-700 hover:text-[#ff2056] hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
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

      {/* Slide-Down Full-Width Responsive Search Bar (No mobile width breakage) */}
      {showSearch && (
        <div className="border-t border-gray-100 bg-white/98 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 shadow-md animate-fade-in w-full">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center bg-gray-100/90 rounded-full px-3.5 py-1.5 sm:py-2 border border-gray-200 focus-within:border-[#ff2056] focus-within:bg-white transition-all shadow-xs"
          >
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search products by name, category, panjabi, shirt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs sm:text-sm w-full focus:outline-none text-gray-800 font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 mr-2 text-[11px] font-semibold cursor-pointer shrink-0"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Search
            </button>
          </form>
        </div>
      )}

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

          {/* Mobile Auth Entry */}
          <div className="pt-3 border-t border-gray-100">
            {!isAuthenticated ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </Link>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }
                      }}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : null}
                  <div
                    className="w-7 h-7 rounded-full bg-[#ff2056] text-white text-xs font-bold items-center justify-center"
                    style={{ display: user?.avatar ? 'none' : 'flex' }}
                  >
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-1.5 text-center bg-gray-100 rounded text-xs font-bold text-slate-800"
                  >
                    {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toast.info('Logged out safely. See you soon! 👋');
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="flex-1 py-1.5 text-center bg-rose-50 text-[#ff2056] rounded text-xs font-bold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
