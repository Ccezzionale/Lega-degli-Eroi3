function mostraClassifica(tipo) {
  const tabella = classifiche[tipo];
  const contenitore = document.getElementById("contenitore-classifica");
  contenitore.innerHTML = "";
  if (!tabella) {
    contenitore.innerHTML = "<p>Classifica non trovata.</p>";
    return;
  }
  const table = document.createElement("table");
  tabella.forEach((riga, i) => {
    const tr = document.createElement("tr");
    riga.forEach(cell => {
      const td = document.createElement(i === 0 ? "th" : "td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  contenitore.appendChild(table);
}
