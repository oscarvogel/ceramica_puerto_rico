# Plan de mejora del sitio — Cerámica Puerto Rico

**Sitio:** https://ceramicaptorico.com.ar
**Fecha del relevamiento:** 23/10/2026
**Alcance:** sitio institucional/comercial en Astro (HTML estático + CSS + JS mínimo), desplegado por FTPS en hosting compartido.
**Estado:** propuesta para aprobar. No hay cambios de código aplicados todavía.

---

# 1. Resumen ejecutivo

El sitio ya está **por encima del promedio del rubro**: tokens de diseño coherentes, fotos reales de la fábrica, catálogo navegable, SEO técnico con schema y sitemap, y un formulario de cotización funcionando. El problema no es que sea feo ni que falte tecnología.

El problema es que **el sitio todavía no se parece a una fábrica**: es una pila de tarjetas iguales sobre fondo crema, con un H1 que no dice qué se fabrica y sin ninguna prueba de que la empresa exista más allá del logo. Al mismo tiempo, **el 60% del material que el cliente ya entregó está sin usar** (fotos de horno, secado, taller, logística, ensayos) y **las páginas más comerciales del sitio no están enlazadas desde el menú**.

Cinco decisiones, en orden de impacto:

| # | Decisión | Por qué |
|---|---|---|
| 1 | **Reordenar la home alrededor de una ruta de decisión real**: "¿qué necesitás construir?" + catálogo + prueba de fábrica, en vez de 6 bloques de tarjetas iguales | La investigación B2B 2026 coincide: el sitio industrial es una **herramienta de verificación**, no un folleto. Hoy el sitio muestra, no demuestra |
| 2 | **Cambiar la tipografía de una sola familia (Inter) a un trío deliberado**: Archivo (display) + Inter (texto) + IBM Plex Mono (datos) | Es la señal visual más fuerte y más barata. Da aire de fabricante y hace que las medidas y los rindimientos se lean como datos de ficha técnica |
| 3 | **Usar el anthracita como color estructural, no el crema** | La paleta de marca ya está bien; lo que falta es **profundidad de superficies**. Alternar anthracita/crema/anthracita da jerarquía sin cambiar un solo color |
| 4 | **Animación leve y con propósito, en CSS nativo** (`animation-timeline`, View Transitions) — cero librerías | Las tendencias 2026 apuntan a "platform-native motion". GSAP/framer son 70–30 KB y bloquean el hilo principal. Con CSS: 0 KB, 60 fps, `prefers-reduced-motion` gratis |
| 5 | **Cerrar el círculo de conversión**: formulario que sabe de qué producto se trata + calculadora de ladrillos + medición de eventos | El sitio hoy genera consultas pero no las mide ni las califica |

**Lo que NO se va a hacer** (y por qué, ver §3.4): modo oscuro, 3D en scroll, chat de IA, cursor personalizado, glassmorphism.

---

# 2. Investigación: qué se trendió en 2026

## 2.1 Tendencias de diseño web 2026

| Tendencia | En la práctica | Veredicto para este cliente |
|---|---|---|
| **Layouts modulares / bento** | Grillas de celdas de tamaño variable en vez de tarjetas iguales | **Adoptar.** Resuelve de raíz el "muro de tarjetas" actual. Reemplaza 4 grids de tarjetas iguales por 1 grilla bento con un ancla oscura |
| **Sistemas visuales propios de marca** | Cada empresa con tokens y tipografía propias, no plantilla | **Adoptar.** Hoy la paleta es de marca pero la tipografía es genérica. Un trío tipográfico propio es el upgrade más visible |
| **Movimiento nativo de plataforma** | `animation-timeline`, View Transitions, sin librerías | **Adoptar.** Reemplaza el observer genérico actual y quita ~1 KB de JS |
| **Claridad > decoración** | "Qué hacés, a quién, por qué vos, qué hago ahora" en 5 segundos | **Adoptar.** El H1 actual ("Calidad que construye confianza") no dice qué se fabrica |
| **Tipografía expresiva + copy corto** | Titulares grandes, micro-copy escaneable | **Adoptar.** Sacar el `text-transform: uppercase` del H1: en castellano largo en mayúscula cuesta leer |
| **Profundidad y señales de eje Z** | Sombras en capas, parallax leve, superficies escalonadas | **Adoptar, con moderación.** Se logra con el anthracita como estructura, no con efectos |
| **Micro-interacciones** | Hover que responde, tarjetas que levantan, filtros animados | **Adoptar, sólo en hover/filtro.** Son las que hacen que la página se sienta viva |
| **Modo oscuro por defecto** | Dark-first en herramientas de desarrollo | **Descartar.** Es una tendencia de_density_(dev tools). Invertir una paleta de fábrica de ladrillo es un giro de marca, no una mejora |
| **Glassmorphism revisado** | Blur de 8–14 px, contraste ≥ 4.5:1 | **Descartar.** Es una estética de SaaS premium; encerra el contenido técnico en vidrio |
| **Personalización por IA / AI-first** | Hero que conversa, contenido generado por visitante | **Descartar.** Requiere backend y va en contra del brief de "sitio de fábrica verificable". No aporta a un corralón que busca precio y stock |
| **3D cinematográfico en scroll** | Escenas 3D atadas al scroll | **Descartar.** Requiere WebGL, pesa, y en un celular de gama media es el camino seguro a la caída de conversión |

