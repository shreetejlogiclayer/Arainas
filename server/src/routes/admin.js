import express from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../services/authService.js";
import { comparePassword, hashPassword } from "../utils/crypto.js";
import { rateLimit } from "../middleware/auth.js";
import { deleteStoredProfilePhotos } from "../services/profileMediaService.js";
import { getPaymentProof } from "../services/paymentProofService.js";
import { generateRandomCode } from "../utils/crypto.js";
import { cleanPhone, isValidEmail, isValidIndianPhone, normalizeEmail } from "../utils/validators.js";
import { getOrderPricing, updateOrderPaymentStatus, updateOrderPricing } from "../services/orderService.js";

const router = express.Router();
const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const paymentStatuses = ["not_configured", "pending", "success", "failed"];
const pricingAdminEmails = new Set(["rohini.dixit@arainas.com", "yogendra.dixit@arainas.com"]);
const completedMemberWhere = {
  role: { notIn: ["admin", "manager"] },
  profile: { is: { fullName: { not: "" } } },
  addresses: {
    some: {
      isDefault: true,
      houseNumber: { not: "" },
      street: { not: "" },
      area: { not: "" },
      city: { not: "" },
      district: { not: "" },
      state: { not: "" },
      pinCode: { not: "" },
    },
  },
};
const addressSelect = {
  houseNumber: true,
  building: true,
  street: true,
  area: true,
  landmark: true,
  village: true,
  city: true,
  district: true,
  state: true,
  pinCode: true,
  country: true,
  isDefault: true,
};
const adminDisplayName = (email) => ({
  "admin@arainas.com": "Manager",
  "rohini.dixit@arainas.com": "Admin 1",
  "yogendra.dixit@arainas.com": "Admin 2",
}[email] || null);

router.post("/login", rateLimit(5, 15 * 60 * 1000), async (req, res) => {
  res.set("Cache-Control", "no-store");
  const { email, password } = req.body || {};
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string" || !password) {
    return res.status(400).json({ error: { message: "Enter a valid admin email and password." } });
  }
  try {
    const admin = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, email: true, role: true, status: true, passwordHash: true },
    });
    if (!admin || !["admin", "manager"].includes(admin.role) || admin.status !== "active") {
      return res.status(401).json({ error: { message: "Invalid admin email or password." } });
    }
    if (!(await comparePassword(password, admin.passwordHash))) {
      return res.status(401).json({ error: { message: "Invalid admin email or password." } });
    }
    req.session.regenerate((error) => {
      if (error) {
        console.error("Could not regenerate admin session:", error);
        return res.status(500).json({ error: { message: "Unable to start an admin session." } });
      }
      req.session.adminUserId = admin.id;
      req.session.save((saveError) => {
        if (saveError) {
          console.error("Could not save admin session:", saveError);
          return res.status(500).json({ error: { message: "Unable to start an admin session." } });
        }
        return res.json({
          success: true,
          data: {
            authenticated: true,
            user: {
              email: admin.email,
              role: admin.role,
              name: adminDisplayName(admin.email),
            },
          },
        });
      });
    });
  } catch {
    console.error("Admin authentication failed.");
    return res.status(401).json({ error: { message: "Invalid admin email or password." } });
  }
});

router.use(async (req, res, next) => {
  res.set("Cache-Control", "no-store");
  const adminId = req.session?.adminUserId;
  if (!adminId) return res.status(401).json({ error: { message: "Admin sign-in required." } });
  try {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { email: true, role: true, status: true },
    });
    if (!admin || !["admin", "manager"].includes(admin.role) || admin.status !== "active") {
      delete req.session.adminUserId;
      return res.status(403).json({ error: { message: "Admin access is no longer authorized." } });
    }
    req.adminEmail = admin.email?.toLowerCase();
    req.adminRole = admin.role;
    return next();
  } catch (error) {
    console.error("Admin authorization check failed:", error);
    return res.status(500).json({ error: { message: "Unable to verify admin access." } });
  }
});

