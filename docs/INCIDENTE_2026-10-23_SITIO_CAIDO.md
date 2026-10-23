# Incidente: sitio ceramicaptorico.com.ar caído (23/10/2026, 15:50)

> Documento de trabajo interno. Sirve para explicar al cliente qué pasó, con datos
> verificables, y para dejar registro de las causas y las correcciones.

## Qué se pidió

1. Sacar todas las marcas de "Pendiente de validación" / "A confirmar" del catálogo.
2. Corregir el grid de productos destacados de la home, que quedaba 4 arriba y 1 abajo.

## Qué se hizo (completado y verificado)

- **PR #9** (merge `8ced082` en `main`): se quitó el badge "Pendiente de validación" de
  la tarjeta de producto, de la ficha de producto, de Aplicaciones, del Centro Técnico y
  de las Preguntas Frecuentes. Regla nueva: **si un dato no está confirmado, la fila no se
  imprime** (no se muestra "A confirmar"). Los specs de la tarjeta quedaron con
  Dimensiones / Peso / Palet, y el "Palet" ocupa la fila completa.
- Se reescribieron las 3 respuestas de FAQ que dependían de datos sin confirmar, con los
  datos reales del catálogo (cantidades por pallet entre 268 y 515 según el modelo).
- El Centro Técnico pasó de "Descargar" (enlace vacío) a "Solicitar" → formulario.
- La home pasó de 4+1 a **3×2 exactos**: los 5 destacados + un tile "Catálogo completo".
- El mismo defecto (9 productos en 4+4+1) se corrigió en `/aplicaciones/[id]`: ahora las
  columnas se calculan según la cantidad de productos.
- **Publicado a las 15:00** y verificado a las **15:47** contra el servidor real:
  - 24/24 páginas respondieron 200 con el cuerpo **byte a byte idéntico** al build local.
  - 43/43 assets correctos.
  - 10/10 redirects 301 correctos.
  - `/.env`, `/api/config.php` y `/vendor/**` bloqueados (403). 404 propio del sitio.
  - Grid medido en navegador real: 3 columnas de 376px, filas [3, 3], sin overflow, a
    1638×969 y a 1366×768. 0 errores de consola.
  - Ficha de producto: 4 filas de specs, todas con dato.

## La caída

A las **15:50** el hosting dejó de responder:

| Comprobación | Resultado |
|---|---|
| `200.58.111.29` puerto 443 / 80 / 21 | sin conexión |
| `ping 200.58.111.29` | 100% de paquetes perdidos |
| `200.58.112.193` (otra IP del mismo datacenter) | responde con normalidad |
| `panel.ferozo.com` (200.58.109.42) | responde con normalidad |
| Proxy externo (IP distinta) | **522** (el origen no responde para nadie) |

**Diagnóstico:** el panel de control vive en un servidor distinto del nodo que aloja el
sitio. La cuenta está sana y se administra bien; lo que no responde es el nodo
**c250 / a1000380.ferozo.com (200.58.111.29)**, que es una máquina del hosting compartido.
No es un problema de DNS, de `.htaccess`, de código ni de configuración del sitio: el
contenido estaba subido y verificado 3 minutos antes de la caída.

## Causa

Entre las 15:03 y las 15:44 el script `deploy.ps1` recorrió **todas** las carpetas del
docroot para armar el mapa de archivos remotos y verificar tamaños. El directorio del
sitio conserva un WordPress viejo (`wp-content`, `wp-includes`, plugins), o sea **miles de
carpetas**, y cada `LIST` es **una conexión FTP nueva**: en ese tramo se hicieron del
orden de **1.000 conexiones FTP seguidas**.

El nodo no respondió más a partir de las 15:50, unos minutos después de que se cortara
el recorrido. No hay forma de distinguir desde afuera entre dos mecanismos:

- suspensión automática por exceso de conexiones (anti-abuso del hosting), o
- colapso del nodo compartido por la carga.

Lo que sí es responsabilidad nuestra es el disparador: **el despliegue que引起 la caída
fue ejecutado por nosotros sin revisar que la verificación recorriera el árbol entero**.

## Estado de la página

El sitio está publicado y verificado en el disco del servidor. No se borró nada: ni la
base de datos, ni los archivos, ni el `.htaccess`. Apenas el nodo vuelve a responder,
alcanza con terminar dos subidas (`vendor/` y `.htaccess`, que no cambiaron) y volver a
verificar todo, incluido el formulario de contacto.

El contenido además está en git (`main`, PR #9), así que se puede republicar completo en
minutos aunque el hosting reinstale la cuenta. Los dos únicos archivos que **no** están
en git (`public/.htaccess` y `api/config.php` con la clave SMTP) están guardados en
local.

## Correcciones ya aplicadas (para que no se repita)

| PR | Cambio |
|---|---|
| #10 | `Test-Tree` ya no recorre el docroot entero: calcula sólo las carpetas donde hay archivos de este deploy (~40 `LIST` en vez de ~1.000). |
| #11 | Pausa de 300 ms entre conexiones FTP (`FTP_PAUSA_MS` configurable). |

Además quedó documentado en `AGENTS.md` (sección "Deployment") el incidente, el
diagnóstico y la regla: **nunca listar el docroot entero por FTP**.

## Pendiente

1. Que el hosting reinicie el nodo c250 (vía "Estado de los servicios" del panel Ferozo o
   Mesa de Ayuda 24x7).
2. Terminar el deploy y re-verificar todo (páginas, assets, redirects, bloqueos y
   formulario de contacto).
3. Probar el formulario de punta a punta (quedó pendiente: el envío de prueba de las
   15:52 murió con `ERR_CONNECTION_TIMED_OUT` porque el servidor ya estaba caído).

## Nota para Donweb / Mesa de Ayuda

> **Ferozo — cuenta a1000380 — nodo caído**
>
> Dominio: ceramicaptorico.com.ar
> Nodo: c250 / a1000380.ferozo.com → 200.58.111.29
>
> Desde las 15:50 del 23/10/2026 ese nodo no responde: sin ping, sin FTP (21), sin HTTP (80)
> ni HTTPS (443). El panel de control (panel.ferozo.com / 200.58.109.42) responde con
> normalidad, y otra IP del mismo datacenter (200.58.112.193) también: la caída afecta
> sólo a ese nodo.
>
> Para contexto: entre las 15:03 y las 15:44 un script de despliegue de nuestro lado abrió
> del orden de 1.000 conexiones FTP de listado seguidas (una por cada carpeta del directorio
> del sitio, que incluye un WordPress viejo). ¿Se suspendió automáticamente la cuenta o el
> node por superar el límite de conexiones FTP? ¿Cuál es ese límite por hora? Se requiere
> reiniciar el nodo y confirmar que no quedó ninguna IP bloqueada.
>
> Es el sitio comercial de un cliente (fábrica de ladrillos) y está caído por completo.
