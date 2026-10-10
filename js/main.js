/* =========================================================
   LÓGICA DEL PORTAFOLIO
   Normalmente no necesitas tocar este archivo.
   Edita tus datos en js/data.js
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel) => document.querySelector(sel);

/* ---------- Capítulos II y III: duraciones del scroll (ajustables) ----------
   Distancias de scroll ABSOLUTAS en svh (100 = una pantalla). */

// Capítulo II · el sobre. El hero se desvanece mientras #maestro termina de subir;
// desde ahí el escenario queda fijo y pasan las demás fases, el scroll horizontal y un reposo.
const FASES_SVH = {
  fade:  20,   // el hero se desvanece y aparece el tapete
  slide: 35,   // el sobre entra deslizándose y se detiene centrado
  open:  22,   // se arranca la tira de arriba del sobre
  rise:  28,   // la carta sale del sobre y crece; el sobre cae
  flip:  18,   // la carta se voltea y muestra el frente
  dock:  20    // la carta se acomoda a la izquierda (desde aquí, hover)
};
const REPOSO_SVH = 15;   // al final, último panel quieto antes de soltar el escenario
const PAN_RATIO = 1.3;   // scroll horizontal: px que avanzan los paneles por cada px de scroll
// resplandor lima de la carta del Maestro (halo + borde que brilla + anillo): SOLO mientras la carta
// sale del sobre (rise): 0 → pico → 0. Al voltearse, acomodarse y en reposo no hay resplandor.
const GLOW = { pico: 1 };

// Capítulo III · las reglas: 10svh de entrada + 100svh por diapositiva + reposo
const REGLAS_SVH = { entrada: 10, reposo: 15 };
const PAN_RATIO_REGLAS = 1.0;   // 1 diapositiva = 1 pantalla de scroll

// 0..1 dentro de [a, b] (con tope)
const range = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeSoft = (t) => -(Math.cos(Math.PI * t) - 1) / 2;   // ease-in-out suave (seno)

const escapeHTML = (str = "") =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Seguridad ----------
   Todo lo que viene de data.js pasa por estas funciones antes de llegar al HTML,
   para que un dato mal escrito (o malicioso) nunca pueda ejecutar código. */

// Solo deja pasar enlaces http(s), mailto, tel y rutas relativas del propio sitio.
// Bloquea javascript:, data:, vbscript:, etc. (escapeHTML no basta para eso).
function safeUrl(url = "") {
  const u = String(url).trim();
  if (!u) return "";
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.startsWith("//")) return "";   // otro esquema o protocolo relativo
  return u;                                                            // ruta relativa (assets/...)
}
const attrUrl = (url) => escapeHTML(safeUrl(url));

// números acotados (estadísticas, niveles, poder)
const num = (v, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(Number(v) || 0)));

// estilos que dependen de datos: se aplican con CSSOM (no como atributo style="")
// para que la Content-Security-Policy pueda bloquear los estilos inline
function applyDataStyles(scope) {
  scope.querySelectorAll("[data-v]").forEach((el) => el.style.setProperty("--v", `${num(el.dataset.v)}%`));
  scope.querySelectorAll("[data-max]").forEach((el) => el.style.setProperty("--max", `${num(el.dataset.max, 0, 4000)}px`));
  scope.querySelectorAll("[data-bg]").forEach((el) => {
    const u = safeUrl(el.dataset.bg);
    if (u) el.style.backgroundImage = `url("${encodeURI(u).replace(/["\\]/g, "")}")`;
  });
}

/* ---------- Siempre empezar en el hero ----------
   El navegador recuerda la posición al recargar y salta a #seccion si la URL la trae */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash) history.replaceState(null, "", location.pathname + location.search);
window.scrollTo(0, 0);
addEventListener("load", () => window.scrollTo(0, 0));
addEventListener("pageshow", (e) => { if (e.persisted) window.scrollTo(0, 0); });   // volver con "atrás"

// el menú baja a cada sección sin dejar #seccion en la URL
// (delegado: también sirve para enlaces que se generan después, como "Ver mi mazo →")
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]:not([data-open-contact])');   // "Contact" abre el diálogo (renderMaestro)
  if (!a) return;
  const id = a.getAttribute("href").slice(1);
  const target = id && document.getElementById(id);   // getElementById: sin selectores arbitrarios
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
});

/* ---------- Datos del Maestro ---------- */
function renderMaestro() {
  document.querySelectorAll("[data-maestro]").forEach((el) => {
    const value = MAESTRO[el.dataset.maestro];
    if (value !== undefined) el.textContent = value;
  });

  const avatar = $("#heroAvatar");
  const photo = $("#trainerPhoto");   // foto de la carta del Maestro (capítulo II)
  if (MAESTRO.foto) {
    avatar.innerHTML = `<img src="${attrUrl(MAESTRO.foto)}" alt="Foto de ${escapeHTML(MAESTRO.nombre)}" fetchpriority="high">`;
    const real = MAESTRO.fotoReal && safeUrl(MAESTRO.fotoReal);
    photo.innerHTML = `<img src="${attrUrl(real || MAESTRO.foto)}" alt="Foto de ${escapeHTML(MAESTRO.nombreCompleto || MAESTRO.nombre)}" decoding="async">`;
    photo.classList.toggle("is-real", Boolean(real));
  } else {
    avatar.classList.add("is-empty");
    photo.classList.add("is-empty");
  }
  $("#trainerCount").textContent = CARTAS.filter((c) => !c.bloqueada).length;

  // Correo: en celular abre la app de correo; en computador, la ventana de redactar de Gmail
  const asunto = encodeURIComponent(MAESTRO.asuntoCorreo || "");
  const mail = $("#contactMail");
  if (matchMedia("(pointer: coarse)").matches) {
    mail.href = `mailto:${encodeURIComponent(MAESTRO.correo).replace("%40", "@")}?subject=${asunto}`;
  } else {
    mail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MAESTRO.correo)}&su=${asunto}`;
    mail.target = "_blank";
    mail.rel = "noopener noreferrer";
  }
  $("#contactMailText").textContent = MAESTRO.correo;

  // Teléfono: descarga la tarjeta de contacto (.vcf) -> "Agregar a contactos"
  const phone = $("#contactPhone");
  phone.href = safeUrl(MAESTRO.contactoVcf) || `tel:${String(MAESTRO.telefono).replace(/[^\d+]/g, "")}`;
  if (MAESTRO.contactoVcf) phone.setAttribute("download", "Samuel Silva.vcf");
  $("#contactPhoneText").textContent = MAESTRO.telefonoTexto;

  // Contacto: UN solo diálogo; lo abren el botón del hero (#contactOpen) y "Contact" del menú ([data-open-contact])
  const CTA_DEF = { boton: "Juguemos en equipo", eyebrow: "Contacto", titulo: "Juguemos en equipo", lead: "Elige cómo conectamos:" };
  const cta = { ...CTA_DEF, ...(MAESTRO.cta || {}) };
  $("#ctaLabel").textContent = cta.boton;
  $("#contactEyebrow").textContent = cta.eyebrow;
  $("#contactTitle").textContent = cta.titulo;
  $("#contactLead").textContent = cta.lead;
  if (MAESTRO.cierre) {
    if (MAESTRO.cierre.eyebrow) $("#cierreEyebrow").textContent = MAESTRO.cierre.eyebrow;
    // la última palabra del título va en lima (texto escapado; solo se añade el <span>)
    if (MAESTRO.cierre.titulo) $("#cierreTitle").innerHTML = escapeHTML(MAESTRO.cierre.titulo.trim()).replace(/(\S+)$/, '<span class="duelo__hl">$1</span>');
    if (MAESTRO.cierre.texto) $("#cierreText").textContent = MAESTRO.cierre.texto;
  }

  const contactDialog = $("#contactDialog");
  let contactOpener = null;
  const openContact = (e) => {
    e.preventDefault();   // sin JS, "Contact" sigue llevando a #duelo
    contactOpener = e.currentTarget;
    contactDialog.showModal();
    $("#contactClose").focus();
  };
  $("#contactOpen").addEventListener("click", openContact);
  document.querySelectorAll("[data-open-contact]").forEach((a) => a.addEventListener("click", openContact));
  $("#contactClose").addEventListener("click", () => contactDialog.close());
  contactDialog.addEventListener("click", (e) => {
    if (e.target === contactDialog) contactDialog.close();   // clic fuera de la ventana
  });
  contactDialog.addEventListener("close", () => {   // el foco vuelve a quien abrió la ventana
    if (contactOpener) contactOpener.focus({ preventScroll: true });
    contactOpener = null;
  });
  $("#socials").innerHTML = MAESTRO.redes
    .filter((r) => safeUrl(r.url))
    .map((r) => `<li><a href="${attrUrl(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(r.nombre)}</a></li>`)
    .join("");

  $("#year").textContent = new Date().getFullYear();
}

