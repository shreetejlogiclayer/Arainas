import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Gift,
  LoaderCircle,
  UsersRound,
} from "lucide-react";
import PortalLayout from "../../components/PortalLayout/PortalLayout";
import { formatDate } from "../../utils/formatters";

const ReferralsPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadReferrals = useCallback(async () => {
    const response = await fetch("/api/auth/referrals", {
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || "Unable to load referrals.");
    }
    setData(result.data);
  }, []);

  useEffect(() => {
    loadReferrals()
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false));
  }, [loadReferrals]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(data.referralCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not access clipboard. Select and copy your referral code.");
    }
  };

  return (
    <PortalLayout showHeader isAuthenticated>
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-araina-pink">
            Share the Araina experience
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-araina-black">
            Your referrals
          </h1>
          <p className="mt-2 text-sm text-araina-black/60">
            Invite friends with your personal code and follow their progress.
          </p>
        </motion.div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-sm text-araina-black/60">
            <LoaderCircle className="animate-spin text-araina-pink" />
            Loading your referral information…
          </div>
        ) : data ? (
          <div className="space-y-6">
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-araina-pink/15 bg-gradient-to-br from-white via-araina-pink/[0.04] to-araina-blue/[0.08] p-6 shadow-lg shadow-araina-pink/5 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-araina-pink/10 text-araina-pink">
                    <Gift size={20} />
                  </span>
                  <div>
                    <h2 className="font-semibold text-araina-black">Your referral code</h2>
                    <p className="text-xs text-araina-black/55">Share it with a friend</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <code className="flex min-h-12 flex-1 items-center rounded-xl border border-araina-pink/15 bg-white px-4 text-base font-semibold tracking-widest text-araina-pink">
                    {data.referralCode}
                  </code>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-araina-pink px-5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-araina-pink/90"
                  >
                    {copied ? <CheckCircle2 size={17} /> : <Copy size={17} />}
                    {copied ? "Copied" : "Copy code"}
                  </button>
                </div>
                {data.receivedReferral && (
                  <p className="mt-4 text-xs text-araina-black/55">
                    You joined with referral code{" "}
                    <strong className="text-araina-black">
                      {data.receivedReferral.referralCodeUsed}
                    </strong>
                    .
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Invited", data.totalReferrals, UsersRound, "text-araina-blue"],
                  ["Completed", data.completedReferrals, CheckCircle2, "text-green-600"],
                  ["Coupons", data.availableCoupons, Gift, "text-araina-pink"],
                  ["To next reward", data.referralsToNextCoupon, UsersRound, "text-araina-blue"],
                ].map(([label, value, Icon, color]) => (
                  <div key={label} className="rounded-2xl border border-araina-pink/10 bg-white p-4 sm:p-5">
                    <Icon size={19} className={color} />
                    <p className="mt-4 text-2xl font-bold text-araina-black">{value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-araina-black/50 sm:text-xs">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-araina-blue/15 bg-white shadow-lg shadow-araina-blue/5">
              <div className="border-b border-araina-blue/10 px-5 py-5 sm:px-7">
                <h2 className="font-semibold text-araina-black">Referral activity</h2>
                <p className="mt-1 text-xs text-araina-black/55">
                  Referral status is updated as friends complete their Araina journey.
                </p>
              </div>
              {data.referrals.length ? (
                <div className="divide-y divide-araina-blue/10">
                  {data.referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-araina-blue/10 text-araina-blue">
                          <UsersRound size={17} />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-araina-black">{referral.name}</p>
                          <p className="mt-0.5 text-xs text-araina-black/50">
                            Joined {formatDate(referral.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className="w-fit rounded-full bg-araina-blue/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-araina-blue">
                        {referral.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
                  <UsersRound className="mx-auto text-araina-blue/60" size={28} />
                  <p className="mt-3 text-sm font-medium text-araina-black">
                    No referrals yet
                  </p>
                  <p className="mt-1 text-xs text-araina-black/55">
                    Share your code to invite your first friend.
                  </p>
                </div>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </PortalLayout>
  );
};

export default ReferralsPage;
