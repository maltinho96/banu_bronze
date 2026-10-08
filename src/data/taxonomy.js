/* Systematik-Hilfsdaten: wissenschaftliche Namen, Reihenfolge, Merkmale.
 *
 * Die Zuordnung Art → Familie → Ordnung kommt aus der Artenliste
 * (species.json bzw. Übungsliste). Hier stehen nur Ergänzungen:
 *  - wissenschaftliche Namen der Ordnungen (-formes) und Familien (-idae)
 *  - eine systematische Reihenfolge, damit der Baum nicht alphabetisch ist
 *  - je Familie ein kurzes Merkmal, das beim Einordnen hilft
 * Unbekannte Namen aus einer importierten Liste funktionieren trotzdem,
 * sie erscheinen dann nur ohne Zusatzinfo und am Ende der Liste.
 */

/* Ordnungen in grober systematischer Folge (von „alt“ nach „modern“). */
export const ORDERS = [
  ['Hühnervögel', 'Galliformes', 'Bodenvögel mit kräftigen Scharrfüßen und kurzen, runden Flügeln.'],
  ['Gänsevögel', 'Anseriformes', 'Schwäne, Gänse, Enten: Schwimmhäute, Lamellenschnabel.'],
  ['Seglervögel', 'Apodiformes', 'Fast nur in der Luft, winzige Füße, sichelförmige Flügel.'],
  ['Taubenvögel', 'Columbiformes', 'Kleiner Kopf, Kropfmilch für die Jungen, trinken saugend.'],
  ['Kuckucksvögel', 'Cuculiformes', 'Wendezehen (zwei vorn, zwei hinten), heimisch nur der Kuckuck.'],
  ['Kranichvögel', 'Gruiformes', 'Rallen und Kraniche – sehr verschieden, aber verwandt.'],
  ['Lappentaucher', 'Podicipediformes', 'Lappenzehen statt Schwimmhäuten, Beine weit hinten.'],
  ['Regenpfeiferartige', 'Charadriiformes', 'Limikolen, Möwen und Seeschwalben – meist an Wasser und Küste.'],
  ['Regenpfeifervögel', 'Charadriiformes', 'Anderer deutscher Name für Regenpfeiferartige.'],
  ['Storchenvögel', 'Ciconiiformes', 'Große Stelzvögel, fliegen mit gestrecktem Hals.'],
  ['Ruderfüßer', 'Suliformes', 'Kormorane und Tölpel: alle vier Zehen mit Schwimmhaut verbunden.'],
  ['Pelikanvögel', 'Pelecaniformes', 'Reiher, Löffler, Ibisse; Reiher fliegen mit eingezogenem Hals.'],
  ['Greifvögel', 'Accipitriformes', 'Habichtartige: Hakenschnabel, Greiffüße – nicht näher mit Falken verwandt.'],
  ['Habichtartige', 'Accipitriformes', 'Bussarde, Milane, Habicht, Sperber, Adler, Weihen.'],
  ['Eulen', 'Strigiformes', 'Nachtaktive Jäger, Gesichtsschleier, Wendezehe.'],
  ['Rackenvögel', 'Coraciiformes', 'Eisvogel, Bienenfresser, Blauracke – bunt, verwachsene Vorderzehen.'],
  ['Spechtvögel', 'Piciformes', 'Wendezehen, Meißelschnabel, Stützschwanz.'],
  ['Falkenartige', 'Falconiformes', 'Falken: spitze Flügel, Falkenzahn am Schnabel – näher mit Sperlingsvögeln als mit Habichten verwandt.'],
  ['Sperlingsvögel', 'Passeriformes', 'Mehr als die Hälfte aller Vogelarten; drei Zehen vorn, eine hinten, die meisten mit Gesang.'],
];

