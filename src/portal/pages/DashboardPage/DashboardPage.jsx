import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PortalLayout from "../../components/PortalLayout/PortalLayout";

/**
 * Dashboard Page
 * Main hub for authenticated users
 * Shows welcome message, profile status, summary cards
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      const userEmail = localStorage.getItem("userEmail") || "User";
      const userName = userEmail.split("@")[0];
      setUserData({
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email: userEmail,
        totalOrders: 0,
        referralCount: 0,
        availableCoupons: 0,
        usedCoupons: 0,
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PortalLayout showHeader={true} isAuthenticated={true}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-araina-pink/20 border-t-araina-pink animate-spin mx-auto mb-4" />
            <p className="text-araina-black/70 text-sm uppercase tracking-widest">
              Loading Dashboard...
            </p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout showHeader={true} isAuthenticated={true}>
      <div className="max-w-5xl">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-araina-black mb-2 tracking-tight">
            Welcome, {userData?.name}! 👋
          </h1>
          <p className="text-araina-black/60 text-base">
            Here's your Araina Member Dashboard
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => navigate("/portal/orders")}
            className="bg-araina-pink hover:bg-araina-pink/90 text-araina-white uppercase text-sm font-semibold tracking-widest py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Place New Order
          </button>
          <button
            onClick={() => navigate("/portal/profile")}
            className="border-2 border-araina-pink text-araina-pink hover:bg-araina-pink hover:text-araina-white uppercase text-sm font-semibold tracking-widest py-4 rounded-lg transition-all"
          >
            View Profile
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Orders Card */}
          <div className="bg-araina-white border border-araina-pink/10 rounded-lg p-6">
            <p className="text-xs uppercase font-bold text-araina-black/60 tracking-widest mb-3">
              Total Orders
            </p>
            <p className="text-3xl font-bold text-araina-pink">
              {userData?.totalOrders || 0}
            </p>
            <p className="text-xs text-araina-black/50 mt-2">
              {userData?.totalOrders === 0
                ? "Start your first order"
                : "Keep shopping"}
            </p>
          </div>

          {/* Referral Count Card */}
          <div className="bg-araina-white border border-araina-blue/10 rounded-lg p-6">
            <p className="text-xs uppercase font-bold text-araina-black/60 tracking-widest mb-3">
              Referrals
            </p>
            <p className="text-3xl font-bold text-araina-blue">
              {userData?.referralCount || 0}
            </p>
            <p className="text-xs text-araina-black/50 mt-2">
              Invite friends & earn coupons
            </p>
          </div>

          {/* Available Coupons Card */}
          <div className="bg-araina-white border border-araina-pink/10 rounded-lg p-6">
            <p className="text-xs uppercase font-bold text-araina-black/60 tracking-widest mb-3">
              Available Coupons
            </p>
            <p className="text-3xl font-bold text-araina-pink">
              {userData?.availableCoupons || 0}
            </p>
            <p className="text-xs text-araina-black/50 mt-2">Ready to use</p>
          </div>

          {/* Used Coupons Card */}
          <div className="bg-araina-white border border-araina-blue/10 rounded-lg p-6">
            <p className="text-xs uppercase font-bold text-araina-black/60 tracking-widest mb-3">
              Used Coupons
            </p>
            <p className="text-3xl font-bold text-araina-blue">
              {userData?.usedCoupons || 0}
            </p>
            <p className="text-xs text-araina-black/50 mt-2">
              Applied to orders
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-araina-white border border-araina-pink/10 rounded-lg p-8">
          <h2 className="text-xl font-bold text-araina-black mb-6 tracking-tight">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/portal/orders")}
              className="text-left p-4 rounded-lg border border-araina-pink/20 hover:border-araina-pink hover:bg-araina-pink/5 transition-all"
            >
              <p className="font-semibold text-araina-black">My Orders</p>
              <p className="text-xs text-araina-black/60">View order history</p>
            </button>
            <button
              onClick={() => navigate("/portal/referrals")}
              className="text-left p-4 rounded-lg border border-araina-blue/20 hover:border-araina-blue hover:bg-araina-blue/5 transition-all"
            >
              <p className="font-semibold text-araina-black">Referrals</p>
              <p className="text-xs text-araina-black/60">Share & earn</p>
            </button>
            <button
              onClick={() => navigate("/portal/coupons")}
              className="text-left p-4 rounded-lg border border-araina-pink/20 hover:border-araina-pink hover:bg-araina-pink/5 transition-all"
            >
              <p className="font-semibold text-araina-black">Coupons</p>
              <p className="text-xs text-araina-black/60">View all coupons</p>
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default DashboardPage;
