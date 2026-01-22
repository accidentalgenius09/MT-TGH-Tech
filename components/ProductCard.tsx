"use client";

import { Product } from "@/types/product";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/products/${product.id}`);
    };

    const OGPrice = product.price + (product.price * product.discountPercentage) / 100;

    return (
        <div
            onClick={handleClick}
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
            <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {product.title}
                </h3>
                <p>
                    <span className="text-2xl font-bold text-gray-900 me-2">
                        ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        ₹{OGPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </span>
                </p>
            </div>
        </div>
    );
}
