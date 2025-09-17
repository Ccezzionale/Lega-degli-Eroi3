/********** CONFIG **********/
const DEFAULT_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRhEJKfZhVb7V08KI29T_aPTR0hfx7ayIOlFjQn_v-fqgktImjXFg-QAEA6z7w5eyEh2B3w5KLpaRYz/pub?gid=595956835&single=true&output=csv";

/* Loghi (opzionale): mappa nome -> url. Se non trovato, prova images/loghi/<slug>.png, poi placeholder. */
const TEAM_LOGOS = {
  // "Team Bartowski": "images/loghi/team-bartowski.png",
};

function slug(s){
  return String(s||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // via accenti
    .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

function logoFor(team){
  return TEAM_LOGOS[team] || `img/${slug(team)}.png`;
}

function logoTag(team, size=22){
  const src = logoFor(team);
  return `<img class="mini-logo" src="${src}" alt="${team}"
           onerror="if(!this.dataset.jpg){ this.dataset.jpg=1; this.src=this.src.replace(/\\.png$/i,'.jpg'); }
                    else { this.onerror=null; this.src='img/_placeholder.png'; }"
           style="width:${size}px;height:${size}px">`;
}
function nameWithLogo(team){
  return `<span class="inline-name">${logoTag(team)}<span>${team}</span></span>`;
}


/********** UTILS **********/
function parseNumber(s){
  if (s==null) return NaN;
  if (typeof s !== 'string') return Number(s);
  const t = s.replace(',', '.').trim();
  const v = parseFloat(t);
  return isNaN(v) ? NaN : v;
}
async function fetchCSV(url){
  const res = await fetch(url, { cache: 'no-store' });
  if(!res.ok) throw new Error(`Errore fetch CSV (${res.status})`);
  const text = await res.text();
  return parseCSV(text);
}
// CSV robusto
function parseCSV(text){
  const rows = []; let field="", row=[], inQ=false;
  for (let i=0;i<text.length;i++){
    const c=text[i];
    if(c==='"'){ if(inQ && text[i+1]==='"'){ field+='"'; i++; } else inQ=!inQ; }
    else if(c===',' && !inQ){ row.push(field); field=""; }
    else if((c==='\n'||c==='\r') && !inQ){ if(c==='\r' && text[i+1]==='\n') i++; row.push(field); rows.push(row); field=""; row=[]; }
    else field+=c;
  }
  if(field.length||row.length){ row.push(field); rows.push(row); }
  const head = rows.shift().map(s=>s.trim());
  const objs = rows.filter(r=>r.length && r.some(x=>x!=="")).map(r=>{
    const o={}; for(let k=0;k<head.length;k++) o[head[k]]=(r[k]??'').trim();
    o.GW=+o.GW||null; o.PointsFor=parseNumber(o.PointsFor); o.PointsAgainst=parseNumber(o.PointsAgainst);
    return o;
  });
  return { head, rows: objs };
}
function groupBy(arr, key){ const m=new Map(); for(const it of arr){ const k=it[key]; if(!m.has(k)) m.set(k,[]); m.get(k).push(it);} return m; }
function lastN(a,n){ return a.slice(Math.max(0,a.length-n)); }
function mean(ns){ const v=ns.filter(Number.isFinite); return v.length? v.reduce((a,b)=>a+b,0)/v.length : 0; }
function stdDev(ns){ const v=ns.filter(Number.isFinite); if(v.length<=1) return 0; const m=mean(v); return Math.sqrt(mean(v.map(x=>(x-m)*(x-m)))); }
function normalize(vals){
  const f=vals.filter(Number.isFinite); if(!f.length) return vals.map(_=>0);
  const min=Math.min(...f), max=Math.max(...f); if(max===min) return vals.map(v=>Number.isFinite(v)?50:0);
  return vals.map(v=>Number.isFinite(v)? ((v-min)/(max-min))*100 : 0);
}

/********** DATA PREP **********/
function sanitizeRows(rows, phaseFilter){
  const filtered = rows.filter(r => !phaseFilter || r.Phase === phaseFilter)
    .map(r => {
      const GW = +r.GW || null;
      const Team = (r.Team || '').trim();
      const Opponent = (r.Opponent || '').trim();
      const PF = parseNumber(r.PointsFor);
      const PA = parseNumber(r.PointsAgainst);
      let Result = (r.Result || '').trim();
      if (!Result && Number.isFinite(PF) && Number.isFinite(PA)) {
        Result = PF>PA ? 'W' : PF<PA ? 'L' : 'D';
      }
      return { GW, Team, Opponent, Result, PointsFor: PF, PointsAgainst: PA };
    })
    .filter(r =>
      r.GW &&
      Number.isFinite(r.PointsFor) &&
      Number.isFinite(r.PointsAgainst) &&
      !(r.PointsFor===0 && r.PointsAgainst===0)
    );

  // dedupe Team×GW
  const seen = new Set(), out=[];
  for(const r of filtered){
    const key = r.Team + '|' + r.GW;
    if(!seen.has(key)){ seen.add(key); out.push(r); }
  }
  return out;
}

/********** POWER RANKING **********/
function computePower(clean){
  const byTeam = groupBy(clean, 'Team');
  const teams = Array.from(byTeam.keys()).filter(Boolean);
  const maxGW = Math.max(...clean.map(r => r.GW||0));
  const prevGW = Number.isFinite(maxGW) ? maxGW - 1 : null;

  const w = (maxGW < 5) ? { forma:0.2, media:0.7, cons:0.1 } : { forma:0.5, media:0.3, cons:0.2 };

  function scoreAt(upToGW){
    const items=[];
    for(const team of teams){
      const series = byTeam.get(team).filter(r=>r.GW && r.GW<=upToGW).sort((a,b)=>a.GW-b.GW);
      const pts = series.map(s=>s.PointsFor);
      const last5 = lastN(pts,5);
      items.push({ team, media:mean(pts), forma:mean(last5), cons:1/(1+stdDev(last5)) });
    }
    const nF=normalize(items.map(x=>x.forma)), nM=normalize(items.map(x=>x.media)), nC=normalize(items.map(x=>x.cons));
    return items.map((x,i)=>({ team:x.team, forma:nF[i], media:nM[i], cons:nC[i], score:w.forma*nF[i]+w.media*nM[i]+w.cons*nC[i] }))
                .sort((a,b)=>b.score-a.score);
  }

  const now=scoreAt(maxGW), prev=prevGW>=1?scoreAt(prevGW):[];
  const prevPos=new Map(); prev.forEach((it,idx)=>prevPos.set(it.team,idx+1));
  const ranked = now.map((it,idx)=>({ rank:idx+1, team:it.team, score:it.score, forma:it.forma, media:it.media, cons:it.cons, delta:(prevPos.get(it.team)||idx+1)-(idx+1) }));
  return { ranked, maxGW };
}

// in statistiche.js
function renderPR(res){
  const tbody = document.getElementById('tbody-pr');
  const rows = res.ranked.map(r=>{
    const arrow = r.delta>0 ? '▲' : (r.delta<0 ? '▼' : '•');
    const cls   = r.delta>0 ? 'trend up' : (r.delta<0 ? 'trend down' : '');
    return `<tr class="riga-classifica">
      <td class="mono"><strong>${r.rank}</strong></td>
      <td>
        <div class="logo-nome">
          <img src="${logoFor(r.team)}" alt="${r.team}"
               onerror="this.onerror=null; this.src='img/_placeholder.png'">
          <span>${r.team}</span>
        </div>
      </td>
      <td class="mono">${r.score.toFixed(1)}</td>
      <td class="${cls}">${arrow} ${r.delta===0 ? '' : Math.abs(r.delta)}</td>
      <td class="mono">${r.media.toFixed(0)}</td>
      <td class="mono">${r.forma.toFixed(0)}</td>
      <td class="mono">${r.cons.toFixed(0)}</td>
    </tr>`;
  }).join('');
  tbody.innerHTML = rows;
  document.getElementById('meta').textContent = `Ultima giornata inclusa: GW ${res.maxGW}`;
}


/********** HALL OF SHAME / CURIOSITA' **********/
function median(a){ const v=a.filter(Number.isFinite).slice().sort((x,y)=>x-y); const n=v.length; return n? (n%2?v[(n-1)/2]:(v[n/2-1]+v[n/2])/2):0; }

function computeHall(clean){
  const worst = clean.slice().sort((a,b)=>a.PointsFor-b.PointsFor).slice(0,10);
  const lowWins = clean.filter(r=>r.Result==='W').slice().sort((a,b)=>a.PointsFor-b.PointsFor).slice(0,10);
  const highLoss = clean.filter(r=>r.Result==='L').slice().sort((a,b)=>b.PointsFor-a.PointsFor).slice(0,10);

  const winners = clean.filter(r=>r.PointsFor>r.PointsAgainst)
    .map(r=>({...r, margin:r.PointsFor-r.PointsAgainst, total:r.PointsFor+r.PointsAgainst}));
  const blowouts = winners.slice().sort((a,b)=>b.margin-a.margin).slice(0,5);
  const closest  = winners.slice().sort((a,b)=>a.margin-b.margin).slice(0,5);

  return { worst, lowWins, highLoss, blowouts, closest };
}

function renderTable(containerId, title, rows, cols){
  const el=document.getElementById(containerId); if(!el) return;
  const thead=`<thead><tr>${cols.map(c=>`<th>${c.label}</th>`).join('')}</tr></thead>`;
  const tbody=`<tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${c.format?c.format(r[c.key],r):r[c.key]}</td>`).join('')}</tr>`).join('')}</tbody>`;
  el.innerHTML = `<div class="badge">${title}</div><table class="subtable">${thead}${tbody}</table>`;
}

