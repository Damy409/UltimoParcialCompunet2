# Guia completa - Parcial Frontend: Sistema de reservas

Este tercer ejemplo esta pensado como una plantilla muy parecida a los parciales que te pueden poner en Computacion en Internet II. La idea es que si manana el profesor cambia el tema a vuelos, posts, vehiculos, citas medicas, reservas de hotel, inventario, eventos o tareas, tu puedas resolverlo siguiendo el mismo orden.

## Contexto del ejemplo

Una empresa necesita un tablero para administrar reservas. El usuario debe iniciar sesion y, despues de autenticarse, puede:

- Ver todas las reservas.
- Crear una nueva reserva.
- Ver cada reserva en un componente individual.
- Editar informacion de una reserva.
- Cambiar el estado de una reserva.
- Eliminar una reserva.

Estados permitidos:

```txt
PENDIENTE
CONFIRMADA
CANCELADA
```

Este proyecto incluye un usuario demo y datos locales para que puedas probarlo sin backend.

```txt
Usuario: admin
Contrasena: admin123
```

## Que evalua normalmente el profesor

Los parciales de frontend con backend entregado casi siempre califican estas partes:

1. Login funcional.
2. Consumo correcto del endpoint de autenticacion.
3. Guardar token JWT.
4. Enviar token en peticiones privadas.
5. Rutas protegidas.
6. Listar registros desde backend.
7. Crear registros.
8. Componente visual para cada registro.
9. Actualizar informacion o estado.
10. Eliminar registros.
11. Refrescar interfaz despues de cada accion.
12. No modificar backend ni tests.

## Estructura del proyecto

```txt
src/
  App.jsx
  main.jsx
  styles.css
  api/
    http.js
    authService.js
    reservationService.js
  components/
    Header.jsx
    ProtectedRoute.jsx
    ReservationCard.jsx
    ReservationForm.jsx
  pages/
    LoginPage.jsx
    ReservationsPage.jsx
```

## Como crear el proyecto desde cero en el parcial

Si te dan una carpeta vacia:

```bash
npm create vite@latest parcial-frontend -- --template react
cd parcial-frontend
npm install
npm install react-router-dom lucide-react
npm run dev
```

Luego creas carpetas:

```txt
src/api
src/components
src/pages
```

## Paso 1: revisar Swagger antes de programar

Antes de tocar React, abre Swagger:

```txt
http://localhost:8080/nombre-api/swagger-ui/index.html
```

O la URL que entregue el profesor.

Debes anotar:

- `context-path`, por ejemplo `/post-manager`, `/reservation-manager`, `/api`.
- Endpoint de login.
- Campos que recibe el login.
- Nombre del token en la respuesta.
- Endpoints de listar, crear, actualizar y eliminar.
- Si actualizar estado usa `PUT` o `PATCH`.
- Nombre exacto de los campos del DTO.

Ejemplo de DTO:

```json
{
  "customerName": "Ana Perez",
  "serviceName": "Consulta",
  "reservationDate": "2026-06-03T10:00",
  "people": 2,
  "status": "PENDIENTE"
}
```

Si tu formulario envia `name` pero el backend espera `customerName`, falla. Por eso Swagger manda.

## Paso 2: configurar la URL base

En `src/api/http.js` esta:

```js
export const API_BASE_URL = "http://localhost:8080/reservation-manager";
```

Cambiala segun Swagger.

Ejemplos:

```js
export const API_BASE_URL = "http://192.168.131.104:8080/post-manager";
export const API_BASE_URL = "http://localhost:8080/api";
export const API_BASE_URL = "http://localhost:8080";
```

## Paso 3: crear cliente HTTP

La funcion `request` centraliza todo:

- Une la URL base con el endpoint.
- Agrega `Content-Type: application/json`.
- Lee el token de `localStorage`.
- Agrega `Authorization: Bearer token`.
- Convierte la respuesta a JSON.
- Lanza error si el backend responde mal.

Esto evita repetir codigo en todos los componentes.

## Paso 4: login

La pantalla de login debe tener:

- Estado para usuario y contrasena.
- Formulario controlado.
- `onSubmit`.
- Llamado al servicio de login.
- Guardar token.
- Redireccion al tablero.

Codigo clave:

```js
const token = await login(credentials);
localStorage.setItem("token", token);
navigate("/reservations");
```

Si el backend devuelve:

```json
{ "token": "..." }
```

Lees `data.token`.

Si devuelve:

```json
{ "accessToken": "..." }
```

Lees `data.accessToken`.

Este ejemplo acepta `token`, `jwt` o `accessToken`.

## Paso 5: rutas protegidas

Una ruta protegida revisa si hay token:

```js
const token = localStorage.getItem("token");
return token ? children : <Navigate to="/login" replace />;
```

Asi nadie entra al tablero sin iniciar sesion.

## Paso 6: servicio de reservas

El archivo `reservationService.js` tiene todas las funciones del CRUD:

```js
findAllReservations()
createReservation(reservation)
updateReservation(id, reservation)
updateReservationStatus(id, status)
deleteReservation(id)
```

Si Swagger dice otros endpoints, solo cambias ese archivo.

Ejemplos de cambios comunes:

