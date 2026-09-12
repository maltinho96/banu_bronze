/* Vogeltopografie – Begriffe nach BANU-Begleitmaterial (Bronze / Silber+Gold).
 * Zeichnungen: eigene, schematische SVGs (keine Übernahme der BANU-Abbildungen).
 *
 * Jede Fläche hat:
 *   b: Begriff in der Bronze-Stufe (oder null = in Bronze nicht abfragbar)
 *   s: Begriff in Silber/Gold   (oder null)
 * So kann z. B. eine Schirmfeder in Bronze als „Armschwingen“ zählen,
 * in Silber aber als „Schirmfedern“.
 */

export const TERMS = {
  // Kopf
  Stirn: 'Vorderster Teil des Oberkopfs, direkt über dem Schnabelansatz.',
  Scheitel: 'Oberseite des Kopfes zwischen Stirn und Hinterkopf.',
  Scheitelstreif: 'Mittlerer Längsstreif über den Scheitel (z. B. Goldhähnchen, viele Ammern).',
  Scheitelseitenstreif: 'Seitlicher Streif am Scheitel, begrenzt den Scheitelstreif (z. B. Wintergoldhähnchen: schwarz).',
  Überaugenstreif: 'Streif über dem Auge, oft hell. Wichtiges Merkmal z. B. bei Laubsängern und Braunkehlchen.',
  Augenstreif: 'Streif durch bzw. hinter dem Auge.',
  Zügelstreif: 'Streif zwischen Schnabelansatz und Auge (Zügel).',
  Augenring: 'Befiederter oder nackter Ring rund ums Auge (z. B. Klappergrasmücke, Flussregenpfeifer).',
  Ohrendecken: 'Federfeld hinter und unter dem Auge, deckt die Ohröffnung ab („Wange“).',
  Wangenstreif: 'Dunkle Linie am Unterrand der Ohrendecken.',
  Bartstreif: 'Streif vom Schnabelwinkel nach hinten unterhalb der Wange.',
  Kinnstreif: 'Seitlicher Kehlstreif, trennt Bartstreif und Kehle.',
  Kinn: 'Kleine Fläche direkt unter dem Unterschnabel.',
  Kehle: 'Fläche zwischen Kinn und Brust (Vorderhals).',
  Nacken: 'Hinterseite des Halses, zwischen Hinterkopf und Mantel.',
  Nasenloch: 'Nasenöffnung an der Schnabelbasis.',
  First: 'Oberkante (Rücken) des Oberschnabels.',
  // Körper
  Mantel: 'Oberer Rücken direkt hinter dem Nacken, zwischen den Schulterfedern.',
  Rücken: 'Oberseite zwischen Mantel und Bürzel.',
  Schulterfedern: 'Federgruppe, die den Flügelansatz von oben abdeckt (Skapularen).',
  Bürzel: 'Hinterer Rücken zwischen Rücken und Oberschwanzdecken (z. B. weiß bei Mehlschwalbe, Gimpel).',
  Oberschwanzdecken: 'Deckfedern über der Schwanzbasis.',
  Unterschwanzdecken: 'Deckfedern unter der Schwanzbasis.',
  Steuerfedern: 'Die großen Schwanzfedern (meist 12). Werden von innen nach außen nummeriert.',
  Brust: 'Vorderseite des Rumpfes unterhalb der Kehle.',
  Bauch: 'Unterseite zwischen Brust und Steiß.',
  Flanke: 'Körperseite unterhalb des angelegten Flügels.',
  Steiß: 'Unterseite um die Kloake, zwischen Bauch und Unterschwanzdecken.',
  Unterschenkel: 'Befiederter Teil des Beins oberhalb des Fersengelenks („Hose“).',
  Tarsus: 'Unbefiederter, meist geschuppter Laufknochen zwischen Fersengelenk und Zehen („Lauf“).',
  // Flügel
  Handschwingen: 'Äußere Schwungfedern am Handteil des Flügels (Singvögel: 9–10). Nummerierung von innen (HS 1) nach außen.',
  Armschwingen: 'Innere Schwungfedern am Unterarm. Nummerierung von außen (AS 1, an der Hand) nach innen. Die innersten sind die Schirmfedern.',
  Schirmfedern: 'Innerste Armschwingen (Tertiärschwingen); decken beim sitzenden Vogel die übrigen Schwingen teilweise ab.',
  Alula: 'Daumenfittich: kleine Federgruppe am „Daumen“ am Flügelbug; wichtig beim Langsamflug.',
  Handdecken: 'Deckfedern über der Basis der Handschwingen.',
  'Große Handdecken': 'Größte Deckfedern-Reihe über den Handschwingen.',
  'Mittlere Handdecken': 'Mittlere Reihe der Handdecken, oft verdeckt.',
  'Kleine Handdecken': 'Kleinste Handdecken am Flügelbug, oft verdeckt.',
  Armdecken: 'Deckfedern über der Basis der Armschwingen (große, mittlere, kleine).',
  'Große Armdecken': 'Unterste und größte Deckfedernreihe über den Armschwingen. Helle Spitzen bilden die untere Flügelbinde.',
  'Mittlere Armdecken': 'Reihe zwischen kleinen und großen Armdecken. Helle Spitzen bilden die obere Flügelbinde.',
  'Kleine Armdecken': 'Kleine Deckfedern oberhalb der mittleren Armdecken.',
  Randdecken: 'Kleinste Deckfedern an der Flügelvorderkante.',
  // Flügelzeichnung
  'Obere Flügelbinde': 'Helle Binde durch die Spitzen der mittleren Armdecken.',
  'Untere Flügelbinde': 'Helle Binde durch die Spitzen der großen Armdecken (z. B. Buchfink).',
  Handbasisfleck: 'Heller Fleck an der Basis der Handschwingen, direkt jenseits der Handdecken.',
  'Helles Armfeld': 'Helles Feld auf den Armschwingen; bei Enten als farbiger „Spiegel“ ausgebildet.',
};

