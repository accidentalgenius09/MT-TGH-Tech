"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchProduct } from "@/lib/fetchProduct";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="aspect-square bg-gray-200" />
              <div className="p-8 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
            <button
              onClick={() => router.push("/")}
              className="px-6 cursor-pointer py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go back to products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const OGPrice = product.price + (product.price * product.discountPercentage) / 100;

  const handleAddToCart = () => {
    if (isInCart) {
      setIsInCart(false);
      toast.success(`${product.title} removed from cart!`, {
        icon: "🗑️",
        duration: 3000,
      });
    } else {
      setIsInCart(true);
      toast.success(`${product.title} added to cart!`, {
        icon: "🛒",
        duration: 3000,
      });
    }
  };

  const handleFavourite = () => {
    setIsFavourite(!isFavourite);
    if (!isFavourite) {
      toast.success("Added to favourites!", {
        icon: "❤️",
        duration: 3000,
      });
    } else {
      toast.success("Removed from favourites!", {
        icon: "💔",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center cursor-pointer text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </button>

        {/* Product Detail Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Image Gallery */}
            <div className="p-6 lg:p-8">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-lg">
                <img
                  src={product.images[selectedImageIndex] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8 lg:pt-12">
              <div className="mb-4">
                {product.brand && (
                  <span className="inline-block me-2 px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full">
                    {product.brand}
                  </span>
                )}
                {product.category && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/category/${encodeURIComponent(product.category)}`);
                    }}
                    className="inline-block me-2 px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-3 hover:bg-blue-200 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    #{product.category}
                  </button>
                )}

              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">{product.rating}</span>
                <span className="text-gray-500">({product.stock} in stock)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{OGPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </span>
                      <span className="px-3 py-1 text-sm font-bold text-green-700 bg-green-100 rounded-full">
                        {product.discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`group flex-1 px-6 py-4 font-semibold rounded-xl transition-all shadow-lg relative overflow-hidden ${isInCart
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {!isInCart && (
                      <svg
                        className="w-5 h-5 group-hover:animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {isInCart ? "Added to Cart" : "Add to Cart"}
                  </span>
                  {!isInCart && (
                    <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
                  )}
                </button>
                <button
                  onClick={handleFavourite}
                  className={`group px-6 py-4 border-2 rounded-xl transition-all ${isFavourite
                    ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-600"
                    : "border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-500 hover:bg-red-50"
                    }`}
                >
                  <svg
                    className={`w-6 h-6 transition-all duration-300 ${isFavourite
                      ? "fill-current animate-pulse"
                      : "fill-none group-hover:fill-red-200"
                      }`}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Stock</p>
                    <p className="font-semibold text-gray-900">{product.stock} available</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <p className="font-semibold text-gray-900 capitalize">{product.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
