/**
 * Datos centrales de la empresa.
 *
 * Convención: todo valor que no esté validado con Cerámica Puerto Rico
 * debe marcarse como `pending: true` y dejarse en null/string vacío
 * para que sea reemplazado cuando llegue la información real.
 *
 * Fuentes confirmadas (SPEC §2):
 *  - Fábrica en Puerto Rico, Misiones
 *  - Sección 1°, Colonia San Alberto, Lote 25B
 *  - Teléfono planta: +54 3743 476985
 *  - Actividad "desde 1975" (declaración comercial)
 *  - Instagram: @ceramicapuertoricosrl
 *  - Facebook: /ceramicaptorico
 */

export interface Branch {
  slug: string;
  name: string;
  pending?: boolean;
  address?: string;
  locality: string;
  province: string;
  phone?: string;
  whatsapp?: string;
  hours?: string;
  pendingFields?: string[];
}

export const company = {
  name: 'Cerámica Puerto Rico',
  legalName: 'Cerámica Puerto Rico SRL',
  tagline: 'Ladrillos cerámicos hechos en Misiones',
  description:
    'Fábrica de ladrillos cerámicos huecos con planta en Puerto Rico, Misiones. Proveemos a corralones, constructoras y obras en toda la región del NEA.',
  since: 1975, // declaración comercial — pendiente validación formal
  sincePending: true,

  // Dirección validada (SPEC §2)
  address: {
    street: 'Sección 1°, Colonia San Alberto, Lote 25B',
    locality: 'Puerto Rico',
    province: 'Misiones',
    country: 'Argentina',
  },

  // Teléfono comercial — confirmado por la empresa (publicaciones oct/2026)
  phone: {
    display: '+54 9 3743 47-3702',
    tel: '+5493743473702',
  },
  whatsappSales: '5493743473702',

  // Teléfonos de las distintas áreas (indicados por la empresa, oct/2026)
  areas: [
    { id: 'ventas', label: 'Ventas', display: '+54 9 3743 47-3702', tel: '+5493743473702' },
    { id: 'compras', label: 'Compras', display: '+54 9 3743 45-3033', tel: '+5493743453033' },
    { id: 'cobranzas', label: 'Cobranzas', display: '+54 9 3743 54-1627', tel: '+5493743541627' },
    { id: 'rrhh', label: 'Recursos Humanos', display: '+54 9 3743 41-5920', tel: '+5493743415920' },
  ],

  // Horario de atención — confirmado por la empresa (publicaciones oct/2026).
  // Jornada partida: por la mañana y por la tarde.
  hours: {
    weekdays: 'Lunes a viernes',
    morning: '7:00 a 12:00 hs',
    afternoon: '14:00 a 18:00 hs',
    display: 'Lunes a viernes, 7 a 12 hs y 14 a 18 hs',
  },

  // Sucursales / corralones
  branches: [
    {
      slug: 'planta-puerto-rico',
      name: 'Planta Puerto Rico',
      address: 'Sección 1°, Colonia San Alberto, Lote 25B',
      locality: 'Puerto Rico',
      province: 'Misiones',
      phone: '+54 9 3743 47-3702',
      whatsapp: '5493743473702',
      hours: 'Lunes a viernes, 7 a 12 hs y 14 a 18 hs',
    },
    // El corralón de Puerto Iguazú fue cerrado (confirmado por la empresa
    // en "INFORME SITIO WEB.docx", oct/2026): no se publica.
  ] satisfies Branch[],

  // Canales digitales
  social: {
    instagram: 'https://www.instagram.com/ceramicapuertoricosrl/',
    facebook: 'https://www.facebook.com/ceramicaptorico/',
  },

  email: {
    sales: 'ventas@ceramicaptorico.com.ar',
    general: 'info@ceramicaptorico.com.ar',
    rrhh: 'rrhhceramicaptorico@gmail.com',
    pending: true,
  },

  // Coordenadas aproximadas de Puerto Rico, Misiones (pendiente geolocalización exacta)
  geo: {
    lat: -26.7957,
    lng: -55.0245,
    pending: true,
  },

  // Posicionamiento recomendado (SPEC §7)
  positioning: {
    title: 'Industria misionera. Ladrillos cerámicos para construir nuestra región.',
    sinceLabel: 'Desde 1975 trabajando junto a vos.',
  },
} as const;

export type Company = typeof company;
