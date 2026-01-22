import { ProductsResponse } from "@/types/product";

interface Params {
    pageParam?: number;
    search: string;
    sort: string;
}

export const API = "https://dummyjson.com/products"

export async function fetchProducts({
    pageParam = 0,
    search,
    sort,
}: Params): Promise<ProductsResponse> {
    const limit = 10;

    let url: string;

    if (sort) {
        const sortBy = sort === "price" ? "price" : "title";
        url = `${API}?sortBy=${sortBy}&order=asc&limit=${limit}&skip=${pageParam}`;
        if (search) {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch products");
            const data: ProductsResponse = await res.json();
            const filteredProducts = data.products.filter(product =>
                product.title.toLowerCase().includes(search.toLowerCase())
            );
            return {
                ...data,
                products: filteredProducts,
                total: filteredProducts.length,
            };
        }
    } else if (search) {
        url = `${API}/search?q=${search}&limit=${limit}&skip=${pageParam}`;
    } else {
        url = `${API}?limit=${limit}&skip=${pageParam}`;
    }

    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch products");

    const data: ProductsResponse = await res.json();

    return data;
}
