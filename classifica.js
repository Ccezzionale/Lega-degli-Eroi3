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

function parseCSV(csv) {
  const rows = [];
  const lines = csv.trim().split("\n");

  for (let line of lines) {
    const regex = /(?:"([^"]*(?:""[^"]*)*)"|([^",]+)|)(?:,|$)/g;
    const cells = [];
    let match;
    let attempts = 0;

    while ((match = regex.exec(line)) !== null && attempts < 1000) {
      const val = match[1] !== undefined
        ? match[1].replace(/""/g, '"').trim()
        : (match[2] !== undefined ? match[2].trim() : "");
      cells.push(val);
      attempts++;
    }

    if (attempts >= 1000) {
      console.warn("⛔ Troppi match in una riga, interrotto per sicurezza:", line);
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
      console.log("✅ CSV caricato, parsing in corso...");
      const righe = parseCSV(csv);
      console.log("📄 Righe parseate:", righe);

      const intestazione = righe[0];
      const corpoTabella = document.querySelector("#tabella-classifica tbody");
      const thead = document.querySelector("#tabella-classifica thead");
      corpoTabella.innerHTML = "";
      thead.innerHTML = "";

      const headerRow = document.createElement("tr");
      intestazione.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      for (let i = 1; i < Math.min(righe.length, 100); i++) {
        const colonne = righe[i];
        const tr = document.createElement("tr");
        colonne.forEach(val => {
          const td = document.createElement("td");
          td.textContent = formattaNumero(val);
          tr.appendChild(td);
        });
        corpoTabella.appendChild(tr);
      }

      console.log("✅ Classifica caricata correttamente.");
    })
    .catch(err => {
      console.error("❌ Errore nel caricamento della classifica:", err);
    });
}

window.onload = () => caricaClassifica("Conference");
