"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import {
  increaseQty,
  decreaseQty,
  removeItemOptimistic,
  clearCartOptimistic,
  rollback,
  setCart,
} from "@/store/cartSlice";
import { showToast } from "@/components/_ui/toast-utils";
import Checkout from "@/components/_sections/Checkout";
import LoadingDots from "@/components/common/LoadingDots";
import { useAppDialog } from "@/contexts/AppDialogContext";
import CartItemCard from "@/components/_cards/CartItemCard";

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const searchParams = useSearchParams();
  const isCheckout = searchParams.get("checkout") !== null;

  const { showDialog } = useAppDialog();

  const { request: getCart, loading } = useAxios();
  const { request: updateItemQuantity } = useAxios();
  const { request: removeItem } = useAxios();
  const { request: clearCart } = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getCart({
        url: "/user/get-cart",
        method: "GET",
        authRequired: true,
      });
      if (!error && data) dispatch(setCart(data.data));
    };
    fetchData();
  }, [dispatch]);

  const handleUpdateQty = async (item, type) => {
    const prevState = structuredClone(cart);
    if (type === "increase") {
      dispatch(increaseQty({ productId: item.productId, variantId: item.variant.id }));
    } else {
      dispatch(decreaseQty({ productId: item.productId, variantId: item.variant.id }));
    }

    const { error } = await updateItemQuantity({
      url: "/user/update-item-quantity",
      method: "PUT",
      authRequired: true,
      payload: { productId: item.productId, variantId: item.variant.id, type },
    });

    if (error) {
      showToast("error", error);
      dispatch(rollback(prevState));
    }
  };

  const handleRemove = async (item) => {
    const prevState = structuredClone(cart);
    dispatch(removeItemOptimistic({ productId: item.productId, variantId: item.variant.id }));

    const { error } = await removeItem({
      url: "/user/remove-item-from-cart",
      method: "PUT",
      authRequired: true,
      payload: { productId: item.productId, variantId: item.variant.id },
    });

    if (error) {
      showToast("error", error);
      dispatch(rollback(prevState));
    }
  };

  const handleClearCart = async () => {
    const prevState = structuredClone(cart);
    dispatch(clearCartOptimistic());

    const { error } = await clearCart({
      url: "/user/clear-cart",
      method: "PUT",
      authRequired: true,
      payload: {},
    });

    if (error) {
      showToast("error", error);
      dispatch(rollback(prevState));
    }
  };

  if (loading && !cart.items) {
    return <LoadingDots dotClassName="bg-brand" />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-sm text-gray-500 mb-6">Your cart is empty.</p>
        <Link href="/products">
          <Button className="rounded-none bg-brand text-white text-xs font-semibold tracking-wide uppercase hover:bg-brand-light transition-colors px-8 h-10">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-8">
          {isCheckout ? "Checkout" : "Shopping Cart"}
        </h1>

        {isCheckout ? (
          <Checkout />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItemCard
                  key={item.productId + item.variant._id}
                  item={item}
                  onIncrease={() => handleUpdateQty(item, "increase")}
                  onDecrease={() => handleUpdateQty(item, "decrease")}
                  onRemove={() => handleRemove(item)}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 mb-5">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cart.grossSubtotal?.toLocaleString("en-IN")}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-brand">
                      <span>Discount</span>
                      <span>−₹{cart.discount?.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-semibold text-gray-900 text-base">
                  <span>Total</span>
                  <span>₹{cart.totalPayable?.toLocaleString("en-IN")}</span>
                </div>

                <div className="mt-6 space-y-2.5">
                  <Link href="/cart?checkout">
                    <Button className="w-full h-11 rounded-none bg-brand text-white text-xs font-semibold tracking-wide uppercase hover:bg-brand-light transition-colors">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-none text-xs font-semibold tracking-wide uppercase border-gray-300 hover:border-brand hover:text-brand transition-colors"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Button>
                  <Link href="/products">
                    <Button
                      variant="ghost"
                      className="w-full h-11 rounded-none text-xs font-semibold tracking-wide uppercase text-gray-500 hover:text-brand transition-colors"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
