import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serviceDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(
  process.env.USER_UPLOAD_DIR || path.join(serviceDirectory, "../../uploads"),
);
const maxFileSize = 5 * 1024 * 1024;
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
    throw new Error("Invalid payment proof reference");
  }
  return storageKey;
};

export const savePaymentProof = async ({ contentType, data }) => {
  const format = imageFormats[contentType];
  if (
    !format ||
    typeof data !== "string" ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data)
  ) {
    const error = new Error("Upload a valid JPEG, PNG, or WebP payment screenshot.");
    error.status = 400;
    throw error;
  }

  const buffer = Buffer.from(data, "base64");
  if (
    !buffer.length ||
    buffer.length > maxFileSize ||
    buffer.toString("base64") !== data ||
    !format.matches(buffer)
  ) {
    const error = new Error(
      buffer.length > maxFileSize
        ? "Payment screenshots must be 5 MB or smaller."
        : "Upload a valid JPEG, PNG, or WebP payment screenshot.",
    );
    error.status = 400;
    throw error;
  }

  await mkdir(uploadDirectory, { recursive: true });
  const storageKey = `${randomUUID()}${format.extension}`;
  await writeFile(path.join(uploadDirectory, storageKey), buffer, {
    flag: "wx",
    mode: 0o600,
  });
  return { storageKey, contentType, buffer };
};

export const getPaymentProof = async (storageKey) => {
  const fileName = getSafeStorageKey(storageKey);
  const contentType =
    Object.entries(imageFormats).find(([, format]) =>
      fileName.endsWith(format.extension),
    )?.[0] || "application/octet-stream";
  return {
    buffer: await readFile(path.join(uploadDirectory, fileName)),
    contentType,
  };
};

export const deletePaymentProof = async (storageKey) => {
  await unlink(path.join(uploadDirectory, getSafeStorageKey(storageKey))).catch(
    (error) => {
      if (error.code !== "ENOENT") throw error;
    },
  );
};
