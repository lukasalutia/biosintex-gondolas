// Biosintex RAG inline knowledge base — injected as system prompt

export const PORTFOLIO = {
  otc: {
    hereos: [
      {
        sku: 'Bucoangin N Limón',
        categoria: 'Antiséptico bucal',
        descripcion: 'Pastillas antisépticas con sabor limón, acción analgésica y antiséptica para garganta',
        frentes: { A: 4, B: 3, C: 2 },
        clasificacion: 'Héroe',
        posicionIdeal: 'zona_oro',
      },
      {
        sku: 'Ibulgia suspensión',
        categoria: 'Analgésico/Antifebril',
        descripcion: 'Suspensión de ibuprofeno pediátrico, analgésico y antifebril de alta rotación',
        frentes: { A: 4, B: 3, C: 2 },
        clasificacion: 'Héroe',
        posicionIdeal: 'zona_oro',
      },
    ],
    infaltables: [
      {
        sku: 'Bucoangin N Miel',
        categoria: 'Antiséptico bucal',
        descripcion: 'Pastillas antisépticas con sabor miel, complemento natural de la línea Bucoangin',
        frentes: { A: 3, B: 2, C: 1 },
        clasificacion: 'Infaltable',
        posicionIdeal: 'zona_oro',
      },
      {
        sku: 'Tavinex jarabe',
        categoria: 'Antihistamínico',
        descripcion: 'Jarabe antihistamínico pediátrico, indicado para rinitis alérgica y urticaria',
        frentes: { A: 3, B: 2, C: 1 },
        clasificacion: 'Infaltable',
        posicionIdeal: 'zona_plata',
      },
      {
        sku: 'Lacrigestina',
        categoria: 'Oftalmología',
        descripcion: 'Gotas oftálmicas lubricantes, alivio del ojo seco, alta frecuencia de uso',
        frentes: { A: 2, B: 2, C: 1 },
        clasificacion: 'Infaltable',
        posicionIdeal: 'zona_oro',
      },
    ],
    innovacion: [
      {
        sku: 'Bucoangin Forte s/a (x sabor)',
        categoria: 'Antiséptico bucal',
        descripcion: 'Versión Forte sin azúcar, disponible en múltiples sabores — contar frentes por sabor individual',
        frentes: { A: 2, B: 1, C: 0 },
        clasificacion: 'Innovación',
        posicionIdeal: 'zona_plata',
        nota: 'Los frentes son por sabor individual. En Tienda C no es requerido.',
      },
      {
        sku: 'Ginezolex',
        categoria: 'Ginecología',
        descripcion: 'Antifúngico ginecológico de amplio espectro, tratamiento de candidiasis vaginal',
        frentes: { A: 2, B: 1, C: 0 },
        clasificacion: 'Innovación',
        posicionIdeal: 'zona_plata',
      },
      {
        sku: 'Venzidiak',
        categoria: 'Gastroenterología',
        descripcion: 'Antidiarreico de acción rápida, tratamiento sintomático de diarrea aguda',
        frentes: { A: 2, B: 1, C: 0 },
        clasificacion: 'Innovación',
        posicionIdeal: 'zona_plata',
      },
    ],
    totalFrentes: { A: 22, B: 15, C: 7 },
  },

  cosmetica: {
    hereos: [
      {
        sku: 'Midermus Ordeñe 270ml',
        categoria: 'Emoliente corporal',
        descripcion: 'Crema emoliente con proteínas de leche, hidratación profunda para piel seca y muy seca, formato 270ml',
        frentes: { A: 4, B: 3, C: 2 },
        clasificacion: 'Héroe',
        posicionIdeal: 'zona_oro',
      },
      {
        sku: 'Vitamidermus Facial FPS50',
        categoria: 'Protección solar facial',
        descripcion: 'Crema facial con vitaminas y factor de protección solar 50, uso diario antiedad y fotoprotección',
        frentes: { A: 4, B: 3, C: 2 },
        clasificacion: 'Héroe',
        posicionIdeal: 'zona_oro',
      },
    ],
    infaltables: [
      {
        sku: 'Midermus Ultra Fluida',
        categoria: 'Emoliente corporal',
        descripcion: 'Versión ultra fluida de Midermus, textura liviana de rápida absorción para pieles normales a secas',
        frentes: { A: 3, B: 2, C: 1 },
        clasificacion: 'Infaltable',
        posicionIdeal: 'zona_oro',
      },
      {
        sku: 'Vitamidermus Reparadora (línea)',
        categoria: 'Reparación cutánea',
        descripcion: 'Línea de cremas reparadoras con vitaminas A, E y F, indicada para pieles dañadas y dermatitis',
        frentes: { A: 3, B: 2, C: 1 },
        clasificacion: 'Infaltable',
        posicionIdeal: 'zona_plata',
        nota: 'Contar los frentes totales de la línea completa (puede incluir varias presentaciones)',
      },
    ],
    innovacion: [
      {
        sku: 'Midermus DBT',
        categoria: 'Dermocosmética especializada',
        descripcion: 'Formulación especial para piel diabética, hidratante intensiva con urea y pantenol',
        frentes: { A: 2, B: 1, C: 0 },
        clasificacion: 'Innovación',
        posicionIdeal: 'zona_plata',
      },
      {
        sku: 'Midermus Caléndula',
        categoria: 'Emoliente natural',
        descripcion: 'Crema emoliente con extracto de caléndula, suave para pieles sensibles y bebés',
        frentes: { A: 2, B: 1, C: 0 },
        clasificacion: 'Innovación',
        posicionIdeal: 'zona_plata',
      },
      {
        sku: 'Midermus Piernas Livianas',
        categoria: 'Circulación venosa',
        descripcion: 'Crema con principios activos para alivio de pesadez e hinchazón de piernas, efecto frío',
        frentes: { A: 2, B: 1, C: 0 },
        clasificacion: 'Innovación',
        posicionIdeal: 'zona_plata',
      },
    ],
    totalFrentes: { A: 20, B: 13, C: 6 },
  },
};

