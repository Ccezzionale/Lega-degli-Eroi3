const rose = {};
const conferencePerSquadra = {
  "Team Bartowski": "Conference League",
  "Desperados": "Conference League",
  "Sharknado 04": "Conference Championship",
  "Real Mimmo": "Conference Championship",
  "Giody": "Conference Championship",
  "Union Librino": "Conference Championship",
  "Rubinkebab": "Conference Championship",
  "Rafa Casablanca": "Conference Championship",
  "PokerMantra": "Conference Championship",
  "wildboys78": "Conference Championship",
  "Bayern Christiansen": "Conference League",
  "Minnesode Timberland": "Conference League",
  "Giulay": "Conference League",
  "MinneSota Snakes": "Conference League",
  "Ibla": "Conference League",
  "Pandinicoccolosini": "Conference League"
};

const conferencePerSquadra = {
  "Team Bartowski": "Conference League",
  "Desperados": "Conference League",
  "Sharknado 04": "Conference Championship",
  "Real Mimmo": "Conference Championship",
  "Giody": "Conference Championship",
  "Union Librino": "Conference Championship",
  "Rubinkebab": "Conference Championship",
  "Rafa Casablanca": "Conference Championship",
  "PokerMantra": "Conference Championship",
  "wildboys78": "Conference Championship",
  "Bayern Christiansen": "Conference League",
  "Minnesode Timberland": "Conference League",
  "Giulay": "Conference League",
  "MinneSota Snakes": "Conference League",
  "Ibla": "Conference League",
  "Pandinicoccolosini": "Conference League"
};

function popolaFiltri() {
  const selectSquadra = document.getElementById("filtro-squadra");
  const selectConf = document.getElementById("filtro-conference");

  if (!selectSquadra || !selectConf) return;

  const squadreUniche = new Set();
  const conferenceUniche = new Set();

  document.querySelectorAll(".giocatore").forEach(div => {
    squadreUniche.add(div.getAttribute("data-squadra"));
    conferenceUniche.add(div.getAttribute("data-conference"));
  });

  selectSquadra.innerHTML = '<option value="Tutte">Tutte le squadre</option>';
  squadreUniche.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    selectSquadra.appendChild(opt);
  });

  selectConf.innerHTML = '<option value="Tutte">Tutte le Conference</option>';
  conferenceUniche.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    selectConf.appendChild(opt);
  });
}



if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", caricaRose);
} else {
  caricaRose();
}