/* ---------- Geometrie-Helfer ---------- */
const f = n => Math.round(n * 10) / 10;

/** Feder von Basis (bx,by) zur Spitze (tx,ty), Breite w */
function feather(bx, by, tx, ty, w, taper = 0.9) {
  const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, px = -uy, py = ux;
  const h = w / 2, k = 0.8;
  const mx = bx + ux * L * k, my = by + uy * L * k;
  const a = [bx + px * h, by + py * h], b = [bx - px * h, by - py * h];
  const c = [mx + px * h * taper, my + py * h * taper], d = [mx - px * h * taper, my - py * h * taper];
  const t1 = [tx + px * h * taper * 0.9, ty + py * h * taper * 0.9];
  const t2 = [tx - px * h * taper * 0.9, ty - py * h * taper * 0.9];
  return `M${f(a[0])} ${f(a[1])}L${f(c[0])} ${f(c[1])}Q${f(t1[0])} ${f(t1[1])} ${f(tx)} ${f(ty)}` +
    `Q${f(t2[0])} ${f(t2[1])} ${f(d[0])} ${f(d[1])}L${f(b[0])} ${f(b[1])}Z`;
}
/** senkrechte Feder mit abgerundeter Unterkante */
function vfeather(xc, y0, y1, w, bulge = 12) {
  const l = xc - w / 2, r = xc + w / 2;
  return `M${f(l)} ${y0}L${f(l)} ${y1}Q${f(xc)} ${y1 + bulge} ${f(r)} ${y1}L${f(r)} ${y0}Z`;
}
/** Band parallel zu einer Linie y = y0 + m(x - x0), Offsets a..b, x1..x2 */
function band(x1, x2, a, b, y0, x0, m) {
  const T = x => y0 + m * (x - x0);
  return `M${x1} ${f(T(x1) + a)}L${x2} ${f(T(x2) + a)}L${x2} ${f(T(x2) + b)}L${x1} ${f(T(x1) + b)}Z`;
}
/** Wellen-/Schuppenlinie (Federränder) von (x1,y1) nach (x2,y2) */
function scallops(x1, y1, x2, y2, n, depth = 5) {
  let d = `M${f(x1)} ${f(y1)}`;
  const dx = (x2 - x1) / n, dy = (y2 - y1) / n;
  const L = Math.hypot(dx, dy), px = -dy / L, py = dx / L;
  for (let i = 0; i < n; i++) {
    const sx = x1 + dx * (i + 1), sy = y1 + dy * (i + 1);
    const cx = x1 + dx * (i + 0.5) + px * depth, cy = y1 + dy * (i + 0.5) + py * depth;
    d += `Q${f(cx)} ${f(cy)} ${f(sx)} ${f(sy)}`;
  }
  return d;
}

