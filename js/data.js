/* =========================================================
   DATOS DEL PORTAFOLIO
   Este es el ÚNICO archivo que necesitas editar para cambiar
   tu información, tus cartas y tus proyectos.
   ========================================================= */

const MAESTRO = {
  nombre: "Samu",
  nombreCompleto: "Samuel Santiago Silva Largo",
  alias: "El Maestro de Cartas",
  clase: "Estudiante de Creación Digital",
  universidad: "Universidad El Bosque",
  semestre: "4° semestre",
  nivel: 4,                          // nivel de Maestro = semestre que cursa
  foto: "assets/SamuelFoto.png",     // PNG con fondo transparente (vacío = silueta)
  fotoReal: "assets/SamuelFotoReal.png", // foto real para la carta del Prólogo (vacío = usa "foto")
  origen: "Bogotá, Colombia",
  prologo: [
    "Todo maestro empieza con un mazo vacío. El mío se ha ido llenando carta a carta durante mis cuatro semestres de Creación Digital en la Universidad El Bosque: cada herramienta de diseño, modelado o código que aprendí, cada proyecto que terminé y cada error que me obligó a evolucionar.",
    "Hoy colecciono habilidades con un propósito. Cada carta de este mazo representa lo que aporto a la mesa, con su nivel real de experiencia y las jugadas (proyectos) que la respaldan. Sin embargo, mis cartas más valiosas no son solo técnicas: son mi responsabilidad, mi afán por proponer ideas revolucionarias y mi forma de jugar en equipo. Sé leer la mesa, escuchar activamente, comunicarme desde el respeto y usar mi mano siempre con la intención de impulsar a quienes trabajan a mi lado.",
    "Mi objetivo es plasmar mi esencia en cada reto, adaptando mi estrategia y mi mazo exactamente a lo que la partida necesite."
  ],
  correo: "samuelsantiagosilvalargo@gmail.com",
  asuntoCorreo: "Reto para el Maestro de Cartas: propuesta de proyecto",
  telefono: "+573124184684",          // formato internacional para el enlace tel:
  telefonoTexto: "312 418 4684",      // como se muestra en pantalla
  contactoVcf: "assets/samuel-silva.vcf", // tarjeta de contacto (si cambias número/correo, cámbialos también ahí)
  redes: [
    { nombre: "Instagram", url: "https://www.instagram.com/samuelx08_/" },
    { nombre: "Behance",   url: "https://www.behance.net/samuelsilval2" },
    { nombre: "LinkedIn",  url: "https://co.linkedin.com/in/samuel-santiago-silva-largo-044745339" }
  ]
};

/* ---------------------------------------------------------
   REGLAS DEL JUEGO (cómo leer cada carta)
   rareza  -> calidad / dominio de la skill
   nivel   -> experiencia acumulada (1 a 5 estrellas)
   stats   -> 0 a 100
   --------------------------------------------------------- */
const RAREZAS = {
  comun:      { nombre: "Común",      desc: "La estoy aprendiendo. Practico y experimento." },
  rara:       { nombre: "Rara",       desc: "La domino lo suficiente para entregar proyectos reales." },
  epica:      { nombre: "Épica",      desc: "Es una de mis fortalezas: resultados profesionales y consistentes." },
  legendaria: { nombre: "Legendaria", desc: "Mi especialidad. Aquí es donde más destaco." }
};

const STATS = {
  creatividad: "Creatividad — ideas, estilo y propuesta visual",
  tecnica:     "Técnica — dominio de herramientas y procesos",
  velocidad:   "Velocidad — rapidez de producción sin perder calidad"
};

const ELEMENTOS = {
  forma:    { nombre: "Forma",    icono: "◆" },
  armonia:  { nombre: "Armonía",  icono: "✦" },
  movimiento: { nombre: "Movimiento", icono: "➤" },
  sonido:   { nombre: "Sonido",   icono: "♪" }
};

/* ---------------------------------------------------------
   EL MAZO
   Para añadir una carta, copia un bloque { ... } y cámbialo.
   bloqueada: true  -> se muestra boca abajo como "próxima expansión"
   --------------------------------------------------------- */
