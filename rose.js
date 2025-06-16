
const rose = {};
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
  { col: 0, start: 188, end: 215, headerRow: 187 },
  { col: 5, start: 188, end: 215, headerRow: 187 },
  { col: 0, start: 219, end: 246, headerRow: 218 },
  { col: 5, start: 219, end: 246, headerRow: 218 },
];

async function caricaRose() {
  const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSE8Q0l1pnU8NCtId51qCk8Pstat27g6JBQaU-3UKIY0ZCZicUJ1u1T-ElvuR9NK9pc2WYpunW-a4ld/pub?output=csv");
  const text = await response.text();
  const rows = text.split("\n").map(r => r.split(","));

  for (const s of squadre) {
    let nomeSquadra = rows[s.headerRow]?.[s.col]?.trim();
    if (!nomeSquadra) continue;

    const giocatori = [];
    for (let i = s.start; i <= s.end; i++) {
      const ruolo = rows[i]?.[s.col] || "";
      const nome = rows[i]?.[s.col + 1] || "";
      const squadra = rows[i]?.[s.col + 2] || "";
      const quotazione = rows[i]?.[s.col + 3] || "";
      if (nome.trim()) {
        giocatori.push({ nome, ruolo, squadra, quotazione });
      }
    }

    rose[nomeSquadra] = {
      logo: `img/${nomeSquadra.toLowerCase().replaceAll(" ", "_")}.png`,
      giocatori
    };
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
              <td>${g.nome}</td>
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
