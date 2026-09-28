Wonderlattice.defineText('compress', 'es', {
  eyebrow: 'COMPRESIÓN',
  name: '¿Cuánta imagen puedes tirar?',
  tagline: 'Tira el 90% de los números de una imagen y apenas se nota. Tira el 10% equivocado y queda arruinada.',
  title: '¿Cuánta imagen puedes tirar?',
  subtitle: 'Una imagen es una lista de números. Guarda solo algunos y mira qué sobrevive.',
  field: 'Señales · Piezas básicas · Una pequeña sorpresa',
  sceneLabel: '64 bloques · 64 números cada uno',
  actionLabel: 'Cambiar entre fuertes y débiles',
  canvasLabel:
    'A la izquierda, tu imagen. En el centro, la imagen rehecha solo con los números guardados. A la derecha, las 64 ' +
    'piezas básicas, más brillantes donde la imagen más las usa. Arrastra sobre tu imagen para dibujar en ella. Con el ' +
    'teclado, muévete con las flechas y pulsa Intro para pintar.',
  tip: 'Arrastra sobre tu imagen para dibujar · Las flechas e Intro también pintan',
  panelEyebrow: 'Elige qué guardar',
  whyLabel: '¿Cómo puede faltar casi toda la imagen?',
  nudge:
    'Guarda solo el 10% más fuerte: ¿se nota? Ahora cambia a los más débiles y guarda el 90% de los números. ¿Qué pasó?',
  connection: {
    html: '<strong>Bits perdidos por accidente, o a propósito.</strong> Aquí tiramos números y casi no se nota. En «Envía una imagen a través de una tormenta», unos pocos bits extra bien pensados impiden que una tormenta arruine una imagen.',
    label: 'Visita «Envía una imagen a través de una tormenta»',
  },
  yours: 'Tu imagen',
  survives: 'Lo que sobrevive',
  blocks: 'Las piezas básicas',
  broad: 'manchas amplias',
  fine: 'ondas finas',
  pictureLabel: 'Elige una imagen, o dibuja sobre la tuya',
  pictures: { sunset: 'Atardecer', face: 'Cara', checks: 'Cuadros', rings: 'Anillos' },
  modeLabel: 'Qué números guardar',
  modes: ['Los más fuertes', 'Los más débiles'],
  modeHints: [
    'Los números más grandes, sea cual sea el bloque al que pertenezcan.',
    'Los números más pequeños; los más grandes se tiran.',
  ],
  keepLabel: 'Cuántos números guardar',
  keepHint: 'De 4096: 64 bloques de 8 × 8 píxeles, cada uno escrito como 64 números.',
  kept: 'Números guardados',
  keptValue: (count, share) => `${count} de 4096 (${share}%)`,
  energy: 'Parte de la energía de la imagen guardada',
  energyValue: (share) => `${share}%`,
  difference: 'Diferencia con tu imagen',
  differenceValue: (share) => `${share}%`,
  verdicts: ['Casi imposible de distinguir', 'Un poco suave', 'Borrosa', 'Arruinada'],
  status: (verdict, share) => `${verdict} · ${share}% de los números`,
  announce: (verdict, share, difference) =>
    `${verdict}: se guarda el ${share}% de los números, con un ${difference}% de diferencia.`,
  yourPicture: 'Tu propia imagen',
  presets: [
    { name: 'El 10% más fuerte', note: '¿Se nota?', badge: '10%' },
    { name: 'Tirar el 10% más fuerte', note: 'El 90% de los números, arruinada.', badge: '90%' },
    { name: 'Solo el 2%', note: 'Solo manchas amplias.', badge: '2%' },
  ],
  guests: [
    {
      name: 'Joseph Fourier',
      note: 'Estudiando cómo se propaga el calor, afirmó que cualquier curva se puede construir con ondas. Las imágenes también.',
    },
    {
      name: 'Nasir Ahmed',
      note: 'Propuso la transformada del coseno a principios de los años setenta. Casi todas las fotos de la web se guardan con ella.',
    },
  ],
  insight: {
    title: '¿Cómo puede faltar casi toda la imagen?',
    html: `<p>Para un ordenador, esta imagen son 4096 números: un brillo por cada píxel. Córtala en bloques de 8 × 8 píxeles, y cada bloque también se puede escribir como una receta: cuánto de cada uno de 64 patrones fijos hay que sumar. Los patrones van desde una mancha uniforme (el promedio del bloque) hasta ondas cada vez más finas. La receta también tiene 64 números y reconstruye el bloque exactamente. Todavía no se ha perdido nada.</p>
<div class="insight-visual">64 píxeles ⇄ 64 cantidades de 64 piezas básicas</div>
<h3>Por qué la mayoría de los números casi no importa</h3>
<p>En casi todas las imágenes, los píxeles vecinos se parecen, así que un bloque es sobre todo su promedio más unas pocas ondas suaves. Casi toda la energía de la imagen cae en unos pocos números grandes, y el resto son diminutos. Guarda los grandes, pon el resto a cero, y la imagen reconstruida se ve casi igual. Esa es la idea detrás de JPEG.</p>
<h3>Por qué el 10% equivocado la arruina</h3>
<p>Si en cambio tiras los números más grandes, aunque guardes el 90% del resto, lo que queda es polvo: los promedios y las formas principales han desaparecido. Importa mucho menos cuántos números guardas que cuáles.</p>
<h3>Por qué los bordes salen caros</h3>
<p>Un borde nítido o unas rayas finas están hechos de muchas ondas a la vez, así que «Cuadros» y «Anillos» necesitan muchos más números que «Atardecer» para la misma calidad. Si se tiran demasiados, quedan cuadrados toscos y ecos débiles junto a los bordes, las marcas de una foto demasiado comprimida.</p>
<h3>Lo que deja fuera esta sala</h3>
<p>El JPEG real también separa el brillo del color y guarda el color con menos detalle, redondea cada número a un paso fijado por una tabla (pasos más grandes para las ondas finas, que el ojo nota menos) y empaqueta el resultado con una codificación ingeniosa. Aquí simplemente guardamos los números más grandes de toda la imagen, sin redondear. Las piezas básicas y la sorpresa son las mismas.</p>
<details><summary>Las matemáticas, si te apetecen</summary><p>Cada bloque usa la transformada discreta del coseno bidimensional (DCT-II): la cantidad del patrón (u, v) es la suma, sobre el bloque, de los valores de los píxeles por C(u, y)·C(v, x), donde C(k, n) = a(k)·cos((2n + 1)kπ / 16), con a(0) = √(1/8) y a(k) = √(2/8) en los demás casos. Estos 64 patrones son ortonormales, así que la transformada inversa usa la misma tabla, y la suma de los cuadrados de los números es igual a la suma de los cuadrados de los píxeles. Por eso la «energía guardada» es exactamente la parte de esa suma que llevan los números que guardas. La diferencia que se muestra es la raíz de la media de los cuadrados de las diferencias de brillo, como parte del blanco total.</p></details>
<div class="sources"><a class="source-link" href="https://en.wikipedia.org/wiki/Discrete_cosine_transform" target="_blank" rel="noopener">Transformada discreta del coseno, Wikipedia (en inglés)</a><a class="source-link" href="https://en.wikipedia.org/wiki/JPEG" target="_blank" rel="noopener">JPEG, Wikipedia (en inglés)</a><a class="source-link" href="https://doi.org/10.1145/103085.103089" target="_blank" rel="noopener">Wallace, «The JPEG still picture compression standard», Communications of the ACM 34 (1991) (en inglés)</a><a class="source-link" href="https://mathshistory.st-andrews.ac.uk/Biographies/Fourier/" target="_blank" rel="noopener">Joseph Fourier, MacTutor (en inglés)</a></div>`,
  },
});
