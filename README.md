# Latteame - Café y Dulces ☕🥐

Latteame es una aplicación web moderna para una cafetería boutique en Málaga, España. Cuenta con un menú público atractivo, una sección dinámica de reseñas integrada con Google Reviews y un panel de administración robusto para la gestión de productos y categorías en tiempo real.

## ✨ Características

- **Menú Público**: Un menú diseñado con elegancia, responsivo, con filtrado por categorías y animaciones fluidas (Framer Motion).
- **Integración con Google Reviews**: Muestra automáticamente las reseñas mejor valoradas para generar confianza y prueba social.
- **Panel de Administración**:
  - Autenticación segura basada en JWT.
  - Operaciones CRUD para Categorías (con orden de visualización).
  - Operaciones CRUD para Productos (nombre, descripción, categoría e imagen).
  - Gestión de sesiones resiliente (duración del token de 24 horas).
- **Integración de Reservas**: Enlaces directos a plataformas de reserva externas.
- **Entorno Dockerizado**: Configuración de todo el stack con un solo comando.

## 🛠️ Tecnologías

- **Frontend**: React (Vite), Tailwind CSS 4.0, Framer Motion, Tabler Icons.
- **Backend**: Node.js, Express, MySQL 8.0, JWT (JSON Web Tokens), Bcrypt.js.
- **Infraestructura**: Docker, Docker Compose, Nginx (para servir el cliente en producción).

## 🚀 Primeros Pasos

### Requisitos Previos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/latteame.git
   cd latteame
   ```

2. **Ejecutar con Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Acceder a la aplicación**:
   - **Sitio Público**: [http://localhost:88](http://localhost:88)
   - **Panel de Administración**: [http://localhost:88/admin](http://localhost:88/admin)

### Credenciales de Administrador (Por defecto)

- **Usuario**: `ADMINISTRATOR`
- **Password**: `admin123`

> [!IMPORTANT]
> Cambie estas credenciales en la base de datos o mediante un script de registro antes de desplegar en un entorno de producción.

## 📂 Estructura del Proyecto

```text
latteame/
├── client/              # Frontend en React
│   ├── src/             # Componentes, Páginas, Servicios
│   └── Dockerfile       # Configuración de Nginx
├── server/              # Backend en Node.js
│   ├── data/            # Configuración local (JSON)
│   ├── uploads/         # Imágenes de productos
│   └── Dockerfile       # Configuración de Node/Express
└── docker-compose.yml   # Orquestación de Servidor, Cliente y BD
```

## ⚙️ Variables de Entorno

El proyecto utiliza variables de entorno definidas en el `docker-compose.yml` para el desarrollo local.

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `JWT_SECRET` | Clave secreta para la firma de tokens | `super_secret_key_123` |
| `DB_PASSWORD` | Contraseña root de MySQL | `admin_pass` |
| `RESERVATION_URL` | URL de destino para los botones de reserva | `https://reservas.im-soluciones.com/` |

## 📄 Licencia

Distribuido bajo la Licencia MIT.
