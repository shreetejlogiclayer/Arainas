import { randomUUID } from "node:crypto";
import { prisma } from "./authService.js";
import { cleanPhone, isValidIndianPhone } from "../utils/validators.js";
import { calculateCouponDiscount } from "../utils/crypto.js";
import {
  amountToPaise,
  createPayuCheckout,
  getPayuSettings,
  isPayuEnabled,
  verifyPayuCallback,
  verifyPayuTransaction,
} from "./payuService.js";

const addressFields = [
  "houseNumber",
  "building",
  "street",
  "area",
  "landmark",
  "village",
  "city",
  "district",
  "state",
  "pinCode",
];
const defaultProduct = {
  name: "Araina Sanitary Pads",
  description: "Premium sanitary pads designed with women's health in focus",
  sku: "ARAINA-PADS-001",
  quantities: [
    {
      boxes: 1,
      pricePerBox: 3000,
      mrp: 4400,
      discount: 1400,
    },
    { boxes: 2, pricePerBox: 2950, mrp: 8800, discount: 2900 },
    { boxes: 3, pricePerBox: 2900, mrp: 13200, discount: 4500 },
    { boxes: 4, pricePerBox: 2850, mrp: 17600, discount: 6200 },
    { boxes: 5, pricePerBox: 2800, mrp: 22000, discount: 8000 },
  ],
};

const normalizeRecipientAddress = (address) => {
  if (!address || typeof address !== "object" || Array.isArray(address)) {
    throw new Error("Enter the delivery address");
  }
  const result = {};
  for (const field of addressFields) {
    if (typeof address[field] !== "string" && address[field] != null) {
      throw new Error(`Enter a valid ${field}`);
    }
    result[field] = address[field]?.trim() || "";
  }
  for (const field of [
    "houseNumber",
    "street",
    "area",
    "city",
    "district",
    "state",
    "pinCode",
  ]) {
    if (!result[field]) throw new Error(`${field} is required`);
  }
  const maxLengths = {
    houseNumber: 100,
    building: 100,
    street: 255,
    area: 100,
    landmark: 100,
    village: 100,
    city: 100,
    district: 100,
    state: 100,
  };
  for (const [field, maxLength] of Object.entries(maxLengths)) {
    if (result[field].length > maxLength) {
      throw new Error(`${field} must be ${maxLength} characters or fewer`);
    }
  }
  if (!/^\d{6}$/.test(result.pinCode)) {
    throw new Error("Enter a valid 6-digit PIN code");
  }
  return result;
};

const serializeOrder = (order) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  orderedByName: order.orderedByName,
  orderedByMobile: order.orderedByMobile,
  recipientType: order.recipientType,
  deliveryRecipientName: order.deliveryRecipientName,
  subtotal: order.subtotal,
  discount: order.discount,
  total: order.total,
  couponId: order.couponId,
  orderStatus: order.orderStatus,
  paymentStatus: order.paymentStatus,
  payment: order.payment
    ? {
        provider: order.payment.provider,
        transactionId: order.payment.transactionId,
        amount: order.payment.amount,
        status: order.payment.status,
        paidAt:
          order.payment.status === "success" ? order.payment.updatedAt : null,
      }
    : null,
  createdAt: order.createdAt,
  items: order.items.map((item) => ({
    product: item.productNameSnapshot,
    boxes: item.quantityBoxes,
    pricePerBox: item.pricePerBoxSnapshot,
    subtotal: item.subtotal,
  })),
  recipient: order.deliveryAddress
    ? {
        name: order.deliveryRecipientName,
        mobile: order.deliveryAddress.recipientMobile,
        alternateMobile: order.deliveryAddress.recipientAlternateMobile,
        address: Object.fromEntries(
          addressFields.map((field) => [field, order.deliveryAddress[field]]),
        ),
        country: order.deliveryAddress.country,
      }
    : null,
});

