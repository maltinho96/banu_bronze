/* Wandelt Zeilen einer Artenliste (xlsx → Array von Arrays) in Artobjekte um.
 * Wird im Browser (Import unter „Mehr“) und im Node-Skript verwendet. */

const norm = s => String(s ?? '').toLowerCase().replace(/ß/g, 'ss')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');

function pickCol(headers, keys) {
  const H = headers.map(norm);
  for (const key of keys) { const i = H.findIndex(x => x.includes(norm(key))); if (i >= 0) return i; }
  return -1;
}

export function mapHabText(t) {
  // Reihenfolge wie im Text beibehalten (erster Eintrag = Hauptlebensraum)
  const s = norm(t);
  const keys = [
    ['kueste', ['kuste']], ['gewaesser', ['gewasser', 'feucht']], ['wald', ['wald', 'heide']],
    ['agrar', ['agrar', 'acker', 'feld']], ['siedlung', ['siedlung']], ['alpin', ['alpin', 'hochlage']],
  ];
  return keys
    .map(([k, words]) => [k, Math.min(...words.map(w => (s.indexOf(w) + 1 || Infinity)))])
    .filter(([, pos]) => pos !== Infinity)
    .sort((a, b) => a[1] - b[1])
    .map(([k]) => k);
}

/** rows: Array<Array<any>>; optional level: 'bronze' filtert eine Stufenspalte, falls vorhanden */
export function parseRows(rows, level = 'bronze') {
  let hi = rows.findIndex(r => (r || []).some(c => {
    const n = norm(c);
    return n.includes('wissenschaftlich') || n.includes('deutschername') || n.includes('deutschebezeichnung') || n === 'deutsch' || n === 'artname';
  }));
  if (hi < 0) hi = 0;
  const headers = (rows[hi] || []).map(c => String(c ?? ''));
  const ci = {
    de: pickCol(headers, ['deutschername', 'deutschebezeichnung', 'deutsch', 'dtname', 'artname']),
    sci: pickCol(headers, ['wissenschaftlichername', 'wissenschaftlich', 'wissname', 'latname', 'lateinisch']),
    fam: pickCol(headers, ['familie']),
    ord: pickCol(headers, ['ordnung']),
    hab: pickCol(headers, ['lebensraum', 'haupteinheit', 'habitat']),
    syn: pickCol(headers, ['synonym']),
    lvl: pickCol(headers, [level, 'niveau', 'stufe']),
  };
  if (ci.de < 0 && ci.sci < 0) throw new Error('Keine Namensspalte erkannt (deutscher/wissenschaftlicher Name).');

  const list = [];
  for (let i = hi + 1; i < rows.length; i++) {
    const r = rows[i]; if (!r || !r.length) continue;
    const cell = k => (ci[k] >= 0 ? String(r[ci[k]] ?? '').trim() : '');
    const sci = cell('sci').replace(/\s+/g, ' ');
    const de = cell('de');
    if (!sci || !/^[A-Z][a-z]+ [a-z-]+/.test(sci)) continue; // Zwischenüberschriften überspringen
    // Stufenspalte (z. B. „Bronze“ mit x): nur markierte Zeilen übernehmen
    if (ci.lvl >= 0 && norm(headers[ci.lvl]).includes(norm(level))) {
      const v = norm(r[ci.lvl]);
      if (!v || v === 'nein' || v === '0') continue;
    }
    list.push({
      de: de || sci, sci: sci.split(' ').slice(0, 2).join(' '),
      fam: cell('fam'), ord: cell('ord'),
      hab: ci.hab >= 0 ? mapHabText(r[ci.hab]) : [],
      syn: cell('syn').split(/[;,/]/).map(x => x.trim()).filter(Boolean),
    });
  }
  if (!list.length) throw new Error('Keine Arten gefunden.');
  return list;
}

/** Wählt im Workbook das passende Blatt (bevorzugt „Bronze“ bzw. „Artenliste“) */
export function pickSheet(names, level = 'bronze') {
  return names.find(n => norm(n).includes(norm(level))) ||
    names.find(n => norm(n).includes('artenliste')) || names[0];
}
