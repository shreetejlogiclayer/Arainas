import React, { useEffect, useState } from "react";
import { Gift, LoaderCircle } from "lucide-react";
import PortalLayout from "../../components/PortalLayout/PortalLayout";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getPortalErrorMessage } from "../../utils/errorMessages";
import { requestPortalJson } from "../../utils/portalApi";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const availableCoupons = await requestPortalJson("/api/orders/coupons");
        if (!Array.isArray(availableCoupons)) {
          throw new Error("We couldn’t load your coupons. Please refresh and try again.");
        }
        setCoupons(availableCoupons);
      } catch (loadError) {
        setError(
          getPortalErrorMessage(
            loadError,
            "We couldn’t load your coupons. Please refresh and try again.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadCoupons();
  }, []);

  return (
    <PortalLayout showHeader={true} isAuthenticated={true}>
      <h1 className="text-3xl font-bold text-araina-black mb-4 tracking-tight">
        Coupons
      </h1>
      <p className="text-araina-black/60 mb-8">
        Your available coupons can be selected when placing an order.
      </p>
      {error && (
        <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center gap-3 py-12 text-sm text-araina-black/60">
          <LoaderCircle className="animate-spin text-araina-pink" />
          Loading your coupons…
        </div>
      ) : coupons.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {coupons.map((coupon) => (
            <article
              key={coupon.id}
              className="rounded-2xl border border-araina-pink/15 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-araina-pink/10 text-araina-pink">
                  <Gift size={19} />
                </span>
                <div>
                  <p className="font-semibold text-araina-black">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% off`
                      : `${formatCurrency(coupon.discountValue)} off`}
                  </p>
                  <p className="text-xs text-araina-black/55">
                    Choose this coupon at checkout; no code entry needed.
                  </p>
                </div>
              </div>
              {coupon.expiresAt && (
                <p className="mt-4 text-xs text-araina-black/50">
                  Expires {formatDate(coupon.expiresAt)}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-araina-pink/10 bg-white p-8 text-center text-sm text-araina-black/55">
          You don&apos;t have any available coupons yet.
        </div>
      )}
    </PortalLayout>
  );
};

export default CouponsPage;
