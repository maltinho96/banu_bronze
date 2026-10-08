import { h, shuffle, norm, levenshtein, weightedSample } from '../lib/util.js';
import { load, save, recordResult, stats, weight } from '../lib/store.js';
import { getSpeciesList } from '../data/species.js';
import { buildTree, buildCladogram, buildGroups, groupsOf } from '../data/taxonomy.js';
import { getBirdMedia, getCuratedPhoto } from '../lib/media.js';

/* Systematik lernen: Ordnung → Familie → Art.
 *  Baum       – Verwandtschaftsbaum mit Ästen: Großgruppen → Ordnung → Familie → Art
 *  Liste      – alles zum Aufklappen, mit Fotos und Merkmalen
 *  Gruppen    – morphologisch definierte Artengruppen (Greifvögel, Limikolen …)
 *  Abdecken   – Arten oder Familien verdeckt, antippen deckt auf
 *  Einordnen  – Vogel gezeigt: Ordnung → Familie → Artengruppe wählen (Prüfungsfrage 1.1)
 *  Art nennen – Ordnung, Familie oder Artengruppe gezeigt, eine Art eintippen (Prüfungsfrage 1.12)
 */

const MODES = [
  ['baum', 'Baum'],
  ['liste', 'Liste'],
  ['gruppen', 'Gruppen'],
  ['abdecken', 'Abdecken'],
  ['einordnen', 'Einordnen'],
  ['nennen', 'Art nennen'],
];