/* ================= 1) Körper (Seitenansicht) ================= */
const BODY =
  'M86 100C88 84 102 72 122 71C144 70 158 84 161 102C163 116 172 124 190 130' +
  'C232 144 282 166 322 190L340 204L336 228C302 242 264 252 236 254' +
  'C198 258 158 248 134 222C110 198 99 172 97 150C95 138 90 130 86 122C84 114 84 106 86 100Z';
const WING =
  'M156 146C196 144 256 162 306 190L374 232C338 238 280 232 226 222' +
  'C188 214 158 200 150 184C146 170 148 152 156 146Z';
const TAIL = 'M330 200L454 256C458 264 454 274 446 280L328 230Z';
// Oberkante des Flügels (für Deckfedern-Bänder): y = 146 + 0.29 (x - 156)
const W = (x1, x2, a, b) => band(x1, x2, a, b, 146, 156, 0.29);

const koerper = {
  id: 'koerper',
  title: 'Körper',
  viewBox: '20 40 460 290',
  clips: { body: BODY, wing: WING },
  layers: [
    // Ast
    { deco: 'M120 309C170 304 240 300 330 304', cls: 'branch' },
    // Schwanz
    { d: TAIL, b: 'Steuerfedern', s: 'Steuerfedern', cls: 'tail' },
    { deco: 'M336 208L452 262M334 216L450 268M332 223L448 274', cls: 'line' },
    // Beine
    { d: 'M212 262L218 262L210 303L204 303Z', b: null, s: 'Tarsus', cls: 'leg' },
    { d: 'M227 258L232 258L228 302L223 302Z', b: null, s: 'Tarsus', cls: 'leg' },
    { deco: 'M207 302L186 305M207 302L194 308M207 302L221 305M226 301L210 305M226 301L240 304', cls: 'toe' },
    // Rumpf-Flächen (auf Silhouette beschnitten)
    { d: BODY, cls: 'base', deco: true },
    { d: 'M76 112L78 86L100 72L106 88L94 98L88 110Z', clip: 'body', b: 'Stirn', s: 'Stirn' },
    { d: 'M100 72L104 56L175 56L175 96L156 92L130 86L106 88Z', clip: 'body', b: 'Scheitel', s: 'Scheitel' },
    { d: 'M156 92L178 90L198 134L168 132L150 112Z', clip: 'body', b: 'Nacken', s: 'Nacken' },
    { d: 'M116 108C130 101 148 101 157 107C159 119 151 128 137 130C124 130 116 121 116 108Z', clip: 'body', b: null, s: 'Ohrendecken', cls: 'cheek' },
    { d: 'M78 118L94 114L103 128L86 136Z', clip: 'body', b: 'Kinn', s: 'Kinn' },
    { d: 'M86 136L103 128L126 136L134 158L94 166Z', clip: 'body', b: 'Kehle', s: 'Kehle' },
    { d: 'M88 166L134 158L170 172L178 214L136 230L88 212Z', clip: 'body', b: 'Brust', s: 'Brust', cls: 'under' },
    { d: 'M136 232L178 222L236 238L240 266L126 266Z', clip: 'body', b: 'Bauch', s: 'Bauch', cls: 'under' },
    { d: 'M150 186L230 224L296 232L300 244L236 246L178 222Z', clip: 'body', b: 'Bauch', s: 'Flanke', cls: 'flank' },
    { d: 'M232 238L294 234L304 266L230 266Z', clip: 'body', b: 'Steiß', s: 'Steiß', cls: 'under' },
    { d: 'M168 126L228 138L242 178L200 164L172 152Z', clip: 'body', b: 'Mantel', s: 'Mantel', cls: 'upper' },
    { d: 'M228 138L298 168L304 198L242 178Z', clip: 'body', b: 'Rücken', s: 'Rücken', cls: 'upper' },
    { d: 'M298 168L336 186L348 206L322 208L304 198Z', clip: 'body', b: 'Bürzel', s: 'Bürzel', cls: 'rump' },
    // Unterschenkel
    { d: 'M198 244C200 262 214 270 230 262L236 244Z', clip: 'body', b: null, s: 'Unterschenkel', cls: 'under' },
    // Schwanzdecken
    { d: 'M318 190C342 196 362 206 378 221C356 224 336 216 320 208Z', b: 'Oberschwanzdecken', s: 'Oberschwanzdecken', cls: 'upper' },
    { d: 'M284 246C314 237 344 236 374 251C352 259 318 261 288 257Z', b: 'Unterschwanzdecken', s: 'Unterschwanzdecken', cls: 'under' },
    { deco: 'M322 196Q345 203 360 214M296 250Q330 244 356 252', cls: 'line' },
    // Kopfzeichnung
    { d: 'M96 92C112 83 136 83 156 90L155 97C136 91 113 92 98 99Z', b: 'Überaugenstreif', s: 'Überaugenstreif', cls: 'pale' },
    { d: 'M92 124C106 128 124 134 142 136L140 142C122 141 104 136 90 130Z', b: 'Bartstreif', s: 'Bartstreif', cls: 'dark' },
    // Schnabel
    { d: 'M86 99Q66 104 50 113L87 114Z', b: null, s: 'First', cls: 'bill' },
    { d: 'M87 114L50 114Q68 120 86 123Z', cls: 'bill', deco: true },
    { d: 'M76 105A3 2 -15 1 1 76.1 105Z', b: null, s: 'Nasenloch', cls: 'nostril', hit: 'M70 101L82 99L83 108L71 110Z' },
    // Flügel (eigene Ebene)
    { d: WING, cls: 'wingbase', deco: true },
    { d: W(140, 330, 38, 110), clip: 'wing', b: null, s: 'Armschwingen', cls: 'remige' },
    { deco: 'M190 206L184 214M214 212L208 221M238 218L232 226M262 222L258 230', cls: 'line', clip: 'wing' },
    { d: 'M300 186L376 232L322 246L310 226Z', clip: 'wing', b: null, s: 'Handschwingen', cls: 'primary' },
    { deco: 'M322 236L368 231M318 228L360 226', cls: 'line' },
    { d: W(160, 262, 24, 40), clip: 'wing', b: null, s: 'Große Armdecken', cls: 'covert3' },
    { d: W(166, 262, 12, 24), clip: 'wing', b: null, s: 'Mittlere Armdecken', cls: 'covert2' },
    { d: W(172, 262, -6, 12), clip: 'wing', b: null, s: 'Kleine Armdecken', cls: 'covert1' },
    { d: 'M138 138L178 144L176 168L166 192L138 206Z', clip: 'wing', b: null, s: 'Randdecken', cls: 'covert0' },
    { deco: scallops(176, 157, 262, 183, 6, 4) + scallops(170, 168, 262, 195, 6, 4) + scallops(164, 184, 262, 211, 6, 5), cls: 'line', clip: 'wing' },
    // Schirmfedern
    { d: 'M252 166C284 172 312 186 334 204C338 214 332 224 320 228C298 230 274 224 256 214Z', clip: 'wing', b: null, s: 'Schirmfedern', cls: 'tertial' },
    { deco: 'M256 182C284 190 310 202 330 216M258 198C282 206 304 216 324 226', cls: 'tline', clip: 'wing' },
    // Schulterfedern
    { d: 'M160 146C192 141 230 150 258 168C236 174 202 170 176 162C166 158 160 152 160 146Z', b: null, s: 'Schulterfedern', cls: 'upper' },
    // Auge obenauf
    { deco: 'M110 102m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0', cls: 'eye' },
    { deco: 'M108 100m-1.6 0a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0', cls: 'glint' },
  ],
};

