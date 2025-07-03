import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import HomeMinimal from "@/pages/HomeMinimal";

// Simple test component instead of complex pages
const TestShop = () => <div style={{ padding: '20px' }}>Shop Page Test</div>;

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  
  console.log('App.tsx: Component loading...');
  
  useEffect(() => {
    console.log('App.tsx: Route changed to:', location.pathname);
  }, [location.pathname]);
  
  console.log('App.tsx: Rendering app...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomeMinimal />} />
                <Route path="/shop" element={<TestShop />} />
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
