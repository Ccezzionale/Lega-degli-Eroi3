const URL_CLASSIFICA_TOTALE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=691152130&single=true&output=csv";

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
        [7, 8], [4, 11], [5, 10], [6, 9]
      ];
      const [i1, i2] = mappingWC[idx];
      spans[0].textContent = `${i1 + 1}° ${squadre[i1].nome}`;

      const matchId = `WC${idx + 1}`;
      const vincitore = window.risultati?.find(r => r.partita === matchId)?.vincente;
      if (vincitore) {
        spans[2].textContent = vincitore;
        return;
      }

      spans[2].textContent = `${i2 + 1}° ${squadre[i2].nome}`;
    } else if (idx < 8) {
      const ordineTesteDiSerie = [0, 3, 2, 1];
      const testaSerieIndex = idx - 4;
      const teamTop4Index = ordineTesteDiSerie[testaSerieIndex];
      const squadra = squadre[teamTop4Index];
      spans[0].textContent = `${teamTop4Index + 1}° ${squadra.nome}`;

      const mapping = [
        [4, 2], [7, 3], [6, 0], [5, 1]
      ];
      const [idxPosA, idxPosB] = mapping[testaSerieIndex];
      const squadraAIndex = posizioni[idxPosA][0];
      const squadraBIndex = posizioni[idxPosB][1];

      if (!squadre[squadraAIndex] || !squadre[squadraBIndex]) {
        spans[2].textContent = `Vincente ${squadraAIndex + 1} / ${squadraBIndex + 1}`;
        return;
      }

      const nomeA = `${squadraAIndex + 1}° ${squadre[squadraAIndex].nome}`;
      const nomeB = `${squadraBIndex + 1}° ${squadre[squadraBIndex].nome}`;

      const matchId = `Q${testaSerieIndex + 1}`;
      const vincitore = window.risultati?.find(r => r.partita === matchId)?.vincente;
      if (vincitore) {
        spans[2].textContent = vincitore;
        return;
      }

      spans[2].textContent = `Vincente ${nomeA} / ${nomeB}`;
    }
  });
}

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

    // ✅ Aggiorna playoff se i risultati sono già pronti
    if (typeof aggiornaPlayoff === "function" && window.risultati) {
      aggiornaPlayoff();
    }
  })
  .catch(err => console.error("❌ Errore nel caricamento classifica Totale:", err));
