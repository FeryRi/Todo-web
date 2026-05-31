# Todo — Web App

Aplicación web de gestión de tareas (principalmente académicas) construida con React y Vite. Permite a estudiantes organizar sus listas de tareas, dar seguimiento al progreso por materia y visualizar sus pendientes del día.
Permite:

- Crear y gestionar **listas de tareas** por materia o módulo con color e ícono personalizados
- Agregar, editar y eliminar **tareas** con prioridad, descripción y fecha de entrega
- Ver el **progreso** de cada lista con barra de avance
- Consultar las tareas con **vencimiento hoy** directamente en el home
- **Buscar** listas y tareas de forma dinámica
- Autenticarse con **Firebase** y mantener la sesión activa

---

## Tecnologías utilizadas

| Categoría     | Tecnología                           |
| ------------- | ------------------------------------ |
| Framework     | React 19 + Vite 8                    |
| Routing       | React Router DOM v7                  |
| Lenguaje      | TypeScript                           |
| HTTP Client   | Axios                                |
| Autenticación | Firebase Authentication              |
| UI Components | MUI (Material UI) + Emotion          |
| Íconos        | react-icons                          |
| Backend       | Quarkus (Java) — deployado en Render |
| Database      | PostgreSQL — deployado en Supabase   |

---

## Instrucciones de instalación

### Requisitos previos

- Node.js 18 o superior
- npm o yarn

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/FeryRi/Todo-web.git

# 2. Entra a la carpeta del proyecto web
cd todofront-web/todo-web

# 3. Instala las dependencias
npm install

# 4. Agrega el .env en la raíz del proyecto con las siguientes variables
#    (los valores reales se encuentran en la entrega de Canvas)

# URL del backend REST
VITE_API_URL=https://todoback-xkpn.onrender.com

# Firebase Authentication
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Cómo ejecutar el proyecto

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar el build de producción
npm run preview
```

> **Advertencia:** El backend está desplegado en el plan gratuito de Render, por lo que puede tardar entre 30 y 50 segundos en responder la primera vez (cold start).

---

## Links deployados

| Servicio                                                                            | URL                                                           |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Backend API (Quarkus / Render)                                                      | https://todoback-xkpn.onrender.com                            |
| Deployment (Vercel - requiere inicio de sesión en vercel por Deployment Protection) | https://todo-g34g419cl-fernanda-ris-projects.vercel.app/login |

### Endpoints principales del backend

| Método   | Ruta                 | Descripción                                |
| -------- | -------------------- | ------------------------------------------ |
| `GET`    | `/dashboard`         | Home — listas con progreso + tareas de hoy |
| `GET`    | `/lists`             | Todas las listas del usuario               |
| `POST`   | `/lists`             | Crear lista                                |
| `GET`    | `/lists/{id}`        | Detalle de lista con tareas                |
| `PUT`    | `/lists/{id}`        | Editar lista                               |
| `DELETE` | `/lists/{id}`        | Eliminar lista                             |
| `POST`   | `/tasks`             | Crear tarea                                |
| `PUT`    | `/tasks/{id}`        | Editar tarea                               |
| `PATCH`  | `/tasks/{id}/status` | Cambiar estado de tarea                    |
| `DELETE` | `/tasks/{id}`        | Eliminar tarea                             |
| `GET`    | `/search?q=`         | Buscar listas y tareas                     |

---

## Usuarios de prueba

| Rol               | Correo          | Contraseña |
| ----------------- | --------------- | ---------- |
| Usuario de prueba | `1@hotmail.com` | `aA123456` |

> Si el usuario anterior no existe, puedes crear una cuenta nueva desde la pantalla de **Registro** dentro de la app.

---

## Estructura del proyecto

```
todo-web/
├── src/
│   ├── pages/                  # Vistas principales
│   │   ├── Home/               # Dashboard con progreso y tareas de hoy
│   │   ├── Lists/              # Vista de todas las listas
│   │   ├── Tasks/              # Detalle de lista con sus tareas
│   │   ├── Search/             # Búsqueda global
│   │   ├── Login/
│   │   ├── Register/
│   │   └── About/
│   ├── components/             # Componentes reutilizables
│   │   ├── AppLayout/          # Layout base con header y navegación
│   │   ├── Header/             # Barra superior de navegación
│   │   ├── TaskListCard/       # Tarjeta de lista con progreso
│   │   ├── TaskRow/            # Fila de tarea con checkbox
│   │   ├── Task/               # Ítem de tarea compacto
│   │   ├── TaskFormModal/      # Modal crear/editar tarea (discriminado por prop `task`)
│   │   ├── EditListModal/      # Modal editar lista
│   │   ├── CreateListModal/    # Modal crear lista
│   │   └── DeleteConfirmModal/ # Modal confirmación de eliminación
│   ├── services/               # Capa de acceso a la API
│   │   ├── Api.ts              # Instancia Axios + interceptors
│   │   ├── auth/               # Firebase auth
│   │   ├── lists/              # CRUD de listas
│   │   ├── tasks/              # CRUD de tareas
│   │   ├── search/             # Búsqueda
│   │   └── users/              # Datos del usuario
│   ├── contexts/               # Contextos de React
│   │   └── AuthContext.tsx     # Estado global de autenticación
│   ├── router/                 # Configuración de rutas
│   │   ├── AppRouter.tsx       # Definición de rutas
│   │   └── PrivateRoute.tsx    # Guard de rutas autenticadas
│   ├── hooks/                  # Custom hooks
│   │   └── useAuth.ts
│   ├── types/                  # Tipos TypeScript
│   │   ├── Task.ts
│   │   └── TaskList.ts
│   └── config/                 # Configuración general
└── public/                     # Archivos estáticos
```
