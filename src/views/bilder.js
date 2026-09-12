import { h, escapeHtml } from '../lib/util.js';
import { EXAMPLES } from '../data/topo-examples.js';
import { DIAGRAMS, termsFor } from '../data/topography.js';
import { getSpeciesList } from '../data/species.js';
import {
  getPhotoCandidates, getCuratedPhotos, isPickedPhoto, toggleCuratedPhoto,
  photoFromLink, curatedPhotos, localPhotoCount, repoPhotoCount, clearLocalPhotos,
} from '../lib/media.js';

/* Bild-Kurator: pro Motiv beliebig viele passende Bilder sammeln – aus der
 * Commons-Suche, über weitere Arten oder per eingefügtem Link. Am Ende als
 * src/data/photos.json exportieren und ins Repo committen. */

export function mount(root, ctx) {
  const lvl = ctx.level === 'b' ? 'b' : 's';
  const species = getSpeciesList().species;

  /* Steht im Dateinamen eines eingefügten Bildes eine Art aus der Liste,
   * wird sie übernommen – sonst gilt die Art des Motivs. */
  const nrm = t => (t || '').toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  function speciesFromTitle(title) {
    const t = nrm(title);
    const hit = species.find(sp => t.includes(nrm(sp.de)) || t.includes(nrm(sp.sci)));
    return hit ? hit.de : null;
  }
  const levelTerms = new Set(DIAGRAMS
    .filter(d => !d.onlyLevel || d.onlyLevel === lvl)
    .flatMap(d => termsFor(d, lvl)));

  const subjects = () => {
    const topo = EXAMPLES
      .filter(e => levelTerms.has(e.term))
      .map(e => ({ key: `topo:${e.term}`, label: e.term, sub: e.wp, article: e.wp, sci: null, note: e.note }));
    const art = species.map(sp => ({ key: `art:${sp.sci}`, label: sp.de, sub: sp.sci, article: sp.de, sci: sp.sci, note: '' }));
    return group === 'topo' ? topo : art;
  };

  let filter = 'offen';
  let group = 'topo';

  const status = h('p', { class: 'muted small' });
  const list = h('div', { class: 'curlist' });

  function seg(options, onChange) {
    const el = h('div', { class: 'seg' });
    options.forEach(([v, label], i) => el.append(h('button', {
      type: 'button', role: 'radio', 'aria-checked': String(i === 0), 'data-v': v,
      onclick: e => {
        el.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', String(b === e.currentTarget)));
        onChange(v);
      },
    }, label)));
    return el;
  }

  const exportBtn = h('button', { class: 'btn primary wide', type: 'button', onclick: doExport }, 'Auswahl als photos.json herunterladen');
  const copyBtn = h('button', { class: 'btn ghost small', type: 'button', onclick: doCopy }, 'JSON in die Zwischenablage');
  const resetBtn = h('button', { class: 'btn ghost small', type: 'button', onclick: () => {
    if (!confirm('Alle auf diesem Gerät ausgewählten Bilder verwerfen?')) return;
    clearLocalPhotos(); render();
  } }, 'Auswahl auf diesem Gerät verwerfen');
  const msg = h('p', { class: 'msg' });

  root.append(
    h('section', { class: 'panel' },
      h('h2', {}, 'Bilder auswählen'),
      h('p', { class: 'muted small' }, 'Pro Merkmal kannst du mehrere Bilder sammeln – auch von verschiedenen Arten. Im Training wird dann abwechselnd eines davon gezeigt. Die Auswahl gilt sofort auf diesem Gerät; für alle Geräte unten exportieren und als src/data/photos.json ins Repo legen.'),
      h('p', { class: 'muted small' }, lvl === 'b'
        ? 'Stufe Bronze: nur die Merkmale, die in der Bronze-Prüfung vorkommen. Für mehr oben auf Silber umschalten.'
        : 'Stufe Silber/Gold: alle Merkmale.'),
      h('div', { class: 'ctrl' }, h('span', { class: 'lbl' }, 'Bereich'),
        seg([['topo', 'Merkmale'], ['art', 'Arten']], v => { group = v; render(); })),
      h('div', { class: 'ctrl' }, h('span', { class: 'lbl' }, 'Anzeigen'),
        seg([['offen', 'Noch offen'], ['fertig', 'Mit Bildern'], ['alle', 'Alle']], v => { filter = v; render(); })),
      status),
    list,
    h('section', { class: 'panel' },
      h('h2', {}, 'Export'),
      exportBtn, h('div', { class: 'audio-actions' }, copyBtn, resetBtn), msg,
      h('p', { class: 'muted small' }, 'Datei danach nach src/data/photos.json verschieben, committen und pushen.')),
    h('p', { class: 'muted small credit' }, 'Bilder von Wikipedia und Wikimedia Commons. Urheber und Lizenz werden mitgespeichert.'));

  function render() {
    const picks = curatedPhotos();
    const all = subjects();
    const done = all.filter(s => picks[s.key]?.length).length;
    status.textContent = `${done} von ${all.length} Motiven mit Bild · ${localPhotoCount()} Bilder auf diesem Gerät, ${repoPhotoCount()} im Repo.`;
    const shown = all.filter(s => filter === 'alle' || (filter === 'fertig' ? picks[s.key]?.length : !picks[s.key]?.length));
    list.innerHTML = '';
    if (!shown.length) { list.append(h('p', { class: 'muted' }, 'Nichts in dieser Ansicht.')); return; }
    shown.forEach(s => list.append(subjectRow(s)));
  }

  function subjectRow(s) {
    const n = getCuratedPhotos(s.key).length;
    const body = h('div', { class: 'cur-body' });
    const badge = h('span', { class: n ? 'acc good' : 'acc none' }, n ? `${n} Bild${n > 1 ? 'er' : ''}` : 'offen');
    const thumb = h('span', { class: 'cur-thumb' });
    const first = getCuratedPhotos(s.key)[0];
    thumb.append(first ? h('img', { alt: '', src: first.thumb, loading: 'lazy' }) : h('span', { class: 'cur-empty' }, '?'));
    const det = h('details', { class: 'cur' },
      h('summary', {}, thumb, h('span', { class: 'sp-names' }, h('b', {}, s.label), h('i', {}, s.sub)), badge),
      body);
    det.addEventListener('toggle', () => { if (det.open && !body.dataset.loaded) openSubject(s, body, thumb, badge); });
    return det;
  }

  async function openSubject(s, body, thumb, badge) {
    body.dataset.loaded = '1';
    const chosen = h('div', { class: 'cur-chosen' });
    const grid = h('div', { class: 'cur-grid' });
    const gridNote = h('p', { class: 'muted small' }, 'Suche Bilder …');

    const refresh = () => {
      const list2 = getCuratedPhotos(s.key);
      badge.textContent = list2.length ? `${list2.length} Bild${list2.length > 1 ? 'er' : ''}` : 'offen';
      badge.className = list2.length ? 'acc good' : 'acc none';
      thumb.innerHTML = list2[0] ? `<img alt="" src="${escapeHtml(list2[0].thumb)}">` : '<span class="cur-empty">?</span>';
      chosen.innerHTML = '';
      if (!list2.length) { chosen.append(h('p', { class: 'muted small' }, 'Noch kein Bild gewählt – unten antippen.')); }
      else {
        chosen.append(h('p', { class: 'muted small' }, `Ausgewählt (${list2.length}):`));
        list2.forEach(pRec => chosen.append(h('div', { class: 'cur-row' },
          h('img', { alt: '', src: pRec.thumb, loading: 'lazy' }),
          h('span', { class: 'cur-row-txt' },
            h('b', {}, pRec.sp || pRec.title),
            h('span', { class: 'muted small' }, [pRec.by, pRec.lic].filter(Boolean).join(' · ') || pRec.title)),
          h('button', { class: 'linkbtn', type: 'button', onclick: () => { toggleCuratedPhoto(s.key, pRec); refresh(); markGrid(); } }, 'Entfernen'))));
      }
      status.textContent = `${localPhotoCount()} Bilder auf diesem Gerät ausgewählt.`;
    };
    const markGrid = () => grid.querySelectorAll('.cur-cand').forEach(b =>
      b.setAttribute('aria-pressed', String(isPickedPhoto(s.key, b.dataset.src))));

    const addCandidates = cands => {
      cands.forEach(c => {
        if (grid.querySelector(`[data-src="${CSS.escape(c.src)}"]`)) return;
        grid.append(h('button', {
          type: 'button', class: 'cur-cand', 'data-src': c.src, title: c.title,
          'aria-pressed': String(isPickedPhoto(s.key, c.src)),
          onclick: () => { toggleCuratedPhoto(s.key, c); refresh(); markGrid(); },
        },
          h('img', { alt: '', src: c.thumb, loading: 'lazy' }),
          h('span', { class: 'cur-meta' }, c.sp && c.sp !== s.article ? `${c.sp} · ` : '',
            [c.by, c.lic].filter(Boolean).join(' · ') || c.title.slice(0, 40))));
      });
    };

    // weitere Art suchen
    const spInput = h('input', { type: 'text', placeholder: 'Weitere Art, z. B. Fitis', enterkeyhint: 'search' });
    const spMsg = h('span', { class: 'muted small' });
    const spGo = async () => {
      const name = spInput.value.trim();
      if (!name) return;
      spMsg.textContent = `Suche Bilder zu ${name} …`;
      const more = await getPhotoCandidates(name, null);
      spMsg.textContent = more.length ? `${more.length} Bilder zu ${name} ergänzt.` : `Nichts zu ${name} gefunden.`;
      addCandidates(more);
      spInput.value = '';
    };
    spInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); spGo(); } });

    // eigener Link
    const linkInput = h('input', { type: 'text', placeholder: 'Link zu einem Bild oder einer Commons-Dateiseite', enterkeyhint: 'done' });
    const linkMsg = h('span', { class: 'msg small' });
    const linkGo = async () => {
      linkMsg.className = 'msg small';
      try {
        const rec = await photoFromLink(linkInput.value, s.article);
        rec.sp = speciesFromTitle(rec.title) || rec.sp || s.article;
        addCandidates([rec]);
        toggleCuratedPhoto(s.key, rec);
        refresh(); markGrid();
        linkInput.value = '';
        linkMsg.textContent = `Bild übernommen (wird als „${rec.sp}“ angezeigt).`;
      } catch (err) { linkMsg.className = 'msg small err'; linkMsg.textContent = err.message; }
    };
    linkInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); linkGo(); } });

    body.innerHTML = '';
    if (s.note) body.append(h('p', { class: 'muted small' }, `Worauf achten: ${s.note}`));
    body.append(chosen, gridNote, grid,
      h('div', { class: 'cur-add' }, spInput, h('button', { class: 'btn ghost small', type: 'button', onclick: spGo }, 'Art suchen'), spMsg),
      h('div', { class: 'cur-add' }, linkInput, h('button', { class: 'btn ghost small', type: 'button', onclick: linkGo }, 'Link übernehmen'), linkMsg));
    refresh();

    const cands = await getPhotoCandidates(s.article, s.sci);
    gridNote.textContent = cands.length
      ? 'Antippen wählt aus, nochmal antippen entfernt wieder. Mehrere Bilder sind erlaubt.'
      : 'Keine Bilder gefunden – über „Art suchen“ oder einen eigenen Link ergänzen.';
    addCandidates(cands);
    markGrid();
  }

  function json() { return JSON.stringify(curatedPhotos(), null, 1); }

  function doExport() {
    const blob = new Blob([json()], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: 'photos.json' });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    msg.className = 'msg';
    msg.textContent = 'photos.json heruntergeladen – ins Repo unter src/data/ legen.';
  }
  async function doCopy() {
    try { await navigator.clipboard.writeText(json()); msg.className = 'msg'; msg.textContent = 'JSON kopiert – in src/data/photos.json einfügen.'; }
    catch { msg.className = 'msg err'; msg.textContent = 'Kopieren nicht erlaubt – bitte den Download nutzen.'; }
  }

  render();
}