/* Familien in systematischer Folge. [deutsch, wissenschaftlich, Merkmal] */
export const FAMILIES = [
  ['Fasanenartige', 'Phasianidae', 'Fasan, Rebhuhn, Wachtel – Bodenvögel, flüchten eher laufend.'],
  ['Raufußhühner', 'Tetraonidae', 'Befiederte Läufe und Zehen; heute meist zu den Fasanenartigen gestellt.'],
  ['Entenvögel', 'Anatidae', 'Schwäne, Gänse und Enten; Lamellenschnabel, Schwimmhäute.'],
  ['Segler', 'Apodidae', 'Mauersegler: landet fast nie, Füße nur zum Anklammern.'],
  ['Tauben', 'Columbidae', 'Gurrender Gesang, schlagen beim Abflug oft laut mit den Flügeln.'],
  ['Kuckucke', 'Cuculidae', 'Brutparasit – legt Eier in fremde Nester.'],
  ['Rallen', 'Rallidae', 'Bläss- und Teichhuhn, Wasserralle; Lappen- oder lange Zehen, nicken beim Schwimmen.'],
  ['Kraniche', 'Gruidae', 'Groß, langbeinig, trompetende Rufe, fliegen mit gestrecktem Hals.'],
  ['Lappentaucher', 'Podicipedidae', 'Hauben- und Zwergtaucher; Schwimmnest, tragen Junge auf dem Rücken.'],
  ['Austernfischer', 'Haematopodidae', 'Schwarz-weiß mit langem rotem Schnabel.'],
  ['Säbelschnäbler', 'Recurvirostridae', 'Aufgebogener Schnabel, schwarz-weiß.'],
  ['Regenpfeifer', 'Charadriidae', 'Kiebitz und Regenpfeifer; kurzer Schnabel, „Lauf-Stopp-Picken“.'],
  ['Schnepfenvögel', 'Scolopacidae', 'Wasserläufer, Brachvogel, Bekassine; lange Stocherschnäbel.'],
  ['Möwen', 'Laridae', 'Möwen und Seeschwalben; Schwimmhäute, oft grau-weiß.'],
  ['Seeschwalben', 'Sternidae', 'Schlank, gegabelter Schwanz, stoßtauchen; heute oft zu den Möwen gestellt.'],
  ['Störche', 'Ciconiidae', 'Klappern statt Rufen, Hals im Flug gestreckt.'],
  ['Kormorane', 'Phalacrocoracidae', 'Tauchen nach Fischen, trocknen danach die Flügel.'],
  ['Reiher', 'Ardeidae', 'Lange Beine, Dolchschnabel, Hals im Flug S-förmig eingezogen.'],
  ['Habichtartige', 'Accipitridae', 'Bussard, Milan, Habicht, Sperber, Weihen, Adler.'],
  ['Schleiereulen', 'Tytonidae', 'Herzförmiger Gesichtsschleier.'],
  ['Eigentliche Eulen', 'Strigidae', 'Waldkauz, Uhu, Waldohreule, Steinkauz.'],
  ['Eulen', 'Strigidae', 'Waldkauz, Uhu, Waldohreule, Steinkauz.'],
  ['Wiedehopfe', 'Upupidae', 'Federhaube, langer gebogener Schnabel.'],
  ['Eisvögel', 'Alcedinidae', 'Stoßtaucher, brütet in Erdröhren.'],
  ['Bienenfresser', 'Meropidae', 'Bunt, fängt Fluginsekten, brütet in Erdröhren.'],
  ['Spechte', 'Picidae', 'Trommeln, zimmern Höhlen, Stützschwanz.'],
  ['Falken', 'Falconidae', 'Turm-, Baum-, Wanderfalke; spitze Flügel.'],
  ['Pirole', 'Oriolidae', 'Pirol: gelb-schwarz, flötender Gesang, hoch in Baumkronen.'],
  ['Würger', 'Laniidae', 'Hakenschnabel, spießen Beute auf.'],
  ['Rabenvögel', 'Corvidae', 'Größte Sperlingsvögel; Krähen, Elster, Dohle, Häher.'],
  ['Meisen', 'Paridae', 'Höhlenbrüter, turnen an Zweigen, viele Ruftypen.'],
  ['Beutelmeisen', 'Remizidae', 'Kunstvolles Beutelnest an Zweigspitzen.'],
  ['Bartmeisen', 'Panuridae', 'Leben im Schilf; nicht mit den Meisen verwandt.'],
  ['Lerchen', 'Alaudidae', 'Bodenbrüter, Singflug, lange Hinterkralle.'],
  ['Schwalben', 'Hirundinidae', 'Insektenjagd im Flug, Lehm- oder Röhrennester.'],
  ['Schwanzmeisen', 'Aegithalidae', 'Winzig mit sehr langem Schwanz, kugeliges Nest; keine echten Meisen.'],
  ['Laubsänger', 'Phylloscopidae', 'Zilpzalp, Fitis, Waldlaubsänger; klein, grünlich, Kugelnest am Boden.'],
  ['Rohrsänger', 'Acrocephalidae', 'Teich- und Sumpfrohrsänger, Gelbspötter; im Röhricht und Gebüsch.'],
  ['Rohrsängerartige', 'Acrocephalidae', 'Teich- und Sumpfrohrsänger, Gelbspötter; im Röhricht und Gebüsch.'],
  ['Schwirle', 'Locustellidae', 'Heuschreckenartiges Schwirren als Gesang.'],
  ['Grasmücken', 'Sylviidae', 'Mönchs-, Garten-, Dorn-, Klappergrasmücke; versteckt im Gebüsch, schwätzender Gesang.'],
  ['Goldhähnchen', 'Regulidae', 'Kleinste Vögel Europas, Scheitelstreif.'],
  ['Zaunkönige', 'Troglodytidae', 'Winzig, gestelzter Schwanz, sehr lauter Gesang.'],
  ['Kleiber', 'Sittidae', 'Klettert auch kopfabwärts, mauert das Flugloch zu.'],
  ['Baumläufer', 'Certhiidae', 'Klettert spiralig stammaufwärts, Stützschwanz, gebogener Schnabel.'],
  ['Stare', 'Sturnidae', 'Schillerndes Gefieder, Imitationen im Gesang, große Schwärme.'],
  ['Wasseramseln', 'Cinclidae', 'Tauchen und laufen unter Wasser.'],
  ['Drosseln', 'Turdidae', 'Amsel, Sing-, Mistel-, Wacholderdrossel; mittelgroß, laufen und hüpfen am Boden.'],
  ['Fliegenschnäpper', 'Muscicapidae', 'Rotkehlchen, Rotschwänze, Schnäpper, Kehlchen, Nachtigall.'],
  ['Braunellen', 'Prunellidae', 'Heckenbraunelle: unscheinbar, feiner Schnabel.'],
  ['Sperlinge', 'Passeridae', 'Haus- und Feldsperling; Kegelschnabel, Kulturfolger.'],
  ['Stelzen und Pieper', 'Motacillidae', 'Lange Schwänze, wippen, laufen statt hüpfen.'],
  ['Stelzen', 'Motacillidae', 'Lange Schwänze, wippen, laufen statt hüpfen.'],
  ['Finken', 'Fringillidae', 'Kegelschnabel, Samenfresser, wellenförmiger Flug.'],
  ['Ammern', 'Emberizidae', 'Kegelschnabel wie Finken, aber eigene Familie; Goldammer, Rohrammer.'],
];