function renderHall(h){
  renderTable('shame-worst','Peggiori punteggi',
    h.worst.map(r=>({gw:r.GW, team:r.Team, pf:r.PointsFor, opp:r.Opponent, pa:r.PointsAgainst})),
    [
      {key:'gw',   label:'GW'},
      {key:'team', label:'Team', format:v=>nameWithLogo(v)},
      {key:'pf',   label:'PF',   format:v=>v.toFixed(1)},
      {key:'opp',  label:'vs',   format:v=>nameWithLogo(v)},
      {key:'pa',   label:'PA',   format:v=>v.toFixed(1)}
    ]
  );

  renderTable('shame-lowwins','Vittorie col punteggio più basso',
    h.lowWins.map(r=>({gw:r.GW, team:r.Team, pf:r.PointsFor, opp:r.Opponent, pa:r.PointsAgainst})),
    [
      {key:'gw',   label:'GW'},
      {key:'team', label:'Team', format:v=>nameWithLogo(v)},
      {key:'pf',   label:'PF',   format:v=>v.toFixed(1)},
      {key:'opp',  label:'vs',   format:v=>nameWithLogo(v)},
      {key:'pa',   label:'PA',   format:v=>v.toFixed(1)}
    ]
  );

  renderTable('shame-highloss','Sconfitte col punteggio più alto',
    h.highLoss.map(r=>({gw:r.GW, team:r.Team, pf:r.PointsFor, opp:r.Opponent, pa:r.PointsAgainst})),
    [
      {key:'gw',   label:'GW'},
      {key:'team', label:'Team', format:v=>nameWithLogo(v)},
      {key:'pf',   label:'PF',   format:v=>v.toFixed(1)},
      {key:'opp',  label:'vs',   format:v=>nameWithLogo(v)},
      {key:'pa',   label:'PA',   format:v=>v.toFixed(1)}
    ]
  );
}


