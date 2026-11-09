import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Download,
  ImagePlus,
  LoaderCircle,
  MapPin,
  PackageCheck,
  QrCode,
  ShoppingBag,
  Upload,
  UserRound,
} from "lucide-react";
import PortalLayout from "../../components/PortalLayout/PortalLayout";
import {
  formatCurrency,
  formatDateTime,
  formatPhone,
  isValidIndianPhone,
  isValidPIN,
} from "../../utils/formatters";
import { getPortalErrorMessage } from "../../utils/errorMessages";
import { requestPortalJson } from "../../utils/portalApi";
import { COMPANY_INFO } from "../../../config/siteConfig";

const blankRecipient = {
  fullName: "",
  mobile: "",
  alternateMobile: "",
  address: {
    houseNumber: "",
    building: "",
    street: "",
    area: "",
    landmark: "",
    village: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
  },
};

const inputClass =
  "w-full min-w-0 rounded-xl border border-araina-pink/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-araina-black/35 focus:border-araina-pink focus:ring-4 focus:ring-araina-pink/10";

const fileToBase64 = async (file) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length)),
    );
  }
  return btoa(binary);
};

const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );

const getAddressLines = (address = {}) =>
  [
    [address.houseNumber, address.building, address.street]
      .filter(Boolean)
      .join(", "),
    [address.area, address.landmark, address.village]
      .filter(Boolean)
      .join(", "),
    [address.city, address.district, address.state, address.pinCode]
      .filter(Boolean)
      .join(", "),
    address.country || "India",
  ].filter(Boolean);

const getPaymentStatusLabel = (status) => {
  if (status === "success") return "Payment successful";
  if (status === "pending") return "Payment pending verification";
  if (status === "failed") return "Payment failed";
  return "Payment not configured";
};

const getPaymentMethodLabel = (provider) =>
  provider === "qr_code"
    ? "By QR code"
    : provider === "payu"
      ? "PayU"
      : provider || "Not available";

const getDeliveryMethodLabel = (method) =>
  method === "hand" ? "By Hand" : "Courier";

