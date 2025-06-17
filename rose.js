const rose = {};
const giocatoriFP = new Set();
const giocatoriU21PerSquadra = {
  "Team Bartowski": ["baldanzi"],
  "Desperados": ["fazzini"],
  "Sharknado 04": [],
  "Real Mimmo": ["bonny"],
  "Giody": ["goglichidze"],
  "Union Librino": [],
  "RubinKebab": [],
  "Rafa Casablanca": [],
  "PokerMantra": ["yildiz"],
  "wildboys78": ["tchaouna"],
  "Bayern Christiansen": ["castro s."],
  "Minnesode Timberland": ["scalvini"],
  "Giulay": ["goglichidze"],
  "MinneSota Snakes": ["fabbian"],
  "Ibla": ["soule'"],
  "Pandinicoccolosini": ["yildiz"]
};

const URL_ROSE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE8Q0l1pnU8NCtId51qCk8Pstat27g6JBQaU-3UKIY0ZCZicUJ1u1T-ElvuR9NK9pc2WYpunW-a4ld/pub?output=csv";

const URL_QUOTAZIONI = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE8Q0l1pnU8NCtId51qCk8Pstat27g6JBQaU-3UKIY0ZCZicUJ1u1T-ElvuR9NK9pc2WYpunW-a4ld/pub?gid=2087990274&single=true&output=csv";

const squadre = [
  { col: 0, start: 2, end: 29, headerRow: 0 },
  { col: 5, start: 2, end: 29, headerRow: 0 },
  { col: 0, start: 33, end: 60, headerRow: 31 },
  { col: 5, start: 33, end: 60, headerRow: 31 },
  { col: 0, start: 64, end: 91, headerRow: 62 },
  { col: 5, start: 64, end: 91, headerRow: 62 },
  { col: 0, start: 95, end: 122, headerRow: 93 },
  { col: 5, start: 95, end: 122, headerRow: 93 },
  { col: 0, start: 126, end: 153, headerRow: 124 },
  { col: 5, start: 126, end: 153, headerRow: 124 },
  { col: 0, start: 157, end: 184, headerRow: 155 },
  { col: 5, start: 157, end: 184, headerRow: 155 },
  { col: 0, start: 187, end: 215, headerRow: 186 },
  { col: 5, start: 187, end: 215, headerRow: 186 },
  { col: 0, start: 218, end: 246, headerRow: 217 },
  { col: 5, start: 218, end: 246, headerRow: 217 },
];

function trovaLogo(nomeSquadra) {
  const estensioni = [".png", ".jpg"];
  const varianti = [
    nomeSquadra,
    nomeSquadra.toLowerCase(),
    nomeSquadra.replaceAll(" ", "_").toLowerCase()
  ];

  for (const base of varianti) {
    for (const ext of estensioni) {
      const path = `img/${base}${ext}`;
      return path;
    }
  }

  return "img/default.png";
}
console.log("🔍 Avvio caricaGiocatoriFP");
async function caricaGiocatoriFP() {
  try {
    const response = await fetch(URL_QUOTAZIONI);
    const text = await response.text();
    const rows = text.split("\n").map(r => r.split(","));

    const portieriPerSquadra = {}; // Per i blocchi portieri

    for (let i = 1; i < rows.length; i++) {
      const ruolo = rows[i][0]?.trim().toUpperCase();     // Ruolo
      const nome = rows[i][2]?.trim();                     // Nome
      const squadra = rows[i][3]?.trim();                  // Squadra
      const quotazione = parseFloat(rows[i][4]?.replace(",", ".")); // Quotazione Mantra

      if (!nome || isNaN(quotazione)) continue;

      const nomeLower = nome.toLowerCase();

      if (ruolo === "P") {
        if (!portieriPerSquadra[squadra]) portieriPerSquadra[squadra] = [];
        portieriPerSquadra[squadra].push({ nome: nomeLower, quotazione });
      } else if (
        (ruolo === "D" && quotazione <= 9) ||
        (ruolo === "C" && quotazione <= 14) ||
        (ruolo === "A" && quotazione <= 19)
      ) {
        giocatoriFP.add(nomeLower);
      }
    }

    // Verifica dei blocchi portieri FP
    for (const squadra in portieriPerSquadra) {
      const blocco = portieriPerSquadra[squadra];
      const maxQuota = Math.max(...blocco.map(p => p.quotazione));
      if (maxQuota <= 12) {
        blocco.forEach(p => giocatoriFP.add(p.nome));
      }
    }

  } catch (e) {
    console.error("Errore nel caricamento FP:", e);
  }
}


