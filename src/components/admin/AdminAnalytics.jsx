import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Activity,
  ArrowUpRight,
  RefreshCw,
  Download,
  Calendar,
  CreditCard,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Truck,
  Sparkles,
  BarChart3,
  Layers,
  ArrowRight,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const AdminAnalytics = ({ setActiveTab }) => {
  const { formatPrice } = useShop();

  const [range, setRange] = useState('30d'); // '7d', '30d', '90d', '1y', 'all'
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const [analyticsData, setAnalyticsData] = useState({
    summary: {
      totalRevenue: 0,
      rangeRevenue: 0,
      totalOrders: 0,
      rangeOrders: 0,
      deliveredOrdersCount: 0,
      deliveredRevenue: 0,
      avgOrderValue: 0,
      rangeAvgOrderValue: 0,
      conversionRate: '3.84',
      totalUniqueCustomers: 0,
      registeredCustomersCount: 0,
      repeatCustomerRate: '0.0',
      liveActiveSessions: 42,
      totalProductsCount: 0,
      outOfStockCount: 0,
      lowStockCount: 0,
      totalReviewsCount: 0,
      avgStoreRating: '4.9',
    },
    timelineData: [],
    statusBreakdown: [],
    paymentDistribution: [],
    topSellingProducts: [],
    categoryPerformance: [],
    recentTransactions: [],
    inventoryAlerts: [],
  });

  // Fetch real analytics from backend
  const fetchAnalytics = async (selectedRange = range, isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setIsLoading(true);

      const token =
        localStorage.getItem('stylehub_token') ||
        localStorage.getItem('stylehub_auth_token');

      const res = await fetch(
        `http://localhost:5000/api/analytics?range=${selectedRange}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setAnalyticsData(data);
        if (isManual) {
          toast.success('📊 Analytics data synced in real-time!');
        }
      } else {
        toast.error(data.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      toast.error('Network error loading analytics data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  // Export Analytics to CSV
  const handleExportCSV = () => {
    try {
      const summary = analyticsData.summary || {};
      const rows = [
        ['StyleHub Executive Analytics Report'],
        ['Generated At', new Date().toLocaleString()],
        ['Selected Range', range],
        [],
        ['Metric', 'Value'],
        ['Total Store Revenue', `BDT ${summary.totalRevenue || 0}`],
        ['Period Revenue', `BDT ${summary.rangeRevenue || 0}`],
        ['Total Orders', summary.totalOrders || 0],
        ['Delivered Orders', summary.deliveredOrdersCount || 0],
        ['Average Order Value (AOV)', `BDT ${summary.avgOrderValue || 0}`],
        ['Conversion Rate', `${summary.conversionRate}%`],
        ['Unique Customers', summary.totalUniqueCustomers || 0],
        ['Repeat Customer Rate', `${summary.repeatCustomerRate}%`],
        ['Active Live Sessions', summary.liveActiveSessions || 0],
        ['Catalog Products', summary.totalProductsCount || 0],
        ['Store Rating', `${summary.avgStoreRating} / 5.0`],
        [],
        ['Date / Period', 'Revenue (BDT)', 'Orders Count', 'Avg Order Value (BDT)'],
        ...(analyticsData.timelineData || []).map((t) => [
          t.date,
          t.revenue,
          t.orders,
          t.avgOrderValue,
        ]),
      ];

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        rows.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `stylehub_analytics_report_${range}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('📥 Analytics CSV Report downloaded successfully!');
    } catch (e) {
      console.error('Export CSV Error:', e);
      toast.error('Failed to export CSV report');
    }
  };

  const { summary, timelineData, statusBreakdown, paymentDistribution, topSellingProducts, categoryPerformance, recentTransactions, inventoryAlerts } = analyticsData;

  // Compute maximums for timeline chart scaling
  const maxRevenue = Math.max(
    ...timelineData.map((d) => d.revenue || 0),
    1000
  );
  const maxOrders = Math.max(
    ...timelineData.map((d) => d.orders || 0),
    5
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header & Controls Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#ff2056] flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <span>Reports & Live Analytics</span>
                <span className="flex items-center gap-1 text-[10px] font-sans font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Real-time revenue metrics, shopping cart conversion rates, and product inventory velocity.
              </p>
            </div>
          </div>
        </div>

        {/* Range Selector & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 self-start md:self-auto">
          {/* Time range filters */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-600">
            {[
              { label: '7D', value: '7d' },
              { label: '30D', value: '30d' },
              { label: '90D', value: '90d' },
              { label: '1Y', value: '1y' },
              { label: 'All', value: 'all' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setRange(item.value)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  range === item.value
                    ? 'bg-white text-[#ff2056] font-bold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAnalytics(range, true)}
            disabled={isRefreshing || isLoading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#ff2056]' : ''}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export Report */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#ff2056] hover:bg-[#d6103e] text-white rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Scorecards (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="p-4 bg-gradient-to-br from-white to-rose-50/30 border border-gray-200/80 rounded-2xl shadow-xs space-y-2 relative overflow-hidden group hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#ff2056] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
            {formatPrice(summary.totalRevenue || 0)}
          </h4>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.2% vs last period</span>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="p-4 bg-gradient-to-br from-white to-blue-50/30 border border-gray-200/80 rounded-2xl shadow-xs space-y-2 relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Avg. Order Value
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
            {formatPrice(summary.avgOrderValue || 0)}
          </h4>
          <span className="text-[10px] text-blue-600 font-medium block">
            +৳ 120 per checkout
          </span>
        </div>

        {/* Conversion Rate */}
        <div className="p-4 bg-gradient-to-br from-white to-emerald-50/30 border border-gray-200/80 rounded-2xl shadow-xs space-y-2 relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Conversion Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
            {summary.conversionRate}%
          </h4>
          <span className="text-[10px] text-emerald-600 font-medium block">
            +0.6% vs benchmark
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-4 bg-gradient-to-br from-white to-purple-50/30 border border-gray-200/80 rounded-2xl shadow-xs space-y-2 relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
            {summary.totalOrders || 0}
          </h4>
          <span className="text-[10px] text-purple-600 font-medium block">
            {summary.deliveredOrdersCount || 0} Completed
          </span>
        </div>

        {/* Live Active Sessions */}
        <div className="p-4 bg-gradient-to-br from-white to-pink-50/30 border border-gray-200/80 rounded-2xl shadow-xs space-y-2 relative overflow-hidden group hover:border-pink-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Active Sessions
            </span>
            <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#ff2056] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif flex items-center gap-1.5">
            <span>{summary.liveActiveSessions}</span>
            <span className="text-xs font-sans font-bold text-[#ff2056]">Live</span>
          </h4>
          <span className="text-[10px] text-gray-500 font-medium block">
            Browsing store right now
          </span>
        </div>

        {/* Repeat Customer Rate */}
        <div className="p-4 bg-gradient-to-br from-white to-amber-50/30 border border-gray-200/80 rounded-2xl shadow-xs space-y-2 relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Repeat Customers
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
            {summary.repeatCustomerRate}%
          </h4>
          <span className="text-[10px] text-amber-600 font-medium block">
            High customer loyalty
          </span>
        </div>
      </div>

      {/* 3. Sales & Revenue Velocity Chart Component */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#ff2056]" />
              <span>Revenue & Order Velocity Trends</span>
            </h3>
            <p className="text-xs text-gray-500">
              Historical sales breakdown and volume trajectories over selected timeframe
            </p>
          </div>

          {/* Chart Metric Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600">
              <button
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartMetric === 'revenue'
                    ? 'bg-white text-[#ff2056] shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Revenue (৳)
              </button>
              <button
                onClick={() => setChartMetric('orders')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartMetric === 'orders'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Order Volume
              </button>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        {timelineData.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-400">
            No transaction records found in this range.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-64 sm:h-72 w-full flex items-end gap-1 sm:gap-2 pt-8 pb-2 px-1 relative">
              {/* Background Reference Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 border-b border-gray-200">
                <div className="border-b border-dashed border-gray-200 w-full"></div>
                <div className="border-b border-dashed border-gray-200 w-full"></div>
                <div className="border-b border-dashed border-gray-200 w-full"></div>
                <div className="border-b border-dashed border-gray-200 w-full"></div>
              </div>

              {/* Dynamic Bar Columns */}
              {timelineData.map((item, idx) => {
                const isRevenue = chartMetric === 'revenue';
                const currentVal = isRevenue ? item.revenue : item.orders;
                const maxVal = isRevenue ? maxRevenue : maxOrders;
                const heightPercent =
                  maxVal > 0 ? Math.max(8, Math.round((currentVal / maxVal) * 100)) : 8;

                const isHovered = hoveredPoint === idx;

                return (
                  <div
                    key={idx}
                    className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none animate-fadeIn border border-slate-700">
                        <p className="font-bold text-rose-400">{item.date}</p>
                        <p>
                          {isRevenue ? `Revenue: ${formatPrice(item.revenue)}` : `Orders: ${item.orders}`}
                        </p>
                      </div>
                    )}

                    {/* Bar Element */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                        isHovered
                          ? 'bg-[#ff2056] shadow-lg shadow-rose-500/30 scale-105'
                          : isRevenue
                          ? 'bg-gradient-to-t from-rose-500/80 to-[#ff2056] opacity-85 group-hover:opacity-100'
                          : 'bg-gradient-to-t from-blue-500/80 to-blue-600 opacity-85 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Date Labels */}
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium px-1 border-t border-gray-100 pt-2 overflow-x-hidden">
              <span>{timelineData[0]?.date}</span>
              <span>{timelineData[Math.floor(timelineData.length / 2)]?.date}</span>
              <span>{timelineData[timelineData.length - 1]?.date}</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Two-Column Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Fulfillment Status & Payment Distribution */}
        <div className="space-y-6">
          {/* Order Fulfillment Status Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Order Fulfillment Breakdown</span>
              </h3>
              <span className="text-xs text-gray-500">
                {summary.totalOrders || 0} Total Orders
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {(statusBreakdown || []).map((st) => (
                <div key={st.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: st.color }}
                      ></span>
                      <span className="text-slate-800">{st.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] font-normal">
                        {st.count} orders
                      </span>
                      <span className="font-bold text-slate-900 font-mono">
                        {st.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(2, st.percentage)}%`,
                        backgroundColor: st.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Payment Method Share</span>
              </h3>
              <span className="text-xs text-gray-500">Bangladeshi Channels</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {(paymentDistribution || []).map((pay, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 hover:border-rose-200 transition-all"
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase block truncate">
                    {pay.name}
                  </span>
                  <p className="text-lg font-extrabold text-slate-900 font-serif">
                    {pay.percentage}%
                  </p>
                  <span className="text-[10px] font-medium text-emerald-600 block">
                    {formatPrice(pay.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Top Selling Products Leaderboard & Category Performance */}
        <div className="space-y-6">
          {/* Top Selling Products Leaderboard */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Top Selling Products Leaderboard</span>
              </h3>
              <button
                onClick={() => setActiveTab && setActiveTab('products')}
                className="text-xs font-bold text-[#ff2056] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {(topSellingProducts || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl flex items-center justify-between hover:bg-rose-50/30 hover:border-rose-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-xs line-clamp-1">
                        {item.name}
                      </p>
                      <span className="text-[10px] text-gray-500">
                        {item.unitsSold || 1} units sold
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-xs">
                      {formatPrice(item.revenue || 0)}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      {formatPrice(item.price || 0)} each
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Velocity Performance */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Category Revenue Distribution</span>
              </h3>
              <span className="text-xs text-gray-500">By Sales Volume</span>
            </div>

            <div className="space-y-3 pt-1">
              {(categoryPerformance || []).slice(0, 4).map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{cat.name}</span>
                    <span className="font-bold text-slate-900">{formatPrice(cat.revenue)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(15, (cat.revenue / (summary.totalRevenue || 10000)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Recent Transactions Ledger */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ff2056]" />
              <span>Live Order Transaction Ledger</span>
            </h3>
            <p className="text-xs text-gray-500">
              Real-time checkout records received from customers across Bangladesh
            </p>
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('orders')}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Manage All Orders</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            No live transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#ff2056]">
                      {tx.shortId}
                    </td>
                    <td className="py-3">
                      <p className="font-bold text-slate-900">{tx.customerName}</p>
                      <span className="text-[10px] text-gray-400">{tx.phone}</span>
                    </td>
                    <td className="py-3 text-slate-700 font-medium">
                      {tx.city}
                    </td>
                    <td className="py-3 text-slate-700">
                      <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      {formatPrice(tx.totalPrice)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-700'
                            : tx.status === 'Processing'
                            ? 'bg-blue-100 text-blue-700'
                            : tx.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-500 text-[11px]">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Inventory Stock Alerts & Catalog Health */}
      {inventoryAlerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Inventory Velocity & Stock Alerts
                </h3>
                <p className="text-xs text-gray-500">
                  Items requiring immediate replenishment to avoid order loss
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('products')}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
            >
              Restock Products →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {inventoryAlerts.map((prod) => (
              <div
                key={prod.id}
                className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded-lg border border-amber-200"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</p>
                    <span className="text-[10px] text-gray-500">{prod.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prod.badgeColor}`}>
                    {prod.countInStock} Left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
