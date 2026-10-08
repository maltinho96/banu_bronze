import { h, $, norm, shuffle, levenshtein, weightedSample, escapeHtml } from '../lib/util.js';
import { load, save, recordResult, stats, weight } from '../lib/store.js';
import { getSpeciesList } from '../data/species.js';
import { HAB_LABEL } from '../data/species-builtin.js';
import { getBirdMedia, getHabitatImage, getAudio, banAudio, pinAudio, isPinned, resetAudioPrefs, setAudioSources, getCuratedPhoto } from '../lib/media.js';

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const SND_LABEL = { song: 'Gesang', call: 'Ruf', drumming: 'Trommeln' };
const DEFAULT_CFG = { mode: 'pruefung', type: 'gemischt', hab: 'alle', answer: 'tippen', weak: false, autoplay: true };

export function mount(root) {
  const list = getSpeciesList();
  const SPECIES = list.species;
  const cfg = { ...DEFAULT_CFG, ...load('artenCfg', {}) };
  let deck = [], idx = -1, right = 0, answered = 0, wrongs = [];
  let audio = [], audioPtr = 0, token = 0, verdict = false;

  /* ---------- Steuerung ---------- */
  const seg = (key, options) => {
    const el = h('div', { class: 'seg', role: 'radiogroup' });
    options.forEach(([v, label]) => el.append(h('button', {
      type: 'button', role: 'radio', 'aria-checked': String(cfg[key] === v),
      onclick: e => {
        cfg[key] = v; save('artenCfg', cfg);
        el.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', String(b === e.currentTarget)));
        syncControls();
      },
    }, label)));
    return el;
  };
  const habSelect = h('select', { 'aria-label': 'Lebensraum', onchange: e => { cfg.hab = e.target.value; save('artenCfg', cfg); } },
    h('option', { value: 'alle' }, 'Alle Lebensräume'),
    ...Object.entries(HAB_LABEL).map(([k, v]) => h('option', { value: k }, v)));
  habSelect.value = cfg.hab;
  const weakBox = h('input', { type: 'checkbox', id: 'weak', onchange: e => { cfg.weak = e.target.checked; save('artenCfg', cfg); } });
  weakBox.checked = cfg.weak;
  const autoBox = h('input', { type: 'checkbox', id: 'autoplay', onchange: e => { cfg.autoplay = e.target.checked; save('artenCfg', cfg); } });
  autoBox.checked = cfg.autoplay;
  const startBtn = h('button', { class: 'btn primary wide', onclick: start });

  const controls = h('section', { class: 'panel controls' },
    h('p', { class: 'listname' }, `Liste: ${list.name}`),
    h('div', { class: 'ctrl' }, h('span', { class: 'lbl' }, 'Modus'),
      seg('mode', [['pruefung', 'Prüfung (30)'], ['frei', 'Üben'], ['liste', 'Artenliste']]),
      h('a', { class: 'syslink', href: '#/systematik' }, 'Systematik lernen: Ordnungen, Familien, Arten')),
    h('div', { class: 'ctrl only-quiz' }, h('span', { class: 'lbl' }, 'Fragetyp'),
      seg('type', [['gemischt', 'Gemischt'], ['optisch', 'Foto'], ['akustisch', 'Ton']])),
    h('div', { class: 'ctrl only-quiz' }, h('span', { class: 'lbl' }, 'Antwort'),
      seg('answer', [['tippen', 'Eintippen'], ['auswahl', 'Auswahl (4)']])),
    h('div', { class: 'ctrl row' }, habSelect,
      h('label', { class: 'check only-frei', for: 'weak' }, weakBox, 'Schwache Arten bevorzugen')),
    h('div', { class: 'ctrl only-quiz' },
      h('label', { class: 'check', for: 'autoplay' }, autoBox, 'Ton automatisch abspielen')),
    startBtn,
  );

  function syncControls() {
    controls.classList.toggle('is-liste', cfg.mode === 'liste');
    controls.classList.toggle('is-frei', cfg.mode === 'frei');
    startBtn.textContent = cfg.mode === 'pruefung' ? 'Prüfung starten' : cfg.mode === 'frei' ? 'Üben starten' : 'Liste zeigen';
  }

  /* ---------- Quiz-Karte ---------- */
  const scoreRow = h('div', { class: 'score', hidden: true });
  const bar = h('div', { class: 'bar', hidden: true }, h('i'));
  const media = h('div', { class: 'media' }, h('div', { class: 'ph' }, 'Lade …'));
  const badge = h('div', { class: 'badge' });
  media.append(badge);
  const fcMonth = h('span'), fcHab = h('span'), fcNum = h('span');
  const strip = h('div', { class: 'strip' },
    h('div', {}, h('small', {}, 'Monat'), fcMonth),
    h('div', { class: 'strip-hab' }, h('small', {}, 'Lebensraum'), fcHab),
    h('div', {}, h('small', {}, 'Frage'), fcNum));

  const player = h('audio', { controls: true, preload: 'none' });
  // Eine einzelne fehlende Quelle ist normal (nicht zu jeder Datei gibt es eine
  // mp3-Umwandlung). Erst wenn keine Quelle mehr übrig ist, ist die Aufnahme kaputt.
  player.addEventListener('error', () => {
    if (player.networkState === HTMLMediaElement.NETWORK_NO_SOURCE && player.querySelector('source')) {
      audioTitle.textContent = 'Diese Aufnahme lässt sich nicht abspielen – „Andere Aufnahme“ probieren.';
    }
  }, true);
  const audioTitle = h('p', { class: 'audio-title' });
  const audioInfo = h('a', { class: 'audio-info', target: '_blank', rel: 'noopener' });
  const otherBtn = h('button', { class: 'btn ghost small', type: 'button', onclick: () => { audioPtr++; loadAudio(true); } }, 'Andere Aufnahme');
  const banBtn = h('button', { class: 'btn ghost small', type: 'button', onclick: banCurrent }, 'Passt nicht');
  const pinBtn = h('button', { class: 'btn ghost small', type: 'button', onclick: pinCurrent }, 'Als Standard merken');
  const curate = h('div', { class: 'curate', hidden: true }, banBtn, pinBtn);
  const audioZone = h('div', { class: 'audiozone', hidden: true }, player, audioTitle, audioInfo,
    h('div', { class: 'audio-actions' }, otherBtn), curate);

  const guess = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', enterkeyhint: 'done', placeholder: 'Art (deutsch oder wissenschaftlich)' });
  guess.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); reveal(); } });
  const typeBox = h('div', { class: 'row' }, guess, h('button', { class: 'btn', type: 'button', onclick: () => reveal() }, 'Auflösen'));
  const choiceBox = h('div', { class: 'choices' });
  const answerBox = h('div', { class: 'answer' }, typeBox, choiceBox);

  const rVerdict = h('p', { class: 'verdict' });
  const rName = h('h2', { class: 'rname' });
  const rSci = h('p', { class: 'rsci' });
  const rChips = h('div', { class: 'chips' });
  const rImg = h('img', { alt: '', loading: 'lazy' });
  const rImgWrap = h('div', { class: 'rimg', hidden: true }, rImg);
  const rExtract = h('p', { class: 'extract' });
  const rWiki = h('a', { target: '_blank', rel: 'noopener' }, 'Wikipedia');
  const rXC = h('a', { target: '_blank', rel: 'noopener' }, 'xeno-canto');
  const listenBtn = h('button', { class: 'btn ghost small', type: 'button', onclick: () => loadAudioFor(deck[idx].sp, true) }, 'Stimme anhören');
  const nextBtn = h('button', { class: 'btn primary', type: 'button', onclick: () => grade(verdict) }, 'Weiter');
  const flipBtn = h('button', { class: 'btn ghost', type: 'button', onclick: () => { verdict = !verdict; paintVerdict(); } });
  const revealBox = h('div', { class: 'reveal', hidden: true },
    rVerdict, rName, rSci, rChips, rImgWrap, rExtract,
    h('div', { class: 'links' }, rWiki, rXC, listenBtn),
    h('div', { class: 'grade' }, flipBtn, nextBtn));

  const card = h('section', { class: 'card', hidden: true }, media, strip, audioZone, answerBox, revealBox);
  const endScreen = h('section', { class: 'panel end', hidden: true });
  const listView = h('section', { class: 'specieslist', hidden: true });

  root.append(controls, scoreRow, bar, card, endScreen, listView);
  syncControls();

  /* ---------- Ablauf ---------- */
  function pool() {
    return cfg.hab === 'alle' ? SPECIES.slice() : SPECIES.filter(s => s.hab?.includes(cfg.hab));
  }
  function modeFor() {
    if (cfg.type === 'optisch') return 'optisch';
    if (cfg.type === 'akustisch') return 'akustisch';
    return Math.random() < 0.5 ? 'optisch' : 'akustisch';
  }
  function buildDeck() {
    const p = pool();
    if (cfg.mode === 'pruefung') {
      const n = Math.min(30, p.length);
      deck = shuffle(p).slice(0, n).map(sp => ({ sp, mode: modeFor() }));
      if (cfg.type === 'gemischt') { deck.forEach((d, i) => { d.mode = i < n / 2 ? 'optisch' : 'akustisch'; }); shuffle(deck); }
    } else {
      const st = stats('artStats');
      const items = p.map(sp => ({ sp, mode: modeFor() }));
      deck = cfg.weak
        ? weightedSample(items, items.length, d => weight(st[`${d.sp.sci}|${d.mode}`]))
        : shuffle(items);
    }
    idx = -1; right = 0; answered = 0; wrongs = [];
  }

  function start() {
    endScreen.hidden = true;
    if (cfg.mode === 'liste') { card.hidden = true; scoreRow.hidden = true; bar.hidden = true; return showList(); }
    listView.hidden = true;
    buildDeck();
    if (!deck.length) { alert('In diesem Lebensraum sind keine Arten in der Liste.'); return; }
    controls.classList.add('collapsed');
    card.hidden = false; scoreRow.hidden = false; bar.hidden = cfg.mode !== 'pruefung';
    next();
  }
  controls.addEventListener('click', e => {
    if (controls.classList.contains('collapsed') && !e.target.closest('button')) controls.classList.remove('collapsed');
  });

  function updateScore() {
    scoreRow.innerHTML = `<span>Frage <b>${Math.min(idx + 1, deck.length)}</b>/${deck.length}</span>` +
      `<span>Richtig <b>${right}</b></span><span>Quote <b>${answered ? Math.round(right / answered * 100) : 0} %</b></span>` +
      `<button class="linkbtn" type="button">Einstellungen</button>`;
    scoreRow.querySelector('button').onclick = () => { controls.classList.remove('collapsed'); controls.scrollIntoView({ behavior: 'smooth' }); };
    bar.firstChild.style.width = `${Math.round(answered / deck.length * 100)}%`;
  }

  function setMedia(src, fallback, fit = 'cover') {
    media.classList.toggle('fit-contain', fit === 'contain');
    media.querySelector('img')?.remove();
    const ph = media.querySelector('.ph');
    if (!src) { ph.hidden = false; ph.textContent = fallback; return; }
    ph.hidden = false; ph.textContent = 'Lade …';
    const im = h('img', { alt: '', src });
    im.onload = () => { ph.hidden = true; };
    im.onerror = () => { im.remove(); ph.hidden = false; ph.textContent = fallback; };
    media.prepend(im);
  }

  async function next() {
    idx++;
    if (idx >= deck.length) return finish();
    const my = ++token;
    const { sp, mode } = deck[idx];
    revealBox.hidden = true; answerBox.hidden = false; curate.hidden = true;
    guess.value = ''; guess.disabled = false;
    rImgWrap.hidden = true;
    player.pause(); player.removeAttribute('src');
    fcNum.textContent = idx + 1;
    const months = mode === 'akustisch' ? [2, 3, 4, 5, 6] : [...Array(12).keys()];
    fcMonth.textContent = MONTHS[months[Math.floor(Math.random() * months.length)]];
    updateScore();

    const isTyping = cfg.answer === 'tippen';
    typeBox.hidden = !isTyping; choiceBox.hidden = isTyping;
    if (!isTyping) buildChoices(sp);

    if (mode === 'akustisch') {
      badge.textContent = 'Ton';
      strip.classList.add('with-hab');
      const hk = sp.hab?.[0];
      fcHab.textContent = HAB_LABEL[hk] || '—';
      audioZone.hidden = false;
      setMedia(null, 'Lade Lebensraumfoto …', 'cover');
      const [img] = await Promise.all([hk ? getHabitatImage(hk) : null, loadAudioFor(sp, cfg.autoplay)]);
      if (my !== token) return;
      setMedia(img, 'Kein Lebensraumfoto – hör einfach genau hin', 'cover');
    } else {
      badge.textContent = 'Foto';
      strip.classList.remove('with-hab');
      audioZone.hidden = true;
      setMedia(null, 'Lade Foto …', 'contain');
      const curated = getCuratedPhoto(`art:${sp.sci}`);
      const m = curated ? { thumb: curated.thumb } : await getBirdMedia(sp);
      if (my !== token) return;
      setMedia(m.thumb, 'Kein Foto gefunden – trotzdem raten und auflösen', 'contain');
    }
    if (isTyping && matchMedia('(hover:hover)').matches) guess.focus();
  }

  async function loadAudioFor(sp, play) {
    audioZone.hidden = false;
    audioTitle.textContent = 'Suche Aufnahmen …';
    audioInfo.textContent = '';
    audio = await getAudio(sp); audioPtr = 0;
    loadAudio(play);
  }
  function loadAudio(play) {
    const sp = deck[idx]?.sp;
    if (!audio.length) {
      audioTitle.textContent = 'Keine Aufnahme gefunden. Nach dem Auflösen kommst du über den xeno-canto-Link zu den Stimmen dieser Art.';
      audioInfo.textContent = ''; audioInfo.removeAttribute('href');
      setAudioSources(player, null);
      otherBtn.hidden = true;
      return;
    }
    otherBtn.hidden = audio.length < 2;
    const a = audio[audioPtr % audio.length];
    setAudioSources(player, a);
    // Vor der Auflösung keinen Artnamen zeigen
    const solved = !revealBox.hidden;
    audioTitle.textContent = solved ? a.title : `Aufnahme ${audioPtr % audio.length + 1} von ${audio.length}`;
    audioInfo.textContent = solved ? a.info : a.info.replace(/·.*$/, '').trim();
    audioInfo.href = a.link;
    pinBtn.textContent = sp && isPinned(sp.sci, a.src) ? 'Gemerkt ✓' : 'Als Standard merken';
    if (play) player.play().catch(() => { /* Autoplay blockiert – Nutzer tippt selbst auf Play */ });
  }
  function banCurrent() {
    const sp = deck[idx].sp, a = audio[audioPtr % audio.length];
    if (!a) return;
    banAudio(sp.sci, a.src);
    audio = audio.filter(x => x.src !== a.src);
    loadAudio(true);
  }
  function pinCurrent() {
    const sp = deck[idx].sp, a = audio[audioPtr % audio.length];
    if (!a) return;
    pinAudio(sp.sci, a.src);
    pinBtn.textContent = 'Gemerkt ✓';
  }

  /* ---------- Antworten ---------- */
  function distractors(sp, n) {
    const others = SPECIES.filter(s => s.sci !== sp.sci);
    const sameFam = shuffle(others.filter(s => s.fam && s.fam === sp.fam));
    const sameHab = shuffle(others.filter(s => s.fam !== sp.fam && s.hab?.[0] === sp.hab?.[0]));
    const rest = shuffle(others.filter(s => !sameFam.includes(s) && !sameHab.includes(s)));
    return [...sameFam.slice(0, 2), ...sameHab, ...rest].slice(0, n);
  }
  function buildChoices(sp) {
    choiceBox.innerHTML = '';
    shuffle([sp, ...distractors(sp, 3)]).forEach(s => choiceBox.append(
      h('button', { class: 'choice', type: 'button', onclick: e => reveal(s, e.currentTarget) }, s.de)));
  }

  function checkGuess(text, sp) {
    const g = norm(text);
    if (!g) return false;
    const names = s => [s.de, s.sci, ...(s.syn || [])].map(norm).filter(Boolean);
    if (names(sp).includes(g)) return true;
    // exakt eine andere Art → falsch
    if (SPECIES.some(s => s !== sp && names(s).includes(g))) return false;
    const deN = norm(sp.de);
    if (deN.length >= 5 && g.includes(deN)) return true;
    // Tippfehler tolerieren, wenn die Zielart eindeutig am nächsten liegt
    const dist = s => Math.min(...names(s).map(n => levenshtein(g, n)));
    const d = dist(sp);
    const tol = g.length >= 9 ? 2 : g.length >= 5 ? 1 : 0;
    if (d > tol) return false;
    return !SPECIES.some(s => s !== sp && dist(s) <= d);
  }

  function reveal(choice, btn) {
    const { sp, mode } = deck[idx];
    if (choice) {
      verdict = choice.sci === sp.sci;
      choiceBox.querySelectorAll('button').forEach(b => {
        b.disabled = true;
        if (b.textContent === sp.de) b.classList.add('is-right');
      });
      if (!verdict && btn) btn.classList.add('is-wrong');
    } else {
      verdict = checkGuess(guess.value, sp);
      guess.disabled = true;
      typeBox.hidden = true;
    }
    rName.textContent = sp.de;
    rSci.textContent = sp.sci;
    rChips.innerHTML = '';
    [sp.ord, sp.fam].filter(Boolean).forEach(t => rChips.append(h('span', { class: 'chip' }, t)));
    (sp.hab || []).forEach(k => rChips.append(h('span', { class: 'chip hab' }, HAB_LABEL[k] || k)));
    rXC.href = `https://xeno-canto.org/species/${sp.sci.replace(/ /g, '-')}`;
    listenBtn.hidden = mode === 'akustisch';
    listenBtn.textContent = `${SND_LABEL[sp.snd] || 'Stimme'} anhören`;
    getBirdMedia(sp).then(m => {
      if (deck[idx]?.sp !== sp) return;
      rExtract.textContent = m.extract || '';
      rWiki.href = m.url;
      if (m.thumb) { rImg.src = m.thumb; rImgWrap.hidden = mode !== 'akustisch'; }
    });
    revealBox.hidden = false;
    curate.hidden = false;
    if (mode === 'akustisch') loadAudio(false); // Titel jetzt mit Artinfos
    paintVerdict();
    revealBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    nextBtn.focus({ preventScroll: true });
  }
  function paintVerdict() {
    rVerdict.textContent = verdict ? 'Richtig' : (cfg.answer === 'tippen' && !guess.value.trim() ? 'Nicht beantwortet' : 'Falsch');
    rVerdict.className = 'verdict ' + (verdict ? 'ok' : 'no');
    rName.classList.toggle('ok', verdict);
    flipBtn.textContent = verdict ? 'Doch falsch' : 'Doch gewusst';
  }
  function grade(ok) {
    const { sp, mode } = deck[idx];
    answered++; if (ok) right++; else wrongs.push(deck[idx]);
    recordResult('artStats', `${sp.sci}|${mode}`, ok);
    player.pause();
    next();
  }

  function finish() {
    card.hidden = true;
    if (cfg.mode !== 'pruefung') { buildDeck(); card.hidden = false; return next(); }
    scoreRow.hidden = true; bar.hidden = true;
    const pct = right / deck.length * 100;
    const verdictText = pct >= 90 ? 'Mit Auszeichnung (ab 90 %)' : pct >= 80 ? 'Bestanden (ab 80 %)' : `${Math.round(pct)} % – bestanden ab 80 %`;
    endScreen.innerHTML = '';
    endScreen.append(
      h('p', { class: 'big' }, `${right} / ${deck.length}`),
      h('p', { class: `verdict ${pct >= 80 ? 'ok' : 'no'}` }, verdictText),
      h('p', { class: 'muted' }, 'Nur Teil A (Artenkenntnis). Die echte Prüfung enthält zusätzlich Wissensfragen.'),
    );
    if (wrongs.length) {
      endScreen.append(h('h3', {}, 'Nochmal anschauen'),
        h('ul', { class: 'wronglist' }, ...wrongs.map(w =>
          h('li', {}, h('b', {}, w.sp.de), ' ', h('i', {}, w.sp.sci), h('span', { class: 'muted' }, ` · ${w.mode === 'akustisch' ? 'Ton' : 'Foto'}`)))));
    }
    endScreen.append(h('button', { class: 'btn primary wide', onclick: start }, 'Neue Prüfung'));
    endScreen.hidden = false;
    controls.classList.remove('collapsed');
    endScreen.scrollIntoView({ behavior: 'smooth' });
  }

  /* ---------- Artenliste zum Lernen ---------- */
  function showList() {
    listView.hidden = false; listView.innerHTML = '';
    const st = stats('artStats');
    const acc = sp => {
      const es = ['optisch', 'akustisch'].map(m => st[`${sp.sci}|${m}`]).filter(Boolean);
      const r = es.reduce((a, e) => a + e.r, 0), n = es.reduce((a, e) => a + e.r + e.w, 0);
      return n ? Math.round(r / n * 100) : null;
    };
    const items = pool().sort((a, b) => a.de.localeCompare(b.de, 'de'));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const sp = items[+en.target.dataset.i];
      getBirdMedia(sp).then(m => { if (m.thumb) { const im = en.target.querySelector('img'); im.src = m.thumb; im.hidden = false; } });
    }), { rootMargin: '200px' });

    listView.append(h('p', { class: 'muted' }, `${items.length} Arten. Tippen zum Aufklappen, Stimme direkt abspielen.`));
    items.forEach((sp, i) => {
      const a = acc(sp);
      const player2 = h('audio', { controls: true, preload: 'none', hidden: true });
      const note = h('p', { class: 'audio-title' });
      let list2 = [], ptr = 0;
      const playBtn = h('button', { class: 'btn ghost small', type: 'button', onclick: async () => {
        if (!list2.length) { note.textContent = 'Suche …'; list2 = await getAudio(sp); }
        if (!list2.length) { note.textContent = 'Keine Aufnahme gefunden.'; return; }
        const r = list2[ptr++ % list2.length];
        player2.hidden = false; setAudioSources(player2, r); player2.play().catch(() => {});
        note.innerHTML = `${escapeHtml(r.title)}<br><a href="${r.link}" target="_blank" rel="noopener">${escapeHtml(r.info)}</a>`;
        playBtn.textContent = list2.length > 1 ? 'Nächste Aufnahme' : 'Nochmal';
      } }, `${SND_LABEL[sp.snd] || 'Stimme'} abspielen`);
      const resetBtn = h('button', { class: 'linkbtn', type: 'button', onclick: () => { resetAudioPrefs(sp.sci); list2 = []; ptr = 0; note.textContent = 'Ton-Auswahl zurückgesetzt.'; } }, 'Ton-Auswahl zurücksetzen');
      const el = h('details', { class: 'sp', 'data-i': i },
        h('summary', {},
          h('img', { alt: '', hidden: true }),
          h('span', { class: 'sp-names' }, h('b', {}, sp.de), h('i', {}, sp.sci)),
          a == null ? h('span', { class: 'acc none' }, 'neu') : h('span', { class: `acc ${a >= 80 ? 'good' : a >= 50 ? 'mid' : 'bad'}` }, `${a} %`)),
        h('div', { class: 'sp-body' },
          h('div', { class: 'chips' }, ...[sp.ord, sp.fam].filter(Boolean).map(t => h('span', { class: 'chip' }, t)),
            ...(sp.hab || []).map(k => h('span', { class: 'chip hab' }, HAB_LABEL[k]))),
          playBtn, player2, note,
          h('div', { class: 'links' },
            h('a', { href: `https://de.wikipedia.org/wiki/${encodeURIComponent(sp.de)}`, target: '_blank', rel: 'noopener' }, 'Wikipedia'),
            h('a', { href: `https://xeno-canto.org/species/${sp.sci.replace(/ /g, '-')}`, target: '_blank', rel: 'noopener' }, 'xeno-canto'),
            resetBtn)));
      listView.append(el);
      io.observe(el);
    });
  }

  return () => { token++; player.pause(); };
}
