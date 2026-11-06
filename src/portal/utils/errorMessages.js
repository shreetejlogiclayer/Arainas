export const getPortalErrorMessage = (
  error,
  fallback = "We couldn’t complete that request. Please try again.",
) => {
  if (error?.name === "AbortError") return "";
  if (error?.status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (error?.status >= 500) {
    return "We’re having trouble completing this right now. Please try again shortly.";
  }
  if (error instanceof TypeError) {
    return "We couldn’t connect. Check your internet connection and try again.";
  }
  if (
    typeof error?.message === "string" &&
    /payu.*(?:configured|credential|salt|callback)|database|server|internal error/i.test(
      error.message,
    )
  ) {
    return fallback;
  }
  return error?.message || fallback;
};
