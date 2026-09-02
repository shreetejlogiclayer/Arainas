import { PrismaClient } from "@prisma/client";
import { hashPassword, generateRandomCode } from "./utils/crypto.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  try {
    // ==================== CREATE PRODUCT ====================
    const product = await prisma.product.create({
      data: {
        name: "Araina Sanitary Pads",
        description:
          "Premium sanitary pads designed with women's health in focus",
        sku: "ARAINA-PADS-001",
        active: true,
      },
    });

    console.log("✓ Product created:", product.name);

    // ==================== CREATE PRODUCT VARIANTS ====================
    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Regular",
        description: "Standard length pads",
        active: true,
      },
    });

    console.log("✓ Product variant created:", variant.name);

    // ==================== CREATE PRICING TIERS ====================
    const pricingTiers = [
      { boxes: 50, pricePerBox: 500 },
      { boxes: 100, pricePerBox: 300 },
      { boxes: 150, pricePerBox: 250 },
    ];

    for (const tier of pricingTiers) {
      await prisma.pricingTier.create({
        data: {
          productId: product.id,
          boxes: tier.boxes,
          pricePerBox: tier.pricePerBox,
          active: true,
        },
      });
    }

    console.log("✓ Pricing tiers created");

    // ==================== CREATE TEST USER ====================
    const testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        mobile: "9876543210",
        passwordHash: await hashPassword("Password123!"),
        role: "user",
        emailVerified: true,
        mobileVerified: true,
        status: "active",
        profile: {
          create: {
            fullName: "Test User",
            referralCode: `ARAINA-${generateRandomCode(6)}`,
          },
        },
      },
      include: { profile: true },
    });

    console.log("✓ Test user created:", testUser.email);
    console.log("   Referral Code:", testUser.profile.referralCode);

    // ==================== CREATE TEST ADDRESS ====================
    await prisma.address.create({
      data: {
        userId: testUser.id,
        houseNumber: "123",
        street: "Main Street",
        area: "Downtown",
        city: "Pune",
        district: "Pune",
        state: "Maharashtra",
        pinCode: "411001",
        country: "India",
        isDefault: true,
      },
    });

    console.log("✓ Test address created");

    console.log("\n✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
