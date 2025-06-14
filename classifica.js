<style>
  @media (max-width: 768px) {
    #tabella-classifica, .switch-container {
      display: none;
    }
    .mobile-classifica {
      display: block;
      padding: 1rem;
    }
    details {
      background-color: #001f3f;
      margin-bottom: 0.5rem;
      border-radius: 10px;
      padding: 0.5rem 1rem;
      color: white;
      border: 1px solid #003b66;
    }
    summary {
      cursor: pointer;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1rem;
    }
    .team-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .team-info img {
      height: 24px;
      border-radius: 4px;
      background-color: white;
    }
    .mobile-classifica ul {
      margin-top: 0.5rem;
      padding-left: 1rem;
    }
    .mobile-classifica li {
      list-style: disc;
    }
  }
  @media (min-width: 769px) {
    .mobile-classifica {
      display: none;
    }
  }
</style>

<div class="mobile-classifica" id="mobile-classifica">
  <!-- Sarà riempito via JavaScript -->
</div>

<script>
const GID_MAP = {
  "Conference": "0",
  "Championship": "1102946509",
  "Totale": "2134024333"
};
const SHEET_ID = "1aHVZ8nXLns5bPQN3V7WJr8MKpwd5KvZmPYFhkE2pZqc";

function creaFisarmonica(nomeFoglio) {
  const gid = GID_MAP[nomeFoglio];
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
  fetch(url)
    .then(res => res.text())
    .then(csv => {
      const righe = csv.trim().split("\n").map(r => r.split(","));
      const header = righe[0];
      const corpo = righe.slice(1);
      const container = document.getElementById("mobile-classifica");
      container.innerHTML = "";

      corpo.forEach(riga => {
        const [pos, squadra, , vinte, pari, perse, gf, gs, dr, pt, ptTot] = riga;
        const nome = squadra.trim();
        const logo = `img/${nome}.png`;

        const box = document.createElement("details");
        const sum = document.createElement("summary");

        sum.innerHTML = `
          <div class="team-info">
            <img src="${logo}" alt="${nome}" />
            ${nome}
          </div>
          <span>#${pos} - ${pt} pt. / ${ptTot}</span>
        `;

        const lista = document.createElement("ul");
        lista.innerHTML = `
          <li>Vinte: ${vinte}</li>
          <li>Perse: ${perse}</li>
          <li>Pari: ${pari}</li>
        `;

        box.appendChild(sum);
        box.appendChild(lista);
        container.appendChild(box);
      });
    });
}

window.onload = () => {
  if (window.innerWidth < 768) {
    creaFisarmonica("Conference");
  }
};
</script>

