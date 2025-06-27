
const squadre = [
  { nome: "RubinKebab", logo: "img/Rubinkebab.png", status: "attiva" },
  { nome: "Bayern Christiansen", logo: "img/Bayern Christiansen.png", status: "attiva" },
  { nome: "Team Bartowski", logo: "img/Team Bartowski.png", status: "attiva" },
  { nome: "Real Mimmo", logo: "img/Real Mimmo.png", status: "attiva" },
  { nome: "Union Librino", logo: "img/Union Librino.png", status: "attiva" },
  { nome: "Ibla", logo: "img/Ibla.png", status: "attiva" },
  { nome: "Rafa Casablanca", logo: "img/Rafa Casablanca.png", status: "eliminata" },
  { nome: "Giody", logo: "img/Giody.png", status: "attiva" },
  { nome: "Desperados", logo: "img/Desperados.png", status: "attiva" },
  { nome: "Wildboys 78", logo: "img/wildboys78.png", status: "attiva" },
  { nome: "Pandinicoccolosini", logo: "img/Pandinicoccolosini.png", status: "attiva" },
  { nome: "Giulay", logo: "img/Giulay.png", status: "attiva" },
  { nome: "Pokermantra", logo: "img/PokerMantra.png", status: "attiva" },
  { nome: "Minnesode Timberland", logo: "img/Minnesode Timberland.png", status: "attiva" },
  { nome: "Minnesota Snakes", logo: "img/MinneSota Snakes.png", status: "attiva" },
  { nome: "Sharknado04", logo: "img/Sharknado 04.png", status: "attiva" }
];

const center = document.getElementById("arena-center");
center.innerHTML = "Sfida in corso";

const arena = document.querySelector(".arena");
const r = 260, cx = 300, cy = 300;

squadre.forEach((s, i) => {
  const angle = (2 * Math.PI / squadre.length) * i;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const div = document.createElement("div");
  div.className = "squadra" + (s.status === "eliminata" ? " eliminata" : "");
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  const img = document.createElement("img");
  img.src = s.logo;
  img.alt = s.nome;
  div.appendChild(img);
  arena.appendChild(div);
});
