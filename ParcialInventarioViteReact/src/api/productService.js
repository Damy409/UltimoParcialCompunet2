import { request } from "./http.js";

const DEMO_PRODUCTS_KEY = "demoProducts";

const initialDemoProducts = [
  {
    id: 1,
    name: "Teclado mecanico",
    category: "Perifericos",
    price: 180000,
    stock: 12,
    status: "DISPONIBLE"
  },
  {
    id: 2,
    name: "Monitor 24 pulgadas",
    category: "Pantallas",
    price: 620000,
    stock: 0,
    status: "AGOTADO"
  }
];

function isDemoMode() {
  return localStorage.getItem("token") === "demo-product-token";
}

function readDemoProducts() {
  const stored = localStorage.getItem(DEMO_PRODUCTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(initialDemoProducts));
  return initialDemoProducts;
}

function saveDemoProducts(products) {
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
  return products;
}

export function findAllProducts() {
  if (isDemoMode()) {
    return Promise.resolve(readDemoProducts());
  }

  return request("/products");
}

export function createProduct(product) {
  if (isDemoMode()) {
    const products = readDemoProducts();
    const newProduct = { ...product, id: Date.now() };
    saveDemoProducts([newProduct, ...products]);
    return Promise.resolve(newProduct);
  }

  return request("/products", {
    method: "POST",
    body: JSON.stringify(product)
  });
}

export function updateProduct(id, product) {
  if (isDemoMode()) {
    const numericId = Number(id);
    const products = readDemoProducts().map((current) =>
      current.id === numericId ? { ...current, ...product, id: numericId } : current
    );
    saveDemoProducts(products);
    return Promise.resolve(products.find((current) => current.id === numericId));
  }

  return request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product)
  });
}

export function updateProductStatus(id, status) {
  if (isDemoMode()) {
    const numericId = Number(id);
    const products = readDemoProducts().map((product) =>
      product.id === numericId ? { ...product, status } : product
    );
    saveDemoProducts(products);
    return Promise.resolve(products.find((product) => product.id === numericId));
  }

  return request(`/products/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export function deleteProduct(id) {
  if (isDemoMode()) {
    const numericId = Number(id);
    const products = readDemoProducts().filter((product) => product.id !== numericId);
    saveDemoProducts(products);
    return Promise.resolve(null);
  }

  return request(`/products/${id}`, {
    method: "DELETE"
  });
}

