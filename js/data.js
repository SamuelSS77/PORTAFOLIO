/* =========================================================
   DATOS DEL PORTAFOLIO
   Este es el ÚNICO archivo que necesitas editar para cambiar
   tu información, tus cartas y tus proyectos.
   ========================================================= */

const MAESTRO = {
  nombre: "Samu",
  alias: "El Maestro de Cartas",
  clase: "Estudiante de Creación Digital",
  universidad: "Universidad El Bosque",
  semestre: "4° semestre",
  nivel: 12,                         // tu "nivel" de Maestro (ej: años creando, edad creativa…)
  foto: "assets/SamuelFoto.png",     // PNG con fondo transparente (vacío = silueta)
  origen: "Ciudad, País",
  prologo: [
    "Todo maestro empieza con un mazo vacío. El mío se llenó carta a carta: cada herramienta que aprendí, cada proyecto que terminé y cada error que me obligó a mejorar.",
    "Hoy colecciono habilidades como creador digital. Cada carta de este mazo es una de ellas, con su nivel real de experiencia y las jugadas (proyectos) que la respaldan."
  ],
  correo: "tucorreo@ejemplo.com",
  redes: [
    { nombre: "Instagram", url: "https://instagram.com/" },
    { nombre: "Behance",   url: "https://behance.net/" },
    { nombre: "LinkedIn",  url: "https://linkedin.com/" }
  ]
};

/* ---------------------------------------------------------
   REGLAS DEL JUEGO (cómo leer cada carta)
   rareza  -> calidad / dominio de la skill
   nivel   -> experiencia acumulada (1 a 10 estrellas)
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
    nivel: 7,
    imagen: "",                       // ej: "assets/cartas/3d.jpg"
    stats: { creatividad: 85, tecnica: 80, velocidad: 60 },
    habilidades: [
      { nombre: "Modelado", herramienta: "Blender", poder: 80,
        desc: "Da forma a cualquier objeto o personaje desde un cubo." },
      { nombre: "Render final", herramienta: "Cycles", poder: 70,
        desc: "Ilumina y materializa la escena con acabado fotorrealista." }
    ],
    lema: "«Donde otros ven un cubo gris, yo veo un mundo esperando existir.»",
    proyectos: [
      { titulo: "Proyecto 3D 01", imagen: "", desc: "Descripción breve del proyecto.", link: "" },
      { titulo: "Proyecto 3D 02", imagen: "", desc: "Descripción breve del proyecto.", link: "" },
      { titulo: "Proyecto 3D 03", imagen: "", desc: "Descripción breve del proyecto.", link: "" }
    ]
  },
  {
    id: "composicion",
    numero: "002",
    nombre: "Composición",
    titulo: "El Guardián del Equilibrio",
    elemento: "armonia",
    rareza: "rara",
    nivel: 6,
    imagen: "",
    stats: { creatividad: 80, tecnica: 70, velocidad: 75 },
    habilidades: [
      { nombre: "Regla de tercios", herramienta: "Photoshop", poder: 60,
        desc: "Guía la mirada exactamente a donde debe ir." },
      { nombre: "Jerarquía visual", herramienta: "Illustrator", poder: 70,
        desc: "Ordena el caos para que cada elemento cuente su parte." }
    ],
    lema: "«Nada está donde está por casualidad.»",
    proyectos: [
      { titulo: "Proyecto Composición 01", imagen: "", desc: "Descripción breve del proyecto.", link: "" },
      { titulo: "Proyecto Composición 02", imagen: "", desc: "Descripción breve del proyecto.", link: "" }
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
