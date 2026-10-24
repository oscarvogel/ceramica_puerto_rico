// Optimiza las imagenes pesadas del sitio. Ejecutar con:  npm run imagenes
//
// Que hace:
//   1. Recomprime los WebP que pesan mas de un umbral, sin cambiar sus
//      dimensiones: es la foto de una planta, no un grafico, asi que a
//      calidad 76 no se ve la diferencia y el archivo baja a la mitad.
//   2. Le genera al HERO (la imagen de LCP de la home) variantes responsive
//      en 480 / 720 / 960 px, en WebP y en AVIF, para que el celular no se
//      baje la foto de 960 px.
//
// Por que el hero necesita variantes: pesaba 227 KB y es el elemento de LCP.
// Con un <picture> y un srcset, un celular de 380 px de ancho se baja la
// version de 480 px (44 KB en WebP, 34 KB en AVIF) en vez de la de 960.
//
// Es idempotente: guarda un manifiesto con el hash de cada archivo ORIGINAL
// y de cada SALIDA. Si el archivo ya esta procesado (su hash coincide con la
// salida registrada) no lo vuelve a tocar, para no ir degradando la imagen
// recodificandola una y otra vez.
//
// Si se cambia una foto, se corre de nuevo: el hash del archivo ya no
// coincide con la salida registrada, asi que se toma como original nuevo.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const repo = process.cwd();
const sharp = createRequire(path.join(repo, 'package.json'))('sharp');

const PUB = path.join(repo, 'public');
const MANIFEST = path.join(repo, 'scripts', 'imagenes-manifest.json');

// --- que se recomprime (todo lo que pase el umbral) ---
const UMBRAL_BYTES = 90 * 1024;
const CALIDAD_FOTOS = 76;

// --- el hero: ademas de recomprimirse, genera variantes responsive ---
// Solo WebP: el hosting sirve image/webp bien, pero no conoce .avif. Un
// <source type="image/avif"> sin Content-Type de imagen deja al navegador
// con la foto rota, porque no vuelve al <source> siguiente.
const HERO = {
  origen: 'public/images/hero/portada-deposito.webp',
  anchos: [480, 720, 960],
  calidadWebp: 74,
};

const hash = (buf) => createHash('sha256').update(buf).digest('hex');
const rel = (p) => path.relative(repo, p).split(path.sep).join('/');

function cargarManifiesto() {
  if (!fs.existsSync(MANIFEST)) return {};
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

const manifiesto = cargarManifiesto();
const registro = {};

// --- listado de candidatos ---
const candidatos = [];
function recorrer(dir) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entrada.name);
    if (entrada.isDirectory()) recorrer(p);
    else if (entrada.name.endsWith('.webp')) candidatos.push(p);
  }
}
recorrer(path.join(PUB, 'images'));

// --- 1. recompresion de los WebP pesados ---
let bytesAntes = 0;
let bytesDespues = 0;
let tocados = 0;

for (const archivo of candidatos) {
  const stat = fs.statSync(archivo);
  if (stat.size < UMBRAL_BYTES) continue;

  const actual = fs.readFileSync(archivo);
  const actualHash = hash(actual);
  const previo = manifiesto[rel(archivo)];

  // Ya estaba procesado y nadie lo toco: no se vuelve a codificar.
  if (previo && previo.salida === actualHash) {
    registro[rel(archivo)] = previo;
    continue;
  }

  const salida = await sharp(actual)
    .webp({ quality: CALIDAD_FOTOS, effort: 6, smartSubsample: true })
    .toBuffer();

  if (salida.length >= actual.length) {
    // No se gana nada: mejor no tocar el archivo.
    registro[rel(archivo)] = { original: actualHash, salida: actualHash };
    continue;
  }

  fs.writeFileSync(archivo, salida);
  bytesAntes += actual.length;
  bytesDespues += salida.length;
  tocados++;
  registro[rel(archivo)] = { original: actualHash, salida: hash(salida) };
  console.log(
    '  ' + rel(archivo) +
    '  ' + Math.round(actual.length / 1024) + ' KB -> ' + Math.round(salida.length / 1024) + ' KB'
  );
}

// --- 2. variantes responsive del hero ---
const heroPath = path.join(repo, HERO.origen);
const heroBuf = fs.readFileSync(heroPath);
const heroHash = hash(heroBuf);
const heroPrevio = manifiesto[rel(heroPath)];

const variantes = [];
const faltaAlgunaVariante = HERO.anchos.some((ancho) => {
  const base = path.join(PUB, 'images', 'hero', 'portada-deposito-' + ancho);
  return !fs.existsSync(base + '.webp');
});
if (!heroPrevio || heroPrevio.salida !== heroHash || faltaAlgunaVariante) {
  // El hero recien recomprimido (arriba) o sin procesar: se toma como original.
  for (const ancho of HERO.anchos) {
    const base = path.join(PUB, 'images', 'hero', 'portada-deposito-' + ancho);
    const webp = await sharp(heroBuf)
      .resize({ width: ancho })
      .webp({ quality: HERO.calidadWebp, effort: 6, smartSubsample: true })
      .toBuffer();
    fs.writeFileSync(base + '.webp', webp);
    variantes.push({ ancho, webp: webp.length });
    console.log(
      '  ' + rel(base) + '.webp  ' + ancho + 'px  ->  ' +
      Math.round(webp.length / 1024) + ' KB'
    );
  }
}

// --- manifiesto ---
fs.writeFileSync(MANIFEST, JSON.stringify(registro, null, 2) + '\n');

console.log('');
console.log('Fotos recomprimidas: ' + tocados + '  (' +
  Math.round(bytesAntes / 1024) + ' KB -> ' + Math.round(bytesDespues / 1024) + ' KB)');
if (variantes.length) {
  console.log('Variantes del hero: ' + variantes.length + ' anchos en WebP');
}
console.log('Manifiesto: ' + rel(MANIFEST));
