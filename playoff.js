const URL_CLASSIFICA_TOTALE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=691152130&single=true&output=csv";

function formattaNomePerLogo(nome) {
  return nome
    .toLowerCase()
    .replace(/[°]/g, '')     // rimuove simbolo °
    .replace(/[^\w\s]/g, '') // rimuove simboli strani
    .replace(/\s+/g, '_')    // spazi → underscore
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // rimuove accenti
}

function aggiornaPlayoff() {
  const posizioni = [
    [5, 10],
    [6, 9],
    [7, 8],
    [4, 11],
    [7, 8],
    [6, 9],
    [5, 10],
    [4, 11]
  ];

  const matchDivs = document.querySelectorAll(".match");

  matchDivs.forEach((match, idx) => {
    if (!posizioni[idx] || posizioni[idx].length < 2) return;
    const spans = match.querySelectorAll("span");

if (idx < 4) {
  const mappingWC = [
    [7, 8],  // 8° vs 9°
    [4, 11], // 5° vs 12°
    [5, 10], // 6° vs 11°
    [6, 9]   // 7° vs 10°
  ];

  const [i1, i2] = mappingWC[idx];

  const matchId = `WC${idx + 1}`;
  const risultato = window.risultati?.find(r => r.partita === matchId);

  if (!risultato || (!risultato.golA && !risultato.golB)) {
    spans[0].innerHTML = `
  <div class="squadra">
    <img src="img/${formattaNomePerLogo(squadre[i1].nome)}.png" alt="${squadre[i1].nome}">
    <span>${i1 + 1}° ${squadre[i1].nome}</span>
  </div>`;
spans[2].innerHTML = `
  <div class="squadra">
    <img src="img/${formattaNomePerLogo(squadre[i2].nome)}.png" alt="${squadre[i2].nome}">
    <span>${i2 + 1}° ${squadre[i2].nome}</span>
  </div>`;

    } else if (idx < 8) {
  const ordineTesteDiSerie = [0, 3, 2, 1]; // 1°, 4°, 3°, 2°
  const testaSerieIndex = idx - 4;
  const teamTop4Index = ordineTesteDiSerie[testaSerieIndex];
  const squadraTop = squadre[teamTop4Index];
  spans[0].innerHTML = `
  <div class="squadra">
    <img src="img/${formattaNomePerLogo(squadraTop.nome)}.png" alt="${squadraTop.nome}">
    <span>${teamTop4Index + 1}° ${squadraTop.nome}</span>
  </div>`;

  const mapping = [
    [4, 2],   // 1° vs 8–9
    [7, 3],   // 4° vs 5–12
    [6, 0],   // 3° vs 6–11
    [5, 1]    // 2° vs 7–10
  ];

  const [idxPosA, idxPosB] = mapping[testaSerieIndex];
  const squadraAIndex = posizioni[idxPosA][0];
  const squadraBIndex = posizioni[idxPosB][1];

  const nomeA = `${squadraAIndex + 1}° ${squadre[squadraAIndex]?.nome || "?"}`;
  const nomeB = `${squadraBIndex + 1}° ${squadre[squadraBIndex]?.nome || "?"}`;

  const matchId = `Q${testaSerieIndex + 1}`;
  const risultato = window.risultati?.find(r => r.partita === matchId);
  
console.log(`🧠 Quarto ${matchId} → ${nomeA} vs ${nomeB} | Vincente: ${risultato?.vincente || "?"}`);

  if (risultato?.vincente) {
    spans[2].textContent = risultato.vincente;
  } else {
    spans[2].innerHTML = `
  <div class="squadra">
    <span>Vincente ${nomeA} / ${nomeB}</span>
  </div>`;
  }
}
  });

// 🟢 Caricamento classifica
fetch(URL_CLASSIFICA_TOTALE)
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n");
    const startRow = 1;
    const squadreProvvisorie = [];

    for (let i = startRow; i < righe.length; i++) {
      const colonne = righe[i].split(",").map(c => c.replace(/"/g, "").trim());
      const nome = colonne[1];
      const punti = parseInt(colonne[10]) || 0;
      const mp = parseFloat(colonne[11].replace(",", ".")) || 0;
      if (!nome || isNaN(punti)) continue;
      squadreProvvisorie.push({ nome, punti, mp });
      if (squadreProvvisorie.length === 12) break;
    }

    squadreProvvisorie.sort((a, b) => {
      if (b.punti !== a.punti) return b.punti - a.punti;
      return b.mp - a.mp;
    });

    window.squadre = squadreProvvisorie;
    
  })
  .catch(err => console.error("❌ Errore nel caricamento classifica Totale:", err));
