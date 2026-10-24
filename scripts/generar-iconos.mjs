// Genera el paquete de iconos del sitio a partir del monograma REAL de
// public/logo.svg. Ejecutar con:  npm run iconos
//
// Que hace:
//   1. Lee el <path> de public/logo.svg y separa sus subpaths.
//   2. Toma el monograma: la C (subpath 0), la P (subpath 3) y el hueco de la
//      P (subpath 21). El resto son el techo, el subrayado y las letras.
//   3. Escribe favicon.svg (monograma blanco sobre el naranja de marca),
//      favicon.ico (ICO real con 16/32/48), apple-touch-icon.png (180),
//      android-chrome-192x192.png y -512x512.png (maskable) y
//      site.webmanifest (con las URLs de los iconos versionadas).
//
// La URL de los iconos lleva un hash del contenido: los navegadores cachean
// los favicon y no los revalidan, asi que sin cambiar la URL el sitio sigue
// mostrando el icono viejo. Al cambiar el archivo, cambia el hash y el
// navegador vuelve a pedirlo.
//
// Si cambia public/logo.svg hay que volver a correr esto: npm run iconos
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const repo = process.cwd();
const sharp = createRequire(path.join(repo, 'package.json'))('sharp');

const ORANGE = '#FF3E00';
const PUB = path.join(repo, 'public');

// --- el monograma dentro del logo ---
// Subpaths del <path> de public/logo.svg, con su bbox medido.
// Indices y bbox validados abajo: si el logo cambia, el script se queja.
const IDX_C = 0, IDX_P = 3, IDX_P_HOLE = 21;
const MONO = { x0: 0, x1: 255, y0: 90, y1: 363 };
const X_CUT = 256; // el subrayado de la marca arranca en 258: aca ya no entra

const logoSvg = fs.readFileSync(path.join(PUB, 'logo.svg'), 'utf8');
const d = logoSvg.match(/<path[^>]*\sd="([^"]+)"/s)[1];

// --- partir el path en subpaths crudos ---
const starts = [];
const re = /[Mm]/g;
let m;
while ((m = re.exec(d)) !== null) starts.push(m.index);
const subs = [];
for (let k = 0; k < starts.length; k++) {
  const end = k + 1 < starts.length ? starts[k + 1] : d.length;
  subs.push(d.slice(starts[k], end).trim());
}

// --- validar que los subpaths son los que creemos ---
function bboxOf(pathData) {
  const nums = pathData.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  const pts = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([parseFloat(nums[i]), parseFloat(nums[i + 1])]);
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}
const near = (a, b, tol = 3) => Math.abs(a - b) <= tol;
for (const [name, idx, box] of [['C', IDX_C, { x0: 0, y0: 90 }], ['P', IDX_P, { x0: 128, y0: 164 }], ['hueco P', IDX_P_HOLE, { x0: 162, y0: 189 }]]) {
  const b = bboxOf(subs[idx]);
  if (!near(b.x0, box.x0) || !near(b.y0, box.y0)) {
    throw new Error(
      'El subpath ' + name + ' (indice ' + idx + ') no esta donde se esperaba: bbox ' +
      JSON.stringify(b) + ' en vez de x0=' + box.x0 + ' y0=' + box.y0 + '. ' +
      'public/logo.svg cambio: revisar los indices del monograma en este script.'
    );
  }
}

// --- el monograma en SVG ---
const MONO_PATHS = [
  '<g clip-path="url(#recorte)" fill-rule="evenodd">',
  '<path d="' + subs[IDX_C] + '"/>',
  '<path d="' + subs[IDX_P] + '"/>',
  '<path d="' + subs[IDX_P_HOLE] + '"/>',
  '</g>',
].join('\n');

