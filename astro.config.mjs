// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
/** @typedef {import('@astrojs/sitemap').SitemapItem} SitemapItem */

const SITE_URL = 'https://ceramicaptorico.com.ar';

export default defineConfig({
  site: SITE_URL,
  // El sitio vive en la raiz del docroot (el dominio apunta al docroot, sin
  // subcarpeta). Con base: './' Astro genera rutas relativas y el HTML
  // compilado sale con URLs "/./_astro/... ": funcionan porque el navegador
  // las normaliza, pero no es la forma canónica de pedir un asset.
  // base: '/' genera "/_astro/...", que es lo que espera un buscador.
  base: '/',
  // El sitio declara sus URLs sin barra final (ver los `path` del SEO).
  // El .htaccess de producción sirve esas URLs con un 200, sin el 301 que
  // Apache hace por defecto con DirectorySlash. Si esto cambia a 'always',
  // hay que cambiar también los `path` de cada pagina y el sitemap.
  trailingSlash: 'never',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date(),
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/api/'),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '');
        let priority = 0.5;
        let changefreq = 'monthly';
        if (path === '') { priority = 1.0; changefreq = 'weekly'; }
        else if (path === '/historia-y-proceso' || path === '/productos') { priority = 0.9; changefreq = 'weekly'; }
        else if (['/aplicaciones', '/distribuidores', '/recursos-tecnicos'].includes(path)) { priority = 0.8; }
        else if (path.startsWith('/productos/')) { priority = 0.7; }
        return /** @type {SitemapItem} */ ({ ...item, priority, changefreq });
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
});
