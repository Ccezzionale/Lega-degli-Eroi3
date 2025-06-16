const rose = {};
const giocatoriFP = new Set();
const URL_ROSE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE8Q0l1pnU8NCtId51qCk8Pstat27g6JBQaU-3UKIY0ZCZicUJ1u1T-ElvuR9NK9pc2WYpunW-a4ld/pub?output=csv";
const URL_QUOTAZIONI = "const URL_QUOTAZIONI = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQb8mLh8lDTRQTfEZL7XSmg6dTQAGdKIKUs8AdZrVzt3Kt_lzSRbM6Q3hTi1T3IvTXp7znYXaBlmFLI/pub?gid=2087990274&single=true&output=csv";
";

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

async function caricaGiocatoriFP() {
  try {
    const response = await fetch(URL_QUOTAZIONI);
    const text = await response.text();
    const rows = text.split("\n").map(r => r.split(","));

    for (let i = 1; i < rows.length; i++) {
      const [nome, ruolo, , , , , , , , , , qtAm] = rows[i];
      const nomeClean = nome?.trim().toLowerCase();
      const ruoloClean = ruolo?.trim().toUpperCase();
      const quotazione = parseFloat(qtAm?.replace(",", "."));

      if (!nomeClean || isNaN(quotazione)) continue;

      if (
        (ruoloClean === "D" && quotazione <= 9) ||
        (ruoloClean === "C" && quotazione <= 14) ||
        (ruoloClean === "A" && quotazione <= 19)
      ) {
        giocatoriFP.add(nomeClean);
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
      const ruolo = rows[i]?.[s.col] || "";
      const nome = rows[i]?.[s.col + 1] || "";
      const squadra = rows[i]?.[s.col + 2] || "";
      const quotazione = rows[i]?.[s.col + 3] || "";
      const nomeClean = nome.trim().toLowerCase();

      if (nomeClean && nome.toLowerCase() !== "nome") {
        giocatori.push({
          nome,
          ruolo,
          squadra,
          quotazione,
          fp: giocatoriFP.has(nomeClean)
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
              <td>${g.nome} ${g.fp ? '🔵' : ''}</td>
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

