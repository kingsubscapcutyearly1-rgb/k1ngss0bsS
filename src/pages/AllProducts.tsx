
import React from "react";
import { products, Product } from "@/data/products";
import ProductCardSimple from "@/components/ProductCard";

export default function AllProducts() {
  return (
    <div className="min-h-[60vh] bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">All Products</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {products.map((p) => (
            <ProductCardSimple key={p.id} product={p as Product} />
          ))}
        </div>
      </div>
    </div>
  );
}
