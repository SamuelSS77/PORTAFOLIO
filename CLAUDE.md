# Portafolio de Samu — "El Maestro de Cartas"

Portafolio personal de Samu (Estudiante de Creación Digital, Universidad El Bosque, 4° semestre).
Responder siempre en español. Sitio estático (HTML/CSS/JS puro, sin build, sin dependencias) para GitHub Pages.

## Concepto / storytelling
Samu es un "Maestro de Cartas": cada skill de creador digital es una carta estilo Pokémon/Yu-Gi-Oh y cada proyecto es una "jugada".
Capítulos de la página (en orden):
1. **Hero / Home** (`#arena`) — sigue un boceto de Samu: nav Home·Work·About·Contact; "HOLA" gigante; debajo "Soy [foto PNG] Samu" con la foto grande por ENCIMA de la parte baja del HOLA (sin círculo, solo PNG transparente); abajo-izq: alias + "Estudiante de Creación Digital" + "Universidad El Bosque" + "4° semestre"; abajo-der: botón "Contáctame".
2. **El Maestro / About** (`#maestro`) — carta de Maestro (foto, clase, nivel, origen) + prólogo.
3. **Las Reglas** (`#reglas`) — cómo leer las cartas.
4. **El Mazo / Work** (`#mazo`) — cartas que se voltean al hacer scroll; clic = modal "invocación" con proyectos.
5. **El Duelo / Contact** (`#duelo`) — contacto.

## Sistema de cartas
- Rareza = dominio: común, rara, épica, legendaria (color del borde).
- Nivel = experiencia, 1–5 estrellas.
- Habilidades = herramientas con "poder".
- Stats 0–100: creatividad, técnica, velocidad.
- `bloqueada: true` = carta boca abajo "próxima expansión".
Cartas actuales: 3D (épica, 4★) y Composición (rara, 3★) — valores provisionales.

## Archivos
- `js/data.js` — TODO el contenido (MAESTRO, RAREZAS, STATS, ELEMENTOS, CARTAS). Editar contenido aquí, no en el HTML.
- `js/main.js` — renderizado, volteo de cartas, efecto holográfico, modal.
- `css/styles.css` — colores en `:root`. Estética: fondo oscuro, dorado + morado, títulos Cinzel, texto Inter.
- `index.html` — estructura.
- `assets/SamuelFoto.png` (foto con fondo transparente), `assets/cartas/`, `assets/proyectos/`.

## Pendiente
- Rellenar en `data.js`: origen (ciudad), correo, links de redes, niveles reales, imágenes de cartas y proyectos.
- Publicar en GitHub Pages: repo `USUARIO.github.io`, Pages desde `main` / root.

## Notas
- Git no está en el PATH del sistema; solo viene incluido dentro de GitHub Desktop. Para usar git desde la terminal o VS Code hay que instalar Git for Windows.
- Para previsualizar: abrir `index.html` en el navegador o usar la extensión Live Server de VS Code.
- Comprobar siempre que se vea bien en móvil (375px) y sin scroll horizontal.
