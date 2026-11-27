// Prüft die Design-Tokens beider Themes gegen den Bestand vor der Umbenennung (Issue #394).
// Aufruf: node scripts/check-tokens.mjs [--out <datei.json>]
//
// Kompiliert beide Themes mit Sass, liest die Deklarationen der obersten :root-Blöcke, löst var()-Ketten auf und prüft:
//  1. Jeder Name aus tokens/code-tokens-vorher.json hat in beiden Themes denselben aufgelösten Wert wie vorher
//     (alte Namen über ihre Aliase, alle übrigen Tokens unverändert). rem und px gelten als gleich.
//  2. Jeder neue primitive/base-Name aus der Token-Tabelle existiert in beiden Themes (Ausnahmen: token-config.mjs).
//  3. Kein Lux-Token verweist auf eine unbekannte Variable oder enthält einen Zyklus.
//  4. Jeder Bestandsname (--lux-theme-*, --lux-z-*) steht in der Token-Tabelle (Ausnahmen: token-config.mjs).
//  5. Kein alter Name mit Alias wird zusätzlich in einer Media Query auf :root gesetzt (der Alias würde das verdecken).
//
// --out schreibt die aufgelösten Werte im Format von extract-code-tokens.js aus dem Doku-Repository ({name: {A, G, Ar, Gr}}),
// damit dort zusätzlich check-alias-values.js laufen kann.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildAliases, isOldLuxName, isPrimitiveOrBase, readBaseline, readConfig, readTable, themeDir, themes } from './token-table.mjs';

const root = path.resolve(themeDir, '../..');
const sass = path.join(root, 'node_modules', 'sass', 'sass.js');
const outIndex = process.argv.indexOf('--out');
const outFile = outIndex > 0 ? process.argv[outIndex + 1] : null;

function compile(theme, tmp) {
  const out = path.join(tmp, `${theme}.css`);
  execFileSync(
    process.execPath,
    [
      sass,
      '--quiet',
      '--no-source-map',
      `--load-path=${path.join(root, 'node_modules')}`,
      path.join(themeDir, `src/theme-${theme}/lux-${theme}.scss`),
      out
    ],
    { stdio: 'inherit' }
  );
  return fs.readFileSync(out, 'utf8');
}

/** Deklarationen mit ihrem Kontext (Selektor-Kette). Ergebnis: [{ context: [...], name, value }]. */
function declarations(css) {
  const result = [];
  const stack = [];
  let buf = '';
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (ch === '{') {
      stack.push(buf.trim());
      buf = '';
    } else if (ch === '}') {
      stack.pop();
      buf = '';
    } else if (ch === ';') {
      // Leere Werte (z. B. "--lux-theme-accent-color: ;" in Green) werden wie in extract-code-tokens.js übersprungen,
      // damit die Ergebnisse mit tokens/code-tokens-vorher.json vergleichbar sind.
      const m = buf.trim().match(/^(--[\w-]+)\s*:\s*([\s\S]+)$/);
      if (m) result.push({ context: [...stack], name: m[1], value: m[2].trim().replace(/\s+/g, ' ') });
      buf = '';
    } else {
      buf += ch;
    }
  }
  return result;
}

const isTopRoot = (context) => context.length === 1 && /^:root\b/.test(context[0]);

/** Wie extract-code-tokens.js: oberste :root-Blöcke, die letzte Deklaration gewinnt. */
function topRoot(decls) {
  const map = {};
  for (const d of decls) if (isTopRoot(d.context)) map[d.name] = d.value;
  return map;
}

/** Löst var()-Ketten auf. Meldet unbekannte Namen und Zyklen über die Callbacks. */
function resolver(map, onMissing, onCycle) {
  const cache = {};
  const resolve = (name, seen = []) => {
    if (cache[name] !== undefined) return cache[name];
    if (seen.includes(name)) {
      onCycle([...seen, name]);
      return `var(${name})`;
    }
    const value = map[name].replace(/var\((--[\w-]+)(?:,([^)]*))?\)/g, (all, ref, fallback) => {
      if (map[ref] !== undefined) return resolve(ref, [...seen, name]);
      if (fallback !== undefined) return fallback.trim();
      onMissing(name, ref);
      return all;
    });
    cache[name] = value;
    return value;
  };
  return resolve;
}

// rem und px gelten als gleich (1 rem = 16 px), wie in check-alias-values.js.
const norm = (v) =>
  v === undefined
    ? undefined
    : v
        .replace(/(-?[\d.]+)rem\b/g, (_, n) => `${Math.round(Number(n) * 16 * 1e4) / 1e4}px`)
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