/* ---------- Hero: la foto se mueve un poco al pasar el ratón por encima ---------- */
function setupHero() {
  // solo con ratón de verdad y sin "reducir movimiento"
  if (reduceMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const photo = $("#heroAvatar");
  const MAX = 5;   // desplazamiento máximo en px
  let mx = 0, my = 0, frame = 0;
  photo.addEventListener("pointermove", (e) => {
    const r = photo.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1 … 1
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      photo.style.setProperty("--px", `${(mx * MAX).toFixed(1)}px`);
      photo.style.setProperty("--py", `${(my * MAX).toFixed(1)}px`);
    });
  });
  photo.addEventListener("pointerleave", () => {
    photo.style.setProperty("--px", "0px");
    photo.style.setProperty("--py", "0px");
  });
}

/* ---------- Escenas de scroll (capítulos II y III) ----------
   Motor común: UN listener de scroll pasivo y UN rAF por scroll para todas las escenas.
   Cada escena mide todo en measure() (nunca durante el scroll) y en update(y) solo
   escribe transform/opacity directamente en los pocos elementos que se mueven. */
const scenes = [];
let scenesTick = false;
function runScenes() {
  scenesTick = false;
  const y = window.scrollY;
  for (const s of scenes) s.update(y);
}
function requestScenes() {
  if (!scenesTick) { scenesTick = true; requestAnimationFrame(runScenes); }
}
// en orden: la altura que fija una escena mueve el offsetTop de las siguientes
function measureScenes() {
  for (const s of scenes) s.measure();
  requestScenes();
}
function addScene(scene) {
  if (!scenes.length) {
    addEventListener("scroll", requestScenes, { passive: true });   // único listener de scroll
    addEventListener("resize", measureScenes);
    addEventListener("load", measureScenes);
    document.fonts?.ready.then(measureScenes);
  }
  scenes.push(scene);
  scene.measure();
  scene.update(window.scrollY);
}
// escribe un estilo solo si cambió
function setStyle(node, prop, val) {
  const c = node.__scene || (node.__scene = {});
  if (c[prop] !== val) { c[prop] = val; node.style[prop] = val; }
}
// lo mismo para una variable CSS
function setVar(node, name, val) {
  const c = node.__scene || (node.__scene = {});
  if (c[name] !== val) { c[name] = val; node.style.setProperty(name, val); }
}
// will-change solo mientras la sección está en pantalla (clase .is-active en el escenario)
function watchActive(section, stage) {
  new IntersectionObserver(([e]) => stage.classList.toggle("is-active", e.isIntersecting)).observe(section);
}

/* ---------- Capítulo II · el sobre + paneles "quién soy" ---------- */
// grupo de alto igualado (setupSobre · measure): solo letras/números
const altoAttr = (q) => (/^[\w-]+$/.test(q.alto || "") ? ` data-alto="${q.alto}"` : "");

// paneles con el mismo data-alto: todos miden lo que el más alto (se llama desde measure)
function igualarAltos(scope) {
  const grupos = {};
  scope.querySelectorAll("[data-alto]").forEach((p) => (grupos[p.dataset.alto] ||= []).push(p));
  Object.values(grupos).forEach((ps) => {
    ps.forEach((p) => (p.style.minHeight = ""));
    const h = Math.max(...ps.map((p) => p.offsetHeight));
    ps.forEach((p) => (p.style.minHeight = `${h}px`));
  });
}

