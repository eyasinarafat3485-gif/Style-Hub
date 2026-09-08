import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Filter,
  RefreshCw,
  ShoppingBag,
  DollarSign,
  Trash2,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItemRow, setSelectedItemRow] = useState(null); // Specific single item order for modal
  const [deleteModalTarget, setDeleteModalTarget] = useState(null); // { orderId, itemId, itemIndex, itemName }
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdatingRowKey, setStatusUpdatingRowKey] = useState(null);

  // Fetch real live orders from MongoDB
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('stylehub_token');
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to fetch orders from database:', err);
      toast.error('Failed to load orders from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update specific item status in MongoDB
  const handleStatusChange = async (orderId, newStatus, itemId, itemIndex, rowKey) => {
    try {
      setStatusUpdatingRowKey(rowKey || orderId);
      const token = localStorage.getItem('stylehub_token');
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: newStatus,
          itemId,
          itemIndex,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? data.order : ord))
        );
        if (selectedItemRow && selectedItemRow.orderId === orderId) {
          setSelectedItemRow((prev) => ({
            ...prev,
            status: newStatus,
            item: { ...prev.item, status: newStatus },
            rawOrder: data.order,
          }));
        }
        toast.success(`Item status updated to "${newStatus}"!`);
      } else {
        toast.error(data.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Network error updating status');
    } finally {
      setStatusUpdatingRowKey(null);
    }
  };

  // Delete specific order item or full order permanently
  const handleDeleteItem = async () => {
    if (!deleteModalTarget) return;
    try {
      setIsDeleting(true);
      const { orderId, itemId, itemIndex } = deleteModalTarget;
      const token = localStorage.getItem('stylehub_token');

      let url = `http://localhost:5000/api/orders/${orderId}`;
      if (itemId) {
        url += `?itemId=${itemId}`;
      } else if (itemIndex !== undefined) {
        url += `?itemIndex=${itemIndex}`;
      }

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        if (data.order) {
          setOrders((prev) =>
            prev.map((ord) => (ord._id === orderId ? data.order : ord))
          );
        } else {
          setOrders((prev) => prev.filter((ord) => ord._id !== orderId));
        }

        if (selectedItemRow && selectedItemRow.orderId === orderId) {
          setSelectedItemRow(null);
        }
        toast.success('Order item removed from database!');
        setDeleteModalTarget(null);
      } else {
        toast.error(data.message || 'Failed to delete order');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error('Network error deleting order');
    } finally {
      setIsDeleting(false);
    }
  };

  // Flatten orders into individual order-item rows for per-order item separation
  const orderRows = orders.flatMap((ord) => {
    if (!ord.orderItems || ord.orderItems.length === 0) {
      return [
        {
          orderId: ord._id,
          rawOrder: ord,
          customerName: ord.shippingAddress?.fullName || ord.user?.name || 'Customer',
          customerEmail: ord.user?.email || 'N/A',
          customerPhone: ord.shippingAddress?.phone || ord.user?.phone || 'N/A',
          address: [ord.shippingAddress?.address, ord.shippingAddress?.city]
            .filter(Boolean)
            .join(', ') || 'Dhaka, Bangladesh',
          paymentMethod: ord.paymentMethod || 'Cash on Delivery',
          status: ord.status || 'Pending',
          createdAt: ord.createdAt,
          item: {
            name: 'Fashion Item',
            price: ord.totalPrice || 0,
            quantity: 1,
            selectedSize: 'M',
            selectedColor: '',
            image: '',
            status: ord.status || 'Pending',
          },
          itemIndex: 0,
          totalItemsInOrder: 1,
          rowKey: `${ord._id}-0`,
        },
      ];
    }

    return ord.orderItems.map((item, idx) => ({
      orderId: ord._id,
      rawOrder: ord,
      customerName: ord.shippingAddress?.fullName || ord.user?.name || 'Customer',
      customerEmail: ord.user?.email || 'N/A',
      customerPhone: ord.shippingAddress?.phone || ord.user?.phone || 'N/A',
      address: [ord.shippingAddress?.address, ord.shippingAddress?.city]
        .filter(Boolean)
        .join(', ') || 'Dhaka, Bangladesh',
      paymentMethod: ord.paymentMethod || 'Cash on Delivery',
      status: item.status || ord.status || 'Pending',
      createdAt: ord.createdAt,
      item,
      itemIndex: idx,
      totalItemsInOrder: ord.orderItems.length,
      rowKey: `${ord._id}-${item._id || idx}`,
    }));
  });

  // Filter individual order rows by search & status
  const filteredOrderRows = orderRows.filter((row) => {
    const shortId = `ORD-${row.orderId?.slice(-6).toUpperCase()}`;
    const customerName = row.customerName || '';
    const customerEmail = row.customerEmail || '';
    const address = row.address || '';
    const itemName = row.item?.name || '';

    const matchesSearch =
      shortId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalItemsCount = orderRows.length;
  const pendingOrdersCount = orderRows.filter((r) => r.status === 'Pending').length;
  const deliveredOrdersCount = orderRows.filter((r) => r.status === 'Delivered').length;
  const totalRevenue = orderRows
    .filter((r) => r.status !== 'Cancelled')
    .reduce((sum, r) => sum + Number(r.item?.price || 0) * (r.item?.quantity || 1), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-[#ff2056] border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">Customer Orders & Sales</h2>
            <span className="bg-rose-50 text-[#ff2056] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-100">
              Live Database
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Individual customer product orders and shipment fulfillment pipeline
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          title="Reload Orders"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#ff2056]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Order Items
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalItemsCount}</h3>
            <span className="text-[10px] text-gray-500 font-medium">Individual sales items</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Pending Items
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{pendingOrdersCount}</h3>
            <span className="text-[10px] text-amber-600 font-medium">Needs fulfillment</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Delivered
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{deliveredOrdersCount}</h3>
            <span className="text-[10px] text-emerald-600 font-medium">Delivered to client</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
              Sales Revenue
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ৳ {totalRevenue.toLocaleString('en-BD')}
            </h3>
            <span className="text-[10px] text-gray-500 font-medium">Delivered & active volume</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-[#ff2056]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, item, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3.5 py-2 rounded-xl w-full sm:w-auto transition-colors">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer pr-2"
            >
              <option value="All">All Statuses ({totalItemsCount})</option>
              <option value="Pending">Pending ({orderRows.filter((r) => r.status === 'Pending').length})</option>
              <option value="Processing">Processing ({orderRows.filter((r) => r.status === 'Processing').length})</option>
              <option value="Shipped">Shipped ({orderRows.filter((r) => r.status === 'Shipped').length})</option>
              <option value="Delivered">Delivered ({orderRows.filter((r) => r.status === 'Delivered').length})</option>
              <option value="Cancelled">Cancelled ({orderRows.filter((r) => r.status === 'Cancelled').length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders View: Desktop Table + Mobile Responsive Cards (No Scrolling) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-rose-200 border-t-[#ff2056] rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-gray-500">Connecting to MongoDB orders collection...</p>
          </div>
        ) : filteredOrderRows.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No Orders Found</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'All'
                ? 'No orders match your filter criteria.'
                : 'Customer orders placed from the store will appear here automatically.'}
            </p>
          </div>
        ) : (
          <>
            {/* 1. DESKTOP VIEW (Visible on tablet & desktop screens md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3.5 px-4">Order Details</th>
                    <th className="py-3.5 px-4">Customer & Address</th>
                    <th className="py-3.5 px-4">Item Ordered</th>
                    <th className="py-3.5 px-4">Amount & Payment</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-slate-800">
                  {filteredOrderRows.map((row) => {
                    const shortId = `ORD-${row.orderId?.slice(-6).toUpperCase()}`;
                    const itemTotalPrice = Number(row.item?.price || 0) * (row.item?.quantity || 1);
                    const isRowUpdating = statusUpdatingRowKey === row.rowKey;

                    return (
                      <tr key={row.rowKey} className="hover:bg-slate-50/70 transition-colors group">
                        {/* Order Details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                              #{shortId}
                            </p>
                          </div>
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            {formatDate(row.createdAt)}
                          </span>
                          {row.totalItemsInOrder > 1 && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block border border-slate-200">
                              Item {row.itemIndex + 1} of {row.totalItemsInOrder}
                            </span>
                          )}
                        </td>

                        {/* Customer & Address */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{row.customerName}</p>
                          <p className="text-[11px] text-gray-500">{row.customerEmail}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                            <span className="truncate max-w-[170px]">{row.address}</span>
                          </p>
                        </td>

                        {/* Single Item Ordered */}
                        <td className="py-3.5 px-4 max-w-[240px]">
                          <div className="flex items-center gap-3">
                            {row.item?.image ? (
                              <img
                                src={row.item.image}
                                alt={row.item.name}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0 shadow-2xs"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {row.item?.name || 'Fashion Product'}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700 text-[10px]">
                                  Size: {row.item?.selectedSize || 'M'}
                                </span>
                                {row.item?.selectedColor && (
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700 text-[10px]">
                                    Color: {row.item.selectedColor}
                                  </span>
                                )}
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Qty: <b>{row.item?.quantity || 1}</b>
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Amount & Payment */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 text-sm">
                            ৳ {itemTotalPrice.toLocaleString('en-BD')}
                          </p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold inline-block mt-0.5">
                            {row.paymentMethod}
                          </span>
                        </td>

                        {/* Current Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                              row.status
                            )}`}
                          >
                            {row.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={row.status}
                              disabled={isRowUpdating}
                              onChange={(e) =>
                                handleStatusChange(
                                  row.orderId,
                                  e.target.value,
                                  row.item?._id,
                                  row.itemIndex,
                                  row.rowKey
                                )
                              }
                              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#ff2056] cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* View Modal Trigger for THIS specific product item */}
                            <button
                              onClick={() => setSelectedItemRow(row)}
                              className="p-1.5 text-gray-400 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                              title="View Specific Item Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete Item Trigger */}
                            <button
                              onClick={() =>
                                setDeleteModalTarget({
                                  orderId: row.orderId,
                                  itemId: row.item?._id,
                                  itemIndex: row.itemIndex,
                                  itemName: row.item?.name || 'Order Item',
                                })
                              }
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete This Item Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 2. MOBILE CARD VIEW (Active on mobile screens < md - ZERO Horizontal Scrolling) */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filteredOrderRows.map((row) => {
                const shortId = `ORD-${row.orderId?.slice(-6).toUpperCase()}`;
                const itemTotalPrice = Number(row.item?.price || 0) * (row.item?.quantity || 1);
                const isRowUpdating = statusUpdatingRowKey === row.rowKey;

                return (
                  <div key={row.rowKey} className="p-4 space-y-3.5 bg-white hover:bg-slate-50/50 transition-colors">
                    {/* Top Row: Order ID + Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">#{shortId}</span>
                        {row.totalItemsInOrder > 1 && (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {row.itemIndex + 1}/{row.totalItemsInOrder}
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </div>

                    {/* Middle Row: Product Image + Details + Price */}
                    <div className="flex items-start gap-3">
                      {row.item?.image ? (
                        <img
                          src={row.item.image}
                          alt={row.item.name}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {row.item?.name || 'Fashion Product'}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                            Size: {row.item?.selectedSize || 'M'}
                          </span>
                          {row.item?.selectedColor && (
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                              Color: {row.item.selectedColor}
                            </span>
                          )}
                          <span>Qty: <b>{row.item?.quantity || 1}</b></span>
                        </div>
                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-xs font-black text-slate-900">
                            ৳ {itemTotalPrice.toLocaleString('en-BD')}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                            {row.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Address snippet */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-0.5">
                      <p className="font-semibold text-slate-800">{row.customerName} · <span className="text-gray-400 font-normal">{row.customerEmail}</span></p>
                      <p className="text-gray-500 flex items-center gap-1 text-[10px]">
                        <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                        <span className="truncate">{row.address}</span>
                      </p>
                    </div>

                    {/* Bottom Actions Row: Status Select + View + Delete */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="text-[10px] font-semibold text-gray-500">Status:</span>
                        <select
                          value={row.status}
                          disabled={isRowUpdating}
                          onChange={(e) =>
                            handleStatusChange(
                              row.orderId,
                              e.target.value,
                              row.item?._id,
                              row.itemIndex,
                              row.rowKey
                            )
                          }
                          className="flex-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#ff2056] cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedItemRow(row)}
                          className="p-1.5 text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModalTarget({
                              orderId: row.orderId,
                              itemId: row.item?._id,
                              itemIndex: row.itemIndex,
                              itemName: row.item?.name || 'Order Item',
                            })
                          }
                          className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Specific Item Order Details Modal */}
      {selectedItemRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-[#ff2056]">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
                    Item Details: #ORD-{selectedItemRow.orderId?.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Ordered on {formatDate(selectedItemRow.createdAt)}
                    {selectedItemRow.totalItemsInOrder > 1 &&
                      ` · Item ${selectedItemRow.itemIndex + 1} of ${selectedItemRow.totalItemsInOrder}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItemRow(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Product Spotlight Card */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
                <div className="flex items-start gap-4">
                  {selectedItemRow.item?.image ? (
                    <img
                      src={selectedItemRow.item.image}
                      alt={selectedItemRow.item.name}
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                      <Package className="w-8 h-8" />
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {selectedItemRow.item?.name || 'Fashion Apparel'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md font-bold text-[11px] border border-slate-200">
                        Size: {selectedItemRow.item?.selectedSize || 'M'}
                      </span>
                      {selectedItemRow.item?.selectedColor && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md font-bold text-[11px] border border-slate-200">
                          Color: {selectedItemRow.item.selectedColor}
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-rose-50 text-[#ff2056] rounded-md font-bold text-[11px] border border-rose-100">
                        Qty: {selectedItemRow.item?.quantity || 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Calculation for this item */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Item Subtotal:</span>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900">
                      ৳{' '}
                      {(
                        Number(selectedItemRow.item?.price || 0) *
                        (selectedItemRow.item?.quantity || 1)
                      ).toLocaleString('en-BD')}
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      (৳ {selectedItemRow.item?.price} x {selectedItemRow.item?.quantity || 1})
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Current Fulfillment Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mt-1 ${getStatusBadge(
                      selectedItemRow.status
                    )}`}
                  >
                    {selectedItemRow.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Update:</span>
                  <select
                    value={selectedItemRow.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedItemRow.orderId,
                        e.target.value,
                        selectedItemRow.item?._id,
                        selectedItemRow.itemIndex,
                        selectedItemRow.rowKey
                      )
                    }
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#ff2056] cursor-pointer shadow-2xs"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Shipping Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <User className="w-3.5 h-3.5 text-[#ff2056]" />
                    <span>Customer</span>
                  </div>
                  <p className="font-semibold text-slate-800">{selectedItemRow.customerName}</p>
                  <p className="text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{selectedItemRow.customerEmail}</span>
                  </p>
                  <p className="text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                    <span>{selectedItemRow.customerPhone}</span>
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#ff2056]" />
                    <span>Destination & Payment</span>
                  </div>
                  <p className="text-slate-800 font-medium">{selectedItemRow.address}</p>
                  <p className="text-gray-500">Bangladesh</p>
                  <p className="text-gray-500 pt-0.5">
                    Method: <span className="font-bold text-emerald-600">{selectedItemRow.paymentMethod}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedItemRow(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {deleteModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#ff2056] flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Delete "{deleteModalTarget.itemName}"?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to remove this item order from database? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteItem}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#ff2056] hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Item</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
