const URL_CLASSIFICA_TOTALE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=2021963336&single=true&output=csv";

fetch(URL_CLASSIFICA_TOTALE)
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n");
    const startRow = 1;
    const squadre = [];

    for (let i = startRow; i < righe.length && squadre.length < 12; i++) {
      const colonne = righe[i].split(",").map(c => c.replace(/"/g, "").trim());
      const nome = colonne[1];
      const punti = parseInt(colonne[9]) || 0;

      squadre.push({ nome, punti });
    }

    squadre.sort((a, b) => b.punti - a.punti);

    const posizioni = [
      [4, 11], [5, 10], [6, 9], [7, 8], // Wild Card
      [0, "Vincente 8/9"],
      [1, "Vincente 7/10"],
      [2, "Vincente 6/11"],
      [3, "Vincente 5/12"]
    ];

    const matchDivs = document.querySelectorAll(".match");

    matchDivs.forEach((match, idx) => {
      const spans = match.querySelectorAll("span");

      if (idx < 4) {
  // Wild Card
  const i1 = posizioni[idx][0];
  const i2 = posizioni[idx][1];
  const nomeA = squadre[i1] ? squadre[i1].nome : "";
  const nomeB = squadre[i2] ? squadre[i2].nome : "";

  spans[0].textContent = `${i1 + 1}° ${nomeA}`;
  spans[2].textContent = `${i2 + 1}° ${nomeB}`;

} else if (idx < 8) {
  // Quarti
  const testaSerieIndex = idx - 4;
  const squadra = squadre[testaSerieIndex];
  spans[0].textContent = `${testaSerieIndex + 1}° ${squadra.nome}`;

  const mapping = [
    [7, 8],   // 1° vs Vincente 8°-9°
    [4, 11],  // 4° vs Vincente 5°-12°
    [5, 10],  // 3° vs Vincente 6°-11°
    [6, 9]    // 2° vs Vincente 7°-10°
  ];

  const [a, b] = mapping[testaSerieIndex];
  const idxA = posizioni[a]?.[0];  // es: 8° è posizioni[7][0]
  const idxB = posizioni[b]?.[1];  // es: 9° è posizioni[7][1]

  const nomeA = squadre[idxA] ? `${idxA + 1}° ${squadre[idxA].nome}` : `${idxA + 1}°`;
  const nomeB = squadre[idxB] ? `${idxB + 1}° ${squadre[idxB].nome}` : `${idxB + 1}°`;

  spans[2].textContent = `Vincente ${nomeA} / ${nomeB}`;
}

    });
  })
  .catch(err => {
    console.error("❌ Errore nel caricamento classifica Totale:", err);
  });
