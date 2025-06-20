const URL_PLAYOFF = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwFDMVkq09-yRzsLwFqehbAntqMpTPtyMwUsTJkRtUREmmP6vJcTROPchoYq1rc0h1ynqkcGJvEOsD/pub?output=csv";

fetch(URL_PLAYOFF)
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n").slice(1); // Salta intestazione
    const risultati = [];

    righe.forEach(riga => {
      const colonne = riga.split(",").map(c => c.replace(/"/g, "").trim());
      const [turno, partita, squadraA, squadraB, golA, golB, vincente] = colonne;

      risultati.push({ turno, partita, squadraA, squadraB, golA, golB, vincente });

      const match = document.querySelector(`.match[data-turno="${turno}"][data-partita="${partita}"]`);
      if (!match) return;

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
    });

    // ✅ Salva i risultati una volta sola
    window.risultati = risultati;
    console.log("📄 Risultati playoff:", risultati.map(r => `${r.partita}: ${r.squadraA} vs ${r.squadraB}`));

    // ✅ Chiama aggiornaPlayoff solo se le squadre sono già pronte
    if (typeof aggiornaPlayoff === "function" && window.squadre) {
      aggiornaPlayoff();
    }
  })
  .catch(err => {
    console.error("❌ Errore nel caricamento dei risultati playoff:", err);
  });
