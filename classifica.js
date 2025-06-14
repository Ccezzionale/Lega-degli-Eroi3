const SHEET_ID = "1aHVZ8nXLns5bPQN3V7WJr8MKpwd5KvZmPYFhkE2pZqc";
const GID_MAP = {
  "Conference": "0",
  "Championship": "1102946509",
  "Totale": "2134024333"
};

function formattaNumero(val) {
  if (!isNaN(val) && val.toString().includes(".")) {
    return parseFloat(val).toString().replace(".", ",");
  }
  return val;
}

// Funzione robusta di parsing CSV
function parseCSV(csv) {
  const rows = [];
  const lines = csv.trim().split("\n");

  for (let line of lines) {
    const regex = /(?:"([^"]*(?:""[^"]*)*)"|([^",]+)|)(?:,|$)/g;
    const cells = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      const val = match[1] !== undefined
        ? match[1].replace(/""/g, '"').trim()
        : (match[2] !== undefined ? match[2].trim() : "");
      if (val !== "") cells.push(val);
    }
    if (cells.length > 0) rows.push(cells);
  }

  return rows;
}

function caricaClassifica(nomeFoglio) {
  const gid = GID_MAP[nomeFoglio];
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = parseCSV(csv);
      const intestazione = righe[0];
      const corpoTabella = document.querySelector("#tabella-classifica tbody");
      const thead = document.querySelector("#tabella-classifica thead");
      corpoTabella.innerHTML = "";
      thead.innerHTML = "";

      // Intestazioni
      const headerRow = document.createElement("tr");
      intestazione.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Righe dati
      for (let i = 1; i < righe.length; i++) {
        const colonne = righe[i];
        const tr = document.createElement("tr");
        colonne.forEach(val => {
          const td = document.createElement("td");
          td.textContent = formattaNumero(val);
          tr.appendChild(td);
        });
        corpoTabella.appendChild(tr);
      }
    })
    .catch(err => {
      console.error("Errore nel caricamento della classifica:", err);
    });
}

window.onload = () => caricaClassifica("Conference");
