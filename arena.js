
const squadre = [
  { nome: "Rubin Kebab", logo: "img/Rubinkebab.png", eliminata: true, ultimaEliminata: false },
  { nome: "Bayern Christiansen", logo: "img/Bayern Christiansen.png", eliminata: false, ultimaEliminata: false },
  { nome: "Team Bartowski", logo: "img/Team Bartowski.png", eliminata: false, ultimaEliminata: true },
  { nome: "Real Mimmo", logo: "img/Real Mimmo.png", eliminata: true, ultimaEliminata: false },
  { nome: "Union Librino", logo: "img/Union Librino.png", eliminata: false, ultimaEliminata: false },
  { nome: "Ibla", logo: "img/Ibla.png", eliminata: true, ultimaEliminata: false },
  { nome: "Rafa Casablanca", logo: "img/Rafa Casablanca.png", eliminata: true, ultimaEliminata: false },
  { nome: "Giody", logo: "img/Giody.png", eliminata: false, ultimaEliminata: false },
  { nome: "Desperados", logo: "img/Desperados.png", eliminata: false, ultimaEliminata: false },
  { nome: "Wildboys 78", logo: "img/wildboys78.png", eliminata: false, ultimaEliminata: false },
  { nome: "Pandinicoccolosini", logo: "img/Pandinicoccolosini.png", eliminata: false, ultimaEliminata: false },
  { nome: "Giulay", logo: "img/Giulay.png", eliminata: true, ultimaEliminata: false },
  { nome: "Pokermantra", logo: "img/PokerMantra.png", eliminata: true, ultimaEliminata: false },
  { nome: "Minnesode Timberland", logo: "img/Minnesode Timberland.png", eliminata: true, ultimaEliminata: false },
  { nome: "Minnesota Snakes", logo: "img/MinneSota Snakes.png", eliminata: true, ultimaEliminata: false },
  { nome: "Sharknado04", logo: "img/Sharknado 04.png", eliminata: false, ultimaEliminata: false }
];

const center = document.getElementById("arena-center");

const ultimaEliminata = squadre.find(s => s.ultimaEliminata);
if (ultimaEliminata) {
center.innerHTML = `
  <div class="eliminata-wrapper">
    <img src="${ultimaEliminata.logo}" class="eliminata-logo" />
    <div class="eliminata-testo">❌ Eliminata<br>${ultimaEliminata.nome}</div>
  </div>
`;
} else {
  center.innerHTML = "Sfida in corso";
}

const arena = document.querySelector(".arena");
const r = 260, cx = 300, cy = 300;

squadre.forEach((s, i) => {
  const angle = (2 * Math.PI / squadre.length) * i;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const div = document.createElement("div");
  div.className = "squadra" + (s.eliminata ? " eliminata" : "");
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  const img = document.createElement("img");
  img.src = s.logo;
  img.alt = s.nome;
  div.appendChild(img);
  arena.appendChild(div);
});
