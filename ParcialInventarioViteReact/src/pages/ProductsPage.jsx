import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  updateProduct,
  updateProductStatus
} from "../api/productService.js";
import Header from "../components/Header.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductForm from "../components/ProductForm.jsx";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const data = await findAllProducts();
      setProducts(Array.isArray(data) ? data : data.content || []);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(product) {
    await createProduct(product);
    await loadProducts();
  }

  async function handleUpdate(id, product) {
    await updateProduct(id, product);
    await loadProducts();
  }

  async function handleStatusChange(id, status) {
    await updateProductStatus(id, status);
    await loadProducts();
  }

  async function handleDelete(id) {
    await deleteProduct(id);
    await loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <Header />
      <main className="page">
        <section className="section-title">
          <h1>Productos</h1>
          <p>Control de inventario para el parcial con Vite + React.</p>
        </section>

        <ProductForm onCreate={handleCreate} />

        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <section className="product-list">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onUpdate={handleUpdate}
              />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

