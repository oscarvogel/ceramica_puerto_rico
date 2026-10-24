# PLAN-SEO — Cerámica Puerto Rico

**Investigación del 24/10/2026.** Objetivo: que el sitio se ubique en Google para
las búsquedas de un comprador de ladrillos en Misiones / NEA.

Todo lo de acá está medido sobre el sitio **publicado**
(`https://ceramicaptorico.com.ar`), no sobre el código.

---

## 1. Diagnóstico en una línea

**La parte técnica está bien hecha (Lighthouse SEO 100 / 100). El problema no es
el sitio: es que la web tiene un día de vida, no tiene autoridad, no tiene ficha
de Google Maps y su nombre choca con el de Puerto Rico (EE.UU.).**

> **Contexto que hay que tener presente antes de leer la tabla:** la versión
> actual del sitio se publicó el 23-24/10/2026. Un dominio sin backlinks
> necesita **semanas a meses** para ser indexado y **meses** para posicionar.
> Ninguna corrección de código cambia ese plazo. Lo que sí cambia el plazo es
> la autoridad y el trabajo de campo (ficha de negocio, enlaces, contenido).

---

## 2. Lo que YA está bien (no hay que tocarlo)

| Área | Estado |
|---|---|
| Lighthouse SEO | **100/100** |
| Lighthouse Performance | **94/100** |
| Lighthouse Best Practices | **100/100** |
| Lighthouse Accessibility | **93/100** |
| `<title>` | 23/23 páginas, entre 32 y 61 caracteres |
| `meta description` | 23/23 páginas, entre 75 y 170 caracteres |
| `canonical` | 23/23 páginas, absoluto y correcto |
| `robots` | `index,follow` en todas |
| OpenGraph / Twitter Card | en todas, `og:title` coincide con el `<title>` |
| H1 | exactamente 1 por página, en las 23 |
| `alt` de imágenes | **0 imágenes sin alt** en todo el sitio |
| Páginas huérfanas | **0**. Todo está enlazado internamente |
| JSON-LD | Organization + LocalBusiness + WebSite + BreadcrumbList en las 23; FAQPage en la de preguntas; Product en las 9 de producto |
| `sitemap.xml` | 23 URLs con prioridades y `changefreq`, sin `/404` ni `/api/` |
| `robots.txt` | correcto, apunta al sitemap |
| Compresión | gzip activo (HTML de 61 KB → 11,7 KB) |
| Fuentes | auto-hospedadas, precargadas, **cero requests a terceros** |
| JavaScript | 8 scripts **inline**, 0 externos, TBT = 0 ms |
| Videos | `preload="none"` + poster: los 9 MB de MP4 no se descargan hasta que se reproduce |
| Crawling | Googlebot recibe **200** con el HTML completo (0,86 s) |

**La base técnica no es el cuello de botella.** No hay que rehacerla.

---

## 3. Los tres bloqueos, por impacto

### BLOQUEO 1 — El sitio no está indexado (es lo único que de verdad frena)

