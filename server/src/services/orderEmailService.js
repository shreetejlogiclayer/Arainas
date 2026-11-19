import nodemailer from "nodemailer";
import { getPaymentProof } from "./paymentProofService.js";

const recipientEmail = "care@arainas.com";
const payuNotificationEmail = "aarti.ved777@gmail.com";
const payuSenderEmail = "payments@arainas.com";
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

export const sendPayuOrderEmail = async (order) => {
  const mailer = getTransporter();
  const recipient = order.recipient || {};
  const addressText = [
    ...Object.values(recipient.address || {}),
    recipient.country,
  ]
    .filter(Boolean)
    .join(", ");
  const itemRows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:12px;border-bottom:1px solid #f1e7e9">${escapeHtml(item.product)}</td><td style="padding:12px;border-bottom:1px solid #f1e7e9;text-align:center">${item.boxes}</td><td style="padding:12px;border-bottom:1px solid #f1e7e9;text-align:right">${formatCurrency(item.pricePerBox)}</td><td style="padding:12px;border-bottom:1px solid #f1e7e9;text-align:right">${formatCurrency(item.subtotal)}</td></tr>`,
    )
    .join("");
  const paymentReference = order.payment?.transactionId || "Not available";
  const amountReceived = order.payment?.amount ?? order.total;
  const paidAt = order.payment?.paidAt
    ? new Date(order.payment.paidAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      })
    : "Not available";
  const deliveryMethod =
    order.deliveryMethod === "hand" ? "By Hand" : "Courier";

  await mailer.sendMail({
    from: { name: "Araina Payments", address: payuSenderEmail },
    to: payuNotificationEmail,
    subject: `Payment received · Order ${order.orderNumber}`,
    text: [
      `Payment received for order ${order.orderNumber}`,
      `Order date: ${new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}`,
      `Payment status: ${order.paymentStatus}`,
      `Payment method: ${order.payment?.provider || "PayU"}`,
      `Payment reference: ${paymentReference}`,
      `Amount received: ${formatCurrency(amountReceived)}`,
      `Paid at: ${paidAt}`,
      `Ordered by: ${order.orderedByName}`,
      `Mobile: ${order.orderedByMobile || "Not provided"}`,
      `Delivery method: ${deliveryMethod}`,
      `Recipient: ${recipient.name || order.deliveryRecipientName}`,
      `Recipient mobile: ${recipient.mobile || "Not provided"}`,
      `Alternate mobile: ${recipient.alternateMobile || "Not provided"}`,
      `Delivery address: ${addressText}`,
      ...order.items.map(
        (item) =>
          `${item.product} — ${item.boxes} Mega Box(es) at ${formatCurrency(item.pricePerBox)} each: ${formatCurrency(item.subtotal)}`,
      ),
      `Subtotal: ${formatCurrency(order.subtotal)}`,
      `Coupon discount: ${formatCurrency(order.discount)}`,
      `Order total: ${formatCurrency(order.total)}`,
      `Order status: ${order.orderStatus}`,
    ].join("\n"),
    html: `<div style="font-family:Arial,sans-serif;color:#202020;line-height:1.55;max-width:760px;margin:auto"><div style="padding:24px;border-radius:16px;background:#fff5f7;border:1px solid #f1dce1"><p style="margin:0;color:#e94f70;font-size:12px;font-weight:bold;letter-spacing:2px">PAYMENT CONFIRMED · PAYU</p><h1 style="margin:8px 0 0;font-size:24px">Order ${escapeHtml(order.orderNumber)}</h1><p style="margin:6px 0 0;color:#555">Received ${escapeHtml(paidAt)}</p></div><h2 style="margin:24px 0 8px;font-size:16px">Payment details</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:6px 0;color:#777">Status</td><td style="padding:6px 0"><strong>${escapeHtml(order.paymentStatus)}</strong></td></tr><tr><td style="padding:6px 0;color:#777">Amount received</td><td style="padding:6px 0"><strong style="color:#e94f70">${formatCurrency(amountReceived)}</strong></td></tr><tr><td style="padding:6px 0;color:#777">Payment reference</td><td style="padding:6px 0">${escapeHtml(paymentReference)}</td></tr><tr><td style="padding:6px 0;color:#777">Order date</td><td style="padding:6px 0">${escapeHtml(new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }))}</td></tr></table><h2 style="margin:24px 0 8px;font-size:16px">Customer and delivery</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:6px 0;color:#777">Ordered by</td><td style="padding:6px 0">${escapeHtml(order.orderedByName)}</td></tr><tr><td style="padding:6px 0;color:#777">Purchaser mobile</td><td style="padding:6px 0">${escapeHtml(order.orderedByMobile || "Not provided")}</td></tr><tr><td style="padding:6px 0;color:#777">Recipient</td><td style="padding:6px 0">${escapeHtml(recipient.name || order.deliveryRecipientName)}</td></tr><tr><td style="padding:6px 0;color:#777">Recipient mobile</td><td style="padding:6px 0">${escapeHtml(recipient.mobile || "Not provided")}</td></tr><tr><td style="padding:6px 0;color:#777">Alternate mobile</td><td style="padding:6px 0">${escapeHtml(recipient.alternateMobile || "Not provided")}</td></tr><tr><td style="padding:6px 0;color:#777">Delivery method</td><td style="padding:6px 0">${escapeHtml(deliveryMethod)}</td></tr><tr><td style="padding:6px 0;color:#777">Delivery address</td><td style="padding:6px 0">${escapeHtml(addressText || "Not provided")}</td></tr></table><h2 style="margin:24px 0 8px;font-size:16px">Order details</h2><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#fff5f7;text-align:left"><th style="padding:12px">Product</th><th style="padding:12px;text-align:center">Boxes</th><th style="padding:12px;text-align:right">Rate / box</th><th style="padding:12px;text-align:right">Amount</th></tr></thead><tbody>${itemRows}</tbody></table><table style="width:100%;max-width:360px;margin:16px 0 0 auto;border-collapse:collapse"><tr><td style="padding:6px">Subtotal</td><td style="padding:6px;text-align:right"><strong>${formatCurrency(order.subtotal)}</strong></td></tr><tr><td style="padding:6px">Coupon discount</td><td style="padding:6px;text-align:right"><strong>−${formatCurrency(order.discount)}</strong></td></tr><tr style="color:#e94f70;font-size:18px"><td style="padding:12px 6px;border-top:1px solid #ef5f7d"><strong>Amount received</strong></td><td style="padding:12px 6px;border-top:1px solid #ef5f7d;text-align:right"><strong>${formatCurrency(amountReceived)}</strong></td></tr></table><p style="margin-top:24px;padding:14px;background:#f1f8f9;border-radius:10px;color:#4a7780;font-size:13px">Order status: ${escapeHtml(order.orderStatus)} · Payment method: ${escapeHtml(order.payment?.provider || "PayU")}</p></div>`,
  });
};