router.get("/pricing", async (req, res) => {
  if (req.adminRole !== "admin" || !pricingAdminEmails.has(req.adminEmail)) {
    return res.status(403).json({ error: { message: "Only Admin 1 and Admin 2 can view product pricing." } });
  }
  try {
    const pricing = await getOrderPricing();
    if (!pricing || pricing.length !== 5) {
      return res.status(503).json({ error: { message: "The five product price tiers are not available." } });
    }
    return res.json({ success: true, data: pricing });
  } catch (error) {
    console.error("Admin product pricing load failed:", error);
    return res.status(500).json({ error: { message: "Unable to load product pricing." } });
  }
});

router.patch("/pricing", async (req, res) => {
  if (req.adminRole !== "admin" || !pricingAdminEmails.has(req.adminEmail)) {
    return res.status(403).json({ error: { message: "Only Admin 1 and Admin 2 can update product pricing." } });
  }
  try {
    const updated = await updateOrderPricing(req.body?.prices);
    return res.json({ success: true, data: updated });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: { message: error.message } });
    console.error("Admin product pricing update failed:", error);
    return res.status(500).json({ error: { message: "Unable to update product pricing." } });
  }
});

router.post("/logout", (req, res) => {
  delete req.session.adminUserId;
  req.session.save((error) => {
    if (error) return res.status(500).json({ error: { message: "Unable to end the admin session." } });
    return res.json({ success: true });
  });
});

router.get("/me", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.adminUserId },
      select: { email: true, role: true },
    });
    if (!user) return res.status(404).json({ error: { message: "Admin account not found." } });
    return res.json({
      success: true,
      data: {
        authenticated: true,
        user: {
          email: user.email,
          role: user.role,
          name: adminDisplayName(user.email),
        },
      },
    });
  } catch (error) {
    console.error("Admin profile lookup failed:", error);
    return res.status(500).json({ error: { message: "Unable to load admin account details." } });
  }
});

router.post("/change-password", rateLimit(5, 15 * 60 * 1000), async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof currentPassword !== "string" || !currentPassword || typeof newPassword !== "string" || newPassword.length < 10) {
    return res.status(400).json({ error: { message: "Enter your current password and a new password of at least 10 characters." } });
  }
  try {
    const account = await prisma.user.findUnique({
      where: { id: req.session.adminUserId },
      select: { id: true, role: true, passwordHash: true },
    });
    if (account?.role !== "admin") {
      return res.status(403).json({ error: { message: "Only Admin accounts can change their password here." } });
    }
    if (!account || !(await comparePassword(currentPassword, account.passwordHash))) {
      return res.status(401).json({ error: { message: "Current password is incorrect." } });
    }
    await prisma.user.update({
      where: { id: account.id },
      data: { passwordHash: await hashPassword(newPassword) },
    });
    return res.json({ success: true, data: { updated: true } });
  } catch (error) {
    console.error("Admin password update failed:", error);
    return res.status(500).json({ error: { message: "Unable to update your password." } });
  }
});

router.post("/manager-password", rateLimit(5, 15 * 60 * 1000), async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof currentPassword !== "string" || !currentPassword || typeof newPassword !== "string" || newPassword.length < 10) {
    return res.status(400).json({ error: { message: "Enter your current password and a new password of at least 10 characters." } });
  }
  try {
    const [actor, manager] = await Promise.all([
      prisma.user.findUnique({
        where: { id: req.session.adminUserId },
        select: { role: true, passwordHash: true },
      }),
      prisma.user.findUnique({
        where: { email: "admin@arainas.com" },
        select: { id: true, role: true, status: true },
      }),
    ]);
    if (actor?.role !== "admin") {
      return res.status(403).json({ error: { message: "Only Admin accounts can change the Manager password." } });
    }
    if (!(await comparePassword(currentPassword, actor.passwordHash))) {
      return res.status(401).json({ error: { message: "Your current password is incorrect." } });
    }
    if (!manager || manager.role !== "manager" || manager.status !== "active") {
      return res.status(404).json({ error: { message: "The active Manager account could not be found." } });
    }
    await prisma.user.update({
      where: { id: manager.id },
      data: { passwordHash: await hashPassword(newPassword) },
    });
    return res.json({ success: true, data: { updated: true } });
  } catch (error) {
    console.error("Manager password update failed:", error);
    return res.status(500).json({ error: { message: "Unable to update the Manager password." } });
  }
});

