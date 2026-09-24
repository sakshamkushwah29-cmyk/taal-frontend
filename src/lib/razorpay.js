/**
 * Resolves the Razorpay Key ID for client-side checkout.
 * 
 * Order of priority:
 * 1. backendKey: The key returned directly by the backend in the order creation response.
 * 2. NEXT_PUBLIC_RAZORPAY_KEY_ID: Frontend environment variable, as long as it is not a mismatched test key.
 * 3. Fallback: Live key "rzp_live_RJ78sILs64v88G"
 */
export const getRazorpayKey = (backendKey) => {
  if (backendKey && typeof backendKey === "string" && backendKey.trim().startsWith("rzp_")) {
    return backendKey.trim();
  }

  const envKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (envKey && typeof envKey === "string" && !envKey.startsWith("rzp_test_") && envKey.trim().startsWith("rzp_")) {
    return envKey.trim();
  }

  return "rzp_live_RJ78sILs64v88G";
};
