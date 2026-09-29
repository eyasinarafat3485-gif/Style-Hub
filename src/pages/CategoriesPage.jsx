import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid, Sparkles, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CategoriesPage = () => {
  const { categories, products } = useShop();

  // Dynamic Categories mapped directly from database (same logic as Home CategoryCircles)
  const displayCategories = useMemo(() => {
    let list = [];
    if (Array.isArray(categories) && categories.length > 0) {
      list = categories;
    } else {
      // If categories array is empty, derive from products in database
      const uniqueCatNames = Array.from(
        new Set((products || []).map((p) => p.category?.trim()).filter(Boolean))
      );
      list = uniqueCatNames.map((name) => ({ name }));
    }

    return list.map((c) => {
      const rawName = c.name?.trim() || 'Category';
      const catName = rawName.toLowerCase() === 'shirts' ? 'Shirt' : rawName;

      // Find matching products from database for image and item count
      const matchingProducts = (products || []).filter((p) => {
        if (!p.category) return false;
        const pCat = p.category.trim().toLowerCase();
        const targetCat = catName.toLowerCase();
        const origCat = rawName.toLowerCase();
        return (
          pCat === targetCat ||
          pCat === origCat ||
          pCat.startsWith(targetCat.replace(/s$/, '')) ||
          targetCat.startsWith(pCat.replace(/s$/, ''))
        );
      });

      const matchingProduct = matchingProducts[0];
      const productCount = matchingProducts.length;

      // Matching image: DB category image -> First matching product image -> Fallback
      const fallbackImage = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80';
      const imageUrl = c.image || matchingProduct?.image || fallbackImage;

      // Description from DB or derived from product count
      const description = c.description?.trim()
        ? c.description
        : productCount > 0
        ? `Browse through our handpicked collection of ${productCount} ${productCount === 1 ? 'premium item' : 'premium items'} in ${catName}.`
        : `Explore exclusive ${catName} collection crafted for comfort and style.`;

      // Dynamic tags extracted from real product attributes
      const dynamicTags = Array.from(
        new Set(
          matchingProducts
            .flatMap((p) => [
              p.brand,
              ...(Array.isArray(p.tags) ? p.tags : []),
              ...(Array.isArray(p.colors) ? p.colors.slice(0, 2) : []),
            ])
            .filter(Boolean)
        )
      ).slice(0, 4);

      return {
        id: c._id || c.id || catName,
        name: catName,
        slug: catName,
        description,
        productCount,
        image: imageUrl,
        tags: dynamicTags.length > 0 ? dynamicTags : ['Premium', 'Trending', 'New Arrival'],
      };
    });
  }, [categories, products]);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-[#ff2056] text-white py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-rose-700/80 px-3.5 py-1 rounded-full text-xs font-semibold text-rose-100 border border-rose-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Explore All Categories
          </h1>
          <p className="text-gray-100 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Browse through our wide range of premium fashion categories crafted for comfort, style and confidence.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#ff2056]" />
            <span>Available Categories</span>
          </h2>
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200">
            <ShoppingBag className="w-3.5 h-3.5 text-[#ff2056]" />
            {displayCategories.length} Categories
          </span>
        </div>

        {/* Categories Grid Cards */}
        {displayCategories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm">No categories found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((cat) => (
              <div
                key={cat.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[11px] font-bold text-rose-300 uppercase tracking-widest">
                      {cat.productCount > 0
                        ? `${cat.productCount} Product${cat.productCount > 1 ? 's' : ''}`
                        : 'Collection Available'}
                    </span>
                    <h3 className="font-serif text-2xl font-extrabold">{cat.name}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between bg-white">
                  <div>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                      {cat.description}
                    </p>
                    {cat.tags && cat.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {cat.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/shop?category=${encodeURIComponent(cat.slug || cat.name)}`}
                      className="inline-flex items-center justify-between w-full bg-slate-900 hover:bg-[#ff2056] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm group-hover:shadow cursor-pointer"
                    >
                      <span>Browse {cat.name}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