router.get("/overview", async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [members, activeMembers, orders, newlyReceived, grouped] = await Promise.all([
      prisma.user.count({ where: completedMemberWhere }),
      prisma.user.count({ where: { ...completedMemberWhere, status: "active" } }),
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: "pending", createdAt: { gte: since } } }),
      prisma.order.groupBy({ by: ["orderStatus"], _count: { _all: true } }),
    ]);
    const byStatus = Object.fromEntries(grouped.map(({ orderStatus, _count }) => [orderStatus, _count._all]));
    return res.json({
      success: true,
      data: {
        members: { total: members, active: activeMembers },
        orders: { total: orders, new: newlyReceived, byStatus },
      },
    });
  } catch (error) {
    console.error("Admin overview query failed:", error);
    return res.status(500).json({ error: { message: "Unable to load dashboard overview." } });
  }
});

router.get("/members", async (req, res) => {
  const pagination = getPagination(req.query);
  if (!pagination) return res.status(400).json({ error: { message: "Invalid page or page size." } });
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
  const where = {
    ...completedMemberWhere,
    ...(search ? {
      OR: [
        { mobile: { contains: search } },
        { email: { contains: search } },
        { profile: { is: { fullName: { contains: search } } } },
      ],
    } : {}),
  };
  try {
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, email: true, mobile: true, status: true, createdAt: true,
          profile: { select: { fullName: true, alternateMobile: true, referralCode: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);
    return res.json({ success: true, data: { items, total, page: pagination.page, pageSize: pagination.limit } });
  } catch (error) {
    console.error("Admin member search failed:", error);
    return res.status(500).json({ error: { message: "Unable to load members." } });
  }
});

router.delete("/members/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: { message: "Invalid member ID." } });
  try {
    const actor = await prisma.user.findUnique({
      where: { id: req.session.adminUserId },
      select: { role: true },
    });
    if (actor?.role !== "admin") {
      return res.status(403).json({ error: { message: "Only Admin accounts can delete members." } });
    }

    const member = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, role: true },
    });
    if (!member) return res.status(404).json({ error: { message: "Member not found." } });
    if (["admin", "manager"].includes(member.role)) {
      return res.status(403).json({ error: { message: "Admin and Manager accounts cannot be deleted here." } });
    }

    const photos = await prisma.$transaction(async (tx) => {
      const memberPhotos = await tx.userPhoto.findMany({
        where: { userId: member.id },
        select: { storageKey: true },
      });
      await tx.user.delete({ where: { id: member.id } });
      return memberPhotos;
    }, { timeout: 30000 });
    try {
      await deleteStoredProfilePhotos(photos);
    } catch (error) {
      console.error("Member profile photo cleanup failed after account deletion:", error);
      return res.json({
        success: true,
        data: {
          deleted: true,
          warning: "The member was deleted, but some stored profile photo files could not be removed.",
        },
      });
    }

    return res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("Admin member deletion failed:", error);
    return res.status(500).json({ error: { message: "Unable to delete this member and their related records." } });
  }
});

