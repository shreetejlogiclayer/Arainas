import { randomUUID } from "node:crypto";
import { prisma } from "./authService.js";
import { cleanPhone, isValidIndianPhone } from "../utils/validators.js";

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
  variants: [
    { name: "Regular", description: "Standard length pads" },
    { name: "Extra Long", description: "Extra length for extended coverage" },
  ],
  quantities: [
    { boxes: 50, pricePerBox: 500 },
    { boxes: 100, pricePerBox: 300 },
    { boxes: 150, pricePerBox: 250 },
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
  orderStatus: order.orderStatus,
  paymentStatus: order.paymentStatus,
  createdAt: order.createdAt,
  items: order.items.map((item) => ({
    product: item.productNameSnapshot,
    variant: item.sizeSnapshot,
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
      variants: { where: { active: true }, orderBy: { name: "asc" } },
      pricingTiers: { where: { active: true }, orderBy: { boxes: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      description: variant.description,
    })),
    quantities: product.pricingTiers.map((tier) => ({
      boxes: tier.boxes,
      pricePerBox: tier.pricePerBox,
    })),
  }));
};

export const ensureDefaultOrderCatalog = async () => {
  let product = await prisma.product.findUnique({
    where: { name: defaultProduct.name },
    include: {
      variants: { select: { id: true } },
      pricingTiers: { select: { id: true } },
    },
  });
  if (!product) {
    product = await prisma.product.create({
      data: {
        name: defaultProduct.name,
        description: defaultProduct.description,
        sku: defaultProduct.sku,
        active: true,
      },
      include: {
        variants: { select: { id: true } },
        pricingTiers: { select: { id: true } },
      },
    });
  }

  if (product.variants.length === 0) {
    await prisma.productVariant.createMany({
      data: defaultProduct.variants.map((variant) => ({
        productId: product.id,
        ...variant,
        active: true,
      })),
    });
  }
  if (product.pricingTiers.length === 0) {
    await prisma.pricingTier.createMany({
      data: defaultProduct.quantities.map((tier) => ({
        productId: product.id,
        ...tier,
        active: true,
      })),
    });
  }
};

export const createOrder = async (userId, input) => {
  const { variantId, boxes, recipientType } = input;
  if (typeof variantId !== "string" || !variantId) {
    throw new Error("Select a product size or variant");
  }
  if (!Number.isInteger(boxes) || boxes <= 0) {
    throw new Error("Select a valid order quantity");
  }
  if (!["self", "other"].includes(recipientType)) {
    throw new Error("Choose whether this order is for you or someone else");
  }

  const [variant, tier, user] = await Promise.all([
    prisma.productVariant.findFirst({
      where: {
        id: variantId,
        active: true,
        product: { active: true, name: defaultProduct.name },
      },
      include: { product: true },
    }),
    prisma.pricingTier.findFirst({
      where: {
        boxes,
        active: true,
        product: {
          active: true,
          variants: { some: { id: variantId, active: true } },
        },
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

  if (!variant) throw new Error("Selected size or variant is unavailable");
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
  const order = await prisma.order.create({
    data: {
      orderNumber: `AR-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`,
      userId,
      orderedByName: user.profile.fullName.trim(),
      orderedByMobile: cleanPhone(user.mobile),
      recipientType,
      deliveryRecipientName: recipient.name,
      subtotal,
      discount: 0,
      total: subtotal,
      paymentStatus: "not_configured",
      orderStatus: "pending",
      items: {
        create: {
          productNameSnapshot: variant.product.name,
          sizeSnapshot: variant.name,
          quantityBoxes: tier.boxes,
          pricePerBoxSnapshot: tier.pricePerBox,
          subtotal,
        },
      },
      deliveryAddress: {
        create: {
          ...address,
          recipientMobile: recipient.mobile,
          recipientAlternateMobile: recipient.alternateMobile,
          country: "India",
        },
      },
    },
    include: { items: true, deliveryAddress: true },
  });

  return serializeOrder(order);
};

export const getUserOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true, deliveryAddress: true },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(serializeOrder);
};
