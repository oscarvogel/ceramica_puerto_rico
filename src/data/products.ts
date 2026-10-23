/**
 * Catálogo real de Cerámica Puerto Rico.
 *
 * Fuente: "correcciones página web.pdf" (indicaciones de la empresa, oct/2026),
 * que define las 4 líneas que se producen y los 9 modelos de cada una, con su
 * foto correspondiente, su peso unitario y su cantidad de ladrillos por pallet.
 *
 * Lo que la empresa NO confirmó queda en `null` y la interfaz lo muestra como
 * "A confirmar": rendimiento por m², peso del pallet lleno, resistencia a la
 * compresión, conductividad térmica y ficha técnica en PDF.
 *
 * Para cambiar la foto de un modelo: dejala en
 * public/images/productos/<slug>.webp (o .jpg) y ProductMedia la toma sola.
 */

export type ProductType = 'portante' | 'visto' | 'liviano' | 'encadenado';

export type Application =
  | 'cerramientos'
  | 'muros-portantes'
  | 'tabiques-interiores'
  | 'encadenados'
  | 'viviendas'
  | 'edificios';

export interface Product {
  slug: string;
  /** nombre comercial exacto, como figura en el documento de la empresa */
  name: string;
  /** familia comercial: portante, visto, liviano, encadenado */
  type: ProductType;
  application: Application[];
  pending?: boolean;
  description: string;
  /** ancho × alto × largo en cm */
  dimensions?: string | null;
  /** ancho nominal en cm, para filtros y ordenamiento */
  widthCm?: number | null;
  weightKg?: number | null;
  unitsPerM2?: number | null;
  palletUnits?: number | null;
  palletWeightKg?: number | null;
  resistance?: string | null;
  thermalConductivity?: string | null;
  recommendedUse?: string;
  featured?: boolean;
  pdfUrl?: string | null;
  /** ruta explícita de la foto; si falta, se busca por convención <slug>.<ext> */
  image?: string | null;
  imageAlt?: string;
}

