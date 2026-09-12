import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import EnquireModal from './components/common/EnquireModal';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Solutions from './pages/Solutions';
import Offers from './pages/Offers';
import Dealer from './pages/Dealer';
import Downloads from './pages/Downloads';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import BrandsAdmin from './pages/admin/BrandsAdmin';
import BannersAdmin from './pages/admin/BannersAdmin';
import OffersAdmin from './pages/admin/OffersAdmin';
import EnquiriesAdmin from './pages/admin/EnquiriesAdmin';
import DealersAdmin from './pages/admin/DealersAdmin';
import DownloadsAdmin from './pages/admin/DownloadsAdmin';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin';
import MessagesAdmin from './pages/admin/MessagesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';

// Scroll to Top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Layout with Navbar, Footer, and Floating WhatsApp
function PublicLayout({ onOpenEnquiry }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary selection:text-slate-950">
      <Navbar onOpenEnquire={() => onOpenEnquiry(null)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer onOpenEnquire={() => onOpenEnquiry(null)} />
      <FloatingWhatsApp />
    </div>
  );
}

function App() {
  const [enquiryModal, setEnquiryModal] = useState({
    isOpen: false,
    product: null
  });

  const handleOpenEnquiry = (product = null) => {
    setEnquiryModal({
      isOpen: true,
      product: product
    });
  };

  const handleCloseEnquiry = () => {
    setEnquiryModal({
      isOpen: false,
      product: null
    });
  };

  return (
    <AuthProvider>
      <SettingsProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="brands" element={<BrandsAdmin />} />
            <Route path="banners" element={<BannersAdmin />} />
            <Route path="offers" element={<OffersAdmin />} />
            <Route path="enquiries" element={<EnquiriesAdmin />} />
            <Route path="dealers" element={<DealersAdmin />} />
            <Route path="downloads" element={<DownloadsAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
          </Route>

          {/* Public Website Routes */}
          <Route element={<PublicLayout onOpenEnquiry={handleOpenEnquiry} />}>
            <Route path="/" element={<Home onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/products/:slug" element={<ProductDetail onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/solutions" element={<Solutions onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/offers" element={<Offers onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/dealer" element={<Dealer />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>

        {/* Global Enquiry Modal */}
        <EnquireModal
          isOpen={enquiryModal.isOpen}
          onClose={handleCloseEnquiry}
          product={enquiryModal.product}
        />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
