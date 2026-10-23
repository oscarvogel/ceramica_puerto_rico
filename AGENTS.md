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
- **Full-page screenshots come out with blank sections.** `BaseLayout.astro` adds a
  `.reveal` class and reveals it with an `IntersectionObserver`, and product images
  are `loading="lazy"`. Before capturing, force `document.querySelectorAll('.reveal')
  .forEach(el => el.classList.add('is-visible'))`, set `img[loading="lazy"]` to
  `eager`, scroll the page, and only then take the screenshot.
- **The company's correction PDF has crossed references.** In
  "correcciones página web.pdf" the link for "Vistos 10x15x24" repeats the one for
  "Livianos 12x18x24", and the two first process videos are swapped (the link under
  "Extracción y acopio" is the video titled "PROCESO DE PREPARACIÓN DE LA TIERRA").
  The Drive links in the PDF are public: `https://drive.google.com/uc?export=download&id=<ID>`.

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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
