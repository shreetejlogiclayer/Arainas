import React, { Component, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import WhyUsPage from "./pages/WhyUsPage";
import ContactPage from "./pages/ContactPage";
import ArainaPage from "./pages/ArainaPage";
import WomensHealthPage from "./pages/WomensHealthPage";
import OpportunityPage from "./pages/OpportunityPage";
import MediaPage from "./pages/MediaPage";

// Portal Imports
import ProtectedRoute from "./portal/components/ProtectedRoute/ProtectedRoute";
import AuthOptionsPage from "./portal/pages/AuthOptionsPage/AuthOptionsPage";
import LoginPage from "./portal/pages/LoginPage/LoginPage";
import RegisterPage from "./portal/pages/RegisterPage/RegisterPage";
import ForgotPasswordPage from "./portal/pages/ForgotPasswordPage/ForgotPasswordPage";
import CreateProfilePage from "./portal/pages/CreateProfilePage/CreateProfilePage";
import DashboardPage from "./portal/pages/DashboardPage/DashboardPage";
import OrdersPage from "./portal/pages/OrdersPage/OrdersPage";
import ProfilePage from "./portal/pages/ProfilePage/ProfilePage";
import ReferralsPage from "./portal/pages/ReferralsPage/ReferralsPage";
import CouponsPage from "./portal/pages/CouponsPage/CouponsPage";

class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Page rendering failed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section
          role="alert"
          className="mx-auto my-16 max-w-xl rounded-2xl border border-araina-pink/15 bg-white p-8 text-center shadow-sm"
        >
          <h1 className="text-xl font-semibold text-araina-black">
            This page couldn’t be displayed
          </h1>
          <p className="mt-3 text-sm text-araina-black/60">
            Please try again. Your saved information has not been changed.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-araina-pink px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white"
          >
            Reload page
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}

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

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname.startsWith("/portal") ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    let observer;
    const frame = window.requestAnimationFrame(() => {
      const revealTargets = document.querySelectorAll(
        ".public-page-background h1, .public-page-background h2, .public-page-background h3, .public-page-background h4, .public-page-background p, .public-page-background article, .public-page-background li, .public-page-background blockquote, .public-page-background button, .public-page-background a[class*='inline-flex']",
      );
      const revealImages = document.querySelectorAll(
        ".public-page-background img",
      );
      const sectionDelays = new Map();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add(
              entry.target.tagName === "IMG"
                ? "public-page-image-revealed"
                : "public-page-revealed",
            );
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12 },
      );

      revealTargets.forEach((element) => {
        if (element.style.opacity || element.style.transform) return;

        const section = element.closest("section");
        const delay = sectionDelays.get(section) || 0;
        sectionDelays.set(section, delay + 1);
        element.style.setProperty(
          "--public-reveal-delay",
          `${Math.min(delay, 5) * 80}ms`,
        );
        element.classList.add("public-page-reveal");
        observer.observe(element);
      });

      revealImages.forEach((image) => {
        image.classList.add("public-page-image-reveal");
        observer.observe(image);
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      document
        .querySelectorAll(
          ".public-page-reveal, .public-page-revealed, .public-page-image-reveal, .public-page-image-revealed",
        )
        .forEach((element) => {
          element.classList.remove(
            "public-page-reveal",
            "public-page-revealed",
            "public-page-image-reveal",
            "public-page-image-revealed",
          );
          element.style.removeProperty("--public-reveal-delay");
        });
    };
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

      <main
        className={`flex-grow ${showPublicLayout ? "public-page-background" : ""}`}
      >
        <AppErrorBoundary key={location.pathname}>
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/araina" element={<ArainaPage />} />
          <Route path="/womens-health" element={<WomensHealthPage />} />
          <Route path="/opportunity" element={<OpportunityPage />} />
          <Route path="/career" element={<OpportunityPage careerPage />} />
          <Route path="/media" element={<MediaPage />} />

          {/* ==================== PORTAL ROUTES ==================== */}
          {/* Authentication Routes (No Protection) */}
          <Route path="/portal" element={<AuthOptionsPage />} />
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
        </AppErrorBoundary>
      </main>

      {showPublicLayout && <Footer setActiveSection={setActiveSection} />}
    </div>
  );
}

export default App;
