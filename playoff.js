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

  matchDivs.forEach((match, idx) => {
    if (!posizioni[idx] || posizioni[idx].length < 2) return;
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
    else if (idx < 8) {
      const ordineTesteDiSerie = [0, 3, 2, 1];
      const testaSerieIndex = idx - 4;
      const teamTop4Index = ordineTesteDiSerie[testaSerieIndex];
      const squadraTop = squadre[teamTop4Index];

      spans[0].innerHTML = creaHTMLSquadra(squadraTop.nome, `${teamTop4Index + 1}°`);

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
      const risultatoWC = window.risultati?.find(r => r.partita === mappingWC[testaSerieIndex]);

      console.log(`🧠 Quarto ${matchId} → ${nomeA} vs ${nomeB} | Vincente: ${risultato?.vincente || risultatoWC?.vincente || "?"}`);

      if (risultato?.vincente) {
        spans[2].innerHTML = creaHTMLSquadra(risultato.vincente);
      } else if (risultatoWC?.vincente) {
        spans[2].innerHTML = creaHTMLSquadra(risultatoWC.vincente);
      } else {
        spans[2].innerHTML = creaHTMLSquadra(`Vincente ${nomeA} / ${nomeB}`);
      }
          // 🔺 Semifinali (idx 8 e 9)
    else if (idx < 10) {
      const semiIndex = idx - 8;
      const mappingSemis = [
        ["Q1", "Q2"],
        ["Q3", "Q4"]
      ];
      const [m1, m2] = mappingSemis[semiIndex];
      const risultato1 = window.risultati?.find(r => r.partita === m1);
      const risultato2 = window.risultati?.find(r => r.partita === m2);

      const squadraA = risultato1?.vincente || `Vincente ${m1}`;
      const squadraB = risultato2?.vincente || `Vincente ${m2}`;

      spans[0].innerHTML = creaHTMLSquadra(squadraA);
      spans[2].innerHTML = creaHTMLSquadra(squadraB);
    }

    // 👑 Finale (idx 10)
    else if (idx === 10) {
      const risultatoS1 = window.risultati?.find(r => r.partita === "S1");
      const risultatoS2 = window.risultati?.find(r => r.partita === "S2");

      const squadraA = risultatoS1?.vincente || "Vincente S1";
      const squadraB = risultatoS2?.vincente || "Vincente S2";

      spans[0].innerHTML = creaHTMLSquadra(squadraA);
      spans[2].innerHTML = creaHTMLSquadra(squadraB);
    }
    }
  });
}

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
