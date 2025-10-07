import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CostEstimatorPage from "./pages/CostEstimatorPage";
import BookServicePage from "./pages/BookServicePage";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cost-estimator" element={<CostEstimatorPage />} />
            <Route path="/book-service" element={<BookServicePage />} />
            {/* Placeholder routes for other pages from sitemap */}
            <Route path="/about" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">About Page - Coming Soon</h1></div>} />
            <Route path="/services/*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Service Pages - Coming Soon</h1></div>} />
            <Route path="/reviews" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Reviews Page - Coming Soon</h1></div>} />
            <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Contact Page - Coming Soon</h1></div>} />
            <Route path="/financing" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Financing Page - Coming Soon</h1></div>} />
            <Route path="/case-studies" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Case Studies Page - Coming Soon</h1></div>} />
            <Route path="/cities-served" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Cities Served Page - Coming Soon</h1></div>} />
            <Route path="/faq" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">FAQ Page - Coming Soon</h1></div>} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
