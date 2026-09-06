import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { toast } from 'react-toastify';

// Top Bar Header
import DashboardTopBar from '../components/dashboard/DashboardTopBar';

// Admin Components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverview from '../components/admin/AdminOverview';
import AdminProducts from '../components/admin/AdminProducts';
import AdminAddProduct from '../components/admin/AdminAddProduct';
import AdminOrders from '../components/admin/AdminOrders';
import AdminCustomers from '../components/admin/AdminCustomers';

// User Components
import UserSidebar from '../components/user/UserSidebar';
import {
  Package,
  Heart,
  User,
  MapPin,
  Gift,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Bell,
  Truck,
  Clock,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';

const DashboardPage = () => {
  const { user, logout, isLoading } = useAuth();
  const { wishlist, formatPrice, removeFromWishlist, addToCart } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic URL Subpath Sync (e.g. /dashboard/products -> 'products')
  const getSubPath = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'overview';
    return parts[1] || 'overview';
  };

  const activeTab = getSubPath();

  const handleTabChange = (tabId) => {
    if (tabId === 'overview') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${tabId}`);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleLogout = () => {
    logout();
    toast.info('Logged out safely. See you soon! 👋');
    navigate('/', { replace: true });
  };

  // 1. Loading spinner state while checking authentication
  if (isLoading && !user) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-rose-200 border-t-[#ff2056] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 font-sans tracking-wide">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // 2. If user is not logged in after auth check finishes, redirect to login page
  if (!user) {
    navigate('/login', { replace: true });
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-rose-200 border-t-[#ff2056] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 font-sans tracking-wide">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  // Customer Mock Orders
  const myOrders = [
    {
      id: 'SH-87391',
      date: 'Sep 02, 2026',
      items: 'Royal Silk Embroidered Panjabi (L) x 1',
      total: '৳ 3,850',
      status: 'Delivered',
      deliveryEstimate: 'Delivered on Sep 04, 2026',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'SH-87102',
      date: 'Aug 20, 2026',
      items: 'Premium Pima Cotton Polo (Navy, XL) x 1',
      total: '৳ 1,450',
      status: 'Delivered',
      deliveryEstimate: 'Delivered on Aug 23, 2026',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-slate-50 font-sans selection:bg-[#ff2056] selection:text-white">
      {/* 1. Global Full-Width Dashboard Top Bar */}
      <DashboardTopBar
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchTerm={globalSearch}
        setSearchTerm={setGlobalSearch}
      />

      {/* 2. Full-Height App Shell Workspace */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {isAdmin ? (
          /* ================= ADMIN ROLE WORKSPACE ================= */
          <>
            {/* Executive Left Sidebar */}
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              onLogout={handleLogout}
              user={user}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onAddNewProduct={() => {
                handleTabChange('add-product');
              }}
            />

            {/* Scrollable Main Content Canvas */}
            <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-stone-50/70 w-full min-w-0">
              <div className="max-w-7xl mx-auto space-y-6">
                {activeTab === 'overview' && (
                  <AdminOverview
                    setActiveTab={handleTabChange}
                    onAddNewProduct={() => {
                      handleTabChange('add-product');
                    }}
                  />
                )}

                {activeTab === 'products' && (
                  <AdminProducts
                    isModalOpen={isAddProductModalOpen}
                    setIsModalOpen={setIsAddProductModalOpen}
                  />
                )}

                {activeTab === 'add-product' && (
                  <AdminAddProduct setActiveTab={handleTabChange} />
                )}

                {activeTab === 'brands' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Brand Management</h3>
                        <p className="text-xs text-gray-500">Manage registered apparel and luxury store brands</p>
                      </div>
                      <button className="px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 cursor-pointer self-start sm:self-auto">
                        + Add New Brand
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { name: 'StyleHub Signature', items: '42 Products', status: 'Featured' },
                        { name: 'Royal Silk Atelier', items: '28 Products', status: 'Active' },
                        { name: 'Velvet Heritage', items: '19 Products', status: 'Active' },
                        { name: 'Urban Denim Co.', items: '34 Products', status: 'Active' },
                      ].map((brand, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">{brand.status}</span>
                            <span className="text-xs text-gray-400">ID: #BR-00{idx + 1}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-3">{brand.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{brand.items}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Product Categories</h3>
                        <p className="text-xs text-gray-500">Organize clothing, footwear, and accessory hierarchies</p>
                      </div>
                      <button className="px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 cursor-pointer self-start sm:self-auto">
                        + Create Category
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { name: "Men's Panjabi & Ethnic", count: "36 Items", slug: "/category/panjabi" },
                        { name: "Women's Designer Sarees", count: "48 Items", slug: "/category/sarees" },
                        { name: "Casual Premium Shirts", count: "29 Items", slug: "/category/shirts" },
                        { name: "Festive Silk Lehengas", count: "18 Items", slug: "/category/lehenga" },
                        { name: "Luxury Accessories & Belts", count: "22 Items", slug: "/category/accessories" },
                        { name: "Footwear & Leather Shoes", count: "15 Items", slug: "/category/footwear" },
                      ].map((cat, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{cat.name}</h4>
                            <span className="text-[11px] text-gray-500">{cat.count}</span>
                          </div>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-mono">{cat.slug}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'tags' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Product Tags</h3>
                        <p className="text-xs text-gray-500">Filter tags for marketing badging and search indexing</p>
                      </div>
                      <button className="px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 cursor-pointer self-start sm:self-auto">
                        + Add Tag
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['#NewArrival', '#TrendingNow', '#EidCollection', '#HandmadeSilk', '#PremiumCotton', '#BestSeller', '#LimitedEdition', '#Discount20', '#FormalStyle'].map((tag, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 hover:border-[#ff2056] hover:text-[#ff2056] transition-colors cursor-pointer">
                          {tag}
                          <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-200">12</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'attributes' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Product Attributes & Variants</h3>
                        <p className="text-xs text-gray-500">Manage size scales, color swatches, and material options</p>
                      </div>
                      <button className="px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 cursor-pointer self-start sm:self-auto">
                        + Add Attribute
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm">Apparel Sizes</h4>
                        <div className="flex flex-wrap gap-2">
                          {['S', 'M', 'L', 'XL', 'XXL', 'Custom Tailored'].map((s, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white border border-gray-300 text-xs font-bold rounded-md text-slate-700">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm">Color Swatches</h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Royal Navy', hex: 'bg-indigo-950' },
                            { name: 'Crimson Red', hex: 'bg-rose-600' },
                            { name: 'Emerald Green', hex: 'bg-emerald-600' },
                            { name: 'Gold Silk', hex: 'bg-amber-400' },
                            { name: 'Pure Pearl', hex: 'bg-slate-100 border-gray-300' },
                          ].map((c, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white border border-gray-300 text-xs font-medium rounded-md text-slate-700 flex items-center gap-1.5">
                              <span className={`w-3 h-3 rounded-full ${c.hex} border border-gray-200`} />
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Customer Ratings & Reviews</h3>
                        <p className="text-xs text-gray-500">Monitor product feedback, verified purchaser reviews, and ratings</p>
                      </div>
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                        <span className="text-amber-500 text-sm">★</span>
                        <span className="text-xs font-bold text-amber-900">4.9 / 5.0</span>
                        <span className="text-[10px] text-amber-700">(128 total reviews)</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "Tariqul Islam", rating: 5, date: "Sep 05, 2026", product: "Royal Silk Embroidered Panjabi", comment: "Outstanding fitting and premium fabric. Delivery was fast within 24 hours in Dhaka!" },
                        { name: "Nusrat Jahan", rating: 5, date: "Sep 03, 2026", product: "Designer Banarasi Silk Saree", comment: "The gold zari work is extremely gorgeous! Exactly as shown in live product pictures." },
                        { name: "Mahmud Hasan", rating: 4, date: "Aug 29, 2026", product: "Premium Pima Cotton Polo", comment: "Very soft cotton material. Color did not fade after washing." },
                      ].map((rev, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">{rev.name}</span>
                              <span className="text-amber-400 text-xs">{"★".repeat(rev.rating)}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">{rev.date}</span>
                          </div>
                          <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                          <div className="text-[10px] text-slate-500 font-medium pt-1">
                            Product: <span className="text-[#ff2056] font-semibold">{rev.product}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && <AdminOrders />}

                {activeTab === 'customers' && <AdminCustomers currentUser={user} />}

                {activeTab === 'analytics' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs text-center space-y-4">
                    <h3 className="text-xl font-bold font-serif text-slate-900">Reports & Live Analytics</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Real-time revenue metrics, shopping cart conversion rates, and product inventory velocity.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
                      <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase">Conversion Rate</span>
                        <h4 className="text-2xl font-extrabold text-slate-900 mt-1">3.84%</h4>
                        <span className="text-[10px] text-emerald-600 font-medium">+0.6% vs last week</span>
                      </div>
                      <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl">
                        <span className="text-[11px] font-bold text-blue-700 uppercase">Avg. Order Value</span>
                        <h4 className="text-2xl font-extrabold text-slate-900 mt-1">৳ 2,450</h4>
                        <span className="text-[10px] text-blue-600 font-medium">+৳ 120 per checkout</span>
                      </div>
                      <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl">
                        <span className="text-[11px] font-bold text-[#ff2056] uppercase">Active Sessions</span>
                        <h4 className="text-2xl font-extrabold text-slate-900 mt-1">84 Live</h4>
                        <span className="text-[10px] text-gray-500 font-medium">Browsing store right now</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs space-y-6">
                    <div>
                      <h3 className="text-xl font-bold font-serif text-slate-900">Store Settings & Preferences</h3>
                      <p className="text-xs text-gray-500">Configure store options, checkout rules, and currency parameters</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <span className="font-bold text-slate-800">Primary Currency:</span>
                        <p className="text-gray-600">BDT (৳ - Bangladeshi Taka)</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <span className="font-bold text-slate-800">Inside Dhaka Delivery Fee:</span>
                        <p className="text-gray-600">৳ 60 (Free on orders over ৳ 3,000)</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <span className="font-bold text-slate-800">Outside Dhaka Delivery Fee:</span>
                        <p className="text-gray-600">৳ 120 (Courier delivery across Bangladesh)</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <span className="font-bold text-slate-800">Payment Gateways:</span>
                        <p className="text-gray-600">Cash on Delivery, bKash, Nagad, Visa/Mastercard</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </>
        ) : (
          /* ================= USER / CUSTOMER ROLE WORKSPACE ================= */
          <>
            {/* Customer Left Sidebar */}
            <UserSidebar
              user={user}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              onLogout={handleLogout}
              orderCount={myOrders.length}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            {/* Scrollable Customer Content Canvas */}
            <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-stone-50/70 w-full min-w-0">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Top Welcome Banner */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-xl font-bold font-serif">Welcome back, {user?.name}!</h2>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-[#ff2056] text-[10px] font-extrabold uppercase border border-rose-500/30">
                        {user?.role === 'admin' ? 'Admin' : 'Regular User'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Manage your live orders, saved wishlist items, coupons, and account preferences.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="px-4 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Explore New Collection</span>
                  </Link>
                </div>

                {/* TAB 0: Overview */}
                {activeUserTab === 'overview' && (
                  <div className="space-y-6">
                    {/* 4 Quick KPI Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <button
                        onClick={() => setActiveUserTab('orders')}
                        className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-rose-300 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
                          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#ff2056] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mt-2">{myOrders.length}</h4>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> 1 Delivered recently
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveUserTab('wishlist')}
                        className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-rose-300 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Saved Items</span>
                          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#ff2056] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Heart className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mt-2">{wishlist.length}</h4>
                        <span className="text-[10px] text-gray-500 font-medium mt-1 block">In your fashion wishlist</span>
                      </button>

                      <button
                        onClick={() => setActiveUserTab('notifications')}
                        className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-rose-300 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Notifications</span>
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Bell className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mt-2">3 Unread</h4>
                        <span className="text-[10px] text-amber-600 font-bold mt-1 block">Order & delivery updates</span>
                      </button>

                      <button
                        onClick={() => setActiveUserTab('address')}
                        className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-rose-300 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Primary Address</span>
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MapPin className="w-4 h-4" />
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-2 truncate">Dhanmondi, Dhaka</h4>
                        <span className="text-[10px] text-blue-600 font-bold mt-1 block">1 Saved location</span>
                      </button>
                    </div>

                    {/* Active Order Live Shipment Progress Widget */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-[#ff2056]" />
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">Recent Shipment Tracking</h3>
                            <p className="text-[11px] text-gray-500">Order #SH-87391 • Placed on Sep 02, 2026</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Delivered Successfully
                        </span>
                      </div>

                      {/* Shipment Step Tracker */}
                      <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                        <div className="space-y-1">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center font-bold text-xs">✓</div>
                          <p className="font-bold text-slate-800 text-[11px]">Order Placed</p>
                          <span className="text-[10px] text-gray-400">Sep 02</span>
                        </div>
                        <div className="space-y-1">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center font-bold text-xs">✓</div>
                          <p className="font-bold text-slate-800 text-[11px]">Packed & QC</p>
                          <span className="text-[10px] text-gray-400">Sep 03</span>
                        </div>
                        <div className="space-y-1">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center font-bold text-xs">✓</div>
                          <p className="font-bold text-slate-800 text-[11px]">Out for Delivery</p>
                          <span className="text-[10px] text-gray-400">Sep 04</span>
                        </div>
                        <div className="space-y-1">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center font-bold text-xs">✓</div>
                          <p className="font-bold text-emerald-600 text-[11px]">Delivered</p>
                          <span className="text-[10px] text-gray-400">Sep 04</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 1: My Orders */}
                {activeUserTab === 'orders' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-serif">Order History & Tracking</h3>
                        <p className="text-xs text-gray-500">Track shipment status and view previous purchases</p>
                      </div>
                      <Link to="/shop" className="text-xs font-bold text-[#ff2056] hover:underline flex items-center gap-1">
                        <span>Shop New Items</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {myOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-xl border border-gray-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gray-300 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{ord.id}</span>
                              <span className="text-xs text-gray-400">• {ord.date}</span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium">{ord.items}</p>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{ord.deliveryEstimate}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-extrabold text-slate-900 text-sm">{ord.total}</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${ord.statusColor}`}>
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: Saved Wishlist */}
                {activeUserTab === 'wishlist' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-serif">Saved Wishlist ({wishlist.length})</h3>
                        <p className="text-xs text-gray-500">Your favorite fashion items saved for later</p>
                      </div>
                    </div>

                    {wishlist.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <div className="w-14 h-14 bg-rose-50 text-[#ff2056] rounded-full flex items-center justify-center mx-auto">
                          <Heart className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Your wishlist is empty</h4>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                          Save items you love by clicking the heart icon on any product card.
                        </p>
                        <Link
                          to="/shop"
                          className="inline-block px-5 py-2.5 bg-[#ff2056] text-white text-xs font-bold rounded-xl shadow-sm"
                        >
                          Explore Catalog
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {wishlist.map((product) => (
                          <div
                            key={product.id}
                            className="p-3.5 rounded-xl border border-gray-200/80 flex items-center justify-between gap-3 bg-gray-50/50 hover:bg-white transition-all shadow-xs"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-14 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                              />
                              <div>
                                <p className="text-xs font-bold text-slate-900 line-clamp-1">{product.title}</p>
                                <p className="text-xs font-extrabold text-[#ff2056]">{formatPrice(product.price)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => addToCart(product)}
                                className="px-3 py-1.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                                title="Remove from wishlist"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: Notifications Center */}
                {activeUserTab === 'notifications' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-serif">Notifications & Alerts</h3>
                        <p className="text-xs text-gray-500">Live order delivery updates and promotional offers</p>
                      </div>
                      <button
                        onClick={() => toast.success('All notifications marked as read')}
                        className="text-xs text-[#ff2056] font-bold hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold">
                          ✓
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900">Order Delivered Successfully</h4>
                            <span className="text-[10px] text-gray-400">2 hours ago</span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            Your order #SH-87391 (Royal Silk Panjabi) has been delivered by courier. Enjoy your style!
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ff2056] text-white flex items-center justify-center shrink-0">
                          <Gift className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900">New Promo Voucher Available</h4>
                            <span className="text-[10px] text-gray-400">1 day ago</span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            Use code <code className="font-mono font-bold text-[#ff2056]">STYLE15</code> at checkout to get 15% OFF on your next purchase.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-slate-700 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900">Account Security Check</h4>
                            <span className="text-[10px] text-gray-400">3 days ago</span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            Successful login detected from Dhanmondi, Dhaka.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* TAB 5: Delivery Address */}
                {activeUserTab === 'address' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-serif">Delivery Addresses</h3>
                        <p className="text-xs text-gray-500">Manage shipping addresses for speedy checkout</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/20 space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#ff2056] text-white text-[10px] font-bold uppercase">
                            Primary Address
                          </span>
                          <MapPin className="w-4 h-4 text-[#ff2056]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{user?.name}</h4>
                          <p className="text-xs text-slate-600 mt-1">House #42, Road #7, Dhanmondi</p>
                          <p className="text-xs text-slate-600">Dhaka - 1209, Bangladesh</p>
                          <p className="text-xs text-gray-500 mt-2">Phone: +880 1712-345678</p>
                        </div>
                      </div>

                      <div
                        onClick={() => toast.info('Address creation modal coming in next checkout step!')}
                        className="p-5 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-[#ff2056] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold">
                          +
                        </div>
                        <span className="text-xs font-bold text-slate-700">Add New Delivery Address</span>
                        <p className="text-[11px] text-gray-400">Office or alternative location</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: Profile & Account Settings */}
                {activeUserTab === 'account' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="pb-3 border-b border-gray-100">
                      <h3 className="text-base font-bold text-slate-900 font-serif">Account Profile & Security</h3>
                      <p className="text-xs text-gray-500">Manage credentials and login information</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Personal Profile</h4>
                        <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-2.5">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Full Name:</span>
                            <span className="font-bold text-slate-800">{user?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Email:</span>
                            <span className="font-bold text-slate-800">{user?.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Login Method:</span>
                            <span className="font-bold text-[#ff2056] capitalize">{user?.authProvider || 'Local'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Account Status</h4>
                        <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-2.5">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Membership Tier:</span>
                            <span className="font-bold text-slate-800">Regular User</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Security Encryption:</span>
                            <span className="font-bold text-slate-800">256-bit SSL</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Account Verified:</span>
                            <span className="font-bold text-emerald-600">Yes (Active)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
