import { h, shuffle, weightedSample } from '../lib/util.js';
import { load, save, recordResult, stats, weight } from '../lib/store.js';
import { getSpeciesList } from '../data/species.js';
import { buildConfusions } from '../data/confusions.js';
import { getSpeciesPhotos, nextSpeciesPhoto } from '../lib/media.js';

/* Verwechsler: optisch ähnliche Arten nebeneinander.
 *  Vergleichen – Gruppe wählen, Arten mit Foto und Kennzeichen nebeneinander
 *  Quiz        – ein Foto, welche der ähnlichen Arten ist es? Danach Vergleich */

const BUCKET = 'vwStats';

export function mount(root) {
  const groups = buildConfusions(getSpeciesList().species);
  const st = { mode: load('vwMode', 'quiz'), gid: load('vwGroup', groups[0]?.id) };
  if (!groups.some(g => g.id === st.gid)) st.gid = groups[0]?.id;

  const modes = h('div', { class: 'seg', role: 'radiogroup' });
  [['quiz', 'Quiz'], ['vergleich', 'Vergleichen']].forEach(([v, label]) => modes.append(h('button', {
    type: 'button', role: 'radio', 'aria-checked': String(v === st.mode), 'data-v': v,
    onclick: () => {
      st.mode = v; save('vwMode', v);
      modes.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.v === v)));
      draw();
    },
  }, label)));

  const body = h('div');
  root.append(
    h('section', { class: 'panel' },
      h('p', { class: 'muted small' }, `${groups.length} Gruppen ähnlicher Arten aus der ${getSpeciesList().level === 's' ? 'Silber' : 'Bronze'}-Liste – nebeneinander mit den Merkmalen, an denen man sie trennt.`),
      modes,
      h('a', { class: 'syslink', href: '#/arten' }, '← zurück zum Artentrainer')),
    body);

  function draw() {
    body.innerHTML = '';
    st.mode === 'vergleich' ? drawCompare() : drawQuiz();
  }

  /* ---------- Eine Spalte: Foto + Name + Merkmale ---------- */
  function column(m, { highlight = false, photo = null } = {}) {
    const img = h('img', { alt: m.sp.de, loading: 'lazy' });
    const ph = h('div', { class: 'vw-ph' }, 'Lade Foto …');
    const fig = h('button', { class: 'vw-img', type: 'button', title: 'Antippen: anderes Foto' }, img, ph);
    let list = [], i = 0;
    const show = p => {
      if (p?.thumb) { img.src = p.thumb; img.hidden = false; ph.hidden = true; }
      else { img.hidden = true; ph.hidden = false; ph.textContent = 'Kein Foto'; }
    };
    getSpeciesPhotos(m.sp).then(l => {
      list = l || [];
      if (photo) { i = Math.max(0, list.findIndex(x => x.src === photo.src)); show(photo); }
      else show(list[0]);
    });
    fig.addEventListener('click', () => { if (list.length > 1) show(list[++i % list.length]); });
    return h('div', { class: 'vw-col' + (highlight ? ' is-shown' : '') },
      fig,
      h('h3', {}, m.sp.de),
      h('ul', { class: 'vw-marks' }, ...m.marks.map(t => h('li', {}, t))));
  }

  function compareGrid(g, opts = {}) {
    return h('div', { class: `vw-grid n${g.members.length}` },
      ...g.members.map(m => column(m, { highlight: opts.shownSci === m.sp.sci, photo: opts.shownSci === m.sp.sci ? opts.photo : null })));
  }

  /* ---------- Vergleichen ---------- */
  function drawCompare() {
    const sel = h('select', { 'aria-label': 'Gruppe', onchange: e => { st.gid = e.target.value; save('vwGroup', st.gid); paint(); } },
      ...groups.map(g => h('option', { value: g.id }, `${g.title} (${g.members.map(m => m.sp.de).join(', ')})`)));
    sel.value = st.gid;
    const out = h('div');
    const step = d => {
      const k = (groups.findIndex(g => g.id === st.gid) + d + groups.length) % groups.length;
      st.gid = groups[k].id; save('vwGroup', st.gid); sel.value = st.gid; paint();
    };
    function paint() {
      const g = groups.find(x => x.id === st.gid);
      out.innerHTML = '';
      out.append(
        h('h2', { class: 'vw-title' }, g.title),
        compareGrid(g),
        h('p', { class: 'vw-tip' }, h('b', {}, 'Merkhilfe: '), g.tip));
    }
    body.append(h('section', { class: 'panel' },
      h('div', { class: 'vw-nav' },
        h('button', { class: 'btn ghost small', type: 'button', onclick: () => step(-1) }, '‹'),
        sel,
        h('button', { class: 'btn ghost small', type: 'button', onclick: () => step(1) }, '›')),
      out,
      h('p', { class: 'muted small' }, 'Foto antippen zeigt ein anderes Bild der Art.')));
    paint();
  }

  /* ---------- Quiz ---------- */
  function drawQuiz() {
    let right = 0, n = 0;
    const score = h('p', { class: 'muted small' });
    const card = h('section', { class: 'panel qcard' });
    body.append(card);

    function pick() {
      const s = stats(BUCKET);
      const items = groups.flatMap(g => g.members.map(m => ({ g, m })));
      return weightedSample(items, 1, it => weight(s[it.m.sp.sci + '|' + it.g.id]))[0] || items[0];
    }

    let token = 0, photo = null;
    async function next() {
      const { g, m } = pick();
      photo = null;
      card.innerHTML = '';
      score.textContent = n ? `${right} von ${n} richtig` : '';
      const img = h('img', { alt: '' });
      const ph = h('div', { class: 'ph' }, 'Lade Foto …');
      const media = h('div', { class: 'media vw-quizimg' }, ph);
      const choices = h('div', { class: 'choices' + (g.members.length > 2 ? ' stack' : '') });
      const after = h('div', { class: 'vw-after', hidden: true });
      card.append(h('p', { class: 'vw-q' }, `${g.title}: Welche Art ist das?`), media, choices, after, score);


      shuffle(g.members.slice()).forEach(opt => choices.append(h('button', {
        class: 'choice', type: 'button',
        onclick: e => {
          const ok = opt.sp.sci === m.sp.sci;
          n++; if (ok) right++;
          recordResult(BUCKET, m.sp.sci + '|' + g.id, ok);
          choices.querySelectorAll('button').forEach(b => {
            b.disabled = true;
            if (b.textContent === m.sp.de) b.classList.add('is-right');
          });
          if (!ok) e.currentTarget.classList.add('is-wrong');
          after.hidden = false;
          after.append(
            h('p', { class: 'verdict ' + (ok ? 'ok' : 'no') }, ok ? `Richtig – ${m.sp.de}` : `Falsch – das war ${m.sp.de}`),
            compareGrid(g, { shownSci: m.sp.sci, photo }),
            h('p', { class: 'vw-tip' }, h('b', {}, 'Merkhilfe: '), g.tip),
            h('button', { class: 'btn primary wide', type: 'button', onclick: next }, 'Weiter'));
          after.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      }, opt.sp.de)));

      // Foto erst nach den Knöpfen laden, damit nichts blockiert
      const my = ++token;
      photo = await nextSpeciesPhoto(m.sp);
      if (my !== token) return;
      if (photo?.thumb) { img.src = photo.thumb; media.replaceChildren(img); }
      else ph.textContent = 'Kein Foto gefunden';
    }
    next();
  }

  draw();
}