export const TIENDAS = {
  A: {
    descripcion: 'Cadenas y farmacias de alto volumen',
    ejemplos: 'Farmacity, Dr. Ahorro, farmacias de cadena regional, farmacias con múltiples sucursales',
    caracteristicas: 'Góndolas amplias, más de 3 lineales Biosintex, alta rotación, personal capacitado',
  },
  B: {
    descripcion: 'Farmacias medianas independientes o de pequeña cadena',
    ejemplos: 'Farmacias independientes de barrio con local amplio, pequeñas cadenas de 2-5 sucursales',
    caracteristicas: 'Góndolas medianas, 2-3 lineales Biosintex, rotación media',
  },
  C: {
    descripcion: 'Farmacias pequeñas o quioscos farmacéuticos',
    ejemplos: 'Farmacias de barrio chicas, dietéticas con sección farmacéutica, puntos de venta pequeños',
    caracteristicas: 'Espacio reducido, 1 lineal o menos, surtido básico',
  },
};

export const FARMACIA_PERFECTA = {
  zonasGondola: {
    oro: {
      altura: '130–160 cm',
      nombre: 'Zona de Oro / Nivel Ojos',
      descripcion: 'Máxima visibilidad e impacto de compra. Productos Héroes obligatorios aquí.',
      prioridad: 1,
    },
    plata: {
      altura: '80–130 cm',
      nombre: 'Zona de Plata / Nivel Manos',
      descripcion: 'Alta visibilidad, fácil alcance. Productos Infaltables y algunos Héroes.',
      prioridad: 2,
    },
    bronce: {
      altura: '< 80 cm',
      nombre: 'Zona de Bronce / Nivel Pies',
      descripcion: 'Visibilidad reducida. Productos Innovación o formatos grandes.',
      prioridad: 3,
    },
    cabeza: {
      altura: '> 160 cm',
      nombre: 'Zona Alta / Nivel Cabeza',
      descripcion: 'Mínima visibilidad. No recomendada para Héroes ni Infaltables.',
      prioridad: 4,
    },
  },
  criteriosEjecucion: {
    bloqueoMarca: 'Todos los SKUs Biosintex deben estar agrupados juntos, sin productos de competencia intercalados.',
    puntaCaliente: 'El producto Héroe de mayor rotación ocupa el punto caliente (zona de oro, extremo derecho del bloque visible al flujo de clientes).',
    facingCompleto: 'Los frentes deben estar completos y llenos. Sin huecos ni faltantes.',
    etiquetasPrecio: 'Todos los productos deben tener su etiqueta de precio visible, legible y actualizada.',
    ordenLinea: 'Primero Héroes, luego Infaltables, luego Innovación. De izquierda a derecha o de arriba a abajo según orientación de góndola.',
    limpieza: 'Góndola limpia, sin polvo, sin envases rotos o vencidos.',
    materialPOP: {
      obligatorio: ['Cenefa de góndola con logo Biosintex', 'Stopper o wobbler en producto Héroe'],
      deseable: ['Display vertical de marca', 'Impulsores en mostrador', 'Rompe-tráfico'],
    },
  },
  criteriosEvaluacion: {
    otc: [
      'Presencia y frentes Héroes (Bucoangin N Limón, Ibulgia)',
      'Presencia y frentes Infaltables (Bucoangin N Miel, Tavinex, Lacrigestina)',
      'Posicionamiento en zona de oro (nivel ojos)',
      'Bloqueo de marca (SKUs Biosintex agrupados)',
      'Etiquetas de precio completas y visibles',
      'Material POP presente (cenefa, stopper/wobbler)',
      'Orden y limpieza del lineal',
    ],
    cosmetica: [
      'Presencia y frentes Héroes (Midermus Ordeñe, Vitamidermus FPS50)',
      'Presencia y frentes Infaltables (Ultra Fluida, Vitamidermus Reparadora)',
      'Posicionamiento en zona de oro (nivel ojos)',
      'Bloqueo de marca (Midermus y Vitamidermus agrupados)',
      'Etiquetas de precio completas y visibles',
      'Material POP presente (cenefa, exhibidor)',
      'Orden y limpieza del lineal',
    ],
  },
};

