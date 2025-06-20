const URL_PLAYOFF = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwFDMVkq09-yRzsLwFqehbAntqMpTPtyMwUsTJkRtUREmmP6vJcTROPchoYq1rc0h1ynqkcGJvEOsD/pub?output=csv";

fetch(URL_PLAYOFF)
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n");
    const startRow = 1;
    window.risultati = [];

    for (let i = startRow; i < righe.length; i++) {
      const colonne = righe[i].split(",").map(c => c.replace(/"/g, "").trim());
      const partita = colonne[1];
      const vincente = colonne[6];
      if (partita && vincente) {
        window.risultati.push({ partita, vincente });
      }
    }

    console.log("✅ Risultati playoff caricati:", window.risultati);

    // chiama funzione principale
    if (typeof aggiornaPlayoff === "function") {
      aggiornaPlayoff();
    } else {
      console.error("❌ La funzione aggiornaPlayoff() non è definita!");
    }
  })
  .catch(err => {
    console.error("❌ Errore nel caricamento dei risultati playoff:", err);
  });
