// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
/** @typedef {import('@astrojs/sitemap').SitemapItem} SitemapItem */

const SITE_URL = 'https://ceramicaptorico.com.ar';

export default defineConfig({
  site: SITE_URL,
  base: './',
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
