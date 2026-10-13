import "dotenv/config";
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { prisma } from "../services/authService.js";
import { hashPassword } from "../utils/crypto.js";

const email = (process.env.ADMIN_PROVISION_EMAIL || "admin@arainas.com").trim().toLowerCase();

async function readHidden(prompt) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Run this provisioning command in an interactive terminal.");
  }
  stdout.write(prompt);
  stdin.setEncoding("utf8");
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    const onData = (input) => {
      for (const char of input) {
        if (char === "\u0003") {
          cleanup();
          reject(new Error("Provisioning cancelled."));
          return;
        }
        if (char === "\r" || char === "\n") {
          cleanup();
          stdout.write("\n");
          resolve(value);
          return;
        }
        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
          stdout.write("\b \b");
        } else if (char >= " ") {
          value += char;
          stdout.write("*");
        }
      }
    };
    const cleanup = () => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const nonInteractivePassword = process.env.ADMIN_PROVISION_PASSWORD;
  let mobile;
  let password;
  if (nonInteractivePassword) {
    mobile = process.env.ADMIN_PROVISION_MOBILE || `ADM-${randomUUID().replaceAll("-", "").slice(0, 16)}`;
    password = nonInteractivePassword;
    if (process.env.ADMIN_PROVISION_CONFIRM !== "YES") {
      throw new Error("Set ADMIN_PROVISION_CONFIRM=YES to confirm non-interactive provisioning.");
    }
  } else {
    if (!stdin.isTTY) throw new Error("Run this provisioning command in an interactive terminal.");
    const input = createInterface({ input: stdin, output: stdout });
    mobile = (await input.question(`Mobile for ${email} (leave blank for email-only login): `)).trim();
    input.close();
    if (!mobile) mobile = `ADM-${randomUUID().replaceAll("-", "").slice(0, 16)}`;
    if (!/^\+?[0-9 ()-]{10,20}$|^ADM-[a-f0-9]{16}$/i.test(mobile)) throw new Error("Enter a valid mobile number.");
    password = await readHidden("New admin password (minimum 10 characters): ");
    const confirmation = await readHidden("Confirm admin password: ");
    if (password !== confirmation) throw new Error("Passwords do not match.");
  }
  if (password.length < 10) throw new Error("Admin password must be at least 10 characters.");

  const emailAccount = await prisma.user.findUnique({
    where: { email },
    select: { id: true, mobile: true, status: true },
  });
  if (emailAccount && !process.env.ADMIN_PROVISION_MOBILE) mobile = emailAccount.mobile;
  const mobileAccount = await prisma.user.findUnique({
    where: { mobile },
    select: { id: true, email: true, status: true },
  });
  if (emailAccount && mobileAccount && emailAccount.id !== mobileAccount.id) {
    throw new Error("That email and mobile belong to different accounts; resolve this before provisioning.");
  }
  const existing = emailAccount || mobileAccount;
  if (existing?.status !== undefined && existing.status !== "active") {
    throw new Error("The matching account is not active. Resolve its account status before provisioning.");
  }
  if (!nonInteractivePassword) {
    const confirmationPrompt = createInterface({ input: stdin, output: stdout });
    const confirm = await confirmationPrompt.question(
      existing
        ? `This will set ${email} as manager for existing account ${email}. Continue? (y/N): `
        : `This will create a manager account for ${email}. Continue? (y/N): `,
    );
    confirmationPrompt.close();
    if (confirm.trim().toLowerCase() !== "y") throw new Error("Provisioning cancelled.");
  }

  const passwordHash = await hashPassword(password);
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { email, mobile, passwordHash, role: "manager" },
    });
  } else {
    await prisma.user.create({
      data: { email, mobile, passwordHash, role: "manager", status: "active" },
    });
  }
  console.log(`Manager account ${email} is ready. The password was stored as a hash.`);
}

try {
  await main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