```js
// Si Swagger dice /api/reservations
return request("/api/reservations");

// Si Swagger dice /reservations/update/{id}
return request(`/reservations/update/${id}`, { method: "PUT", body: JSON.stringify(reservation) });

// Si Swagger dice que estado se actualiza con PUT completo
return request(`/reservations/${id}`, { method: "PUT", body: JSON.stringify({ ...reservation, status }) });
```

## Paso 7: listar datos

En la pagina principal se usa `useEffect`:

```js
useEffect(() => {
  loadReservations();
}, []);
```

La funcion:

```js
async function loadReservations() {
  const data = await findAllReservations();
  setReservations(Array.isArray(data) ? data : data.content || []);
}
```

Se usa `data.content` porque algunos backends devuelven paginacion de Spring:

```json
{
  "content": [],
  "totalElements": 10
}
```

## Paso 8: crear reserva

El componente `ReservationForm` usa `useState` para guardar lo que escribe el usuario.

Cuando se envia:

```js
await createReservation(form);
await loadReservations();
```

Siempre refresca la lista despues de crear.

## Paso 9: componente individual

El componente `ReservationCard` recibe:

```js
reservation
onDelete
onUpdate
onStatusChange
```

Debe mostrar toda la informacion y tener botones o controles para las acciones.

Esto es importante porque el enunciado suele decir:

> Disenar e implementar un componente React que represente graficamente un registro individual.

Eso significa que no basta con pintar todo en la pagina. Debe existir un componente separado.

## Paso 10: actualizar estado

Se usa un `select`:

```jsx
<select value={reservation.status} onChange={(event) => onStatusChange(reservation.id, event.target.value)}>
```

Luego:

```js
await updateReservationStatus(id, status);
await loadReservations();
```

Si el backend no tiene endpoint especial para estado, usa `PUT` con todo el objeto.

## Paso 11: eliminar

Boton eliminar:

```js
await deleteReservation(id);
await loadReservations();
```

Si quieres evitar borrados accidentales:

```js
if (!confirm("Desea eliminar?")) return;
```

En examen a veces no hace falta confirmacion, pero ayuda.

## Paso 12: modo demo de este ejemplo

Este proyecto puede funcionar sin backend:

- Si entras con `admin/admin123`, guarda `demo-reservation-token`.
- Las reservas se guardan en `localStorage`.
- Puedes crear, editar, cambiar estado y eliminar.

En el parcial real:

- No dependas del usuario demo.
- Usa el login real del backend.
- Ajusta endpoints con Swagger.

## Como adaptar esta plantilla a cualquier parcial

### Si el tema es productos

Renombra mentalmente:

```txt
ReservationCard -> ProductCard
ReservationForm -> ProductForm
reservationService -> productService
reservations -> products
```

Campos posibles:

```txt
name
price
stock
category
status
```

### Si el tema es vehiculos

Campos posibles:

```txt
plate
brand
model
year
status
```

### Si el tema es tareas

Campos posibles:

```txt
title
description
dueDate
priority
status
```

### Si el tema es citas medicas

Campos posibles:

```txt
patientName
doctorName
appointmentDate
reason
status
```

El patron no cambia.

## Errores tipicos y como arreglarlos

### Error 401

No estas autenticado o el token esta mal.

Revisa:

```js
localStorage.getItem("token")
Authorization: Bearer ${token}
```

### Error 403

El token existe, pero no tienes permiso o el backend exige un rol.

### Error de CORS

No se arregla desde React. El backend debe permitir:

```txt
http://localhost:5173
```

### Error 404

Endpoint mal escrito o falta el context-path.

Ejemplo:

```txt
Mal:  http://localhost:8080/reservations
Bien: http://localhost:8080/reservation-manager/reservations
```

### Error 400

El DTO enviado no coincide con lo que espera Spring.

Revisa nombres de campos, tipos y fechas.

### Pantalla en blanco

Abre consola del navegador y revisa:

- Imports mal escritos.
- Ruta mal definida.
- Componente no exportado.
- Variable `undefined`.

## Orden recomendado en examen

1. Corre backend.
2. Abre Swagger.
3. Prueba login desde Swagger.
4. Crea proyecto React.
5. Configura rutas.
6. Crea `http.js`.
7. Crea `authService.js`.
8. Haz login.
9. Protege ruta principal.
10. Crea servicio de entidad.
11. Lista registros.
12. Crea formulario.
13. Crea componente card.
14. Agrega actualizar estado.
15. Agrega eliminar.
16. Ajusta estilos.
17. Corre tests si el proyecto trae.

## Comandos utiles

Frontend:

```bash
npm install
npm run dev
npm run build
```

Backend Maven:

```bash
./mvnw spring-boot:run
./mvnw test
```

Backend Gradle:

```bash
./gradlew bootRun
./gradlew test
```

Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
.\gradlew.bat bootRun
```

## Checklist final antes de entregar

- Puedo iniciar sesion.
- El token queda en `localStorage`.
- El tablero no abre sin token.
- La lista carga desde servicio.
- Crear funciona.
- Editar funciona.
- Cambiar estado funciona.
- Eliminar funciona.
- La interfaz se refresca despues de cada accion.
- No modifique backend.
- No modifique tests.
- No deje endpoints de demo si el parcial exige backend real.

