import React, { useState, useEffect } from 'react';
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
import AdminReviews from '../components/admin/AdminReviews';

// User Components
import UserSidebar from '../components/user/UserSidebar';
import UserProfile from '../components/user/UserProfile';
import {
  Package,
  Heart,
  User,
  MapPin,
  Gift,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Bell,
  Truck,
  Clock,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  X,
} from 'lucide-react';

const DashboardPage = () => {
  const { user, logout, isLoading } = useAuth();
  const { cart, wishlist, formatPrice, removeFromWishlist, addToCart, removeFromCart, updateQuantity, cartTotal, setIsCartOpen } = useShop();
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

  // Delete Confirmation Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    item: null,
    type: 'cart', // 'cart' | 'wishlist'
  });

  const promptRemoveCartItem = (item) => {
    setDeleteConfirmModal({
      isOpen: true,
      item,
      type: 'cart',
    });
  };

  const promptRemoveWishlistItem = (product) => {
    setDeleteConfirmModal({
      isOpen: true,
      item: product,
      type: 'wishlist',
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmModal.item) return;

    if (deleteConfirmModal.type === 'cart') {
      removeFromCart(deleteConfirmModal.item.id || deleteConfirmModal.item._id, deleteConfirmModal.item.selectedSize);
      toast.success('Item removed from cart');
    } else if (deleteConfirmModal.type === 'wishlist') {
      removeFromWishlist(deleteConfirmModal.item.id || deleteConfirmModal.item._id);
      toast.success('Item removed from wishlist');
    }

    setDeleteConfirmModal({ isOpen: false, item: null, type: 'cart' });
  };

  // Dynamic MongoDB User Orders State
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Dynamic MongoDB User Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationPage, setNotificationPage] = useState(1);
  const [totalNotificationPages, setTotalNotificationPages] = useState(1);
  const [totalNotificationsCount, setTotalNotificationsCount] = useState(0);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const [selectedNotificationModal, setSelectedNotificationModal] = useState(null);

  const fetchMyOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('stylehub_token') || user?.token;
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/orders/myorders', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMyOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchNotifications = async (page = 1) => {
    try {
      setNotificationsLoading(true);
      const token = localStorage.getItem('stylehub_token') || user?.token;
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/notifications?page=${page}&limit=10`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadNotificationsCount(data.unreadCount || 0);
        setNotificationPage(data.page || 1);
        setTotalNotificationPages(data.totalPages || 1);
        setTotalNotificationsCount(data.totalCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const token = localStorage.getItem('stylehub_token') || user?.token;
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadNotificationsCount(0);
        toast.success('All notifications marked as read!');
      }
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  const handleMarkSingleNotificationRead = async (id) => {
    try {
      const token = localStorage.getItem('stylehub_token') || user?.token;
      if (!token) return;

      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleOpenNotificationModal = (item) => {
    setSelectedNotificationModal(item);
    if (!item.isRead) {
      handleMarkSingleNotificationRead(item._id);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchMyOrders();
      fetchNotifications(1);
    }
  }, [user, activeTab]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

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

                {activeTab === 'reviews' && <AdminReviews />}

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
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* 4 Quick KPI Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <button
                        onClick={() => handleTabChange('orders')}
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
                        onClick={() => handleTabChange('wishlist')}
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
                        onClick={() => handleTabChange('notifications')}
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
                        onClick={() => handleTabChange('account')}
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
                            <p className="text-[11px] text-gray-500">
                              {myOrders.length > 0
                                ? `Order #${myOrders[0]._id ? 'SH-' + myOrders[0]._id.slice(-6).toUpperCase() : myOrders[0].id} • Placed on ${myOrders[0].createdAt ? new Date(myOrders[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recently'}`
                                : 'No active shipments'}
                            </p>
                          </div>
                        </div>
                        {myOrders.length > 0 && (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(myOrders[0].status)}`}>
                            {myOrders[0].status || 'Pending'}
                          </span>
                        )}
                      </div>

                      {myOrders.length > 0 ? (
                        /* Shipment Step Tracker */
                        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                          <div className="space-y-1">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center font-bold text-xs">✓</div>
                            <p className="font-bold text-slate-800 text-[11px]">Order Placed</p>
                            <span className="text-[10px] text-gray-400">
                              {myOrders[0].createdAt ? new Date(myOrders[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'Confirmed'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className={`w-8 h-8 rounded-full ${['processing', 'shipped', 'delivered'].includes(myOrders[0].status?.toLowerCase()) ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'} mx-auto flex items-center justify-center font-bold text-xs`}>
                              {['processing', 'shipped', 'delivered'].includes(myOrders[0].status?.toLowerCase()) ? '✓' : '2'}
                            </div>
                            <p className="font-bold text-slate-800 text-[11px]">Packed & QC</p>
                            <span className="text-[10px] text-gray-400">Processing</span>
                          </div>
                          <div className="space-y-1">
                            <div className={`w-8 h-8 rounded-full ${['shipped', 'delivered'].includes(myOrders[0].status?.toLowerCase()) ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'} mx-auto flex items-center justify-center font-bold text-xs`}>
                              {['shipped', 'delivered'].includes(myOrders[0].status?.toLowerCase()) ? '✓' : '3'}
                            </div>
                            <p className="font-bold text-slate-800 text-[11px]">Out for Delivery</p>
                            <span className="text-[10px] text-gray-400">Courier</span>
                          </div>
                          <div className="space-y-1">
                            <div className={`w-8 h-8 rounded-full ${myOrders[0].status?.toLowerCase() === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'} mx-auto flex items-center justify-center font-bold text-xs`}>
                              {myOrders[0].status?.toLowerCase() === 'delivered' ? '✓' : '4'}
                            </div>
                            <p className="font-bold text-emerald-600 text-[11px]">Delivered</p>
                            <span className="text-[10px] text-gray-400">Destination</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-xs text-gray-500">
                          Place an order to track live shipment status here.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 1: My Orders & Active Cart Collection */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    {/* Active Cart Items Section (Synced with MongoDB my-collections) */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#ff2056] flex items-center justify-center font-bold">
                            <ShoppingCart className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 font-serif">
                              My Shopping Cart Items ({cart.length})
                            </h3>
                            <p className="text-xs text-gray-500">
                              Items saved in your account cart collection ready for checkout
                            </p>
                          </div>
                        </div>
                        {cart.length > 0 && (
                          <span className="px-3 py-1 bg-rose-50 text-[#ff2056] border border-rose-200 text-xs font-bold rounded-full">
                            Subtotal: {formatPrice(cartTotal)}
                          </span>
                        )}
                      </div>

                      {cart.length === 0 ? (
                        <div className="text-center py-8 space-y-3 bg-stone-50/50 rounded-2xl border border-dashed border-gray-200">
                          <div className="w-12 h-12 bg-rose-50 text-[#ff2056] rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <h4 className="text-xs font-bold text-slate-800">Your cart collection is empty</h4>
                          <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                            Add your favorite fashion products to cart and they will be saved here in your account.
                          </p>
                          <Link
                            to="/shop"
                            className="inline-block px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl shadow-xs"
                          >
                            Browse Catalog
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {cart.map((item, idx) => (
                            <div
                              key={item._id || item.id || idx}
                              className="p-4 rounded-xl border border-gray-200/80 bg-slate-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-rose-200 transition-all shadow-2xs"
                            >
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={item.image}
                                  alt={item.name || item.title}
                                  className="w-16 h-20 rounded-lg object-cover border border-gray-200 shrink-0"
                                />
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name || item.title}</h4>
                                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                    <span>Size: <strong className="text-slate-800">{item.selectedSize || 'M'}</strong></span>
                                    {item.selectedColor && (
                                      <span>• Color: <strong className="text-slate-800">{item.selectedColor}</strong></span>
                                    )}
                                  </div>
                                  <p className="text-xs font-extrabold text-[#ff2056]">{formatPrice(item.price)}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                <div className="flex items-center border border-gray-200 rounded-lg bg-white text-xs">
                                  <button
                                    disabled={item.quantity <= 1}
                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                    className="px-2 py-1 hover:bg-gray-100 text-slate-600 rounded-l-lg cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 font-bold text-slate-900">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                    className="px-2 py-1 hover:bg-gray-100 text-slate-600 rounded-r-lg cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="text-right">
                                  <span className="text-xs font-extrabold text-slate-900 block">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                  <button
                                    onClick={() => promptRemoveCartItem(item)}
                                    className="text-[11px] text-rose-500 hover:underline font-medium flex items-center gap-1 cursor-pointer mt-0.5"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Remove</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                              Total Items: <strong className="text-slate-900">{cart.length}</strong> | Total Price: <strong className="text-[#ff2056]">{formatPrice(cartTotal)}</strong>
                            </span>
                            <button
                              onClick={() => setIsCartOpen(true)}
                              className="px-5 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <span>Checkout Now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order History & Tracking */}
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

                      {ordersLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-2">
                          <div className="w-7 h-7 border-2 border-rose-200 border-t-[#ff2056] rounded-full animate-spin" />
                          <p className="text-xs text-gray-500">Fetching order history...</p>
                        </div>
                      ) : myOrders.length === 0 ? (
                        <div className="text-center py-10 space-y-3 bg-stone-50/50 rounded-2xl border border-dashed border-gray-200">
                          <div className="w-12 h-12 bg-rose-50 text-[#ff2056] rounded-full flex items-center justify-center mx-auto">
                            <Package className="w-6 h-6" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-800">No Orders Placed Yet</h4>
                          <p className="text-xs text-gray-500 max-w-xs mx-auto">
                            Your order history is currently empty. Explore our catalog and place your first purchase!
                          </p>
                          <Link
                            to="/shop"
                            className="inline-block px-4 py-2 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                          >
                            Browse Catalog
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {myOrders.map((ord) => {
                            const shortId = ord._id ? `SH-${ord._id.slice(-6).toUpperCase()}` : ord.id || 'SH-ORDER';
                            const orderDate = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : (ord.date || 'Recent');
                            const itemsSummary = ord.orderItems && ord.orderItems.length > 0
                              ? ord.orderItems.map(item => `${item.name || item.title || 'Product'} (${item.selectedSize || 'Standard'}) x ${item.quantity || 1}`).join(', ')
                              : (ord.items || 'Order Items');

                            return (
                              <div
                                key={ord._id || ord.id}
                                className="p-4 rounded-xl border border-gray-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gray-300 transition-all"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 text-sm">{shortId}</span>
                                    <span className="text-xs text-gray-400">• {orderDate}</span>
                                  </div>
                                  <p className="text-xs text-slate-700 font-medium">{itemsSummary}</p>
                                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>
                                      {ord.status === 'Delivered'
                                        ? `Delivered on ${orderDate}`
                                        : `Status: ${ord.status || 'Pending'}`}
                                    </span>
                                  </p>
                                </div>

                                <div className="flex items-center gap-4">
                                  <span className="font-extrabold text-slate-900 text-sm">
                                    {typeof ord.totalPrice === 'number' ? formatPrice(ord.totalPrice) : (ord.total || '৳ 0')}
                                  </span>
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(ord.status)}`}>
                                    {ord.status || 'Pending'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: Saved Wishlist */}
                {activeTab === 'wishlist' && (
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
                                onClick={() => {
                                  addToCart(product, 1, 'M', '', { fromWishlist: true });
                                  toast.success(`${product.title || product.name || 'Product'} added to your cart! 🛒`);
                                }}
                                className="px-3 py-1.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => promptRemoveWishlistItem(product)}
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
                {activeTab === 'notifications' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                            Notifications & Activity Alerts
                          </h3>
                          {unreadNotificationsCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#ff2056] border border-rose-200 text-[11px] font-extrabold">
                              {unreadNotificationsCount} Unread
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Click on any alert below to view complete details in a modal and mark as read
                        </p>
                      </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {[
                        { id: 'all', label: 'All Alerts', count: notifications.length },
                        { id: 'cart', label: '🛒 Cart Additions', count: notifications.filter(n => n.type === 'cart_add' || n.type === 'wishlist_to_cart').length },
                        { id: 'wishlist', label: '💖 Wishlist', count: notifications.filter(n => n.type === 'wishlist_add').length },
                        { id: 'orders', label: '📦 Orders & Delivery', count: notifications.filter(n => n.type === 'order_status').length },
                        { id: 'system', label: '🎁 Promos & Security', count: notifications.filter(n => n.type === 'promo' || n.type === 'system').length },
                      ].map((pill) => (
                        <button
                          key={pill.id}
                          onClick={() => setNotificationFilter(pill.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${notificationFilter === pill.id
                              ? 'bg-[#ff2056] text-white shadow-sm shadow-rose-600/20'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                          <span>{pill.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${notificationFilter === pill.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                            {pill.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {notificationsLoading ? (
                      <div className="py-16 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-3 border-rose-200 border-t-[#ff2056] rounded-full animate-spin" />
                        <p className="text-xs font-semibold text-gray-500">Loading notifications...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center py-12 space-y-3 bg-stone-50/50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-rose-50 text-[#ff2056] rounded-full flex items-center justify-center mx-auto">
                          <Bell className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">No Notifications Yet</h4>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto">
                          When you add items to cart, save wishlist products, or track orders, notifications will appear here.
                        </p>
                        <Link
                          to="/shop"
                          className="inline-block px-4 py-2 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                        >
                          Explore Catalog
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications
                          .filter((item) => {
                            if (notificationFilter === 'cart') return item.type === 'cart_add' || item.type === 'wishlist_to_cart';
                            if (notificationFilter === 'wishlist') return item.type === 'wishlist_add';
                            if (notificationFilter === 'orders') return item.type === 'order_status';
                            if (notificationFilter === 'system') return item.type === 'promo' || item.type === 'system';
                            return true;
                          })
                          .map((item) => {
                            const isUnread = !item.isRead;
                            const createdDate = item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                              : 'Just now';

                            return (
                              <div
                                key={item._id}
                                onClick={() => handleOpenNotificationModal(item)}
                                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer relative ${isUnread
                                    ? 'bg-rose-50/40 border-rose-200/90 shadow-2xs hover:bg-rose-50/70'
                                    : 'bg-slate-50/50 border-gray-200/60 hover:bg-white hover:border-gray-300'
                                  }`}
                              >
                                {/* Left Avatar / Product Image */}
                                {item.productImage ? (
                                  <img
                                    src={item.productImage}
                                    alt={item.productName || item.title}
                                    className="w-12 h-14 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
                                    {item.type === 'order_status' ? (
                                      <Package className="w-5 h-5 text-rose-400" />
                                    ) : item.type === 'wishlist_add' ? (
                                      <Heart className="w-5 h-5 text-rose-400" />
                                    ) : (
                                      <ShoppingCart className="w-5 h-5 text-rose-400" />
                                    )}
                                  </div>
                                )}

                                {/* Notification Content Body */}
                                <div className="flex-1 space-y-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className={`text-xs sm:text-sm leading-snug ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-500'
                                      }`}>
                                      {item.title}
                                    </h4>
                                    <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                                      {createdDate}
                                    </span>
                                  </div>

                                  <p className={`text-xs line-clamp-2 leading-relaxed ${isUnread ? 'text-slate-700' : 'text-slate-400'
                                    }`}>
                                    {item.message}
                                  </p>

                                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                                    {item.price > 0 && (
                                      <span className={`font-extrabold px-2 py-0.5 rounded-md border ${isUnread ? 'text-[#ff2056] bg-rose-50 border-rose-100' : 'text-slate-500 bg-slate-100 border-gray-200'
                                        }`}>
                                        {formatPrice(item.price)}
                                      </span>
                                    )}

                                    {item.orderId && (
                                      <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                                        Order: #{item.orderId}
                                      </span>
                                    )}

                                    <span className="text-gray-400 capitalize">
                                      • {item.type.replace(/_/g, ' ')}
                                    </span>
                                  </div>
                                </div>

                                {/* Right Unread Indicator Dot */}
                                {isUnread && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff2056] shrink-0 mt-1 shadow-xs animate-pulse" title="Unread notification" />
                                )}
                              </div>
                            );
                          })}

                        {/* Pagination Bar (10 notifications per page) */}
                        {totalNotificationPages > 1 && (
                          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                              Showing page <strong className="text-slate-900">{notificationPage}</strong> of{' '}
                              <strong className="text-slate-900">{totalNotificationPages}</strong> ({totalNotificationsCount} total alerts)
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                disabled={notificationPage <= 1}
                                onClick={() => fetchNotifications(notificationPage - 1)}
                                className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                              >
                                Previous
                              </button>
                              <button
                                disabled={notificationPage >= totalNotificationPages}
                                onClick={() => fetchNotifications(notificationPage + 1)}
                                className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                              >
                                Next Page
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}




                {/* TAB 6: Profile & Account Settings */}
                {activeTab === 'account' && <UserProfile />}
              </div>
            </main>
          </>
        )}
      </div>
      {/* Remove Item Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && deleteConfirmModal.item && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-5 text-center relative animate-in zoom-in-95 duration-200">
            {/* Top Close Icon */}
            <button
              onClick={() => setDeleteConfirmModal({ isOpen: false, item: null, type: 'cart' })}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Trash Warning Icon */}
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#ff2056] border border-rose-100 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>

            {/* Modal Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Remove Item from {deleteConfirmModal.type === 'cart' ? 'Cart' : 'Wishlist'}?
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Are you sure you want to remove this item from your account collection?
              </p>
            </div>

            {/* Target Item Mini Preview Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-left">
              <img
                src={deleteConfirmModal.item.image}
                alt={deleteConfirmModal.item.name || deleteConfirmModal.item.title}
                className="w-14 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {deleteConfirmModal.item.name || deleteConfirmModal.item.title}
                </h4>
                {deleteConfirmModal.type === 'cart' && (
                  <div className="text-[11px] text-gray-500">
                    <span>Size: <strong className="text-slate-800">{deleteConfirmModal.item.selectedSize || 'M'}</strong></span>
                    {deleteConfirmModal.item.selectedColor && (
                      <span> • Color: <strong className="text-slate-800">{deleteConfirmModal.item.selectedColor}</strong></span>
                    )}
                  </div>
                )}
                <p className="text-xs font-extrabold text-[#ff2056]">
                  {formatPrice(deleteConfirmModal.item.price)}
                </p>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmModal({ isOpen: false, item: null, type: 'cart' })}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-slate-700 font-bold text-xs hover:bg-gray-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#ff2056] hover:bg-[#d6103e] text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Notification Details Modal */}
      {selectedNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative space-y-5 animate-scaleUp">
            {/* Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-[#ff2056] flex items-center justify-center font-bold text-xs">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono">
                  Notification Alert
                </span>
              </div>
              <button
                onClick={() => setSelectedNotificationModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Details Body */}
            <div className="space-y-4">
              {/* Product Image Avatar + Header Title */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                {selectedNotificationModal.productImage ? (
                  <img
                    src={selectedNotificationModal.productImage}
                    alt={selectedNotificationModal.productName || 'Product'}
                    className="w-16 h-20 rounded-xl object-cover border border-gray-200 shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shrink-0 shadow-md">
                    {selectedNotificationModal.type === 'order_status' ? (
                      <Package className="w-8 h-8 text-rose-400" />
                    ) : selectedNotificationModal.type === 'wishlist_add' ? (
                      <Heart className="w-8 h-8 text-rose-400" />
                    ) : (
                      <ShoppingCart className="w-8 h-8 text-rose-400" />
                    )}
                  </div>
                )}

                <div className="space-y-1 flex-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {selectedNotificationModal.title}
                  </h3>
                  {selectedNotificationModal.price > 0 && (
                    <p className="text-sm font-extrabold text-[#ff2056]">
                      Price: {formatPrice(selectedNotificationModal.price)}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 font-medium">
                    {selectedNotificationModal.createdAt
                      ? new Date(selectedNotificationModal.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                      : 'Recent'}
                  </p>
                </div>
              </div>

              {/* Detailed Message Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Message Details:
                </p>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {selectedNotificationModal.message}
                </p>
              </div>

              {/* Info Grid (Order ID, Category/Type) */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Alert Category</span>
                  <p className="font-bold text-slate-800 capitalize">
                    {selectedNotificationModal.type?.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Reference Code</span>
                  <p className="font-mono font-bold text-slate-800">
                    {selectedNotificationModal.orderId ? `#${selectedNotificationModal.orderId}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedNotificationModal(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer w-full text-center"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
