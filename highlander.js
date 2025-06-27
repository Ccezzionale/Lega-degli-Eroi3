
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

const container = document.getElementById("griglia-highlander");

squadre.forEach(sq => {
  const div = document.createElement("div");
  div.className = "squadra " + sq.status;

  const img = document.createElement("img");
  img.src = sq.logo;
  img.alt = sq.nome;

  const nome = document.createElement("div");
  nome.textContent = sq.nome;

  div.appendChild(img);
  div.appendChild(nome);
  container.appendChild(div);
});
