"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ✅ Define product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  images?: { secure_url: string }[];
  category?: { name: string };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://glore-bd-backend-node-mongo.vercel.app/api/product"
        );
        const data = await res.json();
        if (res.ok && data.data) {
          setProducts(data.data);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Our Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse p-4"
                >
                  <div className="bg-gray-200 h-48 w-full rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            : products.map((product) => (
                <Link
                  key={product._id}
                  href={`/Products/${product._id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                    {/* ✅ Use next/image instead of <img> */}
                    <div className="aspect-square overflow-hidden relative">
                      <Image
                        src={product.images?.[0]?.secure_url || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {product.name}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                      <div className="mt-3 text-indigo-600 font-bold text-base">
                        ৳ {product.price}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
