# LNE Stock Dashboard

Panel administrativo responsive para gestionar el inventario de LNE Stock. Está construido con Vue 3, Vite, Vue Router, Pinia, Axios y Lucide Vue Next.

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

Configura `VITE_API_URL` con la URL base del backend, por ejemplo `https://backendlnestock-production.up.railway.app/api`. El dashboard acepta la URL con o sin `/api` y agrega el sufijo automáticamente cuando es necesario.

Para generar el build de producción: `npm run build`.

## Backend conectado

El frontend se alinea con `BackendLNEStock` y usa estos endpoints reales:

- `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET|POST|PUT|DELETE /api/productos` y `GET /api/productos/:id`
- `GET|POST|PUT|DELETE /api/categorias` y `GET /api/categorias/:id`
- `GET|POST /api/movimientos`

El login recibe `{ accessToken, user }`. El access token se conserva únicamente durante la sesión en `sessionStorage`; las peticiones protegidas envían `Authorization: Bearer <accessToken>` y la cookie httpOnly de refresh se conserva con `withCredentials`. Si el access token expira, Axios intenta renovarlo automáticamente mediante `/api/auth/refresh`. El stock no se modifica directamente desde el dashboard: las entradas y salidas se envían como `{ tipoMovimiento, cantidad, productoId }`.

El backend actual no expone usuarios ni estadísticas. La vista de usuarios lo documenta como funcionalidad pendiente; las estadísticas se calculan en presentación a partir de productos y movimientos disponibles, sin datos ficticios. Tampoco existe un endpoint de edición de perfil, por lo que el perfil queda en modo lectura.

## Estructura

`src/components` contiene piezas reutilizables; `src/layouts` el layout protegido; `src/views` las pantallas; `src/services` las llamadas REST; `src/stores` la sesión JWT; `src/router` las rutas y guards; y `src/utils` los formateadores.

Los permisos se reflejan visualmente según `user.role`, pero la autorización real continúa siendo responsabilidad del backend.
