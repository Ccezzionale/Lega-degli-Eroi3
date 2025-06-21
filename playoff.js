const URL_CLASSIFICA_TOTALE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=691152130&single=true&output=csv";
const URL_PLAYOFF = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwFDMVkq09-yRzsLwFqehbAntqMpTPtyMwUsTJkRtUREmmP6vJcTROPchoYq1rc0h1ynqkcGJvEOsD/pub?output=csv";

let squadre = [];
let risultati = [];

function creaHTMLSquadra(nome, posizione = "") {
  return `<div class="squadra"><span class="pos">${posizione}</span><span class="nome">${nome}</span></div>`;
}

function aggiornaPlayoff() {
  const posizioni = [
    [5, 10], [6, 9], [7, 8], [4, 11],
    [7, 8], [6, 9], [5, 10], [4, 11]
  ];

  const matchDivs = document.querySelectorAll(".match");

  matchDivs.forEach((match, idx) => {
    if (!posizioni[idx] || posizioni[idx].length < 2) return;
    const spans = match.querySelectorAll("span");

    if (idx < 4) {
      const mappingWC = [ [7, 8], [4, 11], [5, 10], [6, 9] ];
      const [i1, i2] = mappingWC[idx];
      const matchId = `WC${idx + 1}`;
      const r = risultati.find(r => r.partita === matchId);
      if (!r || (!r.golA && !r.golB)) {
        spans[0].innerHTML = creaHTMLSquadra(squadre[i1].nome, `${i1 + 1}°`);
        spans[2].innerHTML = creaHTMLSquadra(squadre[i2].nome, `${i2 + 1}°`);
      } else {
        spans[0].innerHTML = creaHTMLSquadra(r.squadraA);
        spans[2].innerHTML = creaHTMLSquadra(r.squadraB);
      }

    } else if (idx < 8) {
      const ordineTesteDiSerie = [0, 3, 2, 1];
      const testaSerieIndex = idx - 4;
      const teamTop4Index = ordineTesteDiSerie[testaSerieIndex];
      const squadraTop = squadre[teamTop4Index];
      spans[0].innerHTML = creaHTMLSquadra(squadraTop.nome, `${teamTop4Index + 1}°`);

      const mapping = [ [4, 2], [7, 3], [6, 0], [5, 1] ];
      const [idxPosA, idxPosB] = mapping[testaSerieIndex];
      const squadraAIndex = posizioni[idxPosA][0];
      const squadraBIndex = posizioni[idxPosB][1];
      const nomeA = `${squadraAIndex + 1}° ${squadre[squadraAIndex]?.nome || "?"}`;
      const nomeB = `${squadraBIndex + 1}° ${squadre[squadraBIndex]?.nome || "?"}`;
      const matchId = `Q${testaSerieIndex + 1}`;
      const r = risultati.find(r => r.partita === matchId);
      if (r?.vincente) {
        spans[2].innerHTML = creaHTMLSquadra(r.vincente);
      } else {
        spans[2].innerHTML = creaHTMLSquadra(`Vincente ${nomeA} / ${nomeB}`);
      }

    } else if (idx < 10) {
      const matchId = `S${idx - 8 + 1}`;
      const r = risultati.find(r => r.partita === matchId);
      if (r?.squadraA) spans[0].innerHTML = creaHTMLSquadra(r.squadraA);
      if (r?.squadraB) spans[2].innerHTML = creaHTMLSquadra(r.squadraB);

    } else if (idx === 10) {
      const r = risultati.find(r => r.partita === "F");
      if (r?.squadraA) spans[0].innerHTML = creaHTMLSquadra(r.squadraA);
      if (r?.squadraB) spans[2].innerHTML = creaHTMLSquadra(r.squadraB);
    }
  });
}

fetch(URL_CLASSIFICA_TOTALE)
  .then(r => r.text())
  .then(csv => {
    const righe = csv.trim().split("\n").slice(1);
    const temp = righe.map(r => r.split(","));
    squadre = temp.map(col => ({
      nome: col[0].trim(),
      punti: parseInt(col[10]) || 0,
      magic: parseFloat(col[11]) || 0
    }));
    squadre.sort((a, b) => b.punti !== a.punti ? b.punti - a.punti : b.magic - a.magic);
  })
  .then(() => fetch(URL_PLAYOFF))
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n").slice(1);
    risultati = righe.map(riga => {
      const colonne = riga.split(",").map(c => c.trim().replace(/"/g, ""));
      const [partita, _, squadraA, squadraB, golA, golB, vincente] = colonne;
      return {
        partita,
        squadraA,
        squadraB,
        golA: golA ? parseInt(golA) : null,
        golB: golB ? parseInt(golB) : null,
        vincente
      };
    });
    window.risultati = risultati;
    aggiornaPlayoff();
  })
  .catch(err => console.error("❌ Errore playoff:", err));
