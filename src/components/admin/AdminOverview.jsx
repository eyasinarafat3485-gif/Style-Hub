import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  PlusCircle,
  Truck,
  ChevronRight,
  Boxes,
  ShieldCheck,
  Tag,
  FolderTree,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const AdminOverview = ({ setActiveTab, onAddNewProduct }) => {
  const { products, categories, formatPrice } = useShop();

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real orders and customers from MongoDB backend
  const fetchDashboardData = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setIsLoading(true);

      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // 1. Fetch Orders
      const ordersPromise = fetch('http://localhost:5000/api/orders', { headers })
        .then((res) => res.json())
        .catch(() => ({ success: false, orders: [] }));

      // 2. Fetch Customers
      const customersPromise = fetch('http://localhost:5000/api/auth/users', { headers })
        .then((res) => res.json())
        .catch(() => ({ success: false, users: [] }));

      const [ordersRes, customersRes] = await Promise.all([ordersPromise, customersPromise]);

      if (ordersRes.success && Array.isArray(ordersRes.orders)) {
        setOrders(ordersRes.orders);
      } else {
        setOrders([]);
      }

      if (customersRes.success && Array.isArray(customersRes.users)) {
        setCustomers(customersRes.users);
      } else {
        setCustomers([]);
      }

      if (isManual) {
        toast.success('Dashboard metrics refreshed!');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      if (isManual) toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Dynamic Metrics Calculations
  const totalOrdersCount = orders.length;
  const nonCancelledOrders = orders.filter((o) => o.status !== 'Cancelled');
  const totalRevenue = nonCancelledOrders.reduce(
    (sum, o) => sum + (Number(o.totalPrice) || 0),
    0
  );
  const averageOrderValue =
    nonCancelledOrders.length > 0
      ? Math.round(totalRevenue / nonCancelledOrders.length)
      : 0;

  const pendingOrdersCount = orders.filter((o) => (o.status || 'Pending').toLowerCase() === 'pending').length;
  const processingOrdersCount = orders.filter((o) => (o.status || '').toLowerCase() === 'processing').length;
  const shippedOrdersCount = orders.filter((o) => (o.status || '').toLowerCase() === 'shipped').length;
  const deliveredOrdersCount = orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length;
  const cancelledOrdersCount = orders.filter((o) => (o.status || '').toLowerCase() === 'cancelled').length;

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock !== false).length;
  const outOfStockProducts = products.filter((p) => p.inStock === false || p.stock === 0).length;

  const totalCustomersCount = customers.length;
  const registeredCount = customers.filter((c) => c.isRegistered).length;
  const guestCount = customers.filter((c) => !c.isRegistered).length;

  // 4 Top Metric Cards
  const stats = [
    {
      title: 'Total Revenue',
      value: `৳ ${Number(totalRevenue).toLocaleString('en-BD')}`,
      subtext: `Avg Order: ৳ ${Number(averageOrderValue).toLocaleString('en-BD')}`,
      badge: `${nonCancelledOrders.length} Completed/Active`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      action: () => setActiveTab('orders'),
    },
    {
      title: 'Total Orders',
      value: `${totalOrdersCount} Orders`,
      subtext: `${pendingOrdersCount + processingOrdersCount} Needs Action`,
      badge: `${deliveredOrdersCount} Delivered`,
      icon: Package,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      action: () => setActiveTab('orders'),
    },
    {
      title: 'Catalog Inventory',
      value: `${totalProducts} Products`,
      subtext: `${inStockProducts} in stock • ${outOfStockProducts} out`,
      badge: `${categories.length || 0} Categories`,
      icon: ShoppingBag,
      color: 'bg-rose-50 text-[#ff2056] border-rose-200',
      action: () => setActiveTab('products'),
    },
    {
      title: 'Total Customers',
      value: `${totalCustomersCount} Shoppers`,
      subtext: `${registeredCount} Registered • ${guestCount} Guest`,
      badge: 'All Audiences',
      icon: Users,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      action: () => setActiveTab('customers'),
    },
  ];

  // Dynamic Category Breakdown
  const categoryMap = {};
  products.forEach((p) => {
    const cat = p.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categoryList = Object.entries(categoryMap)
    .map(([name, count]) => ({
      name,
      count,
      percent: totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Executive Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff2056]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2056]/20 border border-rose-500/30 text-[#ff2056] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Performance Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight">
            StyleHub Executive Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time live synchronization with MongoDB orders, customers, and active store products.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing || isLoading}
            className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-slate-600 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            title="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#ff2056]' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <button
            onClick={onAddNewProduct}
            className="py-2.5 px-4 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-600 transition-all cursor-pointer flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Manage Orders</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards Grid: 2 per line on mobile (grid-cols-2), 4 on desktop (lg:grid-cols-4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.action}
              className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-3 sm:p-5 shadow-xs hover:shadow-md hover:border-rose-200 transition-all space-y-1.5 sm:space-y-3 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider truncate">
                  {item.title}
                </span>
                <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border group-hover:scale-105 transition-transform ${item.color} shrink-0`}>
                  <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight font-serif truncate">
                  {isLoading ? (
                    <div className="h-5 sm:h-7 w-16 sm:w-28 bg-slate-100 animate-pulse rounded-md" />
                  ) : (
                    item.value
                  )}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-1 mt-1 text-[10px] sm:text-xs">
                  <span className="font-semibold text-slate-600 truncate text-[10px] sm:text-xs">
                    {item.subtext}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 w-fit shrink-0">
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Order Pipeline Tracker Row */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#ff2056]" />
              <span>Live Order Fulfillment Pipeline</span>
            </h4>
            <p className="text-xs text-gray-400">Current status breakdown across all store orders</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-[#ff2056] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Open Order Manager</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {[
            { label: 'Pending', count: pendingOrdersCount, color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: 'Processing', count: processingOrdersCount, color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Shipped', count: shippedOrdersCount, color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'Delivered', count: deliveredOrdersCount, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { label: 'Cancelled', count: cancelledOrdersCount, color: 'bg-rose-50 text-rose-700 border-rose-200' },
          ].map((pill, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab('orders')}
              className={`p-3 rounded-xl border ${pill.color} text-center transition-all hover:scale-102 cursor-pointer shadow-2xs`}
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">
                {pill.label}
              </span>
              <span className="text-lg font-black block mt-0.5">{pill.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Catalog Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Recent Store Orders</h3>
              <p className="text-xs text-gray-500">Live order transactions from online checkout</p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-bold text-[#ff2056] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Orders ({orders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <div className="w-7 h-7 border-2 border-rose-200 border-t-[#ff2056] rounded-full animate-spin" />
              <p className="text-xs text-gray-500">Loading recent orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-2 bg-stone-50/50 rounded-xl border border-dashed border-gray-200">
              <Package className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No orders recorded yet</p>
              <p className="text-[11px] text-gray-400">Customer purchases will be shown here in real-time.</p>
            </div>
          ) : (
            <>
              {/* 1. DESKTOP VIEW (md+) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[580px]">
                  <thead>
                    <tr className="text-gray-400 uppercase tracking-wider font-bold border-b border-gray-100 pb-2">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-slate-800">
                    {orders.slice(0, 6).map((ord) => {
                      const shortId = ord._id ? `SH-${ord._id.slice(-6).toUpperCase()}` : ord.id || 'SH-ORDER';
                      const customerName =
                        ord.shippingAddress?.fullName ||
                        ord.guestInfo?.fullName ||
                        (ord.user && ord.user.name) ||
                        ord.userEmail ||
                        'Customer';
                      const firstItem = ord.orderItems && ord.orderItems.length > 0 ? ord.orderItems[0] : null;
                      const itemsSummary = ord.orderItems && ord.orderItems.length > 0
                        ? ord.orderItems.map((item) => `${item.name || 'Item'} (${item.selectedSize || 'M'}) x ${item.quantity || 1}`).join(', ')
                        : 'Order Items';
                      const amountFormatted = typeof ord.totalPrice === 'number' ? formatPrice(ord.totalPrice) : (ord.total || '৳ 0');

                      return (
                        <tr
                          key={ord._id || ord.id}
                          onClick={() => setActiveTab('orders')}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {shortId}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{customerName}</span>
                            <span className="text-[10px] text-gray-400 block truncate max-w-[130px]">
                              {ord.shippingAddress?.city || ord.shippingAddress?.district || ord.paymentMethod || 'Online'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2 max-w-[200px]">
                              {firstItem?.image && (
                                <img
                                  src={firstItem.image}
                                  alt={firstItem.name}
                                  className="w-7 h-7 rounded-md object-cover border border-gray-200 shrink-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              <span className="text-gray-600 truncate">{itemsSummary}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-black text-slate-900">{amountFormatted}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(ord.status)}`}>
                              {ord.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 2. MOBILE CARD VIEW (< md, No Horizontal Scroll / No Wrap) */}
              <div className="block md:hidden divide-y divide-gray-100">
                {orders.slice(0, 6).map((ord) => {
                  const shortId = ord._id ? `SH-${ord._id.slice(-6).toUpperCase()}` : ord.id || 'SH-ORDER';
                  const customerName =
                    ord.shippingAddress?.fullName ||
                    ord.guestInfo?.fullName ||
                    (ord.user && ord.user.name) ||
                    ord.userEmail ||
                    'Customer';
                  const firstItem = ord.orderItems && ord.orderItems.length > 0 ? ord.orderItems[0] : null;
                  const itemsSummary = ord.orderItems && ord.orderItems.length > 0
                    ? ord.orderItems.map((item) => `${item.name || 'Item'} (${item.selectedSize || 'M'}) x ${item.quantity || 1}`).join(', ')
                    : 'Order Items';
                  const amountFormatted = typeof ord.totalPrice === 'number' ? formatPrice(ord.totalPrice) : (ord.total || '৳ 0');

                  return (
                    <div
                      key={ord._id || ord.id}
                      onClick={() => setActiveTab('orders')}
                      className="py-3 space-y-2 hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      {/* Top Row: Order ID + Status */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">
                          {shortId}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(ord.status)}`}>
                          {ord.status || 'Pending'}
                        </span>
                      </div>

                      {/* Middle Row: Item preview & customer info */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {firstItem?.image && (
                            <img
                              src={firstItem.image}
                              alt={firstItem.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">
                              {customerName}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {itemsSummary}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-extrabold text-slate-900 text-xs">
                            {amountFormatted}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            {ord.shippingAddress?.city || 'Dhaka'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right 1 Col: Dynamic Category Breakdown & Store Status */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Catalog Summary</h3>
              <p className="text-xs text-gray-500">Live products by category</p>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-bold text-[#ff2056] hover:underline cursor-pointer"
            >
              Inventory ({totalProducts})
            </button>
          </div>

          <div className="space-y-3.5">
            {categoryList.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No categories found in catalog</p>
            ) : (
              categoryList.map((catItem, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 font-bold truncate max-w-[150px]">{catItem.name}</span>
                    <span className="text-gray-500 font-mono text-[11px]">
                      {catItem.count} item{catItem.count > 1 ? 's' : ''} ({catItem.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#ff2056] to-rose-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, catItem.percent)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* System Online & Store Health Notice */}
          <div className="p-3.5 bg-gradient-to-r from-rose-50/80 to-slate-50 border border-rose-100 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-900">Store Engine Online</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Active inventory: <strong className="text-slate-900">{inStockProducts}</strong> in-stock items ready for order checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
