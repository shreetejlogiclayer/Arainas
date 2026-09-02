import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard/AuthCard";
import {
  isValidEmail,
  isValidIndianPhone,
  validatePassword,
} from "../../utils/formatters";

/**
 * Register Page
 * Create new account flow
 */
const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!isValidIndianPhone(mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit Indian mobile number";
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Register attempt:", { email, mobile, password });

      // Simulated success
      localStorage.setItem("authToken", "mock-token-" + Date.now());
      localStorage.setItem("userEmail", email);

      // Redirect to profile creation
      navigate("/portal/create-profile");
    } catch (err) {
      setApiError("Unable to create account. Please try again later.");
      console.error("Register error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join Araina and start your journey"
      isLoading={isLoading}
    >
      <form onSubmit={handleRegister} className="space-y-5">
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-xs uppercase font-semibold text-araina-black mb-2 tracking-widest">
            Email <span className="text-araina-pink">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-araina-pink/50 transition-all text-sm ${
              errors.email
                ? "border-red-300 bg-red-50"
                : "border-araina-pink/20"
            }`}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Mobile Field */}
        <div>
          <label className="block text-xs uppercase font-semibold text-araina-black mb-2 tracking-widest">
            Mobile Number <span className="text-araina-pink">*</span>
          </label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              if (errors.mobile) setErrors({ ...errors, mobile: "" });
            }}
            placeholder="10-digit number"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-araina-pink/50 transition-all text-sm ${
              errors.mobile
                ? "border-red-300 bg-red-50"
                : "border-araina-pink/20"
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
                : "border-araina-pink/20"
            }`}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs uppercase font-semibold text-araina-black mb-2 tracking-widest">
            Confirm Password <span className="text-araina-pink">*</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors({ ...errors, confirmPassword: "" });
            }}
            placeholder="••••••••"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-araina-pink/50 transition-all text-sm ${
              errors.confirmPassword
                ? "border-red-300 bg-red-50"
                : "border-araina-pink/20"
            }`}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Show Password Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 rounded border-araina-pink/30 text-araina-pink"
          />
          <span className="text-xs text-araina-black/70">Show password</span>
        </label>

        {/* Register Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-araina-pink hover:bg-araina-pink/90 disabled:bg-araina-pink/50 text-araina-white uppercase text-xs font-semibold tracking-widest py-3 rounded-lg transition-all"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-araina-black/70">
          Already have an account?{" "}
          <Link
            to="/portal/login"
            className="text-araina-pink hover:text-araina-pink/80 font-semibold"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
