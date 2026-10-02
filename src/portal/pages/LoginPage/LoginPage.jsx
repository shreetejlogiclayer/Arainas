import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthCard from "../../components/AuthCard/AuthCard";
import { isValidIndianPhone } from "../../utils/formatters";

/**
 * Login Page
 * First page users see when opening portal
 * - Email/mobile/username field
 * - Password field with show/hide toggle
 * - Remember Me checkbox
 * - Form validation and error handling
 * - Loading state
 * - Links to registration and forgot password
 */
const LoginPage = () => {
  const navigate = useNavigate();

  // Form state
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!isValidIndianPhone(mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit Indian mobile number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mobile, password, rememberMe }),
      });
      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error?.message || "Unable to log in. Please try again.");
        return;
      }

      localStorage.setItem("authToken", "session");
      localStorage.setItem("userMobile", result.data.mobile || mobile);
      if (result.data.email) {
        localStorage.setItem("userEmail", result.data.email);
      } else {
        localStorage.removeItem("userEmail");
      }
      navigate(
        result.data.profile?.fullName?.trim() &&
          result.data.profile?.address?.id
          ? "/portal/dashboard"
          : "/portal/create-profile",
      );
    } catch (err) {
      setApiError(
        "Unable to reach the Araina server. Start the backend and check its database configuration, then try again.",
      );
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome"
      subtitle="Sign in to your Araina account to continue"
      isLoading={isLoading}
    >
      <form onSubmit={handleLogin} className="space-y-6">
        {/* API Error Message */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        {/* Mobile Field */}
        <div>
          <label className="block text-xs uppercase font-semibold text-araina-black mb-2 tracking-widest">
            Mobile Number <span className="text-araina-pink">*</span>
          </label>
          <input
            type="tel"
            value={mobile}
            autoComplete="tel"
            onChange={(e) => {
              setMobile(e.target.value);
              if (errors.mobile) setErrors({ ...errors, mobile: "" });
            }}
            placeholder="10-digit number"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-araina-pink/50 transition-all text-sm ${
              errors.mobile
                ? "border-red-300 bg-red-50"
                : "border-araina-pink/20 bg-araina-white"
            }`}
            disabled={isLoading}
          />
          {errors.mobile && (
            <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs uppercase font-semibold text-araina-black mb-2 tracking-widest">
            Password <span className="text-araina-pink">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="••••••••"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-araina-pink/50 transition-all text-sm ${
                errors.password
                  ? "border-red-300 bg-red-50"
                  : "border-araina-pink/20 bg-araina-white"
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-araina-black/50 hover:text-araina-pink transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-araina-pink/30 text-araina-pink focus:ring-2 focus:ring-araina-pink/50"
            />
            <span className="text-xs text-araina-black/70">Remember me</span>
          </label>
          <Link
            to="/portal/forgot-password"
            className="text-xs text-araina-pink hover:text-araina-pink/80 transition-colors font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-araina-pink hover:bg-araina-pink/90 disabled:bg-araina-pink/50 text-araina-white uppercase text-xs font-semibold tracking-widest py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg shadow-araina-pink/20"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-araina-pink/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-araina-white text-araina-black/50">
              OR
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-araina-black/70">
          Don't have an account?{" "}
          <Link
            to="/portal/register"
            className="text-araina-pink hover:text-araina-pink/80 font-semibold transition-colors"
          >
            Create Account
          </Link>
        </p>
      </form>

    </AuthCard>
  );
};

export default LoginPage;
