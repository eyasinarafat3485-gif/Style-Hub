import React, { useState } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Filter,
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [orders, setOrders] = useState([
    {
      id: 'ORD-1092',
      customer: 'Eyasin Arafat',
      email: 'eyasinwebdev@gmail.com',
      phone: '+880 1712-345678',
      items: 'Royal Embroidered Silk Panjabi (XL) x 1',
      total: '৳ 3,850',
      status: 'Delivered',
      payment: 'bKash (Paid)',
      date: 'Sep 06, 2026, 03:30 PM',
      address: 'Dhanmondi 27, Dhaka - 1209',
    },
    {
      id: 'ORD-1091',
      customer: 'Mahmudur Rahman',
      email: 'mahmud.ctg@gmail.com',
      phone: '+880 1819-987654',
      items: 'Premium Pima Cotton Polo (Navy, L) x 2',
      total: '৳ 2,900',
      status: 'Processing',
      payment: 'Cash on Delivery',
      date: 'Sep 06, 2026, 11:15 AM',
      address: 'GEC Circle, Chittagong',
    },
    {
      id: 'ORD-1090',
      customer: 'Nusrat Jahan',
      email: 'nusrat.jahan@yahoo.com',
      phone: '+880 1911-223344',
      items: 'Exclusive Jamdani Saree (Crimson Red) x 1',
      total: '৳ 8,500',
      status: 'Pending',
      payment: 'Nagad (Paid)',
      date: 'Sep 05, 2026, 09:40 PM',
      address: 'Uttara Sector 7, Dhaka',
    },
    {
      id: 'ORD-1089',
      customer: 'Arif Chowdhury',
      email: 'arif.chowdhury@gmail.com',
      phone: '+880 1610-556677',
      items: 'Slim Fit Chino Trousers (Beige, 32) x 1',
      total: '৳ 1,950',
      status: 'Shipped',
      payment: 'Card Payment',
      date: 'Sep 05, 2026, 02:10 PM',
      address: 'Sylhet Sadar, Sylhet',
    },
    {
      id: 'ORD-1088',
      customer: 'Tahmina Begum',
      email: 'tahmina.b@gmail.com',
      phone: '+880 1515-889900',
      items: 'Floral Print Festive Kurti (M) x 1',
      total: '৳ 2,450',
      status: 'Cancelled',
      payment: 'Cancelled',
      date: 'Sep 04, 2026, 05:20 PM',
      address: 'Mirpur 10, Dhaka',
    },
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    toast.success(`Order ${orderId} updated to "${newStatus}"!`);
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Customer Orders & Fulfillment</h2>
          <p className="text-xs text-gray-500">Track and update customer order shipment status</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="py-3.5 px-4">Order Details</th>
                <th className="py-3.5 px-4">Customer & Address</th>
                <th className="py-3.5 px-4">Items Ordered</th>
                <th className="py-3.5 px-4">Amount & Payment</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-800">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 text-sm">{ord.id}</p>
                    <span className="text-[11px] text-gray-400">{ord.date}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{ord.customer}</p>
                    <p className="text-[11px] text-gray-500">{ord.email}</p>
                    <p className="text-[10px] text-gray-400">{ord.address}</p>
                  </td>

                  <td className="py-3.5 px-4 max-w-[200px]">
                    <span className="text-gray-700 font-medium">{ord.items}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 text-sm">{ord.total}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                      {ord.payment}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        ord.status
                      )}`}
                    >
                      {ord.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#ff2056] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
