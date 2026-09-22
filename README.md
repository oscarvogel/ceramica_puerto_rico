# Cerámica Puerto Rico — Sitio web

Nuevo sitio institucional y comercial para **Cerámica Puerto Rico**, fabricante de ladrillos cerámicos de Puerto Rico, Misiones.

## Estado

🟡 **Fase: investigación / especificación**

Este repositorio parte de una investigación de mercado, marca, UX/UI, SEO, competencia y arquitectura técnica.

La especificación completa del proyecto está en **SPEC.md**.

> **Regla de proyecto:** no publicar como hechos datos de producto, historia, cobertura, capacidad, certificaciones o prestaciones técnicas que todavía no hayan sido validados por Cerámica Puerto Rico. SPEC.md distingue qué información está confirmada y qué debe verificarse.

## Objetivo

Construir una web profesional que funcione como:

- presentación industrial de la empresa;
- catálogo de productos;
- centro de información y fichas técnicas;
- buscador de distribuidores;
- fuente de posicionamiento SEO;
- generador de consultas y presupuestos;
- base para herramientas comerciales como una calculadora de ladrillos.

## Stack definido

La primera versión se desarrollará con:

- **Astro** para generación estática;
- **TypeScript**;
- **CSS** propio;
- **Vue 3** solamente para componentes interactivos que lo justifiquen;
- **PHP 8.x** mínimo para formularios/endpoints;
- contenido inicialmente en TypeScript / JSON / Markdown;
- build estático para hosting compartido;
- publicación por **FTPS**.

### Arquitectura

```text
Astro static
    +
Vue islands
    +
PHP API
    +
Shared hosting
```

El hosting de producción **no necesita Node.js**. El proyecto se compila antes de publicar:

```bash
npm run build
```

y se despliega el contenido generado en `dist/`.

## Estructura funcional prevista

```text
/
├── empresa/
├── productos/
├── aplicaciones/
├── obras/
├── distribuidores/
├── recursos-tecnicos/
├── preguntas-frecuentes/
└── contacto/
```

## Prioridades de la primera etapa

1. Inicializar Astro y design tokens.
2. Crear Header, Footer y layout SEO.
3. Construir Home.
4. Definir modelo de datos de productos.
5. Crear fichas de producto.
6. Incorporar catálogo real validado.
7. Crear Empresa, Distribuidores, Recursos técnicos, FAQ y Contacto.
8. Integrar WhatsApp y formulario PHP.
9. Optimizar imágenes y Core Web Vitals.
10. Configurar sitemap, robots, Schema.org y redirects.
11. Crear proceso de build/deploy por FTPS.

## Información pendiente del cliente

Antes de considerar definitiva la información comercial se necesita validar:

- catálogo actual y todos los modelos;
- medidas, rendimientos y pallets;
- fichas técnicas, ensayos y normas;
- cronología de la empresa desde 1975;
- certificaciones;
- capacidad productiva publicable;
- distribuidores y cobertura actuales;
- sucursales y contactos vigentes;
- obras de referencia;
- fotografías y videos originales;
- logos y colores corporativos;
- documentación técnica existente.

## Documento rector

👉 **[Leer SPEC.md](./SPEC.md)**

La SPEC contiene:

- investigación de empresa;
- datos confirmados y pendientes;
- productos y públicos objetivo;
- análisis de competidores;
- recursos visuales;
- arquitectura de información;
- wireframe de Home;
- SEO;
- branding y UI;
- stack técnico;
- estructura de proyecto;
- formularios y WhatsApp;
- deploy;
- etapas de implementación.

## Dominio objetivo

https://ceramicaptorico.com.ar

---

Este repositorio debe mantener como criterio central **producto claro → información técnica → confianza industrial → presencia regional → contacto comercial inmediato**.
