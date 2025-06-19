console.log("✅ Script caricato");

const URL_MAP = {
  "Conference": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=0&single=true&output=csv",
  "Championship": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=547378102&single=true&output=csv",
  "Totale": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=2021963336&single=true&output=csv"
};

function formattaNumero(val) {
  if (!isNaN(val) && val.toString().includes(".")) {
    return parseFloat(val).toString().replace(".", ",");
  }
  return val;
}

function caricaClassifica(nomeFoglio = "Conference") {
  const url = URL_MAP[nomeFoglio];
  if (!url) {
  console.error("❌ Nome foglio non valido o URL mancante:", nomeFoglio);
  return;
}

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.trim().split("\n");

      let startRow = 1;
      if (nomeFoglio === "Conference") startRow = 4;
      if (nomeFoglio === "Championship") startRow = 4;
      if (nomeFoglio === "Round Robin") startRow = 24;

      let intestazione = righe[startRow - 1].split(",").map(cell => cell.replace(/"/g, "").trim());
      const hasBlankColumn = intestazione[2] === "";
      if (hasBlankColumn) intestazione.splice(2, 1);

      const corpoTabella = document.querySelector("#tabella-classifica tbody");
      const thead = document.querySelector("#tabella-classifica thead");
      const accordionMobile = document.querySelector("#classifica-mobile");
      corpoTabella.innerHTML = "";
      thead.innerHTML = "";
      accordionMobile.innerHTML = "";

      // Intestazione
      const headerRow = document.createElement("tr");
      intestazione.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      const numSquadre = righe.length - 1;

      for (let i = startRow; i < righe.length; i++) {
        let colonne = righe[i].split(",").map(cell => cell.replace(/"/g, "").trim());
        if (hasBlankColumn && colonne[2] === "") colonne.splice(2, 1);
        while (colonne.length > intestazione.length) {
          colonne[intestazione.length - 1] += "." + colonne[intestazione.length];
          colonne.splice(intestazione.length, 1);
        }

        // --- DESKTOP ---
        const tr = document.createElement("tr");

        if (nomeFoglio === "Totale" && i <= 4) {
          tr.classList.add("top4");
        }

        if (nomeFoglio === "Totale" && i > numSquadre - 4) {
          tr.classList.add("ultime4");
        }

        colonne.forEach((val, idx) => {
          const td = document.createElement("td");

          if (idx === 1) {
           const wrapper = document.createElement("div");
wrapper.className = "logo-nome";

const img = document.createElement("img");

// Pulisce il nome rimuovendo emoji ma lasciando spazi e maiuscole per il file immagine
const nomeLogo = val.replace(/[👑🎖️💀]/g, "").trim();
img.src = `img/${nomeLogo}.png`;
img.alt = nomeLogo;
img.onerror = () => { img.style.display = "none"; };

// Aggiunge le emoji giuste al testo visualizzato
let displayName = nomeLogo;
if (val.includes("💀")) displayName = "💀 " + displayName;
if (val.includes("👑")) displayName = "👑 " + displayName;
if (nomeFoglio === "Totale" && i <= 4) displayName = "🎖️ " + displayName;
if (nomeFoglio !== "Totale" && i === 1) displayName = "🎖️ " + displayName;

const testo = document.createElement("span");
testo.textContent = displayName;

wrapper.appendChild(img);
wrapper.appendChild(testo);
td.appendChild(wrapper);

          } else {
            td.textContent = formattaNumero(val);
          }

          tr.appendChild(td);
        });

        corpoTabella.appendChild(tr);

        // --- MOBILE ---
        const item = document.createElement("div");
        item.className = "accordion-item";

        if (nomeFoglio === "Totale" && i <= 4) {
          item.classList.add("top4");
        }

        if (nomeFoglio === "Totale" && i > numSquadre - 4) {
          item.classList.add("ultime4");
        }

        const header = document.createElement("div");
        header.className = "accordion-header";

const nomeSquadra = colonne[1];
const logo = document.createElement("img"); // ✅ CREATO SEMPRE

if (!nomeSquadra || nomeSquadra === "undefined") {
  logo.style.display = "none";
} else {
  logo.src = "img/" + nomeSquadra + ".png";
  logo.alt = nomeSquadra;
  logo.onerror = () => {
    logo.style.display = "none";
  };
}

header.appendChild(logo); // ✅ sempre aggiunto

const pos = colonne[0]; // 👈 spostalo qui prima dell’uso

if (!nomeSquadra || nomeSquadra === "undefined") {
  logo.style.display = "none";
} else {
  logo.src = "img/" + nomeSquadra + ".png";
  logo.alt = nomeSquadra;
  logo.onerror = () => {
    logo.style.display = "none";
  };
}

header.appendChild(logo); // sempre
if (pos === "1") {
  item.classList.add("top1");
}

        const punti = formattaNumero(colonne[9]);
        const puntiTot = formattaNumero(colonne[10]);

        const testo = document.createElement("span");
        testo.innerHTML = `<strong>${pos}. ${nomeSquadra}</strong><br><span style="font-weight:normal">PT. ${punti} / MP. ${puntiTot}</span>`;

        header.appendChild(logo);
        header.appendChild(testo);

        const body = document.createElement("div");
        body.className = "accordion-body";

        for (let j = 2; j < colonne.length - 2; j++) {
          const label = intestazione[j];
          const value = formattaNumero(colonne[j]);
          const p = document.createElement("p");
          p.innerHTML = `<strong>${label}:</strong> ${value}`;
          body.appendChild(p);
        }

        const ptRow = document.createElement("p");
        ptRow.innerHTML = `<strong>Pt.:</strong> ${punti}`;
        const totRow = document.createElement("p");
        totRow.innerHTML = `<strong>Pt. Totali:</strong> ${puntiTot}`;
        body.appendChild(ptRow);
        body.appendChild(totRow);

        header.addEventListener("click", () => {
          item.classList.toggle("active");
        });

        item.appendChild(header);
        item.appendChild(body);
        accordionMobile.appendChild(item);
      }
    })
    .catch(err => {
      console.error("❌ Errore nel caricamento della classifica:", err);
    });
}

window.onload = () => caricaClassifica("Conference");

document.querySelectorAll(".switcher button").forEach(btn => {
  btn.addEventListener("click", () => {
    caricaClassifica(btn.textContent);
  });
});
