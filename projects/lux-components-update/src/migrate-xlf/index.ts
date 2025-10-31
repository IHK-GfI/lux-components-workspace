import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { logInfo, logWarn } from '../utility/logging';
import { messageInfoRule } from '../utility/util';

export interface Options {
  project: string;
  path: string;
  namespace: boolean;
  verbose: boolean;
}

export function migrateXlf(options: Options): Rule {
  return chain([
    messageInfoRule(`Die XLF-Dateien werden migriert...`),
    migrateXlfIntern(options, 'de'),
    migrateXlfIntern(options, 'en'),
    messageInfoRule(`Die XLF-Dateien wurden migriert.`)
  ]);
}

function migrateXlfIntern(options: Options, lang: 'de' | 'en'): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const xlfFilePath = (options.path ?? '') + `/src/locale/messages${lang === 'de' ? '' : '.en'}.xlf`;
    const jsonFilePath = (options.path ?? '') + `/src/locale/${lang}.json`;

    if (!tree.exists(xlfFilePath)) {
      logInfo(`Die Datei '${xlfFilePath}' wurde nicht gefunden. Die Migration wird übersprungen.`);
      return;
    }

    const xlfContent = tree.read(xlfFilePath)?.toString() ?? '';
    let jsonContent = '';

    const transUnits = [];
    const tuRegex = /<trans-unit([^>]*)>([\s\S]*?)<\/trans-unit>/g;
    let match;
    while ((match = tuRegex.exec(xlfContent)) !== null) {
      const attrs = match[1];
      const body = match[2];
      const idMatch = /id="([^"]+)"/.exec(attrs);
      if (!idMatch) continue;
      const id = idMatch[1].trim();
      if (id.startsWith('luxc.')) continue;
      const sourceMatch = /<source>([\s\S]*?)<\/source>/.exec(body);
      if (!sourceMatch) continue;
      const targetMatch = /<target[^>]*>([\s\S]*?)<\/target>/.exec(body);
      const source = normalizeMessage(sourceMatch[1]);
      const target = targetMatch ? normalizeMessage(targetMatch[1]) : undefined;
      transUnits.push({ id, source, target });
    }

    const namespaces: any = {};
    for (const tu of transUnits) {
      const { ns, key } = resolveNamespaceAndKey(options, tu.id);
      namespaces[ns] = namespaces[ns] || {};
      const useTarget = lang && lang.toLowerCase() === 'en';
      const value = useTarget ? tu.target || tu.source : tu.source;
      if (useTarget && !tu.target) {
        logWarn(`[MISSING TARGET] ${tu.id} -> falling back to <source>`);
      }
      namespaces[ns][key] = value;
    }

    let sortedNamespaces;
    if (!options.namespace) {
      const flat = namespaces._flat || {};
      const sortedFlat = Object.keys(flat)
        .sort()
        .reduce((acc: any, k: string) => {
          acc[k] = flat[k];
          return acc;
        }, {});
      jsonContent = JSON.stringify(sortedFlat, null, 2) + '\n';
      sortedNamespaces = ['(flat)'];
    } else {
      sortedNamespaces = Object.keys(namespaces).sort();
      const aggregate: Record<string, Record<string, string>> = {};
      for (const ns of sortedNamespaces) {
        const obj = namespaces[ns];
        const sortedKeys = Object.keys(obj)
          .sort()
          .reduce((acc: any, k: string) => {
            acc[k] = obj[k];
            return acc;
          }, {});
        aggregate[ns] = sortedKeys;
      }
      jsonContent = JSON.stringify(aggregate, null, 2) + '\n';
    }

    if (!tree.exists(jsonFilePath)) {
      tree.create(jsonFilePath, jsonContent);
      logInfo(`Die Datei '${jsonFilePath}' wurde erstellt.`);
    } else {
      tree.overwrite(jsonFilePath, jsonContent);
      logInfo(`Die Datei '${jsonFilePath}' wurde aktualisiert.`);
    }
  };
}

function normalizeMessage(text: string) {
  let t = text
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .trim();
  t = t.replace(/<x [^>]*equiv-text="([^"]+)"[^>]*\/>/g, (_m, p1) => {
    let val = p1;
    const interpolation = /\{\{\s*([^}]+?)\s*\}\}/.exec(val);
    if (interpolation) {
      return `{{${interpolation[1].trim()}}}`;
    }
    const cleaned = val.replace(/[^a-zA-Z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
    return `{{${cleaned || 'value'}}}`;
  });
  return t;
}

function resolveNamespaceAndKey(options: Options, id: string) {
  let work = id;
  if (!options.namespace) {
    return { ns: '_flat', key: work };
  }
  const segments = work.split('.');
  let ns = segments[0];
  let rest = segments.slice(1).join('.');
  if (!rest) rest = '_';
  return { ns, key: rest };
}