export function buildSystemPrompt() {
  const otcHeroes = PORTFOLIO.otc.hereos.map(p =>
    `  • ${p.sku} [${p.clasificacion}] — Frentes mínimos: A=${p.frentes.A}, B=${p.frentes.B}, C=${p.frentes.C}`
  ).join('\n');
  const otcInfalt = PORTFOLIO.otc.infaltables.map(p =>
    `  • ${p.sku} [${p.clasificacion}] — Frentes mínimos: A=${p.frentes.A}, B=${p.frentes.B}, C=${p.frentes.C}${p.nota ? ' (' + p.nota + ')' : ''}`
  ).join('\n');
  const otcInnov = PORTFOLIO.otc.innovacion.map(p =>
    `  • ${p.sku} [${p.clasificacion}] — Frentes mínimos: A=${p.frentes.A}, B=${p.frentes.B}, C=${p.frentes.C}${p.nota ? ' (' + p.nota + ')' : ''}`
  ).join('\n');

  const cosHeroes = PORTFOLIO.cosmetica.hereos.map(p =>
    `  • ${p.sku} [${p.clasificacion}] — Frentes mínimos: A=${p.frentes.A}, B=${p.frentes.B}, C=${p.frentes.C}`
  ).join('\n');
  const cosInfalt = PORTFOLIO.cosmetica.infaltables.map(p =>
    `  • ${p.sku} [${p.clasificacion}] — Frentes mínimos: A=${p.frentes.A}, B=${p.frentes.B}, C=${p.frentes.C}${p.nota ? ' (' + p.nota + ')' : ''}`
  ).join('\n');
  const cosInnov = PORTFOLIO.cosmetica.innovacion.map(p =>
    `  • ${p.sku} [${p.clasificacion}] — Frentes mínimos: A=${p.frentes.A}, B=${p.frentes.B}, C=${p.frentes.C}`
  ).join('\n');

  return `Sos el sistema de auditoría de góndola de Biosintex, laboratorio farmacéutico argentino. Tu rol es analizar fotos de góndolas en farmacias y evaluar el cumplimiento de los estándares de Farmacia Perfecta de Biosintex.

REGLA ABSOLUTA: respondés ÚNICAMENTE con el objeto JSON solicitado. Sin texto antes, sin texto después, sin explicaciones, sin disculpas, sin markdown, sin bloques de código. Solo el JSON puro empezando con { y terminando con }.

## PORTFOLIO BIOSINTEX

### LÍNEA OTC (Medicinal)
Héroes (máxima prioridad, obligatorios en zona de oro):
${otcHeroes}
Infaltables (alta prioridad):
${otcInfalt}
Innovación (presencia deseable según tipo de tienda):
${otcInnov}
TOTAL FRENTES OTC: Tienda A=22, Tienda B=15, Tienda C=7

### LÍNEA COSMÉTICA (Midermus / Vitamidermus)
Héroes (máxima prioridad, obligatorios en zona de oro):
${cosHeroes}
Infaltables (alta prioridad):
${cosInfalt}
Innovación (presencia deseable según tipo de tienda):
${cosInnov}
TOTAL FRENTES COSMÉTICA: Tienda A=20, Tienda B=13, Tienda C=6

## CLASIFICACIÓN DE TIENDAS
- Tienda A: Cadenas (Farmacity, Dr. Ahorro, cadenas regionales). Góndolas grandes, alto volumen.
- Tienda B: Farmacias medianas independientes o pequeña cadena (2-5 bocas). Rotación media.
- Tienda C: Farmacias pequeñas de barrio, espacio reducido, surtido básico.

## PERSPECTIVA DE EVALUACIÓN — MUY IMPORTANTE

Evaluás desde la perspectiva del LABORATORIO BIOSINTEX, no de la farmacia. Lo que importa es: **¿el vendedor logró que esta farmacia le dé visibilidad a los productos Biosintex?** La estética general de la farmacia, la iluminación, el mobiliario o la arquitectura del local NO son responsabilidad del vendedor y NO deben penalizar el puntaje.

### Lo que SÍ evalúa Biosintex (alto impacto en puntaje):
1. **Bloqueo de marca** — todos los SKUs Biosintex agrupados juntos, sin competencia intercalada (peso alto)
2. **Frentes de Héroes** — cantidad de frentes visibles vs tabla de frentes mínimos (peso alto)
3. **Presencia de Infaltables** — todos los SKUs requeridos para ese tipo de tienda (peso alto)
4. **Posicionamiento en zona de oro** — productos Héroes a nivel ojos (peso alto)
5. **Material POP** — cenefa de marca, stopper, exhibidor propio (peso medio)
6. **Orden dentro del bloque Biosintex** — Héroes→Infaltables→Innovación (peso medio)
7. **Limpieza del lineal** — sin envases rotos o vencidos (peso bajo)
8. **Etiquetas de precio** — peso MUY BAJO, no es responsabilidad del vendedor de laboratorio, máximo 0.5 puntos de impacto

### Calibración de puntajes para Tienda A (referencia):
- **9–10**: Bloqueo de marca perfecto, todos los Héroes en zona de oro con frentes completos, todos los Infaltables presentes, cenefa y material POP visibles, cero huecos
- **8**: Bloqueo completo, Héroes en zona de oro, algún Infaltable con frentes por debajo del mínimo o faltante leve de POP
- **7**: Bloqueo mayormente respetado, Héroes presentes pero con frentes insuficientes, o algún Infaltable ausente
- **5–6**: Productos Biosintex visibles pero bloqueo incompleto o Héroes en zona incorrecta
- **3–4**: Presencia mínima de Biosintex, sin bloqueo de marca claro
- **1–2**: Casi sin productos Biosintex visibles

Para Tienda B y C aplicar la misma escala pero contra los frentes mínimos de su tabla correspondiente.

## ESTÁNDARES FARMACIA PERFECTA

### Zonas de góndola:
- Zona de Oro (130–160 cm): nivel ojos → OBLIGATORIO para Héroes
- Zona de Plata (80–130 cm): nivel manos → Infaltables
- Zona de Bronce (< 80 cm): nivel pies → Innovación o formatos grandes
- Zona Alta (> 160 cm): nivel cabeza → mínima visibilidad, evitar Héroes

### Material POP Biosintex:
- Obligatorio: cenefa de góndola con marca Biosintex/Midermus/Vitamidermus, stopper o wobbler
- Deseable: display vertical, impulsores en mostrador, rompe-tráfico

## TU TAREA
Al recibir las fotos de la góndola:
1. Detectá si la góndola es OTC, cosmética o mixta
2. Determiná el tipo de tienda (A, B o C)
3. Identificá todos los SKUs Biosintex visibles y contá sus frentes en TODAS las fotos combinadas
4. Evaluá desde la perspectiva del laboratorio: ¿qué visibilidad logró el vendedor?
5. Devolvé ÚNICAMENTE el JSON con la estructura solicitada`;
}

