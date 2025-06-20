const URL_PLAYOFF = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwFDMVkq09-yRzsLwFqehbAntqMpTPtyMwUsTJkRtUREmmP6vJcTROPchoYq1rc0h1ynqkcGJvEOsD/pub?output=csv";

// Struttura: [{ partita: "WC1", squadraA: "...", squadraB: "...", golA: x, golB: y, vincente: "..." }, ...]
fetch(URL_PLAYOFF)
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n").slice(1); // Ignora intestazioni
    const risultati = righe.map(riga => {
      const colonne = riga.split(",").map(c => c.trim().replace(/"/g, ""));
      const [partita, squadraA, squadraB, golA, golB, vincente] = colonne;
      return {
        partita,
        squadraA,
        squadraB,
        golA: golA ? parseInt(golA) : null,
        golB: golB ? parseInt(golB) : null,
        vincente
      };
    });

    console.log("✅ Risultati Playoff:", risultati);
    window.risultati = risultati;

    // Se la funzione aggiornaPlayoff è già definita, eseguila ora
    if (typeof aggiornaPlayoff === "function") {
      aggiornaPlayoff();
    }
  })
  .catch(err => {
    console.error("❌ Errore nel caricamento dei risultati playoff:", err);
  });
