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

      // Righe
      for (let i = 1; i < righe.length; i++) {
        let colonne = righe[i].split(",").map(cell => cell.replace(/"/g, "").trim());
        if (hasBlankColumn && colonne[2] === "") colonne.splice(2, 1);
        while (colonne.length > intestazione.length) {
          colonne[intestazione.length - 1] += "." + colonne[intestazione.length];
          colonne.splice(intestazione.length, 1);
        }

        // --- Versione Desktop ---
        const tr = document.createElement("tr");
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

            const cleanName = val.replace(/[👑🎖️💀]/g, "").trim();
            const testo = document.createElement("span");
            testo.textContent = cleanName;
            wrapper.appendChild(img);
            wrapper.appendChild(testo);
            td.appendChild(wrapper);
          } else {
            td.textContent = formattaNumero(val);
          }

          tr.appendChild(td);
        });
        corpoTabella.appendChild(tr);

        // --- Versione Mobile Accordion ---
        const item = document.createElement("div");
        item.className = "accordion-item";

        const header = document.createElement("div");
        header.className = "accordion-header";
        const nomeSquadra = colonne[1];
        const logo = document.createElement("img");
        logo.src = "img/" + nomeSquadra + ".png";
        logo.alt = nomeSquadra;
        logo.onerror = () => { logo.style.display = "none"; };
        header.appendChild(logo);
        header.appendChild(document.createTextNode(`${colonne[0]}. ${nomeSquadra}`));

        const body = document.createElement("div");
        body.className = "accordion-body";

        for (let j = 2; j < colonne.length; j++) {
          const label = intestazione[j];
          const value = formattaNumero(colonne[j]);
          const p = document.createElement("p");
          p.textContent = `${label}: ${value}`;
          body.appendChild(p);
        }

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
