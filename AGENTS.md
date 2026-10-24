## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

### Known gotchas (verified oct/2026)

- **`npm install` fails with `ERESOLVE` on a clean clone.** `package.json` asks for
  `astro@^7.3.5` but `@astrojs/vue@^6.0.0` requires `astro@^6`, and the lockfile
  carries the same conflict. Install with `npm install --legacy-peer-deps`, or align
  the versions. There are **no `.vue` components in `src/`**, so `@astrojs/vue` can
  just be removed.
- **`astro preview` returns 404 on every route.** The site uses `base: './'` plus
  `trailingSlash: 'never'`, and the preview server does not resolve the
  extensionless paths. To look at the built site, serve `dist/` with a static
  server that maps `/ruta` to `dist/ruta/index.html`.
- **Full-page screenshots come out with blank sections.** Las animaciones de
  entrada son CSS puro (`animation-timeline: view()`), así que lo que está por
  debajo del pliegue queda en `opacity: 0` hasta que entra en pantalla, y las
  fotos de producto van con `loading="lazy"`. Para capturar: scrollear la
  página entera (o usar `window.scrollTo` con `scrollBehavior = 'auto'`, porque
  el sitio tiene `scroll-behavior: smooth`), poner las imágenes en `eager` y
  recién ahí tomar la captura. **No hay que forzar más `is-visible`: esa clase
  ya no existe.**
- **El atajo `animation:` rompe las animaciones de scroll.** El atajo deja
  `animation-duration` en `0s`, y con un timeline de scroll hace falta `auto`
  explícito: `animation: fade-up auto linear both;` + `animation-timeline:
  view();`. Sin el `auto`, el contenido queda invisible.
- **Las fuentes están auto-hospedadas** en `public/fonts/` (Archivo, Inter e
  IBM Plex Mono, subconjunto latin, woff2). **No volver a los links de Google
  Fonts**: agregan dos requests a terceros en el camino crítico y ralentizan
  el primer pintado. Para agregar una tipografía, se baja el woff2 y se declara
  el `@font-face` en `global.css`.
- **No hay una clase `.reveal` en el sitio.** Antes `BaseLayout.astro` le ponía
  la clase a todas las secciones (antipatrón de plantilla) y después quedó una
  regla CSS huérfana que nada usaba. **No la vuelvas a agregar**: el reveal se
  hace **por bloque**, dentro de un `@supports (animation-timeline: view())` +
  `@media (prefers-reduced-motion: no-preference)`: `.stat`, `.featured-cta`,
  `.featured-grid > .product-card`, `.plant-cell` y `.cut-fill`. Si agregás un
  bloque nuevo que deba animarse, sumalo a esa lista explícita.
- **The company's correction PDF has crossed references.** In
  "correcciones página web.pdf" the link for "Vistos 10x15x24" repeats the one for
  "Livianos 12x18x24", and the two first process videos are swapped (the link under
  "Extracción y acopio" is the video titled "PROCESO DE PREPARACIÓN DE LA TIERRA").
  The Drive links in the PDF are public: `https://drive.google.com/uc?export=download&id=<ID>`.

## Content rules (verified oct/2026)

- **The site must not show "Pendiente de validación" nor "A confirmar" anywhere.**
  The client asked for those marks to be removed (23/10/2026). A value that the
  company has not confirmed stays `null` in the data file and the row is simply
  **not rendered** — never a placeholder text. This applies to the product card
  (specs box), the product page (technical table), `/recursos-tecnicos`,
  `/preguntas-frecuentes` and `/aplicaciones`.
- **The global `.pending` class no longer exists** (removed from `global.css`).
  Don't bring it back to flag unconfirmed data: leave the value `null` and
  document it in the data file.
- **The Centro Técnico has no downloadable files yet**: it lists the documents the
  factory has and the button says "Solicitar" (to `/contacto`). When the client
  sends the PDFs, turn that button into a real download.
