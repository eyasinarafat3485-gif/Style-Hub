import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Store,
  Menu,
  X,
  Package,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  Star,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import NotificationDropdown from '../NotificationDropdown';
import { useShop } from '../../context/ShopContext';
import { API_BASE_URL } from '../../config/api';

const DashboardTopBar = ({
  user,
  isAdmin,
  sidebarOpen,
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
}) => {
  const navigate = useNavigate();
  const { products, formatPrice, categories, brands } = useShop();

  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // 'all', 'orders', 'products', 'navigation'
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch orders for admin live search indexing
  useEffect(() => {
    if (!isAdmin) return;
    const fetchOrdersForSearch = async () => {
      try {
        const token = localStorage.getItem('stylehub_token');
        const res = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.warn('Dashboard search order fetch warning:', err);
      }
    };
    fetchOrdersForSearch();
  }, [isAdmin]);

  // Global Keyboard Shortcut (⌘K or Ctrl+K to focus search, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation Items Catalog
  const navigationItems = isAdmin
    ? [
        { title: 'Overview & Metrics', tab: 'overview', icon: BarChart3, keywords: ['stats', 'dashboard', 'home', 'sales', 'revenue', 'overview'] },
        { title: 'Orders Management', tab: 'orders', icon: Package, keywords: ['orders', 'shipping', 'delivery', 'status', 'invoice', 'parcels'] },
        { title: 'Pending Orders', tab: 'orders?status=Pending', icon: Clock, keywords: ['pending', 'unconfirmed', 'new orders', 'approval'] },
        { title: 'Processing Orders', tab: 'orders?status=Processing', icon: Sparkles, keywords: ['processing', 'packing', 'in progress'] },
        { title: 'Delivered Orders', tab: 'orders?status=Delivered', icon: CheckCircle2, keywords: ['delivered', 'completed', 'done'] },
        { title: 'Products Catalog', tab: 'products', icon: ShoppingBag, keywords: ['products', 'inventory', 'items', 'catalog', 'stock', 'cloth', 'dress', 'shirt', 'panjabi'] },
        { title: 'Add New Product', tab: 'add-product', icon: PlusCircle, keywords: ['add product', 'new item', 'create product', 'upload'] },
        { title: 'Customer Management', tab: 'customers', icon: Users, keywords: ['customers', 'users', 'buyers', 'profiles', 'accounts', 'clients'] },
        { title: 'Categories Management', tab: 'categories', icon: Layers, keywords: ['categories', 'category', 'taxonomy', 'groups'] },
        { title: 'Brand Partners', tab: 'brands', icon: Sparkles, keywords: ['brands', 'labels', 'designers', 'manufacturers'] },
        { title: 'Customer Reviews', tab: 'reviews', icon: Star, keywords: ['reviews', 'ratings', 'feedback', 'testimonials', 'stars'] },
        { title: 'Analytics & Revenue Reports', tab: 'analytics', icon: BarChart3, keywords: ['analytics', 'charts', 'financials', 'profit', 'sales report'] },
        { title: 'Store Settings & Shipping', tab: 'settings', icon: Settings, keywords: ['settings', 'shipping fee', 'payment methods', 'bKash', 'nagad', 'cod', 'configuration'] },
      ]
    : [
        { title: 'My Orders', tab: 'orders', icon: Package, keywords: ['orders', 'purchase', 'parcels', 'history', 'pending', 'track'] },
        { title: 'My Wishlist', tab: 'wishlist', icon: Star, keywords: ['wishlist', 'favorites', 'saved', 'likes'] },
        { title: 'Shopping Cart', tab: 'cart', icon: ShoppingBag, keywords: ['cart', 'bag', 'checkout', 'items'] },
        { title: 'My Profile & Address', tab: 'profile', icon: Users, keywords: ['profile', 'account', 'address', 'phone', 'email'] },
      ];

  const query = (searchTerm || '').trim().toLowerCase();

  // Search Results Matching Logic
  const matchedNav = navigationItems.filter((item) => {
    if (!query) return false;
    return (
      item.title.toLowerCase().includes(query) ||
      item.keywords.some((k) => k.toLowerCase().includes(query))
    );
  });

  const matchedProducts = (products || []).filter((p) => {
    if (!query) return false;
    const title = (p.name || p.title || '').toLowerCase();
    const category = (p.category || '').toLowerCase();
    const description = (p.description || '').toLowerCase();
    return title.includes(query) || category.includes(query) || description.includes(query);
  }).slice(0, 6);

  const matchedOrders = (orders || []).filter((o) => {
    if (!query) return false;
    const orderId = (o._id || '').toLowerCase();
    const shortId = orderId.slice(-6);
    const customerName = (o.shippingAddress?.fullName || o.customerInfo?.name || o.user?.name || '').toLowerCase();
    const phone = (o.shippingAddress?.phone || o.customerInfo?.phone || '').toLowerCase();
    const status = (o.status || 'pending').toLowerCase();
    const items = (o.orderItems || []).map((i) => (i.name || '').toLowerCase()).join(' ');

    return (
      orderId.includes(query) ||
      shortId.includes(query) ||
      customerName.includes(query) ||
      phone.includes(query) ||
      status.includes(query) ||
      items.includes(query)
    );
  }).slice(0, 6);

  const totalResults = matchedNav.length + matchedProducts.length + matchedOrders.length;

  const handleNavigate = (path) => {
    setIsOpen(false);
    if (setSearchTerm) setSearchTerm('');
    if (path.startsWith('/')) {
      navigate(path);
    } else {
      navigate(`/dashboard/${path}`);
    }
  };

  const getStatusBadgeColor = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('deliver')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('process')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s.includes('cancel')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (s.includes('ship')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-30 shadow-xs relative">
      {/* Left: Brand & Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-slate-900 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo & Tag */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white flex items-center justify-center font-serif font-black shadow-md shadow-rose-600/20">
            S
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-extrabold text-slate-900 text-lg tracking-tight">StyleHub</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-rose-50 text-[#ff2056] border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Middle: Live Interactive Command Search Bar */}
      <div ref={searchContainerRef} className="hidden md:flex items-center flex-1 max-w-lg mx-6 relative">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            placeholder={
              isAdmin
                ? 'Search orders, products, customers, status (e.g. pending)...'
                : 'Search your orders and saved items...'
            }
            value={searchTerm || ''}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              if (setSearchTerm) setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            className="w-full pl-10 pr-20 py-2 bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-[#ff2056] rounded-xl text-xs text-slate-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
          />

          {searchTerm ? (
            <button
              type="button"
              onClick={() => {
                if (setSearchTerm) setSearchTerm('');
                inputRef.current?.focus();
              }}
              className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}

          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded shadow-2xs pointer-events-none">
            ⌘K
          </span>
        </div>

        {/* Global Search Dropdown Results Popover */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50 animate-fadeIn max-h-[80vh] flex flex-col">
            
            {/* Header / Filter Tabs */}
            <div className="p-3 bg-stone-50 border-b border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700">
                  {query ? `Search results for "${query}"` : 'Quick Navigation & Shortcuts'}
                </span>
                {query && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#ff2056] text-[10px] font-extrabold">
                    {totalResults} found
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[9px] font-mono">ESC</kbd>
                <span>to close</span>
              </div>
            </div>

            {/* Scrollable Results Content */}
            <div className="overflow-y-auto p-3 space-y-4 divide-y divide-gray-100 max-h-96">
              
              {/* If no search term entered: Show Quick Shortcuts */}
              {!query && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block px-2">
                    Popular Dashboard Shortcuts
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {navigationItems.slice(0, 6).map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleNavigate(item.tab)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-[#ff2056] transition-all text-left text-xs font-semibold border border-transparent hover:border-rose-200/80 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-slate-600 shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 1. MATCHED NAVIGATION & PAGES */}
              {query && matchedNav.length > 0 && (
                <div className="space-y-1.5 pt-2 first:pt-0">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block px-2">
                    Pages & Actions ({matchedNav.length})
                  </span>
                  <div className="space-y-1">
                    {matchedNav.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleNavigate(item.tab)}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 text-slate-800 hover:text-[#ff2056] transition-colors text-left text-xs cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-rose-100 group-hover:text-[#ff2056] flex items-center justify-center text-slate-600 transition-colors">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold">{item.title}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. MATCHED ORDERS (For Admin) */}
              {query && isAdmin && matchedOrders.length > 0 && (
                <div className="space-y-1.5 pt-3 first:pt-0">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block px-2">
                    Orders Matching "{query}" ({matchedOrders.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedOrders.map((ord, idx) => {
                      const shortId = ord._id ? `SH-${ord._id.slice(-6).toUpperCase()}` : 'SH-ORDER';
                      const custName = ord.shippingAddress?.fullName || ord.customerInfo?.name || 'Customer';
                      const phone = ord.shippingAddress?.phone || ord.customerInfo?.phone || '';
                      const status = ord.status || 'Pending';
                      return (
                        <button
                          key={ord._id || idx}
                          type="button"
                          onClick={() => handleNavigate(`orders?search=${ord._id.slice(-6)}`)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-gray-100 hover:border-rose-200 transition-all text-left text-xs cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#ff2056] flex items-center justify-center font-bold text-[11px] shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900">{shortId}</span>
                                <span className="text-gray-400">•</span>
                                <span className="font-semibold text-slate-800">{custName}</span>
                              </div>
                              <p className="text-[11px] text-gray-500">
                                {phone} {ord.orderItems?.length ? `• ${ord.orderItems.length} items` : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeColor(status)}`}>
                              {status}
                            </span>
                            <p className="font-bold text-slate-900 text-xs">{formatPrice(ord.totalPrice)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. MATCHED PRODUCTS */}
              {query && matchedProducts.length > 0 && (
                <div className="space-y-1.5 pt-3 first:pt-0">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block px-2">
                    Products Catalog ({matchedProducts.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedProducts.map((prod, idx) => (
                      <button
                        key={prod._id || prod.id || idx}
                        type="button"
                        onClick={() => handleNavigate(`products?search=${encodeURIComponent(prod.name || prod.title)}`)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-gray-100 hover:border-rose-200 transition-all text-left text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-8 h-10 object-cover rounded-md border border-gray-200 shrink-0 bg-stone-100"
                          />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{prod.name || prod.title}</p>
                            <span className="text-[10px] text-gray-500 font-medium">{prod.category}</span>
                          </div>
                        </div>
                        <span className="font-bold text-[#ff2056] text-xs shrink-0">
                          {formatPrice(prod.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* NO RESULTS FOUND STATE */}
              {query && totalResults === 0 && (
                <div className="py-8 text-center space-y-2">
                  <div className="w-10 h-10 bg-stone-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">No results matching "{query}"</p>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                    Try searching by order status (e.g. <em>pending</em>, <em>delivered</em>), product name, customer name, or page name.
                  </p>
                </div>
              )}

            </div>

            {/* Footer */}
            {query && totalResults > 0 && (
              <div className="p-2.5 bg-stone-50 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={() => handleNavigate(`orders?search=${encodeURIComponent(query)}`)}
                  className="text-xs font-bold text-[#ff2056] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>See all order search results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Return to Live Store Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-1.5 px-3 sm:px-3.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-slate-700 hover:text-[#ff2056] text-xs font-bold transition-all border border-gray-200/60 shadow-2xs"
        >
          <Store className="w-3.5 h-3.5 text-[#ff2056]" />
          <span className="hidden sm:inline">Live Store</span>
        </Link>

        {/* Live Interactive Notification Dropdown */}
        <NotificationDropdown align="right" />
      </div>
    </header>
  );
};

export default DashboardTopBar;
