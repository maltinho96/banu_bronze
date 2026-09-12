import { h } from '../lib/util.js';
import { save, remove } from '../lib/store.js';
import { getSpeciesList } from '../data/species.js';
import { parseRows, pickSheet } from '../lib/parse-list.js';
import { hasCuratedAudio, localPhotoCount, repoPhotoCount } from '../lib/media.js';

export function mount(root) {
  const list = getSpeciesList();
  const msg = h('p', { class: 'msg', 'aria-live': 'polite' });
  const file = h('input', { type: 'file', accept: '.xlsx,.xls', onchange: async e => {
    const f = e.target.files[0]; if (!f) return;
    msg.textContent = 'Lese Tabelle …'; msg.className = 'msg';
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[pickSheet(wb.SheetNames)], { header: 1, blankrows: false });
      const species = parseRows(rows);
      save('uploadedList', { species });
      msg.textContent = `${species.length} Arten übernommen. Gilt ab sofort in allen Bereichen.`;
    } catch (err) { msg.textContent = 'Fehler: ' + err.message; msg.className = 'msg err'; }
  } });

  root.append(
    h('section', { class: 'panel' },
      h('h2', {}, 'Artenliste'),
      h('p', {}, 'Aktiv: ', h('b', {}, list.name)),
      list.source === 'builtin' ? h('p', { class: 'warn' }, 'Das ist eine inoffizielle Übungsliste. Für die prüfungsrelevanten 75 Arten die offizielle BANU-Artenliste importieren.') : '',
      h('p', { class: 'muted small' }, 'Offizielle Liste: ', h('a', { href: 'https://banu-akademien.de/download-feldornithologie/', target: '_blank', rel: 'noopener' }, 'banu-akademien.de → Download Feldornithologie'),
        '. Am besten einmal im Repo mit „npm run import-list“ umwandeln – dann ist sie auf allen Geräten dabei. Alternativ hier direkt auf diesem Gerät laden:'),
      file, msg,
      h('button', { class: 'btn ghost small', type: 'button', onclick: () => { remove('uploadedList'); msg.textContent = 'Import entfernt – Liste aus dem Repo bzw. Übungsliste aktiv.'; } }, 'Import entfernen')),
    h('section', { class: 'panel' },
      h('h2', {}, 'Tonaufnahmen'),
      h('p', {}, hasCuratedAudio()
        ? 'Kuratierte xeno-canto-Aufnahmen sind eingebunden (audio.json). Commons dient nur als Ergänzung.'
        : 'Noch keine kuratierten Aufnahmen – es wird live auf Wikimedia Commons gesucht. Bessere Qualität: „npm run fetch-audio“ mit xeno-canto-API-Key (siehe README).'),
      h('p', { class: 'muted small' }, 'Beim Üben nach dem Auflösen: „Passt nicht“ sperrt eine Aufnahme dauerhaft, „Als Standard merken“ setzt sie an die erste Stelle. Gespeichert wird nur auf diesem Gerät.'),
      h('p', { class: 'muted small' }, 'Kommt bei vielen Arten „Keine Aufnahme gefunden“, hilft ein Blick in die Browser-Konsole: Dort steht, ob die Commons-Suche fehlgeschlagen ist. Ohne Internetverbindung bleiben Bilder und Töne leer.')),
    h('section', { class: 'panel' },
      h('h2', {}, 'Bilder'),
      h('p', {}, `Ausgewählt: ${localPhotoCount()} auf diesem Gerät, ${repoPhotoCount()} im Repo.`),
      h('p', { class: 'muted small' }, 'Im Bild-Kurator sammelst du pro Merkmal beliebig viele passende Bilder – auch von verschiedenen Arten oder über einen eigenen Link. Im Training wird abwechselnd eines davon gezeigt. Ohne Auswahl nimmt die App das Wikipedia-Artikelbild.'),
      h('a', { class: 'btn primary wide', href: '#/bilder', style: 'display:block;text-align:center;text-decoration:none' }, 'Bilder auswählen')),
    h('section', { class: 'panel' },
      h('h2', {}, 'Fortschritt'),
      h('p', { class: 'muted small' }, 'Deine Ergebnisse bleiben im Browser dieses Geräts gespeichert.'),
      h('button', { class: 'btn ghost small', type: 'button', onclick: () => {
        if (!confirm('Alle Lernstatistiken löschen?')) return;
        ['artStats', 'topoStats', 'qStats', 'bzStats'].forEach(remove); msg.textContent = 'Statistiken gelöscht.';
      } }, 'Statistiken zurücksetzen')),
    h('section', { class: 'panel' },
      h('h2', {}, 'Zur Prüfung (Bronze)'),
      h('p', {}, '30 zufällige Arten aus der 75er-Liste, optisch (Prachtkleid) und akustisch (typische Gesänge), dazu Grundwissen zu Systematik, Morphologie, Lebensräumen und Recht. Bestanden ab 80 %, mit Auszeichnung ab 90 %.'),
      h('p', { class: 'muted small' }, 'Beschriften von Vogelzeichnung, Kopfmuster und Flügel steht im Fragenkatalog für alle Stufen – dafür ist der Bereich Topografie da. Brutzeitcodes werden ebenfalls ab Bronze abgefragt.'),
      h('p', { class: 'muted small' }, 'Quellen: Fotos und Texte von Wikipedia, Töne von xeno-canto und Wikimedia Commons (Lizenzen je Aufnahme). Fragen nach den exemplarischen BANU-Prüfungsfragen; Antworten sind Lernhilfen ohne Gewähr.')),
  );
}
