
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
      const mobileContainer = document.getElementById("mobile-classifica");

      corpoTabella.innerHTML = "";
      thead.innerHTML = "";
      mobileContainer.innerHTML = "";

      // Intestazione tabella desktop
      const headerRow = document.createElement("tr");
      intestazione.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      for (let i = 1; i < righe.length; i++) {
        const colonne = pulisciRigaCSV(righe[i]);
        const tr = document.createElement("tr");
        colonne.forEach(val => {
          const td = document.createElement("td");
          td.textContent = formattaNumero(val);
          tr.appendChild(td);
        });
        corpoTabella.appendChild(tr);

        // MOBILE - costruisci <details>
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        const teamInfo = document.createElement("div");
        teamInfo.className = "team-info";

        const img = document.createElement("img");
        const nomeSquadra = colonne[1].trim();
        const posizione = colonne[0].trim();
        const pt = colonne[8] || "";
        const tot = colonne[9] || "";

        img.src = `img/${nomeSquadra.toLowerCase().replace(/\s+/g, "_")}.png`;
        img.alt = nomeSquadra;
        teamInfo.appendChild(img);
        teamInfo.appendChild(document.createTextNode(nomeSquadra));

        const span = document.createElement("span");
        span.textContent = `#${posizione} - ${pt} pt. / ${tot}`;

        summary.appendChild(teamInfo);
        summary.appendChild(span);

        const ul = document.createElement("ul");
        const vinte = colonne[2] || "0";
        const perse = colonne[3] || "0";
        const pari = colonne[4] || "0";

        ul.innerHTML = `<li>Vinte: ${vinte}</li><li>Perse: ${perse}</li><li>Pari: ${pari}</li>`;

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