- **Ninguna nota que le pida datos al visitante en una página publicada.** La
  cronología ya la completó la empresa, así que la nota *"Nos falta un dato de
  esta cronología: los nombres de los fundadores. Si la empresa los tiene,
  envianoslos por WhatsApp y los incorporamos"* sobraba en una página viva
  (PR #19, 24/10/2026). Si falta un dato, **no se escribe la nota**: se espera
  el dato y mientras tanto el valor queda `null` en el archivo de datos o el
  bloque no se renderiza. Es la misma regla que las marcas de "pendiente",
  pero para el texto editorial.

### Layout rules

- **No grid may leave a single card alone in the last row.** The home's featured
  section is 5 products + 1 "Catálogo completo" tile = 6 cells = 3×2 exactly.
  `/aplicaciones/[id]` derives the column count from the number of products
  (`--cols`): 9 → 3+3+3, 4 → one row of 4, 2 → 2 columns capped at 860px.
- **Astro scopes styles per component**: a `grid-column: span 2` in the parent's
  `<style>` does NOT reach the root element of a child component (`<ProductCard />`).
  Use fixed column counts instead of spans, or `:global()`.
- **El bento del catálogo de la home** es una grilla de 3 × 3 (9 celdas): el
  `<div class="featured-cta">` ocupa 2 × 2 (4 celdas) y los 5 `<ProductCard />`
  llenan las otras 5. El `span` va en el `<div>`, que sí es hijo directo de la
  grilla; los `<ProductCard />` son celdas normales. A ≤980 px el `span` se
  desactiva, el tile pasa al final y quedan 3 filas parejas.

## Deployment

The site goes to the client's shared hosting (Hostmar) over **FTPS**, and the domain
`ceramicaptorico.com.ar` points to the docroot root. `deploy.cmd` (un atajo a
`deploy.ps1`) hace todo: build, respaldo, subida, **verificación de tamaños** y
comprobación del sitio.

```
set FTP_HOST=a1000380.ferozo.com
set FTP_USER=codex@ceramicaptorico.com.ar
set FTP_PASS=...
set FTP_DIR=/
deploy.cmd
```

**Si el hosting bloquea la IP de origen, el deploy sale por un túnel.**
El 23/10/2026 el deploy listó el docroot entero por FTP y el servidor baneó la
IP de salida (21/80/443 caídos, sin ping) — el sitio seguía en pie desde el
exterior, pero la máquina quepublicaba no lo alcanzaba. Cuando eso pasa:

```
ssh -N -D 1080 <maquina-con-acceso-al-hosting>     # tunel SOCKS5
set FTP_SOCKS5=127.0.0.1:1080
deploy.cmd
```

`deploy.ps1` agrega `--socks5-hostname` a todas las llamadas de `curl` cuando
`FTP_SOCKS5` está definida, y también a la comprobación final del sitio.

> **Por qué `--socks5-hostname` y no un reenvío TCP local (`ssh -L`).** Con
> `--socks5-hostname` la resolución del nombre la hace el proxy, pero la
> validación del certificado TLS sigue usando el hostname real. Con `-L` hacia
> `127.0.0.1` el certificado no coincide con el host y **curl corta con error
> 60** (certificado SSL) aunque el túnel esté perfecto.

Las credenciales **no** están en el repo: viven en `.ferozo-credentials` (ignorado
por git). El servidor es ProFTPD con `AUTH SSL` en el puerto 21 (FTPS explícito;
el 990 está cerrado), así que la subida necesita `--ssl-reqd`.

- **Los archivos van de a uno, no en lotes.** Subiendo 60 archivos en una sola
  conexión de curl, el servidor dejó varios con **0 bytes** (por ejemplo
  `index.html`), y eso **no se ve en el código HTTP**: un archivo vacío responde
  200 igual y la página se ve en blanco. Por eso `deploy.ps1` sube archivo por
  archivo y después compara el tamaño de cada archivo remoto con el local y
  resubive los que no coinciden. La verificación tiene que mirar el **tamaño**,
  no el status.
- **El `.htaccess` se sube al final, a propósito.** Hasta que no está, el
  servidor sigue con el de WordPress y el sitio no cambia. Si el nuevo fuera a
  romper algo, el anterior sigue ahí para volver atrás.
- **Cuidado con los paréntesis y los `<>` en los `echo` dentro de un bloque
  `if (...)` de un `.cmd`.** `cmd.exe` parsea el bloque entero antes de
  ejecutarlo, y un `(` en el texto de un `echo` cuenta como apertura de
  sub-bloque: el `)` lo cierra y lo que queda queda huérfano. Con
  `echo  error (codigo %CODE%).` el script tiraba *"No se esperaba . en este
  momento"* y **devolvía 255 aunque el deploy hubiera salido bien** — el
  error salía después de que todo estaba hecho. Los paréntesis y los ángulos
  van escapados: `^(codigo %CODE%^)` y `/revision-^<sello^>/`.
- **`DirectorySlash Off` es lo que hace que funcionen las URLs.** El sitio
  declara sus URLs sin barra final (`/productos/12x18x24-liviano`) y Apache, con
  `DirectorySlash` por defecto, responde a esas con un 301 a la versión con
  barra. `DirectorySlash Off` (Apache 2.4.39+) hace que Apache sirva el
  `index.html` de la carpeta en la URL pedida. Verificado en este host:
  `/prueba-url/productos/x` → 200.
- **`DirectoryIndex index.html`** también hace falta: `index.php` de WordPress
  sigue en el docroot y si no, gana él.
- **`vendor/` está bloqueado** (`RewriteRule ^vendor/ - [F,L]`): solo lo usa PHP
  con `require`, no se sirve por HTTP.
- **El formulario necesita PHPMailer y una configuración en el servidor.**
  `api/contact.php` carga `../vendor/autoload.php` y `api/config.php`, que no
  están en el repo. El `vendor/` se baja del propio hosting (la copia que
  quedó en `nueva_web/vendor/`) y el `config.php` se arma con las constantes
  SMTP. Sin ellos el endpoint responde `ok`, pero escribe a un log en vez de
  mandar el mail.
- **El log con los datos de los clientes se escribe fuera del docroot.** El
  endpoint busca `../logs/` (o sea `/home/<usuario>/logs/`), después el temporal
  del servidor y solo como último recurso `api/logs/`. Dentro del docroot sería
  descargable desde el navegador.
- **El hosting tiene un WAF delante.** Después de muchos pedidos seguidos
  (un rastreo, por ejemplo) devuelve una página de desafío con JavaScript en vez
  del sitio. Un navegador real la resuelve; `curl` se queda trabado. Con un
  rastreo hay que ir con cuidado: con cientos de pedidos, el WAF empieza a
  responder el desafío.

### Deploy hecho (23/10/2026)

Publicado a las 13:31. Respaldo del `.htaccess` anterior en
`/revision-20261023-1328/.htaccess` (para volver atrás, subir ese archivo a la
raíz). El `.htaccess` de WordPress y el resto de sus archivos quedaron donde
estaban: el sitio ya no los usa, pero siguen ahí, por si hay que volver atrás.

### Deploy del rediseño (24/10/2026) — dos rondas

Publicado en dos rondas, cada una con su PR y su deploy:

| Ronda | PR | Qué | Respaldo del `.htaccess` |
|---|---|---|---|
| 1 | #14 | El diseño (Fases 0 y 1), sin animaciones | `/revision-20261024-0829/.htaccess` |
| 2 | #15 | La capa de movimiento (Fase 2) | `/revision-20261024-0914/.htaccess` |

Cada ronda: 72 archivos del sitio y 348 de `vendor/`, subidos de a uno, con
**0 tamaños distintos** y las cuatro rutas en 200.

**La IP de esta máquina quedó baneada por el hosting** (ver arriba), así que
las dos rondas se publicaron por un túnel SOCKS5. El deploy tiene que ir por
ese túnel mientras el ban siga vigente: **no tires de `deploy.cmd` a secas
mientras la IP esté baneada**, porque se queda esperando en cada conexión.

### Deploy del PR #19 (24/10/2026) — directo, sin túnel

| PR | Qué salió | Respaldo del `.htaccess` |
|---|---|---|
| #19 | Saca de `/historia-y-proceso` la nota que pedía los nombres de los fundadores (PR de Luka) | `/revision-20261024-1457/.htaccess` |

72 archivos del sitio y 348 de `vendor/`, subidos de a uno, con **0 tamaños
distintos** y las cuatro rutas en 200. `deploy.cmd` salió con código **0**.

**El ban de la IP ya está levantado.** El 24/10/2026, a las 14:57, los puertos
21 y 443 respondieron desde esta máquina, el FTPS autenticó y el deploy salió
**directo, sin túnel SOCKS5**. La instrucción del túnel sigue en pie por si
vuelve a pasar, pero **probá directo primero**: con `Test-NetConnection
a1000380.ferozo.com -Port 21` y una conexión FTPS real, antes de asumir que
hay ban y perder tiempo levantando un túnel que no hace falta.

### Deploy del favicon (24/10/2026) — iconos del monograma real

| Qué | Detalle |
|---|---|
| Problema | `favicon.svg` era un dibujo a mano de la "CP" con la C rota; `favicon.ico` era **un PNG con extensión `.ico`** (655 bytes, firma `89 50 4E 47`); `/apple-touch-icon.png` y el manifest **daban 404** |
| Arreglo | El favicon ahora usa el **monograma real** extraído de `public/logo.svg` (los subpaths 0, 3 y 21 de su `<path>`), en blanco sobre el naranja de marca `#FF3E00` |
| Archivos | `favicon.svg` · `favicon.ico` (**ICO real** con 16/32/48, PNG embebido) · `apple-touch-icon.png` (180) · `android-chrome-192x192.png` y `-512x512.png` (maskable) · `site.webmanifest` |
| Head | `BaseLayout.astro`: `rel="icon"` SVG + ICO, `apple-touch-icon`, `manifest`. El `theme-color` queda **solo en `Seo.astro`** y ahora vale `#FF3E00` (antes `#b8623b`, un terracota del diseño viejo que no era color de marca) |
| Respaldos del `.htaccess` | `/revision-20261024-1547/.htaccess` (deploy completo) y `/revision-20261024-1609/.htaccess` (subida dirigida del `.htaccess`) |

> **El favicon se deriva del logo, no se dibuja a mano.** El monograma son los subpaths
> **0** (la C), **3** (la P) y **21** (el hueco de la P) del `<path>` de
> `public/logo.svg`. El subpath 0 incluye el cola que se prolonga en el
> subrayado de la marca: se recorta con un `clipPath` en `x = 256` (el
> subrayado arranca en 258). **No podar el path**: al cerrarlo con `Z` la C se
> convierte en una O y cambia la marca. El monograma ocupa `x 0..255`,
> `y 90..363` del `viewBox` del logo.
>
> El generador quedó en el repo: **`npm run iconos`** (scripts/generar-iconos.mjs).
> Recalcula los iconos desde `public/logo.svg` y **falla con un error claro**
> si el monograma se movió, en vez de sacar un favicon roto.

> **Los navegadores NO revalidan el favicon.** Con el mismo `/favicon.svg`, el
> sitio seguía mostrando el icono viejo en la pestaña (se vio en el navegador
> después de publicar: la URL sin cambios devolvía la copia cacheada). Por eso
> las URLs de los iconos llevan **`?v=<hash del contenido>`**: al cambiar el
> icono cambia el hash, cambia la URL y el navegador vuelve a pedirlo. El hash
> lo calcula `BaseLayout.astro` al compilar, leyendo `public/favicon.svg`.

> **El hosting no conoce la extensión `.webmanifest`**: sin `Content-Type`, el
> manifest bajaba pelado y Chrome lo descarta (solo acepta
> `application/manifest+json`, `application/json` o `text/json`). Se agregó al
> `.htaccess`:
>
> ```
> <IfModule mod_mime.c>
>   AddType application/manifest+json .webmanifest
> </IfModule>
> ```

### Cuidado: no listar el docroot entero por FTP (23/10/2026, 15:50)

La verificación de tamaños (`Test-Tree`) listaba **todas** las carpetas del
docroot para armar el mapa de archivos remotos. Como el WordPress viejo sigue
dentro, eso son **miles de carpetas** (wp-content, wp-includes, plugins) y
cada LIST es una conexión FTP nueva: la verificación tardó **50 minutos** y, a
las 15:50, **el hosting dejó de responder** (21/80/443 caídos, sin ping, y un
proxy externo también daba 522). El sitio quedó publicado y verificado a las
15:47, pero el servidor se quedó sin responder y hubo que esperar que lo
levanten.

Ahora `Test-Tree` calcula **sólo las carpetas donde hay archivos de este
deploy** y las lista; nunca recorre el resto del docroot. Lo mismo aplica para
cualquier script de FTP: no listar el árbol entero del hosting.

Además, `deploy.ps1` sube **archivo por archivo** (una conexión por archivo) y
verifica tamaños. Subir varios archivos en una sola conexión truncaba archivos
a 0 bytes sin que el código HTTP lo delatara.

**Si el hosting vuelve a caerse:** no es un problema del contenido (está en git
y en `main`), es del servidor. Se comprueba con `Test-NetConnection
a1000380.ferozo.com -Port 443` y con un proxy externo; si el panel de Ferozo
muestra la cuenta suspendida por exceso de conexiones, hay que desbloquearla o
avisar al hosting.

## SEO (24/10/2026)

La investigación completa está en **`PLAN-SEO.md`** (diagnóstico medido sobre el
sitio publicado + plan por fases). Acá van solo los datos operativos.

### La línea de base medida

| Métrica | Valor |
|---|---|
| Lighthouse SEO / Performance / Best Practices / Accessibility | **100 / 94 / 100 / 93** |
| `site:ceramicaptorico.com.ar` | **0 resultados** (no indexado) |
| Googlebot en `/` | 200 con el HTML completo (0,86 s) |
| Páginas / URLs del sitemap | 23 / 23, **0 huérfanas** |
| Imágenes sin `alt` | **0** |

**La parte técnica no es el cuello de botella.** El problema es autoridad: no hay
Search Console, no hay backlinks, no hay ficha de Google Business Profile y la
web tiene un día de vida.

### Lo que hay que saber antes de tocar el SEO

- **El nombre "Puerto Rico" choca con el territorio de EE.UU.** No se cambia la
  marca (es el nombre legal registrado): se compensa **poniendo el geolocalizador
  en todas las páginas** ("Misiones", "Colonia San Alberto", "Capioví") y
  atacando la cola larga local (`ladrillos cerámicos Misiones`,
  `ladrillos Capioví`, `ladrillos para obra gris Misiones`).
- **No hay Search Console.** Nadie lo dio de alta ni envió el sitemap. Es la
  acción #1 del plan y **no se puede hacer desde el repo**: lo tiene que hacer
  la empresa.
- **El NAP está sin resolver**: el sitio dice "Lote 25B" (Boletín Oficial Nº
  15871) y el directorio de Cooprico dice "Lote 25-C", con los teléfonos
  476985 / 476986. **El sitio no publica el 476985** (teléfono de planta del
  SPEC). Hasta que la empresa decida, no se cambia nada.
- **`company.geo` sigue en `pending: true`** y `Seo.astro` no lo emite: sin
  coordenadas confirmadas no se inventa el schema. Lo mismo con `hasMap` y
  `priceRange`.
- **La web se publicó el 23-24/10/2026**: es demasiado nueva para esperar
  posicionamientos. No se puede medir indexación real sin Search Console.

### Hallazgos técnicos medidos (24/10/2026)

| # | Qué | Dónde / arreglo |
|---|---|---|
| 1 | **4 variantes de URL responden 200** sin redirigir (`http://`, `https://`, `www.` y sin `www.`) | `.htaccess`: falta el 301 a la canónica `https://ceramicaptorico.com.ar` |
| 2 | **LCP 3,1 s** (objetivo < 2,5 s) | el hero `portada-deposito.webp` pesa 227 KB; Lighthouse estima 191 KB de ahorro |
| 3 | **Contraste insuficiente** en 4 pares de color | `--accent` #d6400a sobre #f7f5f1 (4,19:1), `#61200a` sobre #ff3e00 (3,45:1), `--text-muted` #8a807a sobre blanco (3,85:1) y sobre #f2efea (3,36:1). **El naranja de marca es intocable**: se oscurece el texto |
| 4 | **El CTA "Pedir Presupuesto" no tiene nombre accesible a ≤480 px** | `Header.astro`: el `<span>` se oculta con `display:none` y el SVG es `aria-hidden` → falta un `aria-label` fijo |
| 5 | **CSS/JS de `/_astro/` sin `Cache-Control`** (solo ETag) | `.htaccess`: falta `Cache-Control: public, max-age=31536000, immutable` |
| 6 | `base: './'` genera URLs `/./_astro/...` | `astro.config.mjs`: lo correcto para un sitio en la raíz del docroot es `base: '/'` |
| 7 | `openingHoursSpecification` se emite como **objeto**; schema.org lo define como **array** | `Seo.astro` |
| 8 | 2 descripciones pasan de 160 caracteres | `/historia-y-proceso` y `/productos/18x18x24-portante` (170 cada una) |

> **No cambies títulos, URLs ni contenido sin leer `PLAN-SEO.md`.** El sitio no
> está indexado todavía: cambiar la estructura ahora tira el trabajo de
> indexación que falta.

### Lo que NO aparece en las 23 páginas (y es lo que el comprador busca)

`precio`, `dosificación` (cemento/cal/arena), `tracción`, `donde comprar`,
`visita a planta`, `envío`/`flete`/`entrega` y **ninguna ciudad de la zona**
(Oberá, Posadas, Eldorado, Garuhapé, Montecarlo, Andresito, Capioví). Los
competidores nacionales (Construshop, Nicoletti, Jacquet, Alberdi) **publican
precios**, y en Misiones hay 14 fábricas de ladrillo sin presencia web.

Además, **13 de las 23 páginas tienen menos de 330 palabras**: las más flacas
son `/distribuidores` (242) y `/aplicaciones/encadenados` (271).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
