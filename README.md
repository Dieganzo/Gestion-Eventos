# Gestion de Eventos

Aplicacion web para administrar eventos, miembros del staff, asistentes y control de asistencia. El sistema centraliza informacion que normalmente se lleva en listas manuales o planillas, permitiendo consultar el estado de cada evento y sus estadisticas de asistencia.

## Funcionalidades

- Inicio de sesion con JWT y contrasenas protegidas con bcrypt.
- Creacion, edicion, listado y eliminacion de eventos.
- Gestion de miembros del staff.
- Registro de asistentes asociados a un evento y a un staff responsable.
- Busqueda de asistentes por nombre, RUT o staff.
- Control de asistencia: presente o ausente.
- Estadisticas por evento: total de asistentes, presentes, ausentes y porcentaje de asistencia.
- Validaciones de datos y control de acceso mediante autenticacion y roles.

## Tecnologias

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Cypress para pruebas E2E

### Backend

- Node.js
- Express
- PostgreSQL
- JWT para autenticacion
- bcryptjs para proteccion de contrasenas
- Vitest y Supertest para pruebas

## Estructura del proyecto

```text
Gestion-Eventos/
|-- client/                     # Aplicacion React
|   |-- cypress/                # Pruebas E2E con Cypress
|   `-- src/
|       |-- components/         # Componentes reutilizables
|       |-- pages/              # Paginas de la aplicacion
|       |-- services/           # Comunicacion con la API
|       `-- styles/             # Estilos CSS
|
|-- server/                     # API Express
|   `-- src/
|       |-- controllers/        # Logica de negocio
|       |-- database/           # Conexion a PostgreSQL
|       |-- helpers/            # Funciones reutilizables
|       |-- middlewares/        # JWT y autorizacion
|       |-- routes/             # Rutas de la API
|       `-- tests/              # Pruebas unitarias e integracion
|
`-- README.md
```

## Requisitos

- Node.js 22 o superior.
- npm.
- PostgreSQL.
- Un usuario administrador creado en la base de datos para ejecutar las pruebas de integracion y E2E.

## Instalacion

Clona el repositorio y entra a su carpeta:

```bash
git clone <URL_DEL_REPOSITORIO>
cd Gestion-Eventos
```

### Backend

```bash
cd server
npm install
```

Crea el archivo `server/.env` con valores locales. No subas este archivo al repositorio.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_base_de_datos
DB_USER=usuario_postgresql
DB_PASSWORD=contrasena_postgresql

JWT_SECRET=clave_secreta_segura

TEST_ADMIN_CORREO=correo_admin_de_prueba
TEST_ADMIN_CONTRASENA=contrasena_admin_de_prueba
```

Inicia el backend:

```bash
npm run dev
```

El backend quedara disponible por defecto en:

```text
http://localhost:3000
```

### Frontend

En otra terminal:

```bash
cd client
npm install
```

Crea `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Inicia el frontend:

```bash
npm run dev
```

Vite mostrara la URL local, normalmente:

```text
http://localhost:5173
```

## Logica de negocio

- Los eventos y el staff solo pueden ser administrados por usuarios con rol `admin`.
- Todo acceso a asistentes requiere un usuario autenticado.
- Cada asistente debe pertenecer a un evento existente y tener un staff responsable existente.
- No se permite crear eventos, staff o asistentes sin nombre.
- No se permite repetir nombres de staff, ignorando diferencias entre mayusculas y minusculas.
- Un staff no puede eliminarse si tiene asistentes asociados.
- Al eliminar un evento, sus asistentes se eliminan automaticamente mediante `ON DELETE CASCADE` de PostgreSQL.
- La asistencia solo acepta valores booleanos: `true` para presente y `false` para ausente.
- Al marcar presencia se guarda la fecha y hora; al marcar ausencia esa fecha se elimina.
- El porcentaje de asistencia se calcula a partir de asistentes presentes y total de asistentes. Si no hay asistentes, el porcentaje es 0.

## Pruebas

### Pruebas unitarias

Prueban funciones aisladas, sin levantar el backend ni depender de PostgreSQL.

```bash
cd server
npm run test -- src/tests/unit
```

Cubren:

- Encriptacion y comparacion de contrasenas con bcrypt.
- Calculo y validacion de asistencia.
- Validacion de creacion de eventos.
- Validacion de creacion de staff.

### Pruebas de integracion

Estas pruebas usan el backend y la base de datos reales, por lo que primero debes iniciar PostgreSQL y ejecutar `npm run dev` dentro de `server`.

En otra terminal:

```bash
cd server
npm run test -- src/tests/integration
```

Cubren autenticacion, eventos, staff, asistentes y estadisticas de asistencia.

### Pruebas E2E

Las pruebas E2E usan Cypress y simulan acciones reales en la interfaz.

Antes de iniciarlas debes tener PostgreSQL, backend y frontend encendidos.

Configura las credenciales de prueba en `client/cypress.env.json`:

```json
{
  "ADMIN_CORREO": "correo_admin_de_prueba",
  "ADMIN_CONTRASENA": "contrasena_admin_de_prueba"
}
```

Luego ejecuta:

```bash
cd client
npx cypress open
```

Las pruebas E2E incluyen flujos para:

- Iniciar sesion.
- Crear, editar y eliminar eventos.
- Crear asistentes.
- Crear asistentes y marcar asistencia.

## Rutas principales de la API

| Recurso | Rutas principales |
| --- | --- |
| Autenticacion | `POST /api/auth/login`, `GET /api/auth/perfil` |
| Eventos | `GET`, `POST`, `PUT`, `DELETE /api/eventos` |
| Staff | `GET`, `POST`, `PUT`, `DELETE /api/staff` |
| Asistentes | `GET`, `POST`, `PUT`, `DELETE /api/eventos/:eventoId/asistentes` |
| Asistencia | `PATCH /api/eventos/:eventoId/asistentes/:asistenteId/asistencia` |
| Estadisticas | `GET /api/eventos/:eventoId/asistentes/estadisticas` |

## Autores

Proyecto desarrollado como parte del curso Taller de Desarrollo.
