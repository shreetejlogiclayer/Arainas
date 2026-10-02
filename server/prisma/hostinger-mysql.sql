-- Araina portal database tables (MySQL 8+ / compatible MariaDB).
-- In Hostinger phpMyAdmin, select the database created in hPanel, then import this file.
-- Prisma generates cuid() IDs and updates @updatedAt fields in the application.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(255) NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `emailVerified` BOOLEAN NOT NULL DEFAULT false,
  `mobileVerified` BOOLEAN NOT NULL DEFAULT false,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_email_key` (`email`),
  UNIQUE INDEX `User_mobile_key` (`mobile`),
  INDEX `User_email_idx` (`email`),
  INDEX `User_mobile_idx` (`mobile`),
  INDEX `User_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Profile` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `fullName` VARCHAR(255) NOT NULL,
  `alternateMobile` VARCHAR(20) NULL,
  `referralCode` VARCHAR(50) NOT NULL,
  `referredByCode` VARCHAR(50) NULL,
  `photoKeyReference` VARCHAR(255) NULL,
  `aadhaarVerificationStatus` VARCHAR(50) NOT NULL DEFAULT 'unverified',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Profile_userId_key` (`userId`),
  UNIQUE INDEX `Profile_referralCode_key` (`referralCode`),
  INDEX `Profile_userId_idx` (`userId`),
  INDEX `Profile_referralCode_idx` (`referralCode`),
  INDEX `Profile_referredByCode_idx` (`referredByCode`),
  CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Address` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `houseNumber` VARCHAR(100) NOT NULL,
  `building` VARCHAR(100) NULL,
  `street` VARCHAR(255) NOT NULL,
  `area` VARCHAR(100) NOT NULL,
  `landmark` VARCHAR(100) NULL,
  `village` VARCHAR(100) NULL,
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pinCode` VARCHAR(6) NOT NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'India',
  `isDefault` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Address_userId_idx` (`userId`),
  INDEX `Address_isDefault_idx` (`isDefault`),
  CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `AadhaarVerification` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `aadhaarLast4` VARCHAR(4) NOT NULL,
  `verificationStatus` VARCHAR(50) NOT NULL DEFAULT 'unverified',
  `otpRequestedAt` DATETIME(3) NULL,
  `verifiedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `AadhaarVerification_userId_key` (`userId`),
  INDEX `AadhaarVerification_userId_idx` (`userId`),
  CONSTRAINT `AadhaarVerification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `UserPhoto` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `storageKey` VARCHAR(255) NOT NULL,
  `verifiedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `UserPhoto_userId_idx` (`userId`),
  CONSTRAINT `UserPhoto_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Referral` (
  `id` VARCHAR(191) NOT NULL,
  `referrerUserId` VARCHAR(191) NOT NULL,
  `referredUserId` VARCHAR(191) NOT NULL,
  `referralCodeUsed` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `completedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Referral_referrerUserId_referredUserId_key` (`referrerUserId`, `referredUserId`),
  INDEX `Referral_referrerUserId_idx` (`referrerUserId`),
  INDEX `Referral_referredUserId_idx` (`referredUserId`),
  INDEX `Referral_status_idx` (`status`),
  CONSTRAINT `Referral_referrerUserId_fkey` FOREIGN KEY (`referrerUserId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Referral_referredUserId_fkey` FOREIGN KEY (`referredUserId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Coupon` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `discountType` VARCHAR(50) NOT NULL,
  `discountValue` INTEGER NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'available',
  `source` VARCHAR(50) NOT NULL DEFAULT 'referral',
  `orderId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `usedAt` DATETIME(3) NULL,
  `expiresAt` DATETIME(3) NULL,
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Coupon_code_key` (`code`),
  INDEX `Coupon_userId_idx` (`userId`),
  INDEX `Coupon_code_idx` (`code`),
  INDEX `Coupon_status_idx` (`status`),
  CONSTRAINT `Coupon_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Product` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `sku` VARCHAR(100) NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Product_name_key` (`name`),
  UNIQUE INDEX `Product_sku_key` (`sku`),
  INDEX `Product_active_idx` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ProductVariant` (
  `id` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ProductVariant_productId_name_key` (`productId`, `name`),
  INDEX `ProductVariant_productId_idx` (`productId`),
  CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PricingTier` (
  `id` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `boxes` INTEGER NOT NULL,
  `pricePerBox` INTEGER NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `PricingTier_productId_boxes_key` (`productId`, `boxes`),
  INDEX `PricingTier_productId_idx` (`productId`),
  CONSTRAINT `PricingTier_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Order` (
  `id` VARCHAR(191) NOT NULL,
  `orderNumber` VARCHAR(50) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `orderedByName` VARCHAR(255) NOT NULL,
  `deliveryRecipientName` VARCHAR(255) NOT NULL,
  `subtotal` INTEGER NOT NULL,
  `discount` INTEGER NOT NULL DEFAULT 0,
  `total` INTEGER NOT NULL,
  `couponId` VARCHAR(191) NULL,
  `paymentStatus` VARCHAR(50) NOT NULL DEFAULT 'not_configured',
  `orderStatus` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Order_orderNumber_key` (`orderNumber`),
  INDEX `Order_userId_idx` (`userId`),
  INDEX `Order_orderNumber_idx` (`orderNumber`),
  INDEX `Order_paymentStatus_idx` (`paymentStatus`),
  INDEX `Order_orderStatus_idx` (`orderStatus`),
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `OrderItem` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `productNameSnapshot` VARCHAR(255) NOT NULL,
  `sizeSnapshot` VARCHAR(100) NOT NULL,
  `quantityBoxes` INTEGER NOT NULL,
  `pricePerBoxSnapshot` INTEGER NOT NULL,
  `subtotal` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `OrderItem_orderId_idx` (`orderId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `OrderAddress` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `houseNumber` VARCHAR(100) NOT NULL,
  `building` VARCHAR(100) NULL,
  `street` VARCHAR(255) NOT NULL,
  `area` VARCHAR(100) NOT NULL,
  `landmark` VARCHAR(100) NULL,
  `village` VARCHAR(100) NULL,
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pinCode` VARCHAR(6) NOT NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'India',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `OrderAddress_orderId_key` (`orderId`),
  INDEX `OrderAddress_orderId_idx` (`orderId`),
  CONSTRAINT `OrderAddress_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Payment` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `provider` VARCHAR(50) NOT NULL,
  `transactionId` VARCHAR(255) NULL,
  `amount` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Payment_orderId_key` (`orderId`),
  INDEX `Payment_orderId_idx` (`orderId`),
  INDEX `Payment_transactionId_idx` (`transactionId`),
  CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PasswordResetToken` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `PasswordResetToken_token_key` (`token`),
  INDEX `PasswordResetToken_userId_idx` (`userId`),
  INDEX `PasswordResetToken_token_idx` (`token`),
  CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
