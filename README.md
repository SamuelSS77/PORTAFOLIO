# El Maestro de Cartas — Portafolio

Portafolio de creador digital contado como un mazo de cartas: cada carta es una skill y cada proyecto es una "jugada".

## Estructura

```
index.html        → la página (5 capítulos)
css/styles.css    → diseño (colores en :root, arriba del archivo)
js/data.js        → TUS DATOS: nombre, cartas, niveles, proyectos  ← edita aquí
js/main.js        → lógica (no hace falta tocarlo)
assets/           → tus imágenes (foto, arte de cartas, proyectos)
```

## La historia (capítulos)

1. **La Arena** — portada: quién eres y la promesa ("cada skill es una carta").
2. **El Maestro** — sobre ti, con tu "carta de Maestro" (foto, clase, nivel, origen).
3. **Las Reglas** — cómo leer las cartas (rareza, estrellas, estadísticas).
4. **El Mazo** — tus skills. Las cartas se voltean al hacer scroll; al tocar una se "invoca" y muestra sus proyectos.
5. **El Duelo** — contacto: "¿Aceptas el reto?".

## Cómo añadir contenido

Todo se hace en `js/data.js`:

- **Imagen de una carta:** guarda la imagen en `assets/cartas/` y pon la ruta en `imagen: "assets/cartas/3d.jpg"`.
- **Proyecto:** añade un bloque en `proyectos` de la carta: `{ titulo, imagen, desc, link }`.
- **Nueva carta:** copia una carta completa `{ ... }` y cambia `id`, `numero`, `nombre`, etc.
- **Carta "próxima expansión":** usa `bloqueada: true` (se ve boca abajo con "?").

## Publicar en GitHub Pages (sin instalar nada)

### Con GitHub Desktop

1. **File → Add local repository…** → elige la carpeta `PORTAFOLIOSSS`.
2. Te dirá que no es un repositorio → **create a repository** → Name: `TUUSUARIO.github.io` → **Create repository**.
3. Arriba: **Publish repository** → desmarca *Keep this code private* → **Publish**.
4. En github.com, abre el repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)` → **Save**.
5. En 1–2 minutos estará en `https://TUUSUARIO.github.io`.

Para actualizar: guarda los cambios → en GitHub Desktop escribe un resumen → **Commit to main** → **Push origin**.
