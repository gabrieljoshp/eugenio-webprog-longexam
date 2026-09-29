import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product._id || product.slug || product.name || index}
          product={product}
          index={index}
        />
      ))}
    </div>
  );
};

export default ProductList;
