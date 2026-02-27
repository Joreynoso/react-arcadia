# 🎮 Arcadia — API de Videojuegos

Backend desarrollado en **Node.js** con **Express** para gestionar usuarios, roles, permisos, juegos y favoritos. Permite registro, autenticación, CRUD completo de videojuegos y gestión de favoritos, con validación, seguridad y arquitectura modular. Además, integra la API de **RAWG** para información de videojuegos y la API de **Gemini** para funcionalidades de AI. (obtener una descripción sencilla de un juego).

---

## 🛠 Tecnologías utilizadas

- ⚡ **Node.js + Express 5** — Servidor y routing principal.  
- 🌐 **Axios** — Cliente HTTP para consumo de APIs externas.  
- 🔒 **bcrypt** — Para hashear contraseñas de usuarios.  
- 🛡 **JWT (jsonwebtoken)** — Autenticación y autorización de rutas.  
- 🗄 **MongoDB + Mongoose** — Base de datos NoSQL y modelado de datos.  
- 📝 **express-validator** — Validación de requests y datos de entrada.  
- 🔑 **CORS + dotenv** — Configuración de seguridad y variables de entorno.  
- 🤖 **@google/genai** — Integración con servicios de AI de Google.  
- 🎮 **RAWG API** — Para consultar información de videojuegos y detalles adicionales.

---

## 🌈 Funcionalidades principales

### ✅ Autenticación y Usuarios
- Registro de usuarios (`/api/auth/register`)  
- Login con JWT (`/api/auth/login`)  
- Consultas de usuarios y perfiles (`/api/user`, `/api/user/:id`, `/api/user/profile`)  
- Eliminación de usuarios (`/api/user/:id`)  

### 🎮 Gestión de Videojuegos
- Obtener lista de juegos con paginación (`/api/games?limit=20&page=1`)  
- Consultar juego por ID (`/api/games/:id`)  
- Buscar juegos por nombre (`/api/games/search?q=Zelda&limit=20&page=1`)  
- Crear, cargar, actualizar y eliminar juegos (`POST /api/games`, `POST /api/games/load`, `PUT /api/games/:id`, `DELETE /api/games/:id`)  
- Generar resumen de juego (`POST /api/games/summary/:id`)  
- Listar juegos por fecha de lanzamiento (`/api/games/released?sort=desc&page=1&limit=20`)  

### ⭐ Favoritos
- Agregar juego a favoritos (`POST /api/favorites/add`)  
- Consultar favoritos (`GET /api/favorites`)  
- Eliminar juego de favoritos (`DELETE /api/favorites/remove`)  

### 🔑 Roles y Permisos
- CRUD completo de roles y permisos (`/api/role`, `/api/permission`)  
- Asignación de roles y permisos a usuarios (`PUT /api/role/assign`)  

### ⚡ Validaciones y Seguridad
- Validación de datos de entrada con `express-validator`  
- Autenticación y autorización con JWT y Bcrypt  

---

## 🧩 Arquitectura

El backend sigue una estructura modular:


- **Controllers**: Lógica de negocio por recurso  
- **Services**: Interacciones con la base de datos y APIs externas (RAWG, Gemini)  
- **Routers**: Definición de endpoints y middlewares  
- **Models**: Modelos de datos con Mongoose (`User.js`, `VideoGame.js`, `Role.js`, `Permission.js`, `FavoriteGame.js`)  

---

## 🔗 Variables de entorno

El proyecto requiere las siguientes variables:

```env
GROQ_API_KEY=
RAWG_API_KEY=
JWT_SECRET=
MONGO_URI=
PORT=