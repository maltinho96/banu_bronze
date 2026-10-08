# Feldornithologie-Trainer (BANU Bronze)

Lern-App fürs Handy: Artenkenntnis (Foto + Ton), äußere Topografie (antippbare Vogelzeichnungen und echte Fotos), Brutzeitcodes und Wissensfragen nach dem BANU-Fragenkatalog. Vite, ohne Framework, läuft als statische Seite auf GitHub Pages.

## Todo: Einrichten in GitHub Codespaces

1. **Repo anlegen** – auf GitHub „New repository“, z. B. `banu-trainer` (public, damit Pages kostenlos läuft).
2. **Codespace öffnen** – im Repo: *Code → Codespaces → Create codespace on main*.
3. **Dateien hochladen** – ZIP entpacken und den Inhalt per Drag & Drop in den Explorer des Codespace ziehen (inkl. der versteckten Ordner `.github` und `.devcontainer`). Alternativ im Terminal: ZIP hochladen, dann `unzip banu-trainer.zip && cp -r banu-trainer/. . && rm -r banu-trainer banu-trainer.zip`.
4. **Installieren & starten**
   ```bash
   npm install
   npm run dev
   ```
   Codespaces öffnet Port 5173 im Browser. Zum Testen am Handy: Tab *Ports* → Port 5173 → Rechtsklick → *Port Visibility → Public*, dann die URL am Handy öffnen.
5. **Offizielle Artenliste einbinden** (wichtig – die eingebaute Liste ist nur eine Übungsliste)
   - `BANU_Feldornithologie_Begleitmaterial_Artenliste_2026.xlsx` von banu-akademien.de → *Download Feldornithologie* laden und in den Codespace ziehen
   - `npm run import-list -- BANU_Feldornithologie_Begleitmaterial_Artenliste_2026.xlsx`
   - Ausgabe prüfen: sollen **75 Arten** sein. Falls nicht: Blattnamen/Spalten in der Ausgabe ansehen und ggf. `src/lib/parse-list.js` anpassen.
   - Lauttyp prüfen: in `src/data/species.json` steht pro Art `"snd": "song" | "call" | "drumming"` (geschätzt). Für Enten, Gänse, Möwen, Greifvögel usw. `call`, Buntspecht `drumming`.
6. **Bessere Tonaufnahmen holen** (behebt das „Ton passt nicht zum Vogel“-Problem am gründlichsten)
   - kostenlos bei xeno-canto.org registrieren, API-Key im Account kopieren
   - `XC_KEY=dein_key npm run fetch-audio` (dauert ca. 5–10 min, 1 Anfrage/Sekunde)
   - einzelne Art neu holen: `XC_KEY=dein_key npm run fetch-audio -- "Parus major"`
   - Ergebnis `src/data/audio.json` stichprobenartig in der App anhören (Modus *Artenliste*)
7. **GitHub Pages aktivieren** – im Repo *Settings → Pages → Build and deployment → Source: GitHub Actions*.
8. **Committen & pushen**
   ```bash
   git add -A && git commit -m "BANU-Trainer" && git push
   ```
   Unter *Actions* läuft „Auf GitHub Pages veröffentlichen“. Danach ist die App unter `https://<dein-name>.github.io/banu-trainer/` erreichbar.
9. **Aufs Handy** – URL öffnen → Teilen → *Zum Home-Bildschirm*. Startet dann wie eine App; der Lernfortschritt bleibt auf dem Gerät gespeichert.
10. **Codespace stoppen**, wenn du fertig bist (spart Freikontingent): *Code → Codespaces → … → Stop*.

## Was wo liegt

| Datei | Inhalt |
|---|---|
| `src/views/arten.js` | Artentrainer: Prüfung (30 Arten, ½ Foto, ½ Ton), Üben mit Schwachstellen-Gewichtung, Artenliste zum Durchhören, Ton-Autostart |
| `src/views/systematik.js` | Systematik: Verwandtschaftsbaum mit Ästen, Liste zum Aufklappen, Abdecken, Einordnen, „Art nennen“ |
| `src/data/taxonomy.js` | wissenschaftliche Namen, Reihenfolge und Merkmale der Ordnungen und Familien; Kladogramm der Großgruppen (Galloanserae, Neoaves, Telluraves …) nach den genomischen Stammbäumen |
| `src/views/topografie.js` | Topografie: Erkunden, „Wo ist …?“, Benennen, Am Foto, Begriffsübersicht – Bronze bzw. Silber/Gold |
| `src/views/brutzeit.js` | Brutzeitcodes: Szenario → Code, A/B/C, Verwechslungspaare, Code → Bedeutung |
| `src/views/fragen.js` | Wissensfragen (Katalog + aus der Artenliste generiert), Brutzeitcode- und Rote-Liste-Tabellen |
| `src/data/topography.js` | Begriffe, Erklärungen, SVG-Zeichnungen (eigene, schematische) |
| `src/data/questions.js` | Fragenkatalog und Fragengeneratoren |
| `src/data/questions-extra.js` | zweiter Fragenpool – hier eigene Fragen ergänzen |
| `src/data/questions-bronze.js` | 105 Fragen nur für Bronze: Topografie, Familien und Artengruppen, Lebensräume, Recht, Brutzeitcodes |
| `src/data/brutzeit.js` | Brutzeitcodes und 45 Feldszenarien |
| `src/data/topo-examples.js` | echte Arten als Beispiel je Topografie-Begriff |
| `src/data/species-builtin.js` | inoffizielle Übungsliste (Fallback) |
| `src/lib/media.js` | Fotos (Wikipedia), Töne (audio.json → Commons), Sperr-/Merkliste |
| `scripts/` | Import der xlsx, Abruf der xeno-canto-Aufnahmen |