const rows = readTable();
const baseline = readBaseline();
const config = await readConfig();
const { shared, perTheme } = buildAliases(rows, baseline, config);
const aliasNames = new Set([...shared, ...Object.values(perTheme).flat()].map(([old]) => old));

const errors = [];
const notes = [];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lux-tokens-'));
const resolved = {};
const raw = {};
try {
  for (const theme of themes) {
    const decls = declarations(compile(theme, tmp));
    const map = topRoot(decls);
    raw[theme] = map;
    const resolve = resolver(
      map,
      (name, ref) => {
        if (/^--lux-/.test(name) && /^--lux-/.test(ref)) errors.push(`[${theme}] ${name} verweist auf unbekannte Variable ${ref}`);
      },
      (cycle) => errors.push(`[${theme}] Zyklus: ${cycle.join(' -> ')}`)
    );
    resolved[theme] = {};
    for (const name of Object.keys(map)) resolved[theme][name] = resolve(name);

    // 5. Alte Namen mit Alias dürfen nicht in einer Media Query auf :root gesetzt werden.
    for (const d of decls) {
      if (!aliasNames.has(d.name) || isTopRoot(d.context)) continue;
      const where = d.context.join(' > ');
      if (d.context[0].startsWith('@media') && /^:root\b/.test(d.context.at(-1))) {
        errors.push(`[${theme}] ${d.name} wird in "${where}" gesetzt, der Alias verdeckt diese Überschreibung`);
      } else {
        notes.push(`[${theme}] ${d.name} wird lokal in "${where}" überschrieben (wirkt nur für Leser des alten Namens)`);
      }
    }
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

// 1. Werte unverändert
const key = { authentic: 'Ar', green: 'Gr' };
let compared = 0;
for (const [name, before] of Object.entries(baseline)) {
  for (const theme of themes) {
    const expected = norm(before[key[theme]]);
    if (expected === undefined) continue;
    compared++;
    const actual = norm(resolved[theme][name]);
    if (actual === undefined) errors.push(`[${theme}] ${name} fehlt (vorher: ${expected})`);
    else if (actual !== expected) errors.push(`[${theme}] ${name}: Wert geändert, vorher ${expected}, jetzt ${actual}`);
  }
}

// 2. Neue primitive/base-Namen vorhanden
const notInCode = (name) => Object.keys(config.notInCode).some((p) => name === p || (p.endsWith('-') && name.startsWith(p)));
const expectedNew = [...new Set(rows.map((r) => r.codeNew).filter((n) => isPrimitiveOrBase(n) && !notInCode(n)))];
for (const name of expectedNew) {
  for (const theme of themes) if (raw[theme][name] === undefined) errors.push(`[${theme}] neuer Name ${name} fehlt`);
}

// 4. Bestand vollständig in der Tabelle
const mapped = new Set(rows.map((r) => r.codeOld).filter(Boolean));
for (const name of Object.keys(baseline)) {
  if (isOldLuxName(name) && !mapped.has(name) && !config.unmapped[name]) errors.push(`${name} steht nicht in der Token-Tabelle`);
}

// Neue Namen ohne Eintrag in der Tabelle (z. B. Tippfehler im SCSS)
const known = new Set(rows.map((r) => r.codeNew).filter(Boolean));
for (const theme of themes) {
  for (const name of Object.keys(raw[theme])) {
    if (isPrimitiveOrBase(name) && !known.has(name)) errors.push(`[${theme}] ${name} steht nicht in der Token-Tabelle`);
  }
}

if (outFile) {
  const out = {};
  const names = [...new Set(themes.flatMap((t) => Object.keys(raw[t])))].sort();
  for (const name of names) {
    if (!/^--(lux-|mat-sys-)/.test(name)) continue;
    out[name] = { A: raw.authentic[name], G: raw.green[name], Ar: resolved.authentic[name], Gr: resolved.green[name] };
  }
  fs.writeFileSync(outFile, JSON.stringify(out));
}

console.log(`Token-Prüfung: ${compared} Werte gegen den Bestand verglichen, ${expectedNew.length} neue Namen, ${aliasNames.size} Aliase`);
for (const n of notes) console.log(`  Hinweis: ${n}`);
for (const e of errors.slice(0, 50)) console.error(`  Fehler: ${e}`);
if (errors.length > 50) console.error(`  … und ${errors.length - 50} weitere`);
console.log(errors.length ? `${errors.length} Fehler` : 'Keine Abweichungen');
process.exit(errors.length ? 1 : 0);
