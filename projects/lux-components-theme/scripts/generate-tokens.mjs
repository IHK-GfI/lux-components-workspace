// Erzeugt die Alias-Dateien der alten Token-Namen aus tokens/Token-Umbenennung.csv (Issue #394).
// Aufruf: node scripts/generate-tokens.mjs           schreibt die Dateien
//         node scripts/generate-tokens.mjs --check   prüft nur, ob die Dateien aktuell sind (Exit-Code 1 sonst)
//
// Ein Alias entsteht für jede Zeile mit neuem Namen --lux-primitive-* oder --lux-base-*, deren alter Name
// (--lux-theme-*, --lux-z-*) im Bestand (tokens/code-tokens-vorher.json) vorkommt. Ausnahmen: tokens/token-config.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { buildAliases, readBaseline, readConfig, readTable, themeDir, themes } from './token-table.mjs';

const check = process.argv.includes('--check');

const header = (scope) => `// GENERIERT von scripts/generate-tokens.mjs aus tokens/Token-Umbenennung.csv – nicht von Hand ändern.
// Neu erzeugen: npm run generate:tokens (im Theme-Paket).
//
// ${scope}
// @deprecated Die alten Namen (--lux-theme-*, --lux-z-*) sind Aliase der neuen Namen und entfallen mit Version 23.
// Neuer Code und Überschreibungen in Anwendungen verwenden die neuen Namen (--lux-primitive-*, --lux-base-*).
//
// Die Datei wird nach den Theme-Variablen geladen. Ein alter Name darf deshalb nicht zusätzlich in einer
// Media Query auf :root gesetzt werden, der Alias würde diese Überschreibung verdecken (prüft check-tokens.mjs).
`;

function render(scope, pairs) {
  const body = pairs.map(([old, neu]) => `  ${old}: var(${neu});`).join('\n');
  return `${header(scope)}\n:root {\n${body}\n}\n`;
}

const rows = readTable();
const baseline = readBaseline();
const config = await readConfig();
const { shared, perTheme } = buildAliases(rows, baseline, config);

const files = [
  [path.join(themeDir, 'src/base-templates/tokens/_deprecated-aliases.scss'), render('Aliase, die in allen Themes gleich sind.', shared)],
  ...themes.map((theme) => [
    path.join(themeDir, `src/theme-${theme}/_deprecated-aliases-theme.scss`),
    render(`Aliase mit einem eigenen Ziel in diesem Theme (Theme ${theme}).`, perTheme[theme])
  ])
];

let stale = 0;
for (const [file, content] of files) {
  const rel = path.relative(themeDir, file).replace(/\\/g, '/');
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (check) {
    if (current !== content) {
      console.error(`Veraltet: ${rel} (npm run generate:tokens ausführen)`);
      stale++;
    }
  } else if (current !== content) {
    fs.writeFileSync(file, content);
    console.log(`Geschrieben: ${rel}`);
  }
}
console.log(`Aliase: ${shared.length} gemeinsam, ${themes.map((t) => `${perTheme[t].length} ${t}`).join(', ')}`);
process.exit(stale ? 1 : 0);
