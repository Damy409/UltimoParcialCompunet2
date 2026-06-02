# Parcial Inventario - Vite + React

Este ejemplo esta hecho especificamente con **Vite + React**, como suelen trabajar muchos grupos en Computacion en Internet II.

Sirve como plantilla para un parcial donde entregan un backend Spring Boot con Spring Security y tu debes hacer solo el frontend.

## Funcionalidades

- Login.
- Guardar token JWT.
- Proteger rutas.
- Listar productos.
- Crear productos.
- Mostrar cada producto en un componente.
- Editar productos.
- Cambiar estado del producto.
- Eliminar productos.
- Modo demo sin backend.

## Usuario demo

Puedes entrar sin backend con:

```txt
Usuario: admin
Contrasena: admin123
```

El modo demo usa `localStorage`, asi puedes probar todo el flujo.

## Crear proyecto Vite + React desde cero

```bash
npm create vite@latest parcial-inventario -- --template react
cd parcial-inventario
npm install
npm install react-router-dom lucide-react
npm run dev
```

Vite normalmente corre en:

```txt
http://localhost:5173
```

## Estructura recomendada

```txt
src/
  App.jsx
  main.jsx
  styles.css
  api/
    http.js
    authService.js
    productService.js
  components/
    Header.jsx
    ProductCard.jsx
    ProductForm.jsx
    ProtectedRoute.jsx
  pages/
    LoginPage.jsx
    ProductsPage.jsx
```

## Que debes revisar en Swagger

Cuando el profesor entregue el backend, abre Swagger:

```txt
http://localhost:8080/swagger-ui/index.html
```

O si tiene context path:

```txt
http://localhost:8080/product-manager/swagger-ui/index.html
```

Anota:

- URL base.
- Endpoint de login.
- Campos del login.
- Nombre del token en la respuesta.
- Endpoint para listar productos.
- Endpoint para crear productos.
- Endpoint para actualizar productos.
- Endpoint para cambiar estado.
- Endpoint para eliminar.
- Campos exactos del DTO.

## Endpoints asumidos en esta plantilla

```txt
POST   /auth/login
GET    /products
POST   /products
PUT    /products/{id}
PATCH  /products/{id}/status
DELETE /products/{id}
```

Si Swagger dice otra cosa, solo cambia:

```txt
src/api/authService.js
src/api/productService.js
src/api/http.js
```

## DTO usado en este ejemplo

```json
{
  "name": "Teclado mecanico",
  "category": "Perifericos",
  "price": 180000,
  "stock": 12,
  "status": "DISPONIBLE"
}
```

Estados:

```txt
DISPONIBLE
AGOTADO
DESCONTINUADO
```

## Paso a paso para resolver un parcial con Vite + React

### 1. Crear el proyecto

```bash
npm create vite@latest mi-parcial -- --template react
cd mi-parcial
npm install
npm install react-router-dom lucide-react
npm run dev
```

### 2. Crear carpetas

```txt
src/api
src/components
src/pages
```

### 3. Configurar rutas

Instala y usa `react-router-dom`.

Rutas tipicas:

```txt
/login
/products
```

En `App.jsx` defines:

```jsx
<Route path="/login" element={<LoginPage />} />
<Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
```

### 4. Crear `http.js`

Este archivo centraliza las peticiones:

- Agrega `Content-Type`.
- Agrega token si existe.
- Convierte respuesta a JSON.
- Maneja errores.

Header importante:

```js
Authorization: `Bearer ${token}`
```

### 5. Crear login

En `authService.js` haces:

```js
POST /auth/login
```

Luego guardas token:

```js
localStorage.setItem("token", token);
```

Y rediriges:

```js
navigate("/products");
```

### 6. Proteger rutas

`ProtectedRoute.jsx` revisa:

```js
localStorage.getItem("token")
```

Si no hay token, redirige a login.

### 7. Crear servicio CRUD

En `productService.js` creas funciones:

```js
findAllProducts()
createProduct(product)
updateProduct(id, product)
updateProductStatus(id, status)
deleteProduct(id)
```

### 8. Listar productos

En `ProductsPage.jsx`:

```js
useEffect(() => {
  loadProducts();
}, []);
```

### 9. Crear producto

Formulario controlado:

```js
const [form, setForm] = useState(...)
```

Al enviar:

```js
await createProduct(form);
await loadProducts();
```

### 10. Componente individual

`ProductCard.jsx` debe mostrar:

- Nombre.
- Categoria.
- Precio.
- Stock.
- Estado.
- Boton editar.
- Selector de estado.
- Boton eliminar.

### 11. Cambiar estado

Usa un `select`:

```jsx
<select value={product.status} onChange={(e) => onStatusChange(product.id, e.target.value)}>
```

### 12. Eliminar

```js
await deleteProduct(id);
await loadProducts();
```

## Adaptar a otro tema

Si el parcial es de vehiculos:

```txt
Product -> Vehicle
products -> vehicles
name -> plate
category -> brand
price -> model
stock -> year
```

Si es de vuelos:

```txt
Product -> Flight
products -> flights
name -> code
category -> airline
price -> origin
stock -> destination
```

Si es de reservas:

```txt
Product -> Reservation
products -> reservations
name -> customerName
category -> serviceName
price -> people
stock -> reservationDate
```

## Problemas frecuentes

### Login no funciona

Revisa si el backend espera `username` o `email`.

### Token undefined

Revisa si la respuesta viene como:

```txt
token
jwt
accessToken
```

### 401 Unauthorized

No estas enviando token o esta mal:

```txt
Authorization: Bearer eyJ...
```

### 404 Not Found

Endpoint incorrecto o falta el context path.

### 400 Bad Request

El DTO enviado no coincide con el backend.

### CORS

El backend debe permitir Vite:

```txt
http://localhost:5173
```

## Checklist de entrega

- Login funciona.
- Token guardado.
- Ruta protegida.
- Lista visible.
- Crear funciona.
- Card individual existe.
- Editar funciona.
- Cambiar estado funciona.
- Eliminar funciona.
- No se modifica backend.
- No se modifican tests.

