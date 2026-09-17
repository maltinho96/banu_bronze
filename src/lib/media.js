/* Bilder (Wikipedia) und Tonaufnahmen (xeno-canto-JSON + Wikimedia Commons).
 *
 * Warum die Töne vorher „nicht passten“:
 *  - Die Commons-Volltextsuche findet auch Dateien, in deren BESCHREIBUNG der
 *    Name nur vorkommt (Begleitarten, Kategorien) → falsche Vögel.
 *  - Rufe/Bettelrufe/Jungvögel wurden gleichrangig zu Gesängen behandelt.
 *  - .ogg-Dateien spielen auf dem iPhone nicht ab.
 * Jetzt: Suche nur im DATEINAMEN (intitle), Pflicht-Treffer auf den
 * wissenschaftlichen Namen, Ranking nach Gesang/Ruf, mp3-Umwandlung von
 * Commons, und eigene Sperr-/Merkliste. Beste Qualität: vorab mit
 * `npm run fetch-audio` kuratierte xeno-canto-Aufnahmen (src/data/audio.json).
 */
import { load, save } from './store.js';
import { norm, shuffle } from './util.js';

const xcFiles = import.meta.glob('../data/audio.json', { eager: true, import: 'default' });
const XC = Object.values(xcFiles)[0] || {};

/* Von Hand ausgewählte Bilder aus dem Repo (über den Bild-Kurator erzeugt). */
const photoFiles = import.meta.glob('../data/photos.json', { eager: true, import: 'default' });
const REPO_PHOTOS = Object.values(photoFiles)[0] || {};

const mediaCache = new Map();
const audioCache = new Map();
const habCache = new Map();

/* ---------------- Vogelfoto ---------------- */
async function wpPage(title) {
  const url = 'https://de.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1' +
    '&prop=pageimages%7Cextracts&piprop=thumbnail&pithumbsize=900&exintro=1&explaintext=1&exsentences=2' +
    '&titles=' + encodeURIComponent(title);
  const j = await (await fetch(url)).json();
  for (const p of Object.values(j?.query?.pages || {})) {
    if (p.thumbnail?.source) {
      return {
        thumb: p.thumbnail.source,
        extract: p.extract || '',
        url: 'https://de.wikipedia.org/wiki/' + encodeURIComponent(p.title.replace(/ /g, '_')),
      };
    }
  }
  return null;
}

export async function getBirdMedia(sp) {
  if (mediaCache.has(sp.sci)) return mediaCache.get(sp.sci);
  let m = null;
  try { m = await wpPage(sp.de); } catch { /* offline */ }
  if (!m) { try { m = await wpPage(sp.sci); } catch { /* offline */ } }
  if (!m) m = { thumb: null, extract: '', url: 'https://de.wikipedia.org/wiki/' + encodeURIComponent(sp.de) };
  mediaCache.set(sp.sci, m);
  return m;
}

/* ---------------- Bild-Kuratierung ----------------
 * Ein „Schlüssel“ ist die Stelle, an der ein Bild gebraucht wird, z. B.
 *   topo:Nacken   – Foto für den Topografie-Begriff Nacken
 *   art:Turdus merula – Foto der Art im Artentrainer
 * Ausgewählte Bilder liegen zuerst im Browser (sofort wirksam) und lassen
 * sich im Bereich „Mehr“ als src/data/photos.json exportieren. Liegt die
 * Datei im Repo, gilt sie für alle Geräte. */

/* Gespeichert wird pro Schlüssel eine LISTE von Bildern – so lassen sich
 * mehrere Arten für dasselbe Merkmal hinterlegen. Ältere Dateien mit nur
 * einem Objekt je Schlüssel werden weiterhin gelesen. */
const asList = v => (!v ? [] : Array.isArray(v) ? v : [v]);

