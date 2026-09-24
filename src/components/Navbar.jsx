import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  X,
  Menu,
  LogIn,
  LogOut,
  LayoutDashboard,
  Bell,
  Sparkles,
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { cartItemCount, wishlist, setIsCartOpen, setIsWishlistOpen, searchQuery, setSearchQuery, categories } = useShop();
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSiteSettings();

  const brandName = settings?.branding?.logoText || 'StyleHub';
  const tagline = settings?.branding?.tagline || 'Wear Your Style';
  const logoUrl = settings?.branding?.logoUrl;

  const navCategories = React.useMemo(() => {
    if (categories && categories.length > 0) {
      const list = categories.map((c) => (c.name?.trim().toLowerCase() === 'shirts' ? 'Shirt' : c.name));
      return Array.from(new Set(list));
    }
    return ['Panjabi', 'Shirt', 'T-Shirts', 'Kurtis', 'Sarees', 'Men', 'Women'];
  }, [categories]);

  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
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
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop');
      setShowSearch(false);
    }
  };

  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag);
    navigate(`/shop?category=${encodeURIComponent(tag)}`);
    setShowSearch(false);
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-1 font-semibold transition-all hover:text-[#ff2056] ${
      isActive ? 'text-[#ff2056] font-bold border-b-2 border-[#ff2056]' : 'text-gray-700'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block py-2 px-3 rounded-lg font-bold transition-all ${
      isActive
        ? 'bg-rose-50 text-[#ff2056]'
        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-[#ff2056] p-1 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff2056]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-1.5 group shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-7 sm:h-9 w-auto object-contain max-w-[120px] sm:max-w-[150px]" />
            ) : (
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#ff2056] transition-colors leading-none">
                  {brandName}<span className="text-[#ff2056]">.</span>
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest text-gray-500 uppercase font-semibold -mt-0.5 hidden xs:block">
                  {tagline}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Center Navigation Links (Desktop) */}
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
            <div className="absolute top-full -left-2 hidden group-hover:block w-56 sm:w-60 bg-white border border-gray-100 shadow-xl rounded-xl p-1.5 z-50 animate-fade-in">
              <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                {navCategories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold text-gray-700 hover:bg-rose-50 hover:text-[#ff2056] transition-all group/item"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300 group-hover/item:bg-[#ff2056] transition-all shrink-0"></span>
                    <span className="truncate">{cat}</span>
                  </Link>
                ))}
              </div>
              <div className="pt-1 mt-1 border-t border-gray-100 flex items-center justify-between px-1.5">
                <Link
                  to="/categories"
                  className="text-[10px] font-bold text-[#ff2056] hover:underline flex items-center gap-1"
                >
                  <span>All Categories</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          <NavLink to="/men" className={navLinkClass}>Men</NavLink>
          <NavLink to="/women" className={navLinkClass}>Women</NavLink>
          <NavLink to="/new-arrivals" className={navLinkClass}>New Arrivals</NavLink>
          <NavLink to="/about-us" className={navLinkClass}>About Us</NavLink>
        </nav>

        {/* Right Action Tools Bar (Responsive & Fits Small Mobile Screens) */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          
          {/* Search Toggle Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer ${
              showSearch
                ? 'text-[#ff2056] bg-rose-50'
                : 'text-gray-700 hover:text-[#ff2056] hover:bg-rose-50'
            }`}
            title="Search"
            aria-label="Toggle Search"
          >
            {showSearch ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff2056]" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Notifications Dropdown (Authenticated) - Desktop & Tablet */}
          {isAuthenticated && (
            <div className="hidden xs:block">
              <NotificationDropdown align="right" />
            </div>
          )}

          {/* User Authentication: Login Button OR Avatar Dropdown */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-[#ff2056] text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer group shrink-0"
              title="Sign in to your account"
            >
              <User className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="hidden xs:inline">Login</span>
            </Link>
          ) : (
            <div ref={userMenuRef} className="relative shrink-0">
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
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-rose-200"
                  />
                ) : null}
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white font-bold text-xs items-center justify-center shadow-xs border border-white"
                  style={{ display: user?.avatar ? 'none' : 'flex' }}
                >
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              </button>

              {/* User Dropdown Menu */}
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

          {/* Wishlist Button (Hidden on tiny screens < 380px, visible on sm and in mobile drawer) */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="hidden min-[380px]:flex relative p-1.5 sm:p-2 text-gray-700 hover:text-[#ff2056] hover:bg-rose-50 rounded-full transition-colors cursor-pointer shrink-0"
            title="Wishlist"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#ff2056] text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 sm:p-2 text-gray-700 hover:text-[#ff2056] hover:bg-rose-50 rounded-full transition-colors cursor-pointer shrink-0"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#ff2056] text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Professional Expandable Search Bar Dropdown */}
      {showSearch && (
        <div className="border-t border-gray-100 bg-white/98 backdrop-blur-md px-3 sm:px-6 py-3 shadow-md animate-fade-in w-full">
          <div className="max-w-2xl mx-auto space-y-2.5">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-gray-100/90 rounded-full px-3.5 py-1.5 sm:py-2 border border-gray-200 focus-within:border-[#ff2056] focus-within:bg-white transition-all shadow-xs"
            >
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search products by name, panjabi, shirt..."
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
                className="bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Quick Filter Tag Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-gray-600 no-scrollbar">
              <span className="font-bold text-gray-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-[#ff2056]" />
                <span>Trending:</span>
              </span>
              {['Panjabi', 'Shirt', 'T-Shirts', 'Kurtis', 'Sarees'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-2.5 py-0.5 rounded-full bg-rose-50 text-slate-700 hover:bg-[#ff2056] hover:text-white font-semibold transition-colors shrink-0 cursor-pointer border border-rose-100"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 font-semibold text-sm animate-fade-in shadow-xl max-h-[85vh] overflow-y-auto">
          
          {/* User Profile / Auth Header Card */}
          <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
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
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-9 h-9 rounded-full object-cover border border-rose-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#ff2056] text-white text-xs font-bold flex items-center justify-center">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Customer'}</p>
                      {user?.role === 'admin' && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-[#ff2056] text-[9px] font-extrabold uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-1.5 text-center bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>{user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      toast.info('Logged out safely. See you soon! 👋');
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="flex-1 py-1.5 text-center bg-rose-50 text-[#ff2056] rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 pt-1">
            <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/shop" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              Shop All
            </NavLink>
            {/* Expandable Categories Accordion Sub-Dropdown */}
            <div className="rounded-xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
              >
                <span className={mobileCategoriesOpen ? 'text-[#ff2056] font-bold' : ''}>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileCategoriesOpen ? 'rotate-180 text-[#ff2056]' : 'text-gray-400'
                  }`}
                />
              </button>

              {/* Sub-Dropdown Categories List */}
              {mobileCategoriesOpen && (
                <div className="ml-2 pl-3 my-1 border-l-2 border-rose-200/80 space-y-1 py-1.5 animate-fade-in bg-rose-50/30 rounded-r-xl">
                  <div className="grid grid-cols-2 gap-1.5 pr-2">
                    {navCategories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/shop?category=${encodeURIComponent(cat)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-rose-50 hover:text-[#ff2056] transition-all border border-gray-100 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff2056] shrink-0" />
                        <span className="truncate">{cat}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 mt-1 border-t border-rose-100/70 pr-2">
                    <Link
                      to="/categories"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-bold text-[#ff2056] hover:underline flex items-center justify-between px-2 py-1"
                    >
                      <span>Explore All Categories</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/men" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              Men
            </NavLink>
            <NavLink to="/women" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              Women
            </NavLink>
            <NavLink to="/new-arrivals" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              New Arrivals
            </NavLink>
            <NavLink to="/about-us" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              About Us
            </NavLink>
          </div>

          {/* Quick Access Wishlist & Cart Links in Mobile Drawer */}
          <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsWishlistOpen(true);
              }}
              className="py-2.5 px-3 bg-rose-50 text-[#ff2056] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="py-2.5 px-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>My Cart ({cartItemCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
