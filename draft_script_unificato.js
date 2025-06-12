
function inviaPickAlFoglio(pick, fantaTeam, giocatore, ruolo, squadra, quotazione) {
  const dati = new URLSearchParams();
  dati.append("pick", pick);
  dati.append("squadra", fantaTeam);
  dati.append("giocatore", giocatore);
  dati.append("ruolo", ruolo);
  dati.append("squadraSerieA", squadra);
  dati.append("quotazione", quotazione);

  fetch("https://script.google.com/macros/s/AKfycbxFamdCRhlGfZ3j53yPUlGzE3dlrpxHvsJbXGht2D4fHJJ1HDybWoWg5Doin2d0BccF8Q/exec", {
    method: "POST",
    body: dati
  })
  .then(res => res.text())
  .then(txt => console.log("Risposta foglio:", txt))
  .catch(err => console.error("Errore invio pick:", err));
}
