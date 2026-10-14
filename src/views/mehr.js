import { h } from '../lib/util.js';
import { remove } from '../lib/store.js';
import { getSpeciesList } from '../data/species.js';
import { hasCuratedAudio, localPhotoCount, repoPhotoCount, autoPhotoCount, clearAutoPhotos } from '../lib/media.js';

export function mount(root) {
  const list = getSpeciesList();
  const msg = h('p', { class: 'msg', 'aria-live': 'polite' });

  root.append(
    h('section', { class: 'panel' },
      h('h2', {}, 'Artenliste'),
      h('p', {}, 'Aktiv: ', h('b', {}, list.name)),
      h('p', { class: 'muted small' }, list.level === 's'
        ? 'Die 150 Arten der BANU-Liste Silber (Bronze + 75 weitere), mit Brut-Lebensräumen aus der BANU-Tabelle. Oben zwischen Bronze und Silber umschalten.'
        : 'Die 75 Arten der offiziellen BANU-Liste Bronze, mit Bruthabitaten aus der BANU-Tabelle. Oben auf Silber umschalten für 150 Arten.')),
    h('section', { class: 'panel' },
      h('h2', {}, 'Tonaufnahmen'),
      h('p', {}, hasCuratedAudio()
        ? 'Kuratierte xeno-canto-Aufnahmen sind eingebunden (audio.json). Commons dient nur als Ergänzung.'
        : 'Noch keine kuratierten Aufnahmen – es wird live auf Wikimedia Commons gesucht. Bessere Qualität: „npm run fetch-audio“ mit xeno-canto-API-Key (siehe README).'),
      h('p', { class: 'muted small' }, 'Die Aufnahmen wechseln: Kommt eine Art wieder dran, spielt die App reihum eine andere der bis zu 5 besten Aufnahmen.'),
      h('p', { class: 'muted small' }, 'Kommt bei vielen Arten „Keine Aufnahme gefunden“, hilft ein Blick in die Browser-Konsole: Dort steht, ob die Commons-Suche fehlgeschlagen ist. Ohne Internetverbindung bleiben Bilder und Töne leer.')),
    h('section', { class: 'panel' },
      h('h2', {}, 'Bilder'),
      h('p', {}, `Ausgewählt: ${localPhotoCount()} auf diesem Gerät, ${repoPhotoCount()} im Repo.`),
      h('p', { class: 'muted small' }, 'Im Bild-Kurator sammelst du pro Merkmal beliebig viele passende Bilder – auch von verschiedenen Arten oder über einen eigenen Link. Im Training wird abwechselnd eines davon gezeigt. Ohne Auswahl nimmt die App das Wikipedia-Artikelbild.'),
      h('a', { class: 'btn primary wide', href: '#/bilder', style: 'display:block;text-align:center;text-decoration:none' }, 'Bilder auswählen'),
      h('p', { class: 'muted small' }, `Beim Artentrainer wechseln die Fotos: pro Art bis zu 5 Bilder, reihum. Arten ohne eigene Auswahl bekommen sie automatisch von Wikimedia Commons (bisher für ${autoPhotoCount()} Arten gemerkt).`),
      h('button', { class: 'btn ghost small', type: 'button', onclick: e => {
        clearAutoPhotos(); e.currentTarget.textContent = 'Wird beim nächsten Üben neu gesucht';
      } }, 'Automatische Fotos neu suchen')),
    h('section', { class: 'panel' },
      h('h2', {}, 'Fortschritt'),
      h('p', { class: 'muted small' }, 'Deine Ergebnisse bleiben im Browser dieses Geräts gespeichert.'),
      h('button', { class: 'btn ghost small', type: 'button', onclick: () => {
        if (!confirm('Alle Lernstatistiken löschen?')) return;
        ['artStats', 'topoStats', 'qStats', 'bzStats'].forEach(remove); msg.textContent = 'Statistiken gelöscht. Die Bildauswahl bleibt erhalten.';
      } }, 'Statistiken zurücksetzen'), msg),
    h('section', { class: 'panel' },
      h('h2', {}, `Zur Prüfung (${list.level === 's' ? 'Silber' : 'Bronze'})`),
      list.level === 's'
        ? h('p', {}, 'Teil A: 60 Arten aus der 150er-Liste, optisch (Pracht- und Schlichtkleid, beide Geschlechter) und akustisch (auch schwierige Gesänge und Rufe), teils im Gelände – 60 Punkte. Teil B: 20 Punkte zu Systematik, Biologie und Ökologie, Lebensräumen, Schutzstatus und Roter Liste. Bestanden ab 64 von 80 Punkten (80 %), mit Auszeichnung ab 72 (90 %).')
        : h('p', {}, '30 zufällige Arten aus der 75er-Liste, optisch (Prachtkleid) und akustisch (typische Gesänge), dazu Grundwissen zu Systematik, Morphologie, Lebensräumen und Recht. Bestanden ab 80 %, mit Auszeichnung ab 90 %.'),
      h('p', { class: 'muted small' }, 'Beschriften von Vogelzeichnung, Kopfmuster und Flügel steht im Fragenkatalog für alle Stufen – dafür ist der Bereich Topografie da. Brutzeitcodes werden ebenfalls ab Bronze abgefragt.'),
      h('p', { class: 'muted small' }, 'Quellen: Fotos und Texte von Wikipedia, Töne von xeno-canto und Wikimedia Commons (Lizenzen je Aufnahme). Fragen nach den exemplarischen BANU-Prüfungsfragen; Antworten sind Lernhilfen ohne Gewähr.')),
  );
}
