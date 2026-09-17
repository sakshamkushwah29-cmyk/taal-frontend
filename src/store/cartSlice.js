// store/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const recalculateTotals = (state) => {
  let grossSubtotal = 0;
  let discount = 0;
  let totalPayable = 0;

  state.items.forEach((item) => {
    const mrp = item.variant?.mrp ?? 0; // original price
    const price = item.variant?.price ?? mrp; // selling price, fallback to mrp

    grossSubtotal += mrp * item.qty;
    totalPayable += price * item.qty;

    // only add discount if mrp > price
    if (mrp > price) {
      discount += (mrp - price) * item.qty;
    }
  });

  if (!state.freeDelivery && state.deliveryCharge > 0) {
    totalPayable += state.deliveryCharge;
  }

  state.grossSubtotal = grossSubtotal;
  state.discount = discount;
  state.totalPayable = totalPayable;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    grossSubtotal: 0,
    discount: 0,
    totalPayable: 0,
    deliveryCharge: 50, // default delivery charge
    freeDelivery: false, // optional toggle
    loading: false,
    error: null,
  },
  reducers: {
    /** 🔹 Optimistic Updates */
    addToCart: (state, action) => {
      const { productId, variantId } = action.payload;
      const item = state.items.find(
        (it) => it.productId === productId && it.variant.id === variantId
      );

      if (item) {
        item.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }

      recalculateTotals(state);
    },

    increaseQty: (state, action) => {
      const { productId, variantId } = action.payload;
      const item = state.items.find(
        (it) => it.productId === productId && it.variant.id === variantId
      );
      if (item) item.qty += 1;

      recalculateTotals(state);
    },

    decreaseQty: (state, action) => {
      const { productId, variantId } = action.payload;
      const item = state.items.find(
        (it) => it.productId === productId && it.variant.id === variantId
      );

      if (item && item.qty > 1) {
        item.qty -= 1;
      } else {
        state.items = state.items.filter(
          (it) => !(it.productId === productId && it.variant.id === variantId)
        );
      }

      recalculateTotals(state);
    },

    removeItemOptimistic: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(
        (it) => !(it.productId === productId && it.variant.id === variantId)
      );

      recalculateTotals(state);
    },

    clearCartOptimistic: (state) => {
      state.items = [];
      recalculateTotals(state);
    },

    rollback: (state, action) => {
      return action.payload; // Reset to previous snapshot
    },

    setCart: (state, action) => {
      const newState = { ...state, ...action.payload };
      recalculateTotals(newState);
      return newState;
    },

    /** 🔹 Delivery Options */
    setDeliveryCharge: (state, action) => {
      state.deliveryCharge = action.payload;
      recalculateTotals(state);
    },

    toggleFreeDelivery: (state, action) => {
      state.freeDelivery = action.payload;
      recalculateTotals(state);
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeItemOptimistic,
  clearCartOptimistic,
  rollback,
  setCart,
  setDeliveryCharge,
  toggleFreeDelivery,
} = cartSlice.actions;

export default cartSlice.reducer;