export function mount(root) {
  const list = getSpeciesList();
  const tree = buildTree(list.species);
  const allFamilies = tree.flatMap(o => o.families.map(f => ({ ...f, order: o.name })));
  const groups = buildGroups(list.species);
  const st = { mode: load('sysMode', 'baum'), hide: load('sysHide', 'arten'), showName: load('sysShowName', true) };
  if (!MODES.some(([v]) => v === st.mode)) st.mode = 'baum';

  const modes = h('div', { class: 'seg', role: 'radiogroup' });
  MODES.forEach(([v, label]) => modes.append(h('button', {
    type: 'button', role: 'radio', 'aria-checked': String(v === st.mode), 'data-v': v,
    onclick: () => {
      st.mode = v; save('sysMode', v);
      modes.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.v === v)));
      draw();
    },
  }, label)));

  const nOrd = tree.length, nFam = allFamilies.length, nSp = list.species.length;
  const body = h('div', { class: 'sys-body' });
  root.append(
    h('section', { class: 'panel' },
      h('p', { class: 'muted small' }, `${list.name}: ${nOrd} Ordnungen, ${nFam} Familien, ${nSp} Arten.`),
      modes,
      h('p', { class: 'muted small sys-tip' }, 'Merkhilfe: Ordnungen enden wissenschaftlich auf -formes, Familien auf -idae.')),
    body);

  let io = null;
  const lazyPhotos = () => {
    io?.disconnect();
    io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const img = en.target;
      const sp = list.species.find(s => s.sci === img.dataset.sci);
      if (!sp) return;
      const cur = getCuratedPhoto(`art:${sp.sci}`);
      (cur ? Promise.resolve({ thumb: cur.thumb }) : getBirdMedia(sp)).then(m => {
        if (m.thumb) { img.src = m.thumb; img.classList.add('loaded'); }
      });
    }), { rootMargin: '150px' });
    body.querySelectorAll('img[data-sci]:not(.loaded)').forEach(im => io.observe(im));
  };

  function draw() {
    body.innerHTML = '';
    if (st.mode === 'baum') drawCladogram();
    else if (st.mode === 'liste') drawTree(false);
    else if (st.mode === 'gruppen') drawGroups();
    else if (st.mode === 'abdecken') drawTree(true);
    else if (st.mode === 'einordnen') quizPlace();
    else quizName();
  }

  /* ---------------- Baum (Kladogramm mit Ästen) ---------------- */
  function drawCladogram() {
    const root = buildCladogram(tree);
    const tools = h('div', { class: 'sys-tools' },
      h('button', { class: 'btn ghost small', type: 'button', onclick: () => setAll(true) }, 'Alles aufklappen'),
      h('button', { class: 'btn ghost small', type: 'button', onclick: () => setAll(false) }, 'Zuklappen'));
    const legend = h('p', { class: 'muted small clad-legend' },
      h('span', { class: 'clad-key clad-key-grp' }), 'Verwandtschaftsgruppe ',
      h('span', { class: 'clad-key clad-key-ord' }), 'Ordnung ',
      h('span', { class: 'clad-key clad-key-fam' }), 'Familie');
    const ul = h('ul', { class: 'clad' });
    ul.append(nodeLi(root, 0));
    const info = h('div', { class: 'clad-info', 'aria-live': 'polite', hidden: true });
    const hint = h('p', { class: 'muted small' }, 'Tippe auf einen Knoten: Er klappt auf oder zu, und unten erscheint eine kurze Erklärung.');
    body.append(tools, legend, hint, h('div', { class: 'clad-wrap' }, ul), info);
    lazyPhotos();

    function setAll(open) {
      body.querySelectorAll('.clad li[data-kind]').forEach(li => {
        const k = li.dataset.kind;
        const want = open ? true : k === 'grp';
        li.classList.toggle('collapsed', !want);
        li.querySelector(':scope > .clad-node')?.setAttribute('aria-expanded', String(want));
      });
      lazyPhotos();
    }
    function explain(title, sci, note, extra) {
      info.innerHTML = '';
      info.hidden = false;
      info.append(
        h('button', { class: 'clad-close', type: 'button', 'aria-label': 'Erklärung schließen', onclick: () => { info.hidden = true; } }, '×'),
        h('p', { class: 'def' }, h('b', {}, title), sci ? h('i', {}, ` ${sci}`) : '', note ? `: ${note}` : ''));
      if (extra) info.append(h('p', { class: 'muted small' }, extra));
    }
    function toggle(li, btn) {
      const now = li.classList.toggle('collapsed');
      btn.setAttribute('aria-expanded', String(!now));
      if (!now) lazyPhotos();
    }

    function nodeLi(n, depth) {
      // Verwandtschaftsgruppe
      if (!n.ord) {
        const li = h('li', { 'data-kind': 'grp' });
        const nOrd = countOrders(n);
        const btn = h('button', { type: 'button', class: 'clad-node clad-grp' + (n.rest ? ' is-rest' : ''), 'aria-expanded': 'true',
          onclick: () => { toggle(li, btn); explain(n.name, n.sci, n.note, `${nOrd} ${nOrd === 1 ? 'Ordnung' : 'Ordnungen'} aus deiner Liste.`); } },
          h('span', { class: 'clad-t' }, n.name), n.sci ? h('span', { class: 'clad-s' }, n.sci) : '');
        const kids = h('ul', {});
        n.children.forEach(c => kids.append(nodeLi(c, depth + 1)));
        li.append(btn, kids);
        return li;
      }
      // Ordnung
      const o = n.ord;
      const nSp = o.families.reduce((a, f) => a + f.species.length, 0);
      const li = h('li', { 'data-kind': 'ord', class: 'collapsed' });
      const btn = h('button', { type: 'button', class: 'clad-node clad-ord', 'aria-expanded': 'false',
        onclick: () => { toggle(li, btn); explain(o.name, o.info?.sci, o.info?.note, `${o.families.length} ${o.families.length === 1 ? 'Familie' : 'Familien'}, ${nSp} ${nSp === 1 ? 'Art' : 'Arten'}.`); } },
        h('span', { class: 'clad-t' }, o.name), o.info ? h('span', { class: 'clad-s' }, o.info.sci) : '',
        h('span', { class: 'clad-n' }, `${nSp} ${nSp === 1 ? 'Art' : 'Arten'}`));
      const fams = h('ul', {});
      o.families.forEach(f => {
        const fli = h('li', { 'data-kind': 'fam', class: 'collapsed' });
        const fbtn = h('button', { type: 'button', class: 'clad-node clad-fam', 'aria-expanded': 'false',
          onclick: () => { toggle(fli, fbtn); explain(f.name, f.info?.sci, f.info?.note, `Arten: ${f.species.map(x => x.de).join(', ')}.`); } },
          h('span', { class: 'clad-t' }, f.name), f.info ? h('span', { class: 'clad-s' }, f.info.sci) : '',
          h('span', { class: 'clad-n' }, `${f.species.length} ${f.species.length === 1 ? 'Art' : 'Arten'}`));
        const sp = h('ul', {});
        f.species.forEach(x => sp.append(h('li', { class: 'clad-leaf' },
          h('span', { class: 'clad-node clad-sp' },
            h('img', { alt: '', 'data-sci': x.sci, class: 'sys-thumb' }),
            h('span', { class: 'sys-name' }, h('b', {}, x.de), h('i', {}, x.sci))))));
        fli.append(fbtn, sp);
        fams.append(fli);
      });
      li.append(btn, fams);
      return li;
    }
    function countOrders(n) { return n.ord ? 1 : n.children.reduce((a, c) => a + countOrders(c), 0); }
  }

  /* ---------------- Morphologische Artengruppen ---------------- */
  function drawGroups() {
    body.append(h('p', { class: 'muted small' },
      'Artengruppen fassen Vögel nach Bau und Lebensweise zusammen – nicht nach Verwandtschaft. ',
      'Deshalb können sie mehrere Ordnungen umfassen (Greifvögel, Stelzvögel) oder nur einen Teil einer Familie (Gründel- und Tauchenten). ',
      'Namen wie Eulen, Spechte oder Tauben sind zugleich Ordnung bzw. Familie – die findest du im Baum.'));
    const tools = h('div', { class: 'sys-tools' },
      h('button', { class: 'btn ghost small', type: 'button', onclick: () => body.querySelectorAll('details').forEach(d => { d.open = true; }) }, 'Alles aufklappen'),
      h('button', { class: 'btn ghost small', type: 'button', onclick: () => body.querySelectorAll('details').forEach(d => { d.open = false; }) }, 'Alles zuklappen'));
    body.append(tools);
    groups.forEach(g => {
      const det = h('details', { class: 'sys-ord' },
        h('summary', {},
          h('span', { class: 'sys-name' }, h('b', {}, g.name), g.sci ? h('i', {}, g.sci) : ''),
          h('span', { class: 'sys-count' }, `${g.species.length} ${g.species.length === 1 ? 'Art' : 'Arten'}`)));
      det.append(h('p', { class: 'sys-note' }, g.note));
      const span = g.orders.length > 1
        ? `Umfasst ${g.orders.length} Ordnungen: ${g.orders.join(', ')}.`
        : `Ordnung ${g.orders[0]}${g.families.length > 1 ? `, Familien: ${g.families.join(', ')}` : `, Familie ${g.families[0]}`}.`;
      det.append(h('p', { class: 'sys-note sys-span' }, span));
      const ul = h('ul', { class: 'sys-sp sys-sp-grp' });
      g.species.forEach(sp => ul.append(h('li', {},
        h('img', { alt: '', 'data-sci': sp.sci, class: 'sys-thumb' }),
        h('span', { class: 'sys-name' }, h('b', {}, sp.de), h('i', {}, `${sp.sci} · ${sp.fam}`)))));
      det.append(ul);
      det.addEventListener('toggle', () => { if (det.open) lazyPhotos(); });
      body.append(det);
    });
  }

  /* ---------------- Stammbaum / Abdecken ---------------- */
  function drawTree(cover) {
    const tools = h('div', { class: 'sys-tools' },
      h('button', { class: 'btn ghost small', type: 'button', onclick: () => body.querySelectorAll('details').forEach(d => { d.open = true; }) }, 'Alles aufklappen'),
      h('button', { class: 'btn ghost small', type: 'button', onclick: () => body.querySelectorAll('details').forEach(d => { d.open = false; }) }, 'Alles zuklappen'));
    if (cover) {
      const hideSeg = h('div', { class: 'seg' });
      [['arten', 'Arten verdecken'], ['familien', 'Familien verdecken']].forEach(([v, label]) => hideSeg.append(h('button', {
        type: 'button', role: 'radio', 'aria-checked': String(st.hide === v), 'data-v': v,
        onclick: () => { st.hide = v; save('sysHide', v); draw(); },
      }, label)));
      tools.prepend(hideSeg);
      body.append(h('p', { class: 'muted small' }, st.hide === 'arten'
        ? 'Klapp eine Familie auf und überleg, welche Arten dazugehören. Antippen deckt einen Namen auf.'
        : 'Die Familiennamen sind verdeckt. Schau dir die Arten an und überleg, wie die Familie heißt. Antippen deckt auf.'));
    }
    body.append(tools);

    const hideSp = cover && st.hide === 'arten';
    const hideFam = cover && st.hide === 'familien';

    tree.forEach(o => {
      const ordDet = h('details', { class: 'sys-ord' },
        h('summary', {},
          h('span', { class: 'sys-name' }, h('b', {}, o.name), o.info ? h('i', {}, o.info.sci) : ''),
          h('span', { class: 'sys-count' }, (() => {
            const nf = o.families.length, ns = o.families.reduce((n, f) => n + f.species.length, 0);
            return `${nf} ${nf === 1 ? 'Familie' : 'Familien'} · ${ns} ${ns === 1 ? 'Art' : 'Arten'}`;
          })())));
      if (o.info?.note) ordDet.append(h('p', { class: 'sys-note' }, o.info.note));
      o.families.forEach(f => {
        const famLabel = hideFam
          ? h('button', { class: 'sys-cover', type: 'button', onclick: e => { e.preventDefault(); e.stopPropagation(); revealFam(e.currentTarget, f); } }, 'Familie ?')
          : h('span', { class: 'sys-name' }, h('b', {}, f.name), f.info ? h('i', {}, f.info.sci) : '');
        const famDet = h('details', { class: 'sys-fam' },
          h('summary', {}, famLabel, h('span', { class: 'sys-count' }, `${f.species.length} ${f.species.length === 1 ? 'Art' : 'Arten'}`)));
        if (f.info?.note && !hideFam) famDet.append(h('p', { class: 'sys-note' }, f.info.note));
        const ul = h('ul', { class: 'sys-sp' });
        f.species.forEach(sp => ul.append(h('li', {},
          h('img', { alt: '', 'data-sci': sp.sci, class: 'sys-thumb' }),
          hideSp
            ? h('button', { class: 'sys-cover', type: 'button', onclick: e => revealSp(e.currentTarget, sp) }, '? antippen')
            : h('span', { class: 'sys-name' }, h('b', {}, sp.de), h('i', {}, sp.sci)))));
        famDet.append(ul);
        ordDet.append(famDet);
      });
      body.append(ordDet);
    });
    lazyPhotos();
  }
  function revealSp(btn, sp) {
    btn.replaceWith(h('span', { class: 'sys-name revealed' }, h('b', {}, sp.de), h('i', {}, sp.sci)));
  }
  function revealFam(btn, f) {
    const span = h('span', { class: 'sys-name revealed' }, h('b', {}, f.name), f.info ? h('i', {}, f.info.sci) : '');
    btn.replaceWith(span);
    if (f.info?.note) span.closest('details').querySelector('summary').after(h('p', { class: 'sys-note' }, f.info.note));
  }

  /* ---------------- Einordnen: Art → Ordnung → Familie ---------------- */
  let right = 0, total = 0;

  /* Ausgeglichene Ziehung: Erst wird eine ORDNUNG aus einem Beutel gezogen –
   * jede Ordnung genau einmal pro Runde, schwache Ordnungen ein zweites Mal.
   * Erst danach Familie und Art innerhalb der Ordnung. So kommen die
   * Sperlingsvögel nicht öfter dran als Lappentaucher oder Eulen. */
  const drawers = {};
  function drawOrder(mode) {
    const d = (drawers[mode] ||= { bag: [], last: null, round: 0, size: 0 });
    if (!d.bag.length) {
      const s = stats('sysStats');
      const bag = tree.map(o => o.name);
      tree.forEach(o => {
        const e = s[`o|${o.name}`];
        if (e && (e.last === 0 || e.w / (e.r + e.w) > 0.3)) bag.push(o.name);
      });
      // so lange mischen, bis nirgends dieselbe Ordnung zweimal hintereinander kommt –
      // auch nicht über die Rundengrenze (gezogen wird vom Ende her)
      const ok = b => b.every((x, i) => i === 0 || x !== b[i - 1]) && b[b.length - 1] !== d.last;
      let tries = 0;
      do { d.bag = shuffle(bag.slice()); } while (!ok(d.bag) && ++tries < 200);
      d.round++; d.size = d.bag.length;
    }
    const name = d.bag.pop();
    d.last = name;
    return { ord: tree.find(o => o.name === name), pos: d.size - d.bag.length, size: d.size, round: d.round };
  }
  const roundNote = r => `Runde ${r.round} · ${r.pos} von ${r.size}`;

  function quizPlace() {
    const s = stats('sysStats');
    const r = drawOrder('einordnen');
    const ordNode = r.ord;
    const famNode = weightedSample(ordNode.families, 1, f => weight(s[`fam|${f.name}`]))[0];
    const sp = weightedSample(famNode.species, 1, x => weight(s[`ord|${x.sci}`]))[0];
    // Artengruppe: die spezifischste (kleinste) Gruppe der Art abfragen
    const myGroups = groupsOf(sp);
    const grp = myGroups.length
      ? groups.filter(g => myGroups.some(m => m.name === g.name)).sort((a, b) => a.species.length - b.species.length)[0]
      : null;

    const card = h('section', { class: 'card qcard' });
    const img = h('img', { alt: '', class: 'sys-quiz-img' });
    const cur = getCuratedPhoto(`art:${sp.sci}`);
    (cur ? Promise.resolve({ thumb: cur.thumb }) : getBirdMedia(sp)).then(m => { if (m.thumb) img.src = m.thumb; });
    const step = h('div', {});
    const score = h('p', { class: 'score' }, total ? `${right} von ${total} richtig` : '');
    const nameBox = h('div', {});
    const showName = () => { nameBox.innerHTML = ''; nameBox.append(h('h2', { class: 'rname' }, sp.de), h('p', { class: 'rsci' }, sp.sci)); };
    if (st.showName) showName();
    else nameBox.append(h('button', { class: 'linkbtn', type: 'button', onclick: showName }, 'Artnamen anzeigen'));
    const nameToggle = h('label', { class: 'check small sys-nametoggle' },
      h('input', { type: 'checkbox', checked: st.showName, onchange: e => { st.showName = e.target.checked; save('sysShowName', st.showName); } }),
      'Artnamen gleich zeigen (aus: nur Foto, wie in der Prüfung)');
    card.append(h('p', { class: 'qmeta' }, roundNote(r)), img, nameBox, step);
    body.append(card, score, nameToggle);

    const steps = grp ? 3 : 2;
    const res = {};
    askOrder();

    function choices(opts, correct, onPick) {
      const box = h('div', { class: 'choices stack' });
      opts.forEach(o => box.append(h('button', {
        type: 'button', class: 'choice', 'data-v': o, onclick: e => {
          box.querySelectorAll('button').forEach(b => {
            b.disabled = true;
            if (b.dataset.v === correct) b.classList.add('is-right');
          });
          if (o !== correct) e.currentTarget.classList.add('is-wrong');
          onPick(o === correct);
        },
      }, o)));
      return box;
    }
    function askOrder() {
      const others = shuffle(tree.map(o => o.name).filter(n => n !== sp.ord)).slice(0, 3);
      step.append(h('p', { class: 'task' }, `1/${steps} · Zu welcher Ordnung gehört der Vogel?`),
        choices(shuffle([sp.ord, ...others]), sp.ord, ok => { res.ord = ok; askFamily(); }));
    }
    function askFamily() {
      // Ablenker bevorzugt aus derselben Ordnung – das ist die eigentliche Lernaufgabe
      const same = ordNode.families.map(f => f.name).filter(n => n !== sp.fam);
      const rest = allFamilies.map(f => f.name).filter(n => n !== sp.fam && !same.includes(n));
      const others = [...shuffle(same), ...shuffle(rest)].slice(0, 3);
      step.append(h('p', { class: 'task' }, `2/${steps} · Zu welcher Familie?`),
        choices(shuffle([sp.fam, ...others]), sp.fam, ok => { res.fam = ok; grp ? askGroup() : finish(); }));
    }
    function askGroup() {
      // Ablenker: nur Gruppen, zu denen die Art NICHT gehört
      const others = shuffle(groups.filter(g => !myGroups.some(m => m.name === g.name)).map(g => g.name)).slice(0, 3);
      step.append(h('p', { class: 'task' }, `3/${steps} · Zu welcher morphologischen Artengruppe?`),
        choices(shuffle([grp.name, ...others]), grp.name, ok => { res.grp = ok; finish(); }));
    }
    function finish() {
      const parts = [['Ordnung', res.ord], ['Familie', res.fam], ...(grp ? [['Artengruppe', res.grp]] : [])];
      const wrong = parts.filter(([, v]) => !v).map(([k]) => k);
      const ok = !wrong.length;
      total++; if (ok) right++;
      recordResult('sysStats', `ord|${sp.sci}`, ok);
      recordResult('sysStats', `o|${sp.ord}`, ok);
      score.textContent = `${right} von ${total} richtig`;
      if (!st.showName) showName();
      const siblings = famNode.species.filter(x => x.sci !== sp.sci).map(x => x.de);
      step.append(
        h('p', { class: `verdict ${ok ? 'ok' : 'no'}` }, ok ? 'Alles richtig' : `Falsch: ${wrong.join(', ')}`),
        h('p', { class: 'sys-path' },
          h('span', {}, sp.ord, ordNode.info ? h('i', {}, ` ${ordNode.info.sci}`) : ''), ' › ',
          h('span', {}, sp.fam, famNode.info ? h('i', {}, ` ${famNode.info.sci}`) : ''), ' › ',
          h('b', {}, sp.de)),
        myGroups.length ? h('p', { class: 'def' }, h('b', {}, 'Artengruppe: '), myGroups.map(g => g.name).join(', ')) : h('p', { class: 'def muted' }, 'Keine der üblichen Artengruppen.'),
        grp ? h('p', { class: 'def muted' }, grp.note) : (famNode.info?.note ? h('p', { class: 'def muted' }, famNode.info.note) : ''),
        siblings.length ? h('p', { class: 'def' }, h('b', {}, 'Ebenfalls in dieser Familie: '), siblings.join(', ')) : h('p', { class: 'def muted' }, 'Einzige Art dieser Familie in der Liste.'),
        h('button', { class: 'btn primary', type: 'button', onclick: () => { body.innerHTML = ''; quizPlace(); } }, 'Weiter'));
      step.querySelector('.btn.primary').focus({ preventScroll: true });
    }
  }

  /* ---------------- Art nennen (Prüfungsfrage 1.12) ----------------
   * Reihum aus Ordnung, Familie und Artengruppe. Ordnungen und Familien kommen
   * über den Ordnungs-Beutel, Artengruppen über einen eigenen Beutel. */
  let nameTurn = 0;
  function nameTarget() {
    const s = stats('sysStats');
    const kinds = groups.length ? ['fam', 'grp', 'ord'] : ['fam', 'ord'];
    let kind = kinds[nameTurn++ % kinds.length];
    const r = drawOrder('nennen');
    if (kind === 'grp') {
      // Artengruppe passend zur gezogenen Ordnung – so bleiben auch die
      // Gruppenfragen ausgeglichen (5 der Gruppen sind Entenvögel-Untergruppen)
      const cand = groups.filter(g => g.orders.includes(r.ord.name));
      if (cand.length) {
        const g = weightedSample(cand, 1, x => weight(s[`grp|${x.name}`]))[0];
        return { key: `grp|${g.name}`, label: 'Artengruppe', name: g.name, sci: g.sci, note: g.note, members: g.species,
          meta: `${roundNote(r)} · Morphologische Artengruppe`, order: r.ord.name };
      }
      kind = 'fam'; // Ordnung ohne Artengruppe (z. B. Tauben, Spechte) → Familienfrage
    }
    if (kind === 'ord') {
      const o = r.ord;
      return { key: `o|${o.name}`, label: 'Ordnung', name: o.name, sci: o.info?.sci, note: o.info?.note,
        members: o.families.flatMap(f => f.species), meta: roundNote(r), order: o.name };
    }
    const f = weightedSample(r.ord.families, 1, x => weight(s[`fam|${x.name}`]))[0];
    return { key: `fam|${f.name}`, label: 'Familie', name: f.name, sci: f.info?.sci, note: f.info?.note,
      members: f.species, meta: `${roundNote(r)} · Ordnung: ${r.ord.name}`, order: r.ord.name };
  }
  const fmtList = arr => arr.length > 14 ? `${arr.slice(0, 14).join(', ')} und ${arr.length - 14} weitere` : arr.join(', ');

  function quizName() {
    const t = nameTarget();
    const memberSet = new Set(t.members.map(m => m.sci));
    const card = h('section', { class: 'card qcard' });
    const input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', enterkeyhint: 'done', placeholder: 'Deutscher oder wissenschaftlicher Name' });
    const result = h('div', {});
    const score = h('p', { class: 'score' }, total ? `${right} von ${total} richtig` : '');
    const check = () => {
      if (input.disabled) return;
      input.disabled = true;
      const g = norm(input.value);
      const names = sp => [sp.de, sp.sci, ...(sp.syn || [])].map(norm).filter(Boolean);
      // Exakter Name einer Art außerhalb der Gruppe ist immer falsch …
      const exactOther = g && list.species.find(sp => !memberSet.has(sp.sci) && names(sp).includes(g));
      // … sonst sind kleine Tippfehler und Buchstabendreher erlaubt
      const tol = g.length >= 7 ? 2 : g.length >= 5 ? 1 : 0;
      const hit = !exactOther && g && t.members.find(sp => names(sp).some(n => n === g || levenshtein(g, n) <= tol));
      const other = !hit && (exactOther || (g && list.species.find(sp => names(sp).includes(g))));
      const ok = !!hit;
      total++; if (ok) right++;
      recordResult('sysStats', t.key, ok);
      if (t.order) recordResult('sysStats', `o|${t.order}`, ok);
      score.textContent = `${right} von ${total} richtig`;
      const whereOther = sp => {
        const gs = groupsOf(sp).map(x => x.name);
        return `${sp.fam}, ${sp.ord}${gs.length ? `; Gruppe: ${gs.join(', ')}` : ''}`;
      };
      result.append(
        h('p', { class: `verdict ${ok ? 'ok' : 'no'}` },
          ok ? `Richtig – ${hit.de}` : other ? `Falsch – ${other.de} gehört zu: ${whereOther(other)}` : g ? 'Falsch – nicht gefunden' : 'Nicht beantwortet'),
        h('p', { class: 'def' }, h('b', {}, `${t.label} ${t.name} in der Liste: `), fmtList(t.members.map(x => x.de))),
        t.note ? h('p', { class: 'def muted' }, t.note) : '',
        h('button', { class: 'btn primary', type: 'button', onclick: () => { body.innerHTML = ''; quizName(); } }, 'Weiter'));
      result.querySelector('.btn.primary').focus({ preventScroll: true });
    };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    const art = t.label === 'Artengruppe' ? 'der Artengruppe' : t.label === 'Ordnung' ? 'der Ordnung' : 'der Familie';
    card.append(
      h('p', { class: 'qmeta' }, t.meta),
      h('h2', { class: 'qtext' }, `Nennen Sie eine Art aus ${art} ${t.name}.`),
      t.sci ? h('p', { class: 'rsci' }, t.sci) : '',
      h('div', { class: 'row sys-answer' }, input, h('button', { class: 'btn', type: 'button', onclick: check }, 'Prüfen')),
      result);
    body.append(card, score);
    if (matchMedia('(hover:hover)').matches) input.focus();
  }

  draw();
  return () => io?.disconnect();
}
