
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

// Pages
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Success from "@/pages/Success";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import VerifyOtp from "@/pages/VerifyOtp";
import Admin from "@/pages/Admin";
import Orders from "@/pages/Orders";
import NotFound from "./pages/NotFound";
import PageTransition from "@/components/PageTransition";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  useEffect(() => {
    NProgress.configure({ showSpinner: false });
  }, []);

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [location.pathname]);
  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
              <Route path="/product/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
              <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
              <Route path="/success" element={<PageTransition><Success /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
              <Route path="/verify-otp" element={<PageTransition><VerifyOtp /></PageTransition>} />
              <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
              <Route path="/account/orders" element={<PageTransition><Orders /></PageTransition>} />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>
  )
}

export default App;
