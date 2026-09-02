import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import WhyUsPage from "./pages/WhyUsPage";
import ContactPage from "./pages/ContactPage";

// Portal Imports
import ProtectedRoute from "./portal/components/ProtectedRoute/ProtectedRoute";
import LoginPage from "./portal/pages/LoginPage/LoginPage";
import RegisterPage from "./portal/pages/RegisterPage/RegisterPage";
import ForgotPasswordPage from "./portal/pages/ForgotPasswordPage/ForgotPasswordPage";
import CreateProfilePage from "./portal/pages/CreateProfilePage/CreateProfilePage";
import DashboardPage from "./portal/pages/DashboardPage/DashboardPage";
import OrdersPage from "./portal/pages/OrdersPage/OrdersPage";
import ProfilePage from "./portal/pages/ProfilePage/ProfilePage";
import ReferralsPage from "./portal/pages/ReferralsPage/ReferralsPage";
import CouponsPage from "./portal/pages/CouponsPage/CouponsPage";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    setIsAuthLoading(true);
    checkAuth();
    setIsAuthLoading(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = [
      "home",
      "about",
      "purpose",
      "product",
      "why-araina",
      "join-us",
      "contact",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Check if current route is portal route
  const isPortalRoute = location.pathname.startsWith("/portal");
  const showPublicLayout = !isPortalRoute;

  return (
    <div className="min-h-screen bg-araina-white text-araina-black font-unbounded selection:bg-araina-pink/20 selection:text-araina-pink flex flex-col justify-between">
      <ScrollToTop />

      {showPublicLayout && (
        <Navbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}

      <main className="flex-grow">
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ==================== PORTAL ROUTES ==================== */}
          {/* Authentication Routes (No Protection) */}
          <Route path="/portal/login" element={<LoginPage />} />
          <Route path="/portal/register" element={<RegisterPage />} />
          <Route
            path="/portal/forgot-password"
            element={<ForgotPasswordPage />}
          />

          {/* Protected Routes (Require Authentication) */}
          <Route
            path="/portal/create-profile"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isLoading={isAuthLoading}
              >
                <CreateProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isLoading={isAuthLoading}
              >
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/orders"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isLoading={isAuthLoading}
              >
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/profile"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isLoading={isAuthLoading}
              >
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/referrals"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isLoading={isAuthLoading}
              >
                <ReferralsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/coupons"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isLoading={isAuthLoading}
              >
                <CouponsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {showPublicLayout && <Footer setActiveSection={setActiveSection} />}
    </div>
  );
}

export default App;