export const products: Product[] = [
  /* — LIVIANOS — */
  {
    slug: '12x18x24-liviano',
    name: '12x18x24 Liviano',
    type: 'liviano',
    application: ['cerramientos', 'tabiques-interiores', 'viviendas'],
    pending: true,
    description:
      'Ladrillo hueco liviano de 12 cm. Es el formato más usado de la línea, para cerramientos de viviendas y tabiques.',
    dimensions: '12 × 18 × 24 cm',
    widthCm: 12,
    weightKg: 3.1,
    unitsPerM2: null,
    palletUnits: 405,
    palletWeightKg: null,
    resistance: null,
    thermalConductivity: null,
    recommendedUse: 'Cerramientos exteriores e interiores, tabiques.',
    imageAlt: 'Ladrillo hueco liviano de 12x18x24 cm con seis celdas',
    featured: true,
    pdfUrl: null,
  },
  {
    slug: '18x18x24-liviano',
    name: '18x18x24 Liviano',
    type: 'liviano',
    application: ['cerramientos', 'viviendas', 'edificios'],
    pending: true,
    description:
      'Ladrillo hueco liviano de 18 cm. Mayor espesor para cerramientos con más aislación y mejor comportamiento térmico.',
    dimensions: '18 × 18 × 24 cm',
    widthCm: 18,
    weightKg: 4.54,
    unitsPerM2: null,
    palletUnits: 268,
    palletWeightKg: null,
    resistance: null,
    thermalConductivity: null,
    recommendedUse: 'Cerramientos de vivienda y edificios.',
    imageAlt: 'Ladrillo hueco liviano de 18x18x24 cm con seis celdas',
    featured: true,
    pdfUrl: null,
  },
  {
    slug: '8x18x24-liviano',
    name: '8x18x24 Liviano',
    type: 'liviano',
    application: ['cerramientos', 'tabiques-interiores'],
    pending: true,
    description:
      'Ladrillo hueco liviano de 8 cm. El más liviano de la línea, para cerramientos y tabiques donde hay que reservar poco ancho.',
    dimensions: '8 × 18 × 24 cm',
    widthCm: 8,
    weightKg: 2.62,
    unitsPerM2: null,
    palletUnits: 504,
    palletWeightKg: null,
    resistance: null,
    thermalConductivity: null,
    recommendedUse: 'Cerramientos de bajo espesor y tabiques.',
    imageAlt: 'Ladrillo hueco liviano de 8x18x24 cm con cuatro celdas',
    featured: false,
    pdfUrl: null,
  },

  /* — PORTANTES — */
  {
    slug: '12x18x24-portante',
    name: '12x18x24 Portante',
    type: 'portante',
    application: ['muros-portantes', 'cerramientos', 'edificios'],
    pending: true,
    description:
      'Ladrillo portante de 12 cm. Menos espesor que el de 18 cm y mismo comportamiento estructural, para cuando hay que reservar ancho.',
    dimensions: '12 × 18 × 24 cm',
    widthCm: 12,
    weightKg: 4.0,
    unitsPerM2: null,
    palletUnits: 405,
    palletWeightKg: null,
    resistance: null,
    thermalConductivity: null,
    recommendedUse: 'Muros portantes donde no se dispone de 18 cm.',
    imageAlt: 'Ladrillo portante de 12x18x24 cm con nueve celdas',
    featured: true,
    pdfUrl: null,
  },
  {
    slug: '18x18x24-portante',
    name: '18x18x24 Portante',
    type: 'portante',
    application: ['muros-portantes', 'edificios', 'cerramientos'],
    pending: true,
    description:
      'Ladrillo portante de 18 cm para muros que soportan cargas. Es la pieza de mayor resistencia de la línea; el uso estructural requiere verificación del profesional a cargo.',
    dimensions: '18 × 18 × 24 cm',
    widthCm: 18,
    weightKg: 5.0,
    unitsPerM2: null,
    palletUnits: 268,
    palletWeightKg: null,
    resistance: null,
    thermalConductivity: null,
    recommendedUse: 'Muros portantes, encadenados, edificios.',
    imageAlt: 'Ladrillo portante de 18x18x24 cm con nueve celdas',
    featured: true,
    pdfUrl: null,
  },

  /* — VISTOS — */
  {
    slug: '12x18x24-visto',
    name: '12x18x24 Visto',
    type: 'visto',
    application: ['cerramientos', 'tabiques-interiores', 'viviendas'],
    pending: true,
    description:
      'Ladrillo visto de 12 cm. Se deja la cara a la vista, sin revoco ni pintura.',
    dimensions: '12 × 18 × 24 cm',
    widthCm: 12,
    weightKg: 3.85,
    unitsPerM2: null,
    palletUnits: 405,
    palletWeightKg: null,
    resistance: null,
    thermalConductivity: null,
    recommendedUse: 'Muros vistos, cerramientos de vivienda.',
    imageAlt: 'Ladrillo visto de 12x18x24 cm con celdas redondeadas',
    featured: true,
    pdfUrl: null,
  },
  {
    slug: '10x15x24-visto',
    name: '10x15x24 Visto',
    type: 'visto',
    application: ['cerramientos', 'tabiques-interiores'],
    pending: true,
    description:
      'Ladrillo visto de 10 cm de formato intermedio. Para muros vistos donde se busca pieza más chica.',
    dimensions: '10 × 15 × 24 cm',
    widthCm: 10,
    weightKg: 3.0,
    unitsPerM2: null,
    palletUnits: 515,
    palletWeightKg: null,
    resistance: null,
    thermalConductivity: null,
    recommendedUse: 'Muros vistos de formato intermedio.',
    imageAlt: 'Ladrillo visto de 10x15x24 cm con celdas redondeadas',
    featured: false,
    pdfUrl: null,
  },

  /* — PEINE ENCADENADO — */
  {
    slug: '12x18x24-peine',
    name: '12x18x24 Peine Encadenado',
    type: 'encadenado',
    application: ['encadenados', 'cerramientos'],
    pending: true,
    description:
      'Peine encadenado de 12 cm. Pieza de enlace horizontal y vertical, para vincular estructura con mampostería y resolver los encuentros.',
    dimensions: '12 × 18 × 24 cm',
    widthCm: 12,
    weightKg: 3.24,
    unitsPerM2: null,
    palletUnits: 405,
    palletWeightKg: null,
    resistance: null,
    thermalConductivity: null,
    recommendedUse: 'Encadenados horizontales y verticales.',
    imageAlt: 'Peine encadenado de 12x18x24 cm en perfil de canal',
    featured: false,
    pdfUrl: null,
  },
  {
    slug: '18x18x24-peine',
    name: '18x18x24 Peine Encadenado',
    type: 'encadenado',
    application: ['encadenados', 'muros-portantes', 'cerramientos'],
    pending: true,
    description:
      'Peine encadenado de 18 cm. Pieza de enlace para muros portantes, para resolver los encuentros entre estructuras y cerramientos.',
    dimensions: '18 × 18 × 24 cm',
    widthCm: 18,
    weightKg: 4.0,
    unitsPerM2: null,
    palletUnits: 330,
    palletWeightKg: null,
    resistance: null,
    thermalConductivity: null,
    recommendedUse: 'Encadenados en muros portantes.',
    imageAlt: 'Peine encadenado de 18x18x24 cm en perfil de canal',
    featured: false,
    pdfUrl: null,
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getFeaturedProducts = () =>
  products.filter((p) => p.featured);

export const productTypes: { id: ProductType; label: string }[] = [
  { id: 'portante', label: 'Portantes' },
  { id: 'liviano', label: 'Livianos' },
  { id: 'visto', label: 'Vistos' },
  { id: 'encadenado', label: 'Encadenados' },
];