## Tonauswahl im Detail

1. Aufnahmen aus `src/data/audio.json` (xeno-canto, exakte Art, Qualität A/B, passender Lauttyp, bevorzugt Deutschland, ohne Jungvögel/Klangattrappe/Begleitarten).
2. Nur wenn dort < 3 Aufnahmen: Wikimedia Commons in drei Stufen – wissenschaftlicher Name im Dateinamen, dann Volltextsuche, dann deutscher Name im Dateinamen. Gewertet wird immer nur, was den Namen wirklich im Dateinamen trägt.
3. Abgespielt wird bevorzugt die mp3-Umwandlung von Commons (Safari auf dem iPhone spielt kein Ogg Vorbis), die Originaldatei liegt als zweite Quelle dahinter.
3. In der App nach dem Auflösen: **„Passt nicht“** sperrt eine Aufnahme dauerhaft, **„Als Standard merken“** setzt sie nach vorn. Zurücksetzen pro Art im Modus *Artenliste*.

## Bilder selbst auswählen

Standardmäßig zeigt die App das Wikipedia-Artikelbild. Das passt nicht immer – im Foto-Modus der Topografie soll das Merkmal ja gut sichtbar sein.

1. In der App: *Mehr → Bilder auswählen*. Gezeigt werden nur die Merkmale der oben eingestellten Stufe – in Bronze also die 19 Bronze-Merkmale.
2. Motiv antippen und beliebig viele passende Bilder auswählen. Im Training wird abwechselnd eines davon gezeigt. Drei Wege:
   - aus den Kandidaten antippen (nochmal antippen entfernt wieder),
   - *Art suchen* – eine andere Art eingeben, die das Merkmal besser zeigt (z. B. „Fitis“ für den hellen Tarsus),
   - *Link übernehmen* – Adresse einer Commons-Dateiseite, eines Wikipedia-Artikels oder direkt eines Bildes einfügen.
3. Unten *Auswahl als photos.json herunterladen* (oder in die Zwischenablage kopieren).
4. Datei als `src/data/photos.json` ins Repo legen, committen, pushen. Ab dem nächsten Deploy sieht jedes Gerät genau diese Bilder.

Im Codespace, wenn die Datei im Download-Ordner deines Rechners liegt: einfach per Drag & Drop nach `src/data/` ziehen. Alternativ die Zwischenablage nutzen und im Editor eine neue Datei `src/data/photos.json` anlegen und einfügen.

Aufbau der Datei: pro Schlüssel eine Liste von Bildern. Schlüssel sind `topo:<Begriff>` für den Foto-Modus der Topografie und `art:<wissenschaftlicher Name>` für den Artentrainer. Jedes Bild speichert `src`, `thumb`, `title`, `by` (Urheber), `lic` (Lizenz), `link` und `sp` (angezeigte Art). Weicht `sp` von der Standardart des Merkmals ab, zeigt die App den Namen der abgebildeten Art an.

## Eigene Fragen ergänzen

In `src/data/questions-extra.js` ein Objekt zu `EXTRA` hinzufügen:
```js
{ id: 'eigene-1', lv: 'b', cat: 'oek', type: 'single',
  q: 'Frage?', opts: ['richtig', 'falsch', 'falsch'], ok: [0], a: 'Erklärung.' }
```
`lv`: Stufen (`b`, `s`, `g`), `cat`: `sys`, `oek`, `leb`, `sach` oder `meth`, `type`: `single`, `multi` oder `open` (Karteikarte).

Neue Brutzeitcode-Szenarien kommen nach `src/data/brutzeit.js` in `SCENARIOS`:
```js
{ s: 'Beobachtung …', c: 'C14', x: 'Warum dieser Code und nicht der ähnliche.' }
```

Neue Foto-Beispiele für die Topografie nach `src/data/topo-examples.js`:
```js
{ term: 'Bürzel', wp: 'Mehlschwalbe', note: 'Merksatz fürs Feld.' }
```
`wp` ist der Titel des deutschen Wikipedia-Artikels, aus dem das Foto geladen wird.

## Quellen & Hinweise

- Begriffe der Topografie und Fragenstil nach den BANU-Begleitmaterialien (Morphologische Bezeichnungen 2026, Exemplarische Prüfungsfragen 2025). Die Zeichnungen sind eigene Schemazeichnungen.
- Fotos/Texte: Wikipedia. Töne: xeno-canto (Lizenz und Urheber pro Aufnahme angezeigt) und Wikimedia Commons.
- Antworten zu Recht und Ökologie sind Lernhilfen ohne Gewähr – im Zweifel die Originalquellen prüfen.