const ORDER_IDX = new Map(ORDERS.map(([de], i) => [de, i]));
const FAM_IDX = new Map(FAMILIES.map(([de], i) => [de, i]));
export const ORDER_INFO = new Map(ORDERS.map(([de, sci, note]) => [de, { sci, note }]));
export const FAMILY_INFO = new Map(FAMILIES.map(([de, sci, note]) => [de, { sci, note }]));

const byIndex = (idx, a, b) => {
  const ia = idx.has(a) ? idx.get(a) : 999, ib = idx.has(b) ? idx.get(b) : 999;
  return ia - ib || a.localeCompare(b, 'de');
};

/** Baut Ordnung → Familie → Arten aus der Artenliste. */
export function buildTree(species) {
  const orders = new Map();
  for (const sp of species) {
    const ord = sp.ord || 'Ohne Ordnung';
    const fam = sp.fam || 'Ohne Familie';
    if (!orders.has(ord)) orders.set(ord, new Map());
    const fams = orders.get(ord);
    if (!fams.has(fam)) fams.set(fam, []);
    fams.get(fam).push(sp);
  }
  return [...orders.keys()].sort((a, b) => byIndex(ORDER_IDX, a, b)).map(ord => ({
    name: ord,
    info: ORDER_INFO.get(ord) || null,
    families: [...orders.get(ord).keys()].sort((a, b) => byIndex(FAM_IDX, a, b)).map(fam => ({
      name: fam,
      info: FAMILY_INFO.get(fam) || null,
      species: orders.get(ord).get(fam).slice().sort((a, b) => a.de.localeCompare(b.de, 'de')),
    })),
  }));
}