function panelHTML(q) {
  const rareza = Object.hasOwn(RAREZAS, q.rareza) ? q.rareza : "comun";
  if (q.equipo) return equipoHTML(q, rareza);
  const href = (h = "") => (/^#[\w-]+$/.test(h) ? h : safeUrl(h));
  const parrafos = (arr = []) => arr.map((t) => `<p>${escapeHTML(t)}</p>`).join("");
  const lista = (arr, [tag, cls], item) => (arr && arr.length ? `<${tag} class="${cls}">${arr.map(item).join("")}</${tag}>` : "");
  return `
    <article class="panel panel--${rareza}"${altoAttr(q)}>
      <p class="eyebrow">${escapeHTML(q.eyebrow)}</p>
      <h3 class="panel__title">${escapeHTML(q.titulo)}</h3>
      ${q.subtitulo ? `<p class="panel__sub">${escapeHTML(q.subtitulo)}</p>` : ""}
      ${parrafos(q.texto)}
      ${lista(q.etapas, ["ol", "panel__timeline"], (s) => `<li><b>${escapeHTML(s.nombre)}</b><span>${escapeHTML(s.texto)}</span></li>`)}
      ${lista(q.miniCartas, ["ul", "panel__minis"], (m) => `<li class="mini"><b>${escapeHTML(m.nombre)}</b>${m.nivel ? `<span class="panel__stars card__stars" role="img" aria-label="Nivel ${num(m.nivel, 0, 5)} de 5">${stars(m.nivel)}</span>` : ""}<span>${escapeHTML(m.texto)}</span><span class="card__holo" aria-hidden="true"></span></li>`)}
      ${lista(q.herramientas, ["ul", "tags panel__tools"], (h) => `<li>${escapeHTML(h)}</li>`)}
      ${safeUrl(q.foto) ? `<img class="panel__photo" src="${attrUrl(q.foto)}" alt="${escapeHTML(q.fotoAlt || "")}" decoding="async">` : ""}
      ${q.boton && href(q.boton.href) ? `<a class="btn btn--primary panel__btn" href="${escapeHTML(href(q.boton.href))}">${escapeHTML(q.boton.texto)}</a>` : ""}
    </article>`;
}

/* Panel "Mi equipo": una carta de la que saltan los íconos de las herramientas (setupEquipo) */
function equipoHTML(q, rareza) {
  const eq = q.equipo;
  const tools = (eq.herramientas || []).filter((h) => safeUrl(h.icono));
  const numero = String(q.eyebrow || "").split("·")[0].trim();   // "05 · Mi equipo" -> "05"
  // portada: hasta 3 pelotas de la lista, por nombre (un nombre que no exista se ignora)
  const portada = (eq.portada || []).map((n) => tools.find((h) => h.nombre === n)).filter(Boolean).slice(0, 3);
  return `
    <article class="panel panel--${rareza} panel--equipo"${altoAttr(q)}>
      <div class="equipo" id="equipo">
        <div class="equipo__card">
          <div class="equipo__tilt" role="group" aria-label="${escapeHTML(q.titulo)}: ${tools.length} herramientas">
            <div class="card__head">
              <span class="equipo__label">Equipo</span>
              <span class="equipo__chip">×${tools.length}</span>
            </div>
            <div class="card__art equipo__art">
              <div class="equipo__stack" aria-hidden="true">${portada.map((h, i) => `
                <span class="equipo__pile equipo__pile--${i + 1}"><img src="${attrUrl(h.icono)}" alt="" width="256" height="256" decoding="async"></span>`).join("")}
              </div>
            </div>
            <h3 class="equipo__title">${escapeHTML(q.titulo)}</h3>
            ${eq.tipo ? `<div class="card__type">[${escapeHTML(eq.tipo)}]</div>` : ""}
            ${eq.descripcion ? `<p class="equipo__desc">${escapeHTML(eq.descripcion)}</p>` : ""}
            <div class="card__foot"><span>${escapeHTML(numero)}</span><span>${escapeHTML(RAREZAS[rareza].nombre)}</span></div>
            <div class="card__holo" aria-hidden="true"></div>
          </div>
        </div>
        <ul class="equipo__list" aria-label="Herramientas que uso">
          ${tools.map((h, i) => `
          <li data-i="${i}"><img src="${attrUrl(h.icono)}" alt="${escapeHTML(h.nombre)}" width="256" height="256" decoding="async"></li>`).join("")}
        </ul>
      </div>
    </article>`;
}

function renderSobre() {
  const u = safeUrl(SOBRE.imagenes.sobre);
  if (u) { $("#packBody").src = u; $("#packStrip").src = u; }
  $("#sobreTrack").innerHTML = QUIEN_SOY.map(panelHTML).join("");
}

function setupSobre() {
  const section = $("#maestro");
  const stage = $("#sobreStage");

  // decodificar el sobre y la foto antes de que la sección entre (sin parpadeo al aparecer)
  const decodeFirst = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    [$("#packBody"), $("#trainerPhoto img"), ...document.querySelectorAll(".equipo__list img")]
      .forEach((img) => img?.decode?.().catch(() => {}));
    decodeFirst.disconnect();
  }, { rootMargin: "150% 0px" });
  decodeFirst.observe(section);

  if (reduceMotion) return;   // el CSS muestra la carta abierta y los paneles apilados

  const el = {
    hero: $("#arena"), tapete: stage.querySelector(".sobre__tapete"), head: stage.querySelector(".sobre__head"),
    pack: $("#pack"), strip: $("#packStrip"), flash: $("#packFlash"),
    card: $("#mcard"), glow: $("#mcardGlow"), ring: $("#mcardRing"), back: $("#mcard .mcard__back"), tilt: $("#mcardTilt"), inner: $("#mcardInner"), slot: $("#mcardSlot"),
    win: $("#sobreWindow"), track: $("#sobreTrack"), bar: $("#sobreBar"), barFill: $("#sobreBarFill"), hint: $("#sobreHint")
  };
  watchActive(section, stage);

  let m = null, last = null;
  const resetTilt = () => {
    el.tilt.style.setProperty("--rx", "0deg");
    el.tilt.style.setProperty("--ry", "0deg");
  };

  addScene({
    // todas las medidas de layout se leen aquí
    measure() {
      const vh = stage.offsetHeight;   // 100svh
      const vw = stage.clientWidth;
      const px = (svh) => (svh / 100) * vh;
      const cardW = el.card.offsetWidth;
      igualarAltos(el.track);
      const panDist = Math.max(0, el.track.offsetWidth - vw);

      // límites de cada fase, en px de scroll desde que empieza el fade
      const b = {};
      let acc = 0;
      for (const k in FASES_SVH) { b[k] = [acc, acc + px(FASES_SVH[k])]; acc = b[k][1]; }
      b.pan = [acc, acc + panDist / PAN_RATIO];

      // altura: 100svh de escenario + fases (el fade ocurre mientras la sección sube) + pan + reposo
      section.style.height = `${Math.round(vh + b.pan[1] - px(FASES_SVH.fade) + px(REPOSO_SVH))}px`;

      m = {
        vh, vw, b, panDist,
        start: section.offsetTop - px(FASES_SVH.fade),
        dir: parseFloat(getComputedStyle(stage).getPropertyValue("--pack-dir")) || 1,
        packW: el.pack.offsetWidth, packH: el.pack.offsetHeight,
        s0: (0.7 * el.pack.offsetWidth) / cardW,                       // tamaño de la carta dentro del sobre
        dockS: el.slot.offsetWidth / cardW,                             // carta acomodada (posición del hueco)
        dockX: el.slot.offsetLeft + el.slot.offsetWidth / 2 - vw / 2,
        dockY: el.slot.offsetTop + el.slot.offsetHeight / 2 - vh / 2
      };
      last = null;
    },

    update(y) {
      const s = y - m.start;
      if (s === last) return;
      last = s;

      const { b } = m;
      const f = (k) => range(s, b[k][0], b[k][1]);
      const fade = f("fade"), slide = f("slide"), open = f("open"), rise = f("rise");
      const flip = ease(f("flip")), dockT = f("dock"), dock = ease(dockT), pan = f("pan");
      const fall = ease(range(rise, 0.4, 1));
      const o = ease(open);

      // sobre: se desliza hasta el centro (sin vibración) y al abrirse se inclina ~-3°
      const packX = m.dir * (1 - easeSoft(slide)) * (m.vw / 2 + m.packW);
      setStyle(el.pack, "transform", `translate3d(${packX.toFixed(1)}px, ${(fall * 0.75 * m.vh).toFixed(1)}px, 0) rotate(${(-3 * o).toFixed(2)}deg)`);
      setStyle(el.pack, "opacity", (1 - fall).toFixed(3));

      // tira: se arranca girando, sube y se desvanece; destello lima breve en el corte
      setStyle(el.strip, "transform", `translate3d(${(o * 0.14 * m.packW).toFixed(1)}px, ${(-o * 0.26 * m.vh).toFixed(1)}px, 0) rotate(${(-24 * o).toFixed(2)}deg)`);
      setStyle(el.strip, "opacity", (1 - o).toFixed(3));
      setStyle(el.flash, "opacity", Math.max(0, 1 - Math.abs(open - 0.12) / 0.12).toFixed(3));

      // carta: asoma por arriba del sobre, vuelve al centro a tamaño completo, se voltea y se acomoda
      const emerge = ease(range(rise, 0, 0.6)), settle = ease(range(rise, 0.45, 1));
      const riseY = m.packH * 0.1 * (1 - emerge) - m.packH * 0.35 * emerge * (1 - settle);
      const scale = (m.s0 + (1 - m.s0) * settle) * (1 + (m.dockS - 1) * dock);
      setStyle(el.card, "transform", `translate3d(${(m.dockX * dock).toFixed(1)}px, ${(riseY + m.dockY * dock).toFixed(1)}px, 0) scale(${scale.toFixed(4)}) rotate(${(-3 * dock).toFixed(2)}deg)`);
      setStyle(el.card, "opacity", Math.min(1, open * 20).toFixed(3));
      setStyle(el.inner, "transform", `rotateY(${(flip * 180).toFixed(2)}deg)`);
      // resplandor: sube en el primer 55% de rise y baja a EXACTAMENTE 0 al terminar rise; después, 0
      const glow = GLOW.pico * Math.min(ease(range(rise, 0, 0.55)), 1 - ease(range(rise, 0.55, 1)));
      setVar(el.glow, "--o", glow.toFixed(3));
      setVar(el.back, "--o", glow.toFixed(3));   // borde que brilla: ::after del reverso (gira con la carta)
      // anillo circular de onda: se expande y se desvanece durante rise
      const t = range(rise, 0, 1);
      setStyle(el.ring, "opacity", (t > 0 && t < 1 ? 0.7 * (1 - t) : 0).toFixed(3));
      setStyle(el.ring, "transform", `scale(${(0.6 + 0.9 * t).toFixed(4)})`);
      const off = glow < 0.01 && !(t > 0 && t < 1);
      if (off !== el.card.classList.contains("is-glow-off")) el.card.classList.toggle("is-glow-off", off);

      // paneles + barra de progreso
      setStyle(el.win, "opacity", range(dock, 0.6, 1).toFixed(3));
      setStyle(el.track, "transform", `translate3d(${((1 - dock) * 60 - pan * m.panDist).toFixed(1)}px, 0, 0)`);
      setStyle(el.bar, "opacity", dock.toFixed(3));
      setStyle(el.barFill, "transform", `scaleX(${pan.toFixed(4)})`);
      setStyle(el.hint, "opacity", (dock * (1 - Math.min(1, pan * 25))).toFixed(3));

      // entrada: el hero se desvanece y aparece el tapete
      setStyle(el.hero, "opacity", (1 - fade).toFixed(3));
      setStyle(el.tapete, "opacity", fade.toFixed(3));
      setStyle(el.head, "opacity", (fade * (1 - dock)).toFixed(3));

      // estados (no cambian cada frame)
      const out = fall > 0.6;   // la carta pasa delante del sobre que cae
      if (out !== stage.classList.contains("is-out")) stage.classList.toggle("is-out", out);
      const docked = dockT >= 1;
      if (docked !== stage.classList.contains("is-docked")) {
        stage.classList.toggle("is-docked", docked);
        if (!docked) resetTilt();
      }
    }
  });

  // tilt 3D + brillo holográfico: solo con ratón y con la carta ya acomodada
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  el.tilt.addEventListener("pointermove", (e) => {
    if (!stage.classList.contains("is-docked")) return;
    const r = el.tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.tilt.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
    el.tilt.style.setProperty("--rx", `${((0.5 - y) * 12).toFixed(2)}deg`);
    el.tilt.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.tilt.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  });
  el.tilt.addEventListener("pointerleave", resetTilt);
}