export const getOrderCatalog = async () => {
  const products = await prisma.product.findMany({
    where: { active: true, name: defaultProduct.name },
    include: {
      pricingTiers: { where: { active: true }, orderBy: { boxes: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    quantities: product.pricingTiers.map((tier) => ({
      boxes: tier.boxes,
      pricePerBox: tier.pricePerBox,
      executiveRate: tier.boxes * tier.pricePerBox,
      ...(() => {
        const pricing = defaultProduct.quantities.find(
          (quantity) => quantity.boxes === tier.boxes,
        );
        return pricing
          ? {
              maxPricePerBox: Math.floor(pricing.mrp / tier.boxes),
              mrp: pricing.mrp,
              discount: pricing.mrp - tier.boxes * tier.pricePerBox,
              discountPercentage: ((pricing.mrp - tier.boxes * tier.pricePerBox) / pricing.mrp) * 100,
            }
          : {};
      })(),
    })),
  }));
};

export const getAvailableCoupons = async (userId) =>
  prisma.coupon.findMany({
    where: {
      userId,
      status: "available",
      orderId: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: {
      id: true,
      discountType: true,
      discountValue: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

export const getOrderPaymentConfiguration = () => {
  if (!isPayuEnabled()) return { enabled: false, provider: "none" };
  getPayuSettings();
  return { enabled: true, provider: "payu" };
};

export const ensureDefaultOrderCatalog = async () => {
  let product = await prisma.product.findUnique({
    where: { name: defaultProduct.name },
  });
  if (!product) {
    product = await prisma.product.create({
      data: {
        name: defaultProduct.name,
        description: defaultProduct.description,
        sku: defaultProduct.sku,
        active: true,
      },
    });
  }

  await prisma.pricingTier.updateMany({
    where: { productId: product.id, active: true },
    data: { active: false },
  });
  await Promise.all(
    defaultProduct.quantities.map(async ({ boxes, pricePerBox }) => {
      const existingTier = await prisma.pricingTier.findUnique({
        where: { productId_boxes: { productId: product.id, boxes } },
        select: { pricePerBox: true },
      });
      await prisma.pricingTier.upsert({
        where: { productId_boxes: { productId: product.id, boxes } },
        create: { productId: product.id, boxes, pricePerBox, active: true },
        update: {
          active: true,
          ...(boxes === 1 && existingTier?.pricePerBox === 1
            ? { pricePerBox }
            : {}),
        },
      });
    }),
  );
};

export const getOrderPricing = async () => {
  const product = await prisma.product.findUnique({
    where: { name: defaultProduct.name },
    include: { pricingTiers: { where: { active: true }, orderBy: { boxes: "asc" } } },
  });
  if (!product || product.pricingTiers.length !== defaultProduct.quantities.length) return null;
  if (product.pricingTiers.some((tier) =>
    !defaultProduct.quantities.some((quantity) => quantity.boxes === tier.boxes)
  )) return null;
  return product.pricingTiers.map((tier) => {
    const quantity = defaultProduct.quantities.find((item) => item.boxes === tier.boxes);
    return {
      boxes: tier.boxes,
      pricePerBox: tier.pricePerBox,
      maxPricePerBox: Math.floor(quantity.mrp / tier.boxes),
    };
  });
};

export const updateOrderPricing = async (prices) => {
  const expectedTiers = defaultProduct.quantities;
  if (!Array.isArray(prices) || prices.length !== expectedTiers.length ||
      prices.some((tier, index) => {
        const expected = expectedTiers[index];
        return !tier || tier.boxes !== expected.boxes ||
          !Number.isSafeInteger(tier.pricePerBox) || tier.pricePerBox < 1 ||
          tier.pricePerBox > Math.floor(expected.mrp / expected.boxes);
      })) {
    const error = new Error("Enter a whole-number price within the allowed range for each box option.");
    error.status = 400;
    throw error;
  }

  const product = await prisma.product.findUnique({ where: { name: defaultProduct.name } });
  if (!product) {
    const error = new Error("The product price tiers are not available.");
    error.status = 503;
    throw error;
  }
  const tiers = await prisma.pricingTier.findMany({
    where: { productId: product.id, active: true },
    select: { boxes: true },
  });
  if (tiers.length !== expectedTiers.length ||
      tiers.some(({ boxes }) => !expectedTiers.some((tier) => tier.boxes === boxes))) {
    const error = new Error("The product price tiers are not available.");
    error.status = 503;
    throw error;
  }
  await prisma.$transaction(prices.map(({ boxes, pricePerBox }) =>
    prisma.pricingTier.update({
      where: { productId_boxes: { productId: product.id, boxes } },
      data: { pricePerBox },
    })
  ));
  return getOrderPricing();
};

export const createOrder = async (userId, input) => {
  const { boxes, recipientType, couponId } = input;
  const payuEnabled = isPayuEnabled();
  let paymentEmail = "";
  let paymentTransactionId = "";
  const [product, tier, user] = await Promise.all([
    prisma.product.findFirst({
      where: { active: true, name: defaultProduct.name },
    }),
    prisma.pricingTier.findFirst({
      where: {
        boxes,
        active: true,
        product: { active: true, name: defaultProduct.name },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
          take: 1,
        },
      },
    }),
  ]);
  if (payuEnabled) {
    getPayuSettings();
    const requestedEmail =
      typeof input.paymentEmail === "string" ? input.paymentEmail.trim() : "";
    paymentEmail =
      requestedEmail || user?.email?.trim() || "care@arainas.com";
    if (
      requestedEmail.length > 255 ||
      paymentEmail.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentEmail)
    ) {
      throw new Error("Enter a valid email address for PayU checkout.");
    }
    paymentTransactionId = randomUUID().replaceAll("-", "").slice(0, 25);
  }
  if (!Number.isInteger(boxes) || boxes <= 0) {
    throw new Error("Select a valid order quantity");
  }
  if (!["self", "other"].includes(recipientType)) {
    throw new Error("Choose whether this order is for you or someone else");
  }
  if (couponId != null && (typeof couponId !== "string" || !couponId)) {
    throw new Error("Select a valid coupon");
  }

  if (!product) throw new Error("The selected product is unavailable");
  if (!tier) throw new Error("Selected quantity is unavailable");
  if (!user || user.status !== "active") {
    throw new Error("Your account cannot place an order");
  }
  if (!user.profile?.fullName?.trim() || !user.mobile) {
    throw new Error("Complete your profile before placing an order");
  }

  let recipient;
  let address;
  if (recipientType === "self") {
    const savedAddress = user.addresses[0];
    if (!savedAddress) {
      throw new Error("Add a delivery address to your profile before ordering for yourself");
    }
    recipient = {
      name: user.profile.fullName.trim(),
      mobile: cleanPhone(user.mobile),
      alternateMobile: user.profile.alternateMobile
        ? cleanPhone(user.profile.alternateMobile)
        : null,
    };
    address = normalizeRecipientAddress(savedAddress);
  } else {
    const details = input.recipient;
    if (!details || typeof details !== "object" || Array.isArray(details)) {
      throw new Error("Enter the recipient details");
    }
    if (typeof details.fullName !== "string" || details.fullName.trim().length < 2 ||
        details.fullName.trim().length > 255) {
      throw new Error("Enter the recipient's full name");
    }
    if (typeof details.mobile !== "string" ||
        !isValidIndianPhone(cleanPhone(details.mobile))) {
      throw new Error("Enter a valid 10-digit recipient mobile number");
    }
    if (details.alternateMobile != null && typeof details.alternateMobile !== "string") {
      throw new Error("Enter a valid alternate mobile number");
    }
    const alternateMobile = details.alternateMobile?.trim()
      ? cleanPhone(details.alternateMobile)
      : null;
    if (alternateMobile && !isValidIndianPhone(alternateMobile)) {
      throw new Error("Enter a valid 10-digit alternate mobile number");
    }
    recipient = {
      name: details.fullName.trim(),
      mobile: cleanPhone(details.mobile),
      alternateMobile,
    };
    address = normalizeRecipientAddress(details.address);
  }

  const subtotal = tier.boxes * tier.pricePerBox;
  const orderId = randomUUID();
  const order = await prisma.$transaction(async (transaction) => {
    let coupon = null;
    let discount = 0;
    if (couponId) {
      coupon = await transaction.coupon.findFirst({
        where: {
          id: couponId,
          userId,
          status: "available",
          orderId: null,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });
      if (!coupon) throw new Error("That coupon is no longer available");
      discount = Math.max(
        0,
        Math.min(
          subtotal,
          calculateCouponDiscount(
            subtotal,
            coupon.discountType,
            coupon.discountValue,
          ),
        ),
      );
      if (payuEnabled && subtotal - discount <= 0) {
        throw new Error(
          "PayU cannot process a zero-value order. Remove the coupon or contact support.",
        );
      }
      const reserved = await transaction.coupon.updateMany({
        where: {
          id: coupon.id,
          userId,
          status: "available",
          orderId: null,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        data: { orderId },
      });
      if (reserved.count !== 1) {
        throw new Error("That coupon is no longer available");
      }
    }

    return transaction.order.create({
      data: {
        id: orderId,
        orderNumber: `AR-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`,
        userId,
        orderedByName: user.profile.fullName.trim(),
        orderedByMobile: cleanPhone(user.mobile),
        recipientType,
        deliveryRecipientName: recipient.name,
        subtotal,
        discount,
        total: subtotal - discount,
        couponId: coupon?.id || null,
        paymentStatus: payuEnabled ? "pending" : "not_configured",
        orderStatus: "pending",
        items: {
          create: {
            productNameSnapshot: product.name,
            sizeSnapshot: "",
            quantityBoxes: tier.boxes,
            pricePerBoxSnapshot: tier.pricePerBox,
            subtotal,
          },
        },
        ...(payuEnabled && {
          payment: {
            create: {
              provider: "payu",
              status: "pending",
              amount: subtotal - discount,
              transactionId: paymentTransactionId,
            },
          },
        }),
        deliveryAddress: {
          create: {
            ...address,
            recipientMobile: recipient.mobile,
            recipientAlternateMobile: recipient.alternateMobile,
            country: "India",
          },
        },
      },
      include: { items: true, deliveryAddress: true, payment: true },
    });
  });

  const serializedOrder = serializeOrder(order);
  if (!payuEnabled) return serializedOrder;
  return {
    order: serializedOrder,
    checkout: createPayuCheckout(
      serializedOrder,
      paymentTransactionId,
      paymentEmail,
    ),
  };
};

export const processPayuCallback = async (callbackFields) => {
  const callback = verifyPayuCallback(callbackFields);
  if (!callback) return { status: "verification_failed" };

  const order = await prisma.order.findUnique({
    where: { id: callback.orderId },
    include: { payment: true },
  });
  if (
    !order ||
    !order.payment ||
    order.payment.provider !== "payu" ||
    order.payment.transactionId !== callback.transactionId ||
    amountToPaise(callback.amount) !== order.payment.amount * 100
  ) {
    return { status: "verification_failed" };
  }

  if (order.paymentStatus === "success") {
    return { status: "success", orderNumber: order.orderNumber };
  }

  const verification = await verifyPayuTransaction(callback.transactionId);
  if (!verification.verified) return { status: "pending" };

  if (
    verification.status === "success" &&
    amountToPaise(String(verification.amount)) === order.payment.amount * 100
  ) {
    await updateOrderPaymentStatus(order.id, "success", {
      status: "success",
      transactionId: callback.transactionId,
    });
    return { status: "success", orderNumber: order.orderNumber };
  }

  if (
    ["failure", "failed", "usercancelled", "dropped", "bounced"].includes(
      verification.status,
    )
  ) {
    await updateOrderPaymentStatus(order.id, "failed", {
      status: "failed",
      transactionId: callback.transactionId,
    });
    return { status: "failed", orderNumber: order.orderNumber };
  }

  return { status: "pending", orderNumber: order.orderNumber };
};

export const updateOrderPaymentStatus = async (
  orderId,
  paymentStatus,
  paymentUpdate = null,
) => {
  if (!["pending", "success", "failed"].includes(paymentStatus)) {
    throw new Error("Select a valid payment status");
  }

  return prisma.$transaction(async (transaction) => {
    const existingOrder = await transaction.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true, couponId: true, paymentStatus: true },
    });
    if (!existingOrder) throw new Error("Order not found");
    if (existingOrder.paymentStatus === "success") {
      if (paymentStatus !== "success") {
        throw new Error("A successful payment cannot be changed");
      }
      if (paymentUpdate) {
        await transaction.payment.update({
          where: { orderId },
          data: paymentUpdate,
        });
      }
      const completedOrder = await transaction.order.findUnique({
        where: { id: orderId },
        include: { items: true, deliveryAddress: true, payment: true },
      });
      return serializeOrder(completedOrder);
    }

    const changed = await transaction.order.updateMany({
      where: { id: orderId, paymentStatus: existingOrder.paymentStatus },
      data: {
        paymentStatus,
        ...(paymentStatus === "failed" ? { orderStatus: "cancelled" } : {}),
      },
    });
    if (changed.count !== 1) {
      throw new Error("Payment status changed; reload the order and retry");
    }
    if (
      existingOrder.couponId &&
      paymentStatus === "pending" &&
      existingOrder.paymentStatus === "failed"
    ) {
      const reserved = await transaction.coupon.updateMany({
        where: {
          id: existingOrder.couponId,
          userId: existingOrder.userId,
          orderId: null,
          status: "available",
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        data: { orderId },
      });
      if (reserved.count !== 1) {
        throw new Error("The order coupon is no longer available");
      }
    } else if (
      existingOrder.couponId &&
      paymentStatus === "success" &&
      existingOrder.paymentStatus !== "success"
    ) {
      let redeemed = await transaction.coupon.updateMany({
        where: {
          id: existingOrder.couponId,
          userId: existingOrder.userId,
          orderId,
          status: "available",
        },
        data: { status: "used", usedAt: new Date() },
      });
      if (redeemed.count !== 1) {
        const reclaimed = await transaction.coupon.updateMany({
          where: {
            id: existingOrder.couponId,
            userId: existingOrder.userId,
            orderId: null,
            status: "available",
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
          data: { orderId },
        });
        if (reclaimed.count === 1) {
          redeemed = await transaction.coupon.updateMany({
            where: {
              id: existingOrder.couponId,
              userId: existingOrder.userId,
              orderId,
              status: "available",
            },
            data: { status: "used", usedAt: new Date() },
          });
        }
      }
      if (redeemed.count !== 1) {
        throw new Error("The order coupon could not be redeemed");
      }
    } else if (
      existingOrder.couponId &&
      paymentStatus === "failed" &&
      existingOrder.paymentStatus !== "success"
    ) {
      await transaction.coupon.updateMany({
        where: {
          id: existingOrder.couponId,
          userId: existingOrder.userId,
          orderId,
          status: "available",
        },
        data: { orderId: null },
      });
    }

    if (paymentUpdate) {
      await transaction.payment.update({
        where: { orderId },
        data: paymentUpdate,
      });
    }

    const order = await transaction.order.findUnique({
      where: { id: orderId },
      include: { items: true, deliveryAddress: true, payment: true },
    });
    return serializeOrder(order);
  });
};

export const getUserOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId, paymentStatus: { not: "failed" } },
    include: { items: true, deliveryAddress: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(serializeOrder);
};
