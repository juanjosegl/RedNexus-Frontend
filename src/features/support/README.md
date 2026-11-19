# support

Página de ayuda con el asistente de RedNexus (RAG sobre la base de conocimiento del proyecto).

Ruta: `/ayuda` (requiere sesión).

El cliente llama a `POST /support/chat` con `{ message, history }` y muestra `answer` y `sources`. El historial
lleva como máximo los últimos 10 turnos. Si el backend responde 503, el asistente no está disponible (Open WebUI
apagado) y se muestra un aviso.

Piezas que se agregan en otras tareas:

- FE-09: enlace "Ayuda" en el menú principal.
- FE-10: `SuggestedQuestions.vue`, botones con preguntas sugeridas que llaman a `send`.
- FE-11: `ChatMessage.vue`, la burbuja de cada mensaje.
- FE-12: `FaqList.vue`, preguntas frecuentes, y el acceso a la ayuda desde el inicio.