**Medido:** `site:ceramicaptorico.com.ar` → **0 resultados**. La web tampoco
aparece buscando el nombre de la marca ("Cerámica Puerto Rico ladrillos
cerámicos Misiones"): en su lugar Google devuelve el padrón de empresas de
`indicadores.ar`, el Boletín Oficial de Misiones y páginas de Puerto Rico
(EE.UU.).

Lo que NO es el problema:
- ❌ No es un bloqueo de rastreo (Googlebot entra perfecto).
- ❌ No es el `robots.txt`.
- ❌ No es el sitemap (está bien formado y referenciado).
- ❌ No es el canonical.

Lo que SÍ es el problema:
- **No hay Search Console**: nadie dejó el dominio en
  `search.google.com/search-console` ni envió el sitemap. Sin eso, Google no
  tiene ninguna vía para enterarse.
- **No hay ningún backlink** que lo enlace. Un sitio nuevo sin un solo enlace
  entrante tarda mucho en ser rastreado y mucho más en posicionar.
- **El dominio antes servía un WordPress de "página en construcción"**: hay
  archivos de WordPress viejos en el docroot, y el historial del dominio es de
  un sitio que no decía nada. Google no tiene razón para confiar en él.

**Acción (la más urgente de todas):**
1. Crear la propiedad en **Google Search Console** (dominio `ceramicaptorico.com.ar`).
2. Verificar por DNS (o por archivo HTML en el hosting).
3. **Enviar el sitemap** desde Search Console.
4. Dar de alta el dominio en **Google Analytics 4** y **Bing Webmaster Tools**
   (los dos se conectan con Search Console y aceleran el descubrimiento).
5. Registrar en el hosting el `IndexNow` (protocolo de indexación instantánea).

### BLOQUEO 2 — El nombre "Puerto Rico" compite con el territorio de EE.UU.

Esta es la limitación estructural y hay que convivir con ella, no ignorarla.

**Medido:** "cerámica puerto rico" trae resultados de **Puerto Rico (EE.UU.)**:
azulejos, turismo, cerámicas de San Juan. La web quedó tapada.

Peor: la web tampoco aparece en el **Google Business Profile** de Puerto Rico
(EE.UU.) ni en directorios de ceramicistas de la isla.

**Los cinco concurrentes locales reales** (de los 14 del padrón de
`indicadores.ar` con actividad "Fabricación de ladrillos" en Misiones):

| Empresa | Ciudad |
|---|---|
| Cerámica Graef S.R.L. | Puerto Rico |
| Cerámicas Istueta S.R.L. | Eldorado |
| LING SRL | Eldorado |
| Ladrillos del Norte SRL | Montecarlo |
| Cerámica Garuhapé | Garuhapé |

Ninguno tiene presencia web fuerte. **La oportunidad es real.**

**Cómo se compensa el choque de nombre:**
- Mantener la marca (es el nombre legal registrado: *Cerámica Puerto Rico SRL*).
- **Agregar el geolocalizador SIEMPRE**: "Puerto Rico, Misiones",
  "Colonia San Alberto, Misiones", "Capioví, Misiones".
- **Apuntar a la cola larga local**, donde no compite nadie:
  `ladrillos cerámicos Misiones`, `ladrillos Puerto Rico Misiones`,
  `fábrica de ladrillos Misiones`, `ladrillos Capioví`,
  `ladrillos cerámicos Oberá`, `ladrillos para obra gris Misiones`,
  `precio ladrillo cerámico Misiones`.
- En el título de la home, hoy "Cerámica Puerto Rico | Ladrillos Cerámicos en
  Misiones", el geolocalizador ya está: **bien hecho, hay que replicarlo** en
  las páginas de producto, que hoy dicen "12x18x24 Liviano | Cerámica Puerto Rico"
  sin ubicación.

### BLOQUEO 3 — No hay ninguna señal local

Para una fábrica, esto es lo que más pesa después de la indexación.

| Falta | Impacto |
|---|---|
| **Ficha de Google Business Profile** | No se encontró ninguna. Es la vía para el "Local Pack" (el bloque con 3 negocios) y para Google Maps. **Para un negocio local es la palanca #1.** |
| **`geo` en el JSON-LD** | `company.geo` está en `pending: true` y **no se emite**. Sin coordenadas no hay señal de ubicación. |
| **`hasMap`** | No está en el schema. Con `geo` + `hasMap` se puede pedir el Knowledge Panel. |
| **`priceRange`** | No está. Es un campo recomendado de `LocalBusiness`. |
| **`aggregateRating`** | No está (habría que juntar reseñas reales, no inventarlas). |
| **`openingHoursSpecification`** | Se emite como **objeto**, cuando schema.org lo define como **array**. Google lo tolera, pero conviene corregirlo. |
| **`logo` de Organization** | Apunta a `/logo.svg`. Google pide un logo **raster** para el Knowledge Panel: conviene apuntar a un PNG 512×512. |
| **NAP consistente** | El sitio dice "Lote **25B**" y el Boletín Oficial (Nº 15871, 2023) dice "Lote 25 *'B'* Sección Primera, Colonia San Alberto". Pero el **directorio telefónico de Cooprico** lo lista como "Lote **25-C** Secc 1ra S/N" con los teléfonos 476985 / 476986. Y el sitio **no publica el 476985**, que era el teléfono de planta del SPEC. Ojo: el teléfono y la dirección tienen que ser **idénticos** en el sitio, en Google Maps, en Instagram, en Facebook y en los directorios. |

**Links authoritative que ya existen y se están desperdiciando:**
- **Boletín Oficial de Misiones Nº 15871** (12/05/2023): menciona a la empresa,
  su CUIT, su domicilio y la habilitación del yacimiento de arcilla en Capioví.
  Es un documento oficial: **enlazable y citable**.
- **Scielo — agroindustrias familiares en Misiones** (2013): "En la planta de
  Puerto Rico... trabajaban entre cuarenta y cincuenta empleados". Artículo
  académico que describe la planta: **enlazable**.
- **Directorio de Cooprico**: ficha con dirección y teléfonos: **enlazable y
  corregible** (NAP).
- **CICER (Cámara Industrial de Cerámica Roja)**: la asociación que agrupa a
  los fabricantes de ladrillos huecos de la Argentina, con fichas técnicas
  (hay PDF de manual de colocación) y una **página de socios con enlaces**. La
  lista tiene ~10 socios (Cerro Negro, Ctibor, Cunmalleu, Cerámica del Norte,
  Fanelli, Rosario, Spegazzini, Later-Cer, Palmar, Terrabrick).
  **Cerámica Puerto Rico NO está en la lista.** Ser socio es el backlink más
  valiosa y más fácil de este plan: un enlace desde `ceramicaroja.com.ar`, que
  Google ya indexa, más credibilidad sectorial y acceso a las fichas técnicas
  que le faltan al `/recursos-tecnicos`.
- **Instagram `@ceramicapuertoricosrl`**: activo (633 seguidores, 16
  publicaciones) pero **no enlaza a la web** en la bio, y el sitio tampoco
  aporta señal de vuelta. Enlazar ambos lados es trabajo de 5 minutos.

---

## 4. Hallazgos técnicos menores (impacto bajo, arreglo rápido)

| # | Hallazgo | Medido | Arreglo |
|---|---|---|---|
| 1 | **4 variantes de URL responden 200** sin redirigir: `http://`, `https://`, `www.` y sin `www.` | 4 × 200 | 301 de las 3 variantes a la canónica. Hoy es contenido duplicado para Google y además `http://` sin HTTPS. |
| 2 | **LCP 3,1 s** (debería ser < 2,5 s) | Lighthouse | La imagen hero `portada-deposito.webp` pesa 227 KB. Lighthouse estima **191 KB de ahorro** optimizando la entrega de imagen. |
| 3 | **Contraste insuficiente** en 4 pares de color | `--accent` #d6400a sobre #f7f5f1 da 4,19:1 (necesita 4,5); `#61200a` sobre #ff3e00 da 3,45:1; `#8a807a` sobre blanco da 3,85:1 | Oscurecer esos tokens. Ojo: **el naranja de marca es intocable**, se ajusta el texto. |
| 4 | **El botón "Pedir Presupuesto" no tiene nombre accesible en móvil** | Lighthouse `link-name` | A ≤480 px el `<span>` se oculta con `display: none` y el SVG es `aria-hidden`: el enlace queda sin nombre. Agregar `aria-label` fijo. |
| 5 | **CSS y JS sin `Cache-Control`** (solo ETag) | Lighthouse: 37 KB de ahorro | `Cache-Control: public, max-age=31536000, immutable` para `/_astro/`. |
| 6 | `base: './'` genera URLs `/./_astro/...` | HTML compilado | Funcionan (el navegador normaliza), pero `base: '/'` es lo correcto para un sitio en la raíz del docroot. |
| 7 | 2 descripciones pasan de 160 caracteres | `/historia-y-proceso` (170) y `/productos/18x18x24-portante` (170) | Recortarlas: Google las recorta igual. |
| 8 | Videos en MP4 solamente (9 MB en total) | `/historia-y-proceso` | El plan ya lo tenía pendiente (3.3): agregar WebM. **Ojo: los videos no son un problema de SEO hoy** (van con `preload="none"`), es trabajo de performance para el usuario. |

---

## 5. El contenido que falta (lo que el comprador busca y el sitio no tiene)

Análisis de 60+ términos sobre las 23 páginas compiladas.

**Aparecen bien:** `ladrillos` (125), `Misiones` (85), `planta` (61),
`presupuesto` (52), `cotizar` (38), `resistencia` (33), `NEA` (21),
`WhatsApp` (19), `colocación` (14), `rendimiento` (13).

**NO aparecen nunca** — y son exactamente lo que se busca para decidir una
compra:

| Término ausente | Por qué importa |
|---|---|
| **precio / precios** | Solo hay 3 apariciones de "precio" en 1 página. Los competidores (Construshop, Nicoletti, Jacquet, Alberdi) **publican precios con $**. Es la diferencia de búsquedas más grande que se ve en la competencia. |
| **dosificación** (cemento, cal, arena) | 0 apariciones. Es LA pregunta de un maestro mayorista. |
| **tracción** | 0. La carga por pallet es la duda número uno de un constructor. |
| **donde comprar / comprar** | Solo 3 apariciones. |
| **visita a planta** | 0. Para un industrial, visitar la fábrica es un paso previo a la compra. |
| **envío / flete / entrega** | 0. "¿Entregan en Oberá?" es una pregunta literal. |
| **Oberá, Posadas, Eldorado, Garuhapé, Montecarlo, Andresito** | 0. **Ninguna ciudad de la zona.** Es el oro del SEO local: "ladrillos cerámicos Oberá" no tiene competencia local. |
| **Capioví** | 0. Es el municipio del yacimiento de arcilla (habilitado a nombre de la empresa en el Boletín Oficial). |
| **piso, viga, columna, tabique, techo, losa** | Casi todos 0, siendo que **la línea de productos tiene justo eso** (vistos, portantes, peine, encadenados). |
| **tabique** | 0, y es una de las 6 páginas de "Aplicaciones". |

**Además, 13 de las 23 páginas tienen menos de 330 palabras.** Las más flacas:

| Página | Palabras |
|---|---|
| `/distribuidores` | 242 |
| `/aplicaciones/encadenados` | 271 |
| `/aplicaciones/viviendas` | 304 |
| `/aplicaciones/edificios` | 319 |
| `/aplicaciones` | 319 |
| `/aplicaciones/muros-portantes` | 325 |
| `/recursos-tecnicos` | 329 |

Para una consulta comercial, 250-320 palabras no alcanzan para posicionar
contra un competidor con catálogo. **Cada página de aplicación debería tener
una ficha técnica de verdad** (dónde se usa, qué medida, cuántas unidades por
m², cómo se coloca, cuándo no usarlo) y no un párrafo con un listado de
productos.

---

## 6. Plan de acción

### Fase 0 — Esta semana (desbloquea todo lo demás)

| # | Acción | Quién | Por qué |
|---|---|---|---|
| 0.1 | **Google Search Console**: verificar el dominio y enviar el sitemap | Web / empresa | Sin esto, Google no se entera. Es la acción #1. |
| 0.2 | **Crear la ficha de Google Business Profile** (nombre, dirección, teléfono de planta, horarios, categoría "Fábrica de ladrillos"/"Materiales de construcción", fotos de la planta, WhatsApp) | Empresa | La palanca local #1. El `476985` es el teléfono de planta que figura en el directorio de Cooprico. |
| 0.3 | **301** de `http://`, `www.` y `https://www.` a la canónica | Web | Contenido duplicado. |
| 0.4 | **Arreglar el `link-name` del botón** y los **4 contrastes** | Web | Son fallos reales y hoy. |
| 0.5 | **Optimizar la imagen hero** (LCP) | Web | LCP de 3,1 s → objetivo < 2,5 s. |
| 0.6 | **Cache-Control en `/_astro/`** | Web | 37 KB por visita. |
| 0.7 | **Verificar el NAP**: dirección (25B o 25C) y teléfono de planta | Empresa | Decidirlo con la empresa y dejarlo igual en todos lados. |

### Fase 1 — Primer mes (autoridad y contenido)

| # | Acción | Por qué |
|---|---|---|
| 1.1 | **Pedir la ficha de socio en CICER** | Un enlace desde el dominio de la cámara del sector + acceso a las fichas técnicas que le faltan a `/recursos-tecnicos`. |
| 1.2 | **Pedir la ficha en el Boletín Oficial** (enlace al permiso de extracción) | Documento oficial que ya los nombra. |
| 1.3 | **Enlazar Instagram ↔ sitio** (bio con el link + link desde el footer) | 633 seguidores sin canal al sitio. |
| 1.4 | **Enlazar el artículo de Scielo** desde `/historia-y-proceso` | Cita académica de la propia planta. |
| 1.5 | **Reescribir `/distribuidores`** (242 palabras → 600+) con la lista real de corralones, zonas de entrega y ciudades | Es la página de intención comercial más alta del sitio. |
| 1.6 | **Reescribir las 6 páginas de "Aplicaciones"** con ficha técnica real por uso | Hoy son 271-353 palabras cada una. |
| 1.7 | **Título con geolocalizador en las páginas de producto** | "12x18x24 Liviano en Misiones \| Cerámica Puerto Rico" |
| 1.8 | **Publicar el catálogo con precios** (o una banda de precios) | Los competidores los publican. Es lo que más falta en la competencia local. |

### Fase 2 — Segundo y tercer mes (contenido y autoridad)

| # | Acción | Por qué |
|---|---|---|
| 2.1 | **Página de "Cómo comprar / dosificación"**: dosificación de cemento/cal/arena, rendimiento por m², tracción, palletizado | Cubre lo que hoy no existe y es la duda del comprador. |
| 2.2 | **Página de "Zonas de entrega"**: Oberá, Posadas, Eldorado, Garuhapé, Montecarlo, Andresito, Capioví, San Ignacio, Jardín América, Monte Quemado | Cada ciudad es una búsqueda propia y hoy no hay ninguna. |
| 2.3 | **Google Business Profile vivo**: fotos, publicaciones y **pedir reseñas** a clientes | Las reseñas son el factor local #1 y `aggregateRating` va al schema. |
| 2.4 | **Blog técnico**: 6-8 artículos al año ("cómo se coloca un ladrillo portante", "diferencia entre visto y hueco", "cuánto ladrillo lleva un muro") | Contenido evergreen para búsquedas informativas y de cola larga. |
| 2.5 | **Conseguir enlaces**: proveedores de maquinaria, corralones clientes, cámaras, municipalidades, el artículo de Scielo | autoridad de dominio. |
| 2.6 | **`llms.txt`** | Ya estaba en el plan de mejora (3.7). Señal nueva y barata. |

### Fase 3 — Continuo

- Medir en Search Console: impresiones, clics, consultas, CTR y posición por
  consulta. Empezar por las consultas de marca y después las geográficas.
- Revisar el `cache-insight` y el peso de página en cada deploy.
- Pedir reseñas nuevas de forma periódica.

---

## 7. Cómo medir el avance

| KPI | Dónde | Meta a 90 días |
|---|---|---|
| URLs indexadas | Search Console | 23/23 |
| Impresiones | Search Console | > 0 (hoy 0) |
| Consultas de marca | Search Console | que aparezca "cerámica puerto rico" con la web |
| Posición media en "ladrillos cerámicos Misiones" | Search Console | top 10 |
| Reseñas de Google | Google Business Profile | ≥ 10 |
| Backlinks de referencia | Search Console | ≥ 3 (CICER + oficial + académico) |
| LCP | Lighthouse / CrUX | < 2,5 s |

---

## 8. Resumen para el cliente

1. **El sitio está bien construido.** SEO técnico 100/100, sin errores, sin
   páginas huérfanas, todas las imágenes con alt, schema completo, sitemap
   correcto. No hay que rehacer nada de eso.
2. **Hoy no aparece en Google y la razón no es el código**: es que tiene un día
   de vida, nadie lo inscribió en Search Console y no tiene ni un
   enlace de entrada.
3. **El nombre es el problema de fondo**: "Puerto Rico" es el territorio de
   EE.UU. La salida no es cambiar la marca (es el nombre legal) sino **agregar
   la geografía en todas partes** y **atacar la cola larga local**, que hoy está
   vacía: en Misiones hay 14 fábricas de ladrillo y casi ninguna con web.
4. **Falta lo que un comprador local decide**: precios o banda de precios,
   dosificación, tracción, flete, zonas de entrega, ciudades. Y falta la ficha
   de Google Maps, que es la vía directa al "Local Pack".
5. **El atajo más rentable**: ser socio de **CICER**. Es un enlace desde el
   sitio de la cámara del sector (ya indexado por Google), con las fichas
   técnicas que el sitio todavía no tiene.
