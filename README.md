# 🦁 Sillar Inmobiliaria CRM - Backend API

![NodeJS](https://img.shields.io/badge/Node.js-v20-green?style=flat&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue?style=flat&logo=typescript)
![Express](https://img.shields.io/badge/Express-v4-white?style=flat&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-blue?style=flat&logo=postgresql)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52B0E7?style=flat&logo=sequelize)

**Sillar Inmobiliaria CRM** es una API RESTful profesional diseñada para la gestión integral de bienes raíces. Este sistema Backend centraliza la lógica de negocio, integrando autenticación segura, inteligencia artificial generativa y análisis de datos en tiempo real.

---

## ✨ Características Principales

- **🔐 Seguridad de Grado Empresarial:**
  - Autenticación vía **JWT** (JSON Web Tokens).
  - Encriptación de contraseñas con **Bcrypt**.
  - Protección de cabeceras HTTP con **Helmet**.
  - Monitoreo de logs con **Morgan**.
  - Configuración de **CORS** lista para producción.

- **🤖 Inteligencia Artificial (IA):**
  - Integración nativa para la generación automática de descripciones de propiedades y textos de marketing (Powered by Gemini/OpenAI).

- **📊 Dashboard Analítico:**
  - Cálculo de KPIs en tiempo real.
  - Métricas de rendimiento anual, mensual y semanal.
  - Gráficas estadísticas de ventas y captaciones.

- **📑 Reportes Avanzados:**
  - Generación de archivos Excel (`.xlsx`) multipestaña con **ExcelJS**.
  - Exportación de Propiedades, Clientes, Visitas y Propietarios.

- **🛡️ Modo Mantenimiento:**
  - Arquitectura preparada para despliegues seguros y control de acceso global mediante variables de entorno.

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Core** | Node.js | Entorno de ejecución |
| **Framework** | Express.js | Servidor web rápido y minimalista |
| **Lenguaje** | TypeScript | Superset de JS con tipado estático |
| **Base de Datos** | PostgreSQL | BDD Relacional robusta |
| **ORM** | Sequelize | Mapeo objeto-relacional |
| **Utilidades** | ExcelJS, Dotenv | Manejo de archivos y entorno |

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para levantar el servidor en tu entorno local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/si-backend.git
cd si-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configuración de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto (puedes basarte en `.env.example`).

Variables requeridas:

```env
PORT=4000
DB_NAME=sillar_db
DB_USER=postgres
DB_PASS=tu_password_local
DB_HOST=localhost
JWT_SECRET=tu_secreto_super_seguro
# FRONTEND_URL=https://tu-dominio.com (Opcional para producción)
```

### 4. Base de Datos

El sistema utiliza `Sequelize.sync()`, por lo que creará las tablas automáticamente al iniciar si no existen. Asegúrate de tener PostgreSQL corriendo y la base de datos `sillar_db` creada.

### 5. Ejecutar el Servidor

**Modo Desarrollo** (con reinicio automático):

```bash
npm run dev
```

**Modo Producción:**

```bash
npm run build
npm start
```

---

## 📂 Estructura del Proyecto

La arquitectura sigue el patrón MVC (Modelo-Vista-Controlador) adaptado a API REST:

```
src/
├── config/         # 🔌 Configuración de DB y variables globales
├── controllers/    # 🧠 Lógica de negocio (Auth, Propiedades, Dashboard)
├── models/         # 🗄️ Definición de tablas y relaciones (Sequelize)
├── routes/         # 🚦 Definición de endpoints de la API
├── middlewares/    # 🛡️ Validaciones, AuthGuard, Uploads
├── utils/          # 🔧 Herramientas (Helpers de fechas, formateadores)
└── app.ts          # 🚀 Punto de entrada y configuración de Express
```

---

## 🔑 Credenciales por Defecto (Seed)

Al iniciar la aplicación por primera vez, el sistema verificará si existe un administrador. Si no, creará uno automáticamente para que puedas acceder:

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| Super Admin | admin@sillar.com | 123456 |

⚠️ **Nota:** Se recomienda cambiar esta contraseña inmediatamente después del primer inicio de sesión.

---

## 📝 API Endpoints (Resumen)

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Iniciar sesión y obtener Token | Público |
| GET | `/api/propiedades` | Listar todas las propiedades | Autenticado |
| POST | `/api/ai/generar` | Crear texto de marketing con IA | Admin/Agente |
| GET | `/api/admin/dashboard` | Obtener métricas y KPIs | Admin |
| GET | `/api/admin/dashboard/excel` | Descargar Reporte .xlsx completo | Admin |

---

Developed with ❤️ by **Mijael Juy** 🤝 **Sillar Inmobiliaria**
