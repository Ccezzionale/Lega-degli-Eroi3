const tabella = document.querySelector("#tabella-pick tbody");
const listaGiocatori = document.getElementById("lista-giocatori");
const giocatoriScelti = new Set();
const filtroRuolo = document.getElementById("filtroRuolo");
const filtroSerieA = document.getElementById("filtroSerieA");
const searchInput = document.getElementById("searchGiocatore");

const mappaGiocatori = {};
let ruoli = new Set();
let squadre = new Set();

function normalize(nome) {
  return nome.trim().toLowerCase();
}

function inviaPickAlFoglio(pick, squadra, giocatore, ruolo, squadraSerieA, quotazione) {
  const dati = new URLSearchParams();
  dati.append("pick", pick);
  dati.append("squadra", squadra);
  dati.append("giocatore", giocatore);
  dati.append("ruolo", ruolo);
  dati.append("squadraSerieA", squadraSerieA);
  dati.append("quotazione", quotazione);

  fetch("https://script.google.com/macros/s/AKfycby0W3NDRg4zc9RZqulatahxrlCjOzirVYmPLxZPliqPXiJxUOUBZww0pm1Y-KyzG3Y/exec", {
    method: "POST",
    body: dati
  })
  .then(res => res.text())
  .then(txt => console.log("Risposta foglio:", txt))
  .catch(err => console.error("Errore invio pick:", err));
}

function caricaGiocatori() {
  return fetch("giocatori_completo_finale.csv")
    .then(res => res.text())
    .then(csv => {
      const righe = csv.trim().split(/\r?\n/).slice(1);
      righe.forEach(r => {
        const [nome, ruolo, squadra, quotazione] = r.split(",");
        const key = normalize(nome);
        mappaGiocatori[key] = { nome, ruolo, squadra, quotazione };

        if (ruolo) ruoli.add(ruolo);
        if (squadra) squadre.add(squadra);
      });
    });
}

function caricaPick() {
  return fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTDKKMarxp0Kl7kiIWa-1X7jB-54KcQaLIGArN1FfR_X40rwAKVRgUYRGhrzIJ7SsKtUPnk_Cz8F0qt/pub?output=csv")
    .then(res => res.text())
    .then(csv => {
      const righe = csv.trim().split(/\r?\n/).slice(1);
      let prossima = null;

      righe.forEach(r => {
        const [pick, squadra, nomeGrezzo, ruolo, squadraSerieA, quotazione] = r.split(",");
        const nome = nomeGrezzo ? nomeGrezzo.trim() : "";
        const key = normalize(nome);
        const tr = document.createElement("tr");

        giocatoriScelti.add(key);

        tr.innerHTML = `
          <td>${pick}</td>
          <td>${squadra}</td>
          <td>${nome}</td>
          <td>${ruolo}</td>
          <td>${squadraSerieA}</td>
          <td>${quotazione}</td>`;

        if (!nome && !prossima) {
          prossima = { squadra, pick };
          tr.classList.add("next-pick");
        } else {
          tr.style.backgroundColor = "#d4edda";
          tr.style.fontWeight = "bold";
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

function popolaListaDisponibili() {
  listaGiocatori.innerHTML = "";
  Object.values(mappaGiocatori).forEach(({ nome, ruolo, squadra, quotazione }) => {
    const key = normalize(nome);
    if (giocatoriScelti.has(key)) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nome}</td>
      <td>${ruolo}</td>
      <td>${squadra}</td>
      <td>${quotazione}</td>`;

    tr.addEventListener("click", () => {
      const conferma = confirm(`Vuoi selezionare ${nome} per la squadra al turno?`);
      if (conferma) {
        const righe = document.querySelectorAll("#tabella-pick tbody tr");
        for (let r of righe) {
          const celle = r.querySelectorAll("td");
          if (!celle[2].textContent.trim()) {
            const pick = celle[0].textContent;
            const squadra = celle[1].textContent;

            celle[2].textContent = nome;
            celle[3].textContent = ruolo;
            celle[4].textContent = squadra;
            celle[5].textContent = quotazione;

            r.style.backgroundColor = "#d4edda";
            r.style.fontWeight = "bold";
            r.classList.remove("next-pick");

            document.getElementById("turno-attuale").textContent = `✅ ${nome} selezionato!`;

            inviaPickAlFoglio(pick, squadra, nome, ruolo, squadra, quotazione);
            break;
          }
        }

        tr.remove();
      }
    });

    listaGiocatori.appendChild(tr);
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
  caricaGiocatori().then(() =>
    caricaPick().then(() => {
      popolaListaDisponibili();
    })
  );
});