/* ================= 2) Kopf (Detail) ================= */
const HEAD =
  'M112 124C118 80 160 50 208 50C262 50 296 92 296 146C296 196 306 246 324 318' +
  'L148 318C148 280 130 240 118 210C110 192 106 178 108 166Z';

const kopf = {
  id: 'kopf',
  title: 'Kopf',
  viewBox: '30 30 320 300',
  clips: { head: HEAD },
  layers: [
    { d: HEAD, cls: 'base', deco: true },
    { d: 'M100 40L300 30L300 130L262 112L150 112L104 120Z', clip: 'head', b: 'Scheitel', s: 'Scheitel', cls: 'upper' },
    { d: 'M96 146L104 96L140 66L150 100L126 124Z', clip: 'head', b: 'Stirn', s: 'Stirn', cls: 'upper' },
    { d: 'M262 118L310 110L330 320L282 320L272 220Z', clip: 'head', b: 'Nacken', s: 'Nacken' },
    { d: 'M100 164L126 172L146 208L116 212Z', clip: 'head', b: 'Kinn', s: 'Kinn', cls: 'pale' },
    { d: 'M112 204L150 212L198 256L212 330L140 330Z', clip: 'head', b: 'Kehle', s: 'Kehle', cls: 'pale' },
    // Scheitelstreifen
    { d: 'M136 70C172 44 234 44 276 72L268 84C230 60 176 60 142 82Z', clip: 'head', b: null, s: 'Scheitelstreif', cls: 'pale' },
    { d: 'M142 82C176 60 230 60 268 84L262 98C226 78 180 78 148 96Z', clip: 'head', b: null, s: 'Scheitelseitenstreif', cls: 'dark' },
    { d: 'M148 104C174 92 224 88 270 100L270 111C224 101 178 104 152 115Z', b: 'Überaugenstreif', s: 'Überaugenstreif', cls: 'pale' },
    // Wange
    { d: 'M178 150C204 138 252 138 278 150C278 176 248 192 210 190C188 188 174 172 178 150Z', b: null, s: 'Ohrendecken', cls: 'cheek' },
    { d: 'M194 124C224 119 254 121 284 130L284 141C254 133 224 132 194 136Z', b: null, s: 'Augenstreif', cls: 'dark' },
    { d: 'M116 136L158 126L160 137L118 147Z', b: null, s: 'Zügelstreif', cls: 'dark' },
    { d: 'M166 176C188 196 238 202 280 172L283 180C240 212 186 206 160 184Z', b: null, s: 'Wangenstreif', cls: 'dark' },
    { d: 'M114 160C146 174 186 196 238 202L236 216C184 212 142 192 110 174Z', b: 'Bartstreif', s: 'Bartstreif', cls: 'pale' },
    { d: 'M116 180C144 198 170 216 196 236L186 246C160 226 136 208 110 190Z', b: null, s: 'Kinnstreif', cls: 'dark' },
    // Schnabel
    { d: 'M112 124C92 128 72 140 52 152L111 151Z', cls: 'bill', deco: true },
    { d: 'M111 151L52 152C72 161 92 167 108 167Z', cls: 'bill', deco: true },
    { d: 'M112 122C92 126 72 138 52 152L60 150C76 142 94 134 112 131Z', b: null, s: 'First', cls: 'billridge' },
    { d: 'M97 136A5 3 -15 1 1 97.1 136Z', b: null, s: 'Nasenloch', cls: 'nostril', hit: 'M88 131L106 127L108 141L90 145Z' },
    // Auge + Augenring
    { d: 'M175 128m-19 0a19 19 0 1 0 38 0a19 19 0 1 0 -38 0Zm5 0a14 14 0 1 1 28 0a14 14 0 1 1 -28 0Z', b: null, s: 'Augenring', cls: 'ring' },
    { deco: 'M175 128m-13 0a13 13 0 1 0 26 0a13 13 0 1 0 -26 0', cls: 'eye' },
    { deco: 'M171 123m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0', cls: 'glint' },
  ],
};

