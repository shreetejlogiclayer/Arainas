import express from "express";
import { sessionAuthMiddleware } from "../middleware/auth.js";
import { isDatabaseUnavailableError } from "../utils/errors.js";
import {
  createOrder,
  getAvailableCoupons,
  getOrderCatalog,
  getOrderPaymentConfiguration,
  getUserOrders,
  processPayuCallback,
} from "../services/orderService.js";

const router = express.Router();

router.post("/payu/callback", async (req, res) => {
  let result;
  try {
    result = await processPayuCallback(req.body);
  } catch (error) {
    console.error("Could not verify PayU payment callback:", error);
    result = { status: "pending" };
  }

  const configuredFrontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  let frontendUrl;
  try {
    const baseUrl = new URL(configuredFrontendUrl);
    if (
      !["http:", "https:"].includes(baseUrl.protocol) ||
      baseUrl.username ||
      baseUrl.password
    ) {
      throw new Error("Unsupported frontend URL protocol");
    }
    frontendUrl = new URL("/portal/orders", baseUrl);
  } catch {
    console.error("Invalid FRONTEND_URL; redirecting to the local portal.");
    frontendUrl = new URL("/portal/orders", "http://localhost:5173");
  }

  const status = ["success", "failed", "pending", "verification_failed"].includes(
    result?.status,
  )
    ? result.status
    : "pending";
  frontendUrl.searchParams.set("payment", status);
  if (result.orderNumber) {
    frontendUrl.searchParams.set("order", result.orderNumber);
  }
  res.redirect(303, frontendUrl.toString());
});

router.use(sessionAuthMiddleware);

router.get("/payment-config", (req, res) => {
  try {
    res.json({
      success: true,
      data: getOrderPaymentConfiguration(),
    });
  } catch (error) {
    console.error("Failed to load payment configuration:", error);
    const status =
      Number.isInteger(error?.status) && error.status >= 400 && error.status <= 599
        ? error.status
        : 503;
    res.status(status).json({
      error: {
        status,
        message:
          status >= 500
            ? "Online payment is temporarily unavailable. Please try again later."
            : error?.message || "We couldn’t load payment options. Please try again.",
      },
    });
  }
});

router.get("/catalog", async (req, res) => {
  try {
    res.json({ success: true, data: await getOrderCatalog() });
  } catch (error) {
    console.error("Failed to load order catalog:", error);
    res.status(500).json({
      error: { status: 500, message: "Unable to load available products." },
    });
  }
});

router.get("/coupons", async (req, res) => {
  try {
    res.json({ success: true, data: await getAvailableCoupons(req.userId) });
  } catch (error) {
    console.error("Failed to load available coupons:", error);
    res.status(500).json({
      error: { status: 500, message: "Unable to load your available coupons." },
    });
  }
});

router.get("/", async (req, res) => {
  try {
    res.json({ success: true, data: await getUserOrders(req.userId) });
  } catch (error) {
    console.error("Failed to load user orders:", error);
    res.status(500).json({
      error: { status: 500, message: "Unable to load your order history." },
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const order = await createOrder(req.userId, req.body);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    const databaseUnavailable = isDatabaseUnavailableError(error);
    const candidateStatus =
      (databaseUnavailable ? 503 : error?.status) ||
      (typeof error?.message === "string" && error.message.includes("unavailable")
        ? 409
        : error?.code
          ? 500
          : 400);
    const status =
      Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus <= 599
        ? candidateStatus
        : 500;
    res.status(status).json({
      error: {
        status,
        ...(databaseUnavailable && { code: "DATABASE_UNAVAILABLE" }),
        message:
          databaseUnavailable
            ? "The order database is temporarily unreachable. Your screenshot is still selected. Check order history before retrying to avoid a duplicate order."
            : status >= 500
            ? "We couldn’t place your order right now. Please try again shortly."
            : error?.message || "We couldn’t place your order. Please try again.",
      },
    });
    if (status >= 500) {
      console.error("Could not place order:", {
        code: error?.code,
        message: error?.message,
      });
    }
  }
});

export default router;
