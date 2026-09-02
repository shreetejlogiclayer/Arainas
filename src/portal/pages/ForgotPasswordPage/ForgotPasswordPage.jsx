import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard/AuthCard";
import { isValidEmail } from "../../utils/formatters";

/**
 * Forgot Password Page
 * Step 1: Enter email to request password reset
 */
const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call backend API to send reset email
      console.log("Forgot password request for:", email);

      setIsSubmitted(true);
    } catch (err) {
      setError("Unable to process request. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthCard
        title="Check Your Email"
        subtitle="We've sent password reset instructions"
      >
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">📧</div>
          <p className="text-araina-black/70 leading-relaxed">
            We've sent a password reset link to:
          </p>
          <p className="font-semibold text-araina-black bg-araina-pink/5 p-4 rounded-lg border border-araina-pink/10">
            {email}
          </p>
          <p className="text-sm text-araina-black/60">
            Click the link in the email to reset your password. The link expires
            in 24 hours.
          </p>
          <Link
            to="/portal/login"
            className="inline-block bg-araina-pink hover:bg-araina-pink/90 text-araina-white uppercase text-xs font-semibold tracking-widest py-3 px-6 rounded-lg transition-all"
          >
            Back to Login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email to reset your password"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-xs uppercase font-semibold text-araina-black mb-2 tracking-widest">
            Email Address <span className="text-araina-pink">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-araina-pink/50 transition-all text-sm ${
              error ? "border-red-300 bg-red-50" : "border-araina-pink/20"
            }`}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-araina-pink hover:bg-araina-pink/90 disabled:bg-araina-pink/50 text-araina-white uppercase text-xs font-semibold tracking-widest py-3 rounded-lg transition-all"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>

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

        <p className="text-center text-sm text-araina-black/70">
          Remember your password?{" "}
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

export default ForgotPasswordPage;
