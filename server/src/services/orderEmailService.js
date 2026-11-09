import nodemailer from "nodemailer";
import { getPaymentProof } from "./paymentProofService.js";

const recipientEmail = "care@arainas.com";
let transporter;

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN")}`;

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !process.env.EMAIL_FROM) {
    const error = new Error("Order email delivery is not configured.");
    error.status = 503;
    throw error;
  }

  if (!transporter) {
    const port = Number(SMTP_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      const error = new Error("Order email delivery is not configured.");
      error.status = 503;
      throw error;
    }
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
};

export const sendQrOrderEmail = async (order, proofStorageKey) => {
  const mailer = getTransporter();
  const proof = await getPaymentProof(proofStorageKey);
  const itemRows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:12px;border-bottom:1px solid #f1e7e9">${escapeHtml(item.productNameSnapshot)}</td><td style="padding:12px;border-bottom:1px solid #f1e7e9">${item.quantityBoxes}</td><td style="padding:12px;border-bottom:1px solid #f1e7e9;text-align:right">${formatCurrency(item.subtotal)}</td></tr>`,
    )
    .join("");
  const address = order.deliveryAddress;
  const addressText = [
    address.houseNumber,
    address.building,
    address.street,
    address.area,
    address.landmark,
    address.village,
    address.city,
    address.district,
    address.state,
    address.pinCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
  const attachmentName = `payment-proof-${order.orderNumber}${proof.contentType === "image/png" ? ".png" : proof.contentType === "image/webp" ? ".webp" : ".jpg"}`;

  await mailer.sendMail({
    from: process.env.EMAIL_FROM,
    to: recipientEmail,
    subject: `New QR payment order ${order.orderNumber}`,
    text: [
      `New order ${order.orderNumber}`,
      `Payment method: By QR code`,
      `Payment status: ${order.paymentStatus}`,
      `Ordered by: ${order.orderedByName}`,
      `Delivery method: ${order.deliveryMethod === "hand" ? "By Hand" : "Courier"}`,
      `Mobile: ${order.orderedByMobile || "Not provided"}`,
      `Recipient: ${order.deliveryRecipientName}`,
      `Delivery address: ${addressText}`,
      ...order.items.map(
        (item) =>
          `${item.productNameSnapshot} — ${item.quantityBoxes} Mega Box(es): ${formatCurrency(item.subtotal)}`,
      ),
      `Subtotal: ${formatCurrency(order.subtotal)}`,
      `Coupon discount: ${formatCurrency(order.discount)}`,
      `Order total: ${formatCurrency(order.total)}`,
      "",
      "The payment screenshot is attached.",
    ].join("\n"),
    html: `<div style="font-family:Arial,sans-serif;color:#202020;line-height:1.55;max-width:760px;margin:auto"><div style="padding:24px;border-radius:16px;background:#fff5f7;border:1px solid #f1dce1"><p style="margin:0;color:#e94f70;font-size:12px;font-weight:bold;letter-spacing:2px">NEW PAYMENT SUBMISSION · BY QR CODE</p><h1 style="margin:8px 0 0;font-size:24px">Order ${escapeHtml(order.orderNumber)}</h1></div><h2 style="margin:24px 0 8px;font-size:16px">Customer and delivery</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:6px 0;color:#777">Ordered by</td><td style="padding:6px 0"><strong>${escapeHtml(order.orderedByName)}</strong></td></tr><tr><td style="padding:6px 0;color:#777">Mobile</td><td style="padding:6px 0">${escapeHtml(order.orderedByMobile || "Not provided")}</td></tr><tr><td style="padding:6px 0;color:#777">Delivery method</td><td style="padding:6px 0"><strong>${order.deliveryMethod === "hand" ? "By Hand" : "Courier"}</strong></td></tr><tr><td style="padding:6px 0;color:#777">Recipient</td><td style="padding:6px 0">${escapeHtml(order.deliveryRecipientName)}</td></tr><tr><td style="padding:6px 0;color:#777">Delivery address</td><td style="padding:6px 0">${escapeHtml(addressText)}</td></tr><tr><td style="padding:6px 0;color:#777">Payment status</td><td style="padding:6px 0"><strong>Pending verification · By QR code</strong></td></tr></table><h2 style="margin:24px 0 8px;font-size:16px">Order summary</h2><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#fff5f7;text-align:left"><th style="padding:12px">Product</th><th style="padding:12px">Mega Boxes</th><th style="padding:12px;text-align:right">Amount</th></tr></thead><tbody>${itemRows}</tbody></table><div style="margin:16px 0 0 auto;max-width:340px"><p style="display:flex;justify-content:space-between"><span>Subtotal</span><strong>${formatCurrency(order.subtotal)}</strong></p><p style="display:flex;justify-content:space-between"><span>Coupon discount</span><strong>−${formatCurrency(order.discount)}</strong></p><p style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #ef5f7d;color:#e94f70;font-size:18px"><strong>Order total</strong><strong>${formatCurrency(order.total)}</strong></p></div><p style="padding:14px;background:#f1f8f9;border-radius:10px;color:#4a7780;font-size:13px">Payment screenshot attached. Please verify the payment before updating the payment status.</p></div>`,
    attachments: [
      {
        filename: attachmentName,
        content: proof.buffer,
        contentType: proof.contentType,
      },
    ],
  });
};
