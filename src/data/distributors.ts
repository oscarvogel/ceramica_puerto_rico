/**
 * Distribuidores.
 *
 * SPEC §18: lista validada por la empresa.
 * Mientras tanto, dejamos sólo la planta como punto oficial.
 */

export interface Distributor {
  slug: string;
  name: string;
  pending?: boolean;
  locality: string;
  province: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  mapsUrl?: string;
  notes?: string;
}

export const distributors: Distributor[] = [
  {
    slug: 'planta-puerto-rico',
    name: 'Planta y Ventas — Puerto Rico',
    locality: 'Puerto Rico',
    province: 'Misiones',
    address: 'Sección 1°, Colonia San Alberto, Lote 25B',
    phone: '+54 9 3743 47-3702',
    whatsapp: '5493743473702',
    mapsUrl: 'https://maps.google.com/?q=Puerto+Rico+Misiones',
    notes: 'Punto oficial de venta directa en planta.',
  },
];

export const getDistributorBySlug = (slug: string) =>
  distributors.find((d) => d.slug === slug);

export const provinces = [
  'Misiones',
  'Corrientes',
  'Chaco',
  'Formosa',
];
