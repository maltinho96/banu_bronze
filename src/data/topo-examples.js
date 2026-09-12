/* Echte Vögel zu den Topografie-Begriffen.
 *
 * Die Fotos kommen zur Laufzeit von Wikipedia (wie im Artentrainer).
 * `wp` ist der Wikipedia-Artikel, `note` die Merkhilfe fürs Feld.
 * Nur Begriffe, bei denen ein Merkmal auf einem normalen Foto wirklich
 * auffällt – sonst lernt man am Bild nichts.
 */

export const EXAMPLES = [
  { term: 'Stirn', wp: 'Blässhuhn', note: 'Das weiße Stirnschild reicht von der Schnabelbasis über die Stirn – daher der Name „Blässhuhn“.' },
  { term: 'Scheitel', wp: 'Haubenmeise', note: 'Die gesprenkelte Haube sitzt auf dem Scheitel. Beim jungen Buntspecht ist der ganze Scheitel rot, beim Männchen nur der Nacken.' },
  { term: 'Nacken', wp: 'Buntspecht', note: 'Roter Fleck im Nacken: Männchen. Kein Rot am Kopf: Weibchen. Ganzer Scheitel rot: Jungvogel. Eine Standardfrage im Feld.' },
  { term: 'Überaugenstreif', wp: 'Braunkehlchen', note: 'Der breite cremeweiße Überaugenstreif trennt das Braunkehlchen vom Schwarzkehlchen, dem er fehlt.' },
  { term: 'Ohrendecken', wp: 'Feldsperling', note: 'Schwarzer Fleck auf den weißen Ohrendecken plus brauner Scheitel – so unterscheidet man ihn vom Haussperling.' },
  { term: 'Kehle', wp: 'Blaukehlchen', note: 'Die Kehle reicht vom Kinn bis zur Brust. Beim Blaukehlchen-Männchen ist genau dieses Feld leuchtend blau.' },
  { term: 'Kinn', wp: 'Haussperling', note: 'Beim Männchen sind Kinn und Kehle schwarz, im Brutkleid zu einem breiten Latz verschmolzen.' },
  { term: 'Bartstreif', wp: 'Wanderfalke', note: 'Der schwarze Bartstreif unter dem Auge ist das klassische Merkmal des Wanderfalken.' },
  { term: 'Brust', wp: 'Rotkehlchen', note: 'Orange ist nicht nur die Kehle, sondern auch die Brust – die Grenze zum Bauch ist gut zu sehen.' },
  { term: 'Bauch', wp: 'Gebirgsstelze', note: 'Der gelbe Bauch setzt sich deutlich von Brust und Unterschwanzdecken ab.' },
  { term: 'Flanke', wp: 'Reiherente', note: 'Die weißen Flanken kontrastieren beim Erpel scharf mit dem schwarzen Rücken – auf Entfernung das beste Merkmal.' },
  { term: 'Mantel', wp: 'Neuntöter', note: 'Beim Männchen sind Mantel und Rücken rotbraun, der Scheitel dagegen grau.' },
  { term: 'Rücken', wp: 'Eisvogel', note: 'Der leuchtend blaue Rücken ist im Flug oft das Einzige, was man vom Eisvogel sieht.' },
  { term: 'Bürzel', wp: 'Mehlschwalbe', note: 'Der weiße Bürzel trennt Mehl- von Rauchschwalbe – auch im Flug gut zu sehen.' },
  { term: 'Oberschwanzdecken', wp: 'Grünspecht', note: 'Gelbgrüne Oberschwanzdecken und Bürzel leuchten beim Abflug auf.' },
  { term: 'Unterschwanzdecken', wp: 'Buntspecht', note: 'Leuchtend rote Unterschwanzdecken – auch dann sichtbar, wenn der Vogel am Stamm klettert.' },
  { term: 'Steuerfedern', wp: 'Bachstelze', note: 'Weiße äußere Steuerfedern blitzen beim Auffliegen auf, die mittleren sind schwarz.' },
  { term: 'Steiß', wp: 'Hausrotschwanz', note: 'Rostroter Schwanz samt Steiß, während der übrige Vogel dunkel bleibt.' },
  { term: 'Tarsus', wp: 'Zilpzalp', note: 'Dunkler, fast schwarzer Tarsus – beim sehr ähnlichen Fitis ist er hell fleischfarben.' },
  { term: 'Unterschenkel', wp: 'Rotmilan', note: 'Der befiederte Unterschenkel bildet die „Hose“, darunter beginnt der nackte Tarsus.' },
  { term: 'Handschwingen', wp: 'Mäusebussard', note: 'Im Segelflug stehen die Handschwingen als gefingerte Spitzen auseinander.' },
  { term: 'Armschwingen', wp: 'Graureiher', note: 'Die breiten Armschwingen bilden den inneren Teil des Flügels – beim Reiher gut vom Handteil zu unterscheiden.' },
  { term: 'Schirmfedern', wp: 'Stockente', note: 'Die Schirmfedern decken beim schwimmenden Erpel die zusammengelegten Schwingen ab.' },
  { term: 'Alula', wp: 'Turmfalke', note: 'Beim Rütteln und Landen wird der Daumenfittich abgespreizt und verhindert das Abreißen der Strömung.' },
  { term: 'Obere Flügelbinde', wp: 'Buchfink', note: 'Zwei weiße Binden: die obere aus den Spitzen der mittleren Armdecken.' },
  { term: 'Untere Flügelbinde', wp: 'Buchfink', note: 'Die untere, schmalere Binde bilden die Spitzen der großen Armdecken.' },
  { term: 'Handbasisfleck', wp: 'Buchfink', note: 'Der weiße Fleck an der Basis der Handschwingen ist im Flug das beste Erkennungszeichen.' },
  { term: 'Helles Armfeld', wp: 'Stockente', note: 'Bei Enten ist das helle Armfeld als blauer Spiegel ausgebildet, weiß gerahmt.' },
  { term: 'Große Armdecken', wp: 'Kiebitz', note: 'Die breiten Armdecken schieben sich beim stehenden Vogel über die Schwingen.' },
  { term: 'Augenring', wp: 'Flussregenpfeifer', note: 'Der gelbe Augenring trennt ihn vom Sandregenpfeifer, dem er fehlt.' },
  { term: 'Augenstreif', wp: 'Neuntöter', note: 'Die schwarze Maske über Zügel und Auge reicht bis hinter die Ohrendecken.' },
  { term: 'Zügelstreif', wp: 'Trauerschnäpper', note: 'Der Zügel liegt zwischen Schnabelbasis und Auge – beim Männchen Teil der schwarzen Kopfzeichnung.' },
  { term: 'Scheitelstreif', wp: 'Wintergoldhähnchen', note: 'Gelber Scheitelstreif, beim Männchen mit orangem Kern.' },
  { term: 'Scheitelseitenstreif', wp: 'Wintergoldhähnchen', note: 'Die schwarzen Seitenstreifen rahmen den gelben Scheitelstreif ein.' },
  { term: 'Wangenstreif', wp: 'Goldammer', note: 'Dunkler Rand unterhalb der Ohrendecken, der das gelbe Gesicht begrenzt.' },
  { term: 'Kinnstreif', wp: 'Rohrammer', note: 'Beim Männchen im Prachtkleid trennt ein weißer Bartstreif die schwarze Kehle vom schwarzen Kopf.' },
  { term: 'First', wp: 'Höckerschwan', note: 'Am Schnabelfirst sitzt der schwarze Höcker, beim Männchen deutlich größer.' },
  { term: 'Schulterfedern', wp: 'Austernfischer', note: 'Die Schulterfedern decken den Flügelansatz ab und bilden beim stehenden Vogel die schwarze Oberseite.' },
];

/** Beispiele, deren Begriff in dieser Stufe abgefragt wird */
export function examplesFor(terms) {
  const set = new Set(terms);
  return EXAMPLES.filter(e => set.has(e.term));
}
