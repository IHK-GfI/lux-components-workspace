# Design-Tokens: Quellen und Werkzeuge

Dieser Ordner enthält die Quellen der Token-Umbenennung (Issue #394, Component Tokens folgen mit #395). Er wird nicht mit dem npm-Paket ausgeliefert.

## Dateien

| Datei                     | Inhalt                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Token-Umbenennung.csv`   | Zuordnung alter zu neuer Namen mit Art der Änderung. Kopie aus dem Doku-Repository `design-system`, Ordner `6 Exploration/Design-System-Neuaufstellung`. Nicht von Hand ändern. |
| `code-tokens-vorher.json` | Aufgelöste Werte aller Tokens beider Themes vor der Umbenennung (Stand Branch `Issue_394-design-tokens` vor dem Umbau). Referenz für `check-tokens.mjs`.                        |
| `token-config.mjs`        | Ausnahmen zur Tabelle, jeweils mit Begründung (Aliase ohne Ziel, Alias-Ziel je Theme, Namen nur in Figma, fehlende Zeilen).                                                     |

### Herkunft

- `Token-Umbenennung.csv`: Git-Tag `token-umbenennung-v1.1` im Repository `design-system`, Commit `cd939cf` (26.11.2026). Der Hash steht hier, weil ein Tag verschoben werden kann.
- Figma: Branch `token-umbenennung` der Datei LUX-Components, benannte Version `token-umbenennung-v1.1`. Werte, die es nur in Figma gab (z. B. Palette `secondary`, `neutral-variant`, Stufen 5 und 15, Markenfarben, Überschriften), stammen aus diesem Branch. Vor dem Export wurde der Fingerabdruck geprüft (`Skripte/figma-fingerabdruck.js`): `gesamt 7653e165`, `primitive 365:f0e34f7e`, `base 159:ac320c6c`, also derselbe Stand wie `Skripte/figma-snapshots/fingerabdruck.json`.

Der Figma-MCP und der Dev Mode lesen immer den aktuellen Stand des Branches, nicht die benannte Version. Vor jedem neuen Abgleich deshalb zuerst den Fingerabdruck vergleichen (Kurzanleitung im Doku-Repository, Abschnitt 9).

## Aufbau im SCSS

| Datei                                                | Inhalt                                                                                             |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/base-templates/tokens/_primitives.scss`         | Mixin mit allen `--lux-primitive-*` (modusfrei). Paletten aus den Sass-Maps des Themes.            |
| `src/base-templates/tokens/_material-roles.scss`     | Mixin mit den Base Tokens, die bis zum Ticket „Brücke“ die Material-Rollen `--mat-sys-*` lesen.    |
| `src/theme-*/_variables.scss`                        | Oben die Base Tokens mit den Werten des Themes, darunter die Component Tokens mit den alten Namen. |
| `src/base-templates/tokens/_deprecated-aliases.scss` | **Generiert:** alte Namen als Aliase, gleich in allen Themes.                                      |
| `src/theme-*/_deprecated-aliases-theme.scss`         | **Generiert:** Aliase mit eigenem Ziel je Theme (z. B. `--lux-theme-radius-lg`).                   |
| `src/base-templates/common/_luxutilities.scss`       | `--lux-base-layer-*-z-index` (vorher `--lux-z-*`).                                                 |

Regeln für die Aliase:

- Ein Alias entsteht für jede Zeile mit neuem Namen `--lux-primitive-*` oder `--lux-base-*`, deren alter Name im Bestand vorkommt.
- Das gilt auch für die Arten Abgleich, Ersatz, Wertänderung und Zusammenführung: Der neue Name hat in #394 den bisherigen Code-Wert, der Wert aus Figma folgt mit #395 (Entscheidung vom 26.11.2026).
- Haben zusammengeführte alte Namen verschiedene Werte, bekommt der abweichende Name keinen Alias und bleibt eigenständig (`token-config.mjs`, `noAlias`).
- Die Alias-Dateien werden nach den Theme-Variablen geladen. Ein alter Name darf deshalb nicht zusätzlich in einer Media Query auf `:root` gesetzt werden (z. B. in `_variablesPreferContrast.scss`), sonst verdeckt der Alias diese Überschreibung. Solche Überschreibungen setzen den neuen Namen.

## Befehle (im Theme-Paket)

| Befehl                               | Wirkung                                                                                                         |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `npm run generate:tokens`            | Alias-Dateien aus der Tabelle neu erzeugen.                                                                     |
| `npm run generate:tokens -- --check` | Prüft nur, ob die Alias-Dateien aktuell sind.                                                                   |
| `npm run check:tokens`               | Kompiliert beide Themes und vergleicht alle Werte mit `code-tokens-vorher.json`, prüft neue Namen und Verweise. |
| `npm run lint:styles`                | Stylelint, Regel `custom-property-pattern`. Legacy-Dateien stehen in `.stylelintrc.json` unter `overrides`.     |
| `npm run test`                       | Build, Stylelint, Token-Prüfung und Generator-Check (läuft auch in der CI über `npm run test:theme`).           |

Zusätzlich lässt sich das Prüfskript des Design-Teams ausführen. `check-tokens.mjs --out` schreibt dafür die Werte im Format von `extract-code-tokens.js`:

```bash
node scripts/check-tokens.mjs --out code-tokens-nachher.json
node <design-system>/Skripte/check-alias-values.js tokens/Token-Umbenennung.csv tokens/code-tokens-vorher.json code-tokens-nachher.json
```

Solange #395 offen ist, meldet `check-alias-values.js` die noch fehlenden `--lux-component-*`-Namen. Für `--lux-primitive-*` und `--lux-base-*` darf es keine Meldung geben.

## Neue Tabelle übernehmen

1. Fingerabdruck des Figma-Branches prüfen (siehe oben). Weicht er ab, beim Design nachfragen.
2. `Token-Umbenennung.csv` aus dem Doku-Repository kopieren, Tag und Commit oben eintragen.
3. `npm run generate:tokens`, danach `npm run test`.
4. Neue Base Tokens in beiden `_variables.scss` anlegen, neue Primitives in `_primitives.scss`.
