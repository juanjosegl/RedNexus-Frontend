# help-requests

Crear y seguir solicitudes de ayuda.

Rutas: `/help-requests`, `/help-requests/new`, `/help-requests/:id`. Las rutas en español del contrato redirigen aquí.

El cliente llama a `POST /help-requests`, `GET /help-requests/mine` y `GET /help-requests/:id`. Si la sesión ya tiene token, lo envía. El detalle se vuelve a consultar cada 5 segundos mientras el estado es `PENDING`.