/* ------------------------------------------------------------------
 * Verwandtschaftsbaum der Ordnungen (Kladogramm)
 *
 * Nur gut abgesicherte Großgruppen aus den genomischen Stammbäumen
 * (Jarvis et al. 2014, Prum et al. 2015, Stiller et al. 2024).
 * Ordnungen, deren genaue Stellung noch umstritten ist, stehen unter
 * „Weitere Linien“. Unbekannte Ordnungen aus einer importierten Liste
 * werden ebenfalls dort einsortiert.
 * Blätter: { order: '<deutscher Ordnungsname>', alias: [weitere Namen] }
 * ------------------------------------------------------------------ */
export const CLADOGRAM = {
  name: 'Vögel', sci: 'Aves',
  note: 'Alle heutigen Vögel. Die Laufvögel (Strauß, Emu, Kiwi) bilden einen eigenen, sehr alten Zweig – in Deutschland kommen sie nicht wild vor.',
  children: [
    {
      name: 'Hühner- und Gänsevögel', sci: 'Galloanserae',
      note: 'Haben sich als erste von allen übrigen Vögeln abgespalten. Hühner und Enten sind also enger verwandt, als sie aussehen.',
      children: [{ order: 'Hühnervögel' }, { order: 'Gänsevögel' }],
    },
    {
      name: 'Alle übrigen Vögel', sci: 'Neoaves',
      note: 'Über 90 % aller Vogelarten.',
      children: [
        {
          name: 'Landvögel', sci: 'Telluraves',
          note: 'Greifvögel, Eulen, Spechte, Falken und Singvögel gehen auf einen gemeinsamen Vorfahren zurück – vermutlich einen Beutegreifer.',
          children: [
            {
              name: 'Greifvogel-Linie', sci: 'Afroaves',
              note: 'Habichtartige, Eulen, Racken- und Spechtvögel.',
              children: [{ order: 'Greifvögel', alias: ['Habichtartige'] }, { order: 'Eulen' }, { order: 'Rackenvögel' }, { order: 'Spechtvögel' }],
            },
            {
              name: 'Falken-Singvogel-Linie', sci: 'Australaves',
              note: 'Falken sind die nächsten Verwandten von Papageien und Sperlingsvögeln – nicht von Bussard und Habicht. Die Ähnlichkeit zu den Greifvögeln ist eine Anpassung an die Jagd.',
              children: [{ order: 'Falkenartige' }, { order: 'Sperlingsvögel' }],
            },
          ],
        },
        {
          name: 'Wasservogel-Kern', sci: 'Aequornithes',
          note: 'Störche, Reiher, Kormorane – dazu Seetaucher und Sturmvögel.',
          children: [{ order: 'Storchenvögel' }, { order: 'Ruderfüßer' }, { order: 'Pelikanvögel' }],
        },
        {
          name: 'Weitere Linien', sci: null, rest: true,
          note: 'Wie diese Ordnungen untereinander verzweigen, ist noch nicht sicher geklärt.',
          children: [
            { order: 'Seglervögel' }, { order: 'Taubenvögel' }, { order: 'Kuckucksvögel' },
            { order: 'Kranichvögel' }, { order: 'Lappentaucher' },
            { order: 'Regenpfeiferartige', alias: ['Regenpfeifervögel'] },
          ],
        },
      ],
    },
  ],
};

