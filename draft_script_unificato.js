const tabella = document.querySelector("#tabella-pick tbody");
const listaGiocatori = document.getElementById("lista-giocatori");
const giocatoriScelti = new Set();
const filtroRuolo = document.getElementById("filtroRuolo");
const filtroSerieA = document.getElementById("filtroSerieA");
const searchInput = document.getElementById("searchGiocatore");

const mappaGiocatori = {};

function normalize(nome) {
  return nome.trim().toLowerCase();
}

function caricaGiocatori() {
  return fetch("giocatori_completo_finale.csv")
    .then(res => res.text())
    .then(csv => {
      const righe = csv.trim().split(/\r?\n/).slice(1);
      const ruoli = new Set();
      const squadre = new Set();

      righe.forEach(r => {
        const [nome, ruolo, squadra, quotazione] = r.split(",");
        const key = normalize(nome);
        mappaGiocatori[key] = { nome, ruolo, squadra, quotazione };

        if (!giocatoriScelti.has(key)) {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${nome}</td>
            <td>${ruolo}</td>
            <td>${squadra}</td>
            <td>${quotazione}</td>`;
          listaGiocatori.appendChild(tr);
        }

        if (ruolo) ruoli.add(ruolo);
        if (squadra) squadre.add(squadra);
      });

      ruoli.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r;
        opt.textContent = r;
        filtroRuolo.appendChild(opt);
      });

      squadre.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        filtroSerieA.appendChild(opt);
      });
    });
}

function caricaPick() {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTDKKMarxp0Kl7kiIWa-1X7jB-54KcQaLIGArN1FfR_X40rwAKVRgUYRGhrzIJ7SsKtUPnk_Cz8F0qt/pub?output=csv")
    .then(res => res.text())
    .then(csv => {
      const righe = csv.trim().split(/\r?\n/).slice(1);
      let prossima = null;

      righe.forEach(r => {
        const [pick, squadra, nomeGrezzo] = r.split(",");
        const nome = nomeGrezzo ? nomeGrezzo.trim() : "";
        const key = normalize(nome);
        const tr = document.createElement("tr");

        let ruolo = "", squadraSerieA = "", quot = "";
        if (key && mappaGiocatori[key]) {
          ruolo = mappaGiocatori[key].ruolo;
          squadraSerieA = mappaGiocatori[key].squadra;
          quot = mappaGiocatori[key].quotazione;
          giocatoriScelti.add(key);
        }

        tr.innerHTML = `
          <td>${pick}</td>
          <td>${squadra}</td>
          <td>${nome}</td>
          <td>${ruolo}</td>
          <td>${squadraSerieA}</td>
          <td>${quot}</td>`;

        if (!nome && !prossima) {
          prossima = { squadra, pick };
          tr.classList.add("next-pick");
        }

        tabella.appendChild(tr);
      });

      if (prossima)
        document.getElementById("turno-attuale").textContent =
          `🎯 È il turno di: ${prossima.squadra} (Pick ${prossima.pick})`;
      else
        document.getElementById("turno-attuale").textContent =
          "✅ Draft completato!";
    });
}

function filtraLista() {
  const ruolo = filtroRuolo.value.toLowerCase();
  const squadra = filtroSerieA.value.toLowerCase();
  const cerca = searchInput.value.toLowerCase();

  Array.from(listaGiocatori.children).forEach(row => {
    const nome = row.children[0].textContent.toLowerCase();
    const r = row.children[1].textContent.toLowerCase();
    const s = row.children[2].textContent.toLowerCase();

    const visibile =
      (!ruolo || r === ruolo) &&
      (!squadra || s === squadra) &&
      (!cerca || nome.includes(cerca));

    row.style.display = visibile ? "" : "none";
  });
}

[filtroRuolo, filtroSerieA, searchInput].forEach(el =>
  el.addEventListener("input", filtraLista)
);

window.addEventListener("DOMContentLoaded", function () {
  caricaPick().then(caricaGiocatori);
});