function svg(opts) {
  const size = opts.size, pad = opts.pad, rx = opts.rx;
  const bg = opts.bg || ORANGE, fg = opts.fg || '#fff';
  const mw = MONO.x1 - MONO.x0, mh = MONO.y1 - MONO.y0;
  const usable = size - pad * 2;
  const s = Math.min(usable / mw, usable / mh);
  const tx = size / 2 - ((MONO.x0 + MONO.x1) / 2) * s;
  const ty = size / 2 - ((MONO.y0 + MONO.y1) / 2) * s;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '">',
    '  <defs>',
    '    <clipPath id="recorte"><rect x="' + (MONO.x0 - 10) + '" y="' + (MONO.y0 - 10) + '" width="' + (X_CUT - MONO.x0 + 10) + '" height="' + (MONO.y1 - MONO.y0 + 20) + '"/></clipPath>',
    '  </defs>',
    '  <rect width="' + size + '" height="' + size + '" rx="' + rx + '" fill="' + bg + '"/>',
    '  <g transform="translate(' + tx.toFixed(3) + ' ' + ty.toFixed(3) + ') scale(' + s.toFixed(5) + ')" fill="' + fg + '">',
    MONO_PATHS,
    '  </g>',
    '</svg>',
    '',
  ].join('\n');
}

// ---------- favicon.svg ----------
const faviconSvg = svg({ size: 64, pad: 5, rx: 12 });
fs.writeFileSync(path.join(PUB, 'favicon.svg'), faviconSvg);

// ---------- PNGs ----------
const tab = Buffer.from(faviconSvg);
const p16 = await sharp(tab).resize(16, 16).png().toBuffer();
const p32 = await sharp(tab).resize(32, 32).png().toBuffer();
const p48 = await sharp(tab).resize(48, 48).png().toBuffer();
const p180 = await sharp(Buffer.from(svg({ size: 180, pad: 9, rx: 0 }))).resize(180, 180).png().toBuffer();
const p192 = await sharp(Buffer.from(svg({ size: 192, pad: 24, rx: 0 }))).resize(192, 192).png().toBuffer();
const p512 = await sharp(Buffer.from(svg({ size: 512, pad: 64, rx: 0 }))).resize(512, 512).png().toBuffer();

fs.writeFileSync(path.join(PUB, 'apple-touch-icon.png'), p180);
fs.writeFileSync(path.join(PUB, 'android-chrome-192x192.png'), p192);
fs.writeFileSync(path.join(PUB, 'android-chrome-512x512.png'), p512);

// ---------- favicon.ico real (PNG embebido en contenedor ICO) ----------
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;
  entries.forEach(function (e, i) {
    const o = i * 16;
    dir[o] = e.size >= 256 ? 0 : e.size;
    dir[o + 1] = e.size >= 256 ? 0 : e.size;
    dir[o + 2] = 0;
    dir[o + 3] = 0;
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(e.buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += e.buf.length;
  });
  return Buffer.concat([header, dir].concat(entries.map(function (e) { return e.buf; })));
}
fs.writeFileSync(path.join(PUB, 'favicon.ico'), buildIco([
  { size: 16, buf: p16 },
  { size: 32, buf: p32 },
  { size: 48, buf: p48 },
]));

// ---------- site.webmanifest ----------
// El hash del contenido del favicon va en la URL de los iconos: los
// navegadores cachean los favicon y no los revalidan.
const v = createHash('sha256').update(faviconSvg).digest('hex').slice(0, 8);
const manifest = {
  name: 'Cerámica Puerto Rico',
  short_name: 'CPR',
  description: 'Ladrillos cerámicos hechos en Puerto Rico, Misiones.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#FFFFFF',
  theme_color: ORANGE,
  lang: 'es-AR',
  icons: [
    { src: '/favicon.svg?v=' + v, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    { src: '/favicon.ico?v=' + v, sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
    { src: '/apple-touch-icon.png?v=' + v, sizes: '180x180', type: 'image/png' },
    { src: '/android-chrome-192x192.png?v=' + v, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: '/android-chrome-512x512.png?v=' + v, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
fs.writeFileSync(path.join(PUB, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');

console.log('Iconos regenerados desde public/logo.svg');
console.log('  favicon.svg                    ' + faviconSvg.length + ' bytes');
console.log('  favicon.ico (16/32/48)         ' + fs.statSync(path.join(PUB, 'favicon.ico')).size + ' bytes');
console.log('  apple-touch-icon.png (180)     ' + p180.length + ' bytes');
console.log('  android-chrome-192/512.png     ' + p192.length + ' / ' + p512.length + ' bytes');
console.log('  site.webmanifest               ' + fs.statSync(path.join(PUB, 'site.webmanifest')).size + ' bytes');
console.log('  version de las URLs: v=' + v);
