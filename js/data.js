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
  asuntoCorreo: "Oportunidad para Samuel Silva",
  telefono: "+573124184684",          // formato internacional para el enlace tel:
  telefonoTexto: "312 418 4684",      // como se muestra en pantalla
  contactoVcf: "assets/samuel-silva.vcf", // tarjeta de contacto (si cambias número/correo, cámbialos también ahí)
  redes: [
    { nombre: "Instagram", url: "https://www.instagram.com/samuelx08_/" },
    { nombre: "Behance",   url: "https://www.behance.net/samuelsilval2" },
    { nombre: "LinkedIn",  url: "https://co.linkedin.com/in/samuel-santiago-silva-largo-044745339" },
    { nombre: "GitHub",    url: "https://github.com/SamuelSS77" }
  ],
  // Botón de contacto del hero, enlace "Contact" del menú y la ventana que abren.
  // Otras ideas para el botón: "Hablemos de tu proyecto", "Sumemos fuerzas", "Armemos el equipo".
  cta: {
    boton: "Juguemos en equipo",
    eyebrow: "Contacto",
    titulo: "Juguemos en equipo",
    lead: "Elige cómo conectamos:"
  },
  // Capítulo V: cierre "La mano final" (sin botón). En el título, la última palabra va en lima.
  cierre: {
    eyebrow: "Capítulo V · La mano final",
    titulo: "Esta es mi baraja",
    texto: "Estas son las cartas que juego hoy, y vienen más. Si alguna encaja en tu equipo, conversemos."
  }
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
       medios    -> { tipo: "imagen", src, alt }  o  { tipo: "video", src (mp4 H.264), poster (jpg/webp), alt }
                    (video: srcWebm opcional, se ofrece primero: útil para navegadores sin H.264)
       portada   -> (opcional) imagen de la mini-carta; si no, la 1ª imagen de sus medios o el poster del 1er video
       portadaPos-> (opcional) "top", "center" o "bottom": qué parte de la portada se ve si hay que recortarla
       ficha     -> (opcional) ficha técnica de la jugada: { rol, herramientas: [..], tiempo, equipo }.
                    Las celdas vacías ("" o []) no se muestran; "Contexto" sale de contexto.
       Si el archivo aún no existe, se muestra un recuadro "pendiente" en su lugar. */
    proyectos: [
      {
        grupo: "Props",
        titulo: "Seguro educativo",
        contexto: "Hackathon · Global Seguros",
        portada: "assets/proyectos/3d/seguro-educativo/5-medalla.jpg",
        ficha: { rol: "Props 3D", herramientas: ["Blender", "Cycles"], tiempo: "", equipo: "Hackathon en equipo" },
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
        ficha: { rol: "Animación", herramientas: ["Blender"], tiempo: "", equipo: "" },
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
        ficha: { rol: "Animación de personaje", herramientas: ["Blender"], tiempo: "", equipo: "" },
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
      { nombre: "Montaje", herramienta: "Photoshop", poder: 60,
        desc: "Une, recorta y compone imágenes hasta que parezcan una sola." },
      { nombre: "Vectores", herramienta: "Illustrator", poder: 70,
        desc: "Dibuja formas limpias que escalan sin perder nitidez." }
    ],
    lema: "«Nada está donde está por casualidad.»",
    proyectos: [
      {
        grupo: "Publicidad",
        titulo: "The North Face: ¡Atención, escaladores!",
        contexto: "Composición Plástica · UEB",
        portadaPos: "top",
        ficha: { rol: "Composición y dirección de arte", herramientas: ["Illustrator"], tiempo: "", equipo: "" },
        resumen: "Un email marketing para el 2º Campeonato Nacional de Escalada en Bloque en Sogamoso, Boyacá. Partí de una hoja en blanco y unos textos obligatorios: todo lo demás —cada forma, cada espacio, cada jerarquía— fue decisión mía.",
        etiquetas: ["Composición", "Dirección de arte", "Illustrator", "Vectorial"],
        historia: [
          { titulo: "El punto de partida",
            texto: "El encargo traía solo los textos del evento: fecha, lugar, categorías, horarios e inscripción. Mucha información para una sola pieza, y una marca enorme que tenía que mandar. Empecé con un moodboard de escalada, montaña y la identidad de The North Face para fijar el tono." },
          { titulo: "Las reglas del juego",
            texto: "Elegí Helvetica Neue por su parecido con la tipografía de la marca, y una paleta de solo dos colores, amarillo #FDC74E y gris #191919: los tonos de sus prendas y su publicidad, que además generan un contraste fuerte y fácil de leer. Para ordenar tanta información trabajé sobre una retícula modular: clara, estable y fácil de manejar." },
          { titulo: "La composición cuenta una subida",
            texto: "La pieza entera cuenta una escalada. Arriba, el logo se alza como la cumbre y un escalador está a punto de alcanzarlo; a lo largo del recorrido, las figuras geométricas de las presas de boulder acompañan la lectura como puntos de apoyo; y al final, otro personaje mira hacia arriba, hacia todo lo que falta por subir. Cada categoría arranca con la forma característica del logo, para que la marca esté presente de principio a fin." },
          { titulo: "El resultado",
            texto: "Un email marketing vertical, 100% vectorial en Illustrator, que ordena mucha información sin perder fuerza y que cierra con un llamado: «Es hora de desafiar la gravedad y alcanzar nuevas alturas». Arriba están las diapositivas del proceso; aquí abajo, la pieza completa." }
        ],
        galerias: [
          { titulo: "El proceso", disposicion: "presentacion", medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-1.webp", alt: "Portada · The North Face" },
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-2.webp", alt: "Moodboard" },
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-3.webp", alt: "Tipografía y paleta de color" },
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-4.webp", alt: "Retícula" },
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/slide-5.webp", alt: "Elementos gráficos" }
          ] },
          { titulo: "El email marketing completo", disposicion: "completa", despues: true, medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/the-north-face/anuncio-final.webp", alt: "Email marketing · The North Face", alto: true }
          ] }
        ]
      },
      {
        grupo: "Publicidad",
        titulo: "Dixie Crossroads: rediseño",
        contexto: "Clase de composición",
        portada: "assets/proyectos/composicion/rediseno/rediseno.webp",
        portadaPos: "top",
        ficha: { rol: "Rediseño", herramientas: [], tiempo: "", equipo: "" },
        resumen: "Un anuncio real de un restaurante de mariscos que lo dice todo a gritos. Mi trabajo fue hacer que dijera lo mismo… pero que se pudiera leer.",
        etiquetas: ["Composición", "Rediseño", "Jerarquía visual"],
        historia: [
          { titulo: "El diagnóstico",
            texto: "El original compite consigo mismo: cinco colores de fondo, tipografías que gritan al mismo volumen, recortes de fotos sobre bloques fucsia y celeste, y ningún punto de entrada claro. Toda la información está, pero el ojo no sabe por dónde empezar." },
          { titulo: "Una sola atmósfera",
            texto: "Unifiqué todo en un fondo azul marino con ondas sutiles que evocan el mar, y un único color de acento, coral, que nace del propio cangrejo y la langosta. Dos colores bastan para ordenar lo que antes eran cinco." },
          { titulo: "Jerarquía y ritmo",
            texto: "Una sola familia tipográfica en pesos muy distintos: titulares grandes y compactos y textos secundarios livianos. Los platos se organizan en zigzag —foto a la izquierda, texto a la derecha y luego al revés— para que la lectura baje en ritmo, y los precios viven en círculos que se encuentran de inmediato." },
          { titulo: "El resultado",
            texto: "El mismo contenido, ahora con un recorrido claro: marca, oferta, precio y contacto. Un anuncio que se siente apetitoso y profesional en lugar de saturado." }
        ],
        galerias: [
          { titulo: "Antes · El anuncio original", disposicion: "completa", ancho: 560, tras: 1, medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/rediseno/original.webp", alt: "Antes · Anuncio original" }
          ] },
          { titulo: "Después · Mi rediseño", disposicion: "completa", ancho: 560, despues: true, medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/rediseno/rediseno.webp", alt: "Después · Mi rediseño" }
          ] }
        ]
      },
      {
        grupo: "Campaña",
        titulo: "Punto de Quiebre",
        contexto: "Serie de Creación Digital · Proyecto entre equipos",
        ficha: { rol: "Campaña en redes sociales", herramientas: [], tiempo: "", equipo: "Proyecto entre varios equipos" },
        resumen: "Una serie sobre la traición y el precio de las decisiones. Antes del estreno había que hacer que la gente la esperara: primero la expectativa, después la revelación.",
        etiquetas: ["Composición", "Campaña", "Redes sociales", "Trabajo en equipo"],
        link: { texto: "Ver la campaña en Instagram", url: "https://www.instagram.com/puntodequiebre_04/" },
        historia: [
          { titulo: "El encargo",
            texto: "En la carrera produjimos una serie entre varios equipos, Punto de Quiebre, y había que darla a conocer en redes. El reto no era solo diseñar piezas bonitas, sino construir una campaña con un orden: cada pieza tenía que preparar a la siguiente." },
          { titulo: "Un sistema visual",
            texto: "Todas las piezas comparten las mismas reglas: fotografía teñida en un solo color cálido —del amarillo al rojo—, tipografía ancha y en mayúsculas para los golpes, una más ligera para las frases, y la firma de Creación Digital y la Universidad El Bosque siempre en el mismo lugar." },
          { titulo: "La expectativa",
            texto: "Las piezas de expectativa muestran poco a propósito. En la primera, el mismo rostro pasa por tres estados —«Esperanza», «Traición», «Venganza»— y el color se enciende del amarillo al rojo a medida que la historia se rompe. En la segunda conocemos a Andresito, desenfocado, como si ya se estuviera desmoronando: «Las deudas pasan… pero el vacío que dejó esta decisión, no sé si algún día pueda pagarlo»." },
          { titulo: "El lanzamiento",
            texto: "La pieza de lanzamiento resuelve la intriga. La imagen se quiebra literalmente como un vidrio sobre una lluvia de billetes, y la jerarquía cambia: el título «Todo tiene un precio» y la fecha de estreno, 12/11/2025, pasan al frente. El quiebre visual es el nombre de la serie hecho imagen." }
        ],
        galerias: [
          { titulo: "Expectativa", disposicion: "completa", ancho: 560, tras: 3, medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/serie/expectativa-1.webp", alt: "Expectativa 1 · Esperanza, traición, venganza" },
            { tipo: "imagen", src: "assets/proyectos/composicion/serie/expectativa-2.webp", alt: "Expectativa 2 · Andresito" }
          ] },
          { titulo: "Lanzamiento", disposicion: "completa", ancho: 560, despues: true, medios: [
            { tipo: "imagen", src: "assets/proyectos/composicion/serie/lanzamiento.webp", alt: "Lanzamiento · Todo tiene un precio" }
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

/* ---------------------------------------------------------
   EL SOBRE (Capítulo II · El Maestro)
   Imagen del sobre que se abre. La carta que sale es la del Maestro
   (.trainer en index.html), con nivel, nombre, clase y origen de MAESTRO
   El nivel sale de MAESTRO.nivel y el número de cartas se cuenta solo.
   --------------------------------------------------------- */
const SOBRE = {
  imagenes: {
    sobre: "assets/sobre/sobre.png"   // sobre cerrado (640×1148). La carta que sale es la del Maestro (.trainer)
  }
};

/* ---------------------------------------------------------
   QUIÉN SOY: los paneles del scroll horizontal (en orden)
   rareza -> (sin efecto visual: todos los paneles van en violeta con hover lima)
   Cambia cada "[RELLENAR: …]" por tu texto.
   --------------------------------------------------------- */
const QUIEN_SOY = [
  {
    eyebrow: "01 · La carta",
    titulo: "La carta",
    rareza: "rara",
    // Una frase corta que te presente (quién eres en una línea)
    texto: ["Fresco como mandarina."]
  },
  {
    eyebrow: "02 · Origen",
    titulo: "Origen",
    rareza: "comun",
    alto: "a",   // los paneles con el mismo "alto" miden lo mismo (el del más alto)
    subtitulo: "Bogotá, Colombia",
    // Tu historia: cómo empezaste en lo digital. Texto temporal: 1er párrafo del antiguo prólogo
    texto: [MAESTRO.prologo[0]]
  },
  {
    eyebrow: "03 · Formación",
    titulo: "Formación",
    rareza: "epica",
    alto: "a",
    subtitulo: "Dónde me he formado",
    // Línea de tiempo: periodo + dónde
    etapas: [
      { nombre: "2013 – 2024",       texto: "Colegio Diana Turbay IED" },
      { nombre: "2023 – 2024",       texto: "Técnico en Sistemas · SENA" },
      { nombre: "2025 – Actualidad", texto: "Creación Digital · Universidad El Bosque" }
    ]
  },
  {
    eyebrow: "04 · Mis cartas más valiosas",
    titulo: "Mis cartas más valiosas",
    rareza: "legendaria",
    alto: "b",
    // Texto temporal: 2º párrafo del antiguo prólogo
    texto: [MAESTRO.prologo[1]],
    // nivel = estrellas (1 a 5) + una frase para cada una
    miniCartas: [
      { nombre: "Responsabilidad",       nivel: 5, texto: "Me gusta cumplirles a los demás y a mí mismo cuando se me delega o me propongo algo." },
      { nombre: "Ideas revolucionarias", nivel: 4, texto: "Siempre busco innovar con ideas nuevas que se salgan de lo monótono." },
      { nombre: "Trabajo en equipo",     nivel: 4, texto: "Escucho con atención, hablo cuando debo y sigo aprendiendo a trabajar en equipo." }
    ]
  },
  {
    eyebrow: "05 · Mi equipo",
    titulo: "Mi equipo",
    rareza: "rara",
    alto: "b",
    // Carta interactiva: al pasar el ratón (o tocarla) saltan los íconos de las herramientas.
    // Para añadir una herramienta basta una línea nueva con su nombre y su PNG
    // (esfera con fondo transparente, 256×256, en assets/herramientas/). Funciona con 1 a ~14.
    equipo: {
      tipo: "Aliados / Herramientas",
      // descripcion: máx. ~150 caracteres para que quepa en la carta
      descripcion: "Los aliados que juegan conmigo. Con ellos modelo y animo en 3D, compongo en 2D, llevo las ideas a pantalla y código y las pongo en movimiento.",
      // portada: nombres (como en herramientas) de las 3 pelotas que se ven en la carta;
      // se pueden cambiar por cualquier otra herramienta de la lista
      portada: ["Blender", "Photoshop", "Figma"],
      herramientas: [
        { nombre: "Blender",            icono: "assets/herramientas/blender.png" },
        { nombre: "Photoshop",          icono: "assets/herramientas/photoshop.png" },
        { nombre: "Illustrator",        icono: "assets/herramientas/illustrator.png" },
        { nombre: "Visual Studio Code", icono: "assets/herramientas/vscode.png" },
        { nombre: "Claude",             icono: "assets/herramientas/claude.png" },
        { nombre: "CapCut",             icono: "assets/herramientas/capcut.png" },
        { nombre: "Figma",              icono: "assets/herramientas/figma.png" },
        { nombre: "GitHub",             icono: "assets/herramientas/github.png" }
      ]
    }
  },
  {
    eyebrow: "06 · Fuera de la mesa",
    titulo: "Fuera de la mesa",
    rareza: "comun",
    alto: "c",
    // Gustos, hobbies o un dato curioso
    texto: ["Me gusta aprender sobre tecnología, los videojuegos, pasar tiempo en familia y hacer deporte, en especial el fútbol y el ciclismo."],
    foto: "",        // opcional: ruta de una foto (vacío = sin foto)
    fotoAlt: ""
  },
  {
    eyebrow: "07 · Mi objetivo",
    titulo: "Mi objetivo",
    rareza: "epica",
    alto: "c",
    // Frase final. Texto temporal: 3er párrafo del antiguo prólogo
    texto: [MAESTRO.prologo[2]]
  }
];

/* ---------------------------------------------------------
   CAPÍTULO III · LAS REGLAS (cómo leer mis cartas)
   Una diapositiva por paso. La carta de ejemplo es la primera de CARTAS
   (la de 3D) y en cada paso se resalta una parte:
   resaltar -> "rareza" (el borde), "estrellas", "habilidades" o "estadisticas".
   lista    -> "rarezas" (sale de RAREZAS) o "stats" (sale de STATS).
   Los ★ del texto se pintan como estrellas.
   --------------------------------------------------------- */
const REGLAS = {
  eyebrow: "Capítulo III · Las Reglas",
  titulo: "Cómo leer mis cartas",
  pasos: [
    { paso: "Rareza",       titulo: "Rareza = Dominio",           resaltar: "rareza",       lista: "rarezas" },
    { paso: "Estrellas",    titulo: "Estrellas = Experiencia",    resaltar: "estrellas",
      texto: "De ★ a ★★★★★. Tiempo y proyectos acumulados usando esa skill." },
    { paso: "Habilidades",  titulo: "Habilidades = Herramientas", resaltar: "habilidades",
      texto: "Las técnicas y programas con los que ejecuto la skill. El número indica su poder (qué tan fuerte la tengo)." },
    { paso: "Estadísticas", titulo: "Estadísticas",               resaltar: "estadisticas", lista: "stats",
      boton: { texto: "Ver mi mazo →", href: "#mazo" } }
  ]
};