/** Hängt die Ordnungen aus der Artenliste in das Kladogramm ein.
 *  Gibt eine Kopie zurück, in der jedes Blatt `ord` (Knoten aus buildTree) trägt;
 *  Zweige ohne vorhandene Ordnung werden entfernt. */
export function buildCladogram(tree) {
  const byName = new Map(tree.map(o => [o.name, o]));
  const used = new Set();
  const walk = n => {
    if (n.order) {
      const names = [n.order, ...(n.alias || [])];
      const hits = names.map(x => byName.get(x)).filter(Boolean);
      hits.forEach(o => used.add(o.name));
      return hits.map(o => ({ ord: o }));
    }
    let kids = n.children.flatMap(walk);
    return [{ ...n, children: kids }];
  };
  const root = walk(CLADOGRAM)[0];
  // Ordnungen, die im Kladogramm fehlen → „Weitere Linien“
  const missing = tree.filter(o => !used.has(o.name)).map(o => ({ ord: o }));
  const addMissing = n => {
    if (n.rest) n.children.push(...missing);
    (n.children || []).forEach(c => c.children && addMissing(c));
  };
  addMissing(root);
  // leere Zweige entfernen, Zweige mit nur einem Kind zusammenziehen ist nicht nötig
  const prune = n => {
    if (!n.children) return n;
    n.children = n.children.map(prune).filter(c => c.ord || c.children.length);
    return n;
  };
  return prune(root);
}

/* ------------------------------------------------------------------
 * Morphologisch definierte Artengruppen
 *
 * Prüfungsfrage Bronze 1.1: „Zu welcher Familie/Ordnung/morphologisch
 * definierten Artengruppe gehört dieser Vogel?“
 * Artengruppen fassen Vögel nach Bau und Lebensweise zusammen. Sie decken
 * sich oft NICHT mit der Verwandtschaft – genau das ist der Lerneffekt
 * (z. B. Greifvögel = Habichtartige + Falken).
 * Zuordnung über Ordnung (ords), Familie (fams) oder Gattung (gen).
 * Eine Art kann in mehreren Gruppen stehen (Stockente: Gründelente und Wasservogel).
 * Gruppen, die exakt einer Ordnung oder Familie entsprechen (Eulen, Spechte,
 * Tauben, Hühnervögel), stehen bewusst nicht hier – die zeigt der Baum.
 * ------------------------------------------------------------------ */
