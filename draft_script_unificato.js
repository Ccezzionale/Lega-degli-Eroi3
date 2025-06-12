// SCRIPT UNIFICATO JS

// Variabili
const tabella = document.querySelector("#tabella-pick tbody");
const listaGiocatori = document.getElementById("lista-giocatori");
const giocatoriScelti = new Set();

// Normalizza nomi
function normalize(nome) {
  return nome.trim().toLowerCase();
}

// Carica Pick
function caricaPick() {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTDKKMarxp0Kl7kiIWa-1X7jB-54KcQaLIGArN1FfR_X40rwAKVRgUYRGhrzIJ7SsKtUPnk_Cz8F0qt/pub?output=csv")
    .then(res => res.text())
    .then(csv => {
      const righe = csv.trim().split(/\r?\n/).slice(1);
      let prossima = null;
      righe.forEach(r => {
        const [pick, squadra, nome, ruolo, squadraSerieA, quotazione] = r.split(",");
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${pick}</td>
          <td>${squadra}</td>
          <td>${nome || ""}</td>
          <td>${ruolo || ""}</td>
          <td>${squadraSerieA || ""}</td>
          <td>${quotazione || ""}</td>`;
        if (!nome && !prossima) {
          prossima = { squadra, pick };
          tr.classList.add("next-pick");
        }
        tabella.appendChild(tr);
        if (nome) giocatoriScelti.add(normalize(nome));
      });
      if (prossima)
        document.getElementById("turno-attuale").textContent =
          `🎯 È il turno di: ${prossima.squadra} (Pick ${prossima.pick})`;
      else
        document.getElementById("turno-attuale").textContent =
          "✅ Draft completato!";
    });
}

// Carica Giocatori
function caricaGiocatori() {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSEqUua24q99bk7cVGpHkQhmNHc0EOQ0-x4v5Fut5Sqcb6G2iiJusueUPqZez2-iQ/pub?output=csv")
    .then(res => res.text())
    .then(csv => {
      const righe = csv.trim().split(/\r?\n/).slice(1);
      righe.forEach(r => {
        const [nome, ruolo, squadra, quotazione] = r.split(",");
        if (giocatoriScelti.has(normalize(nome))) return;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${nome}</td>
          <td>${ruolo}</td>
          <td>${squadra}</td>
          <td>${quotazione}</td>`;
        listaGiocatori.appendChild(tr);
      });
    });
}

// Avvio
window.addEventListener("DOMContentLoaded", function () {
  caricaPick();
  caricaGiocatori();
});