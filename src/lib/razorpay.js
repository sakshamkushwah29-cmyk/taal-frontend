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

/**
 * Dynamically loads the Razorpay checkout.js SDK script if not already present.
 */
export const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      if (window.Razorpay) return resolve(true);
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      setTimeout(() => {
        resolve(!!window.Razorpay);
      }, 600);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
