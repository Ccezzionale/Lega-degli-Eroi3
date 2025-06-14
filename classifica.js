const SHEET_ID = "1aHVZ8nXLns5bPQN3V7WJr8MKpwd5KvZmPYFhkE2pZqc";
const GID_MAP = {
  "Conference": "0",
  "Championship": "823705445",
  "Totale": "532992734"
};

function caricaClassifica(nomeFoglio) {
  const gid = GID_MAP[nomeFoglio];
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.trim().split('\n');
      const corpoTabella = document.querySelector("#tabella-classifica tbody");
      corpoTabella.innerHTML = "";
      righe.forEach((riga, i) => {
        const colonne = riga.split(',');
        if (colonne.length >= 3 && i > 0) {
          const tr = document.createElement("tr");
          colonne.slice(0, 3).forEach(testo => {
            const td = document.createElement("td");
            td.textContent = testo;
            tr.appendChild(td);
          });
          corpoTabella.appendChild(tr);
        }
      });
    })
    .catch(err => {
      console.error("Errore nel caricamento della classifica:", err);
    });
}

// Carica la Conference di default
window.onload = () => caricaClassifica("Conference");
