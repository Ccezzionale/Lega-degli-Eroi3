const URL_PLAYOFF = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwFDMVkq09-yRzsLwFqehbAntqMpTPtyMwUsTJkRtUREmmP6vJcTROPchoYq1rc0h1ynqkcGJvEOsD/pub?output=csv";

fetch(URL_PLAYOFF)
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n");
    const startRow = 1;
    const risultati = [];

    for (let i = startRow; i < righe.length; i++) {
      const colonne = righe[i].split(",").map(c => c.replace(/"/g, "").trim());
      const turno = colonne[0];
      const partita = colonne[1]; // es: "WC1", "Q2", "S1", "F"
      const squadraA = colonne[2];
      const squadraB = colonne[3];
      const golA = colonne[4];
      const golB = colonne[5];
      const vincente = colonne[6];

      // Salva i dati in window.risultati
      risultati.push({ turno, partita, squadraA, squadraB, golA, golB, vincente });

      // Cerca match nel bracket
      const match = document.querySelector(`.match[data-turno="${turno}"][data-partita="${partita}"]`);
      if (!match) continue;

      const spans = match.querySelectorAll("span");

      if (golA && golB) {
        spans[0].textContent = squadraA;
        spans[1].textContent = `${golA} - ${golB}`;
        spans[2].textContent = squadraB;
      }

      if (vincente) {
        match.classList.add("conclusa");
        match.classList.add(vincente === squadraA ? "vittoria-a" : "vittoria-b");
      }
    }

    // Salva tutto per playoff.js
    window.risultati = risultati;

    // Se la classifica è già pronta, aggiorna ora i playoff
    if (typeof aggiornaPlayoff === "function" && window.squadre) {
      aggiornaPlayoff();
    }
  })
  .catch(err => {
    console.error("❌ Errore nel caricamento dei risultati playoff:", err);
  });