/* ---------- Capítulo III · Las Reglas: 4 diapositivas con la carta de 3D como ejemplo ----------
   Los textos salen de REGLAS, RAREZAS y STATS (data.js) */
function renderReglas() {
  const pasos = REGLAS.pasos;
  const ejemplo = CARTAS.find((c) => !c.bloqueada);
  const href = (h = "") => (/^#[\w-]+$/.test(h) ? h : safeUrl(h));
  const resaltes = ["rareza", "estrellas", "habilidades", "estadisticas"];
  const conEstrellas = (t = "") => escapeHTML(t).replace(/★+/g, (s) => `<span class="stars">${s}</span>`);
  const listas = {
    rarezas: () => `<ul class="rule__list">${Object.entries(RAREZAS)
      .map(([key, r]) => `<li><span class="gem gem--${escapeHTML(key)}"></span><b>${escapeHTML(r.nombre)}:</b> ${escapeHTML(r.desc)}</li>`).join("")}</ul>`,
    stats: () => `<ul class="rule__list">${Object.values(STATS)
      .map((s) => { const [name, desc] = s.split(" — "); return `<li><b>${escapeHTML(name)}:</b> ${escapeHTML(desc)}</li>`; }).join("")}</ul>`
  };
  const chips = `<ul class="rchips" aria-hidden="true">${Object.entries(RAREZAS)
    .map(([key, r]) => `<li><span class="gem gem--${escapeHTML(key)}"></span>${escapeHTML(r.nombre)}</li>`).join("")}</ul>`;

  $("#reglasEyebrow").textContent = REGLAS.eyebrow;
  $("#reglasTitle").textContent = REGLAS.titulo;
  $("#reglasSteps").innerHTML = pasos.map((p, i) =>
    `<li><button type="button" data-step="${i}">${escapeHTML(p.paso)}</button></li>`).join("");

  $("#reglasTrack").innerHTML = pasos.map((p, i) => {
    const hl = resaltes.includes(p.resaltar) ? p.resaltar : "rareza";
    const num = String(i + 1).padStart(2, "0");
    return `
      <article class="rslide" id="regla-${i + 1}" aria-labelledby="regla-${i + 1}-t">
        <div class="rslide__text">
          <span class="rslide__num" aria-hidden="true">${num}</span>
          <h3 class="rslide__title" id="regla-${i + 1}-t">${escapeHTML(p.titulo)}</h3>
          ${p.texto ? `<p>${conEstrellas(p.texto)}</p>` : ""}
          ${listas[p.lista] ? listas[p.lista]() : ""}
          ${p.boton && href(p.boton.href) ? `<a class="btn btn--primary rslide__btn" href="${escapeHTML(href(p.boton.href))}">${escapeHTML(p.boton.texto)}</a>` : ""}
        </div>
        <div class="rslide__visual">
          ${ejemplo ? `
          <div class="rslide__card hl-${hl}" role="img" aria-label="Carta de ejemplo (${escapeHTML(ejemplo.nombre)}) con ${escapeHTML(p.paso.toLowerCase())} resaltado">
            <div class="rslide__cardin" inert>${cardHTML(ejemplo)}</div>
          </div>` : ""}
          ${hl === "rareza" ? chips : ""}
        </div>
      </article>`;
  }).join("");
  applyDataStyles($("#reglasTrack"));
}

function setupReglas() {
  const section = $("#reglas");
  const stage = $("#reglasStage");
  const track = $("#reglasTrack");
  const slides = [...track.querySelectorAll(".rslide")];
  const steps = [...$("#reglasSteps").querySelectorAll("button")];
  const count = $("#reglasCount");
  const n = slides.length;
  const parts = slides.map((sl) => [sl.querySelector(".rslide__text"), sl.querySelector(".rslide__visual")]);
  let m = null, last = null, active = -1;

  // paso activo: subrayado en lima, aria-current y contador "1 / 4"
  const setActive = (i) => {
    if (i === active) return;
    active = i;
    steps.forEach((b, j) => (j === i ? b.setAttribute("aria-current", "step") : b.removeAttribute("aria-current")));
    count.textContent = `${i + 1} / ${n}`;
  };
  setActive(0);

  // clic en un paso: va a su posición del scroll
  steps.forEach((b, i) => b.addEventListener("click", () => {
    if (!m) { slides[i].scrollIntoView({ behavior: "auto", block: "start" }); setActive(i); return; }
    window.scrollTo({ top: m.top + m.entry + (n > 1 ? (i / (n - 1)) * m.pan : 0), behavior: reduceMotion ? "auto" : "smooth" });
  }));

  if (reduceMotion) return;   // el CSS apila las diapositivas y deja el resaltado estático
  watchActive(section, stage);

  addScene({
    measure() {
      const vh = stage.offsetHeight;   // 100svh
      const vw = stage.clientWidth;
      const entry = (REGLAS_SVH.entrada / 100) * vh;
      const pan = ((n - 1) * vh) / PAN_RATIO_REGLAS;
      // altura: 100svh + entrada + (n − 1) pantallas de pan + reposo
      section.style.height = `${Math.round(vh + entry + pan + (REGLAS_SVH.reposo / 100) * vh)}px`;
      stage.style.setProperty("--slide-w", `${vw}px`);
      // la carta del mazo (300px de ancho) escalada: ~46vw en móvil; en escritorio según el alto
      const cardScale = vw < 768 ? (0.46 * vw) / 300 : Math.min(1.15, Math.max(0.6, (vh - 260) / 419));
      stage.style.setProperty("--card-scale", cardScale.toFixed(3));
      m = { top: section.offsetTop, vh, entry, pan, dist: (n - 1) * vw };
      last = null;
    },

    update(y) {
      const s = y - m.top;
      if (s === last) return;
      last = s;

      const k = range(s, -0.5 * m.vh, m.entry);            // entrada: la sección sube y se fija
      const p = range(s, m.entry, m.entry + m.pan);         // 0 → 1 a lo largo de las diapositivas
      const pos = p * (n - 1);
      setStyle(track, "transform", `translate3d(${(-p * m.dist).toFixed(1)}px, 0, 0)`);

      // cada diapositiva aparece con un fade + translate corto según su propio progreso
      parts.forEach(([text, visual], i) => {
        const d = pos - i;
        const v = Math.max(0, 1 - Math.abs(d) * 1.6) * k;
        setStyle(text, "opacity", v.toFixed(3));
        setStyle(text, "transform", `translate3d(0, ${((1 - v) * 24).toFixed(1)}px, 0)`);
        setStyle(visual, "opacity", v.toFixed(3));
        setStyle(visual, "transform", `translate3d(${(d * -40).toFixed(1)}px, ${((1 - v) * 16).toFixed(1)}px, 0)`);
      });
      setActive(Math.min(n - 1, Math.max(0, Math.round(pos))));
    }
  });
}

/* ---------- Mini-cartas de "Mis cartas más valiosas": tilt + brillo como las cartas del mazo ---------- */
function setupMiniCartas() {
  if (reduceMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".panel__minis .mini").forEach((li) => {
    li.addEventListener("pointermove", (e) => {
      const r = li.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      li.style.setProperty("--ry", `${((x - 0.5) * 16).toFixed(2)}deg`);
      li.style.setProperty("--rx", `${((0.5 - y) * 16).toFixed(2)}deg`);
      li.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      li.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    });
    li.addEventListener("pointerleave", () => { li.style.setProperty("--rx", "0deg"); li.style.setProperty("--ry", "0deg"); });
  });
}

/* ---------- Panel "Mi equipo": la carta de la que saltan las herramientas ----------
   Escritorio (ratón): se abre al entrar en .equipo y se cierra al salir (250ms de margen);
   las pelotas se reparten en una órbita elíptica alrededor de la carta.
   Táctil o <768px: tocar la carta abre/cierra; las pelotas salen en fila debajo.
   main.js mide y escribe en cada <li>: --cx/--cy (dentro de la carta)
   y --tx/--ty (abierta). Cerradas no se ven: solo la portada dentro de la carta. El CSS solo anima transform y opacity. */
function setupEquipo() {
  const box = $("#equipo");
  if (!box) return;
  const card = box.querySelector(".equipo__card");
  const tilt = box.querySelector(".equipo__tilt");
  const items = [...box.querySelectorAll(".equipo__list li")];
  const n = items.length;
  const touchMQ = matchMedia("(hover: none), (max-width: 767px)");
  box.style.setProperty("--n", n);
  items.forEach((li, i) => li.style.setProperty("--i", i));

  // posiciones: todo relativo a .equipo (offsets, sin transforms); solo al inicio y en resize
  const measure = () => {
    const cx = card.offsetLeft + card.offsetWidth / 2, cy = card.offsetTop + card.offsetHeight / 2;
    const w = card.offsetWidth, h = card.offsetHeight;
    const cs = getComputedStyle(box);   // --ox/--oy: las mismas que dan tamaño al recuadro en el CSS
    const rx = w / 2 + parseFloat(cs.getPropertyValue("--ox")), ry = h / 2 + parseFloat(cs.getPropertyValue("--oy"));
    const touch = touchMQ.matches;
    items.forEach((li, i) => {
      const s = li.offsetWidth;
      const hx = li.offsetLeft + s / 2, hy = li.offsetTop + s / 2;   // dónde está su caja
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;                  // órbita, empezando arriba
      const [tx, ty] = touch ? [0, 0] : [cx + rx * Math.cos(a) - hx, cy + ry * Math.sin(a) - hy];
      const set = (k, v) => li.style.setProperty(k, `${v.toFixed(1)}px`);
      set("--tx", tx); set("--ty", ty);
      set("--cx", cx - hx); set("--cy", cy - hy);
    });
  };
  addScene({ measure, update() {} });   // se vuelve a medir con resize/load, sin listeners nuevos
  touchMQ.addEventListener?.("change", measure);

  let open = false, interacted = false, hovered = false, closeT = 0, animT = 0;
  const setOpen = (v) => {
    if (v === open) return;
    open = v;
    box.classList.add("is-animating");   // will-change solo durante la animación
    box.classList.toggle("is-open", v);
    clearTimeout(animT);
    animT = setTimeout(() => box.classList.remove("is-animating"), v ? 700 + n * 55 : 450 + n * 30);
  };

  if (reduceMotion) { box.classList.add("is-open", "is-static"); return; }   // abiertas y quietas

  // escritorio: solo ratón
  box.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse" || touchMQ.matches) return;
    hovered = interacted = true;
    clearTimeout(closeT);
    setOpen(true);
  });
  box.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse" || touchMQ.matches) return;
    hovered = false;
    clearTimeout(closeT);
    closeT = setTimeout(() => setOpen(false), 250);
  });
  // tilt leve (máx. 8°) con ratón
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      tilt.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(2)}deg`);
      tilt.style.setProperty("--rx", `${((0.5 - (e.clientY - r.top) / r.height) * 16).toFixed(2)}deg`);
      tilt.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      tilt.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    });
    card.addEventListener("pointerleave", () => { tilt.style.setProperty("--rx", "0deg"); tilt.style.setProperty("--ry", "0deg"); });
  }
  // táctil: tocar la carta abre / cierra
  card.addEventListener("click", () => {
    if (!touchMQ.matches) return;
    interacted = true;
    setOpen(!open);
  });

  // demo automática: la primera vez que el panel se ve al 60%, se abre ~1.8s y se cierra
  let demoDone = false;
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) { if (touchMQ.matches) setOpen(false); return; }   // táctil: al salir, se cierra
    if (demoDone || e.intersectionRatio < 0.6) return;
    demoDone = true;
    if (interacted || hovered) return;
    setOpen(true);
    setTimeout(() => { if (!interacted && !hovered) setOpen(false); }, 1800);
  }, { threshold: [0, 0.6] }).observe(box.closest(".panel"));
}

/* ---------- Barra de navegación: toma el color de la sección que tiene debajo ----------
   Las secciones oscuras lo indican con data-nav="dark" | "violet" en index.html (sin atributo = clara).
   Va en el mismo motor de escenas: sin listeners nuevos y sin leer layout durante el scroll. */
function setupNavTheme() {
  const nav = $(".nav");
  const sections = [...document.querySelectorAll("main > section")];
  let zones = [], current, half = 28;
  addScene({
    measure() {
      // se mide después de las demás escenas, que ya han fijado la altura de #maestro y #reglas
      zones = sections.map((s) => ({ top: s.offsetTop, theme: s.dataset.nav || "" }));
      half = nav.offsetHeight / 2;
      current = undefined;
    },
    update(y) {
      const probe = y + half;   // centro de la barra
      let theme = "";
      for (const z of zones) if (z.top <= probe) theme = z.theme;
      if (theme === current) return;
      current = theme;
      if (theme) nav.dataset.theme = theme; else delete nav.dataset.theme;
    }
  });
}

/* ---------- Cartas ---------- */
function stars(nivel) {
  const n = num(nivel, 0, 5);   // fuera de 0–5, "repeat" lanzaría un error y rompería el mazo
  return "★".repeat(n) + `<span class="off">${"★".repeat(5 - n)}</span>`;
}

function cardFront(c) {
  const rareza = RAREZAS[c.rareza];
  const el = ELEMENTOS[c.elemento];
  const art = c.imagen
    ? `<img src="${attrUrl(c.imagen)}" alt="" loading="lazy">`
    : `<span class="card__art-ph">${escapeHTML(el.icono)}</span>`;

  const habilidades = c.habilidades
    .map((h) => `
      <li>
        <div><b>${escapeHTML(h.nombre)}</b> <small>${escapeHTML(h.herramienta)}</small></div>
        <span class="card__power">${num(h.poder)}</span>
      </li>`)
    .join("");

  const stats = Object.keys(STATS)
    .map((k) => `
      <div class="stat">
        <span>${escapeHTML(k.slice(0, 3).toUpperCase())}</span>
        <i data-v="${num(c.stats[k])}"></i>
        <b>${num(c.stats[k])}</b>
      </div>`)
    .join("");

  return `
    <div class="card__face card__front">
      <div class="card__head">
        <span class="card__name">${escapeHTML(c.nombre)}</span>
        <span class="card__el" title="Elemento: ${escapeHTML(el.nombre)}">${escapeHTML(el.icono)}</span>
      </div>
      <div class="card__stars" aria-label="Nivel ${num(c.nivel, 0, 5)} de 5">${stars(c.nivel)}</div>
      <div class="card__art">${art}</div>
      <div class="card__type">[${escapeHTML(el.nombre)} / ${escapeHTML(rareza.nombre)}] ${escapeHTML(c.titulo)}</div>
      <ul class="card__abilities">${habilidades}</ul>
      <div class="card__stats">${stats}</div>
      <p class="card__lema">${escapeHTML(c.lema)}</p>
      <div class="card__foot"><span>${escapeHTML(c.numero)}</span><span>${escapeHTML(rareza.nombre)}</span></div>
      <div class="card__holo" aria-hidden="true"></div>
    </div>`;
}

// estatica: <div> decorativo con el mismo contenido (mano del cierre): sin botón, sin foco ni aria-label
function cardHTML(c, { facedown = false, estatica = false } = {}) {
  if (c.bloqueada) {
    return `
      <div class="card card--locked${estatica ? " card--static" : ""}"${estatica ? "" : ` aria-label="Carta bloqueada: ${escapeHTML(c.pista)}"`}>
        <div class="card__inner">
          <div class="card__face card__back card-back"><span class="card__lock"><span class="card__lock-ring" aria-hidden="true"><span class="card__lock-q">?</span></span><small>${escapeHTML(c.pista)}</small></span></div>
        </div>
      </div>`;
  }
  const clases = `card card--${escapeHTML(c.rareza)} card--el-${escapeHTML(c.elemento)}`;
  const contenido = `
      <div class="card__inner">
        ${cardFront(c)}
        <div class="card__face card__back card-back"></div>
      </div>`;
  if (estatica) return `<div class="${clases} card--static" data-id="${escapeHTML(c.id)}">${contenido}</div>`;
  return `
    <button class="${clases} ${facedown ? "is-facedown" : ""}"
            data-id="${escapeHTML(c.id)}" data-nombre="${escapeHTML(c.nombre)}"
            aria-label="${facedown ? "Carta boca abajo: voltéala" : `Invocar carta ${escapeHTML(c.nombre)}`}">${contenido}
    </button>`;
}

function renderMazo() {
  const deck = $("#deck");
  deck.innerHTML = CARTAS.map((c) => cardHTML(c, { facedown: true })).join("");
  applyDataStyles(deck);

  // Las cartas empiezan boca abajo: el hover (o un toque en celular) las voltea,
  // y solo cuando ya están volteadas un clic las invoca
  const FLIP_MS = reduceMotion ? 0 : 800;   // duración del giro en el CSS (.card__inner)
  const voltear = (el) => {
    if (!el.classList.contains("is-facedown")) return;
    el.classList.remove("is-facedown");
    el.setAttribute("aria-label", `Invocar carta ${el.dataset.nombre}`);
    setTimeout(() => { el.dataset.lista = ""; }, FLIP_MS);
  };

  deck.querySelectorAll(".card[data-id]").forEach((el) => {
    el.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") voltear(el); });
    el.addEventListener("click", () => {
      if (!("lista" in el.dataset)) { voltear(el); return; }   // boca abajo o girando: aún no se invoca
      summon(el.dataset.id);
    });
  });

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

/* ---------- V. La mano final: abanico con las cartas del mazo ----------
   Data-driven: una carta por cada entrada de CARTAS (también la bloqueada). Hasta 5 se reparten
   con ~35% de solape; con más, el abanico ocupa el mismo ancho y se solapan más.
   La carta mide 300px como en el mazo y se escala con --s (ancho del hueco / 300). */
function renderCierre() {
  const mano = $("#mano");
  const MAX = 5;
  const n = CARTAS.length;
  mano.innerHTML = CARTAS.map((c) => `<div class="mano__slot"><div class="mano__scale">${cardHTML(c, { estatica: true })}</div></div>`).join("");
  applyDataStyles(mano);
  const slots = [...mano.children];
  const span = Math.min(n - 1, MAX - 1) / 2;   // separación máxima a cada lado, en "pasos" de carta
  slots.forEach((slot, i) => {
    const t = n > 1 ? (i / (n - 1)) * 2 - 1 : 0;   // -1 (izquierda) … 1 (derecha)
    slot.style.setProperty("--i", i);
    slot.style.setProperty("--t", t.toFixed(4));
    slot.style.setProperty("--kk", (t * span).toFixed(4));   // posición en pasos (CSS: --k, que el reparto pone a 0)
    slot.style.setProperty("--z", i + 1);
  });

  // escala de la carta según el ancho del hueco (cambia con el viewport)
  const escalar = () => mano.style.setProperty("--s", (slots[0].offsetWidth / 300).toFixed(4));
  escalar();
  new ResizeObserver(escalar).observe(slots[0]);

  // decorativa: las cartas no son clicables ni enfocables; solo se levantan con el ratón y brillan (enableTilt)
  enableTilt(mano);

  // reparto: la primera vez que el cierre entra en pantalla, salen apiladas del centro y se abren una a una
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  mano.classList.add("is-stacked");
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    mano.classList.add("is-dealing");
    requestAnimationFrame(() => mano.classList.remove("is-stacked"));
    setTimeout(() => mano.classList.remove("is-dealing"), (n - 1) * 90 + 700);   // después, el hover sin retraso
  }, { threshold: 0.35 });
  io.observe(mano);
}

/* ---------- La partida: detalle de una carta a pantalla completa ----------
   Vista Mano (mini-cartas con las jugadas) y vista Detalle (una jugada con su ficha técnica).
   El dialog #summon es el que hace scroll. */
const pad2 = (n) => String(n).padStart(2, "0");
const esSimple = (p) => !p.historia && !p.medios && !p.galerias;   // imagen + desc

// portada de la mini-carta: p.portada → 1ª imagen de sus medios/galerías → poster del 1er video
function portadaDe(p) {
  if (safeUrl(p.portada)) return p.portada;
  if (esSimple(p)) return safeUrl(p.imagen) ? p.imagen : "";
  const medios = (p.galerias || []).flatMap((g) => g.medios || []).concat(p.medios || []);
  const img = medios.find((m) => m.tipo !== "video" && safeUrl(m.src));
  if (img) return img.src;
  const vid = medios.find((m) => m.tipo === "video" && safeUrl(m.poster));
  return vid ? vid.poster : "";
}

// contenido de una mini-carta (spans: va dentro de un <button>)
function jcardInner(c, p, i) {
  const src = portadaDe(p);
  const ph = `<span class="jcard__ph">${escapeHTML(ELEMENTOS[c.elemento].icono)}</span>`;
  const tags = (p.etiquetas || []).slice(0, 2).map((t) => `<span>${escapeHTML(t)}</span>`).join("");
  return `
    <span class="jcard__inner">
      <span class="jcard__head"><span>Jugada ${pad2(i + 1)}</span>${p.grupo ? `<span class="jcard__chip">${escapeHTML(p.grupo)}</span>` : ""}</span>
      <span class="jcard__art${["top", "bottom"].includes(p.portadaPos) ? ` jcard__art--${p.portadaPos}` : ""}">${src ? `<img src="${attrUrl(src)}" alt="" decoding="async">` : ph}</span>
      <span class="jcard__title">${escapeHTML(p.titulo)}</span>
      ${p.contexto ? `<span class="jcard__ctx">${escapeHTML(p.contexto)}</span>` : ""}
      ${tags ? `<span class="jcard__tags">${tags}</span>` : ""}
      <span class="card__holo" aria-hidden="true"></span>
    </span>`;
}

// imágenes de portada que no existen: el mismo recuadro "pendiente" que los medios
function portadaFallbacks(scope, c) {
  scope.querySelectorAll(".jcard__art img").forEach((img) => {
    const fail = () => { img.outerHTML = `<span class="jcard__ph">${escapeHTML(ELEMENTOS[c.elemento].icono)}</span>`; };
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail, { once: true });
  });
}

// tilt + brillo de las mini-cartas (solo ratón)
function jcardTilt(scope) {
  if (reduceMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  scope.querySelectorAll(".jcard").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 12).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    });
    el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
  });
}

// ficha técnica: Rol · Herramientas · Tiempo · Equipo · Contexto (las vacías no se muestran)
function fichaHTML(p) {
  const f = p.ficha || {};
  const herr = Array.isArray(f.herramientas) ? f.herramientas.filter(Boolean).join(" · ") : f.herramientas;
  const celdas = [["Rol", f.rol], ["Herramientas", herr], ["Tiempo", f.tiempo], ["Equipo", f.equipo], ["Contexto", p.contexto]]
    .filter(([, v]) => v && String(v).trim());
  if (!celdas.length) return "";
  return `<dl class="ficha">${celdas.map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHTML(v)}</dd></div>`).join("")}</dl>`;
}

