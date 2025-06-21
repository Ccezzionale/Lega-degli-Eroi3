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

  const matchDivs = document.querySelectorAll(".match");

  matchDivs.forEach((match, idx) => {
    if (!posizioni[idx] || posizioni[idx].length < 2) return;
    const spans = match.querySelectorAll("span");

    if (idx < 4) {
  const mappingWC = ["WC1", "WC2", "WC3", "WC4"];
  const matchId = mappingWC[idx];
  const risultato = window.risultati?.find(r => r.partita === matchId);

  if (risultato) {
    // mostra sempre entrambe le squadre
    spans[0].innerHTML = creaHTMLSquadra(risultato.squadraA);
    spans[2].innerHTML = creaHTMLSquadra(risultato.squadraB);
  } else {
    // fallback alla classifica se mancano dati
    spans[0].innerHTML = creaHTMLSquadra(squadre[i1].nome, `${i1 + 1}°`);
    spans[2].innerHTML = creaHTMLSquadra(squadre[i2].nome, `${i2 + 1}°`);
    
   } else if (idx < 8) {
  const ordineTesteDiSerie = [0, 3, 2, 1];
  const testaSerieIndex = idx - 4;
  const teamTop4Index = ordineTesteDiSerie[testaSerieIndex];
  const squadraTop = squadre[teamTop4Index];
  spans[0].innerHTML = creaHTMLSquadra(squadraTop.nome, `${teamTop4Index + 1}°`);

  const mappingWC = ["WC1", "WC4", "WC3", "WC2"];
  const idWC = mappingWC[testaSerieIndex];
  const idQuarto = `Q${testaSerieIndex + 1}`;

  const risultatoQuarto = window.risultati?.find(r => r.partita === idQuarto);
  const risultatoWC = window.risultati?.find(r => r.partita === idWC);

  if (risultatoQuarto?.vincente) {
    spans[2].innerHTML = creaHTMLSquadra(risultatoQuarto.vincente);
  } else if (risultatoWC?.vincente) {
    spans[2].innerHTML = creaHTMLSquadra(risultatoWC.vincente);
  } else if (risultatoWC) {
    spans[2].innerHTML = creaHTMLSquadra(`Vincente ${risultatoWC.squadraA} / ${risultatoWC.squadraB}`);
  } else {
    spans[2].innerHTML = creaHTMLSquadra("?");
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