const CARTAS = [
  {
    id: "3d",
    numero: "001",
    nombre: "3D",
    titulo: "El Escultor de Mundos",
    elemento: "forma",
    rareza: "epica",
    nivel: 4,
    imagen: "",                       // ej: "assets/cartas/3d.jpg"
    stats: { creatividad: 85, tecnica: 80, velocidad: 60 },
    habilidades: [
      { nombre: "Modelado", herramienta: "Blender", poder: 80,
        desc: "Da forma a cualquier objeto o personaje desde un cubo." },
      { nombre: "Render final", herramienta: "Cycles", poder: 70,
        desc: "Ilumina y materializa la escena con acabado fotorrealista." }
    ],
    lema: "«Donde otros ven un cubo gris, yo veo un mundo esperando existir.»",
    /* Jugadas con historia:
       grupo     -> agrupa las jugadas bajo un subtítulo dentro de la carta
       historia  -> fases de la historia (título + texto)
       medios    -> { tipo: "imagen", src, alt }  o  { tipo: "video", src (mp4), poster (jpg/webp), alt }
       Si el archivo aún no existe, se muestra un recuadro "pendiente" en su lugar. */
    proyectos: [
      {
        grupo: "Props",
        titulo: "Seguro educativo",
        contexto: "Hackathon · Global Seguros",
        resumen: "¿Cómo se ve una promesa? En esta hackathon, dentro de un equipo, mi parte fue el 3D: convertir un seguro educativo —algo que no se puede tocar— en objetos que lo contaran sin palabras.",
        etiquetas: ["Blender", "Cycles", "Modelado", "Props", "Trabajo en equipo"],
        historia: [
          { titulo: "El reto",
            texto: "Global Seguros planteó un desafío: representar su seguro educativo. Lo enfrentamos en equipo y yo me encargué de los props 3D. Un seguro no tiene forma, así que mi trabajo era encontrarle una que cualquiera pudiera reconocer de un vistazo." },
          { titulo: "La idea",
            texto: "Si el seguro acompaña toda la vida educativa, los props tenían que contar esa vida. Elegí cinco objetos, uno por etapa: el chupete, el día en que todo empieza y la protección ya está ahí; la mochila, los primeros años de colegio; el escritorio, las horas de estudio; el globo terráqueo, la curiosidad que lleva a la universidad y al mundo; y la medalla, la meta cumplida." },
          { titulo: "El proceso",
            texto: "Bocetos rápidos para fijar las siluetas y modelado en Blender y render en Cycles. Para que los cinco se sintieran una misma familia les di una paleta común —azul, rojo coral y dorado—, acabados brillantes y amables, y los presenté flotando sobre un fondo gris neutro, como piezas de una colección. Con el reloj de la hackathon encima, prioricé formas claras que se entendieran de un vistazo." },
          { titulo: "El resultado",
            texto: "Cinco props que, puestos en fila, cuentan una historia completa: de la cuna a la meta. Un producto financiero convertido en algo cercano, cálido y fácil de entender." }
        ],
        medios: [
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/1-chupete.jpg",    alt: "Chupete · El comienzo" },
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/2-mochila.jpg",    alt: "Mochila · Los primeros años de colegio" },
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/3-escritorio.jpg", alt: "Escritorio · Las horas de estudio" },
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/4-globo.jpg",      alt: "Globo terráqueo · La universidad y el mundo" },
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/5-medalla.jpg",    alt: "Medalla · La meta cumplida" }
        ]
      },
      {
        grupo: "Animaciones",
        titulo: "La pelota que rebota",
        contexto: "Clase de modelado 3D",
        resumen: "El primer hechizo de todo animador: darle vida a una pelota.",
        etiquetas: ["Blender", "Animación", "Timing"],
        historia: [
          { titulo: "Por qué una pelota",
            texto: "Parece el ejercicio más simple, pero en un solo rebote caben los principios de la animación: el peso que la hace caer, el squash & stretch al tocar el suelo, el timing que acelera y frena, y los arcos que dibuja en el aire. Si la pelota no se siente real, nada de lo que venga después lo hará." }
        ],
        medios: [
          { tipo: "video", src: "assets/proyectos/3d/animacion/pelota.mp4", poster: "assets/proyectos/3d/animacion/pelota.webp", alt: "Animación de una pelota rebotando" }
        ]
      },
      {
        grupo: "Animaciones",
        titulo: "Personaje en movimiento",
        contexto: "Clase de modelado 3D",
        resumen: "Del rebote a la intención: cuando lo que se mueve tiene que parecer que piensa.",
        etiquetas: ["Blender", "Animación", "Personaje"],
        historia: [
          { titulo: "El siguiente nivel",
            texto: "Con las bases de la pelota dominadas, el reto fue un personaje. Aquí ya no basta con que algo caiga bien: cada pose tiene que comunicar. Trabajé poses clave, anticipación antes de cada acción y el seguimiento del cuerpo después de ella, para que el movimiento se leyera como una decisión y no como un mecanismo." }
        ],
        medios: [
          { tipo: "video", src: "assets/proyectos/3d/animacion/personaje.mp4", poster: "assets/proyectos/3d/animacion/personaje.webp", alt: "Animación de un personaje" }
        ]
      }
    ]
  },
  {
    id: "composicion",
    numero: "002",
    nombre: "Composición",
    titulo: "El Guardián del Equilibrio",
    elemento: "armonia",
    rareza: "rara",
    nivel: 3,
    imagen: "",
    stats: { creatividad: 80, tecnica: 70, velocidad: 75 },
    habilidades: [
      { nombre: "Equilibrio visual", herramienta: "Photoshop", poder: 60,
        desc: "Distribuye cada elemento para que la mirada fluya con armonía." },
      { nombre: "Jerarquía visual", herramienta: "Illustrator", poder: 70,
        desc: "Ordena el caos para que cada elemento cuente su parte." }
    ],
    lema: "«Nada está donde está por casualidad.»",
    proyectos: [
      {
        grupo: "Publicidad",
        titulo: "The North Face: rediseño de un anuncio",
        contexto: "Clase de composición",
        resumen: "Desarmar un anuncio para entender por qué funciona… y volver a armarlo mejor.",
        etiquetas: ["Composición", "Dirección de arte", "Photoshop"],
        historia: [
          { titulo: "El punto de partida",
            texto: "Partí de un anuncio de The North Face, una marca que vende algo más que ropa: la sensación de estar frente a lo imposible. La pregunta era si su composición transmitía esa idea con toda la fuerza que podía." },
          { titulo: "La lectura",
            texto: "Lo analicé pieza por pieza: hacia dónde va primero la mirada, qué elemento pesa más, cómo se reparte el espacio y qué tan rápido se entiende el mensaje. Ahí aparecieron las decisiones que podían mejorar." },
          { titulo: "El rediseño",
            texto: "Con ese diagnóstico reorganicé el anuncio: una jerarquía más clara, un punto focal dominante y un recorrido visual que lleva de la imagen a la marca sin distracciones." },
          { titulo: "El resultado",
            texto: "Un anuncio que se lee en un vistazo y conserva el espíritu de la marca. Todo el proceso, paso a paso, está en las diapositivas." }
        ],
        galerias: [
          { titulo: "El anuncio rediseñado", disposicion: "piezas", medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/anuncio-final.webp", alt: "Anuncio rediseñado · The North Face" }
          ] },
          { titulo: "El proceso en 6 diapositivas", disposicion: "presentacion", despues: true, medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-1.webp", alt: "Diapositiva 1 · Proceso The North Face" },
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-2.webp", alt: "Diapositiva 2 · Proceso The North Face" },
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-3.webp", alt: "Diapositiva 3 · Proceso The North Face" },
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-4.webp", alt: "Diapositiva 4 · Proceso The North Face" },
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-5.webp", alt: "Diapositiva 5 · Proceso The North Face" },
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-6.webp", alt: "Diapositiva 6 · Proceso The North Face" }
          ] }
        ]
      },
      {
        grupo: "Campaña",
        titulo: "Lanzamiento de una serie",
        contexto: "Proyecto en equipos",
        resumen: "Antes de que algo exista, hay que hacer que la gente lo espere. Diseñamos la campaña para lanzar una serie: primero la expectativa, después la revelación.",
        etiquetas: ["Composición", "Campaña", "Trabajo en equipo"],
        historia: [
          { titulo: "El encargo",
            texto: "En la carrera creamos una serie entre varios equipos, y había que darla a conocer. El reto no era solo diseñar piezas bonitas, sino construir una campaña con un orden: cada pieza tenía que preparar a la siguiente." },
          { titulo: "La expectativa",
            texto: "Las piezas de expectativa muestran poco a propósito. Juegan con lo que se oculta, con el espacio vacío y con un detalle que despierta la pregunta. La composición dirige la mirada hacia aquello que todavía no se explica." },
          { titulo: "El lanzamiento",
            texto: "La pieza de lanzamiento resuelve la intriga: aquí todo se revela y la jerarquía cambia. El título y la promesa de la serie pasan al frente, conservando el lenguaje visual que construyeron las piezas anteriores para que el público reconozca que todo era parte de lo mismo." },
          { titulo: "El resultado",
            texto: "Una campaña coherente de principio a fin, donde cada pieza tiene un papel distinto pero todas hablan el mismo idioma." }
        ],
        galerias: [
          { titulo: "Expectativa", disposicion: "piezas", medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/serie/expectativa-1.webp", alt: "Pieza de expectativa 1" },
            { tipo: "imagen", src: "assets/proyectos/composicion/serie/expectativa-2.webp", alt: "Pieza de expectativa 2" }
          ] },
          { titulo: "Lanzamiento", disposicion: "piezas", medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/serie/lanzamiento.webp", alt: "Pieza de lanzamiento" }
          ] }
        ]
      }
    ]
  },
  {
    id: "proxima-1",
    numero: "003",
    nombre: "???",
    bloqueada: true,
    pista: "Próxima expansión"
  }
];