export const GROUPS = [
  { name: 'Singvögel', sci: 'Passeri (Oscines)', ords: ['Sperlingsvögel'],
    note: 'Unterordnung der Sperlingsvögel mit besonders fein gesteuertem Stimmorgan (Syrinx). In Mitteleuropa sind alle Sperlingsvögel Singvögel – auch Krähen.' },
  { name: 'Greifvögel', sci: null, ords: ['Greifvögel', 'Habichtartige', 'Falkenartige'], fams: ['Habichtartige', 'Falken', 'Fischadler'],
    note: 'Tagaktive Jäger mit Hakenschnabel und Greiffüßen. Umfasst Habichtartige UND Falken, obwohl beide nicht näher miteinander verwandt sind.' },
  { name: 'Limikolen (Watvögel)', sci: 'Charadrii', fams: ['Regenpfeifer', 'Schnepfenvögel', 'Austernfischer', 'Säbelschnäbler', 'Stelzenläufer', 'Triele'],
    note: 'Meist langbeinig, mit Stocher- oder Pickschnabel; an Ufern, im Watt und auf Feuchtwiesen. Teil der Regenpfeiferartigen, aber ohne Möwen.' },
  { name: 'Möwen und Seeschwalben', sci: 'Lari', fams: ['Möwen', 'Seeschwalben', 'Raubmöwen'],
    note: 'Schwimmhäute, lange spitze Flügel, meist grau-weiß. Ebenfalls Regenpfeiferartige.' },
  { name: 'Stelzvögel', sci: null, fams: ['Reiher', 'Störche', 'Kraniche', 'Ibisse und Löffler'],
    note: 'Große Vögel mit langen Beinen, langem Hals und langem Schnabel; schreiten bei der Nahrungssuche. Reiher, Störche und Kraniche gehören zu drei verschiedenen Ordnungen.' },
  { name: 'Wasservögel', sci: null, fams: ['Entenvögel', 'Lappentaucher', 'Rallen', 'Kormorane', 'Seetaucher'],
    excl: ['Wasserralle', 'Wachtelkönig', 'Tüpfelsumpfhuhn'],
    note: 'Schwimmend lebende Vögel – im Sinne der Wasservogelzählung: Entenvögel, Lappentaucher, Kormorane, Seetaucher und schwimmende Rallen wie Blässhuhn.' },
  { name: 'Gründelenten', sci: 'Anatini', gen: ['Anas', 'Mareca', 'Spatula', 'Sibirionetta'],
    note: 'Gründeln mit dem Kopf unter Wasser, Schwanz nach oben. Liegen hoch im Wasser und starten senkrecht aus dem Wasser. Farbiger Flügelspiegel.' },
  { name: 'Tauchenten', sci: 'Aythyini', gen: ['Aythya', 'Netta', 'Bucephala', 'Clangula', 'Melanitta', 'Somateria'],
    note: 'Tauchen ganz ab. Liegen tief im Wasser, Beine weit hinten, laufen zum Start über die Wasseroberfläche an.' },
  { name: 'Säger', sci: 'Mergini', gen: ['Mergus', 'Mergellus'],
    note: 'Tauchende Fischjäger unter den Entenvögeln mit schmalem, gezähntem Schnabel.' },
  { name: 'Gänse', sci: 'Anserini', gen: ['Anser', 'Branta'], note: 'Große, langhalsige Entenvögel, grasen viel an Land.' },
  { name: 'Schwäne', sci: 'Cygnini', gen: ['Cygnus'], note: 'Größte Entenvögel, sehr langer Hals, weiß.' },
  { name: 'Halbgänse', sci: 'Tadornini', gen: ['Tadorna', 'Alopochen'], note: 'Zwischen Gänsen und Enten; Brandgans und Nilgans.' },
];

const genus = sp => (sp.sci || '').split(' ')[0];

/** Alle Artengruppen, zu denen eine Art gehört. */
export function groupsOf(sp) {
  return GROUPS.filter(g =>
    !(g.excl || []).includes(sp.de) && (
      (g.ords || []).includes(sp.ord) ||
      (g.fams || []).includes(sp.fam) ||
      (g.gen || []).includes(genus(sp))));
}

/** Gruppen mit ihren Arten aus der Liste (leere Gruppen fallen weg). */
export function buildGroups(species) {
  return GROUPS.map(g => {
    const members = species.filter(sp => groupsOf(sp).includes(g)).sort((a, b) => a.de.localeCompare(b.de, 'de'));
    return { ...g, species: members,
      orders: [...new Set(members.map(m => m.ord))], families: [...new Set(members.map(m => m.fam))] };
  }).filter(g => g.species.length);
}