/********** SCULATI / SFIGATI **********/
function computeLuck(clean){
  // mediana per GW su tutta la lega
  const byGW=groupBy(clean,'GW'); const med=new Map();
  for(const [gw,rows] of byGW.entries()) med.set(+gw, median(rows.map(r=>r.PointsFor)));

  // inizializza tutti i team
  const allTeams=Array.from(new Set(clean.map(r=>r.Team)));
  const tally=new Map(allTeams.map(t=>[t,{team:t,sculati:0,sfigati:0,netto:0}]));

  for(const r of clean){
    const m=med.get(r.GW)??0;
    const sc=(r.Result==='W' && r.PointsFor<m)?1:0; // vinci sotto mediana
    const sf=(r.Result==='L' && r.PointsFor>m)?1:0; // perdi sopra mediana
    if(!sc && !sf) continue;
    const rec=tally.get(r.Team); rec.sculati+=sc; rec.sfigati+=sf; rec.netto=rec.sculati-rec.sfigati;
  }
  const table=Array.from(tally.values()).sort((a,b)=>(b.netto-a.netto)||(b.sculati-a.sculati)||a.team.localeCompare(b.team));
  return { table };
}
function renderLuckBox(l){
  renderTable('luck-most','Sculati / Sfigati (cumulato)',
    l.table,
    [
      {key:'team',    label:'Team',    format:v=>nameWithLogo(v)},
      {key:'sculati', label:'Sculati'},
      {key:'sfigati', label:'Sfigati'},
      {key:'netto',   label:'Netto'}
    ]
  );
}


