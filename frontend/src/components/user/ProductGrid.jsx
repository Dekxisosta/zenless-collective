import Card from "./Card.jsx";

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <Card key={product.id} product={product} />
      ))}
    </div>
  );
}