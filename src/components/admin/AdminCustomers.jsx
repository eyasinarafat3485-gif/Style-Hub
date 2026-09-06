import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCustomers = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [customers, setCustomers] = useState([
    {
      id: 'USR-101',
      name: currentUser?.name || 'Eyasin Arafat',
      email: currentUser?.email || 'eyasinwebdev@gmail.com',
      role: currentUser?.role || 'admin',
      authProvider: currentUser?.authProvider || 'google',
      avatar: currentUser?.avatar || '',
      joined: 'Sep 2026',
      totalOrders: 4,
      totalSpent: '৳ 14,200',
    },
    {
      id: 'USR-102',
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@gmail.com',
      role: 'user',
      authProvider: 'google',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      joined: 'Aug 2026',
      totalOrders: 6,
      totalSpent: '৳ 21,500',
    },
    {
      id: 'USR-103',
      name: 'Tanvir Hossain',
      email: 'tanvir.ctg@yahoo.com',
      role: 'user',
      authProvider: 'local',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      joined: 'Jul 2026',
      totalOrders: 2,
      totalSpent: '৳ 4,800',
    },
    {
      id: 'USR-104',
      name: 'Nusrat Jahan',
      email: 'nusrat.jahan@gmail.com',
      role: 'user',
      authProvider: 'google',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      joined: 'Jun 2026',
      totalOrders: 8,
      totalSpent: '৳ 32,400',
    },
  ]);

  const handleRoleToggle = (id, currentRole, name) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setCustomers(
      customers.map((c) => (c.id === id ? { ...c, role: newRole } : c))
    );
    toast.info(`Updated role for ${name} to "${newRole.toUpperCase()}"!`);
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Registered Customers & User Roles</h2>
          <p className="text-xs text-gray-500">Manage user accounts and role permissions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4 text-right">Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-800">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
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
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{cust.name}</p>
                        <p className="text-[11px] text-gray-400">{cust.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        cust.role === 'admin'
                          ? 'bg-rose-50 text-[#ff2056] border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {cust.role === 'admin' ? (
                        <>
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Customer
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 capitalize font-medium text-gray-600">
                    {cust.authProvider || 'Local'}
                  </td>

                  <td className="py-3.5 px-4 text-gray-500 font-medium">{cust.joined}</td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">{cust.totalOrders}</td>

                  <td className="py-3.5 px-4 font-extrabold text-slate-900">{cust.totalSpent}</td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRoleToggle(cust.id, cust.role, cust.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        cust.role === 'admin'
                          ? 'bg-gray-100 hover:bg-gray-200 text-slate-700'
                          : 'bg-rose-50 hover:bg-[#ff2056] text-[#ff2056] hover:text-white'
                      }`}
                    >
                      {cust.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
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

export default AdminCustomers;
