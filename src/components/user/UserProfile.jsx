import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Image,
  Save,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
  Loader2,
  Camera,
  Upload,
  Trash2,
  MapPin,
  X,
  Edit2,
  Plus,
  Phone,
  Building,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [customDistrict, setCustomDistrict] = useState('');
  const [addressForm, setAddressForm] = useState({
    street: user?.address?.street || '',
    thana: user?.address?.thana || '',
    district: user?.address?.district || 'Dhaka - City',
    postalCode: user?.address?.postalCode || '',
    phone: user?.address?.phone || '',
    label: user?.address?.label || 'PRIMARY ADDRESS',
  });

  const openAddAddressModal = () => {
    setAddressForm({
      street: '',
      thana: '',
      district: 'Dhaka - City',
      postalCode: '',
      phone: '',
      label: 'PRIMARY ADDRESS',
    });
    setCustomDistrict('');
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = () => {
    const savedDistrict = user?.address?.district || 'Dhaka - City';
    const isStandard = districtOptions.includes(savedDistrict);
    setAddressForm({
      street: user?.address?.street || '',
      thana: user?.address?.thana || '',
      district: isStandard ? savedDistrict : 'Other District',
      postalCode: user?.address?.postalCode || '',
      phone: user?.address?.phone || '',
      label: user?.address?.label || 'PRIMARY ADDRESS',
    });
    setCustomDistrict(isStandard ? '' : savedDistrict);
    setIsAddressModalOpen(true);
  };

  // Synchronize state when user prop changes
  useEffect(() => {
    setName(user?.name || '');
    setAvatar(user?.avatar || '');
  }, [user]);

  // Check if main profile form data has been modified
  const currentName = (user?.name || '').trim();
  const currentAvatar = (user?.avatar || '').trim();
  const formName = name.trim();
  const formAvatar = avatar.trim();

  const isChanged = formName !== currentName || formAvatar !== currentAvatar;

  // Handle local file selection from user device
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setAvatar(reader.result);
        toast.info('Image selected from device! Click "Save Profile Changes" to update.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChanged || isSubmitting) return;

    if (!formName) {
      toast.error('Full Name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateProfile({
        name: formName,
        avatar: formAvatar,
      });

      if (result.success) {
        toast.success('Profile updated successfully! 🎉');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle saving new/updated delivery address
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.street.trim() || !addressForm.thana.trim() || !addressForm.phone.trim()) {
      toast.error('Please enter Address, Upazila/Thana, and Contact Phone Number');
      return;
    }

    const finalDistrict =
      addressForm.district === 'Other District'
        ? (customDistrict.trim() || 'Other District')
        : addressForm.district;

    if (addressForm.district === 'Other District' && !customDistrict.trim()) {
      toast.error('Please enter your custom district name');
      return;
    }

    setIsSavingAddress(true);
    try {
      const result = await updateProfile({
        address: {
          street: addressForm.street.trim(),
          thana: addressForm.thana.trim(),
          district: finalDistrict,
          postalCode: addressForm.postalCode.trim(),
          phone: addressForm.phone.trim(),
          label: addressForm.label.trim() || 'PRIMARY ADDRESS',
        },
      });

      if (result.success) {
        toast.success('Delivery address saved successfully! 📍');
        setIsAddressModalOpen(false);
      } else {
        toast.error(result.error || 'Failed to save address');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while saving address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const initialLetter = (formName || user?.email || 'U').charAt(0).toUpperCase();

  // Active address values to display in card
  const displayStreet = user?.address?.street || addressForm.street || 'House #42, Road #7, Dhanmondi';
  const displayThana = user?.address?.thana || addressForm.thana || 'Dhanmondi';
  const displayDistrict = user?.address?.district || addressForm.district || 'Dhaka';
  const displayPostal = user?.address?.postalCode || addressForm.postalCode || '1209';
  const displayPhone = user?.address?.phone || addressForm.phone || '01712-345678';
  const displayLabel = user?.address?.label || addressForm.label || 'PRIMARY ADDRESS';

  const districtOptions = [
    'Dhaka - City',
    'Dhaka',
    'Chittagong',
    'Gazipur',
    'Narayanganj',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Rangpur',
    'Mymensingh',
    'Comilla',
    'Bogura',
    'Jessore',
    'Cox\'s Bazar',
    'Feni',
    'Noakhali',
    'Tangail',
    'Kushtia',
    'Pabna',
    'Faridpur',
    'Other District',
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 font-serif">My Profile & Account Settings</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#ff2056] text-[10px] font-extrabold uppercase border border-rose-100">
              Personal Info
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Update your personal name, profile picture (URL or Device Upload), and view registered account details.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Account Secured & Verified</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Preview & Upload Header Section */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50/40 via-purple-50/20 to-slate-50 border border-gray-200/70 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group shrink-0">
            {formAvatar ? (
              <img
                src={formAvatar}
                alt={formName}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                }}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-rose-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white font-serif font-extrabold text-3xl flex items-center justify-center border-4 border-white shadow-md ring-2 ring-rose-200">
                {initialLetter}
              </div>
            )}

            {/* Quick Camera Overlay Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-slate-950/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
              title="Click to upload picture from device"
            >
              <Camera className="w-5 h-5 text-white" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
            </button>

            <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-200" title="Profile Avatar">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2056]" />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h4 className="text-base font-bold text-slate-900">{formName || 'Valued Member'}</h4>
            <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{user?.email}</span>
            </p>

            {/* Upload Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-gray-300 hover:border-rose-300 hover:bg-rose-50/50 text-slate-700 hover:text-[#ff2056] text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#ff2056]" />
                <span>Upload from Device</span>
              </button>

              {formAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatar('');
                    toast.info('Avatar cleared');
                  }}
                  className="px-2.5 py-1.5 text-gray-400 hover:text-rose-600 text-xs font-semibold rounded-xl hover:bg-rose-50 transition-all flex items-center gap-1 cursor-pointer"
                  title="Remove avatar image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-rose-500 font-medium pt-0.5">
              {isChanged ? '⚡ You have unsaved changes' : '✓ Profile details up to date'}
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#ff2056]" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff2056] focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 placeholder:text-gray-400 transition-all font-medium"
              required
            />
          </div>

          {/* Email Address (READONLY) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Address</span>
              </label>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Readonly</span>
              </span>
            </div>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-xs text-slate-600 font-semibold cursor-not-allowed select-none"
              title="Email address cannot be modified"
            />
            <p className="text-[10px] text-gray-400">
              Primary email address used for order receipts and login authentication.
            </p>
          </div>

          {/* Dual Avatar Options: Image URL & Device File */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-[#ff2056]" />
                <span>Avatar Image (URL or Device Upload)</span>
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold text-[#ff2056] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Choose File from Computer/Phone</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/my-photo.jpg or choose file above"
                className="w-full px-4 py-3 pr-24 rounded-xl border border-gray-300 focus:border-[#ff2056] focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 placeholder:text-gray-400 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-2 top-2 bottom-2 px-3 bg-rose-50 hover:bg-rose-100 text-[#ff2056] text-[11px] font-bold rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Browse</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-400">
              You can either paste a direct image URL (Google, Unsplash, Imgur) or click "Browse / Upload from Device" to pick an image file directly from your computer or phone.
            </p>
          </div>
        </div>

        {/* Readonly Account Meta Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Login Provider</span>
            <p className="text-xs font-bold text-slate-800 capitalize">{user?.authProvider || 'Local Account'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Member Role</span>
            <p className="text-xs font-bold text-[#ff2056] capitalize">{user?.role === 'admin' ? 'System Admin' : 'Regular User'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Security Level</span>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>256-bit SSL Protected</span>
            </p>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={!isChanged || isSubmitting}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isChanged && !isSubmitting
                ? 'bg-[#ff2056] hover:bg-[#d6103e] text-white shadow-md shadow-rose-500/30 cursor-pointer active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed shadow-none'
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isChanged ? 'Save Profile Changes' : 'Save Changes (No Changes)'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Dynamic Delivery Addresses Section */}
      <div className="pt-8 border-t border-gray-100 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-serif">Delivery Addresses</h3>
          <p className="text-xs text-gray-500">Manage shipping addresses for speedy checkout across Bangladesh</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary Address Card (Dynamic State) */}
          <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/20 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff2056] text-white text-[10px] font-extrabold uppercase tracking-wider">
                {displayLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openEditAddressModal}
                  className="p-1 rounded-lg text-rose-600 hover:bg-rose-100/80 transition-colors cursor-pointer"
                  title="Edit Address"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-[#ff2056]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">{user?.name || formName || 'Valued Customer'}</h4>
              <p className="text-xs text-slate-700 font-medium">{displayStreet}</p>
              <p className="text-xs text-slate-600">
                {displayThana ? `${displayThana}, ` : ''}{displayDistrict} {displayPostal ? `- ${displayPostal}` : ''}, Bangladesh
              </p>
              <p className="text-xs text-gray-500 pt-1 font-mono">Phone: {displayPhone}</p>
            </div>
          </div>

          {/* Add New Delivery Address Card Button */}
          <div
            onClick={openAddAddressModal}
            className="p-5 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-[#ff2056] hover:bg-rose-50/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 text-[#ff2056] group-hover:bg-[#ff2056] group-hover:text-white flex items-center justify-center font-bold text-lg transition-colors shadow-xs">
              +
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-[#ff2056] transition-colors">
              Add New Delivery Address
            </span>
            <p className="text-[11px] text-gray-400">Office or alternative location</p>
          </div>
        </div>
      </div>

      {/* ================= BANGLADESH ADDRESS CREATION / EDIT MODAL ================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden space-y-0">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-[#ff2056] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif">Add / Edit Delivery Address</h3>
                  <p className="text-xs text-slate-300">Bangladesh location & contact shipping info</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Address (House / Road / Area / Village)*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="House #42, Road #7, Dhanmondi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff2056] focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 font-medium placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Upazila/Thana & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Upazila/Thana*
                  </label>
                  <input
                    type="text"
                    value={addressForm.thana}
                    onChange={(e) => setAddressForm({ ...addressForm, thana: e.target.value })}
                    placeholder="Dhanmondi"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff2056] focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 font-medium placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    District*
                  </label>
                  <select
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff2056] focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 font-medium bg-white cursor-pointer"
                  >
                    {districtOptions.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>

                  {addressForm.district === 'Other District' && (
                    <input
                      type="text"
                      value={customDistrict}
                      onChange={(e) => setCustomDistrict(e.target.value)}
                      placeholder="Type custom district name (e.g. Natore, Bagerhat)"
                      className="w-full px-4 py-3 mt-2 rounded-xl border border-rose-300 focus:border-[#ff2056] focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 font-medium placeholder:text-gray-400 bg-rose-50/20 transition-all"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Postal Code & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Postal Code
                    </label>
                    <span className="text-[10px] text-gray-400 font-normal lowercase">(optional)</span>
                  </div>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    placeholder="1209 (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff2056] focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 font-medium placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contact Phone Number*
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="01712-345678"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff2056] focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 font-mono placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-slate-700 hover:bg-gray-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="px-6 py-2.5 rounded-xl bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  {isSavingAddress ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Address...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Address</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