router.put("/members/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: { message: "Invalid member ID." } });
  const actor = await prisma.user.findUnique({
    where: { id: req.session.adminUserId },
    select: { role: true },
  }).catch((error) => {
    console.error("Admin member update authorization lookup failed:", error);
    return null;
  });
  if (!actor) return res.status(500).json({ error: { message: "Unable to verify admin access." } });
  if (actor.role !== "admin") return res.status(403).json({ error: { message: "Only Admin accounts can edit members." } });

  const { fullName, mobile, email, alternateMobile, status } = req.body || {};
  if (typeof fullName !== "string" || !fullName.trim() || fullName.trim().length > 255) {
    return res.status(400).json({ error: { message: "Enter a member name up to 255 characters." } });
  }
  if (typeof mobile !== "string" || !isValidIndianPhone(cleanPhone(mobile))) {
    return res.status(400).json({ error: { message: "Enter a valid 10-digit Indian mobile number." } });
  }
  if (email !== null && email !== "" && (typeof email !== "string" || email.length > 255 || !isValidEmail(email.trim()))) {
    return res.status(400).json({ error: { message: "Enter a valid email address or leave it blank." } });
  }
  if (alternateMobile !== null && alternateMobile !== "" &&
    (typeof alternateMobile !== "string" || !isValidIndianPhone(cleanPhone(alternateMobile)))) {
    return res.status(400).json({ error: { message: "Enter a valid alternate 10-digit mobile number or leave it blank." } });
  }
  if (!["active", "suspended"].includes(status)) {
    return res.status(400).json({ error: { message: "Choose a valid member account status." } });
  }

  try {
    const member = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, role: true },
    });
    if (!member || ["admin", "manager"].includes(member.role)) {
      return res.status(404).json({ error: { message: "Member not found." } });
    }
    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: member.id },
        data: {
          mobile: cleanPhone(mobile),
          email: email?.trim() ? normalizeEmail(email) : null,
          status,
        },
      });
      await tx.profile.upsert({
        where: { userId: member.id },
        update: {
          fullName: fullName.trim(),
          alternateMobile: alternateMobile ? cleanPhone(alternateMobile) : null,
        },
        create: {
          userId: member.id,
          fullName: fullName.trim(),
          alternateMobile: alternateMobile ? cleanPhone(alternateMobile) : null,
          referralCode: `ARAINA-${generateRandomCode(6)}`,
        },
      });
      return tx.user.findUnique({
        where: { id: member.id },
        select: {
          id: true, email: true, mobile: true, status: true, createdAt: true,
          profile: { select: { fullName: true, alternateMobile: true, referralCode: true } },
        },
      });
    });
    return res.json({ success: true, data: updated });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: { message: "That email or mobile number is already used by another account." } });
    }
    console.error("Admin member update failed:", error);
    return res.status(500).json({ error: { message: "Unable to update this member." } });
  }
});

router.get("/members/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: { message: "Invalid member ID." } });
  try {
    const account = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { role: true },
    });
    if (["admin", "manager"].includes(account?.role)) return res.status(404).json({ error: { message: "Member not found." } });
    const member = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, email: true, mobile: true, status: true, createdAt: true,
        profile: { select: { fullName: true, alternateMobile: true, referralCode: true } },
        addresses: { select: addressSelect, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
        orders: {
          select: {
            id: true, orderNumber: true, orderedByName: true, orderedByMobile: true,
            deliveryRecipientName: true, deliveryMethod: true, total: true, orderStatus: true, paymentStatus: true, createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!member) return res.status(404).json({ error: { message: "Member not found." } });
    return res.json({ success: true, data: member });
  } catch (error) {
    console.error("Admin member detail query failed:", error);
    return res.status(500).json({ error: { message: "Unable to load member details." } });
  }
});

