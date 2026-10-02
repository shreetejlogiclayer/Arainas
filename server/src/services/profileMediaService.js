import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./authService.js";
const serviceDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(
  process.env.USER_UPLOAD_DIR || path.join(serviceDirectory, "../../uploads"),
);

const imageFormats = {
  "image/jpeg": {
    extension: ".jpg",
    matches: (buffer) =>
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff,
  },
  "image/png": {
    extension: ".png",
    matches: (buffer) =>
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
  },
  "image/webp": {
    extension: ".webp",
    matches: (buffer) =>
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP",
  },
};

const getSafeStorageKey = (storageKey) => {
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(storageKey)) {
    throw new Error("Invalid stored profile photo reference");
  }
  return storageKey;
};

export const saveProfilePhoto = async (userId, contentType, fileBuffer) => {
  const format = imageFormats[contentType];
  if (!format || !Buffer.isBuffer(fileBuffer) || !format.matches(fileBuffer)) {
    throw new Error("Upload a valid JPEG, PNG, or WebP image");
  }

  await mkdir(uploadDirectory, { recursive: true });
  const id = randomUUID();
  const storageKey = `${id}${format.extension}`;
  const filePath = path.join(uploadDirectory, storageKey);
  await writeFile(filePath, fileBuffer, { flag: "wx", mode: 0o600 });

  try {
    await prisma.$transaction([
      prisma.userPhoto.create({
        data: { id, userId, storageKey },
      }),
      prisma.profile.update({
        where: { userId },
        data: { photoKeyReference: `/api/auth/profile/photos/${id}` },
      }),
    ]);
  } catch (error) {
    await unlink(filePath).catch((cleanupError) => {
      if (cleanupError.code !== "ENOENT") {
        console.error("Failed to clean up an unsaved profile image:", cleanupError);
      }
    });
    throw error;
  }

  return { id, url: `/api/auth/profile/photos/${id}` };
};

export const getProfilePhoto = async (userId, photoId) => {
  const photo = await prisma.userPhoto.findFirst({
    where: { id: photoId, userId },
    select: { storageKey: true },
  });
  if (!photo) return null;

  const fileName = getSafeStorageKey(photo.storageKey);

  const contentType =
    Object.entries(imageFormats).find(([, format]) =>
      photo.storageKey.endsWith(format.extension),
    )?.[0] || "application/octet-stream";
  return {
    path: path.join(uploadDirectory, fileName),
    contentType,
  };
};

export const deleteProfilePhoto = async (userId, photoId) => {
  const photo = await prisma.userPhoto.findFirst({
    where: { id: photoId, userId },
  });
  if (!photo) throw new Error("Profile photo not found");

  await prisma.$transaction(async (transaction) => {
    const profile = await transaction.profile.findUnique({
      where: { userId },
      select: { photoKeyReference: true },
    });
    await transaction.userPhoto.delete({ where: { id: photo.id } });
    if (profile?.photoKeyReference === `/api/auth/profile/photos/${photo.id}`) {
      const replacement = await transaction.userPhoto.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      await transaction.profile.update({
        where: { userId },
        data: {
          photoKeyReference: replacement
            ? `/api/auth/profile/photos/${replacement.id}`
            : null,
        },
      });
    }
  });

  await unlink(path.join(uploadDirectory, getSafeStorageKey(photo.storageKey))).catch(
    (error) => {
      if (error.code !== "ENOENT") throw error;
    },
  );
}
