import fs from 'node:fs';
import path from 'node:path';
import type { Product } from '../data/products';

/**
 * Resuelve la foto de un producto.
 *
 * Orden:
 *   1. product.image (ruta explicita en src/data/products.ts)
 *   2. convencion: public/images/productos/<slug>.<webp|jpg|jpeg|png|avif>
 *   3. null -> se dibuja el ladrillo en SVG
 *
 * Se evalua en build time, asi que si la foto todavia no esta, la pagina
 * no rompe: cae al dibujo.
 */

const EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png', 'avif'];

function existsInPublic(url: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', url.replace(/^\//, '')));
}

export function resolveProductImage(product: Product): string | null {
  if (product.image) {
    return existsInPublic(product.image) ? product.image : null;
  }
  for (const ext of EXTENSIONS) {
    const candidate = `/images/productos/${product.slug}.${ext}`;
    if (existsInPublic(candidate)) return candidate;
  }
  return null;
}

/** Proporcion del dibujo SVG de respaldo, para no saltar el layout */
export const FALLBACK_RATIO = {
  card: 420 / 300,
  detail: 720 / 500,
} as const;

/**
 * Formatea un peso con dos decimales y coma decimal, como lo anotó la
 * empresa: 3,10 kg · 4,54 kg · 4,00 kg.
 */
export const formatKg = (value: number) =>
  `${value.toFixed(2).replace('.', ',')} kg`;