**Fuentes:**
- [Web Design Trends 2026 — Draftly](https://www.draftly.space/blog/industry/web-design-trends-2026-glassmorphism-to-ai-first)
- [Landing Page Design Trends for 2026 — GetResponse](https://www.getresponse.com/blog/landing-page-design-trends)
- [Landing Page Design Trends 2026 — Landy AI](https://www.landy-ai.com/es/blog/landing-page-design-trends-2026)
- [Web Design Trends — Naturaily](https://naturaily.com/blog/web-design-trends)
- [Emerging Design Trends 2026 — Foremost Media](https://www.foremostmedia.com/resources/blog/posts/emerging-design-trends-2026)
- [Landing Page Design Trends by Industry — Involve](https://www.involve.me/blog/landing-page-design-trends)

## 2.2 Movimiento por scroll y rendimiento

La consensus técnica 2026: **las animaciones atadas al scroll se expresan en CSS y corren en el hilo compositor**, no en el hilo principal de JavaScript.

- `animation-timeline: view()` reemplaza al `IntersectionObserver` para reveals.
- `animation-timeline: scroll(root)` + `transform: scaleX()` reemplaza a los listeners de scroll para barras de progreso.
- `@view-transition { navigation: auto; }` da cross-fade entre páginas **sin JavaScript**.
- Soporte declarado en Chrome, Firefox y Safari, >95% del tráfico global (mayo 2026).
- Reglas de la industria: animar sólo `transform` y `opacity` (nunca `width`/`height`/`margin`), no poner `will-change` a ciegas, y **no aplicar el reveal a todas las secciones**: "una página donde cada sección aparece al scrollear se lee como plantilla, no como diseño".

**Fuentes:**
- [View Transitions API & Scroll-Driven Animations — Frontend Horizon](https://www.frontendhorizon.com/blog/view-transitions-api-and-css-scroll-driven-animations-the-browser-wins-of-2026)
- [CSS View Transitions and Scroll-Driven Animations — Codercops](https://blog.codercops.com/blog/css-view-transitions-scroll-driven-animations-2026)
- [CSS Scroll-Driven Animations: Complete Guide (2026)](https://cssawwwards.com/blog/css-scroll-driven-animations-guide-2026)
- [Scroll-driven animations case studies — Chrome for Developers](https://developer.chrome.com/blog/css-ui-ecommerce-sda)
- [The Psychology & Performance of Scroll Animations — Everything.design](https://www.everything.design/blog/scroll-animations-performance)
- [Scroll-driven animations — Josh W. Comeau](https://www.joshwcomeau.com/animation/scroll-driven-animations/)

## 2.3 Lo que pide un sitio industrial B2B

La investigación de manufacturers converge en tres bloques: **problema → solución → prueba**, y en la idea de que el sitio es la herramienta con la que el comprador técnico decide si lo incluye en su lista corta.

Los siete chequeos que se repiten:

1. páginas de producto y de aplicación con specs reales;
2. prueba de capacidad (fotos de planta, proceso, equipamiento);
3. señales técnicas verificables (certificaciones, ensayos, normas);
4. un camino claro de RFQ, con CTA junto a las specs;
5. mobile usable (40–50% del tráfico B2B llega por teléfono);
6. visibilidad en buscadores, con contenido estructurado;
7. **tracking de conversiones** — envíos de formulario, llamadas, clics de WhatsApp y descargas de documentos, **como eventos separados**.

Tres reglas que aplican directo a este sitio:

- **Pedir sólo los datos esenciales en el primer contacto.** Hoy el formulario pide nombre, teléfono, localidad, email y mensaje: cinco campos. "Material y cantidad estimada" está bien, pero **falta el producto de origen**.
- **Un CTA principal por página.** El sitio tiene hoy CTA de catálogo, presupuesto, WhatsApp, llamada y un formulario completo: cinco caminos para la misma acción.
- **La velocidad es una señal de confianza.** Un sitio que carga en 1 segundo comunica competencia operativa antes de que el visitante lea una línea.

**Fuentes:**
- [Industrial Manufacturer Website Checklist for Lead Generation — MOTM](https://www.motm.tech/industrial-manufacturer-website-checklist-for-lead-generation/)
- [B2B Website Design for Manufacturers — Nopio](https://www.nopio.com/blog/b2b-website-design/)
- [Industrial B2B Website Optimization — Dutch Synergy](https://www.dutchsynergy.com/knowledge-tools/industrial-b2b-website-optimization)
- [The B2B industrial website as a verification tool — Artic Agency](https://articagency.com/en/industrial-b2b-web/)
- [Manufacturing Website Features That Generate Qualified Leads — SEO Atlanta](https://www.seoguruatlanta.com/blog/manufacturing-website-features-that-generate-quality-leads/)
- [Great B2B Website Design Examples — DBS](https://www.dbswebsite.com/blog/8-great-examples-of-b2b-web-design/)

---

# 3. Diagnóstico del sitio actual

Todo lo de abajo está **verificado en el código** con archivo y línea. No hay suposiciones.

## 3.1 Lo que ya está bien (no tocar)

| Punto | Dónde |
|---|---|
| Sistema de tokens con paleta de marca coherente | `src/styles/global.css:10-110` |
| Fotos reales de la fábrica, del horno y del producto | `public/images/` (23 imágenes) |
| Schema `Organization`, `LocalBusiness`, `WebSite`, `BreadcrumbList` | `src/components/Seo.astro:47-113` |
| Sitemap + canonical + OG | `@astrojs/sitemap`, `Seo.astro` |
| Skip link, foco visible, `prefers-reduced-motion` respetado | `global.css:346-361` |
| Videos con `preload="none"` y poster (no descargan 9 MB al abrir) | `src/pages/historia-y-proceso.astro:237-247` |
| Formulario con honeypot, validación y estados | `src/pages/index.astro:244-311` |
| Datos de producto ya cargados: medidas, un/m², peso, unidades por pallet | `src/data/products.ts` (9 modelos) |
| Código limpio, Astro sin frameworks de UI, 0 dependencias de runtime | `package.json` |

## 3.2 Hallazgos

### A. La home no dice qué hace la empresa

`src/components/Hero.astro:19` — H1: **"Calidad que construye confianza"**. Es un lema, no una proposición de valor. El titular aprobado por el cliente en el SPEC nunca se implementó:

> **"Ladrillos cerámicos hechos en Misiones para construir nuestra región"** — `SPEC.md:620`

Además el H1 va en `text-transform: uppercase` (`Hero.astro:88`): en castellano un titular largo en mayúscula cuesta leer, y es una marca de plantilla.

### B. Una sola familia tipográfica para todo

`global.css:61` y `BaseLayout.astro:40-43`: Inter en 400/500/600/700/800. Titulares, texto y datos técnicos usan la misma voz. El SPEC ya autorizaba una alternativa (`SPEC.md:952-961`: Inter, Manrope, IBM Plex Sans, Source Sans 3).

### C. Todo el sitio es crema con tarjetas blancas

`global.css:25-26` (`--page: #f7f5f1`, `--surface: #ffffff`). El único bloque oscuro de toda la home es el CTA final (`index.astro:554`). Resultado: una superficie plana sin jerarquía, que es exactamente lo que la literatura 2026 marca como "flat design, depth as a conversion tool".

### D. Tres grillas de tarjetas iguales (y dos huecos)

| Grilla | Ubicación | Problema |
|---|---|---|
| Propuesta de valor | `index.astro:21-42` | 4 tarjetas idénticas |
| Beneficios | `index.astro:44-70` | 5 tarjetas idénticas (el 4º y 5º se estiran, pero el bloque sigue siendo una grilla) |
| Catálogo destacado | `index.astro:149-167` | 5 productos + 1 tile = 6 celdas iguales |

Además existe CSS muerto: el bloque `.downloads-bar` y sus sub-reglas (`index.astro:490-530`) **no tienen markup**. La "barra de descargas" fue sacada del contenido pero quedó el estilo.

### E. El selector "¿qué necesitás construir?" no existe

`SPEC.md:639-651` lo pide como bloque central de la home. No está implementado. Es la pieza que convierte el sitio de un catálogo en un camino guiado, y la que hoy más falta le hace al usuario: no puede decir "necesito ladrillo para encadenado" y obtener una respuesta.

### F. Páginas clave sin enlazar desde el menú

El menú tiene **3 entradas** (`Header.astro:10-14`: Productos, Historia y Proceso, Contacto), pero el sitio tiene **10 páginas de contenido**:

| Página | ¿Dónde se enlaza? |
|---|---|
| `/aplicaciones` | **Sólo desde las fichas de producto** (`productos/[slug].astro:162`). Inaccesible desde la home |
| `/preguntas-frecuentes` | **Desde ningún lado.** Página huérfana (sólo sitemap) |
| `/distribuidores` | Sólo desde un botón del footer (`Footer.astro:87`) |
| `/recursos-tecnicos` | Desde el footer, **dos veces con rótulos que no corresponden**: "Términos de Despacho" y "Política de Calidad" apuntan a la misma página (`Footer.astro:106-107`) |

Consecuencia doble: SEO (páginas con poca autoridad interna) y UX (el comprador no encuentra recursos técnicos ni distribuidores).

### G. La franja de datos no aporta datos

`index.astro:15-19`:

```js
{ value: '+50', label: 'Años fabricando', note: 'Actividad desde 1975' },
{ value: '100%', label: 'Producción regional', note: 'Hecho en Misiones' },
{ value: '100%', label: 'Atención personalizada', note: 'Un interlocutor siempre' },
```

Dos "100%" no son información: son relleno con formato de cifra. Y "+50 años" contra 1975 son 51. La franja es el lugar natural para las señales de confianza que pide la investigación B2B, y hoy no las tiene.

### H. Existe prueba de fábrica y no se usa

El cliente entregó 13 fotografías de planta y logística que **no aparecen en la home**:

| Archivo | KB | Qué muestra |
|---|---|---|
| `planta/secado-estanterias.webp` | 509 | Estanterías de secado |
| `planta/horno-pallets-1.webp` | 362 | Horno con pallets |
| `planta/taller-operarios.webp` | 365 | Operarios en taller |
| `planta/secado-despacho.webp` | 248 | Secado y despacho |
| `planta/pallets-exterior-1.webp` | 176 | Depósito exterior |
| `planta/pallets-despacho.webp` | 151 | Despacho de pallets |
| `planta/pallets-exterior-2.webp` | 129 | Depósito |
| `planta/autoelevador-despacho.webp` | 74 | Autoelevador |
| `logistica/camion-carga.webp` | 68 | Camión cargado |
| `logistica/remolque-carga.webp` | 97 | Remolque |
| `obras/ensayo-estructura.webp` | 60 | Ensayo de estructura |
| `obras/estructura-ladrillo.webp` | 184 | Estructura de ladrillo |

La home usa **una sola imagen** (el hero). Falta por completo el bloque que la investigación llama "prueba": fábrica, proceso, ensayos, despacho.

### I. El revelado automático es el antipatrón de plantilla

`BaseLayout.astro:84-88` inyecta la clase `.reveal` (fade-up de 18 px) **en todas las secciones** de la home. Es literalmente el error que la literatura 2026 señala: "una página donde cada sección aparece al scrollear se lee como plantilla". Consecuencias medibles en el repo:

- obliga a forzar `is-visible` antes de cada captura de pantalla (está documentado en `AGENTS.md`, §Known gotchas);
- retrasa el contenido que el visitante vino a buscar;
- el header queda con la sombra siempre encendida (`Header.astro:247` agrega `is-scrolled` al cargar), así que el efecto "sombra al scrollear" nunca se percibe.

### J. Las imágenes se sirven crudas

`sharp` ya está instalado como devDependency (`package.json`) pero **el proyecto no usa `astro:assets`**: no hay `srcset`, ni AVIF, ni anchos responsivos. El hero pesa 222 KB y `secado-estanterias.webp` 509 KB, servidos tal cual en todas las pantallas.

### K. Las fuentes de Google bloquean el render

`BaseLayout.astro:38-43`: dos requests a terceros (`fonts.googleapis.com` + `fonts.gstatic.com`) en el camino crítico, con `display=swap` pero sin `preload` ni auto-hospedaje. En un celular con 4G, ese es el primer cuello de botella del LCP.

### L. No hay medición

No hay eventos, ni analytics, ni logging de conversiones. No se puede saber si el formulario convierte, si el WhatsApp convierte, o qué ficha de producto genera consultas. Para un sitio cuyo único objetivo comercial es el pedido de presupuesto, es un agujero.

### M. El formulario no sabe de qué producto se trata

`index.astro:244-311`: 5 campos. Si el visitante llega desde la ficha del 12×18×24 portante y vuelve al formulario de la home, la consulta no menciona el producto. El `waText` de `ProductCard.astro:53` sí lo hace en WhatsApp — pero el formulario, no.

### N. Schema con una promesa que no se cumple

`Seo.astro:87-98` declara un `SearchAction` apuntando a `/productos?q={search_term_term}` con la nota "placeholder". Le estamos diciendo a Google que hay una búsqueda interna que no existe.

`localBusinessLd` (`Seo.astro:65-80`) tiene dirección y teléfono pero le faltan `geo`, `openingHoursSpecification`, `areaServed` e `image[]`.

### O. Dos detalles de robustez

- La calculadora de ladrillos del SPEC (`SPEC.md:902-934`) **fue implementada y después removida** (commit `35b1bf7`). El PDF de correcciones de la empresa la autoriza explícitamente, y los datos que necesita (`unitsPerM2`, `palletUnits`, `dimensions`) ya están cargados en `products.ts`. Es una herramienta técnica que se convierte en lead: es la pieza con mejor relación esfuerzo/resultado de todo el plan.
- El video `03-prensado-ladrillos.mp4` pesa 4 MB y sólo existe en H.264/MP4.

## 3.3 Lo que las tendencias piden y el sitio no tiene

| Pedido de la investigación | Estado actual |
|---|---|
| Grilla modular / bento | No (3 grillas de tarjetas iguales) |
| Tipografía de marca propia | No (una sola familia) |
| Profundidad de superficies | No (todo crema) |
| Movimiento nativo de plataforma | No (observer genérico) |
| Transición entre páginas | No |
| Bloque de prueba / capacidad | No (el material existe, no se usa) |
| Navegación por tipo de comprador | No (menú de 3 ítems) |
| CTA con el producto de contexto | Parcial (WhatsApp sí, formulario no) |
| Tracking de conversiones | No |
| Bloque "¿qué necesito construir?" | No (está en el SPEC) |

## 3.4 Lo que deliberadamente no se va a hacer

- **Modo oscuro.** Es la tendencia dominante de 2026, pero en herramientas de desarrollo. Acá sería invertir una paleta de fábrica de ladrillo sin que nadie lo pida. Se puede agregar en el futuro como un tema alterno sobre los tokens, pero **no es parte de este plan**.
- **3D en scroll / escena WebGL.** Pesa, se traba en celulares de gama media y contradice "sitio de fábrica verificable".
- **Chat de IA / hero conversacional.** Requiere backend, costo recurrente y no responde la pregunta real del comprador ("¿cuánto sale el pallet?").
- **Glassmorphism, cursor personalizado, degradados genéricos.** El propio SPEC los veta (`SPEC.md:963-971`: evitar sliders automáticos, fondos llenos de ladrillos, imágenes de stock, animaciones excesivas, gradientes genéricos).
- **Librerías de animación.** GSAP (70 KB) y framer-motion (30–50 KB) reemplazan hoy por CSS nativo.

---

# 4. Dirección de diseño

## 4.1 El concepto

> **"La fábrica como sistema"** — la página se lee como una ficha técnica viva: datos en tipografía monoespaciada, la retícula derivada de la medida del ladrillo, y la arcilla presente en la fotografía real, no en decoración.

Público real: el **maestro y el corralista que compran desde el celular** (deciden en minutos, quieren precio y stock) y el **arquitecto o ingeniero que llega después a verificar specs** (lee la ficha, no el adorno). El trabajo de la home es que ambos lleguen a su respuesta sin recorrer la página entera.

## 4.2 Tokens

La paleta **no cambia**: la marca manda y el SPEC la fija (`SPEC.md:942-950`). Lo que cambia es la **proporción**: el anthracita pasa a ser color estructural y el crema queda para superficies de lectura.

| Token | Hex | Uso | Estado |
|---|---|---|---|
| `--brand-ink` (Horno) | `#17120f` | Hero, selector de aplicaciones, CTA final, footer | ✓ ya existe |
| `--brand-ink-soft` | `#241c17` | Tarjetas elevadas sobre anthracita | ✓ ya existe |
| `--page` (Cal) | `#f7f5f1` | Fondo de lectura | ✓ ya existe |
| `--surface` | `#ffffff` | Tarjetas | ✓ ya existe |
| `--surface-alt` (Arena) | `#f2efea` | Bloque de beneficios y recursos | ✓ ya existe |
| `--accent` (Terracota) | `#d6400a` | Acento, eyebrows, íconos | ✓ ya existe |
| `--brand-orange` | `#ff3e00` | Sólo marca/logo | ✓ ya existe |
| `--line` | `#e7e2db` | Separadores | ✓ ya existe |
| `--radius-lg` | `12px` | Radios | ✓ ya existe |
| **nuevo** `--ink-data` | `#6b625c` | Color de los datos en mono | = `--text-muted` |
| **nuevo** `--shadow-deep` | `0 24px 60px rgba(0,0,0,.28)` | Sombras sobre anthracita | — |

**Ritmo de superficies propuesto** (reemplaza la home plana actual):

```
HERO          anthracita   ┐
FRANJA DATOS  naranja      │
SELECTOR      anthracita   ├─ bloque oscuro
CATÁLOGO      cal          │
PRUEBA        cal          │
BENEFICIOS    arena        ├─ bloque claro
RECURSOS      arena        │
CTA FINAL     anthracita   ┘
```

## 4.3 Tipografía

Trío deliberado. Cada rol con una voz distinta:

| Rol | Familia | Uso | Por qué |
|---|---|---|---|
| **Display** | **Archivo** (variable, wght 500–800) | H1, H2, cifras de la franja | Grotesca industrial: es la tipografía de la señalética de fábrica y de la maquinaria. Aporta carácter sin salirse de la paleta |
| **Texto** | **Inter** (400–700) | Párrafos, navegación, botones, formularios | Ya está, es excelente para pantalla y no hay razón de reemplazarla |
| **Datos** | **IBM Plex Mono** (400/500) | Medidas, pesos, rindimientos, unidades por pallet, cifras | Los datos técnicos en monoespaciada se leen como ficha técnica, no como párrafo. Es el recurso tipográfico barato con mayor retorno |

Escala: `--fs-900` sube a `clamp(2.25rem, 5.6vw, 4.25rem)` con Archivo 800 y `letter-spacing: -0.03em`. **Se saca el `text-transform: uppercase`** del H1.

> **Por qué no Inter en todo:** Inter es, literalmente, la tipografía por defecto de la era. Es legible y está bien: es la voz del texto, no de la marca. El cambio de una sola línea de display es el upgrade visual más grande y más barato disponible.

## 4.4 Layout

### La home nueva, bloque por bloque

```
┌──────────────────────────────────────────────────────────────┐
│ TOPBAR  anthracita: planta · teléfono · horario             │
├──────────────────────────────────────────────────────────────┤
│ HEADER  logo │ Productos Aplicaciones Distribuidores ⋯ │ CTA│
├──────────────────────────────────────────────────────────────┤
│ HERO (anthracita)                                            │
│  eyebrow: FÁBRICA EN PUERTO RICO, MISIONES · DESDE 1975     │
│  H1  Ladrillos cerámicos hechos en Misiones                 │
│      para construir nuestra región                           │
│  bajada corta + [Ver catálogo] [Pedir presupuesto]           │
│                                     ┌───────────────┐         │
│                                     │  foto real    │         │
│                                     │  de planta    │         │
│                                     ├───────────────┤         │
│                                     │ 12 × 18 × 24  │ ficha   │
│                                     │ 385 un/pallet │ mono    │
│                                     │ 1.940 kg      │         │
│                                     └───────────────┘         │
├──────────────────────────────────────────────────────────────┤
│ FRANJA DE DATOS (naranja, mono)  1975 │ 9 modelos │ <2h │  │
├──────────────────────────────────────────────────────────────┤
│ ¿QUÉ NECESITÁS CONSTRUIR? (anthracita)                       │
│  [Cerramientos] [Muros portantes] [Encadenados] [Techos] [+] │
├──────────────────────────────────────────────────────────────┤
│ CATÁLOGO DESTACADO (cal) — bento 3 × 3                       │
│  ┌───────────┬───────────┬──────┐                            │
│  │           │           │  P1  │  ← tile oscuro 2×2 anclado│
│  │  CATÁLOGO │           │  P2  │    (catálogo completo)     │
│  │ COMPLETO  ├───────────┼──────┤                            │
│  │  (2×2)    │           │  P3  │                            │
│  ├───────────┴───────────┼──────┤                            │
│  │         P4            │  P5  │                            │
│  └────────────────────────┴──────┘                            │
├──────────────────────────────────────────────────────────────┤
│ DE LA ARCILLA A LA OBRA (cal) — prueba                        │
│  [horno] [secado] [taller] [autoelevador] [camión] [ensayo] │
├──────────────────────────────────────────────────────────────┤
│ BENEFICIOS (arena) + corte del ladrillo animado              │
│  ┌──────────┬──────────┬──────────┐                          │
│  │ aislación │ velocidad│ ahorro   │                          │
│  ├──────────┴──────────┼──────────┤                          │
│  │  fuego (ancho)       │ canales  │                          │
│  └─────────────────────┴──────────┘                          │
├──────────────────────────────────────────────────────────────┤
│ RECURSOS + FAQ (arena, 2 columnas)                           │
├──────────────────────────────────────────────────────────────┤
│ CTA FINAL (anthracita) — formulario + WhatsApp + teléfono    │
└──────────────────────────────────────────────────────────────┘
```

### El bento del catálogo, en detalle

Es la pieza geométrica del plan. Reglas:

- Grilla de **3 columnas × 3 filas** = 9 celdas.
- El tile **"Catálogo completo"** ocupa **2 columnas × 2 filas** (4 celdas), anclando la composición con el bloque oscuro.
- Los **5 productos** ocupan las 5 celdas restantes.
- Resultado: fila 1 = `[CTA][CTA][P1]`, fila 2 = `[CTA][CTA][P2]`, fila 3 = `[P3][P4][P5]`. **Ninguna fila queda con una celda sola** → se respeta `AGENTS.md` §Layout rules.
- **A 980 px el `span` se desactiva** y todo vuelve a 2 columnas con el tile al final (6 ítems = 3 filas parejas). A 620 px, 1 columna.

> **Ojo técnico (regla de `AGENTS.md`):** Astro scopea los estilos por componente, así que un `grid-column: span 2` en el `<style>` de la página **no alcanza** la raíz de `<ProductCard />`. La solución es envolver cada tarjeta en un `<div class="bento-cell">` y aplicar el `span` **al wrapper** (que sí vive en el scope de la página), no al componente.

### La firma: el "corte del ladrillo"

Un único dibujo SVG, en el bloque de beneficios, que representa el corte transversal del ladrillo hueco con sus celdas reales. Al entrar en pantalla, **las tres celdas se van llenando de terracota** y, con ese único gesto, se explica lo que hoy se explica en cinco viñetas con texto:

- celdas rellenas → **aislación térmica**;
- celdas atravesadas por un caño → **paso de instalaciones**;
- silueta completa → **resistencia al fuego**.

Es la firma porque es *de este producto*: un ladrillo hueco visto en corte. Y es el único momento animado de la página, no uno más.

> **Requisito:** el dibujo tiene que salir del plano real del ladrillo. Si la empresa no tiene plano, se arma a partir de `public/images/obras/estructura-ladrillo.webp` y se valida con el cliente antes de publicar. **Nunca inventar la geometría.**

## 4.5 Movimiento

Principio: **un gesto memorable > diez animaciones repartidas**. Todo lo que sigue es CSS nativo, `prefers-reduced-motion` respetado, y **cero librerías**.

| # | Momento | Técnica | JS | Fallback |
|---|---|---|---|---|
| 1 | Transición entre páginas | `@view-transition { navigation: auto; }` | 0 | cross-fade nativo |
| 2 | Barra de progreso de lectura | `animation-timeline: scroll(root)` + `scaleX` | 0 | oculta |
| 3 | **Corte del ladrillo** (firma) | `animation-timeline: view()` | 0 | dibujo estático, ya completo |
| 4 | Entrada de las tarjetas del bento | `view()` con stagger de 60 ms | 0 | estáticas |
| 5 | Cifras de la franja | count-up una vez al entrar | ~25 líneas | número fijo |
| 6 | Hover de tarjeta | `transform` + `opacity`, 150 ms | 0 | CSS |
| 7 | Filtro del catálogo | reordenamiento con `transform`/`opacity` | ~40 líneas | recarga la página |
| 8 | Menú móvil | altura con `grid-template-rows: 0fr → 1fr` | ~20 líneas | `display: none` |

Total de JS nuevo: **< 1,5 KB inline**. Sin GSAP, sin framer-motion, sin ScrollTrigger.

### Reglas de implementación (importantes)

```css
/* — Estado base: el contenido SIEMPRE visible — */
.reveal { opacity: 1; }

/* — Sólo donde el navegador lo soporta, el contenido se oculta — */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: fade-up linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 45%;
    }
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: none; }
    }
  }
}
```

Tres reglas que evitan bugs ya conocidos:

1. **El estado base es visible.** Si `animation-timeline` no está soportado, el contenido aparece normal. Nunca al revés (content invisible = bug).
2. **`prefers-reduced-motion` cierra todo**, no sólo los reveals.
3. **Sólo `transform` y `opacity`.** Nada de `width`, `height`, `margin` (provocan recálculo de layout). Para la barra de progreso: `scaleX`, no `width`.

### El `reveal` se acota

`BaseLayout.astro:84-88` deja de inyectar `.reveal` automáticamente y pasa a ser **explícito en el markup**: sólo lo llevan los tres bloques que lo piden (franja de datos, bento, bloque de prueba). El resto de las secciones aparece de una.

**Beneficio adicional:** se termina el problema documentado en `AGENTS.md` de tener que forzar `is-visible` antes de cada captura de pantalla.

## 4.6 Conversión

| Mejora | Detalle |
|---|---|
| **Formulario que sabe el producto** | `?producto=12x18x24-portante` → campo oculto + mensaje precargado con la medida. El CTA de cada ficha lleva ese parámetro |
| **Un CTA principal por página** | La home cierra con el formulario. Las fichas de producto cierran con "Cotizar este modelo" (WhatsApp precargado, que ya existe). Se evita la competencia de 5 CTAs |
| **Calculadora de ladrillos** | En `/recursos-tecnicos`: largo × alto × aberturas + producto → superficie, unidades, desperdicio, cantidad final y pallets aproximados → WhatsApp precargado con el resultado. **Los datos ya están** (`unitsPerM2`, `palletUnits` en `products.ts`) |
| **Medición** | Eventos separados: `form_submit`, `whatsapp_click`, `tel_click`, `product_cta_click`, `calculator_share`, `distributor_click`. Con destino simple (GA4, Plausible o un log en el servidor) — a definir con el cliente |
| **Bloque de distribuidores con intención** | Los corralones son el canal de compra real: "Buscá tu corralón más cercano" con lista de localidades, no sólo un link |

---

# 5. Plan de trabajo

Estimaciones en **jornadas de un desarrollador**. "Depende del cliente" marca los bloqueos de contenido.

## Fase 0 — Saneamiento (0,5 j)

**Estado: ✅ COMPLETA (23/10/2026).** 8 de 8 tareas hechas. Única excepción: el `geo` del schema queda **fuera a propósito** (`company.geo.pending === true`), porque no hay coordenadas confirmadas.

Arreglos puntuales, sin tocar el diseño. Se pueden hacer ya.

| # | Tarea | Archivo | Criterio de aceptación |
|---|---|---|---|
| 0.1 | Ampliar el menú a 6 entradas con submenú "Más" | `src/components/Header.astro:10-14` | Productos, Aplicaciones, Distribuidores, Recursos técnicos, Historia y Proceso, Contacto alcanzables desde cualquier página |
| 0.2 | Enlazar `/preguntas-frecuentes` desde home y footer | `src/pages/index.astro`, `src/components/Footer.astro` | La página deja de ser huérfana |
| 0.3 | Corregir los rótulos del footer | `src/components/Footer.astro:106-107` | "Términos de Despacho" y "Política de Calidad" apuntan a secciones reales, o se unifican bajo un rótulo correcto |
| 0.4 | Borrar el CSS muerto de la barra de descargas | `src/pages/index.astro:490-530` | Sin reglas huérfanas |
| 0.5 | Quitar la sombra forzada del header | `src/components/Header.astro:247` | La sombra aparece sólo al scrollear |
| 0.6 | Corregir "+50 años" → "51" (o "Desde 1975") | `src/pages/index.astro:16` | El dato coincide con la cronología publicada |
| 0.7 | LocalBusiness: `geo`, `openingHoursSpecification`, `areaServed`, `image[]` | `src/components/Seo.astro:65-80` | Validado con el Rich Results Test |
| 0.8 | Quitar el `SearchAction` del schema | `src/components/Seo.astro:87-98` | No se declara una búsqueda que no existe |

## Fase 1 — Sistema de diseño y home (2,5 – 3 j)

**Estado: ✅ COMPLETA (23/10/2026).** 9 de 9 tareas hechas, con dos desviaciones deliberadas: **1.4** se implementó con **6 tiles** (las 6 aplicaciones reales de `applications.ts`), no 5; y **1.9** (modo oscuro) **no se publicó**: sólo quedaron los tokens agrupados, como estaba previsto.

| # | Tarea | Archivo | Criterio de aceptación |
|---|---|---|---|
| 1.1 | Incorporar Archivo + IBM Plex Mono; auto-hospedar las tres familias en woff2 con `font-display: swap` y `preload` de las 2 críticas | `src/styles/global.css`, `src/layouts/BaseLayout.astro:38-43` | 0 requests a terceros en el camino crítico; `font-family` con 3 roles |
| 1.2 | Reescribir el hero sobre anthracita con la ficha mono del producto destacado | `src/components/Hero.astro` | H1 = el del SPEC §22; sin `uppercase`; ficha con medidas/un-pallet/peso reales |
| 1.3 | Implementar la franja de datos con cifras reales en mono | `src/pages/index.astro:15-19, 88-100` | Cero "100%"; toda cifra con fuente verificada o se omite |
| 1.4 | Implementar el selector "¿Qué necesitás construir?" | `src/pages/index.astro` | 5 tiles que llevan a `/aplicaciones/[id]` reales; sólo categorías existentes en `applications.ts` |
| 1.5 | Rehacer el catálogo destacado en bento 3×3 con el tile oscuro 2×2 | `src/pages/index.astro:149-167`, `src/components/ProductCard.astro` | 5 productos + tile, 3 filas parejas, sin celda sola; `span` aplicado al wrapper |
| 1.6 | Crear el bloque "De la arcilla a la obra" con las fotos de planta y logística | nuevo `src/components/PlantGallery.astro` | Usa ≥6 fotos existentes; cada una con `alt` descriptivo real |
| 1.7 | Rehacer el bloque de beneficios con el corte del ladrillo | `src/pages/index.astro:171-200` | El 5º beneficio ocupa el ancho completo; la retícula no deja huecos |
| 1.8 | Reescribir el bloque de recursos + FAQ | `src/pages/index.astro` | Enlaces reales a `/recursos-tecnicos` y `/preguntas-frecuentes` |
| 1.9 | Dark mode sólo como tokens preparedness (sin interruptor visible) | `src/styles/global.css` | Los tokens quedan agrupados para que el tema sea agregable después; **no se publica** |

## Fase 2 — Movimiento (1 j)

**Estado: ✅ COMPLETA (23/10/2026).** 7 de 7 tareas hechas. Todo en CSS nativo: cero librerías, cero archivos `.js` externos en `dist/`.

| # | Tarea | Archivo | Criterio de aceptación |
|---|---|---|---|
| 2.1 | Quitar la inyección automática de `.reveal`; hacerlo explícito | `src/layouts/BaseLayout.astro:84-88` | Sólo 3 bloques llevan la clase |
| 2.2 | Migrar los reveals a `animation-timeline: view()` con `@supports` | `src/styles/global.css:339-348` | Contenido visible sin JS y sin soporte |
| 2.3 | `@view-transition { navigation: auto; }` | `src/layouts/BaseLayout.astro` | Cross-fade entre páginas en navegadores compatibles |
| 2.4 | Barra de progreso de lectura | `src/layouts/BaseLayout.astro` | `scaleX` sobre `scroll(root)`; oculta en páginas cortas |
| 2.5 | Animación del corte del ladrillo | `src/components/` (nuevo) | Las celdas se llenan al entrar en pantalla; estático si no hay soporte |
| 2.6 | Count-up de la franja de datos | `src/pages/index.astro` | Una sola vez; con `prefers-reduced-motion` muestra el número final |
| 2.7 | Stagger en el bento | `src/styles/global.css` | 60 ms entre celdas, transform+opacity |

## Fase 3 — Performance, SEO y medición (1 – 1,5 j)

**Estado: ⏸️ PENDIENTE — arrancada a medias por falta de datos.** Se hicieron **3.1** (imágenes), **3.2** (`preload` + `width`/`height` en el hero) y **3.5** (producto de contexto en el formulario). Quedan sin hacer: **3.3** (WebM de los 3 videos), **3.6** (eventos de conversión), **3.7** (`llms.txt`).

> **3.4 (calculadora de ladrillos) quedó BLOQUEADA, no descartada.** El SPEC §28 la daba por hecha porque "los datos ya están (`unitsPerM2`)", pero **`unitsPerM2` es `null` en los 9 productos**: no hay rendimiento confirmado. No se puede construir una calculadora con datos reales hasta que el cliente mande ese dato (o se derive de las medidas). Construirla con un valor inventado violaría la regla de `AGENTS.md` §Content rules.

| # | Tarea | Archivo | Criterio de aceptación |
|---|---|---|---|
| 3.1 | Migrar a `astro:assets` (`<Image>`) con `srcset`, AVIF y anchos | `src/components/`, `public/images/` | Hero < 90 KB en el ancho real de render; `secado-estanterias.webp` deja de pesar 509 KB |
| 3.2 | `preload` del hero; `width`/`height` en todas las imágenes | `src/components/Hero.astro:46-54` | CLS = 0 |
| 3.3 | Generar versión WebM de los 3 videos de proceso | `public/video/` | `03-prensado-ladrillos` deja de pesar 4 MB en MP4 |
| 3.4 | Calculadora de ladrillos en `/recursos-tecnicos` | `src/pages/recursos-tecnicos.astro` | Largo × alto × aberturas + producto → cantidad y pallets → WhatsApp precargado (SPEC §28) |
| 3.5 | Producto de contexto en el formulario | `src/pages/index.astro:244-311` | `?producto=slug` precarga el mensaje |
| 3.6 | Eventos de conversión | `src/layouts/BaseLayout.astro` | 5-6 eventos distinguibles, con destino a definir con el cliente |
| 3.7 | `llms.txt` con catálogo y contacto | raíz del proyecto | Opcional; archivo de texto plano |

## Fase 4 — Verificación y publicación (0,5 j)

**Estado: 🟡 PARCIAL (23/10/2026).** Hechas **4.2** (recorrido a 360 / 768 / 1366 / 1638 px, sin scroll horizontal ni solapamientos) y **4.3** (`prefers-reduced-motion` respetado y foco visible). Faltan **4.1** (Lighthouse), **4.4** (Rich Results) y **4.5** (deploy por FTPS) — este último a la espera de que el cliente apruebe el rediseño.

| # | Tarea | Criterio de aceptación |
|---|---|---|
| 4.1 | Lighthouse en móvil emulado | LCP < 2,0 s · CLS < 0,05 · INP < 200 ms |
| 4.2 | Recorrido a 360 px, 768 px, 1366 px y 1638 px | Sin scroll horizontal; sin solapamientos; CTAs táctiles ≥ 44 px |
| 4.3 | `prefers-reduced-motion` y navegación por teclado | Sin movimiento con la preferencia activa; foco visible en todos los controles |
| 4.4 | Validar schema (Rich Results) | Sin errores |
| 4.5 | Backup del `.htaccess` y despliegue por FTPS con verificación de tamaños | Procedimiento de `deploy.ps1` respetado (`AGENTS.md` §Deployment) |

### 5.1 Cómo se publica: dos rondas

**Decisión del cliente (23/10/2026): el rediseño se publica en dos veces, no de una.** El código quedó partido en dos unidades desplegables, cada una en su rama y su PR.

| Ronda | Qué entra | Rama → PR | Qué ve el visitante |
|---|---|---|---|
| **1** | **Fases 0 y 1** — saneamiento, sistema de diseño, home nueva | `feature/publicacion-1-diseno` → PR #14 | El sitio nuevo, estático: navegación, tipografía propia, home con bento, galería y el corte del ladrillo ya dibujado. **Sin animaciones.** |
| **2** | **Fase 2** — movimiento | `feature/publicacion-2-movimiento` → PR #15 | Se suma el movimiento: reveals por bloque, stagger, las celdas del corte que se encienden, barra de progreso de lectura, count-up de la franja y transición entre páginas. |

**Por qué se puede partir así:** todo el movimiento va dentro de `@supports (animation-timeline: ...)` + `@media (prefers-reduced-motion: no-preference)`, y **el estado base de cada elemento es visible**. Sin esa separación, quitar el movimiento dejaba contenido invisible; con ella, la ronda 1 es un sitio completo y verificado por sí mismo.

**Procedimiento de publicación** (después de mergear cada PR, por separado):

```bash
git checkout main
git pull
npm run build
deploy.cmd
```

`deploy.ps1` sube archivo por archivo, verifica los tamaños de lo subido y deja el `.htaccess` para el final (ver `AGENTS.md` §Deployment).

**Lo que sigue en la ronda 2**, además del movimiento: la Fase 3 (WebM de los videos, eventos de conversión, `llms.txt`) y la calculadora del SPEC §28, que sigue bloqueada por `unitsPerM2 = null` en los 9 productos.

---

# 6. Datos que hay que pedir a la empresa

**Bloqueantes** (sin ellos la sección queda incompleta y **no se rellena con placeholders** — regla de `AGENTS.md` §Content rules):

| # | Dato | Para qué | Prioridad |
|---|---|---|---|
| 1 | **Plano / dibujo técnico del ladrillo hueco** (geometría de las celdas) | La firma del corte transversal | **Alta** |
| 2 | Capacidad productiva real (ladrillos/día, pallets/día) | Franja de datos + bloque de prueba | **Alta** |
| 3 | Certificados de ensayo (resistencia, trabajabilidad) y normas IRAM aplicables | Señales técnicas verificables | **Alta** |
| 4 | Municipios con distribución efectiva | Bloque de cobertura | Media |
| 5 | Listado definitivo de modelos y disponibilidad real | Validar los 9 del catálogo | Media |
| 6 | Fotos de obras terminadas y de clientes | Prueba social ("De la arcilla a la obra") | Media |
| 7 | Testimonios con nombre, cargo y empresa | Prueba social con atribución | Media |
| 8 | PDFs de fichas técnicas / certificados de calidad | Centro técnico: convertir "Solicitar" en descarga real | Media |
| 9 | Confirmación de los rótulos "Términos de Despacho" y "Política de Calidad" | Footer | Baja |
| 10 | Confirmación de la cronología (1975, hitos) | Ya publicada en `/historia-y-proceso`: confirmar antes de usarla en la franja | Baja |

> Mientras tanto, la franja de datos puede usar **sólo lo verificado**: "Desde 1975", "9 modelos en catálogo", "Respuesta en menos de 2 horas". Con eso alcanza y sobra; el resto se agrega cuando llegue.

---

# 7. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Exceso de motion** → el sitio se ve "IA" | Alto | Regla dura: 1 gesto memorable (el corte) + 3 reveals acotados. Todo lo demás es hover |
| **Sobre-animar el LCP** | Alto | El hero no lleva reveal; la franja de datos sí, y está bajo el fold |
| **Tipografías trabando la carga** | Medio | Auto-hospedaje + `swap` + `preload` de 2 faces; subconjunto latino |
| **Bento roto en 2 columnas** (celda sola) | Medio | El `span` sólo a ≥980 px; a menos columnas, todo en flujo y el tile al final. Probar 360/768/980/1366/1638 |
| **Regla de Astro: `grid-column` no alcanza al hijo** | Medio | Aplicar el `span` al `<div>` wrapper, nunca a `<ProductCard />` (`AGENTS.md` §Layout rules) |
| **Romper el deploy por FTPS** | Alto | `deploy.ps1` ya verifica tamaños archivo por archivo; backup del `.htaccess` antes de subir |
| **Publicar cifras no confirmadas** | Alto | Regla de `AGENTS.md`: dato no confirmado = `null` = la fila no se renderiza. Nunca un placeholder |
| **Hacer el sitio "bonito" y perder peso en SEO** | Medio | No se tocan URLs ni estructura de breadcrumbs; se **agregan** enlaces internos, no se cambian |

---

# 8. Bitácora

## 23/10/2026 — Relevamiento y propuesta

**Qué se hizo**
- Lectura completa del código del sitio (12 páginas, 14 componentes, 5 archivos de datos, 392 líneas de tokens).
- Verificación de las 23 imágenes y 3 videos de `public/` con sus pesos reales.
- Revisión del `SPEC.md` (52 secciones) y del `AGENTS.md` para no contradecir lo ya acordado.
- Investigación de tendencias 2026 en 3 ejes: diseño de landing pages, movimiento y rendimiento en scroll, y chequeo de sitios industriales B2B. 18 fuentes consultadas.
- Auditoría del sitio publicado: confirmado que responde con el WAF del hosting ante peticiones automatizadas (consistente con `AGENTS.md`).

**Bugs y problemas encontrados** (todos verificados en código, ninguno corregido todavía — este documento es propuesta)

| # | Hallazgo | Ubicación |
|---|---|---|
| 1 | H1 no dice qué se fabrica; el titular del SPEC nunca se implementó | `Hero.astro:19` |
| 2 | H1 en mayúsculas (ilegible en castellano largo) | `Hero.astro:88` |
| 3 | Una sola familia tipográfica para todo | `global.css:61`, `BaseLayout.astro:42` |
| 4 | Superficies planas: todo crema con tarjetas blancas | `global.css:25-26` |
| 5 | 3 grillas de tarjetas iguales | `index.astro:21-70, 149-167` |
| 6 | CSS muerto de la barra de descargas | `index.astro:490-530` |
| 7 | Selector "¿qué necesitás construir?" del SPEC, no implementado | `SPEC.md:639-651` |
| 8 | Menú con 3 entradas y 8 páginas; `/preguntas-frecuentes` huérfana | `Header.astro:10-14` |
| 9 | Dos rótulos del footer apuntan a la misma página | `Footer.astro:106-107` |
| 10 | Franja de datos con dos "100%" de relleno; "+50 años" contra 1975 | `index.astro:15-19` |
| 11 | 12 fotos de planta/logística/ensayo sin usar en la home | `public/images/` |
| 12 | `.reveal` inyectado en todas las secciones (patrón de plantilla) | `BaseLayout.astro:84-88` |
| 13 | Sombra del header siempre encendida | `Header.astro:247` |
| 14 | `astro:assets` sin usar pese a tener `sharp` instalado | `package.json` |
| 15 | Fuentes de Google render-blocking | `BaseLayout.astro:38-43` |
| 16 | Sin medición de conversiones | — |
| 17 | El formulario no recibe el producto de origen | `index.astro:244-311` |
| 18 | Schema declara un `SearchAction` inexistente | `Seo.astro:87-98` |
| 19 | `LocalBusiness` sin `geo`, `openingHours` ni `areaServed` | `Seo.astro:65-80` |
| 20 | Calculadora del SPEC implementada y luego removida | commit `35b1bf7`, `SPEC.md:902-934` |

**Pendientes**
- Aprobar o ajustar el alcance de las 4 fases.
- Pedir los 10 datos de la §6 (los 3 marcados como **Alta** son los que bloquean la firma visual).
- Definir el destino de la medición (GA4, Plausible o log propio).
- Definir si el sitio se publica con el rediseño completo o en dos publicaciones (Fase 0-1 primero, Fase 2-3 después).

---

## 23/10/2026 — Implementación de las Fases 0, 1 y 2

**Estado:** implementado, verificado y **visible en local** (`http://localhost:4321`). **Nada subido al hosting todavía.**

**Dónde está:** el rediseño se publica **en dos rondas** (ver §5.1), con una rama y un PR por ronda:

| Ronda | Rama | PR | Commit |
|---|---|---|---|
| 1 — el diseño (Fases 0 y 1) | `feature/publicacion-1-diseno` | **#14** | `feat(home): rediseña la home con sistema de diseño propio (publicación 1 de 2)` — 17 archivos, +1981 / −438 |
| 2 — el movimiento (Fase 2) | `feature/publicacion-2-movimiento` | **#15** | `feat(movimiento): suma la capa de movimiento en CSS nativo (publicación 2 de 2)` — 6 archivos, +183 / −12 |

`main` sigue en `bc8a4fe`: el rediseño **no está mergeado**, así que el hosting puede seguir mostrando la versión anterior.

### Qué se hizo

**Fase 0 — Saneamiento (8/8)**
- `Header.astro`: menú de 3 → 5 entradas (Productos, Aplicaciones, Distribuidores, Recursos técnicos, Historia y Proceso) + CTA Contacto. Eliminado `is-scrolled` forzado al cargar: la sombra ahora aparece sólo al scrollear.
- `Footer.astro`: enlaces reales a `/aplicaciones` y `/preguntas-frecuentes`; se eliminaron los rótulos "Términos de Despacho" y "Política de Calidad" (los dos apuntaban a la misma página); el footer pasó a **anthracita** con teléfonos y áreas en mono, para "bookendear" con el hero.
- `index.astro`: borrado el CSS muerto de `.downloads-bar`.
- `Seo.astro`: eliminado el `SearchAction` inexistente; `LocalBusiness` con `image[]`, `openingHoursSpecification` y `areaServed` (Misiones, Corrientes, Chaco, Formosa). **No se agregó `geo`**: `company.geo.pending === true`, no hay coordenadas confirmadas.
- `/preguntas-frecuentes` dejó de ser página huérfana.

**Fase 1 — Sistema de diseño y home (9/9)**
- **Tipografías auto-hospedadas** en `public/fonts/`: Archivo variable (34 KB), Inter variable (47 KB), IBM Plex Mono 400 (14,4 KB) y 500 (14,5 KB). **110 KB, cero requests a terceros.** Subconjunto latin, `font-display: swap`, `preload` de las 2 críticas en `BaseLayout.astro`.
- `global.css`: `@font-face`, `--font-display` / `--font-mono`, `--shadow-deep`, `.section--sand`, `.mono`, `.data-row`, encabezados en Archivo, `@view-transition { navigation: auto; }`, reveal reescrito como **mejora progresiva**.
- `Hero.astro` reescrito: anthracita con textura de hiladas en SVG, H1 del SPEC §22, eyebrow "Fábrica en Puerto Rico, Misiones · Desde 1975", ficha del producto destacado en mono (12×18×24 liviano: medidas, peso 3,10 kg, 405 un/palet) y 3 hechos en mono.
- `index.astro` reescrito con ritmo de superficies **anthracita → naranja → cal → arena → anthracita**: franja de datos con 4 cifras reales (1975, 9 modelos, 405 un/palet, 4 provincias), selector "¿Qué necesitás construir?" (6 tiles), propuesta de valor, **bento 3×3**, bloque "De la arcilla a la obra", beneficios con el corte del ladrillo, recursos + FAQ y CTA final (formulario conservado).
- `BrickCut.astro` **nuevo**: corte SVG del 12×18×24 con 6 celdas de 6×6 cm en 2×3, cotas "12 cm"/"18 cm", celdas que se encienden con `view()`.
- `PlantGallery.astro` **nuevo**: grilla 3×3 con la primera foto 2×2 y 5 fotos 1×1, rótulos sobre foto.
- `ProductCard.astro`: nueva prop `compact` (sin descripción, 2 specs en mono, sin botón de teléfono).

**Fase 2 — Movimiento (7/7)**
- Todo en CSS nativo, sin librerías: `@view-transition`, `animation-timeline: view()` con stagger en franja/bento/galería, `scroll(root)` para la barra de progreso de lectura, reveal acotado a 3 bloques y count-up de la franja en JS (≈615 chars inline). **Total JS inline ≈1,4 KB y cero archivos `.js` externos en `dist/`.**

### Bugs y problemas encontrados, y cómo se resolvieron

| # | Problema | Causa | Resolución |
|---|---|---|---|
| 1 | El contenido con `view()` quedaba **invisible** | `animation: X linear both` deja `animation-duration: 0s`; con `animation-timeline: view()` la animación no avanza nunca | Forma correcta: `animation: X auto linear both;` + `animation-timeline: view();`. Aplicado en `global.css`, `BaseLayout.astro`, `index.astro`, `PlantGallery.astro`, `BrickCut.astro` |
| 2 | La fila de la galería **se colapsaba** | `height: 100%` + `aspect-ratio` en la misma figura | La proporción va sólo en `.plant-figure`, sin `height: 100%` |
| 3 | El escalonado de las celdas del corte **no aplicaba** | `nth-of-type` en SVG cuenta todos los `<rect>` del SVG, no los del grupo | Clases explícitas `.cut-fill--1` … `.cut-fill--6` |
| 4 | Los archivos quedaban **con BOM** | PowerShell 5.1 `Set-Content -Encoding UTF8` agrega BOM | Reescritura con `[System.IO.File]::WriteAllBytes`; los 3 archivos quedaron sin BOM y con LF |
| 5 | El año se veía como **"1.975"** | `n.toLocaleString('es-AR')` mete separador de miles en 1975 | `String(n)` para los años; el formato queda sólo para cifras con separador real |
| 6 | El tile 2×2 del bento **no ocupaba 2 columnas** | Astro scopea los estilos: un `grid-column: span` del padre no alcanza la raíz de `<ProductCard />` | El `span` va en el `<div class="featured-cta">`, hijo directo de la grilla |
| 7 | `astro preview` daba **404 en todas las rutas** | Comportamiento del preview server con las rutas del sitio | Se verificó contra el dev server y, en producción, contra un servidor estático de `dist/` |
| 8 | Las capturas salían **a medio camino** | Chrome headless con `--screenshot` no scrollea; además `scroll-behavior: smooth` retrasa el salto | Script propio con CDP puro (Node 22, WebSocket nativo, sin dependencias) que desactiva el `scroll-behavior` antes de scrollear |
| 9 | `mcp__chrome-devtools__list_pages` fallaba | "browser is already running" | Se usó el in-app browser (`mcp_browser`); las capturas de ese navegador dan zonas en blanco si se toman durante el scroll → `wait` ~1,2 s antes de capturar |
| 10 | Los rastreos densos contra el hosting **quedaban trabados** | WAF delante del hosting | Verificación con navegador real, no con `curl` |
| 11 | `npm install` daba **ERESOLVE** | Conflicto de peers | `npm install --legacy-peer-deps` (no hizo falta: `node_modules` ya estaba) |
| 12 | Quedó **CSS muerto** de `.reveal` en `global.css` | Al pasar el reveal de una clase global a animaciones por bloque, la regla `.reveal` quedó sin ningún elemento que la usara | Se borró la regla y el bloque `@supports` de `global.css`; `AGENTS.md` ahora aclara que **no hay clase `.reveal`** y que el reveal se hace por bloque |

### Verificación hecha

| Prueba | Resultado |
|---|---|
| `npx astro check` | **0 errores, 0 warnings, 0 hints** (34 archivos) |
| `npx astro build` | **24 páginas en 711 ms**; `index.html` 59,2 KB; CSS 22,8 + 18,2 + 6,8 + 5,0 KB; **0 archivos `.js` externos** |
| Smoke test de rutas | `/`, `/productos`, `/productos/12x18x24-liviano`, `/aplicaciones`, `/aplicaciones/cerramientos`, `/distribuidores`, `/recursos-tecnicos`, `/preguntas-frecuentes`, `/historia-y-proceso`, `/contacto` → **200**; ruta inexistente → **404** correcto |
| Recorrido visual | Hero, franja naranja, selector, bento, galería con fotos reales, corte del ladrillo, beneficios, recursos/FAQ, CTA y footer — en **1638×969**, **1366×768** y **390×844** |
| Medición del DOM (CDP) | Bento = 9 celdas (tile 779×1006, 5 cards 381×495) → **ninguna fila huérfana**; galería = main 779×588 + 5 celdas 381×286 |
| Requests a terceros | **0** (fuentes auto-hospedadas) |
| Links internos | **101** enlaces únicos chequeados contra `dist/`: **todos resuelven** a una página construida (sin href roto) |
| Schema JSON-LD | **105** bloques extraídos del build: **0 inválidos** (todos parsean como JSON) |
| Imágenes | Todas las `<img>` apuntan a archivos existentes y **todas tienen `alt`** |
| Capturas | `_shots/rediseño/` |

### Verificación de la partición en dos rondas

El trabajo se partió en dos commits desplegables. Como el movimiento depende del scroll (`animation-timeline: view()`), el chequeo de visibilidad **tiene que hacerse durante el recorrido**: si se vuelve arriba del todo, lo que estaba abajo del pliegue vuelve a `opacity: 0` y el chequeo da un falso positivo.

| Prueba | Ronda 1 (sin movimiento) | Ronda 2 (con movimiento) |
|---|---|---|
| `astro check` | 0 / 0 / 0 | 0 / 0 / 0 |
| `astro build` | 24 páginas | 24 páginas, **0 `.js` externos** |
| Contenido invisible | ninguno (sólo el honeypot, oculto a propósito) | ninguno tras entrar en pantalla (sólo el honeypot) |
| Layout: bento | tile 779×1006 + 5 cards 381×495 | **idéntico** |
| Layout: galería | main 779×588 + 5 celdas 381×286 | **idéntico** |
| Layout: franja | 4 × 276×74 | **idéntico** |
| Franja de datos | 1975 \| 9 \| 405 \| 4 (texto final, sin JS) | 1975 \| 9 \| 405 \| 4 |
| Movimiento en el build | — | `animation-timeline` en el CSS de la home y del layout, `view-transition` en el global |

### Archivos tocados

```
M src/styles/global.css          M src/components/Header.astro
M src/layouts/BaseLayout.astro   M src/components/Footer.astro
M src/components/Hero.astro      M src/components/ProductCard.astro
M src/components/Seo.astro       M src/pages/index.astro
M src/data/distributors.ts        M AGENTS.md
?? src/components/BrickCut.astro  ?? src/components/PlantGallery.astro
?? public/fonts/*.woff2 (4)      ?? PLAN-MEJORA.md
```

> `src/data/distributors.ts`: se borró un comentario obsoleto que decía "Los siguientes son PLACEHOLDER" **cuando ya no había ningún distribuidor siguiente** (la cabecera del archivo dice que sólo está la planta, y eso es lo que se renderiza). Era contradictorio y podía hacer creer que faltaban filas por cargar.

### Decisiones de diseño que se tomaron

- **Se adoptó** el bento/modular, la tipografía propia, el movimiento nativo de plataforma, la profundidad de superficies y las micro-interacciones de hover.
- **Se descartó** el modo oscuro (es tendencia de dev tools e invertiría la paleta de fábrica), el 3D en scroll, el chat de IA, el glassmorphism, el cursor personalizado y los sliders automáticos — el propio SPEC §29 los veta.
- El selector de aplicaciones usa **las 6 aplicaciones reales** de `applications.ts`: no se inventó la categoría "Techos" que pedía el SPEC.
- La franja de datos usa **sólo cifras verificadas** (1975, 9 modelos, 405 un/palet, 4 provincias). Se eliminaron el "+50 años" y los dos "100%" de relleno.
- Se mantuvo el **reveal acotado a 3 bloques**; la inyección automática de `.reveal` en todas las secciones quedó eliminada (era el antipatrón de plantilla).
- **No se agregaron `geo` ni `unitsPerM2`** al schema/UI, por la regla de datos no verificados.

### Pendientes

**Para el cliente (bloqueantes de la publicación):**

| # | Pendiente | Por qué bloquea |
|---|---|---|
| 1 | **Plano / dibujo técnico del ladrillo hueco** | La geometría del corte (6 celdas 2×3 de 6×6 cm) se **derivó de la foto real**, no de un plano oficial. Hay que validarla antes de publicar |
| 2 | **`unitsPerM2` de los 9 productos** | Es `null` en todos. Sin ese dato **la calculadora del SPEC §28 no se puede construir** con datos reales |
| 3 | Confirmación de las cifras de la franja | 1975 sale de la cronología ya publicada; 405 un/palet y 9 modelos salen del catálogo. Falta el OK explícito |
| 4 | Definir el destino de la medición | GA4, Plausible o log propio. Sin esto la Fase 3 queda a medias |
| 5 | Aprobar el rediseño y decidir la publicación | ¿En una o en dos publicaciones? La recomendación sigue siendo **dos**: Fases 0-1 primero, Fase 2-3 después. El código ya está en el **PR #13** |

**Técnicos (pueden hacerse sin esperar al cliente):**
- **3.3** versión WebM de los 3 videos de proceso (`03-prensado-ladrillos` pesa 4 MB en MP4).
- **3.6** eventos de conversión (5-6 eventos distinguibles).
- **3.7** `llms.txt` con catálogo y contacto.
- **4.1** Lighthouse en móvil emulado · **4.4** validación del schema con Rich Results.
- **4.5** deploy por FTPS con el procedimiento de `deploy.ps1` (backup del `.htaccess` → subir archivo por archivo → verificar tamaños → subir el `.htaccess` al final).

**Decisión de producto abierta:** el corte del ladrillo es la firma visual del rediseño. Hoy muestra la geometría que se deduce de la foto real. Si el plano oficial difiere, hay que redibujar `BrickCut.astro` — es un componente aislado y el cambio no toca el resto de la home.

