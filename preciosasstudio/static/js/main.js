"use strict";
/* ===== CONFIGURAÇÃO (editar aqui) ===== */
const CONFIG = {
  whatsapp: "554788399708",              // DDI + DDD + número, só dígitos
  instagram: "https://instagram.com/yasdoscilios",
  endereco: "Rua Vicente Leporace, 455, Fátima"
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const wa = (txt = "Olá! Vim pelo site e gostaria de um orçamento.") => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;

/* Links de contato */
$$("[data-wa]").forEach(a => a.href = wa());
$$("[data-ig]").forEach(a => a.href = CONFIG.instagram);
$("#mapLink").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.endereco);
$("#addr").textContent = CONFIG.endereco;
$("#yr").textContent = new Date().getFullYear();

/* Header */
const hdr = $("#hdr"), burger = $("#burger"), nav = $("#nav");
const onScroll = () => hdr.classList.toggle("solid", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true }); onScroll();
const toggleMenu = open => {
  nav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  hdr.classList.toggle("menu", open);
};
burger.addEventListener("click", () => toggleMenu(!nav.classList.contains("open")));
$$("a", nav).forEach(a => a.addEventListener("click", () => toggleMenu(false)));
addEventListener("keydown", e => e.key === "Escape" && toggleMenu(false));

/* Pré-selecionar serviço no formulário */
const svc = $("#svc");
const pick = name => { svc.value = name; };
$$(".item [data-sv]").forEach(b => b.addEventListener("click", () => {
  pick(b.dataset.sv);
  $("#orcar").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("#nome").focus({ preventScroll: true }), 700);
}));

/* Abas de serviços */
const tabs = $$('[role=tab]');
tabs.forEach(t => t.addEventListener("click", () => {
  tabs.forEach(o => {
    const on = o === t;
    o.setAttribute("aria-selected", on); o.tabIndex = on ? 0 : -1;
    $("#" + o.getAttribute("aria-controls")).hidden = !on;
  });
}));
$(".tabs").addEventListener("keydown", e => {
  if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  const i = (tabs.findIndex(t => t.tabIndex === 0) + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[i].focus(); tabs[i].click();
});

/* Formulário -> WhatsApp */
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const d = $("#dia").value ? new Date($("#dia").value + "T12:00").toLocaleDateString("pt-BR") : "a combinar";
  const obs = $("#obs").value.trim();
  const msg = `Olá! Sou ${$("#nome").value.trim()} e gostaria de um orçamento/agendamento.\n` +
    `Serviço: ${svc.value}\nDia preferido: ${d} (${$("#per").value})` + (obs ? `\nObservações: ${obs}` : "");
  window.open(wa(msg), "_blank", "noopener");
});

/* Lightbox da galeria (legendas vêm do HTML) */
const lb = $("#lb"), lbImg = $("#lbImg");
$$("#gallery button").forEach(b => b.addEventListener("click", () => {
  const im = $("img", b);
  lbImg.src = im.getAttribute("src"); lbImg.alt = im.alt; $("#lbCap").textContent = b.dataset.title;
  lb.showModal();
}));
lb.addEventListener("click", e => { if (e.target !== lbImg) lb.close(); });

/* Revelar ao rolar */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12 });
$$(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el); });
