import { createHash, timingSafeEqual } from "node:crypto";

const hash512 = (value) =>
  createHash("sha512").update(value, "utf8").digest("hex");

const configurationError = (message) => {
  const error = new Error(message);
  error.status = 503;
  return error;
};

export const isPayuEnabled = () =>
  (process.env.PAYMENT_PROVIDER || "none").trim().toLowerCase() === "payu";

export const getPayuSettings = () => {
  const key = process.env.PAYU_KEY?.trim();
  const salt = process.env.PAYU_SALT?.trim();
  const environment = process.env.PAYU_ENV?.trim().toLowerCase();
  const callbackUrl = process.env.PAYU_CALLBACK_URL?.trim();

  if (!key || !salt || !callbackUrl) {
    throw configurationError(
      "PayU is selected but PAYU_KEY, PAYU_SALT, or PAYU_CALLBACK_URL is missing.",
    );
  }
  if (!["test", "production"].includes(environment)) {
    throw configurationError("Set PAYU_ENV to test or production.");
  }

  let parsedCallbackUrl;
  try {
    parsedCallbackUrl = new URL(callbackUrl);
  } catch {
    throw configurationError("PAYU_CALLBACK_URL must be a valid HTTPS URL.");
  }
  if (parsedCallbackUrl.protocol !== "https:") {
    throw configurationError("PAYU_CALLBACK_URL must use HTTPS.");
  }

  return {
    key,
    salt,
    environment,
    callbackUrl: parsedCallbackUrl.toString(),
  };
};

export const createPayuCheckout = (order, transactionId, email) => {
  const settings = getPayuSettings();
  const fields = {
    key: settings.key,
    txnid: transactionId,
    amount: Number(order.total).toFixed(2),
    productinfo: order.items[0]?.product || "Araina order",
    firstname: order.orderedByName.slice(0, 60),
    email,
    phone: order.orderedByMobile,
    surl: settings.callbackUrl,
    furl: settings.callbackUrl,
    udf1: order.id,
    udf2: "",
    udf3: "",
    udf4: "",
    udf5: "",
    udf6: "",
    udf7: "",
    udf8: "",
    udf9: "",
    udf10: "",
  };

  fields.hash = hash512(
    [
      fields.key,
      fields.txnid,
      fields.amount,
      fields.productinfo,
      fields.firstname,
      fields.email,
      fields.udf1,
      fields.udf2,
      fields.udf3,
      fields.udf4,
      fields.udf5,
      fields.udf6,
      fields.udf7,
      fields.udf8,
      fields.udf9,
      fields.udf10,
      settings.salt,
    ].join("|"),
  );

  return {
    action:
      settings.environment === "production"
        ? "https://secure.payu.in/_payment"
        : "https://test.payu.in/_payment",
    fields,
  };
};

const isValidCallbackHash = (fields, salt) => {
  if (typeof fields.hash !== "string" || !/^[a-f\d]{128}$/i.test(fields.hash)) {
    return false;
  }

  const responseHashFields = [
    salt,
    fields.status,
    fields.udf10 || "",
    fields.udf9 || "",
    fields.udf8 || "",
    fields.udf7 || "",
    fields.udf6 || "",
    fields.udf5 || "",
    fields.udf4 || "",
    fields.udf3 || "",
    fields.udf2 || "",
    fields.udf1 || "",
    fields.email,
    fields.firstname,
    fields.productinfo,
    fields.amount,
    fields.txnid,
    fields.key,
  ];
  if (fields.additional_charges) {
    responseHashFields.unshift(fields.additional_charges);
  }
  const expected = hash512(responseHashFields.join("|"));
  return timingSafeEqual(Buffer.from(fields.hash, "hex"), Buffer.from(expected, "hex"));
};

export const verifyPayuCallback = (fields) => {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return null;

  const settings = getPayuSettings();
  if (
    fields.key !== settings.key ||
    typeof fields.txnid !== "string" ||
    typeof fields.udf1 !== "string" ||
    !["status", "amount", "email", "firstname", "productinfo"].every(
      (field) => typeof fields[field] === "string",
    ) ||
    !isValidCallbackHash(fields, settings.salt)
  ) {
    return null;
  }

  return {
    transactionId: fields.txnid,
    orderId: fields.udf1,
    amount: fields.amount,
  };
};

export const amountToPaise = (amount) => {
  if (typeof amount !== "string" || !/^\d+(?:\.\d{1,2})?$/.test(amount)) {
    return null;
  }
  const [rupees, paise = ""] = amount.split(".");
  return Number(rupees) * 100 + Number(paise.padEnd(2, "0"));
};

export const verifyPayuTransaction = async (transactionId) => {
  const settings = getPayuSettings();
  const verifyUrl =
    settings.environment === "production"
      ? "https://info.payu.in/merchant/postservice.php?form=2"
      : "https://test.payu.in/merchant/postservice.php?form=2";
  const hash = hash512(
    `${settings.key}|verify_payment|${transactionId}|${settings.salt}`,
  );
  const body = new URLSearchParams({
    key: settings.key,
    command: "verify_payment",
    var1: transactionId,
    hash,
  });
  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    throw new Error(`PayU payment verification returned HTTP ${response.status}.`);
  }

  const result = await response.json();
  const transaction = result.transaction_details?.[transactionId];
  if (Number(result.status) !== 1 || !transaction) {
    return { verified: false };
  }
  return {
    verified: true,
    status: String(transaction.status || "").toLowerCase(),
    amount: transaction.transaction_amount,
  };
};
