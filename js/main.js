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
    photo.innerHTML = img;
    avatar.innerHTML = img;
  } else {
    photo.classList.add("is-empty");
    avatar.classList.add("is-empty");
  }

  $("#prologo").innerHTML = MAESTRO.prologo.map((p) => `<p>${escapeHTML(p)}</p>`).join("");
  $("#trainerCount").textContent = CARTAS.filter((c) => !c.bloqueada).length;

  $("#contactMail").href = `mailto:${MAESTRO.correo}`;
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
  return "★".repeat(nivel) + `<span class="off">${"★".repeat(10 - nivel)}</span>`;
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
      <div class="card__stars" aria-label="Nivel ${c.nivel} de 10">${stars(c.nivel)}</div>
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
  $("#summonSubtitle").textContent = `${c.titulo} · ${RAREZAS[c.rareza].nombre} · Nivel ${c.nivel}`;

  $("#summonPlays").innerHTML = c.proyectos.length
    ? c.proyectos.map((p) => {
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
      }).join("")
    : `<p class="plays__empty">Aún no hay jugadas registradas para esta carta.</p>`;

  const dialog = $("#summon");
  dialog.showModal();
  dialog.scrollTop = 0;
}

function setupSummon() {
  const dialog = $("#summon");
  $("#summonClose").addEventListener("click", () => dialog.close());
  // cerrar al hacer clic fuera del contenido
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
}

renderMaestro();
renderReglas();
renderMazo();
setupSummon();