router.get("/orders", async (req, res) => {
  const pagination = getPagination(req.query);
  if (!pagination) return res.status(400).json({ error: { message: "Invalid page or page size." } });
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
  const where = {};
  if (search) where.OR = [
    { orderNumber: { contains: search } },
    { orderedByName: { contains: search } },
    { orderedByMobile: { contains: search } },
    { deliveryRecipientName: { contains: search } },
  ];
  if (req.query.status) {
    if (!orderStatuses.includes(req.query.status)) return res.status(400).json({ error: { message: "Invalid order status." } });
    where.orderStatus = req.query.status;
  }
  if (req.query.paymentStatus) {
    if (!paymentStatuses.includes(req.query.paymentStatus)) return res.status(400).json({ error: { message: "Invalid payment status." } });
    where.paymentStatus = req.query.paymentStatus;
  }
  const from = parseDate(req.query.from);
  const to = parseDate(req.query.to);
  if ((req.query.from && !from) || (req.query.to && !to) || (from && to && from > to)) {
    return res.status(400).json({ error: { message: "Enter a valid order date range." } });
  }
  if (from || to) where.createdAt = {
    ...(from ? { gte: from } : {}),
    ...(to ? { lt: new Date(to.getTime() + 24 * 60 * 60 * 1000) } : {}),
  };
  try {
    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, orderNumber: true, orderedByName: true, orderedByMobile: true,
          recipientType: true, deliveryMethod: true, deliveryRecipientName: true, subtotal: true, discount: true,
          total: true, orderStatus: true, paymentStatus: true, parcelSummaryDownloaded: true, createdAt: true,
          payment: { select: { provider: true, status: true, amount: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);
    return res.json({
      success: true,
      data: {
        items: items.map((order) => ({
          ...order,
          paymentMethod:
            order.payment?.provider === "qr_code"
              ? "By QR code"
              : order.payment?.provider || "Not available",
        })),
        total,
        page: pagination.page,
        pageSize: pagination.limit,
      },
    });
  } catch (error) {
    console.error("Admin order search failed:", error);
    return res.status(500).json({ error: { message: "Unable to load orders." } });
  }
});

router.patch("/orders/:id/parcel-summary-downloaded", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: { message: "Invalid order ID." } });
  try {
    const updated = await prisma.order.updateMany({
      where: { id: req.params.id, parcelSummaryDownloaded: false },
      data: { parcelSummaryDownloaded: true },
    });
    if (!updated.count) {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        select: { id: true, parcelSummaryDownloaded: true },
      });
      if (!order) return res.status(404).json({ error: { message: "Order not found." } });
      return res.json({ success: true, data: order });
    }
    return res.json({
      success: true,
      data: { id: req.params.id, parcelSummaryDownloaded: true },
    });
  } catch (error) {
    console.error("Admin parcel summary tracking failed:", error);
    return res.status(500).json({ error: { message: "Unable to save parcel summary status." } });
  }
});

