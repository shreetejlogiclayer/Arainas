import React from "react";
import { Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard/AuthCard";
import { COMPANY_INFO } from "../../../config/siteConfig";

const ForgotPasswordPage = () => (
  <AuthCard
    title="Need Help Signing In?"
    subtitle="Contact our support team for help resetting your password."
  >
    <div className="space-y-6 text-center">
      <a
        href={`tel:${COMPANY_INFO.phone.replace(/[^\d+]/g, "")}`}
        className="inline-block w-full rounded-lg bg-araina-pink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-araina-white transition-all hover:bg-araina-pink/90"
      >
        Call {COMPANY_INFO.phone}
      </a>
      <Link
        to="/portal/login"
        className="inline-block text-sm font-semibold text-araina-pink hover:text-araina-pink/80"
      >
        Back to Sign In
      </Link>
    </div>
  </AuthCard>
);

export default ForgotPasswordPage;
