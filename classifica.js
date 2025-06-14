const URL_MAP = {
  "Conference": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmFvlkbYkEqaD6i9XsoNde2ls0fVSqXahKNuNQegtERRuG5N702OAu9mihLbolzCdiY_nVJTEvPJyM/pub?output=csv&gid=0",
  "Championship": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmFvlkbYkEqaD6i9XsoNde2ls0fVSqXahKNuNQegtERRuG5N702OAu9mihLbolzCdiY_nVJTEvPJyM/pub?output=csv&gid=1102946509",
  "Totale": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmFvlkbYkEqaD6i9XsoNde2ls0fVSqXahKNuNQegtERRuG5N702OAu9mihLbolzCdiY_nVJTEvPJyM/pub?output=csv&gid=2134024333"
};


function formattaNumero(val) {
  if (!isNaN(val) && val.toString().includes(".")) {
    return parseFloat(val).toString().replace(".", ",");
  }
  return val;
}

function caricaClassifica() {
  fetch(CSV_URL)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.trim().split("\n");
      let intestazione = righe[0].split(",").map(cell => cell.replace(/"/g, "").trim());

      // Se c'è una colonna vuota subito dopo Squadra, rimuovila
      const hasBlankColumn = intestazione[2] === "";
      if (hasBlankColumn) intestazione.splice(2, 1);

      const corpoTabella = document.querySelector("#tabella-classifica tbody");
      const thead = document.querySelector("#tabella-classifica thead");
      corpoTabella.innerHTML = "";
      thead.innerHTML = "";

      // Intestazione
      const headerRow = document.createElement("tr");
      intestazione.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Righe dati
      for (let i = 1; i < righe.length; i++) {
        let colonne = righe[i].split(",").map(cell => cell.replace(/"/g, "").trim());

        if (hasBlankColumn && colonne[2] === "") {
          colonne.splice(2, 1);
        }

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

window.onload = () => caricaClassifica();
