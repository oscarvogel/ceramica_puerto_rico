/**
 * Preguntas frecuentes — SPEC §20.
 * Estas son preguntas reales que surgen del análisis de la audiencia
 * (corralones, constructoras, arquitectos, maestros, particulares).
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: '¿Qué ladrillo usar para una pared exterior?',
    a: 'Para cerramientos exteriores se recomienda generalmente un ladrillo hueco de 12 o 18 cm, según el nivel de aislación y resistencia deseado. Para muros que soportan cargas estructurales se utiliza ladrillo portante. Confirmá la elección con tu constructor o con nuestro equipo técnico.',
  },
  {
    q: '¿Cuántos ladrillos necesito por metro cuadrado?',
    a: 'Depende del modelo y del tipo de pared: el rendimiento se calcula según el espesor del ladrillo y la forma de colocación. En cada ficha de producto tenés medidas, peso unitario y cantidad por pallet. Pasanos las medidas de tu obra y te ayudamos con el cálculo.',
  },
  {
    q: '¿Qué diferencia hay entre ladrillo portante y de cerramiento?',
    a: 'El ladrillo portante está diseñado para resistir las cargas de la estructura; el de cerramiento sólo cierra el muro, cuya estructura la sostienen columnas y vigas. Por eso se eligen según el cálculo del profesional.',
  },
  {
    q: '¿Cuántos ladrillos trae un pallet?',
    a: 'Depende del modelo: entre 268 y 515 unidades por pallet según el formato y el tipo de ladrillo. En la ficha de cada producto figura la cantidad exacta del modelo.',
  },
  {
    q: '¿Cómo almacenar ladrillos correctamente?',
    a: 'Los pallets deben apoyarse sobre superficie firme y nivelada, protegidos de la lluvia y la humedad. Evitá apilar más de la cantidad indicada por el fabricante y respetá las recomendaciones de la ficha técnica.',
  },
  {
    q: '¿Cómo solicito un presupuesto?',
    a: 'Podés escribirnos por WhatsApp al +54 3743 476985 o completar el formulario de la página de Contacto indicando producto, cantidad y localidad. Te respondemos a la brevedad.',
  },
  {
    q: '¿Dónde puedo comprar Cerámica Puerto Rico?',
    a: 'Directamente en nuestra planta de Puerto Rico, Misiones. También podés pedir presupuesto por WhatsApp o por el formulario de contacto y te indicamos dónde retirar el material o cómo coordinar la entrega.',
  },
  {
    q: '¿Hacen entregas? ¿Qué zonas atienden?',
    a: 'Coordinamos entregas en Misiones y provincias vecinas (Corrientes, Chaco, Formosa). Consultá por tu localidad y volumen por WhatsApp.',
  },
];

export default faq;
