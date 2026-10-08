# RedNexus Frontend

Interfaz web de **RedNexus**, la red de apoyo académico que conecta cada solicitud de ayuda con los 3 compañeros que más saben del tema.

Stack: Vue 3 + Vite (TypeScript), Vue Router, Pinia, Tailwind CSS y Vitest.

## Requisitos

- Node.js 24 (con [nvm](https://github.com/nvm-sh/nvm) o [fnm](https://github.com/Schniz/fnm); ambos leen `.nvmrc`)
- La API ([RedNexus-Backend](https://github.com/juanjosegl/RedNexus-Backend)) corriendo en `http://localhost:3000`

**¿Primera vez?** Sigue la [guía del equipo](https://github.com/juanjosegl/RedNexus-Platform/blob/developer/docs/guia-del-equipo.md); las tareas están en [tareas.md](https://github.com/juanjosegl/RedNexus-Platform/blob/developer/docs/tareas.md).

## Arranque

1. **Levanta el backend con Docker**, sin instalar nada del backend. En RedNexus-Platform:

   ```bash
   docker compose up -d --build api worker   # API en http://localhost:3000, con datos de prueba
   ```

2. **Arranca el frontend** en este repo:

   ```bash
   git checkout developer
   cp .env.example .env
   npm install
   npm run dev                   # http://localhost:5173
   ```

La página de inicio muestra `API: ok` cuando el backend responde. Los endpoints disponibles, con lo que reciben y responden, están en **http://localhost:3000/api/docs** (Swagger).

Cuando el equipo de backend fusione cambios, actualízalos con `git pull` en RedNexus-Backend y repite el paso 1.

El frontend siempre llama a la API con rutas relativas (`/api/...`):

- **En desarrollo:** Vite reenvía `/api` a `http://localhost:3000` (ver `server.proxy` en `vite.config.ts`).
- **En Docker y Kubernetes:** Nginx reenvía `/api` al servicio indicado en `API_UPSTREAM` (ver `nginx.conf.template`).

Así la misma imagen sirve en cualquier ambiente. La imagen corre Nginx sin root en el puerto 8080.

## Estructura

```text
src/
├── main.ts
├── App.vue
├── router/            # rutas
├── stores/            # Pinia (sesión)
├── services/http.ts   # cliente de la API
├── components/ui/     # componentes reutilizables
├── layouts/           # layouts de página
└── features/          # una carpeta por funcionalidad del MVP
    ├── auth/          # login y registro
    ├── profile/       # perfil y habilidades
    ├── help-requests/ # crear solicitud, nota de voz
    ├── matches/       # candidatos, aceptar o rechazar
    └── ratings/       # calificar la ayuda
```

## Ramas

| Rama | Uso |
| --- | --- |
| `main` | Versión estable. Solo entra por PR desde `test`. |
| `test` | QA. Entra por PR desde `developer`. |
| `developer` | Integración diaria. Entra por PR desde `feature/*` o `fix/*`. |

Flujo: `git switch developer && git pull`, luego `git switch -c feature/FE-02-login-registro` (tipo/ID-de-la-tarea-descripcion), commits como `feat(auth): vistas de login y registro` y PR hacia `developer`. Reglas completas en [CONTRIBUTING](https://github.com/juanjosegl/RedNexus-Platform/blob/developer/CONTRIBUTING.md).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run lint` | oxlint + ESLint (corrige lo que puede) |
| `npm run format` | Prettier |
| `npm test` | Pruebas con Vitest |
| `npm run build` | Revisión de tipos y build de producción |
