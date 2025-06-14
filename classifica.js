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

function caricaClassifica(nomeFoglio) {
  const gid = GID_MAP[nomeFoglio];
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.trim().split("\n");
      const intestazione = righe[0].split(",");
      const corpoTabella = document.querySelector("#tabella-classifica tbody");
      const thead = document.querySelector("#tabella-classifica thead");
      corpoTabella.innerHTML = "";
      thead.innerHTML = "";

      // Intestazioni
      const headerRow = document.createElement("tr");
      intestazione.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col.replace(/"/g, "");
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Righe
      for (let i = 1; i < righe.length; i++) {
        let colonne = righe[i].split(",");
        while (colonne.length > intestazione.length) {
          colonne[intestazione.length - 1] += "." + colonne[intestazione.length];
          colonne.splice(intestazione.length, 1);
        }

        const tr = document.createElement("tr");
        colonne.forEach(val => {
          const td = document.createElement("td");
          td.textContent = formattaNumero(val.replace(/"/g, ""));
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
