import React, { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Portal Layout Component
 * Provides consistent header, navigation, and layout for all portal pages
 * Uses Araina design system (colors, fonts, animations)
 */
const PortalLayout = ({
  children,
  showHeader = true,
  showSidebar = false,
  isAuthenticated = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // TODO: Implement logout API call
    localStorage.removeItem("authToken");
    navigate("/portal/login");
  };

  return (
    <div className="min-h-screen bg-araina-white text-araina-black font-unbounded">
      {/* ==================== HEADER ==================== */}
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-araina-white border-b border-araina-pink/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div
              onClick={() =>
                navigate(isAuthenticated ? "/portal/dashboard" : "/")
              }
              className="cursor-pointer flex items-center"
            >
              <img
                src="/assets/logo/araina-logo-dark.png"
                alt="ARAINA"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-8">
                <button
                  onClick={() => navigate("/portal/dashboard")}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors ${
                    location.pathname === "/portal/dashboard"
                      ? "text-araina-pink"
                      : "text-araina-black/70 hover:text-araina-pink"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/portal/orders")}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors ${
                    location.pathname.includes("/portal/order")
                      ? "text-araina-pink"
                      : "text-araina-black/70 hover:text-araina-pink"
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => navigate("/portal/profile")}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors ${
                    location.pathname === "/portal/profile"
                      ? "text-araina-pink"
                      : "text-araina-black/70 hover:text-araina-pink"
                  }`}
                >
                  Profile
                </button>
              </nav>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-araina-black/70 hover:text-araina-pink transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-araina-black hover:text-araina-pink transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && isAuthenticated && (
            <div className="lg:hidden border-t border-araina-pink/10 bg-araina-white">
              <nav className="flex flex-col gap-4 px-6 py-4">
                <button
                  onClick={() => {
                    navigate("/portal/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm uppercase tracking-widest font-medium text-araina-black hover:text-araina-pink transition-colors text-left"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate("/portal/orders");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm uppercase tracking-widest font-medium text-araina-black hover:text-araina-pink transition-colors text-left"
                >
                  Orders
                </button>
                <button
                  onClick={() => {
                    navigate("/portal/profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm uppercase tracking-widest font-medium text-araina-black hover:text-araina-pink transition-colors text-left"
                >
                  Profile
                </button>
                <hr className="border-araina-pink/10 my-2" />
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm uppercase tracking-widest font-medium text-araina-black hover:text-araina-pink transition-colors text-left flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </nav>
            </div>
          )}
        </header>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main
        className={`${showHeader ? "pt-24 sm:pt-28" : ""} min-h-screen bg-araina-white`}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">{children}</div>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-araina-pink/5 bg-araina-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-araina-black/50 uppercase tracking-widest">
            © 2026 Royo Essentials LLP. All rights reserved. | ARAINA
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;