export function getCuratedPhotos(key) {
  const local = load('photoPick', {});
  if (key in local) return asList(local[key]);
  return asList(REPO_PHOTOS[key]);
}
/** Ein Bild für die Anzeige – bei mehreren wird zufällig gewechselt. */
export function getCuratedPhoto(key) {
  const list = getCuratedPhotos(key);
  return list.length ? list[Math.floor(Math.random() * list.length)] : null;
}
export function isPickedPhoto(key, src) {
  return getCuratedPhotos(key).some(p => p.src === src);
}
/** Bild hinzufügen oder (wenn schon drin) wieder entfernen. */
export function toggleCuratedPhoto(key, photo) {
  const local = load('photoPick', {});
  const list = asList(key in local ? local[key] : REPO_PHOTOS[key]);
  const i = list.findIndex(p => p.src === photo.src);
  if (i >= 0) list.splice(i, 1); else list.push(photo);
  if (list.length) local[key] = list; else delete local[key];
  save('photoPick', local);
  return list;
}
export function curatedPhotos() {
  const out = {};
  for (const [k, v] of Object.entries(REPO_PHOTOS)) out[k] = asList(v);
  for (const [k, v] of Object.entries(load('photoPick', {}))) out[k] = asList(v);
  return out;
}
export function localPhotoCount() {
  return Object.values(load('photoPick', {})).reduce((n, v) => n + asList(v).length, 0);
}
export function repoPhotoCount() {
  return Object.values(REPO_PHOTOS).reduce((n, v) => n + asList(v).length, 0);
}
export function clearLocalPhotos() { save('photoPick', {}); }

/* ---------------- Bild über einen Link hinzufügen ----------------
 * Erlaubt sind: Commons-Dateiseite, direkte upload.wikimedia.org-Adresse,
 * eine Wikipedia-Artikeladresse oder irgendeine https-Bildadresse. */
