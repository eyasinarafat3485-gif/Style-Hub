import { API_BASE_URL } from '../config/api';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

const initialProducts = [
  {
    id: "1",
    name: "Premium Polo T-Shirt",
    slug: "premium-polo-t-shirt",
    category: "T-Shirts",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80",
    price: 1199,
    oldPrice: 1499,
    discountBadge: "-20%",
    rating: 5.0,
    reviewCount: 125,
    isTrending: true,
    description: "Tailored fit navy blue polo crafted from 100% pique cotton. Breathable and comfortable for all-day wear.",
    colors: ["Navy Blue", "Black", "White"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "2",
    name: "Linen Casual Shirt",
    slug: "linen-casual-shirt",
    category: "Shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    price: 1799,
    oldPrice: null,
    discountBadge: "New",
    rating: 5.0,
    reviewCount: 96,
    isTrending: true,
    description: "Lightweight organic linen shirt designed for Bangladesh's warm climate.",
    colors: ["Beige", "Olive Green"],
    sizes: ["M", "L", "XL"]
  },
  {
    id: "3",
    name: "Oversized T-Shirt",
    slug: "oversized-t-shirt",
    category: "T-Shirts",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    price: 899,
    oldPrice: 1059,
    discountBadge: "-15%",
    rating: 5.0,
    reviewCount: 75,
    isTrending: true,
    description: "Streetwear aesthetic heavy cotton oversized drop-shoulder t-shirt.",
    colors: ["Crisp White", "Charcoal Gray"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "4",
    name: "Check Shirt",
    slug: "check-shirt",
    category: "Shirts",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
    price: 1499,
    oldPrice: null,
    discountBadge: "New",
    rating: 5.0,
    reviewCount: 64,
    isTrending: true,
    description: "Classic plaid check pattern shirt with soft brushed cotton finish.",
    colors: ["Navy/Brown Check"],
    sizes: ["M", "L", "XL"]
  },
  {
    id: "5",
    name: "Denim Jeans",
    slug: "denim-jeans",
    category: "Men",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    price: 2099,
    oldPrice: 2399,
    discountBadge: "-13%",
    rating: 5.0,
    reviewCount: 53,
    isTrending: true,
    description: "Slim tapered dark wash stretch denim jeans with custom fit.",
    colors: ["Indigo Blue"],
    sizes: ["30", "32", "34"]
  },
  {
    id: "6",
    name: "Basic Hoodie",
    slug: "basic-hoodie",
    category: "Men",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    price: 1399,
    oldPrice: null,
    discountBadge: "Hot",
    rating: 5.0,
    reviewCount: 87,
    isTrending: true,
    description: "Cozy fleece-lined pullover hoodie with adjustable matching drawstrings.",
    colors: ["Heather Gray", "Black"],
    sizes: ["M", "L", "XL"]
  }
];

const normalizeProduct = (p) => ({
  ...p,
  id: String(p.id || p._id || Date.now()),
  name: p.name || p.title || 'Untitled Product',
  title: p.title || p.name || 'Untitled Product',
  price: Number(p.price) || 0,
  image: p.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
  category: p.category || 'General',
  inStock: p.inStock !== false && (p.countInStock === undefined || p.countInStock > 0),
});

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts.map(normalizeProduct));
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Metadata States
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [attributes, setAttributes] = useState([]);

  // Fetch Categories from Backend
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.warn('Failed to fetch categories:', err.message);
    }
  };

  // Fetch Brands from Backend
  const fetchBrands = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/brands`);
      const data = await res.json();
      if (data.success && Array.isArray(data.brands)) {
        setBrands(data.brands);
      }
    } catch (err) {
      console.warn('Failed to fetch brands:', err.message);
    }
  };

  // Fetch Tags from Backend
  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tags`);
      const data = await res.json();
      if (data.success && Array.isArray(data.tags)) {
        setTags(data.tags);
      }
    } catch (err) {
      console.warn('Failed to fetch tags:', err.message);
    }
  };

  // Fetch Attributes from Backend
  const fetchAttributes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/attributes`);
      const data = await res.json();
      if (data.success && Array.isArray(data.attributes)) {
        setAttributes(data.attributes);
      }
    } catch (err) {
      console.warn('Failed to fetch attributes:', err.message);
    }
  };

  const fetchUserCollections = async () => {
    const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/my-collections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (Array.isArray(data.cart)) {
          setCart(
            data.cart.map((item) => ({
              ...item,
              id: item.productId,
              title: item.name,
              name: item.name,
              price: item.price,
              image: item.image,
              selectedSize: item.selectedSize || 'M',
              selectedColor: item.selectedColor || '',
              quantity: item.quantity || 1,
            }))
          );
        }
        if (Array.isArray(data.wishlist)) {
          setWishlist(
            data.wishlist.map((item) => ({
              ...item,
              id: item.productId,
              title: item.name,
              name: item.name,
              price: item.price,
              image: item.image,
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Failed to load user collections from MongoDB:', err.message);
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.map(normalizeProduct));
        }
      })
      .catch((err) => {
        console.log("Connected to frontend fallback data mode", err);
      });

    fetchUserCollections();
    fetchCategories();
    fetchBrands();
    fetchTags();
    fetchAttributes();
  }, []);

  // Category Add / Delete API
  const addCategory = async (categoryData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategories((prev) => [data.category, ...prev]);
        return { success: true, category: data.category };
      } else {
        return { success: false, message: data.message || 'Failed to add category' };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => String(c._id || c.id) !== String(id)));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
    return { success: false };
  };

  // Brand Add / Delete API
  const addBrand = async (brandData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData),
      });
      const data = await res.json();
      if (data.success && data.brand) {
        setBrands((prev) => [data.brand, ...prev]);
        return { success: true, brand: data.brand };
      } else {
        return { success: false, message: data.message || 'Failed to add brand' };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteBrand = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/brands/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setBrands((prev) => prev.filter((b) => String(b._id || b.id) !== String(id)));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to delete brand:', err);
    }
    return { success: false };
  };

  // Tag Add / Delete API
  const addTag = async (tagData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData),
      });
      const data = await res.json();
      if (data.success && data.tag) {
        setTags((prev) => [data.tag, ...prev]);
        return { success: true, tag: data.tag };
      } else {
        return { success: false, message: data.message || 'Failed to add tag' };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteTag = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tags/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setTags((prev) => prev.filter((t) => String(t._id || t.id) !== String(id)));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to delete tag:', err);
    }
    return { success: false };
  };

  // Attribute Add / Delete API
  const addAttribute = async (attrData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/attributes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attrData),
      });
      const data = await res.json();
      if (data.success && data.attribute) {
        setAttributes((prev) => [data.attribute, ...prev]);
        return { success: true, attribute: data.attribute };
      } else {
        return { success: false, message: data.message || 'Failed to add attribute' };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteAttribute = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/attributes/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setAttributes((prev) => prev.filter((a) => String(a._id || a.id) !== String(id)));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to delete attribute:', err);
    }
    return { success: false };
  };

  const addProduct = async (productData) => {
    try {
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: productData.title || productData.name,
          title: productData.title || productData.name,
          price: Number(productData.price),
          oldPrice: productData.oldPrice ? Number(productData.oldPrice) : null,
          category: productData.category || 'Panjabi',
          image: productData.image,
          description: productData.description || 'Premium product from StyleHub Collection.',
          countInStock: Number(productData.countInStock) || 50,
          sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
          colors: productData.colors || ['Black', 'White'],
          isTrending: Boolean(productData.isTrending),
          isNewArrival: productData.isNew !== undefined ? Boolean(productData.isNew) : true,
        }),
      });

      if (response.ok) {
        const savedData = await response.json();
        const normalized = normalizeProduct(savedData);
        setProducts((prev) => [normalized, ...prev]);
        return { success: true, product: normalized };
      } else {
        const normalized = normalizeProduct({
          ...productData,
          id: String(Date.now()),
        });
        setProducts((prev) => [normalized, ...prev]);
        return { success: true, product: normalized };
      }
    } catch (error) {
      console.error('Error adding product to backend:', error);
      const normalized = normalizeProduct({
        ...productData,
        id: String(Date.now()),
      });
      setProducts((prev) => [normalized, ...prev]);
      return { success: true, product: normalized };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
      await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.error('Error deleting product:', err);
    }
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const formatPrice = (amount) => {
    return `৳${Number(amount || 0).toLocaleString('en-BD')}`;
  };

  const addToCart = async (product, quantity = 1, size = 'M', color = '', options = {}) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => String(item.id) === String(product.id) && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity,
            selectedSize: size,
            selectedColor: color || (product.colors ? product.colors[0] : ''),
          },
        ];
      }
    });
    setIsCartOpen(true);

    const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/my-collections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemType: 'cart',
            productId: String(product.id || product._id),
            name: product.name || product.title || 'Product',
            price: Number(product.price) || 0,
            image: product.image || '',
            category: product.category || 'General',
            quantity: Number(quantity) || 1,
            selectedSize: size || 'M',
            selectedColor: color || '',
            fromWishlist: !!options?.fromWishlist,
          }),
        });
      } catch (err) {
        console.warn('MyCollection cart sync error:', err.message);
      }
    }
  };

  const removeFromCart = async (idOrItem, selectedSize) => {
    let targetProductId = '';
    let targetMongoId = '';
    let targetSize = selectedSize;

    if (typeof idOrItem === 'object' && idOrItem !== null) {
      targetProductId = String(idOrItem.productId || idOrItem.id || idOrItem._id || '');
      targetMongoId = String(idOrItem._id || '');
      targetSize = idOrItem.selectedSize || selectedSize || '';
    } else {
      const str = String(idOrItem || '');
      if (/^[0-9a-fA-F]{24}$/.test(str)) {
        targetMongoId = str;
      }
      targetProductId = str;
    }

    setCart((prev) =>
      prev.filter((item) => {
        const idMatches =
          (targetMongoId && String(item._id) === targetMongoId) ||
          (targetProductId && (String(item.id) === targetProductId || String(item.productId) === targetProductId || String(item._id) === targetProductId));

        const sizeMatches = !targetSize || item.selectedSize === targetSize;
        return !(idMatches && sizeMatches);
      })
    );

    const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
    if (token) {
      try {
        if (targetMongoId && /^[0-9a-fA-F]{24}$/.test(targetMongoId)) {
          await fetch(`${API_BASE_URL}/my-collections/${targetMongoId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          const sizeParam = targetSize ? `&selectedSize=${encodeURIComponent(targetSize)}` : '';
          await fetch(
            `${API_BASE_URL}/my-collections/item?productId=${encodeURIComponent(targetProductId)}&itemType=cart${sizeParam}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (err) {
        console.warn('MyCollection remove item error:', err.message);
      }
    }
  };

  const updateQuantity = async (id, selectedSize, newQty) => {
    if (newQty < 1) {
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (String(item.id) === String(id) || String(item._id) === String(id)) && item.selectedSize === selectedSize
          ? { ...item, quantity: newQty }
          : item
      )
    );

    const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
    if (token) {
      try {
        const itemInCart = cart.find(
          (i) => (String(i.id) === String(id) || String(i._id) === String(id)) && i.selectedSize === selectedSize
        );
        if (itemInCart && itemInCart._id) {
          await fetch(`${API_BASE_URL}/my-collections/${itemInCart._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity: newQty }),
          });
        }
      } catch (err) {
        console.warn('MyCollection update quantity error:', err.message);
      }
    }
  };

  const toggleWishlist = async (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => String(item.id) === String(product.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(product.id));
      } else {
        return [...prev, product];
      }
    });

    const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/my-collections/wishlist/toggle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: String(product.id || product._id),
            name: product.name || product.title || 'Product',
            price: Number(product.price) || 0,
            image: product.image || '',
            category: product.category || 'General',
          }),
        });
      } catch (err) {
        console.warn('MyCollection wishlist toggle error:', err.message);
      }
    }
  };

  const removeFromWishlist = async (idOrProduct) => {
    let targetProductId = '';
    let targetMongoId = '';

    if (typeof idOrProduct === 'object' && idOrProduct !== null) {
      targetProductId = String(idOrProduct.productId || idOrProduct.id || idOrProduct._id || '');
      targetMongoId = String(idOrProduct._id || '');
    } else {
      const str = String(idOrProduct || '');
      if (/^[0-9a-fA-F]{24}$/.test(str)) {
        targetMongoId = str;
      }
      targetProductId = str;
    }

    setWishlist((prev) =>
      prev.filter((item) => {
        const idMatches =
          (targetMongoId && String(item._id) === targetMongoId) ||
          (targetProductId && (String(item.id) === targetProductId || String(item.productId) === targetProductId || String(item._id) === targetProductId));
        return !idMatches;
      })
    );

    const token = localStorage.getItem('stylehub_token') || localStorage.getItem('stylehub_auth_token');
    if (token) {
      try {
        if (targetMongoId && /^[0-9a-fA-F]{24}$/.test(targetMongoId)) {
          await fetch(`${API_BASE_URL}/my-collections/${targetMongoId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          await fetch(
            `${API_BASE_URL}/my-collections/item?productId=${encodeURIComponent(targetProductId)}&itemType=wishlist`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (err) {
        console.warn('MyCollection wishlist remove error:', err.message);
      }
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => String(item.id) === String(id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        categories,
        brands,
        tags,
        attributes,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        formatPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        cartTotal,
        cartItemCount,
        addProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        addBrand,
        deleteBrand,
        addTag,
        deleteTag,
        addAttribute,
        deleteAttribute,
        refreshCategories: fetchCategories,
        refreshBrands: fetchBrands,
        refreshTags: fetchTags,
        refreshAttributes: fetchAttributes,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
