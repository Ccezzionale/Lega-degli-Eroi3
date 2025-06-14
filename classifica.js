// classifica.js aggiornato - mantiene il desktop invariato e aggiunge fisarmonica mobile

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
      const mobileDiv = document.getElementById("mobile-classifica");

      corpoTabella.innerHTML = "";
      thead.innerHTML = "";
      mobileDiv.innerHTML = "";

      // Intestazione tabella desktop
      const headerRow = document.createElement("tr");
      intestazione.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Righe dati
      for (let i = 1; i < righe.length; i++) {
        const colonne = pulisciRigaCSV(righe[i]);

        // Versione desktop
        const tr = document.createElement("tr");
        colonne.forEach(val => {
          const td = document.createElement("td");
          td.textContent = formattaNumero(val);
          tr.appendChild(td);
        });
        corpoTabella.appendChild(tr);

        // Versione mobile (fisarmonica)
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        const nomeSquadra = colonne[1];
        const posizione = colonne[0];
        const punti = colonne[8];
        const tot = colonne[9];

        summary.innerHTML = `
          <div class="team-info">
            <img src="img/${nomeSquadra.toLowerCase().replaceAll(" ", "_")}.png" alt="${nomeSquadra}" />
            ${nomeSquadra}
          </div>
          <span>#${posizione} - ${punti} pt. / ${tot}</span>
        `;

        const ul = document.createElement("ul");
        ul.innerHTML = `
          <li>Vinte: ${colonne[2]}</li>
          <li>Perse: ${colonne[3]}</li>
          <li>Pari: ${colonne[4]}</li>
        `;

        details.appendChild(summary);
        details.appendChild(ul);
        mobileDiv.appendChild(details);
      }
    })
    .catch(err => {
      console.error("Errore nel caricamento della classifica:", err);
    });
}

window.onload = () => caricaClassifica("Conference");