const partida = { c: null, i: -1, busy: false };

function summon(id) {
  const c = CARTAS.find((x) => x.id === id);
  if (!c) return;
  partida.c = c;
  const dialog = $("#summon");
  dialog.dataset.el = Object.hasOwn(ELEMENTOS, c.elemento) ? c.elemento : "forma";
  dialog.dataset.rareza = Object.hasOwn(RAREZAS, c.rareza) ? c.rareza : "comun";

  $("#summonTitle").textContent = c.nombre;
  $("#summonSubtitle").textContent = `${c.titulo} · ${RAREZAS[c.rareza].nombre} · ${num(c.nivel, 0, 5)}★ de 5`;
  $("#summonChip").innerHTML = `${escapeHTML(c.nombre)} · ${escapeHTML(RAREZAS[c.rareza].nombre)} · <span class="stars">${stars(c.nivel)}</span>`;

  // mano: una sola fila de mini-cartas (el chip de cada una dice su grupo)
  const deck = $("#summonDeck");
  if (!c.proyectos.length) {
    deck.innerHTML = `<p class="plays__empty">Aún no hay jugadas registradas para esta carta.</p>`;
  } else {
    deck.innerHTML = `<div class="jcards">${c.proyectos.map((p, i) =>
      `<button class="jcard" type="button" data-play="${i}" aria-label="Jugada ${pad2(i + 1)}: ${escapeHTML(p.titulo)}">${jcardInner(c, p, i)}</button>`).join("")}</div>`;
    portadaFallbacks(deck, c);
    jcardTilt(deck);
  }

  showHand({ focus: false });
  dialog.showModal();
  dialog.scrollTop = 0;
  $("#summonClose").focus();
}

