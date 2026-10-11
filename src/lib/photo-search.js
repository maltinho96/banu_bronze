/* Mehrere gute Fotos pro Art von Wikimedia Commons finden.
 *
 * Wird von der App (im Browser) und von scripts/fetch-photos.mjs (Node)
 * gemeinsam benutzt – daher ohne Browser- oder Vite-Abhängigkeiten.
 *
 * Vorgehen:
 *  1. Wikidata-Eintrag der Art über den wissenschaftlichen Namen (P225) finden.
 *  2. Commons-Dateien suchen, die laut Strukturdaten diese Art zeigen
 *     (P180 „zeigt“) – zuerst nur „Featured pictures“ und „Quality images“,
 *     bei Bedarf auch weitere Fotos.
 *  3. Unbrauchbares aussortieren (Eier, Nester, Küken, Präparate, Zeichnungen …),
 *     dann eine abwechslungsreiche Auswahl treffen (Männchen/Weibchen,
 *     nicht alles vom selben Fotografen).
 */

const WD = 'https://www.wikidata.org/w/api.php';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';

const BAD = new RegExp([
  'egg', '\\bei(er)?\\b', 'gelege', 'nest(ling)?', 'chick', 'küken', 'pullus', 'juv', 'immature', 'jungvogel',
  'skelet', 'skull', 'schädel', 'specimen', 'museum', '\\bbalg\\b', 'präparat', 'stuffed', 'taxiderm', '\\bmounted\\b',
  '\\bmap\\b', 'karte', '\\brange\\b', 'distribution', 'verbreitung',
  'drawing', 'zeichnung', 'illustration', 'painting', 'gemälde', 'plate', 'naumann', 'gould', 'audubon', 'lithograph',
  '\\bstamp', 'briefmarke', '\\bcoin\\b', 'münze', '\\blogo\\b', 'silhouette',
  'feather', 'feder\\b', 'pellet', 'gewölle', 'footprint', 'dropping',
  '\\bdead\\b', '\\btot(er)?\\b', 'carcass', 'kadaver', 'roadkill',
  'sonagram', 'spectrogram', 'diagram', 'chart',
].join('|'), 'i');
const MALE = /\b(male|männchen|mannchen|maschio|mâle|♂|drake|erpel|hahn)\b/i;
const FEMALE = /\b(female|weibchen|femmina|femelle|♀|henne)\b/i;

