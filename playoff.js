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
        spans[0].textContent = `${posizioni[idx][0] + 1}° ${squadre[posizioni[idx][0]].nome}`;
        spans[2].textContent = `${posizioni[idx][1] + 1}° ${squadre[posizioni[idx][1]].nome}`;
      } else if (idx < 8) {
        spans[0].textContent = `${posizioni[idx - 4][0] + 1}° ${squadre[posizioni[idx - 4][0]].nome}`;
        spans[2].textContent = posizioni[idx - 4][1];
      }
    });
  })
  .catch(err => {
    console.error("❌ Errore nel caricamento classifica Totale:", err);
  });
