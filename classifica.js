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

function rilevaSeparatore(riga) {
  if (riga.includes("\t")) return "\t";
  if (riga.includes(";")) return ";";
  return ",";
}

function caricaClassifica(nomeFoglio) {
  const gid = GID_MAP[nomeFoglio];
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
  console.log("📥 Fetching URL:", url);

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      console.log("📦 CSV ricevuto:");
      console.log(csv);

      const righe = csv.trim().split("\n");
      console.log("🔍 Righe trovate:", righe.length);

      const separatore = rilevaSeparatore(righe[0]);
      console.log("📐 Separatore rilevato:", separatore === "\t" ? "[TAB]" : separatore);

      const intestazione = righe[0].split(separatore).map(cell => cell.replace(/"/g, "").trim());
      console.log("🔠 Intestazione:", intestazione);

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
        let colonne = righe[i].split(separatore).map(cell => cell.replace(/"/g, "").trim());

        console.log(`📄 Riga ${i}:`, colonne);

        while (colonne.length > intestazione.length) {
          colonne[intestazione.length - 1] += "." + colonne[intestazione.length];
          colonne.splice(intestazione.length, 1);
        }

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
      console.error("❌ Errore nel caricamento della classifica:", err);
    });
}

window.onload = () => caricaClassifica("Conference");
