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

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch products from backend Express API if running
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.log("Connected to frontend fallback data mode", err);
      });
  }, []);

  const formatPrice = (amount) => {
    return `৳${amount.toLocaleString('en-BD')}`;
  };

  const addToCart = (product, quantity = 1, size = 'M', color = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedSize === size
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
  };

  const removeFromCart = (id, selectedSize) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === selectedSize)));
  };

  const updateQuantity = (id, selectedSize, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
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
        toggleWishlist,
        isWishlisted,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
