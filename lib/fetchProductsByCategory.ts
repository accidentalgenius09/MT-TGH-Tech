import { ProductsResponse } from "@/types/product";

export async function fetchProductsByCategory(
  category: string,
  pageParam = 0
): Promise<ProductsResponse> {
  const limit = 10;
  // Encode the category to handle special characters and spaces
  const encodedCategory = encodeURIComponent(category);
  const url = `https://dummyjson.com/products/category/${encodedCategory}?limit=${limit}&skip=${pageParam}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products by category");

  const data: ProductsResponse = await res.json();

  return data;
}
