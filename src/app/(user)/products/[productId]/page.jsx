"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Truck, RefreshCcw, Shield, ArrowLeft } from "lucide-react";

import useAxios from "@/hooks/useAxios";
import { useAppDialog } from "@/contexts/AppDialogContext";

import FestivalLoading from "@/components/common/FestivalLoading";
import { Button } from "@/components/ui/button";

import ProductGallery from "@/components/_sections/ProductGallery";
import ProductPrice from "@/components/_sections/ProductPrice";
import ProductVariantSelectors from "@/components/_sections/ProductVariantSelectors";
import ProductTabs from "@/components/_sections/ProductTabs";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const router = useRouter();
  const { showDialog } = useAppDialog();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { request: fetchProductRequest, loading } = useAxios();
  const { request: addToCartRequest, loading: addToCartLoading } = useAxios();

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;
    return product.matrix?.[selectedColor]?.[selectedSize] ?? null;
  }, [product, selectedColor, selectedSize]);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    try {
      const { data, error } = await fetchProductRequest({
        url: `/user/get-product-details?productId=${productId}`,
        method: "GET",
      });
      if (error) return setProduct(null);

      const prod = data?.data ?? null;
      setProduct(prod);

      const initColor =
        prod?.selectedVariant?.color ?? prod?.availableColors?.[0] ?? null;
      const initSize =
        prod?.selectedVariant?.size ??
        Object.keys(prod?.matrix?.[initColor] ?? {})[0] ??
        prod?.availableSizes?.[0] ??
        null;

      setSelectedColor(initColor);
      setSelectedSize(initSize);
      setQuantity(1);
    } catch {
      setProduct(null);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const increaseQty = () => {
    const max = selectedVariant?.stock ?? 1;
    setQuantity((q) => Math.min(q + 1, max));
  };

  const decreaseQty = () => {
    setQuantity((q) => Math.max(q - 1, 1));
  };

  const addToCart = async () => {
    if (!product || !selectedVariant) {
      showDialog({
        type: "error",
        title: "Select Options",
        description: "Please select a color and size before adding to cart.",
      });
      return;
    }
    const payload = {
      productId: product._id,
      variantId: selectedVariant.variantId || selectedVariant?.raw?._id || null,
      qty: quantity,
    };
    const { data, error } = await addToCartRequest({
      url: "/user/add-to-cart",
      method: "POST",
      payload,
      authRequired: true,
    });
    if (error) {
      showDialog({
        type: "error",
        title: "Failed to Add",
        description: error || "Could not add item to cart. Please try again.",
      });
      return;
    }

    showDialog({
      type: "success",
      title: "Added to Cart",
      description: data.message || "Item added to cart successfully.",
      buttons: [{ label: "View Cart", onClick: () => router.push("/cart") }],
    });
  };

  const buyNow = async () => {
    if (!selectedVariant) {
      showDialog({
        type: "error",
        title: "Select Options",
        description: "Please select a valid color and size.",
      });
      return;
    }
    router.push(`/products/${productId}/checkout`);
  };

  if (loading) return <FestivalLoading />;
  if (!product) return <div className="p-4">Product not found.</div>;

  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <button
            onClick={() => router.back()}
            className="hover:text-brand transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <span className="text-gray-300">/</span>
          <button
            onClick={() => router.push("/products")}
            className="hover:text-brand transition-colors tracking-wide uppercase"
          >
            Products
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 truncate max-w-[200px]">
            {product?.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT: Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ProductGallery
              product={product}
              selectedColor={selectedColor}
              selectedVariant={selectedVariant}
              onColorSelect={setSelectedColor}
            />
          </motion.div>

          {/* RIGHT: Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Brand / Category */}
            {product.brand && (
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-2">
                {product.brand}
              </p>
            )}

            {/* Title */}
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Divider */}
            <div className="border-b border-gray-200 my-5" />

            {/* Price */}
            <ProductPrice product={product} selectedVariant={selectedVariant} />

            <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>

            {/* Divider */}
            <div className="border-b border-gray-200 my-5" />

            {/* Variant Selectors */}
            <ProductVariantSelectors
              product={product}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />

            {/* Quantity */}
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition text-lg"
                >
                  −
                </button>
                <span className="w-12 h-10 flex items-center justify-center border-y border-gray-300 text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  disabled={selectedVariant?.stock ? quantity >= selectedVariant.stock : false}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition text-lg"
                >
                  +
                </button>
                {selectedVariant && selectedVariant.stock <= 5 && (
                  <span className="ml-3 text-xs text-red-500 font-medium">
                    Only {selectedVariant.stock} left
                  </span>
                )}
              </div>
            </div>

            {/* CTA Buttons - Desktop */}
            <div className="hidden md:flex flex-col gap-3 mt-8">
              <Button
                className="w-full h-12 rounded-none bg-brand text-white text-sm font-semibold tracking-wide uppercase hover:bg-brand-light transition-colors flex items-center justify-center gap-2"
                disabled={isOutOfStock || addToCartLoading}
                onClick={addToCart}
              >
                <ShoppingBag size={16} />
                {addToCartLoading ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-none border-brand text-brand text-sm font-semibold tracking-wide uppercase hover:bg-brand hover:text-white transition-colors flex items-center justify-center gap-2"
                disabled={isOutOfStock || addToCartLoading}
                onClick={buyNow}
              >
                <CreditCard size={16} />
                Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck size={18} className="text-gray-400" />
                <span className="text-[11px] text-gray-500 leading-tight">Free Shipping<br />above ₹2000</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <RefreshCcw size={18} className="text-gray-400" />
                <span className="text-[11px] text-gray-500 leading-tight">7 Days Return<br />& Exchange</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Shield size={18} className="text-gray-400" />
                <span className="text-[11px] text-gray-500 leading-tight">Premium<br />Quality</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-b border-gray-200 my-6" />

            {/* Product Tabs */}
            <ProductTabs product={product} />
          </motion.div>
        </div>
      </div>

      {/* Sticky CTA bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex md:hidden gap-3 z-50">
        <Button
          className="flex-1 h-11 rounded-none bg-brand text-white text-xs font-semibold tracking-wide uppercase hover:bg-brand-light transition-colors flex items-center justify-center gap-2"
          disabled={isOutOfStock || addToCartLoading}
          onClick={addToCart}
        >
          <ShoppingBag size={15} />
          {addToCartLoading ? "Adding..." : "Add to Cart"}
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-none border-brand text-brand text-xs font-semibold tracking-wide uppercase hover:bg-brand hover:text-white transition-colors flex items-center justify-center gap-2"
          disabled={isOutOfStock || addToCartLoading}
          onClick={buyNow}
        >
          <CreditCard size={15} />
          Buy Now
        </Button>
      </div>
    </div>
  );
}