router.get("/customer-orders", async (req, res) => {
  const pagination = getPagination(req.query);
  if (!pagination) return res.status(400).json({ error: { message: "Invalid page or page size." } });
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
  const from = parseDate(req.query.from);
  const to = parseDate(req.query.to);
  const orderedThisMonth = req.query.orderedThisMonth;
  if (orderedThisMonth && !["yes", "no"].includes(orderedThisMonth)) {
    return res.status(400).json({ error: { message: "Invalid this-month order filter." } });
  }
  if ((req.query.from && !from) || (req.query.to && !to) || (from && to && from > to)) {
    return res.status(400).json({ error: { message: "Enter a valid order date range." } });
  }

  const [monthStart, nextMonthStart] = getIndiaMonthRange();
  const filters = [Prisma.sql`u.role NOT IN ('admin', 'manager')`];
  if (from) filters.push(Prisma.sql`o.createdAt >= ${from}`);
  if (to) filters.push(Prisma.sql`o.createdAt < ${new Date(to.getTime() + 24 * 60 * 60 * 1000)}`);
  if (orderedThisMonth) {
    const existsThisMonth = Prisma.sql`EXISTS (
      SELECT 1 FROM \`Order\` monthOrder
      WHERE monthOrder.userId = o.userId
        AND monthOrder.createdAt >= ${monthStart}
        AND monthOrder.createdAt < ${nextMonthStart}
    )`;
    filters.push(orderedThisMonth === "yes" ? existsThisMonth : Prisma.sql`NOT ${existsThisMonth}`);
  }
  if (search) {
    const searchTerm = `%${search}%`;
    filters.push(Prisma.sql`(p.fullName LIKE ${searchTerm} OR o.orderedByName LIKE ${searchTerm} OR u.mobile LIKE ${searchTerm})`);
  }
  const where = Prisma.join(filters, " AND ");

  try {
    const [countRows, items] = await Promise.all([
      prisma.$queryRaw(Prisma.sql`
        SELECT COUNT(*) AS total
        FROM (
          SELECT o.userId
          FROM \`Order\` o
          INNER JOIN \`User\` u ON u.id = o.userId
          LEFT JOIN \`Profile\` p ON p.userId = u.id
          WHERE ${where}
          GROUP BY o.userId
        ) customer_orders
      `),
      prisma.$queryRaw(Prisma.sql`
        SELECT
          o.userId AS id,
          COALESCE(p.fullName, MAX(o.orderedByName)) AS name,
          COALESCE(NULLIF(u.mobile, ''), MAX(o.orderedByMobile)) AS mobile,
          COUNT(*) AS orderCount,
          MAX(o.createdAt) AS lastOrderAt,
          (SELECT COALESCE(SUM(lastItems.quantityBoxes), 0)
            FROM \`OrderItem\` lastItems
            WHERE lastItems.orderId = (
              SELECT latest.id FROM \`Order\` latest
              WHERE latest.userId = o.userId
              ORDER BY latest.createdAt DESC, latest.id DESC
              LIMIT 1
            )) AS lastOrderBoxes,
          EXISTS (
            SELECT 1 FROM \`Order\` monthOrder
            WHERE monthOrder.userId = o.userId
              AND monthOrder.createdAt >= ${monthStart}
              AND monthOrder.createdAt < ${nextMonthStart}
          ) AS orderedThisMonth
        FROM \`Order\` o
        INNER JOIN \`User\` u ON u.id = o.userId
        LEFT JOIN \`Profile\` p ON p.userId = u.id
        WHERE ${where}
        GROUP BY o.userId, p.fullName, u.mobile
        ORDER BY lastOrderAt DESC, id ASC
        LIMIT ${pagination.limit} OFFSET ${pagination.skip}
      `),
    ]);
    const total = Number(countRows[0]?.total || 0);
    return res.json({
      success: true,
      data: {
        items: items.map((item) => ({
          ...item,
          orderCount: Number(item.orderCount),
          lastOrderBoxes: Number(item.lastOrderBoxes),
          orderedThisMonth: Boolean(item.orderedThisMonth),
        })),
        total,
        page: pagination.page,
        pageSize: pagination.limit,
      },
    });
  } catch (error) {
    console.error("Admin customer order summary failed:", error);
    return res.status(500).json({ error: { message: "Unable to load customer order summaries." } });
  }
});

router.patch("/orders/:id/payment-status", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: { message: "Invalid order ID." } });
  const paymentStatus = req.body?.paymentStatus;
  if (!["pending", "success", "failed"].includes(paymentStatus)) {
    return res.status(400).json({ error: { message: "Select a valid payment status." } });
  }
  try {
    const order = await updateOrderPaymentStatus(req.params.id, paymentStatus);
    return res.json({ success: true, data: order });
  } catch (error) {
    const conflicts = [
      "A successful payment cannot be changed",
      "Payment status changed; reload the order and retry",
      "The order coupon is no longer available",
      "The order coupon could not be redeemed",
    ];
    const status = error.message === "Order not found"
      ? 404
      : conflicts.includes(error.message)
        ? 409
        : 500;
    if (status === 500) console.error("Admin payment status update failed:", error);
    return res.status(status).json({
      error: {
        message: status === 500 ? "Unable to update payment status." : error.message,
      },
    });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: { message: "Invalid order ID." } });
  const orderStatus = req.body?.orderStatus;
  const allowedCurrentStatuses = {
    shipped: ["pending", "processing"],
    delivered: ["shipped"],
  }[orderStatus];
  if (!allowedCurrentStatuses) {
    return res.status(400).json({ error: { message: "Select a valid next order status." } });
  }
  try {
    const updated = await prisma.order.updateMany({
      where: { id: req.params.id, orderStatus: { in: allowedCurrentStatuses } },
      data: { orderStatus },
    });
    if (!updated.count) {
      const current = await prisma.order.findUnique({
        where: { id: req.params.id },
        select: { orderStatus: true },
      });
      if (!current) return res.status(404).json({ error: { message: "Order not found." } });
      return res.status(409).json({ error: { message: "This order cannot move to that status. Reload the order and retry." } });
    }
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      select: { id: true, orderStatus: true, updatedAt: true },
    });
    return res.json({ success: true, data: order });
  } catch (error) {
    console.error("Admin order status update failed:", error);
    return res.status(500).json({ error: { message: "Unable to update order status." } });
  }
});

