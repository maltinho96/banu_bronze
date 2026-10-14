/* Rote Liste der Brutvögel Deutschlands, 6. Fassung (Ryslavy et al. 2020, erschienen 2021).
 * Artenzuordnung nach der Zusammenstellung bei Wikipedia – vor der Prüfung bitte mit der
 * Originalliste abgleichen. Kategorien-Erklärungen nach der BfN-Methodik (Ludwig et al. 2009).
 * Ausgestorbene/bedrohte Arten stehen nicht auf der Bronze-Liste – sie kommen hier nur als
 * Antwortmöglichkeiten der Rote-Liste-Fragen vor. */

export const RL_CATS = [
  { k: '0', t: 'Ausgestorben oder verschollen',
    x: 'Die Art brütet in Deutschland nicht mehr. Sie ist verschwunden oder seit Jahren trotz Suche nicht mehr nachgewiesen.' },
  { k: '1', t: 'Vom Aussterben bedroht',
    x: 'Die Bestände sind so stark geschrumpft, dass die Art in absehbarer Zeit aussterben wird, wenn die Ursachen weiter wirken.' },
  { k: '2', t: 'Stark gefährdet',
    x: 'Die Bestände sind erheblich zurückgegangen oder durch menschliche Einflüsse erheblich bedroht. Geht es so weiter, rutscht die Art nach Kategorie 1.' },
  { k: '3', t: 'Gefährdet',
    x: 'Die Bestände sind merklich zurückgegangen oder durch menschliche Einflüsse bedroht. Geht es so weiter, rutscht die Art nach Kategorie 2.' },
  { k: 'R', t: 'Extrem selten',
    x: 'Sehr wenige Vorkommen, aber kein Rückgang erkennbar. Gefährdet ist die Art nur durch unvorhersehbare Ereignisse.' },
  { k: 'G', t: 'Gefährdung unbekannten Ausmaßes',
    x: 'Die Art ist sicher gefährdet, aber die Daten reichen nicht für eine Einstufung in 1, 2 oder 3.' },
  { k: 'V', t: 'Vorwarnliste',
    x: 'Noch nicht gefährdet, aber merklich im Rückgang. Hält der Trend an, wird sie gefährdet (3). Die Vorwarnliste gehört nicht zur eigentlichen Roten Liste.' },
  { k: 'D', t: 'Daten unzureichend',
    x: 'Es gibt zu wenig Daten, um die Gefährdung überhaupt einzuschätzen.' },
  { k: '*', t: 'Ungefährdet',
    x: 'Bestand stabil oder zunehmend – keine Gefährdung.' },
  { k: '♦', t: 'Nicht bewertet',
    x: 'Wird nicht eingestuft, z. B. eingebürgerte Arten (Neozoen) wie die Nilgans oder Haustierformen wie die Straßentaube.' },
];
export const RL_MAP = Object.fromEntries(RL_CATS.map(c => [c.k, c]));

/* Arten je Kategorie (Brutvögel Deutschlands) */
export const RL_SPECIES = {
  0: ['Rothuhn', 'Zwergtrappe', 'Mornellregenpfeifer', 'Steinwälzer', 'Doppelschnepfe', 'Rosenseeschwalbe', 'Papageitaucher',
    'Waldrapp', 'Gänsegeier', 'Schlangenadler', 'Blauracke', 'Würgfalke', 'Schwarzstirnwürger', 'Steinsperling'],
  1: ['Auerhuhn', 'Knäkente', 'Moorente', 'Großtrappe', 'Wachtelkönig', 'Triel', 'Goldregenpfeifer', 'Sandregenpfeifer',
    'Seeregenpfeifer', 'Großer Brachvogel', 'Uferschnepfe', 'Kampfläufer', 'Alpenstrandläufer', 'Bekassine', 'Bruchwasserläufer',
    'Lachseeschwalbe', 'Raubseeschwalbe', 'Brandseeschwalbe', 'Zwergseeschwalbe', 'Küstenseeschwalbe', 'Schreiadler', 'Kornweihe',
    'Sumpfohreule', 'Raubwürger', 'Rotkopfwürger', 'Beutelmeise', 'Haubenlerche', 'Seggenrohrsänger', 'Sperbergrasmücke',
    'Steinrötel', 'Steinschmätzer', 'Brachpieper', 'Zippammer'],
  2: ['Haselhuhn', 'Birkhuhn', 'Rebhuhn', 'Spießente', 'Turteltaube', 'Kiebitz', 'Flussuferläufer', 'Rotschenkel',
    'Dreizehenmöwe', 'Flussseeschwalbe', 'Nachtreiher', 'Wiesenweihe', 'Grauspecht', 'Feldschwirl', 'Braunkehlchen',
    'Weißrückenspecht', 'Wiesenpieper', 'Ortolan'],
  3: ['Löffelente', 'Krickente', 'Gänsesäger', 'Ziegenmelker', 'Kuckuck', 'Kleines Sumpfhuhn', 'Tüpfelsumpfhuhn',
    'Schwarzhalstaucher', 'Trauerseeschwalbe', 'Rohrdommel', 'Zwergdommel', 'Fischadler', 'Wiedehopf', 'Wendehals',
    'Kleinspecht', 'Baumfalke', 'Feldlerche', 'Mehlschwalbe', 'Star', 'Trauerschnäpper', 'Halsbandschnäpper', 'Bluthänfling',
    'Zitronenzeisig', 'Zaunammer'],
  V: ['Wachtel', 'Tafelente', 'Wasserralle', 'Teichhuhn', 'Säbelschnäbler', 'Flussregenpfeifer', 'Waldschnepfe', 'Silbermöwe',
    'Weißstorch', 'Wespenbussard', 'Steinkauz', 'Pirol', 'Heidelerche', 'Rauchschwalbe', 'Grauschnäpper', 'Sprosser',
    'Zwergschnäpper', 'Feldsperling', 'Baumpieper', 'Karmingimpel', 'Grauammer'],
  // Ungefährdete Arten aus der Bronze-Liste (nur sicher eingestufte)
  '*': ['Amsel', 'Blaumeise', 'Kohlmeise', 'Buchfink', 'Rotkehlchen', 'Zilpzalp', 'Mönchsgrasmücke', 'Zaunkönig', 'Buntspecht',
    'Ringeltaube', 'Elster', 'Eichelhäher', 'Rabenkrähe', 'Kleiber', 'Mäusebussard', 'Rotmilan', 'Turmfalke', 'Graureiher',
    'Höckerschwan', 'Stockente', 'Blässhuhn', 'Haubentaucher', 'Graugans', 'Kormoran', 'Grünspecht', 'Waldkauz',
    'Eisvogel', 'Singdrossel', 'Heckenbraunelle', 'Tannenmeise', 'Schwanzmeise', 'Gimpel', 'Stieglitz'],
};

/** Kategorie einer Art (oder undefined) */
export function rlOf(de) {
  for (const [k, list] of Object.entries(RL_SPECIES)) if (list.includes(de)) return k;
  return undefined;
}