/********** CURIOSITÀ (blowout & partita più tirata) **********/
function renderFunFacts(h){
  renderTable('fun-facts','Curiosità (blowout & partita più tirata)',
    [
      ...h.blowouts.map(r=>({type:'Blowout', gw:r.GW, team:r.Team, pf:r.PointsFor, opp:r.Opponent, pa:r.PointsAgainst, m:(r.PointsFor-r.PointsAgainst)})),
      ...h.closest.map (r=>({type:'Più tirata', gw:r.GW, team:r.Team, pf:r.PointsFor, opp:r.Opponent, pa:r.PointsAgainst, m:(r.PointsFor-r.PointsAgainst)}))
    ],
    [
      {key:'type', label:'Tipo'},
      {key:'gw',   label:'GW'},
      {key:'team', label:'Team', format:v=>nameWithLogo(v)},
      {key:'pf',   label:'PF',   format:v=>v.toFixed(1)},
      {key:'opp',  label:'vs',   format:v=>nameWithLogo(v)},
      {key:'pa',   label:'PA',   format:v=>v.toFixed(1)},
      {key:'m',    label:'Margine', format:v=>v.toFixed(1)}
    ]
  );
}


/********** BOOT **********/
(function(){
  const urlEl=document.getElementById('csvUrl');
  const phaseEl=document.getElementById('phase');
  const btn=document.getElementById('loadBtn');
  const key='PR_CSV_URL';
  urlEl.value = localStorage.getItem(key) || DEFAULT_CSV_URL;

  async function load(){
    const url=urlEl.value.trim(); if(!url) return alert('Inserisci URL CSV pubblicato (tab "Risultati PR – Tutte").');
    localStorage.setItem(key,url);
    const data=await fetchCSV(url);
    const clean= sanitizeRows(data.rows, phaseEl.value);

    // diagnostica
    const teams = Array.from(new Set(clean.map(r=>r.Team))).sort();
    document.getElementById('diag').textContent = `Squadre lette: ${teams.length} — ${teams.join(', ')}`;

    // power ranking
    const pr = computePower(clean);
    renderPR(pr);

    // extra
    const hall = computeHall(clean);
    renderHall(hall);
    renderFunFacts(hall); // <-- ora visibile

    const luck = computeLuck(clean);
    renderLuckBox(luck);
  }

  btn.addEventListener('click', load);
  if (urlEl.value) load();
})();
