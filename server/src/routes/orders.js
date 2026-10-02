import express from "express";
import { sessionAuthMiddleware } from "../middleware/auth.js";
import { createOrder, getOrderCatalog, getUserOrders } from "../services/orderService.js";

const router = express.Router();
router.use(sessionAuthMiddleware);

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
    const status = error.message.includes("unavailable") ? 409 : 400;
    res.status(status).json({
      error: { status, message: error.message },
    });
  }
});

export default router;
