import React from "react";

/**
 * AuthCard Component
 * Reusable card wrapper for login/register/forgot password pages
 * Uses Araina design system
 */
const AuthCard = ({
  title,
  subtitle,
  children,
  isLoading = false,
  className = "",
}) => {
  return (
    <div className="min-h-screen bg-araina-white flex items-center justify-center px-6 py-12">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-araina-pink/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-araina-blue/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md bg-araina-white rounded-lg border border-araina-pink/10 shadow-lg p-8 sm:p-10 ${className}`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/logo/araina-logo-dark.png"
            alt="ARAINA"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-araina-black text-center mb-2 tracking-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-araina-black/60 text-center mb-8 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Content */}
        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          {children}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-araina-white/50 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-3 border-araina-pink/20 border-t-araina-pink animate-spin" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
