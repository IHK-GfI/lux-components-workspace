import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Liest Texte aus der deutschen Übersetzungsdatei der LUX-Components, damit die Tests
 * nicht die Fehlermeldungen abschreiben. Ändert sich ein Text, bleiben die Tests gültig –
 * fehlt eine Meldung oder erscheint die falsche, schlagen sie fehl.
 */
const LOCALE_FILE = path.resolve(__dirname, '../../../projects/lux-components-lib/locale/luxc-de.json');
const messages: Record<string, Record<string, string>> = JSON.parse(readFileSync(LOCALE_FILE, 'utf8')).luxc;

/**
 * @param key Schlüssel ohne "luxc."-Präfix, z. B. "util.error_message.required"
 * @param params Werte für Platzhalter wie {{minlength}}
 */
export function luxMessage(key: string, params: Record<string, string | number> = {}): string {
  return rawMessage(key).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => String(params[name]));
}

/**
 * Wie luxMessage, aber als RegExp: Platzhalter ohne Wert in `params` passen auf beliebigen Text.
 * Für Meldungen mit Werten, die der Test nicht exakt kennt (z. B. die Liste erlaubter Dateitypen).
 */
export function luxMessagePattern(key: string, params: Record<string, string | number> = {}): RegExp {
  const parts = rawMessage(key).split(/\{\{\s*(\w+)\s*\}\}/);
  const pattern = parts
    .map((part, index) => (index % 2 === 0 ? escapeRegExp(part) : part in params ? escapeRegExp(String(params[part])) : '.+'))
    .join('');
  return new RegExp(pattern);
}

function rawMessage(key: string): string {
  const separator = key.indexOf('.');
  const text = messages[key.slice(0, separator)]?.[key.slice(separator + 1)];
  if (typeof text !== 'string') {
    throw new Error(`Übersetzung "luxc.${key}" nicht gefunden in ${LOCALE_FILE}`);
  }
  return text;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
