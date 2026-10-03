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
        resumen: "¿Cómo se ve una promesa? En esta hackathon tuve que convertir un seguro educativo —algo que no se puede tocar— en objetos 3D que lo contaran sin palabras.",
        etiquetas: ["Blender", "Modelado", "Props", "Render"],
        historia: [
          { titulo: "El reto",
            texto: "Global Seguros planteó un desafío: representar su seguro educativo a través de props. Un seguro no tiene forma, así que el trabajo era encontrarle una que cualquiera pudiera reconocer de un vistazo." },
          { titulo: "La idea",
            texto: "Partí de objetos que todos asociamos con estudiar y los combiné con señales de protección y de futuro. Cada prop cuenta una parte de la misma promesa: que el camino educativo esté asegurado." },
          { titulo: "El proceso",
            texto: "Bocetos rápidos para fijar las siluetas, modelado en Blender, materiales y luz pensados para que todos los props se sintieran parte de una misma familia, y render final. Con el reloj de la hackathon encima, prioricé formas claras y una paleta coherente." },
          { titulo: "El resultado",
            texto: "Cinco props listos para presentar, que traducen un producto financiero en algo cercano, amable y fácil de entender." }
        ],
        medios: [
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/render-1.webp", alt: "Render 1 · Seguro educativo" },
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/render-2.webp", alt: "Render 2 · Seguro educativo" },
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/render-3.webp", alt: "Render 3 · Seguro educativo" },
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/render-4.webp", alt: "Render 4 · Seguro educativo" },
          { tipo: "imagen", src: "assets/proyectos/3d/seguro-educativo/render-5.webp", alt: "Render 5 · Seguro educativo" }
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