function showHand({ focus = true } = {}) {
  const dialog = $("#summon");
  partida.i = -1;
  dialog.querySelectorAll("#summonPlays video").forEach((v) => v.pause());
  $("#summonDetail").hidden = true;
  $("#summonHand").hidden = false;
  $("#summonHand").classList.remove("is-playing");
  $("#summonHand").querySelectorAll(".jcard.is-chosen").forEach((el) => el.classList.remove("is-chosen"));
  dialog.classList.remove("is-detail");
  $("#summonBack").textContent = "← Mazo";
  $("#summonCount").textContent = "";
  dialog.scrollTop = 0;
  if (focus) $("#summonTitle").focus({ preventScroll: true });
}

function showDetail(i, { fade = true } = {}) {
  const { c } = partida;
  const total = c.proyectos.length;
  if (!c || i < 0 || i >= total) return;
  partida.i = i;
  const p = c.proyectos[i];
  const dialog = $("#summon");
  const detail = $("#summonDetail");
  const plays = $("#summonPlays");

  plays.querySelectorAll("video").forEach((v) => v.pause());
  plays.innerHTML = detalleHTML(c, p, i, total);
  applyDataStyles(plays);
  setupMedia(plays);
  setupSlides(plays);
  portadaFallbacks(plays, c);
  jcardTilt(plays);

  $("#summonHand").hidden = true;
  detail.hidden = false;
  dialog.classList.add("is-detail");
  $("#summonBack").textContent = "← Mis jugadas";
  $("#summonCount").textContent = `Jugada ${pad2(i + 1)} / ${pad2(total)}`;
  $("#summonPrev").disabled = i === 0;
  $("#summonNext").disabled = i === total - 1;
  dialog.scrollTop = 0;
  if (fade && !reduceMotion) {
    detail.classList.remove("is-entering");
    void detail.offsetWidth;   // reinicia la animación
    detail.classList.add("is-entering");
  }
  $("#summonDetailTitle").focus({ preventScroll: true });
}

