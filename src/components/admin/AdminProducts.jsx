import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  X,
  Image,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const AdminProducts = ({ isModalOpen, setIsModalOpen }) => {
  const { products, formatPrice, setQuickViewProduct, addProduct, deleteProduct } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Form State for Adding Product Modal
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOldPrice, setNewOldPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Panjabi');
  const [newImage, setNewImage] = useState('');
  const [newRating, setNewRating] = useState('4.8');
  const [newIsNew, setNewIsNew] = useState(true);
  const [newIsTrending, setNewIsTrending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories list
  const categories = ['All', 'Panjabi', 'Kurtis', 'Sarees', 'Men', 'Women', 'Kids', 'T-Shirts'];

  // Filter products safely without crash on missing title/name
  const filteredProducts = (products || []).filter((item) => {
    const titleText = (item?.title || item?.name || '').toLowerCase();
    const search = (searchTerm || '').toLowerCase();
    const matchesSearch = titleText.includes(search);
    const matchesCategory = selectedCategory === 'All' || item?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      toast.warning('Please enter product title and price.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addProduct({
        title: newTitle,
        name: newTitle,
        price: parseFloat(newPrice),
        oldPrice: newOldPrice ? parseFloat(newOldPrice) : null,
        category: newCategory,
        image:
          newImage ||
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
        rating: parseFloat(newRating) || 4.8,
        isNew: newIsNew,
        isTrending: newIsTrending,
        description: 'Exclusive premium craftsmanship fashion wear from StyleHub Collection.',
      });

      toast.success(`Product "${newTitle}" added to store catalog & database! 🎉`);

      // Reset Form
      setNewTitle('');
      setNewPrice('');
      setNewOldPrice('');
      setNewImage('');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    const itemTitle = title || 'this product';
    if (window.confirm(`Are you sure you want to remove "${itemTitle}"?`)) {
      await deleteProduct(id);
      toast.info(`Product "${itemTitle}" removed from catalog.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Product Button */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Product Inventory Management</h2>
          <p className="text-xs text-gray-500">
            Total {products.length} items in live store catalog
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4 justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-800">
              {filteredProducts.map((product) => {
                const displayTitle = product.title || product.name || 'Untitled Product';
                return (
                  <tr key={product.id} className="hover:bg-rose-50/30 transition-colors">
                    {/* Product Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={displayTitle}
                          className="w-12 h-14 rounded-lg object-cover border border-gray-200 shadow-xs shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{displayTitle}</p>
                          <span className="text-[11px] text-gray-400">ID: #{product.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 font-semibold text-slate-700">
                        {product.category || 'General'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        In Stock
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {product.isNew && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[9px] uppercase">
                            New
                          </span>
                        )}
                        {product.isTrending && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-[#ff2056] font-bold text-[9px] uppercase">
                            Trending
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-slate-900 hover:text-white text-gray-600 transition-colors cursor-pointer"
                          title="Preview Product"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, displayTitle)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-[#ff2056] text-[#ff2056] hover:text-white transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#ff2056]" />
                <h3 className="text-lg font-bold text-slate-900 font-serif">Add New Product to Store</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-slate-800 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Embroidered Silk Panjabi"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Selling Price (৳) *</label>
                  <input
                    type="number"
                    required
                    placeholder="3500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Original / Old Price (৳)</label>
                  <input
                    type="number"
                    placeholder="4200"
                    value={newOldPrice}
                    onChange={(e) => setNewOldPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
                  />
                </div>
              </div>

              {/* Category & Rating */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
                  >
                    {categories
                      .filter((c) => c !== 'All')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Initial Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Image URL (Unsplash or direct link)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>

              {/* Badges Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsNew}
                    onChange={(e) => setNewIsNew(e.target.checked)}
                    className="w-4 h-4 accent-[#ff2056] rounded"
                  />
                  <span className="text-xs font-semibold text-slate-700">Mark as New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsTrending}
                    onChange={(e) => setNewIsTrending(e.target.checked)}
                    className="w-4 h-4 accent-[#ff2056] rounded"
                  />
                  <span className="text-xs font-semibold text-slate-700">Mark as Trending</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white font-bold rounded-xl shadow-lg shadow-rose-600/25 cursor-pointer"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
