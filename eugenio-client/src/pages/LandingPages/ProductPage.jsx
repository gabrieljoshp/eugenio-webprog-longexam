import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { fetchProducts } from "../../services/ProductService";
import constants from "../../services/constants";

function ProductPage() {
  const { name: productSlug } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await fetchProducts(); // Assuming fetchProducts returns an array and we need to find the specific product
        const productList = Array.isArray(data) ? data : data.data || [];
        const foundProduct = productList.find(
          (item) => item.slug === productSlug || item.name === productSlug,
        );
        setProduct(foundProduct);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    loadProduct();
  }, [productSlug]);
  if (!product) {
    return (
      <div className="flex w-full flex-col gap-6">
        <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-zinc-900">
              Product not found
            </h1>
            <Button to="/products" className="mt-6">
              Back to Products
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const productName = product.productName || product.title || product.name;
  const image = product.images?.[0] || product.image;
  const imageUrl = image?.startsWith("/") ? `${constants.HOST}${image}` : image;
  const description = product.description || product.content || "";
  const paragraphs = Array.isArray(description) ? description : [description];

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4">
            <Button to="/products">Back to Products</Button>
          </div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            {product.category?.name || product.category}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
            {productName}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
            <span className="font-bold text-zinc-900">₱{product.price}</span>
            <span>{product.inventoryStatus || `${product.stock} in stock`}</span>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-zinc-900 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex aspect-square items-center justify-center rounded-[1.25rem] border-2 border-zinc-900 bg-zinc-200 mb-8 overflow-hidden">
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-sm max-w-none space-y-4 text-zinc-700">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-7 text-zinc-700 whitespace-pre-wrap"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 border-t-2 border-zinc-900 pt-6">
            <Button variant="primary" className="mr-3">
              Add to Cart
            </Button>
            <Button to="/products">Back to Products</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
