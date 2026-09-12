import { h, shuffle, pick, weightedSample } from '../lib/util.js';
import { load, save, recordResult, stats, weight } from '../lib/store.js';
import { DIAGRAMS, TERMS, termsFor } from '../data/topography.js';
import { examplesFor } from '../data/topo-examples.js';
import { renderDiagram } from '../lib/svg.js';
import { getBirdMedia, getCuratedPhoto } from '../lib/media.js';

const MODES = [
  ['erkunden', 'Erkunden'],
  ['zeigen', 'Wo ist …?'],
  ['benennen', 'Benennen'],
  ['foto', 'Am Foto'],
  ['liste', 'Begriffe'],
];

export function mount(root, ctx) {
  const lvl = ctx.level === 'b' ? 'b' : 's';
  const diagrams = DIAGRAMS.filter(d => !d.onlyLevel || d.onlyLevel === lvl);
  const st = { diagram: load('topoDiagram', 'koerper'), mode: load('topoMode', 'erkunden') };
  if (!diagrams.some(d => d.id === st.diagram)) st.diagram = diagrams[0].id;

  let queue = [], target = null, locked = false, right = 0, total = 0;
  let shownPhoto = null; // aktuell gezeigtes, selbst ausgewähltes Bild

  const tabs = h('div', { class: 'seg seg-scroll', role: 'tablist' });
  const modes = h('div', { class: 'seg seg-scroll', role: 'radiogroup' });
  const stage = h('div', { class: 'stage' });
  const photo = h('div', { class: 'media photo', hidden: true }, h('div', { class: 'ph' }, 'Lade Foto …'));
  const prompt = h('div', { class: 'prompt', 'aria-live': 'polite' });
  const choices = h('div', { class: 'choices' });
  const termList = h('div', { class: 'termlist', hidden: true });
  const score = h('p', { class: 'score' });
  const hint = h('p', { class: 'muted small' });

  root.append(
    h('section', { class: 'panel' }, hint, tabs, modes),
    photo, stage, prompt, choices, termList, score,
    h('p', { class: 'muted small credit' }, 'Schematische Zeichnungen, Begriffe nach BANU-Begleitmaterial „Morphologische Bezeichnungen“. Fotos von Wikipedia.'));

  const paint = (el, v, attr) => el.querySelectorAll('button').forEach(b => b.setAttribute(attr, String(b.dataset.v === v)));

  diagrams.forEach(d => tabs.append(h('button', {
    type: 'button', role: 'tab', 'aria-selected': String(d.id === st.diagram), 'data-v': d.id,
    onclick: () => { st.diagram = d.id; save('topoDiagram', d.id); paint(tabs, d.id, 'aria-selected'); draw(); },
  }, d.title)));
  MODES.forEach(([v, label]) => modes.append(h('button', {
    type: 'button', role: 'radio', 'aria-checked': String(v === st.mode), 'data-v': v,
    onclick: () => { st.mode = v; save('topoMode', v); paint(modes, v, 'aria-checked'); draw(); },
  }, label)));

  const diagram = () => diagrams.find(d => d.id === st.diagram);
  const svg = () => stage.querySelector('svg');
  const allTerms = () => [...new Set(diagrams.flatMap(d => termsFor(d, lvl)))];
  const diagramWith = term => diagrams.find(d => termsFor(d, lvl).includes(term)) || diagram();

  function highlight(term, cls = 'hl') {
    const s = svg(); if (!s) return;
    s.querySelectorAll(`.region.${cls}`).forEach(r => r.classList.remove(cls));
    if (term) s.querySelectorAll('.region').forEach(r => { if (r.dataset.term === term) r.classList.add(cls); });
  }
  const clearMarks = () => ['hl', 'ok', 'no'].forEach(c => highlight(null, c));

  function showDiagram(d) { stage.innerHTML = renderDiagram(d, lvl); stage.hidden = false; }

  function draw() {
    hint.textContent = lvl === 'b'
      ? 'Stufe Bronze: nur die Bronze-Begriffe sind antippbar.'
      : 'Stufe Silber/Gold: alle Begriffe inklusive Deckfedern, Kopfstreifen und Flügelzeichnung.';
    tabs.hidden = st.mode === 'foto';
    photo.hidden = true; termList.hidden = true; stage.hidden = false;
    prompt.innerHTML = ''; choices.innerHTML = '';
    right = 0; total = 0; score.textContent = '';
    stage.classList.toggle('explore', st.mode === 'erkunden');
    queue = shuffle(termsFor(diagram(), lvl));

    if (st.mode === 'liste') return showTermList();
    if (st.mode === 'foto') { stage.hidden = true; return photoTask(); }
    showDiagram(diagram());
    if (st.mode === 'erkunden') {
      prompt.append(h('p', { class: 'muted' }, `Tippe auf eine Stelle. ${queue.length} Begriffe in dieser Ansicht.`));
      return;
    }
    nextTask();
  }

  /* ---------- Zeigen / Benennen ---------- */
  function nextTask() {
    clearMarks(); choices.innerHTML = ''; locked = false;
    if (!queue.length) queue = shuffle(termsFor(diagram(), lvl));
    const s = stats('topoStats');
    target = weightedSample(queue, 1, t => weight(s[`${lvl}|${t}`]))[0];
    queue = queue.filter(t => t !== target);
    prompt.innerHTML = '';
    if (st.mode === 'zeigen') {
      prompt.append(h('p', { class: 'task' }, 'Tippe auf: ', h('b', {}, target)));
    } else {
      highlight(target);
      prompt.append(h('p', { class: 'task' }, 'Wie heißt die markierte Partie?'));
      const others = termsFor(diagram(), lvl).filter(t => t !== target);
      shuffle([target, ...shuffle(others).slice(0, 3)]).forEach(t =>
        choices.append(h('button', { type: 'button', class: 'choice', onclick: e => answerName(t, e.currentTarget) }, t)));
    }
  }

  function feedback(ok, extra, term = target) {
    total++; if (ok) right++;
    recordResult('topoStats', `${lvl}|${term}`, ok);
    score.textContent = `${right} von ${total} richtig`;
    prompt.append(
      h('p', { class: `verdict ${ok ? 'ok' : 'no'}` }, ok ? 'Richtig' : 'Falsch', extra ? ` – ${extra}` : ''),
      h('p', { class: 'def' }, h('b', {}, term), ': ', TERMS[term] || ''));
    const ex = examplesFor([term])[0];
    if (ex) prompt.append(h('p', { class: 'muted small' }, `Im Feld: ${ex.note}`));
    prompt.append(h('button', { type: 'button', class: 'btn primary', onclick: nextTask }, 'Weiter'));
    prompt.querySelector('.btn').focus({ preventScroll: true });
  }

  function answerName(t, btn) {
    if (locked) return; locked = true;
    choices.querySelectorAll('button').forEach(b => { b.disabled = true; if (b.textContent === target) b.classList.add('is-right'); });
    if (t !== target) btn.classList.add('is-wrong');
    highlight(target, 'ok');
    feedback(t === target, t !== target ? `du hast „${t}“ gewählt` : '');
  }

  stage.addEventListener('click', e => {
    const el = e.target.closest('[data-term]');
    if (!el) return;
    const term = el.dataset.term;
    if (st.mode === 'erkunden') {
      clearMarks(); highlight(term);
      prompt.innerHTML = '';
      prompt.append(h('p', { class: 'def' }, h('b', {}, term), ': ', TERMS[term] || ''));
      const ex = examplesFor([term])[0];
      if (ex) prompt.append(h('p', { class: 'muted small' }, `Im Feld: ${ex.note}`));
      return;
    }
    if (st.mode !== 'zeigen' || locked) return;
    locked = true;
    const ok = term === target;
    if (!ok) highlight(term, 'no');
    highlight(target, 'ok');
    feedback(ok, ok ? '' : `das war „${term}“`);
  });

  /* ---------- Am Foto ---------- */
  async function photoTask() {
    locked = false;
    prompt.innerHTML = ''; choices.innerHTML = '';
    stage.hidden = true; photo.hidden = false;
    photo.querySelector('img')?.remove();
    const ph = photo.querySelector('.ph');
    ph.hidden = false; ph.textContent = 'Lade Foto …';

    const pool = examplesFor(allTerms());
    if (!pool.length) { prompt.append(h('p', { class: 'muted' }, 'Für diese Stufe gibt es noch keine Foto-Beispiele.')); return; }
    const s = stats('topoStats');
    const ex = weightedSample(pool, 1, e => weight(s[`${lvl}|${e.term}`]))[0] || pick(pool);
    target = ex.term;

    prompt.append(h('p', { class: 'task' }, 'Welche Partie ist bei diesem Vogel besonders auffällig?'));
    const others = allTerms().filter(t => t !== ex.term);
    shuffle([ex.term, ...shuffle(others).slice(0, 3)]).forEach(t =>
      choices.append(h('button', { type: 'button', class: 'choice', onclick: e => answerPhoto(t, e.currentTarget, ex) }, t)));

    const curated = getCuratedPhoto(`topo:${ex.term}`);
    shownPhoto = curated;
    const m = curated ? { thumb: curated.thumb } : await getBirdMedia({ de: ex.wp, sci: ex.wp });
    if (target !== ex.term) return;
    if (m.thumb) {
      const im = h('img', { alt: '', src: m.thumb });
      im.onload = () => { ph.hidden = true; };
      im.onerror = () => { im.remove(); ph.hidden = false; ph.textContent = 'Kein Foto verfügbar – trotzdem raten.'; };
      photo.prepend(im);
    } else { ph.textContent = 'Kein Foto verfügbar – trotzdem raten.'; }
  }

  function answerPhoto(t, btn, ex) {
    if (locked) return; locked = true;
    choices.querySelectorAll('button').forEach(b => { b.disabled = true; if (b.textContent === ex.term) b.classList.add('is-right'); });
    if (t !== ex.term) btn.classList.add('is-wrong');
    const ok = t === ex.term;
    total++; if (ok) right++;
    recordResult('topoStats', `${lvl}|${ex.term}`, ok);
    score.textContent = `${right} von ${total} richtig`;
    showDiagram(diagramWith(ex.term));
    highlight(ex.term, 'ok');
    // Bei selbst gewählten Bildern kann eine andere Art zu sehen sein
    const shownSp = shownPhoto?.sp || ex.wp;
    const sameSp = shownSp === ex.wp;
    prompt.innerHTML = '';
    prompt.append(
      h('p', { class: `verdict ${ok ? 'ok' : 'no'}` }, ok ? 'Richtig' : 'Falsch'),
      h('h2', { class: 'rname' }, shownSp),
      h('p', { class: 'def' }, h('b', {}, ex.term), ': ', TERMS[ex.term] || ''),
      sameSp ? h('p', { class: 'def muted' }, ex.note) : '',
      shownPhoto && (shownPhoto.by || shownPhoto.lic)
        ? h('p', { class: 'muted small' }, 'Foto: ', [shownPhoto.by, shownPhoto.lic].filter(Boolean).join(' · ')) : '',
      h('div', { class: 'links' },
        h('a', { href: shownPhoto?.link || `https://de.wikipedia.org/wiki/${encodeURIComponent(shownSp)}`, target: '_blank', rel: 'noopener' }, 'Bildquelle'),
        h('a', { href: '#/bilder' }, 'Bilder verwalten')),
      h('button', { type: 'button', class: 'btn primary', onclick: photoTask }, 'Weiter'));
  }

  /* ---------- Begriffsübersicht ---------- */
  function showTermList() {
    showDiagram(diagram());
    termList.hidden = false; termList.innerHTML = '';
    const s = stats('topoStats');
    const terms = termsFor(diagram(), lvl).sort((a, b) => a.localeCompare(b, 'de'));
    const done = terms.filter(t => s[`${lvl}|${t}`]).length;
    prompt.innerHTML = '';
    prompt.append(h('p', { class: 'muted' }, `${terms.length} Begriffe, davon ${done} schon geübt. Tippen zeigt die Stelle in der Zeichnung.`));
    terms.forEach(t => {
      const e = s[`${lvl}|${t}`];
      const n = e ? e.r + e.w : 0;
      const pct = n ? Math.round(e.r / n * 100) : null;
      termList.append(h('button', {
        type: 'button', class: 'termrow', 'data-t': t, 'aria-pressed': 'false',
        onclick: () => {
          clearMarks(); highlight(t);
          termList.querySelectorAll('.termrow').forEach(r => r.setAttribute('aria-pressed', String(r.dataset.t === t)));
          prompt.innerHTML = '';
          prompt.append(h('p', { class: 'def' }, h('b', {}, t), ': ', TERMS[t] || ''));
          const ex = examplesFor([t])[0];
          if (ex) prompt.append(h('p', { class: 'muted small' }, `Im Feld: ${ex.note}`));
          stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
      },
        h('span', {}, t),
        pct == null ? h('span', { class: 'acc none' }, 'neu') : h('span', { class: `acc ${pct >= 80 ? 'good' : pct >= 50 ? 'mid' : 'bad'}` }, `${pct} %`)));
    });
  }

  draw();
}
