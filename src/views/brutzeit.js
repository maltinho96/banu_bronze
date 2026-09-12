import { h, shuffle, pick, weightedSample } from '../lib/util.js';
import { load, save, recordResult, stats, weight } from '../lib/store.js';
import { CODES, CODE_MAP, CAT_LABEL, SCENARIOS, TRAPS } from '../data/brutzeit.js';

const MODES = [
  ['szenario', 'Szenario → Code'],
  ['kategorie', 'A, B oder C?'],
  ['fallen', 'Verwechslungen'],
  ['bedeutung', 'Code → Bedeutung'],
];

export function mount(root) {
  const st = { mode: load('bzMode', 'szenario') };
  let task = null, locked = false, right = 0, total = 0;

  const modes = h('div', { class: 'seg seg-scroll', role: 'radiogroup' });
  MODES.forEach(([v, label]) => modes.append(h('button', {
    type: 'button', role: 'radio', 'aria-checked': String(v === st.mode), 'data-v': v,
    onclick: () => {
      st.mode = v; save('bzMode', v);
      modes.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.v === v)));
      right = 0; total = 0; nextTask();
    },
  }, label)));

  const prompt = h('div', { class: 'bz-prompt', 'aria-live': 'polite' });
  const choices = h('div', { class: 'choices stack' });
  const after = h('div', { class: 'qafter' });
  const score = h('p', { class: 'score' });

  const ref = h('details', { class: 'panel ref' },
    h('summary', {}, 'Alle Brutzeitcodes nachschlagen'),
    ...['A', 'B', 'C'].map(k => h('div', {},
      h('h3', {}, CAT_LABEL[k]),
      h('dl', { class: 'codes' }, ...CODES.filter(c => c.k === k).flatMap(c => [
        h('dt', {}, c.c),
        h('dd', {}, c.t, h('span', { class: 'muted small' }, ' — ', c.n)),
      ])))));

  root.append(
    h('section', { class: 'panel' },
      h('p', { class: 'muted small' }, 'Brutzeitcodes nach Südbeck et al. – in der Prüfung wird ein beobachtetes Verhalten vorgelegt (Text, Bild oder Video) und der passende Code verlangt.'),
      modes),
    h('section', { class: 'card qcard' }, prompt, choices, after),
    score, ref);

  /* ---------- Aufgaben ---------- */
  const bucket = () => `bz-${st.mode}`;

  function pickWeighted(items, idFn) {
    const s = stats('bzStats');
    return weightedSample(items, 1, it => weight(s[`${bucket()}|${idFn(it)}`]))[0];
  }

  function nextTask() {
    locked = false;
    prompt.innerHTML = ''; choices.innerHTML = ''; after.innerHTML = '';
    if (st.mode === 'szenario') return taskScenario();
    if (st.mode === 'kategorie') return taskCategory();
    if (st.mode === 'fallen') return taskTrap();
    return taskMeaning();
  }

  function askCodes(correct, options, meta) {
    options.forEach(code => choices.append(h('button', {
      class: 'choice', type: 'button', onclick: e => answer(code, correct, e.currentTarget, meta),
    }, h('b', {}, code), ' ', h('span', { class: 'muted small' }, CODE_MAP[code].t))));
  }

  function taskScenario() {
    const sc = pickWeighted(SCENARIOS, s => s.c);
    task = sc;
    prompt.append(h('p', { class: 'qmeta' }, 'Welchen Brutzeitcode vergeben Sie?'),
      h('p', { class: 'bz-scene' }, sc.s));
    // Ablenker: bevorzugt Codes aus derselben und der benachbarten Kategorie
    const cat = CODE_MAP[sc.c].k;
    const near = shuffle(CODES.filter(c => c.c !== sc.c && c.k === cat)).slice(0, 2).map(c => c.c);
    const far = shuffle(CODES.filter(c => c.c !== sc.c && c.k !== cat)).slice(0, 1).map(c => c.c);
    askCodes(sc.c, shuffle([sc.c, ...near, ...far]), { id: sc.c, x: sc.x });
  }

  function taskCategory() {
    const sc = pick(SCENARIOS);
    task = sc;
    const cat = CODE_MAP[sc.c].k;
    prompt.append(h('p', { class: 'qmeta' }, 'Mögliches, wahrscheinliches oder sicheres Brüten?'),
      h('p', { class: 'bz-scene' }, sc.s));
    ['A', 'B', 'C'].forEach(k => choices.append(h('button', {
      class: 'choice', type: 'button', onclick: e => answer(k, cat, e.currentTarget, { id: `kat-${k}`, x: `${sc.c}: ${CODE_MAP[sc.c].t}. ${sc.x}` }),
    }, h('b', {}, k), ' ', h('span', { class: 'muted small' }, CAT_LABEL[k].split(' – ')[1]))));
  }

  function taskTrap() {
    const [a, b, question] = pick(TRAPS);
    // Szenario aus einem der beiden Codes ziehen
    const cands = SCENARIOS.filter(s => s.c === a || s.c === b);
    const sc = cands.length ? pick(cands) : pick(SCENARIOS);
    task = sc;
    prompt.append(h('p', { class: 'qmeta' }, question),
      h('p', { class: 'bz-scene' }, sc.s));
    askCodes(sc.c, shuffle([a, b]), { id: `${a}/${b}`, x: sc.x });
  }

  function taskMeaning() {
    const code = pickWeighted(CODES, c => c.c);
    task = code;
    prompt.append(h('p', { class: 'qmeta' }, 'Was bedeutet dieser Code?'), h('p', { class: 'bz-code' }, code.c));
    shuffle([code, ...shuffle(CODES.filter(c => c.c !== code.c)).slice(0, 3)]).forEach(c =>
      choices.append(h('button', {
        class: 'choice', type: 'button', onclick: e => answer(c.c, code.c, e.currentTarget, { id: code.c, x: code.n }),
      }, c.t)));
  }

  /* ---------- Auswertung ---------- */
  function answer(given, correct, btn, meta) {
    if (locked) return;
    locked = true;
    const ok = given === correct;
    total++; if (ok) right++;
    recordResult('bzStats', `${bucket()}|${meta.id}`, ok);
    choices.querySelectorAll('button').forEach(b => { b.disabled = true; });
    btn.classList.add(ok ? 'is-right' : 'is-wrong');
    if (!ok) {
      [...choices.children].forEach(b => {
        const label = b.querySelector('b')?.textContent || b.textContent;
        if (label === correct) b.classList.add('is-right');
      });
    }
    const c = CODE_MAP[correct];
    after.append(
      h('p', { class: `verdict ${ok ? 'ok' : 'no'}` }, ok ? 'Richtig' : 'Falsch'),
      c ? h('p', { class: 'def' }, h('b', {}, `${c.c} – `), c.t) : '',
      h('p', { class: 'def muted' }, meta.x || ''),
      h('button', { class: 'btn primary', type: 'button', onclick: nextTask }, 'Weiter'));
    score.textContent = `${right} von ${total} richtig`;
    after.querySelector('.btn').focus({ preventScroll: true });
  }

  nextTask();
}
