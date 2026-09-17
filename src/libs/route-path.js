export const ROUTE_PATH = {
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    SIGNUP: "/signup",
    EMAIL_VERIFICATION: "/email-verification/:token",
    FORGOT_PASSWORD: "/forget-password",
    RESET_PASSWORD: "/reset-password/:resetToken",
    ACCOUNT: "/account",
    CHANGE_PASSWORD: "/account/change-password",
  },
  STATIC: {
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_OF_USE: "/terms-of-use",
    FAQs: "/faqs",
    HELP: "/help",
  },
  MAIN: {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    CART: "/cart",
    PRODUCTS: "/products",
    PRODUCTS_DETAILS: "/products/:productId",
    RENTALS: "/rentals",
    EVENTS: "/events",
    EVENTS_VIEW_DETAILS: "/events/view-details",
  },
};

export default ROUTE_PATH;
