/* =========================================================
   LÓGICA DEL PORTAFOLIO
   Normalmente no necesitas tocar este archivo.
   Edita tus datos en js/data.js
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel) => document.querySelector(sel);

const escapeHTML = (str = "") =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Datos del Maestro ---------- */
function renderMaestro() {
  document.querySelectorAll("[data-maestro]").forEach((el) => {
    const value = MAESTRO[el.dataset.maestro];
    if (value !== undefined) el.textContent = value;
  });

  const photo = $("#trainerPhoto");
  const avatar = $("#heroAvatar");
  if (MAESTRO.foto) {
    const img = `<img src="${escapeHTML(MAESTRO.foto)}" alt="Foto de ${escapeHTML(MAESTRO.nombre)}">`;
    avatar.innerHTML = img;
    if (MAESTRO.fotoReal) {
      photo.innerHTML = `<img src="${escapeHTML(MAESTRO.fotoReal)}" alt="Foto de ${escapeHTML(MAESTRO.nombreCompleto || MAESTRO.nombre)}">`;
      photo.classList.add("is-real");
    } else {
      photo.innerHTML = img;
    }
  } else {
    photo.classList.add("is-empty");
    avatar.classList.add("is-empty");
  }

  $("#prologo").innerHTML = MAESTRO.prologo.map((p) => `<p>${escapeHTML(p)}</p>`).join("");
  $("#trainerCount").textContent = CARTAS.filter((c) => !c.bloqueada).length;

  // carta del Maestro: se inclina ligeramente y el brillo sigue al ratón
  const trainer = $(".trainer");
  trainer.addEventListener("pointermove", (e) => {
    const r = trainer.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (!reduceMotion) {
      trainer.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
      trainer.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    }
    trainer.style.setProperty("--mx", `${x * 100}%`);
    trainer.style.setProperty("--my", `${y * 100}%`);
  });
  trainer.addEventListener("pointerleave", () => {
    trainer.style.setProperty("--rx", "0deg");
    trainer.style.setProperty("--ry", "0deg");
  });

  // Correo: en celular abre la app de correo; en computador, la ventana de redactar de Gmail
  const asunto = encodeURIComponent(MAESTRO.asuntoCorreo || "");
  const mail = $("#contactMail");
  if (matchMedia("(pointer: coarse)").matches) {
    mail.href = `mailto:${MAESTRO.correo}?subject=${asunto}`;
  } else {
    mail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MAESTRO.correo)}&su=${asunto}`;
    mail.target = "_blank";
    mail.rel = "noopener";
  }
  $("#contactMailText").textContent = MAESTRO.correo;

  // Teléfono: descarga la tarjeta de contacto (.vcf) -> "Agregar a contactos"
  const phone = $("#contactPhone");
  phone.href = MAESTRO.contactoVcf || `tel:${MAESTRO.telefono}`;
  if (MAESTRO.contactoVcf) phone.setAttribute("download", "Samuel Silva.vcf");
  $("#contactPhoneText").textContent = MAESTRO.telefonoTexto;

  const contactDialog = $("#contactDialog");
  $("#contactOpen").addEventListener("click", () => contactDialog.showModal());
  $("#contactClose").addEventListener("click", () => contactDialog.close());
  contactDialog.addEventListener("click", (e) => {
    if (e.target === contactDialog) contactDialog.close();   // clic fuera de la ventana
  });
  $("#socials").innerHTML = MAESTRO.redes
    .map((r) => `<li><a href="${escapeHTML(r.url)}" target="_blank" rel="noopener">${escapeHTML(r.nombre)}</a></li>`)
    .join("");

  $("#year").textContent = new Date().getFullYear();
}

/* ---------- Reglas ---------- */
function renderReglas() {
  $("#rulesRareza").innerHTML = Object.entries(RAREZAS)
    .map(([key, r]) => `<li><span class="gem gem--${key}"></span><b>${r.nombre}:</b> ${escapeHTML(r.desc)}</li>`)
    .join("");

  $("#rulesStats").innerHTML = Object.values(STATS)
    .map((s) => {
      const [name, desc] = s.split(" — ");
      return `<li><b>${escapeHTML(name)}:</b> ${escapeHTML(desc)}</li>`;
    })
    .join("");
}

/* ---------- Cartas ---------- */
function stars(nivel) {
  return "★".repeat(nivel) + `<span class="off">${"★".repeat(5 - nivel)}</span>`;
}

function cardFront(c) {
  const rareza = RAREZAS[c.rareza];
  const el = ELEMENTOS[c.elemento];
  const art = c.imagen
    ? `<img src="${escapeHTML(c.imagen)}" alt="" loading="lazy">`
    : `<span class="card__art-ph">${el.icono}</span>`;

  const habilidades = c.habilidades
    .map((h) => `
      <li>
        <div><b>${escapeHTML(h.nombre)}</b> <small>${escapeHTML(h.herramienta)}</small></div>
        <span class="card__power">${h.poder}</span>
      </li>`)
    .join("");

  const stats = Object.keys(STATS)
    .map((k) => `
      <div class="stat">
        <span>${k.slice(0, 3).toUpperCase()}</span>
        <i style="--v:${c.stats[k]}%"></i>
        <b>${c.stats[k]}</b>
      </div>`)
    .join("");

  return `
    <div class="card__face card__front">
      <div class="card__head">
        <span class="card__name">${escapeHTML(c.nombre)}</span>
        <span class="card__el" title="Elemento: ${el.nombre}">${el.icono}</span>
      </div>
      <div class="card__stars" aria-label="Nivel ${c.nivel} de 5">${stars(c.nivel)}</div>
      <div class="card__art">${art}</div>
      <div class="card__type">[${el.nombre} / ${rareza.nombre}] ${escapeHTML(c.titulo)}</div>
      <ul class="card__abilities">${habilidades}</ul>
      <div class="card__stats">${stats}</div>
      <p class="card__lema">${escapeHTML(c.lema)}</p>
      <div class="card__foot"><span>${c.numero}</span><span>${rareza.nombre}</span></div>
      <div class="card__holo" aria-hidden="true"></div>
    </div>`;
}

function cardHTML(c, { facedown = false } = {}) {
  if (c.bloqueada) {
    return `
      <div class="card card--locked" aria-label="Carta bloqueada: ${escapeHTML(c.pista)}">
        <div class="card__inner">
          <div class="card__face card__back card-back"><span class="card__lock">?<small>${escapeHTML(c.pista)}</small></span></div>
        </div>
      </div>`;
  }
  return `
    <button class="card card--${c.rareza} card--el-${c.elemento} ${facedown ? "is-facedown" : ""}"
            data-id="${c.id}" aria-label="Invocar carta ${escapeHTML(c.nombre)}">
      <div class="card__inner">
        ${cardFront(c)}
        <div class="card__face card__back card-back"></div>
      </div>
    </button>`;
}

function renderMazo() {
  const deck = $("#deck");
  deck.innerHTML = CARTAS.map((c) => cardHTML(c, { facedown: !reduceMotion })).join("");

  deck.querySelectorAll(".card[data-id]").forEach((el) => {
    el.addEventListener("click", () => summon(el.dataset.id));
  });

  // "Robar cartas": se voltean una a una al entrar en pantalla
  if (!reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          setTimeout(() => entry.target.classList.remove("is-facedown"), 250 + i * 280);
          observer.unobserve(entry.target);
        });
    }, { threshold: 0.4 });
    deck.querySelectorAll(".is-facedown").forEach((card) => observer.observe(card));
  }

  enableTilt(deck);
}

/* ---------- Efecto holográfico al mover el ratón ---------- */
function enableTilt(scope) {
  if (reduceMotion) return;
  scope.querySelectorAll(".card[data-id]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
      card.style.setProperty("--rx", `${(0.5 - y) * 16}deg`);
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

/* ---------- Invocación (modal con proyectos) ---------- */
function summon(id) {
  const c = CARTAS.find((x) => x.id === id);
  if (!c) return;

  $("#summonCard").innerHTML = cardHTML(c);
  enableTilt($("#summonCard"));
  $("#summonTitle").textContent = c.nombre;
  $("#summonSubtitle").textContent = `${c.titulo} · ${RAREZAS[c.rareza].nombre} · ${c.nivel}★ de 5`;

  const plays = $("#summonPlays");
  plays.innerHTML = c.proyectos.length
    ? playsHTML(c)
    : `<p class="plays__empty">Aún no hay jugadas registradas para esta carta.</p>`;
  setupMedia(plays);
  setupSlides(plays);

  const dialog = $("#summon");
  dialog.showModal();
  dialog.scrollTop = 0;
}

/* Jugadas: las que tienen historia o medios se muestran completas;
   las simples (imagen + desc) como tarjetas pequeñas */
function playsHTML(c) {
  let grupo = null;
  let n = 0;
  const simples = [];
  let html = "";

  c.proyectos.forEach((p) => {
    if (!p.historia && !p.medios) { simples.push(p); return; }
    n++;
    if (p.grupo && p.grupo !== grupo) {
      grupo = p.grupo;
      html += `<h3 class="summon__group">${escapeHTML(grupo)}</h3>`;
    }
    html += jugadaHTML(p, n);
  });

  if (simples.length) {
    html += `<div class="plays">${simples.map((p) => {
      const img = p.imagen
        ? `<img src="${escapeHTML(p.imagen)}" alt="${escapeHTML(p.titulo)}" loading="lazy">`
        : `<span class="play__ph">${ELEMENTOS[c.elemento].icono}</span>`;
      const title = p.link
        ? `<a href="${escapeHTML(p.link)}" target="_blank" rel="noopener">${escapeHTML(p.titulo)} ↗</a>`
        : escapeHTML(p.titulo);
      return `
        <article class="play">
          <div class="play__media">${img}</div>
          <h4>${title}</h4>
          <p>${escapeHTML(p.desc)}</p>
        </article>`;
    }).join("")}</div>`;
  }
  return html;
}

function jugadaHTML(p, n) {
  // "medios" es atajo de una sola galería; "galerias" permite varias con título y posición
  const galerias = p.galerias || (p.medios ? [{ medios: p.medios }] : []);
  const tags = (p.etiquetas || []).map((t) => `<li>${escapeHTML(t)}</li>`).join("");
  const fases = (p.historia || []).map((f, i) => `
    <li class="fase">
      <span class="fase__num">${String(i + 1).padStart(2, "0")}</span>
      <div><h5>${escapeHTML(f.titulo)}</h5><p>${escapeHTML(f.texto)}</p></div>
    </li>`).join("");
  const antes = galerias.filter((g) => !g.despues).map(galeriaHTML).join("");
  const despues = galerias.filter((g) => g.despues).map(galeriaHTML).join("");

  return `
    <article class="jugada">
      <header class="jugada__head">
        <p class="eyebrow">Jugada ${String(n).padStart(2, "0")}${p.contexto ? ` · ${escapeHTML(p.contexto)}` : ""}</p>
        <h4 class="jugada__title">${escapeHTML(p.titulo)}</h4>
        ${p.resumen ? `<p class="jugada__lead">${escapeHTML(p.resumen)}</p>` : ""}
        ${tags ? `<ul class="tags">${tags}</ul>` : ""}
      </header>
      ${antes}
      ${fases ? `<ol class="fases">${fases}</ol>` : ""}
      ${despues}
    </article>`;
}

/* disposicion: "galeria" (por defecto: la 1ª grande + cuadrícula, con zoom al objeto),
   "presentacion" (carrusel de diapositivas) o "piezas" (piezas gráficas completas, sin recortes) */
function galeriaHTML(g) {
  const medios = g.medios || [];
  if (!medios.length) return "";
  const disp = g.disposicion || "galeria";
  const titulo = g.titulo ? `<h5 class="gallery__title">${escapeHTML(g.titulo)}</h5>` : "";

  if (disp === "presentacion") {
    return `
      <div class="gallery-block">
        ${titulo}
        <div class="slides" data-galeria>
          <div class="slides__track">${medios.map(mediaHTML).join("")}</div>
          <button class="slides__nav slides__nav--prev" type="button" aria-label="Diapositiva anterior">‹</button>
          <button class="slides__nav slides__nav--next" type="button" aria-label="Diapositiva siguiente">›</button>
          <span class="slides__count">1 / ${medios.length}</span>
        </div>
      </div>`;
  }
  const cls = disp === "piezas"
    ? "gallery gallery--piezas"
    : medios.length > 1 ? "gallery" : "gallery gallery--single";
  return `
    <div class="gallery-block">
      ${titulo}
      <div class="${cls}" data-galeria>${medios.map(mediaHTML).join("")}</div>
    </div>`;
}

// carrusel de diapositivas: flechas + contador sincronizado con el deslizamiento
function setupSlides(scope) {
  scope.querySelectorAll(".slides").forEach((box) => {
    const track = box.querySelector(".slides__track");
    const count = box.querySelector(".slides__count");
    const step = (dir) => track.scrollBy({ left: dir * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    box.querySelector(".slides__nav--prev").addEventListener("click", () => step(-1));
    box.querySelector(".slides__nav--next").addEventListener("click", () => step(1));
    track.addEventListener("scroll", () => {
      const total = track.children.length;
      const i = Math.min(total, Math.round(track.scrollLeft / track.clientWidth) + 1);
      count.textContent = `${i} / ${total}`;
    }, { passive: true });
  });
}

function mediaHTML(m) {
  const alt = escapeHTML(m.alt || "");
  if (m.tipo === "video") {
    // sin sonido + playsinline = autoplay permitido en todos los navegadores (también iPhone)
    return `
      <div class="media media--video">
        <video muted loop playsinline preload="none" data-src="${escapeHTML(m.src)}"
          ${m.poster ? `poster="${escapeHTML(m.poster)}"` : ""} aria-label="${alt}"
          ${reduceMotion ? "controls" : ""}></video>
      </div>`;
  }
  return `
    <button class="media media--img" type="button" data-full="${escapeHTML(m.src)}" data-alt="${alt}" aria-label="Ver en grande: ${alt}">
      <img src="${escapeHTML(m.src)}" alt="${alt}" decoding="async">
      ${m.alt ? `<span class="media__cap">${escapeHTML(m.alt.split(" · ")[0])}</span>` : ""}
    </button>`;
}

// recuadro "pendiente" cuando el archivo aún no existe
function mediaPlaceholder(el, alt) {
  const ph = document.createElement("div");
  ph.className = "media media--ph";
  ph.innerHTML = `<span>${escapeHTML(alt.split(" · ")[0])}</span><small>Pendiente</small>`;
  el.replaceWith(ph);
}

let videoObserver;
function setupMedia(scope) {
  scope.querySelectorAll(".media--img img").forEach((img) => {
    const fail = () => mediaPlaceholder(img.closest(".media"), img.alt);
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail, { once: true });
  });

  // los videos se cargan y reproducen solo mientras se ven (ahorra datos y batería)
  videoObserver?.disconnect();
  videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        if (!reduceMotion) v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { root: $("#summon"), threshold: 0.25 });

  scope.querySelectorAll(".media--video video").forEach((v) => {
    v.addEventListener("error", () => mediaPlaceholder(v.closest(".media"), v.getAttribute("aria-label")), { once: true });
    videoObserver.observe(v);
  });
}

/* ---------- Visor de imágenes en grande ---------- */
function setupViewer() {
  const viewer = $("#viewer");
  const img = $("#viewerImg");
  let list = [];
  let i = 0;

  const show = (n) => {
    i = (n + list.length) % list.length;
    img.src = list[i].dataset.full;
    img.alt = list[i].dataset.alt;
    $("#viewerCaption").textContent = `${list[i].dataset.alt} · ${i + 1} de ${list.length}`;
    viewer.classList.toggle("is-single", list.length < 2);
  };

  $("#summonPlays").addEventListener("click", (e) => {
    const btn = e.target.closest(".media--img");
    if (!btn) return;
    list = [...btn.closest("[data-galeria]").querySelectorAll(".media--img")];
    show(list.indexOf(btn));
    viewer.showModal();
  });
  $("#viewerPrev").addEventListener("click", () => show(i - 1));
  $("#viewerNext").addEventListener("click", () => show(i + 1));
  $("#viewerClose").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });
}

function setupSummon() {
  const dialog = $("#summon");
  $("#summonClose").addEventListener("click", () => dialog.close());
  // cerrar al hacer clic fuera del contenido
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  // al cerrar, detener los videos
  dialog.addEventListener("close", () => dialog.querySelectorAll("video").forEach((v) => v.pause()));
}

renderMaestro();
renderReglas();
renderMazo();
setupSummon();
setupViewer();
