# pqrs

Peticiones, quejas, reclamos y sugerencias sobre la plataforma. El asistente de la página de ayuda remite aquí
lo que no puede resolver.

Ruta: `/pqrs` (requiere sesión). Se llega desde la página de ayuda.

El cliente llama a `POST /pqrs` con `{ type, subject, description }` y a `GET /pqrs/mine`. Al radicar se
muestra el número de radicado (`PQRS-000001`). Los estados son Radicada, En revisión y Respondida; cuando el
equipo responde, la respuesta aparece debajo de la PQRS.
