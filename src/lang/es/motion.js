Wonderlattice.defineText('motion', 'es', {
  eyebrow: 'GEOMETRÍA',
  name: 'Pinta con movimiento',
  tagline: 'Dos brazos que giran y un lápiz dibujan flores, estrellas y tramas.',
  presets: [
    {
      name: 'Flor silvestre',
      note: 'Seis pétalos, una sola línea',
      nudge: 'Prueba a cambiar −5 por −5.1. Un cambio diminuto le da a la flor un futuro muy distinto.',
    },
    {
      name: 'Órbita de seda',
      note: 'Un lazo dentro de otro',
      nudge: 'Activa los brazos en movimiento. Observa cómo cada círculo sencillo se suma al otro.',
    },
    {
      name: 'Estornino',
      note: 'Una estrella de bordes suaves',
      nudge: 'Lleva el alcance del lápiz hacia el 50%. Mira cómo las esquinas suaves se vuelven lazos profundos.',
    },
    {
      name: 'Luz tejida',
      note: 'Toma el camino largo',
      nudge: 'Usa «Dibujarlo todo» para ver la trama completa. Después prueba −4 para ver a un pariente más sencillo.',
    },
    {
      name: 'Casi un círculo',
      note: 'Un cambio diminuto, una historia larga',
      nudge: 'Dos velocidades casi iguales se separan poco a poco. Dibújalo todo para ver su reencuentro completo.',
    },
    {
      name: 'Cintas',
      note: 'Encuentra el ritmo escondido',
      nudge: 'Prueba otro ángulo inicial. El ritmo sigue igual mientras el dibujo gira.',
    },
  ],
  paletteNames: ['Aurora', 'Brasa', 'Glaciar', 'Luz de luna'],
  names: {
    own: 'Tu propia órbita',
    surprise: 'Un accidente feliz',
    shared: 'Una órbita compartida',
  },
  nudges: {
    whole:
      'Prueba a alejar la rotación de un número entero. Mira cómo el trazo toma un camino más largo de vuelta a casa.',
    traceAll: 'Prueba «Dibujarlo todo» para ver el patrón entero. Aquí todos los ajustes terminan cerrando su lazo.',
    surprise: 'Algo nuevo, solo para ti. Cambia una cosa y mira adónde te lleva.',
    shared: 'Alguien te dejó un patrón. Cambia una cosa para hacerlo tuyo.',
    revisit: 'Un patrón conocido todavía puede sorprenderte. Cambia una cosa y vuelve a mirar.',
  },
  status: {
    complete: 'El lazo se cerró',
    oneTurn: 'Una vuelta. Un mundo entero.',
    turns: (n) => `${n} vueltas exteriores para reencontrarse`,
  },
  explainStill:
    'El brazo interior mantiene su dirección mientras gira el exterior. El lápiz traza un círculo desplazado.',
  explain: (k, outer, inner, opposite) =>
    `A ${k}×, los dos brazos vuelven a su posición inicial después de ${outer} ${outer === 1 ? 'vuelta exterior' : 'vueltas exteriores'} y ${inner} ${inner === 1 ? 'vuelta interior' : 'vueltas interiores'}. ${opposite ? 'Giran en sentidos opuestos.' : 'Giran en el mismo sentido.'}`,
  play: {
    pause: 'Pausa',
    play: 'Reproducir',
    replay: 'Repetir',
  },
  focus: {
    enter: 'Entrar en la vista sin distracciones',
    leave: 'Salir de la vista sin distracciones',
    title: 'Vista sin distracciones',
  },
  rotationRange: 'Elige una rotación entre −10 y 10.',
  saved: 'Tu dibujo está listo para guardar.',
  saveFailed: 'No se pudo guardar la imagen. Inténtalo de nuevo.',
  shareText: (k, r, p, ink) =>
    `Wonderlattice · Pinta con movimiento\nRotación interior: ${k}×\nAlcance del lápiz: ${r}%\nÁngulo inicial: ${p}°\nTinta: ${ink}`,
  linkCopied: 'Enlace del patrón copiado.',
  settingsCopied: 'Ajustes del patrón copiados.',
  linkDescription: 'Copia este enlace para volver a abrir el mismo patrón.',
  settingsDescription: 'Copia estos ajustes para recrear tu patrón.',
  guests: [
    {
      name: 'Emmy Noether',
      note: 'Una simetría escondida puede revelar algo que nunca cambia.',
    },
    {
      name: 'Leonhard Euler',
      note: 'Los círculos y las exponenciales comparten un baile de lo más elegante.',
    },
  ],
});
