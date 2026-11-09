export const requestPortalJson = async (url, options = {}) => {
  const response = await fetch(url, { credentials: "include", ...options });
  let result;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const error = new Error(
      result?.error?.message || "We couldn’t complete that request. Please try again.",
    );
    error.status = response.status;
    error.code = result?.error?.code;
    throw error;
  }

  if (
    !result ||
    typeof result !== "object" ||
    (!("data" in result) && result.success !== true)
  ) {
    throw new Error("We couldn’t load the information. Please try again.");
  }
  if ("data" in result && (!result.data || typeof result.data !== "object")) {
    throw new Error("We couldn’t load the information. Please try again.");
  }
  return result.data;
};
