import React from 'react';
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
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminOverview = ({ setActiveTab, onAddNewProduct }) => {
  const { products, formatPrice } = useShop();

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock !== false).length;

  // Mock initial demo stats for dashboard richness
  const stats = [
    {
      title: 'Total Revenue',
      value: '৳ 3,42,850',
      change: '+18.4%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: '148 Orders',
      change: '+12.2%',
      isPositive: true,
      icon: Package,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'Active Inventory',
      value: `${totalProducts} Items`,
      change: `${inStockProducts} in stock`,
      isPositive: true,
      icon: ShoppingBag,
      color: 'bg-rose-50 text-[#ff2056] border-rose-200',
    },
    {
      title: 'Registered Customers',
      value: '1,280 Users',
      change: '+24 this week',
      isPositive: true,
      icon: Users,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  // Recent Orders data
  const recentOrders = [
    {
      id: 'ORD-9821',
      customer: 'Sarah Ahmed',
      items: 'Silk Embroidered Panjabi (L)',
      amount: '৳ 3,850',
      status: 'Delivered',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      date: 'Today, 2:45 PM',
    },
    {
      id: 'ORD-9820',
      customer: 'Tanvir Hossain',
      items: 'Premium Cotton Polo Shirt (XL)',
      amount: '৳ 1,450',
      status: 'Processing',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      date: 'Today, 11:20 AM',
    },
    {
      id: 'ORD-9819',
      customer: 'Farhana Akter',
      items: 'Floral Print Festive Kurti (M)',
      amount: '৳ 2,750',
      status: 'Pending',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      date: 'Yesterday, 8:15 PM',
    },
    {
      id: 'ORD-9818',
      customer: 'Rafiqul Islam',
      items: 'Slim Fit Denim Jeans + T-Shirt',
      amount: '৳ 3,200',
      status: 'Delivered',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      date: 'Sep 04, 2026',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
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
            Monitor real-time sales metrics, customer activity, and live fashion inventory.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <button
            onClick={onAddNewProduct}
            className="py-2.5 px-4 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {item.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-serif">
                  {item.value}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    {item.change}
                  </span>
                  <span className="text-[11px] text-gray-400">• vs last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Orders & Quick Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders */}
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
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
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
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{ord.id}</td>
                    <td className="py-3 px-3 font-medium">{ord.customer}</td>
                    <td className="py-3 px-3 text-gray-500 max-w-[180px] truncate">{ord.items}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{ord.amount}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ord.statusColor}`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Top Performing Categories & Quick Products */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Catalog Summary</h3>
              <p className="text-xs text-gray-500">Breakdown by category</p>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-bold text-[#ff2056] hover:underline cursor-pointer"
            >
              Inventory
            </button>
          </div>

          <div className="space-y-3">
            {[
              { cat: 'Panjabi & Kurtis', count: products.filter(p => p.category === 'Panjabi' || p.category === 'Kurtis').length || 6, percent: 38 },
              { cat: "Women's Collection", count: products.filter(p => p.category === 'Women' || p.category === 'Sarees').length || 5, percent: 28 },
              { cat: "Men's Casual Wear", count: products.filter(p => p.category === 'Men' || p.category === 'T-Shirts').length || 4, percent: 22 },
              { cat: "Kids & Festive", count: 3, percent: 12 },
            ].map((catItem, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{catItem.cat}</span>
                  <span className="text-gray-500">{catItem.count} items ({catItem.percent}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#ff2056] h-full rounded-full"
                    style={{ width: `${catItem.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#ff2056] shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-700">
              <span className="font-bold">System Online:</span> Products are synced automatically with the live customer shop.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
