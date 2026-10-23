/**
 * Aplicaciones — agrupa productos por problema constructivo.
 * SPEC §16: clave para SEO + experiencia de usuario.
 */

import { products, type Product, type Application } from './products';

export interface ApplicationGroup {
  id: Application;
  title: string;
  description: string;
  pending?: boolean;
}

export const applications: ApplicationGroup[] = [
  {
    id: 'cerramientos',
    title: 'Cerramientos exteriores',
    description:
      'Muros exteriores de viviendas, edificios y naves. Ladrillos huecos de 12, 18 cm y portantes según cálculo.',
  },
  {
    id: 'muros-portantes',
    title: 'Muros portantes',
    description:
      'Muros que soportan cargas. Requieren ladrillo portante específico y verificación del profesional a cargo.',
  },
  {
    id: 'tabiques-interiores',
    title: 'Tabiques interiores',
    description:
      'Divisiones interiores con ladrillo hueco de 8 cm o equivalente. Más livianos y de fácil ejecución.',
  },
  {
    id: 'encadenados',
    title: 'Encadenados',
    description:
      'Encadenados horizontales y verticales con piezas tipo U para vincular estructura y mampostería.',
  },
  {
    id: 'viviendas',
    title: 'Viviendas',
    description:
      'Soluciones cerámicas para obra húmeda residencial, llaves en mano o etapas de cerramiento.',
  },
  {
    id: 'edificios',
    title: 'Edificios',
    description:
      'Ladrillos para edificios en altura: cerramientos de 18 cm y portantes según proyecto estructural.',
  },
];

export const getApplicationById = (id: Application) =>
  applications.find((a) => a.id === id);

export const productsByApplication = (id: Application): Product[] =>
  products.filter((p) => p.application.includes(id));
