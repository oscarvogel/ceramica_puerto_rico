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
`ceramicaptorico.com.ar` points to the docroot root. `deploy.cmd` does the whole
thing: build, backup, upload, verify.

```
set FTP_HOST=a1000380.ferozo.com
set FTP_USER=codex@ceramicaptorico.com.ar
set FTP_PASS=...
set FTP_DIR=/
deploy.cmd
```

The credentials are **not** in the repo: they live in `.ferozo-credentials` (ignored
by git). The server is ProFTPD with `AUTH SSL` on port 21 (explicit FTPS; port 990 is
closed), so the upload needs `--ssl-reqd`.

- **The `.htaccess` is uploaded last, on purpose.** Until it is up, the server keeps
  WordPress's `.htaccess` and the site does not change. If the new one were to break
  something, the previous one is still there to fall back to.
- **`DirectorySlash Off` is what makes the URLs work.** The site declares its URLs
  without a trailing slash (`/productos/12x18x24-liviano`), and Apache's default
  `DirectorySlash` answers those with a 301 to the slashed version. `DirectorySlash
  Off` (Apache 2.4.39+) makes Apache serve the folder's `index.html` at the URL as
  asked, so the canonical, the sitemap and the internal links all match what the
  server answers with a 200. Verified on this host: `/prueba-url/productos/x` → 200.
- **`DirectoryIndex index.html`** is also needed: `index.php` from WordPress is still
  in the docroot and would otherwise win the home page.
- **The contact form needs PHPMailer and a server-side config.** `api/contact.php`
  loads `../vendor/autoload.php` and `api/config.php`, neither of which is in the
  repo. `api/config.php` is ignored by git; `vendor/` comes from the copy that was
  already on the hosting (`nueva_web/vendor/`). Without them the endpoint still
  answers `ok`, but only writes to the log instead of sending the mail.
- **The log with the clients' data is written outside the docroot.** The endpoint
  looks for `../logs/` (i.e. `/home/<user>/logs/`), then the server's temp dir, and
  only as a last resort `api/logs/`. Writing it inside the docroot would make the
  names, emails and phones downloadable from the browser.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
