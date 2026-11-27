// Gemeinsame Hilfen für generate-tokens.mjs und check-tokens.mjs: Token-Tabelle lesen und Alias-Regeln.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const themeDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const tokensDir = path.join(themeDir, 'tokens');
export const themes = ['authentic', 'green'];

/** Liest die Token-Tabelle (Semikolon, jedes Feld in Anführungszeichen, UTF-8 mit BOM). */
export function readTable(file = path.join(tokensDir, 'Token-Umbenennung.csv')) {
  return fs
    .readFileSync(file, 'utf8')
    .replace(/^﻿/, '')
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.slice(1, -1).split('";"'))
    .map((c) => ({ status: c[0], hinweis: c[2], codeOld: c[5], codeNew: c[6], art: c[10], merge: c[12] === 'ja' }));
}

export function readBaseline(file = path.join(tokensDir, 'code-tokens-vorher.json')) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export async function readConfig() {
  return (await import(pathToFileURL(path.join(tokensDir, 'token-config.mjs')).href)).default;
}

/** Stufe der neuen Namen, die dieses Paket (Issue #394) umsetzt. */
export const isPrimitiveOrBase = (name) => /^--lux-(primitive|base)-/.test(name);

/** Bestandsnamen, für die ein Alias entstehen kann (Theme-Tokens und die Utility-Properties). */
export const isOldLuxName = (name) =>
  name.startsWith('--lux-theme-') || name.startsWith('--lux-z-') || name === '--lux-focus-state-layer-color';

/** Arten, bei denen der alte Name ein Alias des neuen wird (Entscheidung: auch Stufe 3 mit dem bisherigen Code-Wert). */
export const ALIAS_ARTS = new Set(['Rename', 'Zusammenführung', 'Abgleich', 'Ersatz', 'Wertänderung']);

/**
 * Aliase alter Namen auf neue primitive/base-Namen.
 * Ergebnis: { shared: [[alt, neu]], perTheme: { authentic: [[alt, neu]], green: [...] } }
 */
export function buildAliases(rows, baseline, config) {
  const aliases = new Map();
  for (const r of rows) {
    if (!r.codeOld || !isPrimitiveOrBase(r.codeNew) || !ALIAS_ARTS.has(r.art)) continue;
    if (!isOldLuxName(r.codeOld) || !baseline[r.codeOld] || config.noAlias[r.codeOld]) continue;
    if (aliases.has(r.codeOld) && aliases.get(r.codeOld) !== r.codeNew) {
      throw new Error(`${r.codeOld} hat in der Tabelle zwei Ziele: ${aliases.get(r.codeOld)} und ${r.codeNew}`);
    }
    aliases.set(r.codeOld, r.codeNew);
  }
  const themeSpecific = new Set(Object.values(config.themeAliases).flatMap((m) => Object.keys(m)));
  const byName = ([a], [b]) => a.localeCompare(b, 'en', { numeric: true });
  const shared = [...aliases].filter(([old]) => !themeSpecific.has(old)).sort(byName);
  const perTheme = Object.fromEntries(
    themes.map((theme) => [
      theme,
      [...themeSpecific]
        .map((old) => [old, config.themeAliases[theme]?.[old] ?? aliases.get(old)])
        .filter(([, neu]) => neu)
        .sort(byName)
    ])
  );
  return { shared, perTheme };
}
