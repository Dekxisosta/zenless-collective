import { ArrowRight } from 'lucide-react';
import ProductGrid from "../../components/user/ProductGrid.jsx";
import products from "../../data/products.json";

export default function Featured() {
  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Featured Products
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--color-primary)" }}
        >
          View All <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}