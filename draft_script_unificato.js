
const tabella = document.querySelector("#tabella-pick tbody");
const listaGiocatori = document.getElementById("lista-giocatori");
const giocatoriScelti = new Set();
const filtroRuolo = document.getElementById("filtroRuolo");
const filtroSerieA = document.getElementById("filtroSerieA");
const searchInput = document.getElementById("searchGiocatore");
const cercaRuolo = document.getElementById("cercaRuolo");

const mappaGiocatori = {};
let ruoli = new Set();
let squadre = new Set();

function normalize(nome) {
  return nome.trim().toLowerCase();
}

function inviaPickAlFoglio(pick, fantaTeam, nome, ruolo, squadra, quotazione) {
  const dati = new URLSearchParams();
  dati.append("pick", pick);
  dati.append("squadra", squadra);
  dati.append("fantaTeam", fantaTeam);
  dati.append("giocatore", nome);
  dati.append("ruolo", ruolo);
  dati.append("quotazione", quotazione);

  fetch("https://script.google.com/macros/s/AKfycbxFamdCRhlGfZ3j53yPUlGzE3dlrpxHvsJbXGht2D4fHJJ1HDybWoWg5Doin2d0BccF8Q/exec", {
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
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTDKKMarxp0Kl7kiIWa-1X7jB-54KcQaLIGArN1FfR_X40rwAKVRgUYRGhrzIJ7SsKtUPnk_Cz8F0qt/pub?output=csv")
    .then(res => res.text())
    .then(csv => {
      const righe = csv.trim().split(/?
/).slice(1);
      let prossima = null;
      righe.forEach(r => {
        const colonne = r.split(",");
        const pick = colonne[0];
        const fantaTeam = colonne[1];
        const nome = colonne[2]?.trim();
        const key = normalize(nome);
        const info = mappaGiocatori[key] || {};

        const ruolo = info.ruolo || colonne[3] || "";
        const squadra = info.squadra || colonne[4] || "";
        const quotazione = info.quotazione || colonne[5] || "";

        const tr = document.createElement("tr");
        giocatoriScelti.add(key);
        tr.innerHTML = "<td>" + pick + "</td>" +
                       "<td>" + fantaTeam + "</td>" +
                       "<td>" + nome + "</td>" +
                       "<td>" + ruolo + "</td>" +
                       "<td>" + squadra + "</td>" +
                       "<td>" + parseInt(quotazione || 0) + "</td>";

        if (!nome && !prossima) {
          prossima = { fantaTeam: fantaTeam, pick: pick };
          tr.classList.add("next-pick");
        } else {
          tr.style.backgroundColor = "#d4edda";
          tr.style.fontWeight = "bold";
        }
        tabella.appendChild(tr);
      });

      const turno = document.getElementById("turno-attuale");
      turno.textContent = prossima
        ? "🎯 È il turno di: " + prossima.fantaTeam + " (Pick " + prossima.pick + ")"
        : "✅ Draft completato!";
    });
}
window.aggiornaChiamatePerSquadra = aggiornaChiamatePerSquadra;

let ordineAscendente = {};

function ordinaPick(colonnaIndex, numerico = false) {
  const tbody = document.querySelector("#tabella-pick tbody");
  const righe = Array.from(tbody.querySelectorAll("tr"));

  const asc = !ordineAscendente[colonnaIndex];
  ordineAscendente[colonnaIndex] = asc;

  document.querySelectorAll("#tabella-pick thead th").forEach((th, idx) => {
    th.textContent = th.textContent.replace(/[\u2191\u2193]/g, "");
    if (idx === colonnaIndex) {
      th.textContent += asc ? " \u2191" : " \u2193";
    }
  });

  righe.sort((a, b) => {
    const aText = a.children[colonnaIndex]?.textContent.trim();
    const bText = b.children[colonnaIndex]?.textContent.trim();

    if (numerico) {
      const aNum = parseFloat(aText) || 0;
      const bNum = parseFloat(bText) || 0;
      return asc ? aNum - bNum : bNum - aNum;
    } else {
      return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
    }
  });

  tbody.innerHTML = "";
  righe.forEach(r => tbody.appendChild(r));
}
window.ordinaPick = ordinaPick;

let ordineListaAscendente = {};

function ordinaLista(colonnaIndex, numerico = false) {
  const tbody = document.getElementById("lista-giocatori");
  const righe = Array.from(tbody.querySelectorAll("tr"));

  const asc = !ordineListaAscendente[colonnaIndex];
  ordineListaAscendente[colonnaIndex] = asc;

  document.querySelectorAll("#lista-giocatori-table thead th").forEach((th, idx) => {
    th.textContent = th.textContent.replace(/[\u2191\u2193]/g, "");
    if (idx === colonnaIndex) {
      th.textContent += asc ? " \u2191" : " \u2193";
    }
  });

  righe.sort((a, b) => {
    const aText = a.children[colonnaIndex]?.textContent.trim();
    const bText = b.children[colonnaIndex]?.textContent.trim();

    if (numerico) {
      const aNum = parseFloat(aText) || 0;
      const bNum = parseFloat(bText) || 0;
      return asc ? aNum - bNum : bNum - aNum;
    } else {
      return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
    }
  });

  tbody.innerHTML = "";
  righe.forEach(r => tbody.appendChild(r));
}
window.ordinaLista = ordinaLista;
