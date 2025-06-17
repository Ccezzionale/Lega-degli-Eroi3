function caricaChiamate(conference) {
  const chiamateURLs = {
    league15: "https://script.google.com/macros/s/AKfycbyFp5ILk_ipmbH1DUaw6fFGiKqHMKk9F1GysyEw7PV8qdqyHBVBsSWh7zpR_ALyXGBq/exec",
    league16: "https://script.google.com/macros/s/AKfycbxrBDg3cKtDjCxipDeylmjVpqmVZtrdnEgiHOV0D31M64ND-hQePcLX2CffRS-GgfrGCw/exec",
    champ15: "https://script.google.com/macros/s/AKfycbzweLTNlvrKlbpPpJ1a1aV5zYc00-TYnFcwF4lw2DdXUOTw6JvftWZtzD42s2mdNGxY/exec",
    champ16: "https://script.google.com/macros/s/AKfycbx4Id2uQE-uVX96HPCHAkUATEEb232YfYjlA5uI1RhaiLaFlrMcOoQ8Mju5mWa9ZQGv/exec"
  };

  const url = chiamateURLs[conference];
  if (!url) return;

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.split('\\n').map(r => r.split(','));
      const intestazioni = righe[0];
      const dati = righe.slice(1);

      if (dati.length === 1 && dati[0][0].startsWith("🔒")) {
        document.getElementById('chiamate-container').innerHTML =
          '<div class="avviso">' + dati[0][0] + '</div>';
        return;
      }

      let html = '<table><thead><tr>';
      for (let i = 0; i < intestazioni.length; i++) {
        html += '<th>' + intestazioni[i] + '</th>';
      }
      html += '</tr></thead><tbody>';

      dati.forEach(riga => {
        if (riga.length >= 2 && riga[1].trim() !== '') {
          html += '<tr>';
          riga.forEach(val => html += '<td>' + val + '</td>');
          html += '</tr>';
        }
      });

      html += '</tbody></table>';
      document.getElementById('chiamate-container').innerHTML = html;
    })
    .catch(err => {
      console.error('Errore nel caricamento CSV:', err);
      document.getElementById('chiamate-container').innerHTML = '❌ Errore nel caricamento delle chiamate.';
    });
}
