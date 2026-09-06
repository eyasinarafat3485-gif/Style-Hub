import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import TopHeader from './components/TopHeader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

const MainLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  // If on Dashboard, render the Full-Screen SaaS App Shell
  if (isDashboard) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-[#ff2056] selection:text-white">
        <ScrollToTop />
        <Routes>
          <Route path="/dashboard/*" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ProductQuickViewModal />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    );
  }

  // Regular Store Layout with Header and Footer
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-[#ff2056] selection:text-white overflow-x-hidden w-full">
      <ScrollToTop />
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

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />

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

      {/* Global Notification Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
