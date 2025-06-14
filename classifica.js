// classifica.js

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

function pulisciRigaCSV(riga) {
  return riga.split(",").map(cell => cell.replace(/^"+|"+$/g, "").trim());
}

function caricaClassifica(nomeFoglio) {
  const gid = GID_MAP[nomeFoglio];
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.trim().split("\n");
      const intestazione = pulisciRigaCSV(righe[0]);
      const corpoTabella = document.querySelector("#tabella-classifica tbody");
      const thead = document.querySelector("#tabella-classifica thead");
      const mobileContainer = document.querySelector("#mobile-classifica");

      corpoTabella.innerHTML = "";
      thead.innerHTML = "";
      mobileContainer.innerHTML = "";

      // Intestazioni tabella
      const headerRow = document.createElement("tr");
      intestazione.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Righe
      for (let i = 1; i < righe.length; i++) {
        const colonne = pulisciRigaCSV(righe[i]);
        const tr = document.createElement("tr");
        colonne.forEach(val => {
          const td = document.createElement("td");
          td.textContent = formattaNumero(val);
          tr.appendChild(td);
        });
        corpoTabella.appendChild(tr);

        // Mobile
        const [pos, squadra, , , , , , , , pt, ptTot] = colonne;
        const logoSrc = `img/${squadra}.png`;

        const details = document.createElement("details");

        const summary = document.createElement("summary");
        summary.innerHTML = `
          <div class="team-info">
            <img src="${logoSrc}" alt="${squadra}" />
            ${squadra}
          </div>
          <span>#${pos} - ${pt} pt. / ${ptTot}</span>
        `;

        const ul = document.createElement("ul");
        ul.innerHTML = `
          <li>Giocate: ${colonne[2]}</li>
          <li>Vinte: ${colonne[3]}</li>
          <li>Pari: ${colonne[4]}</li>
          <li>Perse: ${colonne[5]}</li>
          <li>GF: ${colonne[6]}</li>
          <li>GS: ${colonne[7]}</li>
          <li>DR: ${colonne[8]}</li>
        `;

        details.appendChild(summary);
        details.appendChild(ul);
        mobileContainer.appendChild(details);
      }
    })
    .catch(err => {
      console.error("Errore nel caricamento della classifica:", err);
    });
}

window.onload = () => caricaClassifica("Conference");

});