export function buildUserPrompt(farmacia, tipoTiendaDeclarado, notas, cantFotos = 1, historialPrevio = null) {
  const tiendaInstr = tipoTiendaDeclarado
    ? `DATO CONFIRMADO POR EL VENDEDOR: esta es una Tienda ${tipoTiendaDeclarado} (${
        tipoTiendaDeclarado === 'A' ? 'cadena / alto volumen' :
        tipoTiendaDeclarado === 'B' ? 'farmacia mediana independiente' :
        'farmacia pequeña / bajo volumen'
      }). Usá "tipoTienda": "${tipoTiendaDeclarado}" en tu respuesta y aplicá los frentes mínimos de Tienda ${tipoTiendaDeclarado}.`
    : `Determiná el tipo de tienda (A, B o C) observando el tamaño y características visibles de la farmacia.`;

  const notasInstr = notas
    ? `\nObservaciones del vendedor: "${notas}". Tené en cuenta este contexto al evaluar.`
    : '';

  const historialInstr = historialPrevio?.length > 0
    ? `\n\n## HISTORIAL PREVIO DE ESTA FARMACIA
Visitas anteriores del equipo Biosintex a "${farmacia}" (de más reciente a más antigua):
${historialPrevio.map(h => {
  const criterioBajo = [...(h.analisis.criterios || [])].sort((a, b) => a.puntaje - b.puntaje)[0];
  const faltantes = (h.analisis.skusFaltantes || []).join(', ') || 'ninguno';
  return `- ${h.fecha.split('T')[0]}: Puntaje ${h.analisis.puntajeTotal}/10 | Faltantes: ${faltantes}${criterioBajo ? ` | Criterio más bajo: ${criterioBajo.nombre} (${criterioBajo.puntaje}/10)` : ''}`;
}).join('\n')}
Mencioná en el resumenGeneral si hay mejora, retroceso o estancamiento respecto a visitas previas, y ajustá las accionesPrioritarias considerando qué problemas son recurrentes.`
    : '';

  const fotasInstr = cantFotos > 1
    ? `Se envían ${cantFotos} fotos de la misma góndola desde distintos ángulos. Analizalas en conjunto para tener una visión completa.`
    : `Se envía 1 foto de la góndola.`;

  return `Analizá la góndola de la farmacia "${farmacia}". ${fotasInstr}
${tiendaInstr}${notasInstr}${historialInstr}

Recordá: evaluás desde la perspectiva del LABORATORIO BIOSINTEX. Lo que importa es la visibilidad lograda para los productos Biosintex, no la estética de la farmacia. Las etiquetas de precio tienen peso MUY BAJO (máximo 0.5 puntos de impacto en el puntaje total).

Devolvé ÚNICAMENTE este JSON (sin markdown, sin texto adicional):

{
  "tipoGondola": "otc|cosmetica|mixta",
  "tipoTienda": "A|B|C",
  "razonTipoTienda": "<por qué determinaste ese tipo>",
  "puntajeTotal": <0-10>,
  "productosDetectados": [
    {
      "sku": "<nombre exacto del SKU Biosintex>",
      "frentesVisibles": <número>,
      "frentesMinimos": <número según tipo de tienda>,
      "cumple": true|false,
      "zona": "oro|plata|bronce|cabeza|desconocida",
      "clasificacion": "Héroe|Infaltable|Innovación"
    }
  ],
  "skusFaltantes": ["<SKU que debería estar pero no se ve según tabla de frentes>"],
  "criterios": [
    {
      "nombre": "<nombre del criterio>",
      "puntaje": <0-10>,
      "observacion": "<qué se observa>",
      "recomendacion": "<acción concreta del vendedor>"
    }
  ],
  "accionesPrioritarias": ["<acción 1>", "<acción 2>", "<acción 3>"],
  "resumenGeneral": "<párrafo ejecutivo desde la perspectiva del laboratorio>"
}

Los criterios DEBEN ser exactamente estos (en este orden), con los pesos indicados al calcular el puntajeTotal:
- Para OTC: "Bloqueo de Marca" (peso alto), "Frentes Héroes OTC" (peso alto), "Presencia Infaltables OTC" (peso alto), "Posicionamiento en Góndola" (peso alto), "Material POP" (peso medio), "Orden y Limpieza" (peso bajo), "Etiquetas y Precios" (peso MUY BAJO — máx 0.5 pts de impacto)
- Para Cosmética: "Bloqueo de Marca" (peso alto), "Frentes Héroes Cosmética" (peso alto), "Presencia Infaltables Cosmética" (peso alto), "Posicionamiento en Góndola" (peso alto), "Material POP" (peso medio), "Orden y Limpieza" (peso bajo), "Etiquetas y Precios" (peso MUY BAJO)
- Para Mixta: los criterios de ambas líneas más "Separación de Líneas" (peso medio)

Si no podés identificar un SKU con certeza, no lo incluyas en productosDetectados.

IMPORTANTE: tu respuesta debe ser ÚNICAMENTE el JSON. Nada más. Empezá directamente con { y terminá con }.`;
}
