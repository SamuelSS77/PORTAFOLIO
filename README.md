# El Maestro de Cartas

Hola, soy **Samuel Santiago Silva Largo** (Samu), estudiante de **Creación Digital** en la **Universidad El Bosque**, en cuarto semestre, de Bogotá, Colombia.

Este es mi portafolio, y en lugar de una lista de proyectos lo pensé como un juego de cartas, al estilo Pokémon o Yu-Gi-Oh: **cada habilidad que tengo es una carta** y **cada proyecto es una jugada** que la respalda. Yo soy el Maestro que las colecciona.

**Velo en vivo:** https://samuelss77.github.io/PORTAFOLIO/

---

## La historia, capítulo a capítulo

La página se recorre como una partida:

1. **Hero (Home)**: un "HOLA" gigante, mi foto y quién soy. Al pasar el cursor por la foto aparece un destello detrás de mí.
2. **El Maestro (About)**: mi carta de Maestro, con mi foto, clase, nivel 4 (por mi cuarto semestre) y origen, junto a mi prólogo: cómo se fue llenando mi mazo y qué aporto a un equipo.
3. **Las Reglas**: cómo leer mis cartas.
4. **El Mazo (Work)**: mis cartas boca abajo. Se voltean al pasar el cursor (o al tocarlas en el celular) y, ya volteadas, un clic las "invoca": se abre una ventana con las jugadas que las respaldan.
5. **El Duelo (Contact)**: "¿Aceptas el reto?". El botón *Retar al Maestro* abre una ventana para agregarme a contactos o escribirme un correo.

## Cómo leer mis cartas

| Elemento | Qué significa |
|---|---|
| **Rareza** (color del borde) | Qué tanto domino la habilidad: común, rara, épica o legendaria |
| **Estrellas** (1 a 5) | Experiencia acumulada: tiempo y proyectos con esa habilidad |
| **Habilidades** | Las herramientas con las que la ejecuto y su "poder" |
| **Estadísticas** (0 a 100) | Creatividad, técnica y velocidad |
| **Carta boca abajo con "?"** | Próxima expansión: una habilidad que aún estoy construyendo |

## Mi mazo actual

### 3D · *El Escultor de Mundos* (épica, ★★★★)
- **Seguro educativo**: hackathon de Global Seguros, en equipo. Mi parte fueron cinco props en Blender y Cycles que cuentan el camino educativo de la cuna a la meta: chupete, mochila, escritorio, globo terráqueo y medalla.
- **La pelota que rebota** y **Personaje en movimiento**: animaciones de clase, donde practico peso, timing, anticipación y poses clave.

### Composición · *El Guardián del Equilibrio* (rara, ★★★)
- **The North Face: ¡Atención, escaladores!**: un email marketing para un campeonato de escalada en bloque, hecho desde cero en Illustrator. La pieza entera se lee como una escalada hacia el logo.
- **Dixie Crossroads: rediseño**: un anuncio saturado convertido en uno claro, con antes y después.
- **Punto de Quiebre**: la campaña de expectativa y lanzamiento de una serie que hicimos entre equipos en la carrera. [Instagram](https://www.instagram.com/puntodequiebre_04/)

Cada jugada cuenta el proceso por fases (el reto, la idea, el proceso y el resultado), porque para mí el cómo importa tanto como el resultado.

---

## Cómo está construido

Es un sitio **estático**: HTML, CSS y JavaScript puros, sin frameworks, sin dependencias y sin paso de compilación. Se publica con **GitHub Pages**.

```
index.html          → estructura de la página (los 5 capítulos)
css/styles.css      → todo el diseño; los colores están en :root
js/data.js          → TODO el contenido: mis datos, cartas, jugadas e historias
js/main.js          → la lógica: render de cartas, volteo, modales, galerías y visor
assets/
  SamuelFoto.png            → foto del hero (PNG con fondo transparente)
  SamuelFotoReal.png        → foto de la carta del Maestro
  samuel-silva.vcf          → tarjeta de contacto ("Agregar a contactos")
  proyectos/
    3d/                     → renders (.jpg) y animaciones (.mp4 + portada .webp)
    composicion/            → diapositivas y piezas en .webp
```

### Lo que vale la pena saber

- **El contenido se separa del código.** Para cambiar un texto, una carta o un proyecto solo se toca `js/data.js`; el HTML se genera desde ahí.
- **Estética.** Fondo oscuro con dorado y morado, títulos en *Cinzel* y texto en *Inter*. Las cartas tienen brillo holográfico y se inclinan siguiendo el cursor.
- **Cada jugada se arma a la medida.** Puede tener varias galerías con distintas disposiciones, y cada galería puede ir antes, después o en medio de la historia, justo tras la fase que explica:
  - `galeria`: la primera imagen grande y el resto en cuadrícula.
  - `presentacion`: carrusel de diapositivas.
  - `piezas`: piezas gráficas lado a lado.
  - `completa`: una debajo de otra, en grande.
- **Visor.** Un clic en cualquier foto, diapositiva o video lo abre en grande; las piezas muy largas se recorren con scroll.
- **Videos ligeros.** Se reproducen solos, sin sonido y en bucle, y solo cargan cuando aparecen en pantalla, para ahorrar datos.
- **Imágenes optimizadas.** Están en WebP: ninguna pesa más de 200 KB. Los archivos originales pesados (PDF, JPG de alta resolución) se quedan fuera del repositorio gracias a `.gitignore`.
- **Responsive.** Está pensado para verse bien desde un celular de 375 px hasta pantallas de 2560 px, sin scroll horizontal.
- **Accesible.** Respeta "reducir movimiento" del sistema, se navega con teclado y las imágenes tienen texto alternativo.
- **Seguro.** Tiene una Content-Security-Policy que solo permite recursos propios (y Google Fonts), todo el contenido se escapa antes de llegar al HTML y los enlaces se validan para bloquear esquemas peligrosos como `javascript:`.

### Verlo en local

Basta con abrir `index.html` en el navegador, o usar la extensión **Live Server** de VS Code.

Los archivos CSS y JS se enlazan con un número de versión (`styles.css?v=24`). Cada vez que publico cambios lo subo para que nadie vea una versión vieja guardada en caché.

---

## Próximas expansiones

El mazo sigue creciendo: hay cartas boca abajo esperando nuevas habilidades y nuevas jugadas.

¿Tienes un proyecto? **Rétame a un duelo** desde la web.
