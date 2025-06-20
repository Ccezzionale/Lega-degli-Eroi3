// ✅ Collegamento alla classifica Totale
const URL_CLASSIFICA_TOTALE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=691152130&single=true&output=csv";

// ✅ Funzione principale per aggiornare il bracket
function aggiornaPlayoff() {
  console.log("🔄 aggiornaPlayoff chiamata");
  if (!window.squadre || window.squadre.length < 12) {
    console.warn("⛔ Classifica non disponibile per aggiornare il bracket");
    return;
  }

  const posizioni = [
    [5, 10], [6, 9], [7, 8], [4, 11], // Wild Card (idx 0-3)
    [7, 8], [6, 9], [5, 10], [4, 11]  // Quarti (idx 4-7)
  ];

  const matchDivs = document.querySelectorAll(".match-card");
  console.log("🎯 Match trovati:", matchDivs.length);

  matchDivs.forEach((match, idx) => {
    if (!posizioni[idx] || posizioni[idx].length < 2) return;
    const spans = match.querySelectorAll("span");
    
     console.log("✅ Squadre:", window.squadre);
  console.log("📊 Classifica Totale:", window.classificaTotale);
  console.log("📄 Risultati Playoff:", window.risultati);

    if (idx < 4) {
      const mappingWC = [
        [7, 8], [4, 11], [5, 10], [6, 9]
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
        [4, 2], [7, 3], [6, 0], [5, 1]
      ];

      const [idxPosA, idxPosB] = mapping[testaSerieIndex];
      const squadraAIndex = posizioni[idxPosA][0];
      const squadraBIndex = posizioni[idxPosB][1];

      const nomeA = `${squadraAIndex + 1}° ${squadre[squadraAIndex]?.nome || "?"}`;
      const nomeB = `${squadraBIndex + 1}° ${squadre[squadraBIndex]?.nome || "?"}`;

      const matchId = `Q${testaSerieIndex + 1}`;
      const risultato = window.risultati?.find(r => r.partita === matchId);

      if (risultato?.squadraA && risultato?.squadraB) {
  spans[0].textContent = risultato.squadraA;
  spans[2].textContent = risultato.squadraB;
} else {
  spans[2].textContent = `Vincente ${nomeA} / ${nomeB}`;
}
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch(URL_CLASSIFICA_TOTALE)
    .then(res => res.text())
    .then(csv => {
      console.log("📥 CSV ricevuto:", csv);
      const righe = csv.trim().split("\n").slice(1);
      const classifica = righe.map(r => {
        const c = r.split(",");
        const nome = c[1];
        const punti = parseInt(c[10]) || 0;
        const mp = parseFloat(c[11]?.replace(",", ".") || "0");
        return { nome, punti, mp };
      });

      window.classificaTotale = classifica
        .sort((a, b) => b.punti - a.punti || b.mp - a.mp);
      window.squadre = window.classificaTotale;

      console.log("✅ Squadre ordinate:", window.squadre.map((s, i) => `${i+1}° ${s.nome} (${s.punti}pt / ${s.mp}mp)`));

      aggiornaPlayoff(); // 🔥 ORA funzionerà
    })
    .catch(err => {
      console.error("❌ Errore nel caricamento classifica Totale:", err);
    });
});