/* ================= 3) Flügel (gespreizt, Oberseite) ================= */
// Armschwingen: AS1 außen (rechts, an der Hand) … AS9 innen (links)
const AS = Array.from({ length: 9 }, (_, i) => {
  const n = i + 1, xc = 244 - i * 25;
  return { n, xc, d: vfeather(xc, 150, n >= 7 ? 272 : 264, 27, 13) };
});
// Handschwingen HS1 (innen) … HS9 (außen), HS10 winzig
const HS_TIPS = [[282, 262], [312, 256], [342, 247], [374, 235], [406, 220], [436, 202], [464, 182], [488, 160], [504, 138]];
const HS = HS_TIPS.map(([tx, ty], i) => {
  const bx = 254 + i * 5, by = 150 - i * 9;
  return { n: i + 1, d: feather(bx, by, tx, ty, 24 - i * 0.6), bx, by, tx, ty };
});
const HS10 = feather(300, 70, 352, 60, 9);

const wingLayers = [
  { d: 'M20 78C90 58 170 46 244 50L300 64L520 140L270 280L20 280Z', cls: 'wingbase', deco: true },
  // Handschwingen (von außen nach innen zeichnen, damit innere oben liegen)
  ...HS.slice().reverse().map(h => ({ d: h.d, b: 'Handschwingen', s: 'Handschwingen', cls: 'primary' })),
  { d: HS10, b: 'Handschwingen', s: 'Handschwingen', cls: 'primary' },
  // Armschwingen
  ...AS.map(a => ({
    d: a.d, b: 'Armschwingen', s: a.n >= 7 ? 'Schirmfedern' : 'Armschwingen', cls: a.n >= 7 ? 'tertial' : 'remige',
  })),
  // Große Handdecken
  ...HS.map(h => ({
    d: feather(h.bx - 6, h.by - 4, h.bx + (h.tx - h.bx) * 0.36, h.by + (h.ty - h.by) * 0.36, 20 - h.n * 0.8),
    b: 'Handdecken', s: 'Große Handdecken', cls: 'covert3',
  })),
  // Mittlere + kleine Handdecken (am Flügelbug)
  { d: 'M242 70C262 64 286 66 300 76C300 92 282 104 262 108C248 100 240 86 242 70Z', b: 'Handdecken', s: 'Mittlere Handdecken', cls: 'covert2' },
  { d: 'M244 52C262 50 282 56 298 66C286 74 266 74 246 70Z', b: 'Handdecken', s: 'Kleine Handdecken', cls: 'covert1' },
  // Große Armdecken
  ...AS.map(a => ({ d: vfeather(a.xc, 112, 160, 26, 10), b: 'Armdecken', s: 'Große Armdecken', cls: 'covert3' })),
  // Mittlere Armdecken
  ...Array.from({ length: 11 }, (_, i) => ({
    d: vfeather(244 - i * 20.5, 90, 120, 21, 8), b: 'Armdecken', s: 'Mittlere Armdecken', cls: 'covert2',
  })),
  // Kleine Armdecken
  ...Array.from({ length: 14 }, (_, i) => ({
    d: vfeather(244 - i * 16, 72, 94, 16, 6), b: 'Armdecken', s: 'Kleine Armdecken', cls: 'covert1',
  })),
  // Randdecken (Vorderkante des Arms)
  { d: 'M20 80C90 60 170 48 244 52L246 74C170 70 90 78 22 96Z', b: 'Randdecken', s: 'Randdecken', cls: 'covert0' },
  { deco: scallops(22, 94, 246, 74, 16, 4), cls: 'line' },
  // Alula
  { d: feather(236, 56, 316, 50, 12), b: 'Alula', s: 'Alula', cls: 'alula' },
  { d: feather(236, 60, 304, 62, 12), b: 'Alula', s: 'Alula', cls: 'alula' },
  { d: feather(236, 64, 290, 72, 11), b: 'Alula', s: 'Alula', cls: 'alula' },
];

