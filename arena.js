
const squadre = [
  { nome: "RAFA CASABLANCA", logo: "img/rafa.png", status: "attiva" },
  { nome: "UNION LIBRINO", logo: "img/union.png", status: "attiva" },
  { nome: "WILDBOYS", logo: "img/wildboys.png", status: "eliminata" },
  { nome: "TEAM BARTOWSKI", logo: "img/bartowski.png", status: "attiva" },
  { nome: "GIODY", logo: "img/giody.png", status: "attiva" },
  { nome: "POKERMANTRA", logo: "img/pokermantra.png", status: "attiva" },
  { nome: "GIULAY", logo: "img/giulay.png", status: "attiva" },
  { nome: "IBLA", logo: "img/ibla.png", status: "attiva" },
  { nome: "REAL MIMMO", logo: "img/mimmo.png", status: "attiva" },
  { nome: "RUBINKABAB", logo: "img/rubin.png", status: "attiva" },
  { nome: "BAYERN CHRISTIANSEN", logo: "img/bayern.png", status: "attiva" },
  { nome: "MINNESODE TIMBERLAND", logo: "img/minnesode.png", status: "attiva" },
  { nome: "SQUADRA 13", logo: "img/placeholder.png", status: "attiva" },
  { nome: "SQUADRA 14", logo: "img/placeholder.png", status: "attiva" },
  { nome: "SQUADRA 15", logo: "img/placeholder.png", status: "attiva" },
  { nome: "SQUADRA 16", logo: "img/placeholder.png", status: "attiva" }
];

const center = document.getElementById("arena-center");
center.innerHTML = "Sfida in corso";

const arena = document.querySelector(".arena");
const raggio = 260;
const centroX = 300;
const centroY = 300;

squadre.forEach((squadra, i) => {
  const angle = (2 * Math.PI / squadre.length) * i;
  const x = centroX + raggio * Math.cos(angle);
  const y = centroY + raggio * Math.sin(angle);

  const div = document.createElement("div");
  div.className = "squadra" + (squadra.status === "eliminata" ? " eliminata" : "");

  const img = document.createElement("img");
  img.src = squadra.logo;
  img.alt = squadra.nome;

  const name = document.createElement("div");
  name.textContent = squadra.nome;

  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  div.appendChild(img);
  div.appendChild(name);
  arena.appendChild(div);
});