function detalleHTML(c, p, i, total) {
  const simple = esSimple(p);
  const tags = (p.etiquetas || []).map((t) => `<li>${escapeHTML(t)}</li>`).join("");
  const link = simple
    ? (safeUrl(p.link) ? `<a class="jugada__link" href="${attrUrl(p.link)}" target="_blank" rel="noopener noreferrer">Ver proyecto ↗</a>` : "")
    : (p.link && safeUrl(p.link.url) ? `<a class="jugada__link" href="${attrUrl(p.link.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(p.link.texto)} ↗</a>` : "");
  const cuerpo = simple
    ? (safeUrl(p.imagen) ? galeriaHTML({ disposicion: "completa", ancho: 760, medios: [{ tipo: "imagen", src: p.imagen, alt: p.titulo }] }) : "")
    : jugadaCuerpoHTML(p);
  const next = i < total - 1 ? c.proyectos[i + 1] : null;

  return `
    <article class="detalle">
      <header class="detalle__head">
        <p class="eyebrow">Jugada ${pad2(i + 1)}${p.contexto ? ` · ${escapeHTML(p.contexto)}` : ""}</p>
        <h2 class="detalle__title" id="summonDetailTitle" tabindex="-1">${escapeHTML(p.titulo)}</h2>
        ${(simple ? p.desc : p.resumen) ? `<p class="detalle__lead">${escapeHTML(simple ? p.desc : p.resumen)}</p>` : ""}
        ${tags ? `<ul class="tags">${tags}</ul>` : ""}
        ${link}
      </header>
      ${fichaHTML(p)}
      <div class="detalle__body">${cuerpo}</div>
      <footer class="detalle__foot">
        ${next
          ? `<button class="jnext" type="button" data-go="${i + 1}">
               <span class="jnext__label"><span class="eyebrow">Siguiente jugada</span><span class="jnext__title">${escapeHTML(next.titulo)} →</span></span>
               <span class="jcard jcard--mini">${jcardInner(c, next, i + 1)}</span>
             </button>`
          : `<button class="jnext jnext--end" type="button" data-close>
               <span class="jnext__label"><span class="eyebrow">Fin de la partida</span><span class="jnext__title">Volver al mazo →</span></span>
             </button>`}
      </footer>
    </article>`;
}

// "jugar" una mini-carta: sube y crece hacia el centro, las demás bajan y se desvanecen
function playCard(el, i) {
  if (partida.busy) return;
  if (reduceMotion) { showDetail(i, { fade: false }); return; }
  partida.busy = true;
  const dialog = $("#summon");
  const r = el.getBoundingClientRect();
  el.style.setProperty("--go-x", `${(dialog.clientWidth / 2 - (r.left + r.width / 2)).toFixed(1)}px`);
  el.style.setProperty("--go-y", `${(dialog.clientHeight / 2 - (r.top + r.height / 2)).toFixed(1)}px`);
  el.classList.add("is-chosen");
  $("#summonHand").classList.add("is-playing");
  setTimeout(() => { partida.busy = false; showDetail(i); }, 340);
}

/* el cuerpo de una jugada: fases de la historia + galerías en su posición */
function jugadaCuerpoHTML(p) {
  // "medios" es atajo de una sola galería; "galerias" permite varias con título y posición
  const galerias = p.galerias || (p.medios ? [{ medios: p.medios }] : []);
  const historia = p.historia || [];
  // posición de cada galería: "tras: n" = justo después de la fase n; "despues" = al final; si no, antes de la historia
  const pos = (g) => (g.tras ? num(g.tras, 0, historia.length) : (g.despues ? historia.length : 0));
  const galeriasEn = (n) => galerias.filter((g) => pos(g) === n).map(galeriaHTML).join("");

  let cuerpo = galeriasEn(0);
  let abiertas = "";
  historia.forEach((f, i) => {
    abiertas += `
      <li class="fase">
        <span class="fase__num">${String(i + 1).padStart(2, "0")}</span>
        <div><h5>${escapeHTML(f.titulo)}</h5><p>${escapeHTML(f.texto)}</p></div>
      </li>`;
    const tras = galeriasEn(i + 1);
    if (tras) { cuerpo += `<ol class="fases">${abiertas}</ol>${tras}`; abiertas = ""; }
  });
  if (abiertas) cuerpo += `<ol class="fases">${abiertas}</ol>`;
  if (!historia.length) cuerpo += galerias.filter((g) => g.despues).map(galeriaHTML).join("");
  return cuerpo;
}

