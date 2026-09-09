import { API_BASE_URL } from '../config/api';
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
import AdminSettings from '../components/admin/AdminSettings';
import AdminAnalytics from '../components/admin/AdminAnalytics';

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
  const {
    cart,
    wishlist,
    formatPrice,
    removeFromWishlist,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    setIsCartOpen,
    categories,
    brands,
    tags,
    attributes,
    addCategory,
    deleteCategory,
    addBrand,
    deleteBrand,
    addTag,
    deleteTag,
    addAttribute,
    deleteAttribute,
  } = useShop();
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

  // Admin Management Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState({ name: '', description: '', slug: '', image: '' });
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandInput, setBrandInput] = useState({ name: '', status: 'Active', description: '', logo: '' });
  const [isBrandSubmitting, setIsBrandSubmitting] = useState(false);

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState({ name: '' });
  const [isTagSubmitting, setIsTagSubmitting] = useState(false);

  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [attributeInput, setAttributeInput] = useState({ name: '', type: 'Size', values: '' });
  const [isAttributeSubmitting, setIsAttributeSubmitting] = useState(false);

  // Submit Handlers for Modals
  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryInput.name.trim()) {
      toast.warning('Please enter category name');
      return;
    }
    setIsCategorySubmitting(true);
    const res = await addCategory(categoryInput);
    setIsCategorySubmitting(false);
    if (res.success) {
      toast.success(`🎉 Category "${res.category.name}" added successfully!`);
      setIsCategoryModalOpen(false);
      setCategoryInput({ name: '', description: '', slug: '', image: '' });
    } else {
      toast.error(res.message || 'Failed to add category');
    }
  };

  const handleCreateBrandSubmit = async (e) => {
    e.preventDefault();
    if (!brandInput.name.trim()) {
      toast.warning('Please enter brand name');
      return;
    }
    setIsBrandSubmitting(true);
    const res = await addBrand(brandInput);
    setIsBrandSubmitting(false);
    if (res.success) {
      toast.success(`🎉 Brand "${res.brand.name}" added successfully!`);
      setIsBrandModalOpen(false);
      setBrandInput({ name: '', status: 'Active', description: '', logo: '' });
    } else {
      toast.error(res.message || 'Failed to add brand');
    }
  };

  const handleCreateTagSubmit = async (e) => {
    e.preventDefault();
    if (!tagInput.name.trim()) {
      toast.warning('Please enter tag name');
      return;
    }
    setIsTagSubmitting(true);
    const res = await addTag(tagInput);
    setIsTagSubmitting(false);
    if (res.success) {
      toast.success(`🎉 Tag "#${res.tag.name}" added successfully!`);
      setIsTagModalOpen(false);
      setTagInput({ name: '' });
    } else {
      toast.error(res.message || 'Failed to add tag');
    }
  };

  const handleCreateAttributeSubmit = async (e) => {
    e.preventDefault();
    if (!attributeInput.name.trim()) {
      toast.warning('Please enter attribute name');
      return;
    }
    setIsAttributeSubmitting(true);
    const res = await addAttribute(attributeInput);
    setIsAttributeSubmitting(false);
    if (res.success) {
      toast.success(`🎉 Attribute "${res.attribute.name}" added successfully!`);
      setIsAttributeModalOpen(false);
      setAttributeInput({ name: '', type: 'Size', values: '' });
    } else {
      toast.error(res.message || 'Failed to add attribute');
    }
  };

  // Unified Delete Confirmation Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    item: null,
    type: 'cart', // 'cart' | 'wishlist' | 'Category' | 'Brand' | 'Tag' | 'Attribute'
    name: '',
    isDeleting: false,
  });

  const promptRemoveCartItem = (item) => {
    setDeleteConfirmModal({
      isOpen: true,
      item,
      type: 'cart',
      name: item.name || item.title || 'Cart Item',
      isDeleting: false,
    });
  };

  const promptRemoveWishlistItem = (product) => {
    setDeleteConfirmModal({
      isOpen: true,
      item: product,
      type: 'wishlist',
      name: product.name || product.title || 'Wishlist Item',
      isDeleting: false,
    });
  };

  const promptAdminDelete = (type, item) => {
    setDeleteConfirmModal({
      isOpen: true,
      item,
      type,
      name: item.name || item.title || 'Item',
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmModal.item) return;
    setDeleteConfirmModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      const type = deleteConfirmModal.type;
      const targetItem = deleteConfirmModal.item;
      const targetId = targetItem._id || targetItem.id;

      if (type === 'cart') {
        removeFromCart(targetItem, targetItem.selectedSize);
        toast.success('Item removed from cart');
      } else if (type === 'wishlist') {
        removeFromWishlist(targetItem);
        toast.success('Item removed from wishlist');
      } else if (type === 'Category') {
        await deleteCategory(targetId);
        toast.info(`Category "${deleteConfirmModal.name}" deleted.`);
      } else if (type === 'Brand') {
        await deleteBrand(targetId);
        toast.info(`Brand "${deleteConfirmModal.name}" deleted.`);
      } else if (type === 'Tag') {
        await deleteTag(targetId);
        toast.info(`Tag "#${deleteConfirmModal.name}" deleted.`);
      } else if (type === 'Attribute') {
        await deleteAttribute(targetId);
        toast.info(`Attribute "${deleteConfirmModal.name}" deleted.`);
      }
    } catch (err) {
      toast.error('Failed to delete item');
    } finally {
      setDeleteConfirmModal({ isOpen: false, item: null, type: 'cart', name: '', isDeleting: false });
    }
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
  const [notificationCounts, setNotificationCounts] = useState({
    all: 0,
    unread: 0,
    cart: 0,
    wishlist: 0,
    orders: 0,
  });
  const [selectedNotificationModal, setSelectedNotificationModal] = useState(null);

  const fetchMyOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token') || user?.token;
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/orders/myorders`, {
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

  const fetchNotifications = async (page = 1, filterType = notificationFilter) => {
    try {
      setNotificationsLoading(true);
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token') || user?.token;
      if (!token) return;

      const queryParam = filterType && filterType !== 'all' ? `&type=${filterType}` : '';
      const res = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=10${queryParam}`, {
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
        if (data.counts) {
          setNotificationCounts(data.counts);
        }
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleFilterChange = (filterId) => {
    setNotificationFilter(filterId);
    setNotificationPage(1);
    fetchNotifications(1, filterId);
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token') || user?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
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
        setNotificationCounts((prev) => ({ ...prev, unread: 0 }));
        window.dispatchEvent(new CustomEvent('stylehub_notifications_updated'));
        toast.success('All notifications marked as read!');
      }
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  const handleMarkSingleNotificationRead = async (id) => {
    try {
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token') || user?.token;
      if (!token) return;

      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
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
      setNotificationCounts((prev) => ({
        ...prev,
        unread: Math.max(0, (prev.unread || 1) - 1),
      }));
      window.dispatchEvent(new CustomEvent('stylehub_notifications_updated'));
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
    if (user) {
      if (user.role !== 'admin') {
        fetchMyOrders();
      }
      fetchNotifications(1);
    }
  }, [user, activeTab]);

  useEffect(() => {
    const handleSync = () => {
      fetchNotifications(notificationPage, notificationFilter);
    };
    window.addEventListener('stylehub_notifications_updated', handleSync);
    return () => {
      window.removeEventListener('stylehub_notifications_updated', handleSync);
    };
  }, [notificationPage, notificationFilter]);

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
              unreadNotifications={unreadNotificationsCount}
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
                        <p className="text-xs text-gray-500">Manage registered apparel and luxury store brands in database</p>
                      </div>
                      <button
                        onClick={() => setIsBrandModalOpen(true)}
                        className="px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+ Add New Brand</span>
                      </button>
                    </div>
                    {brands.length === 0 ? (
                      <div className="text-center py-8 text-xs text-gray-400">No brands registered yet. Click + Add New Brand to create one.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {brands.map((brand, idx) => (
                          <div key={brand._id || brand.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-all relative group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">{brand.status || 'Active'}</span>
                              <button
                                onClick={() => promptAdminDelete('Brand', brand)}
                                className="text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                                title="Delete Brand"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mt-3">{brand.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{brand.description || `${brand.itemCount || 0} Products`}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Product Categories</h3>
                        <p className="text-xs text-gray-500">Organize clothing, footwear, and accessory hierarchies in MongoDB</p>
                      </div>
                      <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+ Create Category</span>
                      </button>
                    </div>
                    {categories.length === 0 ? (
                      <div className="text-center py-8 text-xs text-gray-400">No categories found in database. Click + Create Category to add.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {categories.map((cat, idx) => (
                          <div key={cat._id || cat.id || idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between group hover:border-rose-200 transition-all">
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{cat.name}</h4>
                              <span className="text-[11px] text-gray-500">{cat.description || `${cat.itemCount || 0} Items`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-mono">{cat.slug || `/category/${cat.name.toLowerCase()}`}</span>
                              <button
                                onClick={() => promptAdminDelete('Category', cat)}
                                className="text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'tags' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Product Tags</h3>
                        <p className="text-xs text-gray-500">Filter tags for marketing badging and search indexing</p>
                      </div>
                      <button
                        onClick={() => setIsTagModalOpen(true)}
                        className="px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+ Add Tag</span>
                      </button>
                    </div>
                    {tags.length === 0 ? (
                      <div className="text-center py-8 text-xs text-gray-400">No tags stored. Click + Add Tag to create one.</div>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {tags.map((tag, idx) => (
                          <span key={tag._id || tag.id || idx} className="px-3 py-1.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 hover:border-[#ff2056] hover:text-[#ff2056] transition-colors group">
                            <span>#{tag.name}</span>
                            <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-200">{tag.count || 0}</span>
                            <button
                              onClick={() => promptAdminDelete('Tag', tag)}
                              className="text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer"
                              title="Delete Tag"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'attributes' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Product Attributes & Variants</h3>
                        <p className="text-xs text-gray-500">Manage size scales, color swatches, and material options in database</p>
                      </div>
                      <button
                        onClick={() => setIsAttributeModalOpen(true)}
                        className="px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+ Add Attribute</span>
                      </button>
                    </div>
                    {attributes.length === 0 ? (
                      <div className="text-center py-8 text-xs text-gray-400">No attributes stored. Click + Add Attribute to create one.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {attributes.map((attr, idx) => (
                          <div key={attr._id || attr.id || idx} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-slate-900 text-sm">{attr.name} ({attr.type})</h4>
                              <button
                                onClick={() => promptAdminDelete('Attribute', attr)}
                                className="text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                                title="Delete Attribute"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(attr.values) && attr.values.length > 0 ? (
                                attr.values.map((v, i) => (
                                  <span key={i} className="px-2.5 py-1 bg-white border border-gray-300 text-xs font-bold rounded-md text-slate-700">{v}</span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">No values configured</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && <AdminReviews />}

                {activeTab === 'orders' && <AdminOrders />}

                {activeTab === 'customers' && <AdminCustomers currentUser={user} />}

                {activeTab === 'notifications' && (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                            Store Activity & Order Notifications
                          </h3>
                          {unreadNotificationsCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#ff2056] border border-rose-200 text-[11px] font-extrabold">
                              {unreadNotificationsCount} Unread
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Real-time alerts for newly placed customer orders, item requests, and store events
                        </p>
                      </div>

                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={handleMarkAllNotificationsRead}
                          className="px-3.5 py-1.5 bg-[#ff2056] text-white rounded-xl text-xs font-bold hover:bg-[#d6103e] transition-all cursor-pointer self-start sm:self-auto"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notification Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {[
                        { id: 'all', label: 'All Alerts', count: notificationCounts.all || 0 },
                        { id: 'unread', label: '🔔 Unread SMS', count: notificationCounts.unread || 0 },
                      ].map((pill) => (
                        <button
                          key={pill.id}
                          onClick={() => handleFilterChange(pill.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            notificationFilter === pill.id
                              ? 'bg-[#ff2056] text-white shadow-sm shadow-rose-600/20'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>{pill.label}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              notificationFilter === pill.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
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
                        <h4 className="text-sm font-bold text-slate-800">No Notifications Found</h4>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto">
                          No alerts matching this filter. New activity notifications will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((item) => {
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
                              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer relative ${
                                isUnread
                                  ? 'bg-rose-50/40 border-rose-200/90 shadow-2xs hover:bg-rose-50/70'
                                  : 'bg-slate-50/50 border-gray-200/60 hover:bg-white hover:border-gray-300'
                              }`}
                            >
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.productName || item.title}
                                  className="w-12 h-14 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
                                  <Package className="w-5 h-5 text-rose-400" />
                                </div>
                              )}

                              <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4
                                    className={`text-xs sm:text-sm leading-snug ${
                                      isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-500'
                                    }`}
                                  >
                                    {item.title}
                                  </h4>
                                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                                    {createdDate}
                                  </span>
                                </div>

                                <p
                                  className={`text-xs line-clamp-2 leading-relaxed ${
                                    isUnread ? 'text-slate-700' : 'text-slate-400'
                                  }`}
                                >
                                  {item.message}
                                </p>

                                <div className="flex items-center gap-3 pt-1 text-[11px]">
                                  {item.price > 0 && (
                                    <span
                                      className={`font-extrabold px-2 py-0.5 rounded-md border ${
                                        isUnread
                                          ? 'text-[#ff2056] bg-rose-50 border-rose-100'
                                          : 'text-slate-500 bg-slate-100 border-gray-200'
                                      }`}
                                    >
                                      {formatPrice(item.price)}
                                    </span>
                                  )}
                                  {item.orderId && (
                                    <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                                      Order: #{item.orderId}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {isUnread && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full bg-[#ff2056] shrink-0 mt-1 shadow-xs animate-pulse"
                                  title="Unread notification"
                                />
                              )}
                            </div>
                          );
                        })}

                        {/* Admin Pagination Bar */}
                        {totalNotificationPages > 1 && (
                          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                              Showing page <strong className="text-slate-900">{notificationPage}</strong> of{' '}
                              <strong className="text-slate-900">{totalNotificationPages}</strong> ({totalNotificationsCount} total alerts)
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                disabled={notificationPage <= 1}
                                onClick={() => fetchNotifications(notificationPage - 1, notificationFilter)}
                                className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                              >
                                Previous
                              </button>
                              <button
                                disabled={notificationPage >= totalNotificationPages}
                                onClick={() => fetchNotifications(notificationPage + 1, notificationFilter)}
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

                {activeTab === 'analytics' && (
                  <AdminAnalytics setActiveTab={handleTabChange} />
                )}

                {activeTab === 'settings' && <AdminSettings />}
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
              unreadNotifications={unreadNotificationsCount}
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
                    {(() => {
                      const deliveredOrdersCount = myOrders.filter(
                        (o) => o.status?.toLowerCase() === 'delivered'
                      ).length;
                      const primaryUserAddress =
                        [user?.address?.street, user?.address?.thana, user?.address?.district || user?.address?.city]
                          .filter(Boolean)
                          .join(', ') ||
                        (user?.address?.city ? `${user.address.city}, Bangladesh` : '') ||
                        (myOrders[0]?.shippingAddress
                          ? [
                              myOrders[0].shippingAddress.address,
                              myOrders[0].shippingAddress.city || myOrders[0].shippingAddress.district,
                            ]
                              .filter(Boolean)
                              .join(', ')
                          : '') ||
                        'No address saved';

                      return (
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
                            {deliveredOrdersCount > 0 ? (
                              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 truncate">
                                <CheckCircle2 className="w-3 h-3 shrink-0" /> {deliveredOrdersCount} Delivered recently
                              </span>
                            ) : myOrders.length > 0 ? (
                              <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-1 truncate">
                                <Clock className="w-3 h-3 shrink-0" /> {myOrders[0]?.status || 'Processing'} order
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium mt-1 block truncate">
                                No orders placed yet
                              </span>
                            )}
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
                            <span className="text-[10px] text-gray-500 font-medium mt-1 block truncate">
                              {wishlist.length > 0 ? `${wishlist.length} item${wishlist.length > 1 ? 's' : ''} in wishlist` : 'In your fashion wishlist'}
                            </span>
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
                            <h4 className="text-2xl font-black text-slate-900 mt-2">{unreadNotificationsCount} Unread</h4>
                            <span className="text-[10px] text-amber-600 font-bold mt-1 block truncate">
                              {unreadNotificationsCount > 0 ? 'Order & delivery updates' : 'All caught up'}
                            </span>
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
                            <h4 className="text-sm font-bold text-slate-900 mt-2 truncate" title={primaryUserAddress}>
                              {primaryUserAddress}
                            </h4>
                            <span className="text-[10px] text-blue-600 font-bold mt-1 block truncate">
                              {user?.address?.city || user?.address?.district || myOrders.length > 0 ? '1 Saved location' : 'Add in settings'}
                            </span>
                          </button>
                        </div>
                      );
                    })()}

                    {/* Active Order Live Shipment Progress Widget */}
                    {(() => {
                      const activeOrder = myOrders[0];
                      if (!activeOrder) {
                        return (
                          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#ff2056] flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
                              <Truck className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">No Active Shipments</h4>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto">
                              Once you place an order, live tracking stages, fulfillment steps, and courier details will appear here automatically.
                            </p>
                            <button
                              onClick={() => navigate('/shop')}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff2056] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#d6103e] transition-all cursor-pointer"
                            >
                              <span>Explore Shop</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      const shortId = activeOrder._id ? `SH-${activeOrder._id.slice(-6).toUpperCase()}` : activeOrder.id || 'SH-ORDER';
                      const orderDate = activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recently';
                      const orderStatus = (activeOrder.status || 'Pending').toLowerCase();

                      // Calculate current step index (0: Placed, 1: Packed/QC, 2: Shipped/Transit, 3: Delivered)
                      let currentStepIndex = 0;
                      if (orderStatus === 'processing') currentStepIndex = 1;
                      else if (orderStatus === 'shipped') currentStepIndex = 2;
                      else if (orderStatus === 'delivered') currentStepIndex = 3;
                      else if (orderStatus === 'cancelled') currentStepIndex = -1;

                      // Progress percentage for background bar (0%, 33.33%, 66.66%, 100%)
                      const progressPercentage = currentStepIndex < 0 ? 0 : Math.min(100, Math.round((currentStepIndex / 3) * 100));

                      const firstItem = activeOrder.orderItems && activeOrder.orderItems.length > 0 ? activeOrder.orderItems[0] : null;
                      const firstItemImage = firstItem?.image || activeOrder.image || null;
                      const additionalItemsCount = activeOrder.orderItems && activeOrder.orderItems.length > 1 ? activeOrder.orderItems.length - 1 : 0;
                      const orderTotalFormatted = typeof activeOrder.totalPrice === 'number' ? formatPrice(activeOrder.totalPrice) : (activeOrder.total || '৳ 0');
                      const shippingDestination = [activeOrder.shippingAddress?.address, activeOrder.shippingAddress?.city || activeOrder.shippingAddress?.district].filter(Boolean).join(', ') || 'Home Address';

                      const steps = [
                        {
                          title: 'Order Placed',
                          subtitle: activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'Confirmed',
                          desc: 'Payment confirmed & order received',
                          icon: ShoppingBag,
                        },
                        {
                          title: 'Quality Check & Packed',
                          subtitle: currentStepIndex >= 1 ? 'Quality Verified' : 'In Fulfillment',
                          desc: 'Hand-inspected & securely packed',
                          icon: Sparkles,
                        },
                        {
                          title: 'Out for Delivery',
                          subtitle: currentStepIndex >= 2 ? 'In Transit' : 'Courier Hub',
                          desc: 'Handed to express logistics rider',
                          icon: Truck,
                        },
                        {
                          title: 'Delivered',
                          subtitle: currentStepIndex >= 3 ? 'Completed' : 'Destination',
                          desc: 'Safely handed over to you',
                          icon: CheckCircle2,
                        },
                      ];

                      return (
                        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-7 shadow-xs space-y-5 overflow-hidden relative">
                          {/* Top Header Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                            <div className="flex items-start sm:items-center gap-3.5">
                              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#ff2056] border border-rose-100 flex items-center justify-center shrink-0 shadow-xs">
                                <Truck className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-base font-bold text-slate-900 font-serif">Recent Shipment Tracking</h3>
                                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                    {shortId}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                                  <span>Placed on <strong className="text-slate-700">{orderDate}</strong></span>
                                  <span>•</span>
                                  <span>Payment: <strong className="text-slate-700">{activeOrder.paymentMethod || 'Cash on Delivery'}</strong></span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border shadow-xs ${getStatusBadge(activeOrder.status)}`}>
                                {activeOrder.status || 'Pending'}
                              </span>
                              <button
                                onClick={() => handleTabChange('orders')}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>All Orders</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Product Preview & Destination Banner */}
                          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {firstItemImage ? (
                                <div className="relative shrink-0">
                                  <img
                                    src={firstItemImage}
                                    alt={firstItem?.name || 'Product'}
                                    className="w-13 h-13 rounded-xl object-cover border border-gray-200 bg-white shadow-2xs"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80';
                                    }}
                                  />
                                  {additionalItemsCount > 0 && (
                                    <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-white leading-none shadow-xs">
                                      +{additionalItemsCount}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="w-13 h-13 rounded-xl bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0 text-slate-400">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0 space-y-0.5">
                                <h4 className="text-xs font-bold text-slate-900 truncate">
                                  {firstItem ? `${firstItem.name || firstItem.title} (${firstItem.selectedSize || 'M'}) x ${firstItem.quantity || 1}` : 'StyleHub Fashion Order'}
                                </h4>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                  <span className="truncate">Shipping to: <strong className="text-slate-700">{shippingDestination}</strong></span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end md:self-auto border-t md:border-t-0 border-gray-200 pt-2 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                              <div className="text-right">
                                <span className="text-[10px] text-gray-400 block font-medium">Order Value</span>
                                <span className="text-xs font-black text-slate-900">{orderTotalFormatted}</span>
                              </div>
                              <button
                                onClick={() => handleTabChange('orders')}
                                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                              >
                                View Order
                              </button>
                            </div>
                          </div>

                          {/* Progress Stepper Timeline with Connecting Gradient Bar */}
                          <div className="pt-3 pb-2 px-1">
                            <div className="relative">
                              {/* Background Rail Line */}
                              <div className="absolute top-5 left-10 right-10 h-1 bg-slate-200 rounded-full -translate-y-1/2 z-0 hidden sm:block" />

                              {/* Active Progress Fill Line */}
                              {currentStepIndex >= 0 && (
                                <div
                                  className="absolute top-5 left-10 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full -translate-y-1/2 z-0 transition-all duration-700 hidden sm:block shadow-xs shadow-emerald-500/30"
                                  style={{
                                    width: `calc(${progressPercentage}% - 20px)`,
                                    maxWidth: 'calc(100% - 80px)',
                                  }}
                                />
                              )}

                              {/* 4 Step Nodes */}
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
                                {steps.map((step, idx) => {
                                  const StepIcon = step.icon;
                                  const isCompleted = currentStepIndex > idx || (currentStepIndex === 3 && idx === 3);
                                  const isCurrent = currentStepIndex === idx && currentStepIndex !== 3;

                                  return (
                                    <div
                                      key={idx}
                                      className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2"
                                    >
                                      {/* Node Icon Circle */}
                                      <div
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                          isCompleted
                                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50'
                                            : isCurrent
                                            ? 'bg-[#ff2056] text-white shadow-md shadow-rose-500/20 ring-4 ring-rose-100 animate-pulse'
                                            : 'bg-white border-2 border-slate-200 text-slate-400'
                                        }`}
                                      >
                                        {isCompleted ? (
                                          <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                          <StepIcon className="w-4 h-4" />
                                        )}
                                      </div>

                                      {/* Step Info */}
                                      <div className="space-y-0.5 min-w-0">
                                        <p
                                          className={`text-xs font-bold leading-tight ${
                                            isCompleted
                                              ? 'text-emerald-700'
                                              : isCurrent
                                              ? 'text-slate-900 font-extrabold'
                                              : 'text-slate-400'
                                          }`}
                                        >
                                          {step.title}
                                        </p>
                                        <p className="text-[11px] font-semibold text-slate-600">
                                          {step.subtitle}
                                        </p>
                                        <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">
                                          {step.desc}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Dynamic ETA & Delivery Status Notice */}
                          <div className="p-3 bg-gradient-to-r from-amber-50/70 via-rose-50/40 to-slate-50 rounded-xl border border-amber-200/60 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Clock className="w-4 h-4 text-[#ff2056] shrink-0" />
                              <span className="font-medium text-[11px] sm:text-xs">
                                {orderStatus === 'delivered' ? (
                                  <>
                                    <strong className="text-emerald-700 font-bold">Delivered!</strong> Your package has been handed over successfully.
                                  </>
                                ) : orderStatus === 'shipped' ? (
                                  <>
                                    <strong className="text-blue-700 font-bold">On the Way:</strong> Expected delivery within 24 to 48 hours via express courier.
                                  </>
                                ) : orderStatus === 'processing' ? (
                                  <>
                                    <strong className="text-amber-700 font-bold">Processing:</strong> Package is undergoing quality check and dispatch preparation.
                                  </>
                                ) : (
                                  <>
                                    <strong className="text-slate-800 font-bold">Order Confirmed:</strong> Our fulfillment team is preparing your package.
                                  </>
                                )}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 hidden sm:inline-block shadow-2xs">
                              Live Courier Sync
                            </span>
                          </div>
                        </div>
                      );
                    })()}
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
                              onClick={() => navigate('/checkout')}
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
                            const firstItemImage = ord.orderItems && ord.orderItems.length > 0
                              ? ord.orderItems[0].image
                              : (ord.image || null);
                            const additionalCount = ord.orderItems && ord.orderItems.length > 1
                              ? ord.orderItems.length - 1
                              : 0;

                            return (
                              <div
                                key={ord._id || ord.id}
                                className="p-4 rounded-xl border border-gray-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gray-300 transition-all"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {firstItemImage ? (
                                    <div className="relative shrink-0">
                                      <img
                                        src={firstItemImage}
                                        alt={ord.orderItems?.[0]?.name || 'Product'}
                                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-white shadow-2xs"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80';
                                        }}
                                      />
                                      {additionalCount > 0 && (
                                        <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-white leading-none shadow-xs">
                                          +{additionalCount}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0 text-slate-400">
                                      <Package className="w-5 h-5" />
                                    </div>
                                  )}

                                  <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900 text-sm">{shortId}</span>
                                      <span className="text-xs text-gray-400">• {orderDate}</span>
                                    </div>
                                    <p className="text-xs text-slate-700 font-medium truncate">{itemsSummary}</p>
                                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      <span>
                                        {ord.status === 'Delivered'
                                          ? `Delivered on ${orderDate}`
                                          : `Status: ${ord.status || 'Pending'}`}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
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

                    {/* Notification Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {[
                        { id: 'all', label: 'All Alerts', count: notificationCounts.all || 0 },
                        { id: 'unread', label: '🔔 Unread SMS', count: notificationCounts.unread || 0 },
                      ].map((pill) => (
                        <button
                          key={pill.id}
                          onClick={() => handleFilterChange(pill.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            notificationFilter === pill.id
                              ? 'bg-[#ff2056] text-white shadow-sm shadow-rose-600/20'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>{pill.label}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              notificationFilter === pill.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
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
                        <h4 className="text-sm font-bold text-slate-800">No Notifications Found</h4>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto">
                          No alerts matching this filter. When you add items to cart, save wishlist products, or track orders, notifications will appear here.
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
                        {notifications.map((item) => {
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
                              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer relative ${
                                isUnread
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
                                  <h4
                                    className={`text-xs sm:text-sm leading-snug ${
                                      isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-500'
                                    }`}
                                  >
                                    {item.title}
                                  </h4>
                                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                                    {createdDate}
                                  </span>
                                </div>

                                <p
                                  className={`text-xs line-clamp-2 leading-relaxed ${
                                    isUnread ? 'text-slate-700' : 'text-slate-400'
                                  }`}
                                >
                                  {item.message}
                                </p>

                                <div className="flex items-center gap-3 pt-1 text-[11px]">
                                  {item.price > 0 && (
                                    <span
                                      className={`font-extrabold px-2 py-0.5 rounded-md border ${
                                        isUnread
                                          ? 'text-[#ff2056] bg-rose-50 border-rose-100'
                                          : 'text-slate-500 bg-slate-100 border-gray-200'
                                      }`}
                                    >
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
                                <span
                                  className="w-2.5 h-2.5 rounded-full bg-[#ff2056] shrink-0 mt-1 shadow-xs animate-pulse"
                                  title="Unread notification"
                                />
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
                                onClick={() => fetchNotifications(notificationPage - 1, notificationFilter)}
                                className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                              >
                                Previous
                              </button>
                              <button
                                disabled={notificationPage >= totalNotificationPages}
                                onClick={() => fetchNotifications(notificationPage + 1, notificationFilter)}
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

      {/* 1. Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">Add New Category</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-slate-900 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Designer Blazers"
                  value={categoryInput.name}
                  onChange={(e) => setCategoryInput({ ...categoryInput, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Description / Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Formal suits and executive wear"
                  value={categoryInput.description}
                  onChange={(e) => setCategoryInput({ ...categoryInput, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Custom URL Slug (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /category/blazers"
                  value={categoryInput.slug}
                  onChange={(e) => setCategoryInput({ ...categoryInput, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCategorySubmitting}
                  className="px-5 py-2 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isCategorySubmitting ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">Add New Brand</h3>
              <button
                onClick={() => setIsBrandModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-slate-900 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBrandSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Luxury Heritage"
                  value={brandInput.name}
                  onChange={(e) => setBrandInput({ ...brandInput, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Brand Status</label>
                <select
                  value={brandInput.status}
                  onChange={(e) => setBrandInput({ ...brandInput, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                >
                  <option value="Active">Active</option>
                  <option value="Featured">Featured</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Premium leather goods & footwear"
                  value={brandInput.description}
                  onChange={(e) => setBrandInput({ ...brandInput, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBrandSubmitting}
                  className="px-5 py-2 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isBrandSubmitting ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Tag Modal */}
      {isTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">Add Marketing Tag</h3>
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-slate-900 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTagSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Tag Name *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-gray-400 font-bold">#</span>
                  <input
                    type="text"
                    required
                    placeholder="FestiveOffer"
                    value={tagInput.name}
                    onChange={(e) => setTagInput({ ...tagInput, name: e.target.value })}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsTagModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTagSubmitting}
                  className="px-5 py-2 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isTagSubmitting ? 'Creating...' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Attribute Modal */}
      {isAttributeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">Add Variant Attribute</h3>
              <button
                onClick={() => setIsAttributeModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-slate-900 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAttributeSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Attribute Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Denim Waist Sizes"
                  value={attributeInput.name}
                  onChange={(e) => setAttributeInput({ ...attributeInput, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Attribute Type</label>
                <select
                  value={attributeInput.type}
                  onChange={(e) => setAttributeInput({ ...attributeInput, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                >
                  <option value="Size">Size</option>
                  <option value="Color">Color</option>
                  <option value="Material">Material</option>
                  <option value="Fit">Fit</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Values (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 28, 30, 32, 34, 36"
                  value={attributeInput.values}
                  onChange={(e) => setAttributeInput({ ...attributeInput, values: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAttributeModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAttributeSubmitting}
                  className="px-5 py-2 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isAttributeSubmitting ? 'Saving...' : 'Save Attribute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Custom Professional Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-gray-100 text-center space-y-5 animate-scaleUp relative">
            {/* Close Button */}
            <button
              onClick={() => setDeleteConfirmModal({ isOpen: false, item: null, type: 'cart', name: '', isDeleting: false })}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Warning Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#ff2056] border border-rose-100 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-base font-bold font-serif text-slate-900 capitalize">
                Delete {deleteConfirmModal.type}?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-sans">
                Are you sure you want to remove <strong className="text-slate-900 font-bold">"{deleteConfirmModal.name}"</strong>? This will remove it permanently from the database.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal({ isOpen: false, item: null, type: 'cart', name: '', isDeleting: false })}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmModal.isDeleting}
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleteConfirmModal.isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
