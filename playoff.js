const URL_CLASSIFICA_TOTALE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=2021963336&single=true&output=csv";

fetch(URL_CLASSIFICA_TOTALE)
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n");
    const startRow = 1;
    window.squadre = [];

    for (let i = startRow; i < righe.length && squadre.length < 12; i++) {
      const colonne = righe[i].split(",").map(c => c.replace(/"/g, "").trim());
      const nome = colonne[1];
      const punti = parseInt(colonne[9]) || 0;
      window.squadre.push({ nome, punti });
    
    }

    squadre.sort((a, b) => b.punti - a.punti);

    const posizioni = [
  [5, 10], // posizione 0
  [6, 9],  // 1
  [7, 8],  // 2
  [4, 11], // 3
  [7, 8],  // 4 → Vincente 8°-9°
  [6, 9],  // 5 → Vincente 7°-10°
  [5, 10], // 6 → Vincente 6°-11°
  [4, 11]  // 7 → Vincente 5°-12°
];

    const matchDivs = document.querySelectorAll(".match");

    matchDivs.forEach((match, idx) => {
  if (!posizioni[idx] || posizioni[idx].length < 2) return;
      const spans = match.querySelectorAll("span");

  if (idx < 4) {
  // Wild Card
  const i1 = posizioni[idx][0];
  const i2 = posizioni[idx][1];
  spans[0].textContent = `${i1 + 1}° ${squadre[i1].nome}`;
  spans[2].textContent = `${i2 + 1}° ${squadre[i2].nome}`;
} else if (idx < 8) {
  // Quarti
  const testaSerieIndex = idx - 4;
  const teamTop4Index = testaSerieIndex;
  const squadra = squadre[teamTop4Index];
  spans[0].textContent = `${teamTop4Index + 1}° ${squadra.nome}`;

  // Mapping degli accoppiamenti: [indice in posizioni]
  const mapping = [
    [4, 2],   // 1° vs Vincente 8°-9°
    [5, 1],   // 2° vs Vincente 7°-10°
    [6, 0],   // 3° vs Vincente 6°-11°
    [7, 3]    // 4° vs Vincente 5°-12°
  ];

  const [idxPosA, idxPosB] = mapping[testaSerieIndex];
  const squadraAIndex = posizioni[idxPosA][0];
  const squadraBIndex = posizioni[idxPosB][1];

  // ✅ PROTEZIONE contro undefined
  if (!squadre[squadraAIndex] || !squadre[squadraBIndex]) {
    spans[2].textContent = `Vincente ${squadraAIndex + 1} / ${squadraBIndex + 1}`;
    return;
  }

  const nomeA = `${squadraAIndex + 1}° ${squadre[squadraAIndex].nome}`;
  const nomeB = `${squadraBIndex + 1}° ${squadre[squadraBIndex].nome}`;

  spans[2].textContent = `Vincente ${nomeA} / ${nomeB}`;
}

    });
  })
  .catch(err => {
    console.error("❌ Errore nel caricamento classifica Totale:", err);
  });
