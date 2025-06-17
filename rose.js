
// Caricamento dati
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSE4mNGLf5ZZMWbt3PUUR6p0g6BoKzF_hvIsVO6vVCUrXzA2GcDr_AeZYwsECtfk6KZkYHEZG_DU0Y4/pub?output=csv")
  .then(response => response.text())
  .then(csv => {
    const righe = csv.split("\n").map(r => r.split(","));
    const contenitore = document.getElementById("contenitore-rose");

    if (!righe || righe.length === 0) {
      contenitore.innerHTML = "<p>❌ Nessun dato disponibile.</p>";
      return;
    }

    const squadre = {};
    const conferenceSet = new Set();

    righe.forEach(riga => {
      const [conf, squadra, nome, ruolo] = riga;
      if (!squadre[squadra]) squadre[squadra] = [];
      squadre[squadra].push({ conf, nome, ruolo });
      conferenceSet.add(conf);
    });

    const elencoConference = [...conferenceSet].sort();
    const filtroConference = document.getElementById("filtro-conference");
    elencoConference.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      filtroConference.appendChild(opt);
    });

    const elencoSquadre = Object.keys(squadre).sort();
    const filtroSquadra = document.getElementById("filtro-squadra");
    elencoSquadre.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      filtroSquadra.appendChild(opt);
    });

    function mostraRose() {
      const filtroC = filtroConference.value;
      const filtroS = filtroSquadra.value;
      const filtroN = document.getElementById("filtro-nome").value.toLowerCase();
      contenitore.innerHTML = "";

      elencoSquadre.forEach(sq => {
        const giocatori = squadre[sq].filter(g =>
          (!filtroC || g.conf === filtroC) &&
          (!filtroS || sq === filtroS) &&
          (!filtroN || g.nome.toLowerCase().includes(filtroN))
        );

        if (giocatori.length > 0) {
          const blocco = document.createElement("div");
          blocco.className = "blocco-rosa";
          const titolo = document.createElement("h3");
          titolo.textContent = sq;
          blocco.appendChild(titolo);

          const lista = document.createElement("ul");
          giocatori.forEach(g => {
            const li = document.createElement("li");
            li.textContent = `${g.nome} (${g.ruolo})`;
            lista.appendChild(li);
          });

          blocco.appendChild(lista);
          contenitore.appendChild(blocco);
        }
      });
    }

    document.getElementById("filtro-conference").addEventListener("change", mostraRose);
    document.getElementById("filtro-squadra").addEventListener("change", mostraRose);
    document.getElementById("filtro-nome").addEventListener("input", mostraRose);
    window.resetFiltri = () => {
      filtroConference.value = "";
      filtroSquadra.value = "";
      document.getElementById("filtro-nome").value = "";
      mostraRose();
    };

    mostraRose();
  });