const fluegel = {
  id: 'fluegel',
  title: 'Flügel',
  viewBox: '10 30 520 260',
  clips: {},
  layers: wingLayers.filter(l => !l.deco || l.cls === 'line'),
};

/* ================= 4) Flügelzeichnung (nur Silber/Gold) ================= */
const marks = [
  { d: 'M24 112L262 104L262 124L24 132Z', s: 'Obere Flügelbinde', cls: 'mark' },
  { d: 'M24 152L262 150L262 172L24 174Z', s: 'Untere Flügelbinde', cls: 'mark' },
  { d: 'M300 150C318 128 350 124 362 134C366 150 340 172 316 180C302 176 294 164 300 150Z', s: 'Handbasisfleck', cls: 'mark' },
  { d: 'M104 196C140 178 220 178 248 196C250 222 220 240 170 240C126 240 98 226 104 196Z', s: 'Helles Armfeld', cls: 'mark' },
];
const fluegelzeichnung = {
  id: 'fluegelzeichnung',
  title: 'Flügelzeichnung',
  onlyLevel: 's',
  viewBox: '10 30 520 260',
  clips: {},
  layers: [
    ...wingLayers.filter(l => !l.deco || l.cls === 'line').map(l => ({ ...l, b: null, s: null })),
    ...marks.map(m => ({ ...m, b: null })),
  ],
};

export const DIAGRAMS = [koerper, kopf, fluegel, fluegelzeichnung];

/** Alle abfragbaren Begriffe eines Diagramms für eine Stufe */
export function termsFor(diagram, level) {
  const set = new Set();
  diagram.layers.forEach(l => { const t = l[level]; if (t && !l.deco) set.add(t); });
  return [...set];
}
