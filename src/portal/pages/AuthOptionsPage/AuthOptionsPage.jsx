import React from "react";
import { ArrowRight, LogIn, UserRoundPlus } from "lucide-react";
import { Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard/AuthCard";

const AuthOptionsPage = () => {
  return (
    <AuthCard
      title="Join Araina"
      subtitle="Choose how you'd like to continue"
      className="max-w-lg"
    >
      <div className="space-y-4">
        <Link
          to="/portal/register"
          className="group flex items-center gap-4 rounded-lg border border-araina-pink/20 p-5 transition-all hover:border-araina-pink hover:bg-araina-pink/5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-araina-pink/10 text-araina-pink">
            <UserRoundPlus size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-araina-black">
              Create Account
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-araina-black/60">
              New to Araina? Set up your account and get started.
            </span>
          </span>
          <ArrowRight
            size={18}
            className="shrink-0 text-araina-pink transition-transform group-hover:translate-x-1"
          />
        </Link>

        <Link
          to="/portal/login"
          className="group flex items-center gap-4 rounded-lg border border-araina-blue/20 p-5 transition-all hover:border-araina-blue hover:bg-araina-blue/5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-araina-blue/10 text-araina-blue">
            <LogIn size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-araina-black">
              Login
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-araina-black/60">
              Already have an account? Sign in to continue.
            </span>
          </span>
          <ArrowRight
            size={18}
            className="shrink-0 text-araina-blue transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </AuthCard>
  );
};

export default AuthOptionsPage;
