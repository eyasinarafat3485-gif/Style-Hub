import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Users,
  UserCheck,
  DollarSign,
  RefreshCw,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCustomers = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch real users from MongoDB
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('stylehub_token');
      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch users from database:', err);
      toast.error('Failed to load users from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update User Role in MongoDB
  const handleRoleToggle = async (userId, currentRole, name) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      setUpdatingUserId(userId);
      const token = localStorage.getItem('stylehub_token');
      const res = await fetch(`${API_BASE_URL}/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        toast.success(`Role for ${name} updated to "${newRole.toUpperCase()}"!`);
      } else {
        toast.error(data.message || 'Failed to update role');
      }
    } catch (err) {
      console.error('Error toggling role:', err);
      toast.error('Network error updating role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Delete User permanently from MongoDB
  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('stylehub_token');
      const res = await fetch(`${API_BASE_URL}/auth/users/${deleteModalUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteModalUser._id));
        toast.success(`User "${deleteModalUser.name}" deleted from database!`);
        setDeleteModalUser(null);
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Network error deleting user');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter users by search & role
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'All' ||
      (roleFilter === 'admin' && u.role === 'admin') ||
      (roleFilter === 'registered' && u.isRegistered && u.role !== 'admin') ||
      (roleFilter === 'guest' && (!u.isRegistered || u.role === 'guest')) ||
      (roleFilter === 'customer' && u.role !== 'admin');

    return matchesSearch && matchesRole;
  });

  // Calculate Metrics
  const totalCustomersCount = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const registeredCount = users.filter((u) => u.isRegistered && u.role !== 'admin').length;
  const guestCount = users.filter((u) => !u.isRegistered || u.role === 'guest').length;
  const totalCustomerSpending = users.reduce((sum, u) => sum + (Number(u.totalSpent) || 0), 0);

  const formatJoinedDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
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
            <h2 className="text-xl font-bold text-slate-900 font-serif">Customer Directory & Store Accounts</h2>
            {/* <span className="bg-rose-50 text-[#ff2056] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-100">
              Live Store Database
            </span> */}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time customer directory with registered user profiles and checkout guest order details
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          title="Reload Customers"
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
              Total Customers
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCustomersCount}</h3>
            <span className="text-[10px] text-gray-500 font-medium">Registered & Guests</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Registered
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{registeredCount}</h3>
            <span className="text-[10px] text-emerald-600 font-medium">User accounts</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Guest Shoppers
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{guestCount}</h3>
            <span className="text-[10px] text-amber-600 font-medium">Checkout customers</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
              Total Revenue
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ৳ {totalCustomerSpending.toLocaleString('en-BD')}
            </h3>
            <span className="text-[10px] text-gray-500 font-medium">All customer purchases</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Role Filter Dropdown */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3.5 py-2 rounded-xl w-full sm:w-auto transition-colors">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Filter:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer pr-2"
            >
              <option value="All">All Customers ({totalCustomersCount})</option>
              <option value="registered">Registered Accounts ({registeredCount})</option>
              <option value="guest">Guest Shoppers ({guestCount})</option>
              <option value="admin">Admins ({adminCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Content Shell: Desktop Table + Mobile Cards */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-rose-200 border-t-[#ff2056] rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-gray-500">Loading customer directory from MongoDB...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="w-12 h-12 text-gray-300 mx-auto stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No Customers Found</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchTerm || roleFilter !== 'All'
                ? 'No customer records match your filter criteria.'
                : 'Customer profiles and checkout orders will appear here automatically.'}
            </p>
          </div>
        ) : (
          <>
            {/* 1. DESKTOP VIEW (Visible on tablet & desktop screens md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Role / Type</th>
                    <th className="py-3.5 px-4">Provider</th>
                    <th className="py-3.5 px-4">Joined / First Order</th>
                    <th className="py-3.5 px-4">Orders</th>
                    <th className="py-3.5 px-4">Total Spent</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-slate-800">
                  {filteredUsers.map((cust) => {
                    const isSelf =
                      cust._id === currentUser?._id ||
                      cust._id === currentUser?.id ||
                      cust.email === currentUser?.email;
                    const isUpdating = updatingUserId === cust._id;

                    return (
                      <tr key={cust._id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* User Avatar & Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {cust.avatar ? (
                              <img
                                src={cust.avatar}
                                alt={cust.name}
                                referrerPolicy="no-referrer"
                                crossOrigin="anonymous"
                                className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                              />
                            ) : (
                              <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${cust.role === 'admin'
                                ? 'bg-slate-900 text-white'
                                : cust.isRegistered
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-[#ff2056]'
                                }`}>
                                {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                <span>{cust.name}</span>
                                {isSelf && (
                                  <span className="text-[9px] bg-rose-50 text-[#ff2056] px-1.5 py-0.2 rounded font-bold border border-rose-100">
                                    You
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-gray-400">{cust.email}</p>
                              {cust.phone && (
                                <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                  <Phone className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                                  <span>{cust.phone}</span>
                                </p>
                              )}
                              {cust.address && (
                                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                                  <span className="truncate max-w-[160px]">{cust.address}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role / Customer Type Badge */}
                        <td className="py-3.5 px-4">
                          {cust.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-[#ff2056] border border-rose-200">
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </span>
                          ) : cust.role === 'guest' || !cust.isRegistered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                              <ShoppingBag className="w-3 h-3" />
                              Guest Shopper
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Customer
                            </span>
                          )}
                        </td>

                        {/* Auth Provider */}
                        <td className="py-3.5 px-4 capitalize font-medium text-gray-600">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${cust.authProvider === 'checkout' || !cust.isRegistered
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : cust.authProvider === 'google'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                            {cust.authProvider === 'checkout' || !cust.isRegistered ? 'Checkout' : cust.authProvider === 'google' ? 'Google' : 'Local'}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 text-gray-500 font-medium">
                          {formatJoinedDate(cust.createdAt)}
                        </td>

                        {/* Orders count */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                            {cust.totalOrders || 0}
                          </span>
                        </td>

                        {/* Total Spent */}
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          ৳ {Number(cust.totalSpent || 0).toLocaleString('en-BD')}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {cust.isRegistered ? (
                              <button
                                disabled={isSelf || isUpdating}
                                onClick={() => handleRoleToggle(cust._id, cust.role, cust.name)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isSelf
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : cust.role === 'admin'
                                    ? 'bg-gray-100 hover:bg-gray-200 text-slate-700'
                                    : 'bg-rose-50 hover:bg-[#ff2056] text-[#ff2056] hover:text-white'
                                  }`}
                              >
                                {isUpdating
                                  ? 'Updating...'
                                  : cust.role === 'admin'
                                    ? 'Remove Admin'
                                    : 'Make Admin'}
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-gray-400 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
                                Guest Shopper
                              </span>
                            )}

                            {!isSelf && (
                              <button
                                onClick={() => setDeleteModalUser(cust)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Customer Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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
              {filteredUsers.map((cust) => {
                const isSelf =
                  cust._id === currentUser?._id ||
                  cust._id === currentUser?.id ||
                  cust.email === currentUser?.email;
                const isUpdating = updatingUserId === cust._id;

                return (
                  <div key={cust._id} className="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
                    {/* Top Row: User Avatar + Name + Role Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        {cust.avatar ? (
                          <img
                            src={cust.avatar}
                            alt={cust.name}
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${cust.role === 'admin'
                            ? 'bg-slate-900 text-white'
                            : cust.isRegistered
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-[#ff2056]'
                            }`}>
                            {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm truncate flex items-center gap-1.5">
                            <span>{cust.name}</span>
                            {isSelf && (
                              <span className="text-[9px] bg-rose-50 text-[#ff2056] px-1.5 py-0.2 rounded font-bold">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">{cust.email}</p>
                          {cust.phone && (
                            <p className="text-[10px] text-slate-500 truncate">{cust.phone}</p>
                          )}
                        </div>
                      </div>

                      {cust.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 bg-rose-50 text-[#ff2056] border border-rose-200">
                          Admin
                        </span>
                      ) : cust.role === 'guest' || !cust.isRegistered ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 bg-amber-50 text-amber-800 border border-amber-200">
                          Guest
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Customer
                        </span>
                      )}
                    </div>

                    {/* Middle Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center text-[10px]">
                      <div>
                        <span className="text-gray-400 block font-medium">Provider</span>
                        <span className="font-bold text-slate-700 capitalize">
                          {cust.authProvider === 'checkout' || !cust.isRegistered ? 'Checkout' : cust.authProvider || 'Local'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-medium">Orders</span>
                        <span className="font-bold text-slate-900">{cust.totalOrders || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-medium">Total Spent</span>
                        <span className="font-black text-slate-900">৳ {Number(cust.totalSpent || 0).toLocaleString('en-BD')}</span>
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400 truncate max-w-[140px]">
                        {cust.address || `Joined ${formatJoinedDate(cust.createdAt)}`}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {cust.isRegistered ? (
                          <button
                            disabled={isSelf || isUpdating}
                            onClick={() => handleRoleToggle(cust._id, cust.role, cust.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isSelf
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : cust.role === 'admin'
                                ? 'bg-gray-100 hover:bg-gray-200 text-slate-700'
                                : 'bg-rose-50 hover:bg-[#ff2056] text-[#ff2056] hover:text-white'
                              }`}
                          >
                            {isUpdating
                              ? 'Updating...'
                              : cust.role === 'admin'
                                ? 'Remove Admin'
                                : 'Make Admin'}
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded bg-gray-50 border">
                            Guest
                          </span>
                        )}

                        {!isSelf && (
                          <button
                            onClick={() => setDeleteModalUser(cust)}
                            className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="Delete Customer Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>


      {/* Delete User Confirmation Modal */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#ff2056] flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Delete "{deleteModalUser.name}"?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to permanently delete user account <b className="text-slate-800">{deleteModalUser.email}</b> from MongoDB database? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteUser}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#ff2056] hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete User</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
