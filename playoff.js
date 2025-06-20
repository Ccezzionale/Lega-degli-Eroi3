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
        [7, 8],
        [4, 11],
        [5, 10],
        [6, 9]
      ];

      const [i1, i2] = mappingWC[idx];
      const matchId = `WC${idx + 1}`;
      const risultato = window.risultati?.find(r => r.partita === matchId);

      if (!risultato || (!risultato.golA && !risultato.golB)) {
        spans[0].textContent = `${i1 + 1}° ${squadre[i1].nome}`;
        spans[2].textContent = `${i2 + 1}° ${squadre[i2].nome}`;
      }

    } else if (idx < 8) {
      const ordineTesteDiSerie = [0, 3, 2, 1];
      const testaSerieIndex = idx - 4;
      const teamTop4Index = ordineTesteDiSerie[testaSerieIndex];
      const squadraTop = squadre[teamTop4Index];
      spans[0].textContent = `${teamTop4Index + 1}° ${squadraTop.nome}`;

      const mapping = [
        [4, 2],
        [7, 3],
        [6, 0],
        [5, 1]
      ];

      const [idxPosA, idxPosB] = mapping[testaSerieIndex];
      const squadraAIndex = posizioni[idxPosA][0];
      const squadraBIndex = posizioni[idxPosB][1];

      const nomeA = `${squadraAIndex + 1}° ${squadre[squadraAIndex]?.nome || "?"}`;
      const nomeB = `${squadraBIndex + 1}° ${squadre[squadraBIndex]?.nome || "?"}`;

      const matchId = `${(testaSerieIndex + 1).toString().padStart(2, "0")}`; // es. "01", "02", "03", "04"
      const risultato = window.risultati?.find(r => r.partita === matchId);

      console.log(`🧠 Quarto ${matchId} → ${nomeA} vs ${nomeB} | Vincente: ${risultato?.vincente || "?"}`);

      if (risultato?.vincente) {
        spans[2].textContent = risultato.vincente;
      } else {
        spans[2].textContent = `Vincente ${nomeA} / ${nomeB}`;
      }
    }
  });

  // ✅ Chiamata unica dopo il ciclo
  if (typeof aggiornaCardMobile === "function") {
    aggiornaCardMobile();
  }
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
    
  })
  .catch(err => console.error("❌ Errore nel caricamento classifica Totale:", err));

function aggiornaCardMobile() {
  if (!window.risultati) return;

  window.risultati.forEach(partita => {
    const { partita: codice, squadra1, squadra2 } = partita;

    const matchCard = document.querySelector(`.match-card[data-partita="${codice}"]`);
    if (matchCard) {
      const team1 = matchCard.querySelector(".team1");
      const team2 = matchCard.querySelector(".team2");
      if (team1 && team2) {
        team1.textContent = squadra1 || "";
        team2.textContent = squadra2 || "";
      }
    }
  });
}