router.get("/orders/:id/payment-proof", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: { message: "Invalid order ID." } });
  try {
    const payment = await prisma.payment.findUnique({
      where: { orderId: req.params.id },
      select: { paymentProofKey: true },
    });
    if (!payment?.paymentProofKey) {
      return res.status(404).json({ error: { message: "Payment screenshot not found." } });
    }
    const proof = await getPaymentProof(payment.paymentProofKey);
    res.set({
      "Cache-Control": "private, no-store",
      "Content-Disposition": 'inline; filename="payment-proof"',
      "X-Content-Type-Options": "nosniff",
    });
    return res.type(proof.contentType).send(proof.buffer);
  } catch (error) {
    console.error("Admin payment proof retrieval failed:", error);
    return res.status(500).json({ error: { message: "Unable to load payment screenshot." } });
  }
});

router.get("/orders/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: { message: "Invalid order ID." } });
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, orderNumber: true, orderedByName: true, orderedByMobile: true,
        recipientType: true, deliveryMethod: true, deliveryRecipientName: true, subtotal: true, discount: true,
        total: true, orderStatus: true, paymentStatus: true, parcelSummaryDownloaded: true, createdAt: true, updatedAt: true,
        items: { select: { productNameSnapshot: true, sizeSnapshot: true, quantityBoxes: true, pricePerBoxSnapshot: true, subtotal: true } },
        deliveryAddress: { select: {
          houseNumber: true, building: true, street: true, area: true, landmark: true,
          village: true, city: true, district: true, state: true, pinCode: true, country: true,
          recipientMobile: true, recipientAlternateMobile: true,
        } },
        user: { select: { mobile: true, email: true, profile: { select: { fullName: true } } } },
        payment: {
          select: {
            provider: true,
            status: true,
            amount: true,
            transactionId: true,
            paymentProofKey: true,
          },
        },
      },
    });
    if (!order) return res.status(404).json({ error: { message: "Order not found." } });
    const { paymentProofKey, ...payment } = order.payment || {};
    return res.json({
      success: true,
      data: {
        ...order,
        payment: order.payment
          ? {
              ...payment,
              method:
                payment.provider === "qr_code" ? "By QR code" : payment.provider,
              ...(paymentProofKey
                ? { proofUrl: `/api/admin/orders/${order.id}/payment-proof` }
                : {}),
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Admin order detail query failed:", error);
    return res.status(500).json({ error: { message: "Unable to load order details." } });
  }
});

function getPagination(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 10 : Number(query.limit);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 50) return null;
  return { page, limit, skip: (page - 1) * limit };
}

function parseDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value ? null : parsed;
}

function getIndiaMonthRange(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const indiaOffset = 330 * 60 * 1000;
  return [
    new Date(Date.UTC(year, month - 1, 1) - indiaOffset),
    new Date(Date.UTC(year, month, 1) - indiaOffset),
  ];
}

function validId(value) {
  return typeof value === "string" && value.length >= 1 && value.length <= 128;
}

export default router;
