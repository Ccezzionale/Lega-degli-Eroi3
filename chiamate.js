const MODULI = {
  Conference: {
    '15:00': 'https://docs.google.com/forms/d/e/1FAIpQLScmKzGZDqQYgiyZ_-conference-15/viewform',
    '16:00': 'https://docs.google.com/forms/d/e/1FAIpQLScmKzGZDqQYgiyZ_-conference-16/viewform'
  },
  Championship: {
    '15:00': 'https://docs.google.com/forms/d/e/1FAIpQLScmKzGZDqQYgiyZ_-championship-15/viewform',
    '16:00': 'https://docs.google.com/forms/d/e/1FAIpQLScmKzGZDqQYgiyZ_-championship-16/viewform'
  }
};

function caricaChiamate(conf) {
  document.getElementById("titolo-chiamate").textContent = `Chiamate ${conf}`.toUpperCase();
  const container = document.getElementById("moduli-container");
  container.innerHTML = "";

  const oggi = new Date();
  const giorno = oggi.getDay(); // 5 = Venerdì
  const ora = oggi.getHours();
  const minuti = oggi.getMinutes();
  const mostra = (giorno === 5 && (ora > 15 || (ora === 15 && minuti >= 0))) || giorno === 6 || giorno === 0;

  if (!mostra) {
    document.getElementById("avviso-chiamate").style.display = "block";
    return;
  }
  document.getElementById("avviso-chiamate").style.display = "none";

  const moduli = MODULI[conf];
  for (const orario in moduli) {
    const a = document.createElement("a");
    a.href = moduli[orario];
    a.target = "_blank";
    a.innerHTML = `✚ Compila chiamata ${orario} (${conf})`;
    container.appendChild(a);
  }
} 

window.onload = () => caricaChiamate("Conference");
