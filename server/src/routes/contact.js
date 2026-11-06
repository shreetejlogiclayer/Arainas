import express from "express";
import nodemailer from "nodemailer";
import { z } from "zod";

const router = express.Router();
const recipient = "care@arainas.com";
const enquirySchema = z.object({
  user_name: z.string().trim().min(1).max(120),
  user_email: z.string().trim().email().max(254),
  user_phone: z.string().trim().max(50).optional().default(""),
  subject: z.enum([
    "Product Inquiry",
    "Business / Distribution",
    "Women Opportunity Program",
    "General Question",
  ]),
  message: z.string().trim().min(10).max(5000),
});

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

let transporter;

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } =
    process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    const error = new Error("Contact email delivery is not configured.");
    error.status = 503;
    throw error;
  }

  if (!transporter) {
    const port = Number(SMTP_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      const error = new Error("Contact email delivery is not configured.");
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

router.post("/", async (req, res) => {
  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "Please check your enquiry details and try again.",
      },
    });
  }

  const enquiry = parsed.data;
  try {
    const mailer = getTransporter();
    await mailer.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipient,
      replyTo: { name: enquiry.user_name, address: enquiry.user_email },
      subject: `Website enquiry: ${enquiry.subject}`,
      text: [
        "A new enquiry was submitted through the Araina website.",
        "",
        `Name: ${enquiry.user_name}`,
        `Email: ${enquiry.user_email}`,
        `Phone: ${enquiry.user_phone || "Not provided"}`,
        `Enquiry type: ${enquiry.subject}`,
        "",
        "Message:",
        enquiry.message,
      ].join("\n"),
      html: `<h2>New Araina website enquiry</h2>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;text-align:left">
          <tr><th>Name</th><td>${escapeHtml(enquiry.user_name)}</td></tr>
          <tr><th>Email</th><td>${escapeHtml(enquiry.user_email)}</td></tr>
          <tr><th>Phone</th><td>${escapeHtml(enquiry.user_phone || "Not provided")}</td></tr>
          <tr><th>Enquiry type</th><td>${escapeHtml(enquiry.subject)}</td></tr>
        </table>
        <h3>Message</h3>
        <p style="white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>`,
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    const authenticationFailed =
      error?.code === "EAUTH" || error?.responseCode === 535;
    console.error("Failed to deliver contact enquiry:", {
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
    });
    const status = error?.status === 503 || authenticationFailed ? 503 : 502;
    return res.status(status).json({
      error: {
        status,
        message: authenticationFailed
          ? "The contact email account could not authenticate. Please verify the SMTP mailbox username and password in the server settings."
          : status === 503
            ? "Contact email is temporarily unavailable. Please contact us directly."
            : "Unable to send your message right now. Please try again shortly.",
      },
    });
  }
});

export default router;
