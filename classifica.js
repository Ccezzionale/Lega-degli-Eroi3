
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

function caricaClassifica(nomeFoglio = "Conference") {
  const url = URL_MAP[nomeFoglio];

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.trim().split("\n");
      let intestazione = righe[0].split(",").map(cell => cell.replace(/"/g, "").trim());
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

      const numSquadre = righe.length - 1;

      // Righe
      for (let i = 1; i < righe.length; i++) {
        let colonne = righe[i].split(",").map(cell => cell.replace(/"/g, "").trim());
        if (hasBlankColumn && colonne[2] === "") colonne.splice(2, 1);
        while (colonne.length > intestazione.length) {
          colonne[intestazione.length - 1] += "." + colonne[intestazione.length];
          colonne.splice(intestazione.length, 1);
        }

        const tr = document.createElement("tr");

        // Evidenziazione dinamica
        if (nomeFoglio === "Totale") {
          if (i <= 4) tr.classList.add("top4");
          if (i > numSquadre - 4) tr.classList.add("ultime4");
        } else {
          if (i === 1) tr.classList.add("top1");
        }

        colonne.forEach((val, idx) => {
          const td = document.createElement("td");

if (idx === 1) {
  const wrapper = document.createElement("div");
  wrapper.className = "logo-nome";

  const img = document.createElement("img");
  const nomeFile = val + ".png";
  img.src = `img/${nomeFile}`;
  img.alt = val;
  img.onerror = () => { img.style.display = "none"; };

  const testo = document.createElement("span");
  testo.textContent = val;

  wrapper.appendChild(img);
  wrapper.appendChild(testo);
  td.appendChild(wrapper);
} else {
  td.textContent = formattaNumero(val);
}

  const span = document.createElement("span");
  span.textContent = val;

  wrapper.appendChild(img);
  wrapper.appendChild(span);
  td.appendChild(wrapper);
}

        corpoTabella.appendChild(tr);
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
