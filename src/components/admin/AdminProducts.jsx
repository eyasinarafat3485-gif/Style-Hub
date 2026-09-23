import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const AdminProducts = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, formatPrice, deleteProduct } = useShop();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    const querySearch = searchParams.get('search');
    const queryCategory = searchParams.get('category');
    if (querySearch !== null) setSearchTerm(querySearch);
    if (queryCategory !== null) setSelectedCategory(queryCategory);
  }, [searchParams]);

  // Categories list
  const categories = ['All', 'Panjabi', 'Men', 'Women', 'T-Shirts'];

  // Filter products safely without crash on missing title/name
  const filteredProducts = (products || []).filter((item) => {
    const titleText = (item?.title || item?.name || '').toLowerCase();
    const search = (searchTerm || '').toLowerCase();
    const matchesSearch = titleText.includes(search);
    const matchesCategory = selectedCategory === 'All' || item?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [deleteProductModal, setDeleteProductModal] = useState({
    isOpen: false,
    id: null,
    title: '',
    isDeleting: false,
  });

  const promptDeleteProduct = (id, title) => {
    setDeleteProductModal({
      isOpen: true,
      id,
      title: title || 'this product',
      isDeleting: false,
    });
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deleteProductModal.id) return;
    setDeleteProductModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteProduct(deleteProductModal.id);
      toast.info(`Product "${deleteProductModal.title}" removed from catalog.`);
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setDeleteProductModal({ isOpen: false, id: null, title: '', isDeleting: false });
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
          onClick={() => (setActiveTab ? setActiveTab('add-product') : navigate('/dashboard/add-product'))}
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

      {/* Products Display: Desktop Table + Mobile Responsive Cards */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No Products Found</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchTerm || selectedCategory !== 'All'
                ? 'No products match your search or filter criteria.'
                : 'Your store catalog is empty. Click "+ Add New Product" to get started.'}
            </p>
          </div>
        ) : (
          <>
            {/* 1. DESKTOP & TABLET TABLE VIEW (md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[720px]">
                <thead>
                  <tr className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 text-[11px]">
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
                              <span className="text-[11px] text-gray-400 font-mono">ID: #{product.id}</span>
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
                              onClick={() => navigate(`/product/${product.id || product._id}`)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-slate-900 hover:text-white text-gray-600 transition-colors cursor-pointer"
                              title="Preview Product Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => promptDeleteProduct(product.id, displayTitle)}
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

            {/* 2. MOBILE RESPONSIVE CARD VIEW (< md) */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const displayTitle = product.title || product.name || 'Untitled Product';
                return (
                  <div key={product.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <img
                        src={product.image}
                        alt={displayTitle}
                        className="w-16 h-18 rounded-xl object-cover border border-gray-200 shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {product.category || 'General'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            #{String(product.id).slice(-6)}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                          {displayTitle}
                        </h4>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {formatPrice(product.price)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          In Stock
                        </span>
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

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/product/${product.id || product._id}`)}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-slate-900 hover:text-white text-gray-700 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => promptDeleteProduct(product.id, displayTitle)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-[#ff2056] text-[#ff2056] hover:text-white transition-colors cursor-pointer"
                          title="Delete Product"
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

      {/* Delete Product Confirmation Modal */}
      {deleteProductModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-gray-100 text-center space-y-5 animate-scaleUp relative">
            <button
              onClick={() => setDeleteProductModal({ isOpen: false, id: null, title: '', isDeleting: false })}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#ff2056] border border-rose-100 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold font-serif text-slate-900">
                Delete Product?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-sans">
                Are you sure you want to remove <strong className="text-slate-900 font-bold">"{deleteProductModal.title}"</strong>? This item will be removed permanently from the store catalog.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteProductModal({ isOpen: false, id: null, title: '', isDeleting: false })}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteProductModal.isDeleting}
                onClick={handleConfirmDeleteProduct}
                className="w-1/2 py-2.5 bg-[#ff2056] hover:bg-[#d6103e] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleteProductModal.isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
