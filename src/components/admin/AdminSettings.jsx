import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react';
import {
  Truck,
  CreditCard,
  Banknote,
  Plus,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  X,
  Settings as SettingsIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '../../context/SiteSettingsContext';

const AdminSettings = () => {
  const { settings: globalSettings, updateSiteSettings, refreshSettings: contextRefresh } = useSiteSettings();
  const [activeSubTab, setActiveSubTab] = useState('shipping'); // 'shipping' | 'payments'
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [settings, setSettings] = useState(() => globalSettings || DEFAULT_SITE_SETTINGS);

  // Sync settings when globalSettings is loaded/updated
  useEffect(() => {
    if (globalSettings) {
      setSettings(globalSettings);
    }
  }, [globalSettings]);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
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
      await contextRefresh();
      if (showToast) toast.success('Settings refreshed from server!');
    } catch (err) {
      console.error('Failed to fetch store settings:', err);
      toast.error('Failed to load settings from server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save all settings
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      const res = await updateSiteSettings(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Server connection error while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  // Payment Methods Handling
  const handleOpenPaymentModal = (method = null) => {
    if (method) {
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
    } else {
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
    }
    setIsPaymentModalOpen(true);
  };

  const handleSavePaymentMethod = async (e) => {
    e.preventDefault();
    if (!paymentForm.name.trim()) {
      toast.error('Payment method name is required');
      return;
    }

    try {
      setIsSubmittingPayment(true);
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');

      let res;
      if (editingMethod) {
        const id = editingMethod.id || editingMethod._id;
        res = await fetch(`${API_BASE_URL}/settings/payment-methods/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(paymentForm),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/settings/payment-methods`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(paymentForm),
        });
      }

      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        toast.success(
          editingMethod
            ? 'Payment method updated successfully!'
            : 'New payment method added!'
        );
        setIsPaymentModalOpen(false);
      } else {
        toast.error(data.message || 'Failed to save payment method');
      }
    } catch (err) {
      console.error('Error saving payment method:', err);
      toast.error('Failed to save payment method.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleDeletePaymentMethod = async () => {
    if (!deleteModalMethod) return;

    try {
      setIsDeletingMethod(true);
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
      const id = deleteModalMethod.id || deleteModalMethod._id;

      const res = await fetch(`${API_BASE_URL}/settings/payment-methods/${id}`, {
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

  const handleTogglePaymentMethod = async (method) => {
    const updated = !method.enabled;
    try {
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
      const id = method.id || method._id;

      const res = await fetch(`${API_BASE_URL}/settings/payment-methods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ enabled: updated }),
      });

      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        toast.success(
          `${method.name} ${updated ? 'Enabled' : 'Disabled'} for checkout.`
        );
      }
    } catch (err) {
      toast.error('Failed to toggle payment method');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 shadow-xs flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-rose-200 border-t-[#ff2056] rounded-full animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading store settings...</p>
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
                Store Settings
              </h2>
              <span className="text-[10px] bg-rose-50 text-[#ff2056] font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                Dynamic
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage shipping delivery rates, timelines, and checkout payment gateway methods.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
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
            className="px-5 py-2.5 bg-[#ff2056] hover:bg-[#e01648] text-white rounded-xl shadow-md hover:shadow-lg transition-all text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        {[
          { id: 'shipping', label: '🚚 Shipping & Delivery', icon: Truck },
          { id: 'payments', label: '💳 Payment Methods', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-gray-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff2056]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. SHIPPING & LOGISTICS SUBTAB */}
      {activeSubTab === 'shipping' && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Truck className="w-4 h-4 text-[#ff2056]" />
            <h3 className="font-bold text-slate-900 text-sm">Delivery Rates & Free Shipping Rules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Inside Dhaka Fee (৳)</label>
              <input
                type="number"
                value={settings.shipping?.insideDhakaFee || 60}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, insideDhakaFee: Number(e.target.value) },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Outside Dhaka Fee (৳)</label>
              <input
                type="number"
                value={settings.shipping?.outsideDhakaFee || 120}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, outsideDhakaFee: Number(e.target.value) },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Free Shipping Threshold (৳)</label>
              <input
                type="number"
                value={settings.shipping?.freeShippingThreshold || 3000}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, freeShippingThreshold: Number(e.target.value) },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Inside Dhaka Timeline</label>
              <input
                type="text"
                value={settings.shipping?.estimatedDeliveryInside || '24-48 Hours'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, estimatedDeliveryInside: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Outside Dhaka Timeline</label>
              <input
                type="text"
                value={settings.shipping?.estimatedDeliveryOutside || '2-4 Days'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, estimatedDeliveryOutside: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYMENT METHODS SUBTAB */}
      {activeSubTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#ff2056]" />
                <span>Active Checkout Payment Gateways</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Enable or disable payment channels (bKash, Nagad, Cash on Delivery, Cards)
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenPaymentModal(null)}
              className="px-3.5 py-2 bg-[#ff2056] hover:bg-[#e01648] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Payment Method</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(settings.paymentMethods || []).map((method) => (
              <div
                key={method.id || method._id}
                className={`p-5 rounded-2xl border transition-all ${
                  method.enabled
                    ? 'border-gray-200 bg-white shadow-xs'
                    : 'border-dashed border-gray-300 bg-slate-50/70 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{method.name}</h4>
                      {method.badge && (
                        <span className="text-[10px] bg-rose-50 text-[#ff2056] font-bold px-2 py-0.5 rounded">
                          {method.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePaymentMethod(method)}
                    className="cursor-pointer"
                  >
                    {method.enabled ? (
                      <ToggleRight className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-600 mt-3 leading-relaxed">{method.description}</p>

                <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleOpenPaymentModal(method)}
                    className="p-1.5 text-slate-600 hover:text-[#ff2056] hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteModalMethod(method)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSavePaymentMethod} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Method Name</label>
                <input
                  type="text"
                  required
                  value={paymentForm.name}
                  onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold"
                  placeholder="e.g. bKash Personal (+8801700000000)"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  value={paymentForm.badge}
                  onChange={(e) => setPaymentForm({ ...paymentForm, badge: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs"
                  placeholder="e.g. 0% Fee / Instant"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description / Help Text</label>
                <textarea
                  rows={2}
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs"
                  placeholder="Payment instructions shown to customers at checkout"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-5 py-2 bg-[#ff2056] text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  {isSubmittingPayment ? 'Saving...' : editingMethod ? 'Update Method' : 'Add Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Payment Confirmation Modal */}
      {deleteModalMethod && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Delete Payment Method?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-bold">"{deleteModalMethod.name}"</span>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalMethod(null)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePaymentMethod}
                disabled={isDeletingMethod}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                {isDeletingMethod ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
