# RedNexus Frontend

Interfaz web de **RedNexus**, la red de apoyo académico que conecta cada solicitud de ayuda con los 3 compañeros que más saben del tema.

Stack: Vue 3 + Vite (TypeScript), Vue Router, Pinia, Tailwind CSS y Vitest.

## Requisitos

- Node.js 24 (con [fnm](https://github.com/Schniz/fnm): `fnm use` lee `.nvmrc`)
- La API ([RedNexus-Backend](https://github.com/juanjosegl/RedNexus-Backend)) corriendo en `http://localhost:3000`

## Arranque

```bash
git checkout developer
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

La página de inicio muestra `API: ok` cuando el backend responde.

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

Flujo: `git checkout developer && git pull`, luego `git checkout -b feature/RN-12-descripcion`, commits con [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat: ...`, `fix: ...`) y PR hacia `developer`.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run lint` | oxlint + ESLint (corrige lo que puede) |
| `npm run format` | Prettier |
| `npm test` | Pruebas con Vitest |
| `npm run build` | Revisión de tipos y build de producción |
