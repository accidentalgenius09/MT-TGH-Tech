"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { fetchProducts } from "@/lib/fetchProducts";
import ProductCard from "@/components/ProductCard";
import { useDebounce } from "@/hooks/useDebounce";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Home() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(search);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["products", debouncedSearch, sort],
    queryFn: ({ pageParam }) =>
      fetchProducts({ pageParam, search: debouncedSearch, sort }),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-gray-600 text-lg">Discover our amazing collection</p>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                    aria-label="Clear search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sort Select */}
              <div className="relative md:w-64" ref={dropdownRef}>
                <button
                  type="button"
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white text-gray-900 text-left flex items-center justify-between cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{sort === "price" ? "Price" : sort === "name" ? "Name" : "Sort By"}</span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <button
                      type="button"
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 rounded-t-xl ${
                        sort === "" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-900"
                      }`}
                      onClick={() => {
                        setSort("");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Sort By
                    </button>
                    <button
                      type="button"
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        sort === "price" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-900"
                      }`}
                      onClick={() => {
                        setSort("price");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Price
                    </button>
                    <button
                      type="button"
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 rounded-b-xl ${
                        sort === "name" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-900"
                      }`}
                      onClick={() => {
                        setSort("name");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Name
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  if (isError) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-gray-600 text-lg">Discover our amazing collection</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                  aria-label="Clear search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="relative md:w-64" ref={dropdownRef}>
              <button
                type="button"
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white text-gray-900 text-left flex items-center justify-between cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{sort === "price" ? "Price" : sort === "name" ? "Name" : "Sort By"}</span>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 rounded-t-xl ${
                      sort === "" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-900"
                    }`}
                    onClick={() => {
                      setSort("");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Sort By
                  </button>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                      sort === "price" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-900"
                    }`}
                    onClick={() => {
                      setSort("price");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Price
                  </button>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 rounded-b-xl ${
                      sort === "name" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-900"
                    }`}
                    onClick={() => {
                      setSort("name");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Name
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {data && data.pages[0]?.products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.pages.map((page) =>
                page.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
              {isFetchingNextPage &&
                Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={`skeleton-${i}`} />
                ))}
            </div>
            <div ref={loadMoreRef} className="h-8 mt-8"></div>
          </>
        )}
      </div>
    </main>
  );
}
