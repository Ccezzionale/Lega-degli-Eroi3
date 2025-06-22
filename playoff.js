const URL_CLASSIFICA_TOTALE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTduESMbJiPuCDLaAFdOHjep9GW-notjraILSyyjo6SA0xKSR0H0fgMLPNNYSwXgnGGJUyv14kjFRqv/pub?gid=691152130&single=true&output=csv";

// 🔧 Funzione per creare HTML squadra con logo
function creaHTMLSquadra(nome, posizione = "") {
  const fileLogo = `img/${nome}.png`; // usa direttamente il nome con gli spazi
  return `
    <div class="squadra">
      <img src="${fileLogo}" alt="${nome}" onerror="this.style.display='none'">
      <span>${posizione} ${nome}</span>
    </div>`;
}

function formattaNomePerLogo(nome) {
  return nome
    .replace(/^\s*\d+°?\s*/, '') // ✅ Rimuove tipo '8° ', '12° ', ecc.
    .toLowerCase()
    .replace(/[^\w\s]/g, '')     // rimuove caratteri speciali
    .replace(/\s+/g, '_')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function aggiornaPlayoff() {
  const posizioni = [
    [5, 10], [6, 9], [7, 8], [4, 11],
    [7, 8], [6, 9], [5, 10], [4, 11]
  ];

  const mappingWC = ["WC1", "WC2", "WC3", "WC4"];
  const mappingPosWC = [
    [7, 8], [4, 11], [5, 10], [6, 9]
  ];

  const matchDivs = document.querySelectorAll(".match");

  matchDivs.forEach((el, idx) => {
    console.log(`🔢 Match idx ${idx} → id="${el.id}" | contenuto: ${el.outerHTML}`);
  });

  matchDivs.forEach((match, idx) => {
    const spans = match.querySelectorAll("span");

    // 🔹 Wildcard
    if (idx < 4) {
      const [i1, i2] = mappingPosWC[idx];
      const matchId = mappingWC[idx];
      const risultato = window.risultati?.find(r => r.partita === matchId);

      const squadraA = risultato?.squadraA || squadre[i1]?.nome || "?";
      const squadraB = risultato?.squadraB || squadre[i2]?.nome || "?";
      const posizioneA = !risultato?.squadraA ? `${i1 + 1}°` : "";
      const posizioneB = !risultato?.squadraB ? `${i2 + 1}°` : "";

      spans[0].innerHTML = creaHTMLSquadra(squadraA, posizioneA);
      spans[2].innerHTML = creaHTMLSquadra(squadraB, posizioneB);
    }

    // 🔸 Quarti
        else if (idx >= 4 && idx <= 7) {
      const ordineTesteDiSerie = [0, 3, 2, 1];
      const testaSerieIndex = idx - 4;
      const teamTop4Index = ordineTesteDiSerie[testaSerieIndex];
      const squadraTop = squadre[teamTop4Index];

      const mapping = [
        [4, 2], [7, 3], [6, 0], [5, 1]
      ];
      const [idxPosA, idxPosB] = mapping[testaSerieIndex];
      const squadraAIndex = posizioni[idxPosA][0];
      const squadraBIndex = posizioni[idxPosB][1];

      const nomeA = `${squadraAIndex + 1}° ${squadre[squadraAIndex]?.nome || "?"}`;
      const nomeB = `${squadraBIndex + 1}° ${squadre[squadraBIndex]?.nome || "?"}`;

      const matchId = `Q${testaSerieIndex + 1}`;
      const risultato = window.risultati?.find(r => r.partita === matchId);

      const squadraA = risultato?.squadraA;
      const squadraB = risultato?.squadraB;

      if (squadraA && squadraB) {
        spans[0].innerHTML = creaHTMLSquadra(squadraA);
        spans[2].innerHTML = creaHTMLSquadra(squadraB);
      }
    }

    // ⚔️ Semifinali
    else if (idx === 8 || idx === 9) {
      const semiIndex = idx - 8;
      const mapping = [
        ["Q1", "Q2"],
        ["Q3", "Q4"]
      ];
      const [id1, id2] = mapping[semiIndex];

      const risultato1 = window.risultati?.find(r => r.partita === id1);
      const risultato2 = window.risultati?.find(r => r.partita === id2);
      const risultatoSemi = window.risultati?.find(r => r.partita === `S${semiIndex + 1}`);

      const squadraA = risultato1?.vincente || `Vincente ${id1}`;
      const squadraB = risultato2?.vincente || `Vincente ${id2}`;

      console.log(`🧠 Semifinale S${semiIndex + 1} → ${squadraA} vs ${squadraB} | Vincente: ${risultatoSemi?.vincente || "?"}`);

      if (risultatoSemi?.vincente) {
        spans[0].innerHTML = creaHTMLSquadra(squadraA);
        spans[2].innerHTML = creaHTMLSquadra(squadraB);
      } else {
        spans[0].innerHTML = creaHTMLSquadra(squadraA);
        spans[2].innerHTML = creaHTMLSquadra(`Vincente ${squadraA} / ${squadraB}`);
      }
    }

    // 🏆 Finale
    else if (idx === 10) {
      const risultato1 = window.risultati?.find(r => r.partita === "S1");
      const risultato2 = window.risultati?.find(r => r.partita === "S2");
      const risultatoFinale = window.risultati?.find(r => r.partita === "F");

      const squadraA = risultato1?.vincente || `Vincente ${risultato1?.squadraA || "S1A"} / ${risultato1?.squadraB || "S1B"}`;
      const squadraB = risultato2?.vincente || `Vincente ${risultato2?.squadraA || "S2A"} / ${risultato2?.squadraB || "S2B"}`;

      console.log(`🏆 Finale → ${squadraA} vs ${squadraB} | Vincente: ${risultatoFinale?.vincente || "?"}`);

      spans[0].innerHTML = creaHTMLSquadra(squadraA);
      spans[2].innerHTML = creaHTMLSquadra(squadraB);
    }
  });

  // 🔁 Fallback Quarti – se non ci sono risultati dal foglio
const quartiIds = ["Q1", "Q2", "Q3", "Q4"];
const fallbackQuarti = [
  ["1° Classificata", "Vincente WC4"],
  ["4° Classificata", "Vincente WC1"],
  ["3° Classificata", "Vincente WC2"],
  ["2° Classificata", "Vincente WC3"]
];

quartiIds.forEach((id, idx) => {
  const match = document.getElementById(id);
  const spans = match?.querySelectorAll("span");
  const haRisultato = window.risultati?.find(r => r.partita === id);

  if (!haRisultato && spans?.length >= 3) {
    const [nomeA, nomeB] = fallbackQuarti[idx];
    spans[0].innerHTML = creaHTMLSquadra(nomeA);
    spans[2].innerHTML = creaHTMLSquadra(nomeB);
  }
});

// 🟢 Caricamento classifica
fetch(URL_CLASSIFICA_TOTALE)
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n");
    const startRow = 1;
    const squadreProvvisorie = [];

    for (let i = startRow; i < righe.length; i++) {
      const colonne = righe[i].split(",").map(c => c.replace(/"/g, "").trim());
      const nome = colonne[1];
      const punti = parseInt(colonne[10]) || 0;
      const mp = parseFloat(colonne[11].replace(",", ".")) || 0;
      if (!nome || isNaN(punti)) continue;
      squadreProvvisorie.push({ nome, punti, mp });
      if (squadreProvvisorie.length === 12) break;
    }

    squadreProvvisorie.sort((a, b) => {
      if (b.punti !== a.punti) return b.punti - a.punti;
      return b.mp - a.mp;
    });

    window.squadre = squadreProvvisorie;
  })
  .catch(err => console.error("❌ Errore nel caricamento classifica Totale:", err));
