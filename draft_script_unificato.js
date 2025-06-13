
function caricaPick() {
  return fetch("const API_URL = "https://script.google.com/macros/s/AKfycbxyz123abc/exec";")
    .then(res => res.json())
    .then(righe => {
      let prossima = null;
      righe.sort((a, b) => parseInt(a.Pick) - parseInt(b.Pick));
      righe.forEach(r => {
        const pick = r.Pick;
        const fantaTeam = r.Squadra;
        const nomeGrezzo = r.Giocatore;
        const ruolo = r.Ruolo;
        const squadra = r["Squadra Serie A"];
        const nome = nomeGrezzo ? nomeGrezzo.trim() : "";
        const key = normalize(nome);
        const tr = document.createElement("tr");
        giocatoriScelti.add(key);
        tr.innerHTML = `
          <td>${pick}</td>
          <td>${fantaTeam}</td>
          <td>${nome}</td>
          <td>${ruolo}</td>`;
        if (!nome && !prossima) {
          prossima = { fantaTeam, pick };
          tr.classList.add("next-pick");
        } else {
          tr.style.backgroundColor = "#d4edda";
          tr.style.fontWeight = "bold";
        }
        tabella.appendChild(tr);
      });
      document.getElementById("turno-attuale").textContent =
        prossima
          ? `🎯 È il turno di: ${prossima.fantaTeam} (Pick ${prossima.pick})`
          : "✅ Draft completato!";
    });
}
