import React, { useState, useEffect } from 'react';
import {
  Truck,
  CreditCard,
  Banknote,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Settings as SettingsIcon,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  X,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [activeSubTab, setActiveSubTab] = useState('shipping'); // 'shipping' | 'payments' | 'general'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [settings, setSettings] = useState({
    storeName: 'StyleHub Fashion',
    supportEmail: 'support@stylehub.com',
    supportPhone: '+880 1700-000000',
    storeAddress: 'Dhanmondi, Dhaka, Bangladesh',
    currency: {
      code: 'BDT',
      symbol: '৳',
      name: 'Bangladeshi Taka',
    },
    shipping: {
      insideDhakaFee: 60,
      outsideDhakaFee: 120,
      freeShippingThreshold: 3000,
      estimatedDeliveryInside: '24-48 Hours',
      estimatedDeliveryOutside: '2-4 Days',
    },
    paymentMethods: [],
    orderNotifications: {
      emailAlerts: true,
      smsAlerts: true,
      notificationEmail: 'admin@stylehub.com',
    },
  });

  // Modal States for Payment Methods
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null); // null = Add, object = Edit
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    badge: '',
    description: '',
    accountNumber: '',
    instructions: '',
    icon: 'banknote',
    enabled: true,
  });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Delete Payment Modal
  const [deleteModalMethod, setDeleteModalMethod] = useState(null);
  const [isDeletingMethod, setIsDeletingMethod] = useState(false);

  // Fetch settings from MongoDB
  const fetchSettings = async (showToast = false) => {
    try {
      if (!showToast) setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        if (showToast) toast.success('Store settings refreshed from database!');
      }
    } catch (err) {
      console.error('Failed to fetch store settings:', err);
      toast.error('Failed to load settings from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Save general & shipping settings
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        toast.success('🎉 Store settings saved & applied to checkout live!');
      } else {
        toast.error(data.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Error saving settings to database.');
    } finally {
      setIsSaving(false);
    }
  };

  // Open Add/Edit Payment Method Modal
  const openAddPaymentModal = () => {
    setEditingMethod(null);
    setPaymentForm({
      name: '',
      badge: '',
      description: '',
      accountNumber: '',
      instructions: '',
      icon: 'banknote',
      enabled: true,
    });
    setIsPaymentModalOpen(true);
  };

  const openEditPaymentModal = (method) => {
    setEditingMethod(method);
    setPaymentForm({
      name: method.name || '',
      badge: method.badge || '',
      description: method.description || '',
      accountNumber: method.accountNumber || '',
      instructions: method.instructions || '',
      icon: method.icon || 'banknote',
      enabled: method.enabled !== false,
    });
    setIsPaymentModalOpen(true);
  };

  // Submit Add or Edit Payment Method
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.name.trim()) {
      toast.warning('Please enter a payment method name');
      return;
    }

    try {
      setIsSubmittingPayment(true);
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
      const isEdit = !!editingMethod;
      const url = isEdit
        ? `http://localhost:5000/api/settings/payment-methods/${editingMethod.id || editingMethod._id}`
        : 'http://localhost:5000/api/settings/payment-methods';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(paymentForm),
      });

      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        toast.success(
          isEdit
            ? `Payment method "${paymentForm.name}" updated!`
            : `🎉 Payment method "${paymentForm.name}" added successfully!`
        );
        setIsPaymentModalOpen(false);
      } else {
        toast.error(data.message || 'Failed to update payment method');
      }
    } catch (err) {
      console.error('Error updating payment method:', err);
      toast.error('Failed to save payment method.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Quick Toggle Payment Enabled/Disabled
  const handleTogglePaymentEnabled = async (method) => {
    try {
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
      const targetId = method.id || method._id;
      const updatedEnabled = !method.enabled;

      const res = await fetch(`http://localhost:5000/api/settings/payment-methods/${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ enabled: updatedEnabled }),
      });

      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        toast.info(
          `Payment method "${method.name}" ${updatedEnabled ? 'Enabled' : 'Disabled'} for checkout.`
        );
      }
    } catch (err) {
      console.error('Error toggling payment method:', err);
      toast.error('Failed to toggle status.');
    }
  };

  // Delete Payment Method
  const handleDeletePayment = async () => {
    if (!deleteModalMethod) return;
    try {
      setIsDeletingMethod(true);
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
      const targetId = deleteModalMethod.id || deleteModalMethod._id;

      const res = await fetch(`http://localhost:5000/api/settings/payment-methods/${targetId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        toast.success(`Payment method "${deleteModalMethod.name}" deleted.`);
        setDeleteModalMethod(null);
      } else {
        toast.error(data.message || 'Failed to delete payment method');
      }
    } catch (err) {
      console.error('Error deleting payment method:', err);
      toast.error('Failed to delete payment method.');
    } finally {
      setIsDeletingMethod(false);
    }
  };

  const getMethodIconComponent = (iconType) => {
    switch (iconType) {
      case 'mobile':
        return <Phone className="w-4 h-4 text-pink-600" />;
      case 'card':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      default:
        return <Banknote className="w-4 h-4 text-emerald-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 shadow-xs flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-rose-200 border-t-[#ff2056] rounded-full animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading store configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#ff2056] border border-rose-100 flex items-center justify-center shrink-0 shadow-xs">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Store Settings & Operations
              </h2>
              {/* <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Live Synced
              </span> */}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure dynamic shipping delivery fees, checkout payment gateways, and store rules.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5 self-center sm:self-auto w-full sm:w-auto pt-1 sm:pt-0">
          <button
            type="button"
            onClick={() => fetchSettings(true)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
            title="Refresh database settings"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Segment Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl w-fit border border-slate-200/60 flex-wrap">
        {[
          { id: 'shipping', label: '🚚 Shipping & Delivery Rates', icon: Truck },
          { id: 'payments', label: '💳 Payment Gateways & Wallets', icon: CreditCard },
          { id: 'general', label: '🏬 Store Profile & Currency', icon: Store },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeSubTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= TAB 1: SHIPPING & DELIVERY ================= */}
      {activeSubTab === 'shipping' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#ff2056]" />
                  <span>Delivery Zones & Shipping Cost</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  These fees are dynamically calculated during customer checkout across Bangladesh.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inside Dhaka Delivery Fee */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Inside Dhaka Delivery Fee</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-slate-700">
                    ৳ {settings.shipping?.insideDhakaFee} BDT
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={settings.shipping?.insideDhakaFee || 0}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        shipping: { ...prev.shipping, insideDhakaFee: Number(e.target.value) },
                      }))
                    }
                    className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900 focus:border-[#ff2056] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">Estimated Delivery Timeframe</label>
                  <input
                    type="text"
                    value={settings.shipping?.estimatedDeliveryInside || '24-48 Hours'}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        shipping: { ...prev.shipping, estimatedDeliveryInside: e.target.value },
                      }))
                    }
                    placeholder="e.g. 24-48 Hours"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-slate-700 focus:border-[#ff2056] outline-none"
                  />
                </div>
              </div>

              {/* Outside Dhaka Delivery Fee */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Outside Dhaka (All Bangladesh) Fee</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-slate-700">
                    ৳ {settings.shipping?.outsideDhakaFee} BDT
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={settings.shipping?.outsideDhakaFee || 0}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        shipping: { ...prev.shipping, outsideDhakaFee: Number(e.target.value) },
                      }))
                    }
                    className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900 focus:border-[#ff2056] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">Estimated Delivery Timeframe</label>
                  <input
                    type="text"
                    value={settings.shipping?.estimatedDeliveryOutside || '2-4 Days'}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        shipping: { ...prev.shipping, estimatedDeliveryOutside: e.target.value },
                      }))
                    }
                    placeholder="e.g. 2-4 Days"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-slate-700 focus:border-[#ff2056] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Free Delivery Threshold */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-md">
                <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Shipping Promotion Threshold</span>
                </span>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Orders with total cart value equal or greater than this amount will automatically get free delivery at checkout.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-700">Min Order:</span>
                <div className="relative w-40">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={settings.shipping?.freeShippingThreshold || 3000}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        shipping: { ...prev.shipping, freeShippingThreshold: Number(e.target.value) },
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:border-emerald-500 outline-none shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Shipping Rates</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PAYMENT METHODS ================= */}
      {activeSubTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#ff2056]" />
                  <span>Customer Checkout Payment Gateways</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage active payment methods, account instructions, and add custom payment channels.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddPaymentModal}
                className="px-4 py-2 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Payment Method</span>
              </button>
            </div>

            {/* Payment Methods Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(!settings.paymentMethods || settings.paymentMethods.length === 0) ? (
                <div className="col-span-full text-center py-12 space-y-3 bg-stone-50/50 rounded-2xl border border-dashed border-gray-200">
                  <CreditCard className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No Payment Methods Configured</p>
                  <p className="text-[11px] text-gray-400">Click "+ Add Payment Method" above to add your first gateway.</p>
                </div>
              ) : (
                settings.paymentMethods.map((method) => {
                  const isEnabled = method.enabled !== false;
                  return (
                    <div
                      key={method.id || method._id}
                      className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${isEnabled
                          ? 'bg-white border-slate-200 shadow-xs hover:border-rose-200'
                          : 'bg-slate-50/80 border-slate-200 opacity-60'
                        }`}
                    >
                      <div className="space-y-2.5">
                        {/* Top Row: Icon + Name + Badge + Toggle */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              {getMethodIconComponent(method.icon)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{method.name}</h4>
                              {method.badge && (
                                <span className="inline-block text-[9px] font-black bg-rose-50 text-[#ff2056] px-1.5 py-0.2 rounded border border-rose-100">
                                  {method.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleTogglePaymentEnabled(method)}
                            className="text-slate-700 hover:text-[#ff2056] cursor-pointer"
                            title={isEnabled ? 'Disable payment method' : 'Enable payment method'}
                          >
                            {isEnabled ? (
                              <ToggleRight className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-gray-400" />
                            )}
                          </button>
                        </div>

                        {/* Description */}
                        {method.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                            {method.description}
                          </p>
                        )}

                        {/* Account Number & Instructions */}
                        {method.accountNumber && (
                          <div className="p-2 bg-slate-50 rounded-lg text-[10px] font-mono text-slate-700 border border-slate-100 flex items-center justify-between">
                            <span className="text-gray-400">Account:</span>
                            <span className="font-bold">{method.accountNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                        <span className={`text-[10px] font-bold ${isEnabled ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {isEnabled ? '● Active in Checkout' : '○ Disabled'}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditPaymentModal(method)}
                            className="p-1.5 text-slate-600 hover:text-[#ff2056] hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Method"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModalMethod(method)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Method"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: GENERAL & CURRENCY ================= */}
      {activeSubTab === 'general' && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-[#ff2056]" />
              <span>General Store Profile & Currency</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Official store identity, support helpline contact details, and currency display symbol.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Store Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Official Store Name</label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))}
                placeholder="e.g. StyleHub Fashion"
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#ff2056] outline-none"
              />
            </div>

            {/* Support Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>Customer Support Helpline</span>
              </label>
              <input
                type="text"
                value={settings.supportPhone || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, supportPhone: e.target.value }))}
                placeholder="+880 1700-000000"
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#ff2056] outline-none"
              />
            </div>

            {/* Support Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-400" />
                <span>Support Email Address</span>
              </label>
              <input
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))}
                placeholder="support@stylehub.com"
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#ff2056] outline-none"
              />
            </div>

            {/* Store Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>Warehouse / HQ Location</span>
              </label>
              <input
                type="text"
                value={settings.storeAddress || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeAddress: e.target.value }))}
                placeholder="Dhanmondi, Dhaka, Bangladesh"
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#ff2056] outline-none"
              />
            </div>

            {/* Currency Parameters */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 sm:col-span-2">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Store Primary Currency</span>
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 block font-bold">Currency Code</label>
                  <input
                    type="text"
                    value={settings.currency?.code || 'BDT'}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        currency: { ...prev.currency, code: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block font-bold">Display Symbol</label>
                  <input
                    type="text"
                    value={settings.currency?.symbol || '৳'}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        currency: { ...prev.currency, symbol: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block font-bold">Currency Name</label>
                  <input
                    type="text"
                    value={settings.currency?.name || 'Bangladeshi Taka'}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        currency: { ...prev.currency, name: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save General Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Payment Method */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden space-y-4">
            <div className="p-5 bg-stone-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#ff2056]" />
                <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base">
                  {editingMethod ? `Edit "${editingMethod.name}"` : 'Add New Payment Method'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-slate-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-1">
                  <span>Method Display Name</span>
                  <span className="text-[#ff2056]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. bKash Personal / Rocket / Bank Transfer"
                  value={paymentForm.name}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] outline-none font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Badge Label (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular, 0% Fee"
                    value={paymentForm.badge}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Icon Type</label>
                  <select
                    value={paymentForm.icon}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] outline-none font-medium"
                  >
                    <option value="banknote">💵 Cash / Banknote</option>
                    <option value="mobile">📱 Mobile Banking (bKash/Nagad)</option>
                    <option value="card">💳 Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Account / Merchant Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 01712-345678 (Merchant) or IBAN"
                  value={paymentForm.accountNumber}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({ ...prev, accountNumber: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Description for Customer</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Send payment with order ID as reference."
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ff2056] outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="enabledCheckbox"
                  checked={paymentForm.enabled}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 text-[#ff2056] rounded focus:ring-[#ff2056]"
                />
                <label htmlFor="enabledCheckbox" className="font-bold text-slate-700 cursor-pointer">
                  Enable and show in Customer Checkout immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-gray-100 hover:bg-gray-200 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-5 py-2 rounded-xl bg-[#ff2056] hover:bg-[#d6103e] text-white font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingPayment ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingMethod ? 'Update Gateway' : 'Add Gateway'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteModalMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#ff2056] flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Delete "{deleteModalMethod.name}"?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to remove this payment method from customer checkout options?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingMethod}
                onClick={() => setDeleteModalMethod(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingMethod}
                onClick={handleDeletePayment}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#ff2056] hover:bg-[#d6103e] transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                {isDeletingMethod ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Method</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
