
const chiamateCSV = {
  league15: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzoMOkxFPR54NEbGhx_uZ7vTAYdcYv7uH8VJ9v8i1uV3hJth-82pmIEOenFpsJpA/pub?gid=492764886&single=true&output=csv",
  league16: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkZyBpgHLlY5-uBy_vI5G7iJdCVpm3ik_-PMok8nT7HVr9L2hxFlVfWxNCO3_LzA/pub?gid=0&single=true&output=csv",
  champ15: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ71C45uRCpp_cDOmFfZUKguTldYYnp1tVRSfB8o3eI8VWzEoz4BuYXmTzM9tkB-A/pub?gid=1279168385&single=true&output=csv",
  champ16: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQKxJzjcn7G2HiMnKtnc2MLG3MVY-YKnOvGlGyfBdsDbkXRHL1vV2d0rMrAn3-zg/pub?gid=0&single=true&output=csv"
};

function caricaChiamate(conference) {
  const container = document.getElementById("chiamate-container");
  container.innerHTML = "<p>⏳ Caricamento in corso...</p>";
  const url = chiamateCSV[conference];
  if (!url) return;

  fetch(url)
    .then(response => response.text())
    .then(csv => {
      const righe = csv.split("\n").map(r => r.split(","));
      const intestazioni = righe[0];
      const dati = righe.slice(1);

      if (dati.length === 1 && dati[0][0].startsWith("🔒")) {
        container.innerHTML = '<div class="avviso">' + dati[0][0] + '</div>';
        return;
      }

      let html = '<table><thead><tr>';
      intestazioni.forEach(t => html += '<th>' + t + '</th>');
      html += '</tr></thead><tbody>';
      dati.forEach(r => {
        if (r.length > 1 && r[1].trim() !== '') {
          html += '<tr>' + r.map(v => '<td>' + v + '</td>').join('') + '</tr>';
        }
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    })
    .catch(err => {
      container.innerHTML = '<p style="color:red;">❌ Errore nel caricamento.</p>';
      console.error(err);
    });
}