async function caricaRose() {
  await caricaGiocatoriFP();

  const response = await fetch(URL_ROSE);
  const text = await response.text();
  const rows = text.split("\n").map(r => r.split(","));

  for (const s of squadre) {
    let nomeSquadra = rows[s.headerRow]?.[s.col]?.trim();
    if (!nomeSquadra || nomeSquadra.toLowerCase() === "ruolo") continue;

    const giocatori = [];
    for (let i = s.start; i <= s.end; i++) {
      const ruolo = rows[i]?.[s.col]?.trim() || "";
      const nome = rows[i]?.[s.col + 1]?.trim() || "";
      const squadra = rows[i]?.[s.col + 2]?.trim() || "";
      const quotazione = rows[i]?.[s.col + 3]?.trim() || "";
      const nomeClean = nome.toLowerCase();

      if (nome && nome.toLowerCase() !== "nome") {
       giocatori.push({
  nome,
  ruolo,
  squadra,
  quotazione,
  fp: giocatoriFP.has(nomeClean),
  u21: giocatoriU21PerSquadra[nomeSquadra]?.includes(nomeClean) || false
});
      }
    }

    if (giocatori.length > 0) {
      rose[nomeSquadra] = {
        logo: trovaLogo(nomeSquadra),
        giocatori
      };
    }
  }

  mostraRose();
}

function mostraRose() {
  const container = document.getElementById("contenitore-rose");
  if (!container) return;
  container.innerHTML = "";

  for (const [nome, data] of Object.entries(rose)) {
    const div = document.createElement("div");
    div.className = "box-rosa";
    div.innerHTML = `
      <h2><img src="${data.logo}" class="logo-squadra"> ${nome}</h2>
      <table>
        <thead><tr><th>Ruolo</th><th>Nome</th><th>Squadra</th><th>Q</th></tr></thead>
        <tbody>
          ${data.giocatori.map(g => `
            <tr>
              <td>${g.ruolo}</td>
              <td>${g.nome} ${g.fp ? '🅕' : ''} ${g.u21 ? '🅤21' : ''}</td>
              <td>${g.squadra}</td>
              <td>${g.quotazione}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    `;
    container.appendChild(div);
  }
}

window.addEventListener("DOMContentLoaded", caricaRose);

// 🔍 Filtro per nome giocatore
document.getElementById('filtro-nome').addEventListener('input', filtraGiocatori);
// 🎯 Filtro per conference
document.getElementById('filtro-conference').addEventListener('change', filtraGiocatori);
// 🏟️ Filtro per squadra
document.getElementById('filtro-squadra').addEventListener('change', filtraGiocatori);

// 🔄 Reset filtri
function resetFiltri() {
  document.getElementById('filtro-nome').value = '';
  document.getElementById('filtro-conference').value = 'Tutte';
  document.getElementById('filtro-squadra').value = 'Tutte';
  filtraGiocatori();
}

// 🔎 Funzione di filtro
function filtraGiocatori() {
  const nome = document.getElementById('filtro-nome').value.toLowerCase();
  const conference = document.getElementById('filtro-conference').value;
  const squadra = document.getElementById('filtro-squadra').value;

  document.querySelectorAll('.giocatore').forEach(row => {
    const nomeGiocatore = row.querySelector('.nome').textContent.toLowerCase();
    const conf = row.getAttribute('data-conference');
    const team = row.getAttribute('data-squadra');

    const matchNome = nomeGiocatore.includes(nome);
    const matchConf = (conference === 'Tutte' || conf === conference);
    const matchTeam = (squadra === 'Tutte' || team === squadra);

    if (matchNome && matchConf && matchTeam) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}