export async function photoFromLink(input, fallbackSp = '') {
  const raw = (input || '').trim();
  if (!raw) throw new Error('Bitte einen Link einfügen.');
  if (!/^https?:\/\//i.test(raw)) throw new Error('Das sieht nicht nach einer Adresse aus (muss mit https:// beginnen).');
  let url;
  try { url = new URL(raw); } catch { throw new Error('Die Adresse ist unvollständig.'); }

  // Commons-Dateiseite → über die API Vorschaubild, Urheber und Lizenz holen
  const fileMatch = decodeURIComponent(url.pathname).match(/\/(?:wiki|File)\/(?:File|Datei):(.+)$/i);
  if (/wikimedia\.org$/i.test(url.hostname) && fileMatch) {
    const rec = await commonsFile('File:' + fileMatch[1]);
    if (rec) return { ...rec, sp: fallbackSp };
    throw new Error('Diese Commons-Datei ließ sich nicht laden.');
  }
  // Wikipedia-Artikel → Artikelbild verwenden
  if (/wikipedia\.org$/i.test(url.hostname)) {
    const title = decodeURIComponent(url.pathname.replace(/^\/wiki\//, '')).replace(/_/g, ' ');
    const m = await wpPage(title);
    if (m?.thumb) return { src: m.thumb, thumb: m.thumb, title: `${title} (Artikelbild)`, by: '', lic: '', link: m.url, sp: title };
    throw new Error('Zu diesem Artikel gibt es kein Bild.');
  }
  // direkte Bildadresse
  if (!/\.(jpe?g|png|webp|gif)$/i.test(url.pathname)) {
    throw new Error('Kein Bild erkannt. Nutze die Commons-Dateiseite oder eine Adresse, die auf .jpg oder .png endet.');
  }
  return { src: raw, thumb: raw, title: decodeURIComponent(url.pathname.split('/').pop()), by: '', lic: '', link: raw, sp: fallbackSp };
}

async function commonsFile(title) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
    '&titles=' + encodeURIComponent(title) +
    '&prop=imageinfo&iiprop=url%7Cmime%7Cextmetadata&iiurlwidth=640' +
    '&iiextmetadatafilter=Artist%7CLicenseShortName';
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Commons HTTP ${r.status}`);
  const j = await r.json();
  for (const p of Object.values(j?.query?.pages || {})) {
    const ii = p.imageinfo?.[0];
    if (!ii?.url) continue;
    const meta = ii.extmetadata || {};
    const strip = v => String(v || '').replace(/<[^>]*>/g, '').trim();
    return {
      src: ii.thumburl || ii.url,
      thumb: ii.thumburl || ii.url,
      title: (p.title || '').replace(/^File:|^Datei:/, '').replace(/\.(jpe?g|png|webp|gif|tiff?)$/i, '').replace(/_/g, ' '),
      by: strip(meta.Artist?.value).slice(0, 80),
      lic: strip(meta.LicenseShortName?.value),
      link: ii.descriptionurl || 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(p.title),
    };
  }
  return null;
}

const candCache = new Map();

/** Bildkandidaten zu einer Art: erst das Wikipedia-Artikelbild, dann Commons-Dateien. */
export async function getPhotoCandidates(article, sci) {
  const ck = `${article}|${sci || ''}`;
  if (candCache.has(ck)) return candCache.get(ck);
  const out = [];
  const seen = new Set();
  const push = r => { if (r && !seen.has(r.src)) { seen.add(r.src); out.push(r); } };

  try {
    const m = await wpPage(article);
    if (m?.thumb) push({ src: m.thumb, thumb: m.thumb, title: `${article} (Artikelbild)`, by: '', lic: '', link: m.url, sp: article });
  } catch { /* offline */ }

  const terms = [sci, article].filter(Boolean);
  for (const t of terms) {
    if (out.length >= 8) break;
    try {
      const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
        '&generator=search&gsrnamespace=6&gsrlimit=12' +
        '&gsrsearch=' + encodeURIComponent(`intitle:"${t}" filetype:bitmap`) +
        '&prop=imageinfo&iiprop=url%7Cmime%7Cextmetadata&iiurlwidth=640' +
        '&iiextmetadatafilter=Artist%7CLicenseShortName';
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      for (const p of Object.values(j?.query?.pages || {})) {
        const ii = p.imageinfo?.[0];
        if (!ii?.url || !/^image\//.test(ii.mime || '')) continue;
        const title = (p.title || '').replace(/^File:|^Datei:/, '');
        if (!norm(title).includes(norm(t))) continue;
        if (/(egg|ei\b|nest|skull|skelett|distribution|map|karte|sonagram|spectrogram|stamp|briefmarke|zeichnung|drawing|illustration|plate)/i.test(title)) continue;
        const meta = ii.extmetadata || {};
        const strip = v => String(v || '').replace(/<[^>]*>/g, '').trim();
        push({
          src: ii.thumburl || ii.url,
          thumb: ii.thumburl || ii.url,
          title: title.replace(/\.(jpe?g|png|webp|gif|tiff?)$/i, '').replace(/_/g, ' '),
          by: strip(meta.Artist?.value).slice(0, 80),
          lic: strip(meta.LicenseShortName?.value),
          link: ii.descriptionurl || 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(p.title),
          sp: article,
        });
      }
    } catch (e) { console.warn('Commons-Bildsuche:', e.message); }
  }
  candCache.set(ck, out);
  return out;
}

/* ---------------- Lebensraumfoto ---------------- */
const HAB_ARTICLES = {
  kueste: ['Salzwiese', 'Wattenmeer', 'Deich'],
  gewaesser: ['Röhricht', 'Verlandung', 'Teich'],
  wald: ['Mischwald', 'Laubwald', 'Buchenwald'],
  agrar: ['Feldflur', 'Agrarlandschaft', 'Hecke'],
  siedlung: ['Kleingarten', 'Stadtpark', 'Dorf'],
  alpin: ['Almwiese', 'Alpine Höhenstufe', 'Latschenkiefer'],
};
export async function getHabitatImage(key) {
  if (habCache.has(key)) return habCache.get(key);
  for (const t of shuffle([...(HAB_ARTICLES[key] || [])])) {
    try { const m = await wpPage(t); if (m?.thumb) { habCache.set(key, m.thumb); return m.thumb; } } catch { /* weiter */ }
  }
  habCache.set(key, null);
  return null;
}

/* ---------------- Ton: Sperr- und Merkliste ----------------
 * „Passt nicht“ blendet eine Aufnahme dauerhaft aus, „Als Standard merken“
 * setzt sie bei dieser Art an die erste Stelle. Gilt nur auf diesem Gerät. */
export function banAudio(sci, src) {
  const b = load('audioBan', {});
  (b[sci] ||= []).includes(src) || b[sci].push(src);
  save('audioBan', b);
  const p = load('audioPin', {});
  if (p[sci] === src) { delete p[sci]; save('audioPin', p); }
  audioCache.delete(sci);
}
export function pinAudio(sci, src) {
  const p = load('audioPin', {}); p[sci] = src; save('audioPin', p);
  audioCache.delete(sci);
}
export function isPinned(sci, src) { return load('audioPin', {})[sci] === src; }
export function resetAudioPrefs(sci) {
  const b = load('audioBan', {}); delete b[sci]; save('audioBan', b);
  const p = load('audioPin', {}); delete p[sci]; save('audioPin', p);
  audioCache.delete(sci);
}

/* ---------------- Ton: Commons ---------------- */
const WORDS = {
  song: /(song|singing|sings|gesang|chant|canto)/,
  call: /(call|calls|ruf|rufe|alarm|flight|contact|flug)/,
  drumming: /(drum|trommel)/,
  bad: /(juvenile|juv|begging|bettel|nestling|chick|küken|jung|captive|mimic|imitat|playback)/,
};

function scientificNames(sp) {
  return [sp.sci, ...(sp.syn || []).filter(s => /^[A-Z][a-z]+ [a-z]+$/.test(s))];
}

/* Abspielbare Quellen zu einer Commons-Datei.
 * Commons legt zu ogg/wav/flac automatisch eine mp3-Umwandlung unter einem
 * festen Pfad ab – die brauchen iPhones, weil Safari kein Ogg Vorbis abspielt.
 * Original:  …/commons/a/ab/Name.ogg
 * Umwandlung: …/commons/transcoded/a/ab/Name.ogg/Name.ogg.mp3
 * Existiert sie einmal nicht, greift die Original-Quelle als Fallback. */
function sourcesFor(url, mime) {
  if (/\.mp3$/i.test(url)) return [{ src: url, type: 'audio/mpeg' }];
  const out = [];
  const m = url.match(/^(https?:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/([0-9a-f])\/([0-9a-f]{2})\/(.+)$/i);
  if (m) out.push({ src: `${m[1]}/transcoded/${m[2]}/${m[3]}/${m[4]}/${m[4]}.mp3`, type: 'audio/mpeg' });
  out.push({ src: url, type: mime || '' });
  return out;
}

/** Hängt die Quellen an ein <audio>-Element; der Browser nimmt die erste, die er kann. */
export function setAudioSources(player, rec) {
  player.pause();
  player.removeAttribute('src');
  [...player.querySelectorAll('source')].forEach(s => s.remove());
  if (!rec) { player.load(); return; }
  for (const s of rec.srcs || [{ src: rec.src, type: '' }]) {
    const el = document.createElement('source');
    el.src = s.src;
    if (s.type) el.type = s.type;
    player.append(el);
  }
  player.load();
}

async function commonsSearch(search, limit = 30) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
    `&generator=search&gsrnamespace=6&gsrlimit=${limit}` +
    '&gsrsearch=' + encodeURIComponent(search) +
    '&prop=imageinfo&iiprop=url%7Cmime';
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Commons HTTP ${r.status}`);
  const j = await r.json();
  return Object.values(j?.query?.pages || {});
}

function toRecord(page, sp, wanted) {
  const ii = page.imageinfo?.[0];
  if (!ii?.url) return null;
  const title = (page.title || '').replace(/^File:|^Datei:/, '');
  const t = norm(title);
  if (!wanted.some(w => w && t.includes(w))) return null; // Name muss im Dateinamen stehen
  const low = title.toLowerCase();
  let score = 0;
  if (WORDS.song.test(low)) score += sp.snd === 'song' ? 4 : 1;
  if (WORDS.call.test(low)) score += sp.snd === 'call' ? 4 : -1;
  if (WORDS.drumming.test(low)) score += sp.snd === 'drumming' ? 5 : -1;
  if (WORDS.bad.test(low)) score -= 4;
  if (/^xc\d+|xeno/i.test(title)) score += 1;
  return {
    src: ii.url,
    srcs: sourcesFor(ii.url, ii.mime),
    title: title.replace(/\.(ogg|oga|mp3|wav|flac|opus|webm)$/i, '').replace(/_/g, ' '),
    info: 'Wikimedia Commons',
    link: ii.descriptionurl || 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(page.title),
    score,
  };
}

async function commonsAudio(sp) {
  const sciNames = scientificNames(sp);
  const sciNorm = sciNames.map(norm);
  const deNorm = [norm(sp.de)];
  const out = [];
  const seen = new Set();
  const add = (pages, wanted) => {
    for (const p of pages) {
      const rec = toRecord(p, sp, wanted);
      if (rec && !seen.has(rec.src)) { seen.add(rec.src); out.push(rec); }
    }
  };
  // 1. wissenschaftlicher Name im Dateinamen
  try {
    add(await commonsSearch(`(${sciNames.map(n => `intitle:"${n}"`).join(' OR ')}) filetype:audio`), sciNorm);
  } catch (e) { console.warn('Commons-Suche (wiss. Name):', e.message); }
  // 2. Volltextsuche, aber weiterhin nur Dateien mit dem Namen im Titel
  if (out.length < 3) {
    try {
      add(await commonsSearch(`"${sp.sci}" filetype:audio`, 40), sciNorm);
    } catch (e) { console.warn('Commons-Suche (Volltext):', e.message); }
  }
  // 3. deutscher Name im Dateinamen ("Buchfink Gesang.ogg")
  if (out.length < 3 && sp.de) {
    try {
      add(await commonsSearch(`intitle:"${sp.de}" filetype:audio`, 20), deNorm);
    } catch (e) { console.warn('Commons-Suche (dt. Name):', e.message); }
  }
  return out.sort((a, b) => b.score - a.score);
}

/* ---------------- Ton: kombiniert ---------------- */
export async function getAudio(sp) {
  if (audioCache.has(sp.sci)) return audioCache.get(sp.sci);
  const banned = new Set(load('audioBan', {})[sp.sci] || []);
  const pinned = load('audioPin', {})[sp.sci];

  const xc = (XC[sp.sci] || []).map(r => ({
    src: r.src,
    srcs: [{ src: r.src, type: /\.mp3$/i.test(r.src) ? 'audio/mpeg' : '' }],
    title: `${r.type || 'Aufnahme'} · ${r.cnt || ''}${r.len ? ' · ' + r.len : ''}`,
    info: `xeno-canto XC${r.id}${r.by ? ' · ' + r.by : ''}${r.lic ? ' · ' + r.lic : ''}`,
    link: `https://xeno-canto.org/${r.id}`,
    score: 100,
  }));
  let commons = [];
  if (xc.length < 3) { try { commons = await commonsAudio(sp); } catch { /* offline */ } }

  let list = [...xc, ...commons].filter(a => !banned.has(a.src));
  // Duplikate raus
  const seen = new Set();
  list = list.filter(a => (seen.has(a.src) ? false : seen.add(a.src)));
  if (pinned) {
    const i = list.findIndex(a => a.src === pinned);
    if (i > 0) list.unshift(list.splice(i, 1)[0]);
  }
  audioCache.set(sp.sci, list);
  return list;
}

export function hasCuratedAudio() { return Object.keys(XC).length > 0; }