/* disposicion: "galeria" (por defecto: la 1ª grande + cuadrícula, con zoom al objeto),
   "presentacion" (carrusel de diapositivas), "piezas" (piezas gráficas lado a lado, sin recortes)
   o "completa" (una debajo de otra, a todo el ancho, en tamaño grande) */
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
  const cls = disp === "piezas" ? "gallery gallery--piezas"
    : disp === "completa" ? "gallery gallery--completa"
    : medios.length > 1 ? "gallery" : "gallery gallery--single";
  return `
    <div class="gallery-block">
      ${titulo}
      <div class="${cls}" data-galeria${g.ancho ? ` data-max="${num(g.ancho, 0, 4000)}"` : ""}>${medios.map(mediaHTML).join("")}</div>
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
      <div class="media media--video" role="button" tabindex="0" data-video="${attrUrl(m.src)}"
        data-poster="${attrUrl(m.poster)}" data-alt="${alt}" aria-label="Ver en grande: ${alt}"
        ${m.poster ? `data-bg="${attrUrl(m.poster)}"` : ""}>
        <!-- la portada va como fondo: el atributo poster se estira en lugar de recortarse -->
        <video muted loop playsinline preload="metadata" data-src="${attrUrl(m.src)}"
          ${safeUrl(m.srcWebm) ? `data-webm="${attrUrl(m.srcWebm)}"` : ""} aria-hidden="true"
          ${reduceMotion ? "controls" : ""}></video>
      </div>`;
  }
  return `
    <button class="media media--img${m.alto ? " media--tall" : ""}" type="button" data-full="${attrUrl(m.src)}" data-alt="${alt}" aria-label="Ver en grande: ${alt}">
      <img src="${attrUrl(m.src)}" alt="${alt}" decoding="async">
      ${m.alt ? `<span class="media__cap">${escapeHTML(m.alt.split(" · ")[0])}</span>` : ""}
    </button>`;
}

// recuadro "pendiente" cuando el archivo aún no existe
function mediaPlaceholder(el, alt) {
  const ph = document.createElement("div");
  ph.className = "media media--ph";
  ph.innerHTML = `<span>${escapeHTML(String(alt || "").split(" · ")[0])}</span><small>Pendiente</small>`;
  el.replaceWith(ph);
}

let videoObserver;
// el video no se puede reproducir aquí (p. ej. un navegador sin H.264): se queda el poster
// y una nota con enlace directo al archivo (no el recuadro "Pendiente": el archivo sí existe)
function videoNoSoportado(v) {
  const box = v.closest(".media");
  if (!box || box.classList.contains("is-unsupported")) return;
  clearTimeout(v.__timer);
  v.pause();
  v.hidden = true;
  box.classList.add("is-unsupported");
  box.removeAttribute("role");
  box.removeAttribute("tabindex");
  box.setAttribute("aria-label", box.dataset.alt || "Video");
  const note = document.createElement("p");
  note.className = "media__note";
  note.innerHTML = `Tu navegador no puede reproducir este video. Ábrelo en Chrome o Edge.
    <a href="${attrUrl(v.dataset.src)}" target="_blank" rel="noopener noreferrer">Ver el video ↗</a>`;
  box.append(note);
}
// carga perezosa: <source> webm (si hay) + mp4, y vigila que llegue a poder reproducirse
function cargarVideo(v) {
  if (v.dataset.loaded) return;
  v.dataset.loaded = "1";
  const sources = [[v.dataset.webm, "video/webm"], [v.dataset.src, "video/mp4"]].filter(([s]) => s);
  sources.forEach(([src, type], i) => {
    const s = document.createElement("source");
    s.src = src; s.type = type;
    // el error de la última <source> = ninguna se pudo usar
    if (i === sources.length - 1) s.addEventListener("error", () => videoNoSoportado(v), { once: true });
    v.append(s);
  });
  v.load();
  // si en 10 s no llega ni el primer fotograma, se da por no soportado
  v.__timer = setTimeout(() => { if (v.readyState < 2 && !v.error) videoNoSoportado(v); }, 10000);
  v.addEventListener("loadeddata", () => clearTimeout(v.__timer), { once: true });
}
function reproducir(v) {
  if (reduceMotion || v.closest(".is-unsupported")) return;
  v.play().catch((err) => {
    if (err && err.name === "NotSupportedError") videoNoSoportado(v);
    else if (err && err.name === "NotAllowedError") v.controls = true;   // solo falla el autoplay: controles nativos
  });
}
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
      if (isIntersecting) { cargarVideo(v); reproducir(v); }
      else v.pause();
    });
  }, { root: $("#summon"), threshold: 0.25 });

  scope.querySelectorAll(".media--video video").forEach((v) => {
    // MEDIA_ERR_SRC_NOT_SUPPORTED (4) o decodificación imposible (3): poster + nota
    v.addEventListener("error", () => { if (v.error && v.error.code >= 3) videoNoSoportado(v); });
    videoObserver.observe(v);
  });
}

/* ---------- Visor de imágenes en grande ---------- */
function setupViewer() {
  const viewer = $("#viewer");
  const img = $("#viewerImg");
  let list = [];
  let i = 0;

  const video = $("#viewerVideo");

  const show = (n) => {
    i = (n + list.length) % list.length;
    const item = list[i];
    const esVideo = "video" in item.dataset;
    img.hidden = esVideo;
    video.hidden = !esVideo;
    if (esVideo) {
      img.removeAttribute("src");
      video.poster = item.dataset.poster;
      video.src = item.dataset.video;
      if (!reduceMotion) video.play().catch(() => {});
      video.controls = reduceMotion;
    } else {
      video.pause();
      video.removeAttribute("src");
      img.src = item.dataset.full;
      img.alt = item.dataset.alt;
    }
    $("#viewerCaption").textContent = `${list[i].dataset.alt} · ${i + 1} de ${list.length}`;
    viewer.classList.toggle("is-single", list.length < 2);
    // piezas muy altas (pósters): se ven a lo ancho y se recorren con scroll
    viewer.classList.toggle("is-tall", list[i].classList.contains("media--tall"));
    viewer.scrollTop = 0;
  };

  // un clic en cualquier foto, diapositiva o video lo abre en grande
  const abrir = (item) => {
    list = [...item.closest("[data-galeria]").querySelectorAll(".media--img, .media--video:not(.is-unsupported)")];
    show(list.indexOf(item));
    viewer.showModal();
  };
  $("#summonPlays").addEventListener("click", (e) => {
    if (e.target.closest("a")) return;   // el enlace de la nota de video abre el archivo, no el visor
    const item = e.target.closest(".media--img, .media--video:not(.is-unsupported)");
    if (item) abrir(item);
  });
  $("#summonPlays").addEventListener("keydown", (e) => {
    const item = e.target.closest(".media--video:not(.is-unsupported)");
    if (item && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); abrir(item); }
  });
  viewer.addEventListener("close", () => video.pause());
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
  const go = (d) => { if (partida.i >= 0) showDetail(partida.i + d); };
  $("#summonClose").addEventListener("click", () => dialog.close());
  $("#summonBack").addEventListener("click", () => (partida.i >= 0 ? showHand() : dialog.close()));
  $("#summonPrev").addEventListener("click", () => go(-1));
  $("#summonNext").addEventListener("click", () => go(1));
  // mini-cartas, "siguiente jugada", "mis jugadas" y "volver al mazo" (delegado)
  dialog.addEventListener("click", (e) => {
    const t = e.target.closest("[data-play], [data-go], [data-hand], [data-close]");
    if (!t) return;
    if (t.dataset.play !== undefined) playCard(t, num(t.dataset.play, 0, 999));
    else if (t.dataset.go !== undefined) showDetail(num(t.dataset.go, 0, 999));
    else if (t.dataset.hand !== undefined) showHand();
    else dialog.close();
  });
  // al cerrar, detener los videos
  dialog.addEventListener("close", () => dialog.querySelectorAll("video").forEach((v) => v.pause()));
}

renderMaestro();
setupHero();
renderSobre();
renderReglas();
setupSobre();
setupEquipo();
setupMiniCartas();
setupReglas();
setupNavTheme();
renderMazo();
renderCierre();
setupSummon();
setupViewer();
