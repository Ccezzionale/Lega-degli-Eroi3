
function caricaChiamate(conference) {
  const urls = {
    champ: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRK5ADcukTU83udU_Z9Zd9w66-2LGi8TlWJP_F5WfcaHQePIUpRBynnpbnxbkEGnrh44jMvvBo7Wzo3/pub?output=csv",
    league: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGbT5qMBn_PHnAyGfR1IayL3BgrfBYENXZ1tMoBXjvoZxQAFVI5wRk7kY0M9sAXuJg0wVImKh0g_bB/pub?gid=1279168385&single=true&output=csv"
  };

  const url = urls[conference];
  if (!url) return;

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.split('\n').map(r => r.split(','));
      const intestazioni = righe[0];
      const dati = righe.slice(1);

      let html = '<table><thead><tr>';
      for (let i = 0; i < intestazioni.length; i++) {
        html += `<th>${intestazioni[i]}</th>`;
      }
      html += '</tr></thead><tbody>';

      dati.forEach(riga => {
        if (riga.length >= 2 && riga[1].trim() !== '') {
          html += '<tr>';
          riga.forEach(val => html += `<td>${val}</td>`);
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
