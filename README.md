# LNE Stock Dashboard

Panel administrativo responsive para gestionar el inventario de LNE Stock. Está construido con Vue 3, Vite, Vue Router, Pinia, Axios y Lucide Vue Next.

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

Configura `VITE_API_URL` como `https://backendlnestock-production.up.railway.app/api`. El cliente Axios centralizado normaliza una única vez el sufijo `/api` y todos los servicios usan rutas relativas.

Para generar el build de producción: `npm run build`.

## Backend conectado

El frontend se alinea con `BackendLNEStock` y usa estos endpoints reales:

- `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET|POST|PUT|DELETE /api/productos` y `GET /api/productos/:id`
- `GET|POST|PUT|DELETE /api/categorias` y `GET /api/categorias/:id`
- `GET|POST /api/movimientos`
- `GET /api/usuarios`, `GET /api/usuarios/:id`, `PATCH /api/usuarios/:id/status`, `PUT /api/usuarios/:id/password`

El login recibe el payload real del backend (`accessToken` y `user`; también se admite `token`, igual que Flutter). El access token se conserva durante la sesión en `sessionStorage`; las peticiones protegidas envían `Authorization: Bearer <accessToken>` desde el interceptor centralizado. Un 401 limpia la sesión y redirige al login. El stock no se modifica directamente desde el dashboard: las entradas y salidas se envían como `{ tipoMovimiento, cantidad, productoId }`.

Las estadísticas se calculan en presentación a partir de productos, categorías y movimientos disponibles, sin datos ficticios. El acceso al dashboard requiere un usuario con `role === 'admin'`; las operaciones administrativas continúan protegidas por el backend.

## Estructura

`src/components` contiene piezas reutilizables; `src/layouts` el layout protegido; `src/views` las pantallas; `src/services` las llamadas REST; `src/stores` la sesión JWT; `src/router` las rutas y guards; y `src/utils` los formateadores.

Los permisos se reflejan visualmente según `user.role`, pero la autorización real continúa siendo responsabilidad del backend.
