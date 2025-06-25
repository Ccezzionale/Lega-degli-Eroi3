console.log("✅ Script caricato");

const URL_MAP = {
  "Conference": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=0&single=true&output=csv",
  "Championship": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=547378102&single=true&output=csv",
  "Totale": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=691152130&single=true&output=csv"
};

function formattaNumero(val) {
  if (!isNaN(val) && val.toString().includes(".")) {
    return parseFloat(val).toFixed(1).replace(".", ",");
  }
  return val;
}

function caricaClassifica(nomeFoglio = "Conference") {
  const url = URL_MAP[nomeFoglio];
  if (!url) return;

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.trim().split("\n");

      let startRow = nomeFoglio === "Totale" ? 1 : 4;
      let intestazione = righe[startRow - 1].split(",").map(cell => cell.replace(/"/g, "").trim());

      if (nomeFoglio !== "Totale") intestazione.splice(2, 1);

      const tbody = document.querySelector("#tabella-classifica tbody");
      const thead = document.querySelector("#tabella-classifica thead");
      const mobile = document.getElementById("classifica-mobile");
      tbody.innerHTML = "";
      thead.innerHTML = "";
      mobile.innerHTML = "";

      const headerRow = document.createElement("tr");
      intestazione.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      for (let i = startRow; i < righe.length; i++) {
        const colonne = righe[i].split(",").map(c => c.replace(/"/g, "").trim());
        if (nomeFoglio !== "Totale") colonne.splice(2, 1);

        const tr = document.createElement("tr");
        tr.classList.add("riga-classifica");

        if (nomeFoglio === "Totale" && i <= 4) tr.classList.add("top4");
        if (nomeFoglio === "Totale" && i >= righe.length - 4) tr.classList.add("ultime4");
        if ((nomeFoglio === "Conference" || nomeFoglio === "Championship") && i === startRow) tr.classList.add("top1");

        colonne.forEach((val, idx) => {
          const td = document.createElement("td");

          if (idx === 1) {
            const div = document.createElement("div");
            div.className = "logo-nome";
            const img = document.createElement("img");
            const name = val.replace(/[👑🎖️💀]/g, "").trim();
            img.src = `img/${name}.png`;
            img.onerror = () => (img.style.display = "none");
            const span = document.createElement("span");
            span.textContent = val;
            div.appendChild(img);
            div.appendChild(span);
            td.appendChild(div);
          } else {
            td.textContent = formattaNumero(val);
            if (idx === intestazione.length - 1) {
              td.style.textAlign = "right";
              td.style.whiteSpace = "nowrap";
            }
          }

          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }
    })
    .catch(e => console.error("Errore caricamento classifica:", e));
}

window.onload = () => caricaClassifica("Conference");
document.querySelectorAll(".switcher button").forEach(btn =>
  btn.addEventListener("click", () => caricaClassifica(btn.textContent))
);