const getInvoiceHtml = (order) => {
  const item = order.items?.[0] || {};
  const recipient = order.recipient || {};
  const address = recipient.address || {};
  const addressHtml = getAddressLines({
    ...address,
    country: recipient.country,
  })
    .map((line) => `<div>${escapeHtml(line)}</div>`)
    .join("");
  const paymentStatus = getPaymentStatusLabel(order.paymentStatus);
  const paymentDetails =
    order.payment?.status === "success"
      ? `<div class="status"><strong>Payment method:</strong> ${escapeHtml(getPaymentMethodLabel(order.payment.provider))} · <strong>Payment reference:</strong> ${escapeHtml(order.payment.transactionId || "Not available")} · <strong>Paid:</strong> ${escapeHtml(formatDateTime(order.payment.paidAt))}</div>`
      : "";
  const paymentFooter =
    order.paymentStatus === "success"
      ? "This receipt confirms your order and verified payment."
      : order.paymentStatus === "not_configured"
        ? "This receipt confirms your order; online payment collection is not enabled."
        : "This receipt confirms your order; payment confirmation is pending.";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Araina Order ${escapeHtml(order.orderNumber)}</title>
<style>
*{box-sizing:border-box}body{margin:0;padding:32px;background:#f7f7f7;color:#202020;font:14px Arial,sans-serif;line-height:1.55}
.sheet{max-width:850px;margin:auto;background:#fff;padding:48px;border:1px solid #f1dce1;border-radius:18px;box-shadow:0 12px 36px #ef5f7d14}
.brand-logo{display:block;width:180px;height:auto;max-height:72px;object-fit:contain;object-position:left center;margin:0 0 16px}
.top{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;padding-bottom:24px;border-bottom:2px solid #ef5f7d}.muted{color:#6b7280;font-size:12px}.right{text-align:right}.title{font-size:24px;font-weight:800;letter-spacing:.08em}.number{color:#ef5f7d;font-weight:bold}
.people{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:28px 0}.card{padding:18px;border:1px solid #f2e1e5;border-radius:12px}.label{margin:0 0 10px;color:#ef5f7d;font-weight:bold;font-size:10px;letter-spacing:.13em;text-transform:uppercase}.person{font-weight:bold}.info{color:#555;font-size:12px;margin-top:4px;overflow-wrap:anywhere}
table{width:100%;border-collapse:collapse;margin:16px 0 24px}th{text-align:left;background:#fff4f6;color:#444;font-size:10px;letter-spacing:.1em;text-transform:uppercase}th,td{padding:13px 10px;border-bottom:1px solid #f1e7e9}td:last-child,th:last-child{text-align:right}.total{margin-left:auto;width:min(100%,340px);padding:18px;border-radius:12px;background:#fff5f7}.sum{display:flex;justify-content:space-between;margin:7px 0}.grand{border-top:1px solid #ef5f7d;padding-top:12px;margin-top:12px;font-size:18px;font-weight:bold;color:#ef5f7d}
.status{margin-top:28px;padding:15px;border-radius:10px;background:#f1f8f9;color:#4a7780}.foot{margin-top:28px;padding-top:18px;border-top:1px solid #eee;text-align:center;color:#777;font-size:11px}
@media(max-width:600px){body{padding:10px}.sheet{padding:22px 16px;border-radius:12px}.top{flex-direction:column}.right{text-align:left}.people{grid-template-columns:1fr;gap:10px}th,td{padding:9px 5px;font-size:11px}}
@media print{body{padding:0;background:#fff}.sheet{max-width:none;padding:24px;border:0;border-radius:0;box-shadow:none}@page{size:A4;margin:14mm}}
</style></head><body><main class="sheet">
<header class="top"><div><img class="brand-logo" src="/assets/logo/araina-logo-dark.png" alt="ARAINA — Empowering To Rise"><p><strong>${escapeHtml(COMPANY_INFO.name)}</strong><br><span class="muted">${escapeHtml(COMPANY_INFO.address)}<br>${escapeHtml(COMPANY_INFO.phone)}</span></p></div><div class="right"><div class="title">ORDER RECEIPT</div><div class="number">#${escapeHtml(order.orderNumber)}</div><div class="muted">${escapeHtml(formatDateTime(order.createdAt))}</div></div></header>
<section class="people"><div class="card"><p class="label">Ordered by</p><div class="person">${escapeHtml(order.orderedByName)}</div><div class="info">${escapeHtml(formatPhone(order.orderedByMobile || ""))}</div></div><div class="card"><p class="label">Ordered for · ${order.recipientType === "other" ? "Someone else" : "Myself"}</p><div class="person">${escapeHtml(recipient.name || order.deliveryRecipientName)}</div><div class="info">${escapeHtml(formatPhone(recipient.mobile || ""))}${recipient.alternateMobile ? ` · Alt: ${escapeHtml(formatPhone(recipient.alternateMobile))}` : ""}</div><div class="info">${addressHtml}</div></div></section>
<p class="label">Order details</p><table><thead><tr><th>Product</th><th>Mega Boxes</th><th>Rate / Mega Box</th><th>Amount</th></tr></thead><tbody><tr><td><strong>${escapeHtml(item.product || "Araina Sanitary Pads")}</strong></td><td>${escapeHtml(item.boxes)}</td><td>${escapeHtml(formatCurrency(item.pricePerBox || 0))}</td><td>${escapeHtml(formatCurrency(item.subtotal || 0))}</td></tr></tbody></table>
<div class="total"><div class="sum"><span>Subtotal</span><strong>${escapeHtml(formatCurrency(order.subtotal))}</strong></div>${order.discount ? `<div class="sum"><span>Coupon discount</span><strong>−${escapeHtml(formatCurrency(order.discount))}</strong></div>` : ""}<div class="sum grand"><span>Total</span><span>${escapeHtml(formatCurrency(order.total))}</span></div></div>
<div class="status"><strong>Delivery method:</strong> ${escapeHtml(getDeliveryMethodLabel(order.deliveryMethod))} · <strong>Order status:</strong> ${escapeHtml(order.orderStatus)} · <strong>Payment:</strong> ${escapeHtml(paymentStatus)}</div>
${paymentDetails}
${order.deliveryMethod === "hand" ? "" : '<div class="status"><strong>Courier delivery:</strong> If applicable, extra courier charges are payable directly to the courier upon delivery and are not included in the order total.</div>'}
<footer class="foot">Thank you for choosing Araina. For assistance, contact ${escapeHtml(COMPANY_INFO.phone)}.<br>${escapeHtml(paymentFooter)}</footer>
</main><script>window.addEventListener("load",()=>window.print())</script></body></html>`;
};

const addressFieldSpecs = [
  ["houseNumber", "House / flat number", true, 100],
  ["building", "Building / apartment", false, 100],
  ["street", "Street / road", true, 255],
  ["area", "Area / locality", true, 100],
  ["landmark", "Nearby landmark", false, 100],
  ["village", "Village", false, 100],
  ["city", "City / town", true, 100],
  ["district", "District", true, 100],
  ["state", "State", true, 100],
  ["pinCode", "PIN code", true, 6],
];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("place-order");
  const [user, setUser] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState({ enabled: false });
  const [paymentFeedback, setPaymentFeedback] = useState("");
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState("");
  const [qrImageReady, setQrImageReady] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedBoxes, setSelectedBoxes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [recipientType, setRecipientType] = useState("self");
  const [recipient, setRecipient] = useState(blankRecipient);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!paymentProof) {
      setProofPreviewUrl("");
      return undefined;
    }
    const previewUrl = URL.createObjectURL(paymentProof);
    setProofPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [paymentProof]);

  const product = catalog.find((item) => item.id === selectedProductId);
  const selectedTier = product?.quantities.find(
    (item) => item.boxes === Number(selectedBoxes),
  );
  const subtotal = selectedTier
    ? selectedTier.boxes * selectedTier.pricePerBox
    : 0;
  const selectedCoupon = coupons.find(
    (coupon) => coupon.id === selectedCouponId,
  );
  const discount = selectedCoupon
    ? Math.min(
        subtotal,
        selectedCoupon.discountType === "percentage"
          ? Math.round((subtotal * selectedCoupon.discountValue) / 100)
          : selectedCoupon.discountValue,
      )
    : 0;
  const total = subtotal - discount;
  const orderRecipientType = deliveryMethod === "hand" ? "self" : recipientType;

  const loadOrderData = useCallback(async () => {
    const [
      account,
      availableProducts,
      orderHistory,
      availableCoupons,
      paymentOptions,
    ] = await Promise.all([
      requestPortalJson("/api/auth/me"),
      requestPortalJson("/api/orders/catalog"),
      requestPortalJson("/api/orders"),
      requestPortalJson("/api/orders/coupons"),
      requestPortalJson("/api/orders/payment-config"),
    ]);
    if (
      !account ||
      !Array.isArray(availableProducts) ||
      !Array.isArray(orderHistory) ||
      !Array.isArray(availableCoupons) ||
      !paymentOptions ||
      typeof paymentOptions !== "object"
    ) {
      throw new Error(
        "We couldn’t load your order information. Please refresh and try again.",
      );
    }
    setUser(account);
    setCatalog(availableProducts);
    setOrders(orderHistory);
    setCoupons(availableCoupons);
    setPaymentConfig(paymentOptions);
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      const verifiedOrder = orderHistory.find(
        (order) =>
          order.orderNumber === params.get("order") &&
          order.paymentStatus === "success",
      );
      if (verifiedOrder) {
        setReceiptOrder(verifiedOrder);
        setPaymentFeedback(
          "Your payment is confirmed and your order is complete.",
        );
      } else {
        setPaymentFeedback(
          "We’re still confirming your payment. Your order will appear here once it’s verified. Please don’t pay again yet.",
        );
      }
    }
    const initialProduct = availableProducts[0];
    if (initialProduct) {
      setSelectedProductId(initialProduct.id);
      setSelectedBoxes(String(initialProduct.quantities[0]?.boxes || ""));
    }
    const address = account.address || {};
    setRecipient({
      fullName: account.profile?.fullName || "",
      mobile: account.mobile || "",
      alternateMobile: account.profile?.alternateMobile || "",
      address: Object.fromEntries(
        Object.keys(blankRecipient.address).map((key) => [
          key,
          address[key] || "",
        ]),
      ),
    });
  }, []);

  useEffect(() => {
    loadOrderData()
      .catch((loadError) =>
        setError(
          getPortalErrorMessage(
            loadError,
            "We couldn’t load your orders. Please refresh and try again.",
          ),
        ),
      )
      .finally(() => setIsLoading(false));
  }, [loadOrderData]);

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("payment");
    if (!status) return;

    const messages = {
      success: "Your payment is being confirmed.",
      failed:
        "Your payment could not be completed, so your order was not placed. Please try again.",
      pending:
        "Your payment is still being confirmed. Please don’t pay again yet; check your order history shortly.",
      verification_failed:
        "We couldn’t confirm your payment yet, so your order is not marked as paid. If your account was charged, please contact Araina support before trying again.",
    };
    setPaymentFeedback(
      messages[status] ||
        "We couldn’t confirm your payment yet. Please check your order history or contact Araina support.",
    );
    setPaymentFailed(status === "failed");
    setActiveTab("order-history");
  }, []);

  useEffect(() => {
    let active = true;
    const refreshCatalog = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const latestCatalog = await requestPortalJson("/api/orders/catalog");
        if (active) setCatalog(latestCatalog);
      } catch (refreshError) {
        if (active) {
          setError(
            getPortalErrorMessage(
              refreshError,
              "We couldn’t refresh product availability. Please try again.",
            ),
          );
        }
      }
    };
    const refreshOnFocus = () => refreshCatalog();
    const timer = window.setInterval(refreshCatalog, 5000);
    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, []);

  const changeRecipientType = (type) => {
    setRecipientType(type);
    setFieldErrors({});
    setError("");
    if (type === "self") {
      const address = user?.address || {};
      setRecipient({
        fullName: user?.profile?.fullName || "",
        mobile: user?.mobile || "",
        alternateMobile: user?.profile?.alternateMobile || "",
        address: Object.fromEntries(
          Object.keys(blankRecipient.address).map((key) => [
            key,
            address[key] || "",
          ]),
        ),
      });
    } else {
      setRecipient(blankRecipient);
    }
  };

  const changeRecipientField = (event) => {
    const { name, value } = event.target;
    setRecipient((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  };

  const changeRecipientAddress = (event) => {
    const { name, value } = event.target;
    setRecipient((current) => ({
      ...current,
      address: {
        ...current.address,
        [name]:
          name === "pinCode" ? value.replace(/\D/g, "").slice(0, 6) : value,
      },
    }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  };

  const validateRecipient = () => {
    if (orderRecipientType === "self") {
      const issues = {};
      if (!user?.profile?.fullName?.trim()) {
        issues.self = "Complete your profile before placing an order.";
      }
      if (!user?.mobile)
        issues.self = "Your account mobile number is unavailable.";
      if (!user?.address) {
        issues.self =
          deliveryMethod === "hand"
            ? "Add a delivery address to your profile before placing a hand-delivered order."
            : "Add a delivery address to your profile, or choose “Someone else”.";
      }
      setFieldErrors(issues);
      return Object.keys(issues).length === 0;
    }

    const issues = {};
    if (recipient.fullName.trim().length < 2)
      issues.fullName = "Enter the recipient's full name.";
    if (!isValidIndianPhone(recipient.mobile))
      issues.mobile = "Enter a valid 10-digit mobile number.";
    if (
      recipient.alternateMobile &&
      !isValidIndianPhone(recipient.alternateMobile)
    ) {
      issues.alternateMobile =
        "Enter a valid 10-digit alternate mobile number.";
    }
    for (const [field, label] of [
      ["houseNumber", "House / flat number"],
      ["street", "Street / road"],
      ["area", "Area / locality"],
      ["city", "City / town"],
      ["district", "District"],
      ["state", "State"],
    ]) {
      if (!recipient.address[field].trim())
        issues[field] = `${label} is required.`;
    }
    if (!isValidPIN(recipient.address.pinCode)) {
      issues.pinCode = "Enter a valid 6-digit PIN code.";
    }
    setFieldErrors(issues);
    return Object.keys(issues).length === 0;
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError("");
    if (!selectedTier) {
      setError("Choose an available order quantity.");
      return;
    }
    if (!validateRecipient()) return;
    setPaymentStep(true);
    setQrImageReady(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitQrOrder = async (event) => {
    event.preventDefault();
    setError("");
    if (!paymentProof) {
      setError("Upload a screenshot of your payment to continue.");
      return;
    }
    if (!qrImageReady) {
      setError("The payment QR code is unavailable. Please contact Araina support.");
      return;
    }
    setIsSubmitting(true);
    try {
      const paymentProofData = await fileToBase64(paymentProof);
      const order = await requestPortalJson("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boxes: selectedTier.boxes,
          recipientType: orderRecipientType,
          deliveryMethod,
          ...(selectedCouponId && { couponId: selectedCouponId }),
          ...(orderRecipientType === "other" && {
            recipient: {
              fullName: recipient.fullName.trim(),
              mobile: recipient.mobile,
              alternateMobile: recipient.alternateMobile,
              address: Object.fromEntries(
                Object.entries(recipient.address).map(([key, value]) => [
                  key,
                  value.trim(),
                ]),
              ),
            },
          }),
          paymentProof: {
            contentType: paymentProof.type,
            data: paymentProofData,
          },
        }),
      });
      setPlacedOrder(order);
      setOrders((current) => [order, ...current]);
      setCoupons((current) =>
        current.filter((coupon) => coupon.id !== selectedCouponId),
      );
      setSelectedCouponId("");
      setPaymentProof(null);
      setPaymentStep(false);
      setActiveTab("order-history");
    } catch (submitError) {
      setError(
        getPortalErrorMessage(
          submitError,
          "We couldn’t start your order. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderedByName =
    user?.profile?.fullName?.trim() || "Profile name required";
  const orderedByMobile = user?.mobile
    ? formatPhone(user.mobile)
    : "Mobile unavailable";
  const recipientPreview =
    orderRecipientType === "self"
      ? {
          name: user?.profile?.fullName,
          mobile: user?.mobile,
          alternateMobile: user?.profile?.alternateMobile,
          address: user?.address,
        }
      : {
          name: recipient.fullName,
          mobile: recipient.mobile,
          alternateMobile: recipient.alternateMobile,
          address: recipient.address,
        };

  const downloadReceipt = (order) => {
    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) {
      setError("Allow pop-ups to download or print your receipt.");
      return;
    }
    invoiceWindow.opener = null;
    invoiceWindow.document.open();
    invoiceWindow.document.write(getInvoiceHtml(order));
    invoiceWindow.document.close();
  };

  const currentAddressLines = getAddressLines(recipientPreview.address);

  return (
    <PortalLayout showHeader isAuthenticated>
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-araina-pink">
            Araina member portal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-araina-black">
            Orders
          </h1>
          <p className="mt-2 text-sm text-araina-black/60">
            Place an order for yourself or arrange delivery for someone else.
          </p>
        </motion.div>

        <div className="mt-7 flex gap-5 border-b border-araina-pink/10">
          {[
            ["place-order", "Place an order"],
            ["order-history", "Order history"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-1 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === tab
                  ? "border-araina-pink text-araina-pink"
                  : "border-transparent text-araina-black/55 hover:text-araina-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
            {error.toLowerCase().includes("profile") && (
              <button
                type="button"
                onClick={() => window.location.assign("/portal/profile")}
                className="ml-2 font-semibold underline"
              >
                Complete profile
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-sm text-araina-black/60">
            <LoaderCircle className="animate-spin text-araina-pink" />
            Loading products and your profile…
          </div>
        ) : activeTab === "place-order" ? (
          <form
            onSubmit={paymentStep ? submitQrOrder : placeOrder}
            className="mt-6 space-y-6"
          >
            {!catalog.length ? (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                No orderable products are configured yet. Add an active product,
                and pricing tiers in the database before placing orders.
              </section>
            ) : paymentStep ? (
              <>
                <section className="overflow-hidden rounded-3xl border border-araina-pink/15 bg-white shadow-sm">
                  <header className="border-b border-araina-pink/10 px-5 py-5 sm:px-8">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentStep(false);
                        setError("");
                      }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-araina-blue transition hover:text-araina-pink"
                    >
                      <ArrowLeft size={17} /> Back to order details
                    </button>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-araina-pink">
                          Step 2 of 2 · Secure checkout
                        </p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-araina-black">
                          Pay by QR code
                        </h2>
                        <p className="mt-1 max-w-xl text-sm leading-6 text-araina-black/55">
                          Scan the code with your UPI app, pay the amount shown,
                          and upload your payment confirmation.
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 self-start rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-800 sm:self-auto">
                        <QrCode size={15} /> UPI payment
                      </div>
                    </div>
                  </header>

                  <div className="grid items-start gap-5 p-4 sm:gap-6 sm:p-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <section className="rounded-2xl border border-araina-pink/10 bg-[#fbf8f8] p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-araina-black/45">
                            Amount to pay
                          </p>
                          <p className="mt-1 text-2xl font-bold tracking-tight text-araina-pink">
                            {formatCurrency(total)}
                          </p>
                        </div>
                        <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-araina-black/60 shadow-sm">
                          By QR code
                        </span>
                      </div>
                      <div className="rounded-xl border border-black/5 bg-white p-2 shadow-sm sm:p-3">
                        <img
                          src={paymentConfig.qrImageUrl || "/payment-qr.jpeg"}
                          alt="Araina payment QR code"
                          onLoad={() => setQrImageReady(true)}
                          onError={() => setQrImageReady(false)}
                          className="mx-auto block h-auto max-h-[min(72vh,720px)] w-auto max-w-full rounded-lg object-contain"
                        />
                      </div>
                      {!qrImageReady ? (
                        <p role="alert" className="mt-3 text-xs leading-5 text-red-700">
                          Payment QR code not found. Add the approved QR image
                          at <code>public/payment-qr.jpeg</code> and reload.
                        </p>
                      ) : (
                        <p className="mt-3 text-center text-xs leading-5 text-araina-black/55">
                          Check the recipient name in your UPI app before
                          confirming payment.
                        </p>
                      )}
                    </section>

                    <div className="space-y-5">
                      <section className="rounded-2xl border border-araina-pink/10 p-4 sm:p-5">
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-araina-black/50">
                          Order summary
                        </h3>
                        <p className="mt-3 font-semibold text-araina-black">
                          {product?.name}
                        </p>
                        <p className="mt-1 text-sm text-araina-black/55">
                          {selectedTier?.boxes} Mega{" "}
                          {selectedTier?.boxes === 1 ? "Box" : "Boxes"}
                        </p>
                        <div className="mt-4 space-y-3 border-t border-araina-pink/10 pt-4 text-sm">
                          <p className="flex justify-between gap-4">
                            <span className="text-araina-black/60">Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                          </p>
                          {discount > 0 && (
                            <p className="flex justify-between gap-4 text-green-700">
                              <span>Coupon discount</span>
                              <span className="font-medium">−{formatCurrency(discount)}</span>
                            </p>
                          )}
                          <p className="flex justify-between gap-4 border-t border-araina-pink/10 pt-3 font-bold">
                            <span>Total</span>
                            <span className="text-araina-pink">{formatCurrency(total)}</span>
                          </p>
                        </div>
                      </section>

                      <section className="rounded-2xl border border-araina-pink/10 p-4 sm:p-5">
                        <div>
                          <h3 className="text-sm font-semibold text-araina-black">
                            Upload payment screenshot
                          </h3>
                          <p className="mt-1 text-xs leading-5 text-araina-black/55">
                            JPEG, PNG, or WebP · maximum 5 MB
                          </p>
                        </div>
                        <label className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-araina-pink/35 bg-araina-pink/[0.025] px-4 py-5 text-center transition hover:border-araina-pink hover:bg-araina-pink/[0.06]">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-araina-pink shadow-sm">
                            <ImagePlus size={19} />
                          </span>
                          <span className="mt-2 text-sm font-semibold text-araina-pink">
                            {paymentProof ? "Choose a different image" : "Choose screenshot"}
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              if (
                                file &&
                                !["image/jpeg", "image/png", "image/webp"].includes(
                                  file.type,
                                )
                              ) {
                                setPaymentProof(null);
                                setError("Choose a JPEG, PNG, or WebP screenshot.");
                              } else if (file && file.size > 5 * 1024 * 1024) {
                                setPaymentProof(null);
                                setError("Payment screenshots must be 5 MB or smaller.");
                              } else {
                                setPaymentProof(file);
                                setError("");
                              }
                            }}
                          />
                        </label>
                        {proofPreviewUrl && (
                          <div className="mt-3 flex items-center gap-3 rounded-xl bg-green-50 p-3">
                            <img
                              src={proofPreviewUrl}
                              alt="Selected payment screenshot preview"
                              className="h-14 w-14 rounded-lg border border-green-100 bg-white object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-green-900">
                                {paymentProof.name}
                              </p>
                              <p className="mt-0.5 text-xs text-green-800">
                                Screenshot ready to upload
                              </p>
                            </div>
                            <CheckCircle2 size={18} className="shrink-0 text-green-700" />
                          </div>
                        )}
                        <p className="mt-4 text-xs leading-5 text-araina-black/55">
                          Your order will remain pending until our team verifies
                          the payment screenshot.
                        </p>
                      </section>
                    </div>
                  </div>
                </section>
                <div
                  aria-live="polite"
                  aria-busy={isSubmitting}
                  className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-araina-pink/15 bg-white/95 p-4 shadow-[0_12px_40px_rgba(30,20,25,0.14)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
                >
                  <p className="text-sm text-araina-black/65">
                    Total <strong className="ml-2 text-lg text-araina-pink">{formatCurrency(total)}</strong>
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting || !paymentProof || !qrImageReady}
                    className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-araina-pink to-[#e94f70] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-araina-pink/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-64"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle size={19} className="animate-spin" />
                        Placing your order…
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Continue and place order
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                {paymentFeedback && (
                  <div
                    role="status"
                    className={`rounded-xl border p-4 text-sm ${
                      receiptOrder
                        ? "border-green-200 bg-green-50 text-green-800"
                        : "border-amber-200 bg-amber-50 text-amber-900"
                    }`}
                  >
                    {paymentFeedback}
                    {paymentFailed && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("place-order");
                          setPaymentFeedback("");
                          setPaymentFailed(false);
                        }}
                        className="ml-2 font-semibold underline"
                      >
                        Try again
                      </button>
                    )}
                  </div>
                )}
                <section className="rounded-2xl border border-araina-pink/15 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-araina-pink/10 text-araina-pink">
                      <PackageCheck size={19} />
                    </span>
                    <div>
                      <h2 className="font-semibold text-araina-black">
                        Choose your product
                      </h2>
                      <p className="mt-1 text-xs text-araina-black/55">
                        Product name is fixed. Select an available quantity.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-araina-pink/[0.04] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-araina-pink">
                      Product
                    </p>
                    <p className="mt-1 text-lg font-semibold text-araina-black">
                      {product?.name}
                    </p>
                    <p className="mt-1 text-sm text-araina-black/55">
                      {product?.description}
                    </p>
                  </div>

                  <fieldset className="mt-6">
                    <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-araina-black/75">
                      Quantity · Mega Boxes{" "}
                      <span className="text-araina-pink">*</span>
                    </legend>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      {product?.quantities.map((tier) => (
                        <button
                          type="button"
                          key={tier.boxes}
                          onClick={() => setSelectedBoxes(String(tier.boxes))}
                          className={`min-w-0 rounded-xl border-2 p-3 text-left transition sm:p-4 ${
                            Number(selectedBoxes) === tier.boxes
                              ? "border-araina-pink bg-araina-pink/[0.04] shadow-md shadow-araina-pink/5"
                              : "border-araina-pink/10 hover:border-araina-pink/40"
                          }`}
                        >
                          <span className="block text-lg font-bold text-araina-black sm:text-2xl">
                            {tier.boxes} Mega{" "}
                            {tier.boxes === 1 ? "Box" : "Boxes"}
                          </span>
                          <span className="mt-3 block text-[10px] text-araina-black/50 line-through">
                            MRP {formatCurrency(tier.mrp)}
                          </span>
                          <span className="mt-1 block text-[10px] text-araina-black/65">
                            Discount {formatCurrency(tier.discount)}
                          </span>
                          <span className="mt-1 block text-[10px] text-green-700">
                            Discount % {tier.discountPercentage.toFixed(2)}
                          </span>
                          <span className="mt-2 block text-sm font-bold text-araina-pink sm:text-base">
                            {formatCurrency(tier.executiveRate)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </section>

                <section className="rounded-2xl border border-araina-blue/15 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-araina-blue/10 text-araina-blue">
                      <UserRound size={19} />
                    </span>
                    <div>
                      <h2 className="font-semibold text-araina-black">
                        Order and delivery details
                      </h2>
                      <p className="mt-1 text-xs text-araina-black/55">
                        The order is placed by you. Choose who should receive
                        it.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-araina-blue/10 bg-araina-blue/[0.04] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-araina-blue">
                        Ordered by · account holder
                      </p>
                      <p className="mt-2 font-semibold text-araina-black">
                        {orderedByName}
                      </p>
                      <p className="mt-1 text-sm text-araina-black/60">
                        {orderedByMobile}
                      </p>
                    </div>
                    <div className="flex items-center rounded-xl border border-araina-blue/10 bg-araina-blue/[0.04] p-4">
                      <p className="text-xs leading-5 text-araina-black/60">
                        The purchaser details come from your profile and are
                        stored separately from delivery recipient details.
                      </p>
                    </div>
                  </div>

                  <fieldset className="mt-6">
                    <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-araina-black/75">
                      Delivery method
                    </legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        ["hand", "By Hand"],
                        ["courier", "Courier"],
                      ].map(([method, label]) => (
                        <label
                          key={method}
                          className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition ${
                            deliveryMethod === method
                              ? "border-araina-pink bg-araina-pink/[0.035]"
                              : "border-araina-pink/10 hover:border-araina-pink/35"
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value={method}
                            checked={deliveryMethod === method}
                            onChange={() => {
                              setDeliveryMethod(method);
                              setFieldErrors({});
                              setError("");
                            }}
                            className="mt-1 accent-araina-pink"
                          />
                          <span className="text-sm font-semibold text-araina-black">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {deliveryMethod === "courier" && (
                    <>
                      <fieldset className="mt-6">
                        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-araina-black/75">
                          Who is this order for?
                        </legend>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {[
                            [
                              "self",
                              "Myself",
                              "Deliver to the name and saved address in my profile.",
                            ],
                            [
                              "other",
                              "Someone else",
                              "Enter their recipient and delivery details.",
                            ],
                          ].map(([type, label, description]) => (
                            <label
                              key={type}
                              className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition ${
                                recipientType === type
                                  ? "border-araina-pink bg-araina-pink/[0.035]"
                                  : "border-araina-pink/10 hover:border-araina-pink/35"
                              }`}
                            >
                              <input
                                type="radio"
                                name="recipientType"
                                value={type}
                                checked={recipientType === type}
                                onChange={() => changeRecipientType(type)}
                                className="mt-1 accent-araina-pink"
                              />
                              <span>
                                <span className="block text-sm font-semibold text-araina-black">
                                  {label}
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-araina-black/55">
                                  {description}
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>

                      {fieldErrors.self && (
                        <p
                          role="alert"
                          className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                        >
                          {fieldErrors.self}
                          {user?.profile?.fullName && !user?.address && (
                            <button
                              type="button"
                              onClick={() =>
                                window.location.assign("/portal/profile")
                              }
                              className="ml-2 font-semibold underline"
                            >
                              Add an address
                            </button>
                          )}
                        </p>
                      )}

                      {recipientType === "other" && (
                        <div className="mt-6 space-y-6">
                          <div>
                            <h3 className="text-sm font-semibold text-araina-black">
                              Recipient information
                            </h3>
                            <p className="mt-1 text-xs text-araina-black/55">
                              These details will be saved with this order only.
                            </p>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                              {[
                                [
                                  "fullName",
                                  "Recipient full name",
                                  true,
                                  "text",
                                ],
                                ["mobile", "Recipient mobile", true, "tel"],
                                [
                                  "alternateMobile",
                                  "Alternate mobile",
                                  false,
                                  "tel",
                                ],
                              ].map(([name, label, required, type]) => (
                                <label
                                  key={name}
                                  className="min-w-0 text-xs font-semibold text-araina-black/75"
                                >
                                  {label}
                                  {required ? (
                                    <span className="ml-1 text-araina-pink">
                                      *
                                    </span>
                                  ) : (
                                    <span className="ml-2 font-normal text-araina-black/45">
                                      Optional
                                    </span>
                                  )}
                                  <input
                                    className={`${inputClass} mt-2 ${fieldErrors[name] ? "border-red-300 bg-red-50" : ""}`}
                                    type={type}
                                    inputMode={
                                      type === "tel" ? "tel" : undefined
                                    }
                                    autoComplete={
                                      name === "fullName" ? "name" : "tel"
                                    }
                                    maxLength={name === "fullName" ? 255 : 20}
                                    required={required}
                                    value={recipient[name]}
                                    onChange={changeRecipientField}
                                    name={name}
                                    placeholder={label}
                                  />
                                  {fieldErrors[name] && (
                                    <span className="mt-1 block font-normal text-red-600">
                                      {fieldErrors[name]}
                                    </span>
                                  )}
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-araina-black">
                              Recipient delivery address
                            </h3>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              {addressFieldSpecs.map(
                                ([name, label, required, maxLength]) => (
                                  <label
                                    key={name}
                                    className="min-w-0 text-xs font-semibold text-araina-black/75"
                                  >
                                    {label}
                                    {required && (
                                      <span className="ml-1 text-araina-pink">
                                        *
                                      </span>
                                    )}
                                    <input
                                      className={`${inputClass} mt-2 ${fieldErrors[name] ? "border-red-300 bg-red-50" : ""}`}
                                      name={name}
                                      maxLength={maxLength}
                                      required={required}
                                      autoComplete={
                                        name === "pinCode"
                                          ? "postal-code"
                                          : undefined
                                      }
                                      inputMode={
                                        name === "pinCode"
                                          ? "numeric"
                                          : undefined
                                      }
                                      value={recipient.address[name]}
                                      onChange={changeRecipientAddress}
                                      placeholder={label}
                                    />
                                    {fieldErrors[name] && (
                                      <span className="mt-1 block font-normal text-red-600">
                                        {fieldErrors[name]}
                                      </span>
                                    )}
                                  </label>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>

                <section className="rounded-2xl border border-araina-pink/15 bg-gradient-to-br from-araina-pink/[0.04] to-araina-blue/[0.04] p-5 sm:p-7">
                  <h2 className="font-semibold uppercase tracking-wider text-araina-black">
                    Order summary
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-3 text-sm">
                      <p className="flex justify-between gap-4">
                        <span className="text-araina-black/60">Product</span>
                        <span className="text-right font-medium">
                          {product?.name || "—"}
                        </span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span className="text-araina-black/60">Quantity</span>
                        <span className="text-right font-medium">
                          {selectedTier
                            ? `${selectedTier.boxes} Mega ${selectedTier.boxes === 1 ? "Box" : "Boxes"}`
                            : "Select quantity"}
                        </span>
                      </p>
                    </div>
                    <div className="rounded-xl border border-araina-pink/10 bg-white/80 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-araina-pink">
                        {recipientType === "self"
                          ? "Delivering to you"
                          : "Delivering to"}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-araina-black">
                        {recipientPreview.name || "Recipient name"}
                      </p>
                      <p className="mt-1 text-xs text-araina-black/60">
                        {recipientPreview.mobile
                          ? formatPhone(recipientPreview.mobile)
                          : "Recipient mobile"}
                        {recipientPreview.alternateMobile
                          ? ` · Alt ${formatPhone(recipientPreview.alternateMobile)}`
                          : ""}
                      </p>
                      <div className="mt-2 flex gap-2 text-xs leading-5 text-araina-black/55">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span>
                          {currentAddressLines.join(", ") || "Delivery address"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 border-t border-araina-pink/15 pt-4">
                    {deliveryMethod === "courier" && (
                      <div
                        role="note"
                        className="rounded-xl border border-araina-blue/20 bg-araina-blue/[0.05] p-3 text-xs leading-5 text-araina-black/75"
                      >
                        <p className="font-semibold text-araina-blue">
                          Additional courier charges
                        </p>
                        <p className="mt-1">
                          Pay the courier charges directly to the courier upon
                          delivery. These charges are not included in the order
                          total.
                        </p>
                      </div>
                    )}
                    {coupons.length > 0 && (
                      <label className="block text-xs font-semibold text-araina-black/75">
                        Apply a coupon
                        <select
                          value={selectedCouponId}
                          onChange={(event) =>
                            setSelectedCouponId(event.target.value)
                          }
                          className={`${inputClass} mt-2`}
                        >
                          <option value="">No coupon</option>
                          {coupons.map((coupon) => (
                            <option key={coupon.id} value={coupon.id}>
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountValue}% off`
                                : `${formatCurrency(coupon.discountValue)} off`}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <p className="flex justify-between text-sm">
                      <span className="text-araina-black/60">
                        Subtotal ({selectedTier?.boxes || 0} ×{" "}
                        {formatCurrency(selectedTier?.pricePerBox || 0)} per
                        Mega Box)
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(subtotal)}
                      </span>
                    </p>
                    {discount > 0 && (
                      <p className="flex justify-between text-sm text-green-700">
                        <span>Coupon discount</span>
                        <span>−{formatCurrency(discount)}</span>
                      </p>
                    )}
                    <p className="flex justify-between border-t border-araina-pink/15 pt-3">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold text-araina-pink">
                        {formatCurrency(total)}
                      </span>
                    </p>
                    <p className="text-xs text-araina-black/50">
                      Pay by QR code on the next screen. Your coupon is held
                      for this order until payment is reviewed.
                    </p>
                  </div>
                </section>

                <div
                  aria-live="polite"
                  aria-busy={isSubmitting}
                  className="sticky bottom-3 z-20 flex flex-col gap-4 rounded-2xl border border-araina-pink/15 bg-white/95 p-4 shadow-[0_12px_40px_rgba(30,20,25,0.14)] backdrop-blur-md sm:bottom-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
                >
                  <div className="flex items-center justify-between gap-4 sm:justify-start">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-araina-black/50">
                        Order total
                      </p>
                      <p className="mt-0.5 text-2xl font-bold tracking-tight text-araina-pink">
                        {formatCurrency(total)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-araina-black/50">
                        Pay by QR code
                      </p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-araina-pink/10 text-araina-pink sm:hidden">
                      <ShoppingBag size={20} />
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedTier || !catalog.length}
                    className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-araina-pink to-[#e94f70] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-araina-pink/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-araina-pink/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-araina-pink/25 disabled:cursor-not-allowed disabled:translate-y-0 disabled:from-araina-pink/50 disabled:to-araina-pink/50 disabled:shadow-none sm:w-auto sm:min-w-64"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle size={19} className="animate-spin" />
                        Preparing payment…
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} />
                        Continue to payment
                        <ArrowRight
                          size={18}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        ) : (
          <section className="mt-6 space-y-5">
            {paymentFeedback && (
              <div
                role="status"
                className={`rounded-xl border p-4 text-sm ${
                  receiptOrder
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-amber-200 bg-amber-50 text-amber-900"
                }`}
              >
                {paymentFeedback}
                {paymentFailed && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("place-order");
                      setPaymentFeedback("");
                      setPaymentFailed(false);
                    }}
                    className="ml-2 font-semibold underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            )}

            {receiptOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-araina-black/50 p-4">
                <section
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="payment-receipt-title"
                  className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-araina-pink">
                        Payment confirmed
                      </p>
                      <h2
                        id="payment-receipt-title"
                        className="mt-2 text-2xl font-bold text-araina-black"
                      >
                        Your receipt
                      </h2>
                      <p className="mt-1 text-sm text-araina-black/60">
                        Order #{receiptOrder.orderNumber}
                      </p>
                      <p className="mt-1 text-sm text-araina-black/60">
                        Delivery method: {getDeliveryMethodLabel(receiptOrder.deliveryMethod)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptOrder(null)}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-araina-black/60 hover:bg-araina-pink/5"
                      aria-label="Close receipt"
                    >
                      Close
                    </button>
                  </div>
                  <div className="mt-6 space-y-3 border-y border-araina-pink/10 py-5 text-sm">
                    {receiptOrder.items?.map((item, index) => (
                      <div
                        key={`${item.product}-${index}`}
                        className="flex justify-between gap-4"
                      >
                        <span>
                          {item.product} · {item.boxes} Mega{" "}
                          {item.boxes === 1 ? "Box" : "Boxes"}
                        </span>
                        <strong>{formatCurrency(item.subtotal)}</strong>
                      </div>
                    ))}
                    <div className="flex justify-between text-araina-black/60">
                      <span>Subtotal</span>
                      <span>{formatCurrency(receiptOrder.subtotal)}</span>
                    </div>
                    {receiptOrder.discount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Coupon discount</span>
                        <span>−{formatCurrency(receiptOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-araina-pink/10 pt-3 text-base font-bold">
                      <span>
                        {receiptOrder.paymentStatus === "success" ? "Paid" : "Order total"}
                      </span>
                      <span className="text-araina-pink">
                        {formatCurrency(receiptOrder.total)}
                      </span>
                    </div>
                    <p className="text-xs text-araina-black/60">
                      Payment method: {getPaymentMethodLabel(receiptOrder.payment?.provider)}
                    </p>
                    {receiptOrder.payment?.transactionId && (
                      <p className="break-all text-xs text-araina-black/60">
                        Payment reference: {receiptOrder.payment.transactionId}
                      </p>
                    )}
                    {receiptOrder.payment?.paidAt && (
                      <p className="text-xs text-araina-black/60">
                        Paid on: {formatDateTime(receiptOrder.payment.paidAt)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadReceipt(receiptOrder)}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-araina-blue px-5 text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    <Download size={16} /> Print or download receipt
                  </button>
                </section>
              </div>
            )}

            {placedOrder && (
              <div className="space-y-4 rounded-2xl border border-green-200 bg-green-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0 text-green-700" size={24} />
                  <div>
                    <p className="font-semibold text-green-900">
                      Order placed · payment pending verification
                    </p>
                    <p className="mt-1 text-sm text-green-800">
                      Order #{placedOrder.orderNumber}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => downloadReceipt(placedOrder)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-araina-blue px-5 text-xs font-semibold uppercase tracking-wider text-white"
                >
                  <Download size={16} /> Download bill
                </button>
                </div>
                {placedOrder.emailSent === false && (
                  <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    Your order and screenshot are saved, but we couldn’t email
                    the order details to support. Please contact care@arainas.com
                    and share order #{placedOrder.orderNumber}.
                  </p>
                )}
              </div>
            )}

            {orders.length ? (
              orders.map((order) => {
                const item = order.items?.[0];
                return (
                  <article
                    key={order.id}
                    className="rounded-2xl border border-araina-pink/10 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-araina-pink">
                          Order #{order.orderNumber}
                        </p>
                        <p className="mt-1 text-xs text-araina-black/50">
                          {formatDateTime(order.createdAt)}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-araina-black/60">
                          Delivery method: {getDeliveryMethodLabel(order.deliveryMethod)}
                        </p>
                        <p className="mt-4 font-semibold text-araina-black">
                          {item?.product} · {item?.boxes} Mega{" "}
                          {item?.boxes === 1 ? "Box" : "Boxes"}
                        </p>
                        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-xs text-araina-black/60 sm:grid-cols-2">
                          <p>
                            <strong>Ordered by:</strong> {order.orderedByName} ·{" "}
                            {order.orderedByMobile
                              ? formatPhone(order.orderedByMobile)
                              : ""}
                          </p>
                          <p>
                            <strong>Ordered for:</strong>{" "}
                            {order.recipient?.name} ·{" "}
                            {order.recipient?.mobile
                              ? formatPhone(order.recipient.mobile)
                              : ""}
                          </p>
                          <p>
                            <strong>Delivery address:</strong>{" "}
                            {getAddressLines({
                              ...order.recipient?.address,
                              country: order.recipient?.country,
                            }).join(", ")}
                          </p>
                          <p>
                            <strong>Status:</strong> {order.orderStatus} ·{" "}
                            {getPaymentStatusLabel(order.paymentStatus)}
                          </p>
                          {order.payment?.provider && (
                            <p>
                              <strong>Payment method:</strong>{" "}
                              {getPaymentMethodLabel(order.payment.provider)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <p className="text-xl font-bold text-araina-pink">
                          {formatCurrency(order.total)}
                        </p>
                        <button
                          type="button"
                          onClick={() => downloadReceipt(order)}
                          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-araina-blue/20 px-4 text-xs font-semibold text-araina-blue hover:bg-araina-blue/5"
                        >
                          <Download size={15} /> Bill
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-araina-pink/10 bg-white p-8 text-center">
                <PackageCheck
                  className="mx-auto text-araina-pink/60"
                  size={32}
                />
                <p className="mt-3 font-semibold text-araina-black">
                  No orders yet
                </p>
                <p className="mt-1 text-sm text-araina-black/55">
                  Your placed orders will appear here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("place-order")}
                  className="mt-5 rounded-lg bg-araina-pink px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white"
                >
                  Place an order
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </PortalLayout>
  );
};

export default OrdersPage;
