# Guia paso a paso - Parcial Frontend: Tablero de vuelos

Esta carpeta contiene una guia completa y una implementacion React de ejemplo para resolver un parcial donde entregan un backend Spring Boot con autenticacion y CRUD.

La idea no es memorizar codigo exacto, sino entender el patron:

1. Crear pantalla de login.
2. Consumir endpoint de autenticacion.
3. Guardar token.
4. Proteger rutas.
5. Crear servicios API con `Authorization: Bearer token`.
6. Listar entidades.
7. Crear entidad.
8. Representar cada entidad con un componente.
9. Actualizar estado o datos.
10. Eliminar entidad.

## Estructura esperada

```txt
src/
  App.jsx
  main.jsx
  styles.css
  api/
    http.js
    authService.js
    flightService.js
  components/
    FlightCard.jsx
    FlightForm.jsx
    Header.jsx
    ProtectedRoute.jsx
  pages/
    LoginPage.jsx
    FlightsPage.jsx
```

## Como iniciar un proyecto desde cero

```bash
npm create vite@latest vuelos-frontend -- --template react
cd vuelos-frontend
npm install
npm install react-router-dom
npm run dev
```

Luego copia la carpeta `src` de este ejemplo dentro de tu proyecto.

## Variables importantes

Edita `src/api/http.js`:

```js
export const API_BASE_URL = "http://localhost:8080";
```

Si el backend tiene context path, por ejemplo `/flight-manager`, dejalo asi:

```js
export const API_BASE_URL = "http://localhost:8080/flight-manager";
```

## Usuario por defecto para probar sin backend

El proyecto incluye un modo demo para que puedas entrar aunque el backend todavia no este disponible:

```txt
Usuario: admin
Contrasena: admin123
```

Cuando ingresas con ese usuario, se guarda un token falso `demo-flight-token` y los vuelos se manejan en `localStorage`. En el parcial real, usa las credenciales que entregue el profesor y el backend respondera con el JWT verdadero.

## Endpoints asumidos en este ejemplo

Como el dia del parcial pueden cambiar los nombres exactos, este proyecto usa una convencion comun:

```txt
POST   /auth/login
GET    /flights
POST   /flights
PUT    /flights/{id}
PATCH  /flights/{id}/status
DELETE /flights/{id}
```

Si Swagger muestra otros endpoints, solo cambia las rutas en:

```txt
src/api/authService.js
src/api/flightService.js
```

## Paso a paso para resolver el parcial

### 1. Revisar Swagger

Abre la URL que entregue el profesor:

```txt
http://localhost:8080/swagger-ui/index.html
```

Anota:

- URL de login.
- Campos del login: normalmente `username/password` o `email/password`.
- Nombre del token en la respuesta: `token`, `jwt`, `accessToken`.
- Endpoints del CRUD.
- Campos exactos del modelo.

### 2. Crear servicio HTTP

Centraliza `fetch` en un archivo. Asi no repites headers:

```js
const token = localStorage.getItem("token");
headers.Authorization = `Bearer ${token}`;
```

### 3. Hacer login

Envia las credenciales al endpoint de login. Si responde bien:

```js
localStorage.setItem("token", token);
navigate("/flights");
```

### 4. Proteger el tablero

Antes de mostrar `/flights`, revisa si existe token. Si no existe, vuelve a `/login`.

### 5. Listar vuelos

En `useEffect`, llama el backend:

```js
useEffect(() => {
  loadFlights();
}, []);
```

### 6. Crear vuelo

Usa un formulario controlado con `useState`. Al enviar:

```js
await createFlight(form);
await loadFlights();
```

### 7. Componente de vuelo

Crea `FlightCard`. Debe recibir:

```js
flight
onDelete
onStatusChange
onUpdate
```

### 8. Cambiar estado

Usa un `select` con:

```txt
PROGRAMADO
EN_VUELO
ATERRIZADO
```

Cuando cambie, llama al backend y refresca la lista.

### 9. Eliminar

Boton claro de eliminar:

```js
await deleteFlight(id);
await loadFlights();
```

### 10. Ajustar a otros ejemplos

Si el parcial no es de vuelos sino de vehiculos, libros, reservas o productos, conserva la misma arquitectura:

```txt
authService.js
entityService.js
EntityPage.jsx
EntityForm.jsx
EntityCard.jsx
```

Cambia:

- Nombre de campos.
- Endpoints.
- Textos de pantalla.
- Estados permitidos.

## Checklist rapido de examen

- Login funciona y guarda token.
- La ruta principal esta protegida.
- Todas las peticiones privadas envian `Authorization`.
- Se listan los registros al cargar.
- Se puede crear un registro.
- Cada registro aparece en un componente individual.
- Se puede actualizar estado o informacion.
- Se puede eliminar.
- Los tests no fueron modificados.
- No se toco el backend.

## Errores comunes

- Guardar mal el token porque la respuesta dice `accessToken` y tu codigo lee `token`.
- Olvidar `Bearer ` antes del token.
- Usar `PUT` cuando Swagger dice `PATCH`.
- Enviar campos con nombres distintos al DTO del backend.
- No recargar la lista despues de crear, actualizar o eliminar.
- No manejar errores con `try/catch`.
