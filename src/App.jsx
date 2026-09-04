import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import ScrollToTop from './components/ScrollToTop';
import TopHeader from './components/TopHeader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ProductQuickViewModal from './components/ProductQuickViewModal';

// Pages
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-[#ff2056] selection:text-white">
          {/* Top announcement bar */}
          <TopHeader />

          {/* Brand Navbar */}
          <Navbar />

          {/* Page Routing */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/men" element={<ShopPage initialCategory="Men" />} />
              <Route path="/women" element={<ShopPage initialCategory="Women" />} />
              <Route path="/kids" element={<ShopPage initialCategory="Kids" />} />
              <Route path="/trending" element={<ShopPage initialFilter="trending" />} />
              <Route path="/new-arrivals" element={<ShopPage initialFilter="new" />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Comprehensive Footer */}
          <Footer />

          {/* Interactive Drawers & Modals */}
          <CartDrawer />
          <WishlistDrawer />
          <ProductQuickViewModal />
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}

export default App;
