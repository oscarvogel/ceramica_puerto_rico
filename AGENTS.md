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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
