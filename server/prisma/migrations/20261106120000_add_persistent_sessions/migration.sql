CREATE TABLE `Session` (
    `sid` VARCHAR(255) NOT NULL,
    `data` LONGTEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`sid`),
    INDEX `Session_expiresAt_idx`(`expiresAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
