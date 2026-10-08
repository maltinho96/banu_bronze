import { h, shuffle, weightedSample } from '../lib/util.js';
import { load, save, recordResult, stats, weight } from '../lib/store.js';
import { STATIC, CATS, BZC, RL, generateQuestions } from '../data/questions.js';
import { getSpeciesList } from '../data/species.js';

const LEVEL_NAME = { b: 'Bronze', s: 'Silber', g: 'Gold' };

export function mount(root, ctx) {
  const level = ctx.level;
  const cfg = { cats: Object.keys(CATS), n: 10, weak: false, ...load('fragenCfg', {}) };
  let session = [], i = 0, right = 0;

  const pool = () => {
    const all = [...STATIC, ...generateQuestions(getSpeciesList().species)];
    return all.filter(q => q.lv.includes(level) && cfg.cats.includes(q.cat));
  };

  /* ---------- Steuerung ---------- */
  const catBox = h('div', { class: 'chips toggle' });
  Object.entries(CATS).forEach(([k, label]) => {
    const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': String(cfg.cats.includes(k)), onclick: () => {
      cfg.cats = cfg.cats.includes(k) ? cfg.cats.filter(c => c !== k) : [...cfg.cats, k];
      if (!cfg.cats.length) cfg.cats = [k];
      save('fragenCfg', cfg); paintCats(); info();
    } }, label);
    b.dataset.k = k;
    catBox.append(b);
  });
  const paintCats = () => catBox.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(cfg.cats.includes(b.dataset.k))));
  const nSel = h('select', { 'aria-label': 'Anzahl', onchange: e => { cfg.n = +e.target.value; save('fragenCfg', cfg); } },
    ...[10, 20, 40, 999].map(n => h('option', { value: n }, n === 999 ? 'Alle' : `${n} Fragen`)));
  nSel.value = cfg.n;
  const weakBox = h('input', { type: 'checkbox', id: 'qweak', onchange: e => { cfg.weak = e.target.checked; save('fragenCfg', cfg); } });
  weakBox.checked = cfg.weak;
  const poolInfo = h('p', { class: 'muted small' });
  const info = () => { poolInfo.textContent = `${pool().length} Fragen für Stufe ${LEVEL_NAME[level]} in der Auswahl.`; };

  const controls = h('section', { class: 'panel controls' },
    h('div', { class: 'ctrl' }, h('span', { class: 'lbl' }, 'Themen'), catBox),
    h('div', { class: 'ctrl row' }, nSel, h('label', { class: 'check', for: 'qweak' }, weakBox, 'Falsch beantwortete bevorzugen')),
    poolInfo,
    h('a', { class: 'syslink', href: '#/systematik' }, 'Familien und Ordnungen gezielt üben: Systematik'),
    h('button', { class: 'btn primary wide', onclick: start }, 'Fragen starten'));
  info();

  const card = h('section', { class: 'card qcard', hidden: true });
  const ref = h('details', { class: 'panel ref' },
    h('summary', {}, 'Nachschlagen: Brutzeitcodes & Rote Liste'),
    h('h3', {}, 'Brutzeitcodes'),
    h('p', { class: 'muted small' }, 'A = mögliches, B = wahrscheinliches, C = sicheres Brüten.'),
    h('dl', { class: 'codes' }, ...BZC.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
    h('h3', {}, 'Rote Liste – Kategorien'),
    h('dl', { class: 'codes' }, ...RL.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])));

  root.append(controls, card, ref);

  function start() {
    const p = pool();
    const st = stats('qStats');
    const n = Math.min(cfg.n, p.length);
    // Katalogfragen und generierte Fragen etwa halb/halb mischen,
    // damit die vielen Familien-/Lebensraumfragen nicht alles überdecken
    const sample = (arr, k) => cfg.weak ? weightedSample(arr, k, q => weight(st[q.id])) : shuffle(arr.slice()).slice(0, k);
    const stat = p.filter(q => !q.generated), gen = p.filter(q => q.generated);
    const nStat = Math.min(stat.length, Math.max(Math.ceil(n / 2), n - gen.length));
    session = shuffle([...sample(stat, nStat), ...sample(gen, n - nStat)]);
    i = 0; right = 0;
    card.hidden = false;
    show();
    card.scrollIntoView({ behavior: 'smooth' });
  }

  /* Antwortreihenfolge bei jeder Anzeige neu mischen – in den Daten steht die
   * richtige Antwort oft an erster Stelle. „ok“ wird passend umgerechnet. */
  function shuffled(q) {
    if (!q.opts) return q;
    const order = shuffle(q.opts.map((_, k) => k));
    return { ...q, opts: order.map(k => q.opts[k]), ok: q.ok.map(k => order.indexOf(k)) };
  }

  function show() {
    card.innerHTML = '';
    if (i >= session.length) return end();
    const q = shuffled(session[i]);
    const head = h('p', { class: 'qmeta' }, `${i + 1} / ${session.length} · ${CATS[q.cat]}`);
    const qtext = h('h2', { class: 'qtext' }, q.q);
    const hint = q.type === 'multi' ? h('p', { class: 'muted small' }, 'Mehrere Antworten können richtig sein.') : null;
    const body = h('div', { class: 'qbody' });
    const after = h('div', { class: 'qafter' });
    card.append(head, qtext, hint || '', body, after);

    const explain = ok => {
      recordResult('qStats', q.id, ok); if (ok) right++;
      after.append(
        ok == null ? '' : h('p', { class: `verdict ${ok ? 'ok' : 'no'}` }, ok ? 'Richtig' : 'Falsch'),
        h('p', { class: 'def' }, q.a),
        h('button', { class: 'btn primary', type: 'button', onclick: () => { i++; show(); } }, 'Weiter'));
      after.querySelector('.btn')?.focus({ preventScroll: true });
    };

    if (q.type === 'open') {
      const ta = h('textarea', { rows: 3, placeholder: 'Eigene Antwort (optional) …' });
      const showBtn = h('button', { class: 'btn', type: 'button', onclick: () => {
        showBtn.remove(); ta.disabled = true;
        after.append(h('p', { class: 'def' }, h('b', {}, 'Musterantwort: '), q.a),
          h('div', { class: 'grade' },
            h('button', { class: 'btn ghost', type: 'button', onclick: () => grade(false) }, 'Nicht gewusst'),
            h('button', { class: 'btn primary', type: 'button', onclick: () => grade(true) }, 'Gewusst')));
      } }, 'Antwort zeigen');
      const grade = ok => { recordResult('qStats', q.id, ok); if (ok) right++; i++; show(); };
      body.append(ta, showBtn);
      return;
    }

    const picked = new Set();
    const btns = q.opts.map((o, k) => h('button', { type: 'button', class: 'choice', onclick: () => {
      if (q.type === 'single') { picked.add(k); check(); }
      else { picked.has(k) ? picked.delete(k) : picked.add(k); btns[k].setAttribute('aria-pressed', String(picked.has(k))); }
    } }, o));
    body.append(h('div', { class: 'choices stack' }, ...btns));
    if (q.type === 'multi') {
      const checkBtn = h('button', { class: 'btn', type: 'button', onclick: () => { checkBtn.remove(); check(); } }, 'Prüfen');
      body.append(checkBtn);
    }
    function check() {
      const okSet = new Set(q.ok);
      btns.forEach((b, k) => {
        b.disabled = true;
        if (okSet.has(k)) b.classList.add('is-right');
        else if (picked.has(k)) b.classList.add('is-wrong');
      });
      const ok = picked.size === okSet.size && [...picked].every(k => okSet.has(k));
      explain(ok);
    }
  }

  function end() {
    const pct = session.length ? Math.round(right / session.length * 100) : 0;
    card.append(
      h('p', { class: 'big' }, `${right} / ${session.length}`),
      h('p', { class: `verdict ${pct >= 80 ? 'ok' : 'no'}` }, `${pct} %`),
      h('button', { class: 'btn primary wide', type: 'button', onclick: start }, 'Neue Runde'));
  }
}
