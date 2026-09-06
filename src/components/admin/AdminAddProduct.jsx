import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Tag,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Layers,
  Check,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const AdminAddProduct = ({ setActiveTab }) => {
  const { addProduct } = useShop();

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Panjabi');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [countInStock, setCountInStock] = useState('50');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  
  // Badges & Variants
  const [isNew, setIsNew] = useState(true);
  const [isTrending, setIsTrending] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L', 'XL']);
  const [selectedColors, setSelectedColors] = useState(['Black', 'Navy Blue', 'White']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allCategories = ['Panjabi', 'Shirts', 'T-Shirts', 'Kurtis', 'Sarees', 'Men', 'Women', 'Kids'];
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34'];
  const availableColors = ['Black', 'White', 'Navy Blue', 'Maroon', 'Olive Green', 'Crimson Red', 'Beige'];

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price) {
      toast.warning('Please enter product title and price.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addProduct({
        title,
        name: title,
        category,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        countInStock: parseInt(countInStock) || 50,
        image:
          image ||
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
        description: description || 'Premium craftsmanship fashion wear from StyleHub Collection.',
        sizes: selectedSizes,
        colors: selectedColors,
        isNew,
        isTrending,
      });

      toast.success(`🎉 Product "${title}" published to live store catalog & database!`);

      // Reset Form
      setTitle('');
      setPrice('');
      setOldPrice('');
      setImage('');
      setDescription('');

      if (setActiveTab) {
        setActiveTab('products');
      }
    } catch (err) {
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('products')}
              className="p-2 rounded-xl bg-gray-100 hover:bg-slate-900 hover:text-white text-slate-700 transition-colors cursor-pointer"
              title="Back to Products"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <span>Create New Product</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#ff2056] text-[10px] font-bold uppercase border border-rose-200">
                Live Store Sync
              </span>
            </h2>
            <p className="text-xs text-gray-500">Publish new apparel items directly to StyleHub customer catalog</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
              <ShoppingBag className="w-4 h-4 text-[#ff2056]" />
              <span>General Product Information</span>
            </h3>

            {/* Product Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Product Name / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Embroidered Silk Panjabi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056] transition-all"
              />
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056] cursor-pointer"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Initial Stock Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="50"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Product Description</label>
              <textarea
                rows="4"
                placeholder="Detail the fabric material, care instructions, fit style, and craftsmanship..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056] transition-all"
              />
            </div>
          </div>

          {/* Card 2: Pricing */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Pricing Strategy</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Selling Price (৳ BDT) *</label>
                <input
                  type="number"
                  required
                  placeholder="3850"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Original Price (৳ BDT) (Optional)</label>
                <input
                  type="number"
                  placeholder="4500"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Variants (Sizes & Colors) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Sizes & Colors Variants</span>
            </h3>

            {/* Sizes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Available Sizes:</label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ff2056] text-white shadow-xs'
                          : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                      }`}
                    >
                      {sz} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">Available Color Options:</label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((col) => {
                  const isSelected = selectedColors.includes(col);
                  return (
                    <button
                      type="button"
                      key={col}
                      onClick={() => toggleColor(col)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {col} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Image Preview & Badges & Publish Action */}
        <div className="space-y-6">
          {/* Product Media Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Product Image</span>
            </h3>

            {/* Image Preview Window */}
            <div className="w-full h-56 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center relative">
              {image ? (
                <img
                  src={image}
                  alt="Product preview"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 space-y-2">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-400 font-medium">Image preview will appear here</p>
                </div>
              )}
            </div>

            {/* Image URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Image URL Link</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>
          </div>

          {/* Marketing Badges Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>Store Marketing Badges</span>
            </h3>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-rose-50/40 transition-colors">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 accent-[#ff2056] rounded"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">New Arrival Tag</span>
                <span className="text-[10px] text-gray-500">Displays "NEW" badge on shop cards</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-rose-50/40 transition-colors">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="w-4 h-4 accent-[#ff2056] rounded"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Trending Item Tag</span>
                <span className="text-[10px] text-gray-500">Highlights item in trending carousel</span>
              </div>
            </label>
          </div>

          {/* Submit Button Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-3">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#ff2056] to-[#d6103e] hover:from-[#d6103e] hover:to-[#b80830] text-white text-xs font-extrabold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Publish Product to Store</span>
            </button>

            {setActiveTab && (
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel & Return
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;
