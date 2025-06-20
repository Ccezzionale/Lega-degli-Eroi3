const URL_PLAYOFF = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwFDMVkq09-yRzsLwFqehbAntqMpTPtyMwUsTJkRtUREmmP6vJcTROPchoYq1rc0h1ynqkcGJvEOsD/pub?output=csv";

fetch(URL_PLAYOFF)
  .then(res => res.text())
  .then(csv => {
    const righe = csv.trim().split("\n").slice(1); // Salta intestazione
    const risultati = [];

    righe.forEach(riga => {
      const colonne = riga.split(",").map(c => c.replace(/"/g, "").trim());
      const [turno, partita, squadraA, squadraB, golA, golB, vincente] = colonne;

      risultati.push({ turno, partita, squadraA, squadraB, golA, golB, vincente });

      // Trova il match nel DOM (mobile layout usa match-card)
     const matchId = `WC${idx + 1}`; // o Q1, S1, ecc. in base al contesto
const match = document.querySelector(`.match-card[data-partita="${matchId}"]`);
if (!match) return;

const risultato = window.risultati?.find(r => r.partita === matchId);
if (!risultato) return;

const { squadraA, squadraB, golA, golB, vincente } = risultato;

const team1 = match.querySelector(".team1");
const team2 = match.querySelector(".team2");
const vs = match.querySelector(".vs");

if (golA && golB) {
  team1.textContent = squadraA;
  vs.textContent = `${golA} - ${golB}`;
  team2.textContent = squadraB;
} else {
  team1.textContent = squadraA || "";
  team2.textContent = squadraB || "";
}

if (vincente) {
  match.classList.add("conclusa");
  match.classList.add(vincente === squadraA ? "vittoria-a" : "vittoria-b");
}