const strip = v => String(v || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

async function getJson(fetchFn, url) {
  const r = await fetchFn(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  if (j?.error) throw new Error(`${j.error.code || 'API-Fehler'}: ${j.error.info || ''}`.trim());
  return j;
}

/** fetch mit Wiederholung bei Drosselung (429) und Serverfehlern (5xx). */
export function withRetry(fetchFn, { tries = 5, baseDelay = 2000, log = () => {} } = {}) {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  return async url => {
    let last;
    for (let k = 0; k < tries; k++) {
      try {
        const r = await fetchFn(url);
        if (r.status !== 429 && r.status < 500) return r;
        const ra = Number(r.headers?.get?.('retry-after'));
        const wait = ra > 0 ? ra * 1000 : baseDelay * 2 ** k;
        log(`HTTP ${r.status} – warte ${Math.round(wait / 1000)} s`);
        last = r;
        await sleep(wait);
      } catch (e) {
        last = e;
        log(`${e.message} – neuer Versuch`);
        await sleep(baseDelay * 2 ** k);
      }
    }
    if (last instanceof Error) throw last;
    return last;
  };
}

/** Wikidata-ID (Q…) zu einem wissenschaftlichen Namen */
export async function wikidataId(fetchFn, sciName) {
  const url = `${WD}?action=query&format=json&origin=*&list=search&srlimit=3` +
    '&srsearch=' + encodeURIComponent(`haswbstatement:"P225=${sciName}"`);
  const j = await getJson(fetchFn, url);
  return j?.query?.search?.[0]?.title || null;
}

async function commonsSearch(fetchFn, search, limit) {
  const url = `${COMMONS}?action=query&format=json&origin=*` +
    `&generator=search&gsrnamespace=6&gsrlimit=${limit}` +
    '&gsrsearch=' + encodeURIComponent(search) +
    '&prop=imageinfo&iiprop=url%7Cmime%7Csize%7Cextmetadata&iiurlwidth=960' +
    '&iiextmetadatafilter=Artist%7CLicenseShortName%7CObjectName';
  const j = await getJson(fetchFn, url);
  return Object.values(j?.query?.pages || {});
}

function toPhoto(page, sp, quality) {
  const ii = page.imageinfo?.[0];
  if (!ii?.url || !/^image\/(jpeg|png|webp)$/.test(ii.mime || '')) return null;
  const title = (page.title || '').replace(/^(File|Datei):/, '');
  if (BAD.test(title)) return null;
  if (ii.width && ii.width < 500) return null;
  const ratio = ii.width && ii.height ? ii.width / ii.height : 1.3;
  if (ratio < 0.5 || ratio > 2.6) return null; // Panoramen und extreme Hochformate meiden
  const meta = ii.extmetadata || {};
  return {
    src: ii.thumburl || ii.url,
    thumb: ii.thumburl || ii.url,
    title: title.replace(/\.(jpe?g|png|webp)$/i, '').replace(/_/g, ' '),
    by: strip(meta.Artist?.value).slice(0, 80),
    lic: strip(meta.LicenseShortName?.value),
    link: ii.descriptionurl || 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(page.title),
    sp: sp.de,
    q: quality,
    _sex: MALE.test(title) ? 'm' : FEMALE.test(title) ? 'f' : '',
    _ratio: ratio,
  };
}

/** Abwechslungsreiche Auswahl: Qualität zuerst, beide Geschlechter, max. 2 je Fotograf */
export function selectPhotos(cands, n = 5) {
  const seen = new Set();
  const pool = cands.filter(c => (seen.has(c.src) ? false : seen.add(c.src)));
  // Qualität, dann eher querformatig (passt besser in die Karte)
  pool.sort((a, b) => (b.q - a.q) || (Math.abs(a._ratio - 1.4) - Math.abs(b._ratio - 1.4)));
  const out = [];
  const byArtist = new Map();
  const take = c => {
    if (out.includes(c) || out.length >= n) return;
    const k = c.by || c.src;
    if ((byArtist.get(k) || 0) >= 2) return;
    byArtist.set(k, (byArtist.get(k) || 0) + 1);
    out.push(c);
  };
  const m = pool.find(c => c._sex === 'm'); if (m) take(m);
  const f = pool.find(c => c._sex === 'f'); if (f) take(f);
  pool.forEach(take);
  // falls der Fotografen-Filter zu streng war: auffüllen
  pool.forEach(c => { if (out.length < n && !out.includes(c)) out.push(c); });
  return out.map(({ _sex, _ratio, ...rest }) => rest);
}

/**
 * Bis zu n Fotos zu einer Art.
 * @param {{de:string, sci:string, syn?:string[]}} sp
 * @param {{fetch:Function, n?:number}} opts
 */
export async function findSpeciesPhotos(sp, { fetch: fetchFn, n = 5, onError = () => {} } = {}) {
  const sciNames = [sp.sci, ...(sp.syn || []).filter(s => /^[A-Z][a-z]+ [a-z]+$/.test(s))];
  let qid = null;
  for (const name of sciNames) {
    try { qid = await wikidataId(fetchFn, name); } catch (e) { onError(`Wikidata (${name}): ${e.message}`); }
    if (qid) break;
  }
  const cands = [];
  const add = (pages, q) => pages.forEach(p => { const x = toPhoto(p, sp, q); if (x) cands.push(x); });

  if (qid) {
    try {
      add(await commonsSearch(fetchFn,
        `haswbstatement:P180=${qid} incategory:Featured_pictures_on_Wikimedia_Commons|Quality_images`, 40), 2);
    } catch (e) { onError(`Commons (Quality): ${e.message}`); }
    if (cands.length < n) {
      try { add(await commonsSearch(fetchFn, `haswbstatement:P180=${qid} filetype:bitmap`, 50), 1); } catch (e) { onError(`Commons (alle Fotos): ${e.message}`); }
    }
  }
  // Ohne Strukturdaten: Dateiname mit wissenschaftlichem Namen
  if (cands.length < n) {
    try { add(await commonsSearch(fetchFn, `intitle:"${sp.sci}" filetype:bitmap`, 30), 0); } catch (e) { onError(`Commons (Dateiname): ${e.message}`); }
  }
  return selectPhotos(cands, n);
}
