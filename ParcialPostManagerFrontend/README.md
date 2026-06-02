# Guia paso a paso - Parcial Frontend: Post Manager

Este ejemplo desarrolla el parcial de frontend para una aplicacion tipo red social sencilla:

- Login con token.
- Feed de posts.
- Usuario autenticado.
- Crear nuevo post.
- Ver lista de posts.
- Entrar al detalle de un post.
- Crear comentarios.
- Ver comentarios del post.

El backend puede estar hecho con Spring Boot, Spring Security y Maven o Gradle. Desde frontend eso importa sobre todo por:

- El token JWT que entrega el login.
- El header `Authorization: Bearer token`.
- El `context-path`, por ejemplo `/post-manager`.
- La configuracion CORS del backend.
- Los nombres exactos de DTOs y endpoints que aparecen en Swagger.

## API base del enunciado

El profesor dio estas URLs:

```txt
http://x104m04:8080/post-manager
http://192.168.131.104:8080/post-manager
```

En este proyecto se configura en:

```txt
src/api/http.js
```

Por defecto deje:

```js
export const API_BASE_URL = "http://192.168.131.104:8080/post-manager";
```

Si estas en local, cambialo por:

```js
export const API_BASE_URL = "http://localhost:8080/post-manager";
```

## Usuario por defecto para probar sin backend

Puedes iniciar sesion con:

```txt
Usuario: admin
Contrasena: admin123
```

Ese usuario activa un modo demo con token falso `demo-post-token`. Los posts y comentarios se guardan en `localStorage`, asi que la aplicacion funciona aunque el backend no este corriendo. En el examen real debes usar las credenciales que indique el backend y revisar Swagger.

## Endpoints asumidos

Revisa Swagger y ajusta si cambia:

```txt
POST   /auth/login
GET    /auth/me
GET    /posts
POST   /posts
GET    /posts/{id}
POST   /posts/{id}/comments
GET    /posts/{id}/comments
```

Los archivos para cambiar endpoints son:

```txt
src/api/authService.js
src/api/postService.js
```

## Crear proyecto desde cero

```bash
npm create vite@latest post-manager-frontend -- --template react
cd post-manager-frontend
npm install
npm install react-router-dom lucide-react
npm run dev
```

Despues copia la carpeta `src` de este ejemplo.

## Estructura

```txt
src/
  App.jsx
  main.jsx
  styles.css
  api/
    http.js
    authService.js
    postService.js
  components/
    AuthUser.jsx
    CommentForm.jsx
    CommentList.jsx
    PostCard.jsx
    PostForm.jsx
    ProtectedRoute.jsx
  pages/
    LoginPage.jsx
    FeedPage.jsx
    PostDetailPage.jsx
```

## Paso a paso durante el parcial

### 1. Abrir Swagger

Abre:

```txt
http://192.168.131.104:8080/post-manager/swagger-ui/index.html
```

Identifica:

- Endpoint de login.
- Campos de login.
- Como se llama el token en la respuesta.
- Endpoint para usuario autenticado.
- Endpoint para crear post.
- Endpoint para listar posts.
- Endpoint para detalle.
- Endpoint para comentarios.

### 2. Configurar API base

En `http.js`, coloca la URL raiz del backend. Si Swagger muestra `/post-manager`, esa parte debe ir incluida.

### 3. Login

La pantalla de login debe:

- Tener inputs para usuario y contrasena.
- Hacer `POST` al endpoint de autenticacion.
- Guardar token en `localStorage`.
- Redirigir a `/feed`.

### 4. Rutas protegidas

Si no existe token:

```js
return <Navigate to="/login" replace />;
```

### 5. Feed

El feed debe cargar:

- Usuario autenticado.
- Formulario de nuevo post.
- Lista de posts.

Despues de crear un post, refresca la lista.

### 6. Detalle de post

Usa `useParams()` para leer el `id`:

```js
const { id } = useParams();
```

Luego carga:

- Post especifico.
- Comentarios del post.

### 7. Crear comentario

Envias el comentario con:

```txt
POST /posts/{id}/comments
```

Luego refrescas comentarios.

## Como adaptarlo a otros ejemplos

Si el parcial cambia a productos, vehiculos, libros, reservas o tareas:

```txt
PostCard.jsx      -> ProductCard.jsx
PostForm.jsx      -> ProductForm.jsx
postService.js    -> productService.js
FeedPage.jsx      -> ProductsPage.jsx
```

El patron se conserva:

1. Login.
2. Guardar token.
3. Ruta protegida.
4. Servicio API.
5. Listar registros.
6. Crear registro.
7. Componente individual.
8. Detalle si el enunciado lo pide.
9. Subrecurso si existe, por ejemplo comentarios, historial o items.

## Si el backend usa Spring Security

Desde frontend revisa:

- El backend debe permitir CORS desde Vite, normalmente `http://localhost:5173`.
- Si el login no requiere token, no agregues `Authorization` manualmente ahi. Este ejemplo centraliza el token, pero si no existe todavia no lo envia.
- Si recibes `403`, el token puede estar mal, vencido o el endpoint requiere rol.
- Si recibes error de CORS, no se arregla en React: lo configura el backend.

## Checklist de entrega

- Login redirige al feed.
- Token se guarda.
- Posts se cargan.
- Usuario autenticado se muestra.
- Se crea post y aparece en la lista.
- Cada post se ve con componente propio.
- Click en un post abre detalle.
- Detalle muestra comentarios.
- Se crea comentario.
- No se modifica backend.
- No se modifican tests.
