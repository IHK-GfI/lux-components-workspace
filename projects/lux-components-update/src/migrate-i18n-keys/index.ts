import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { iterateFilesAndModifyContent } from '../utility/files';
import { logInfo } from '../utility/logging';
import { messageInfoRule } from '../utility/util';

export interface Options {
  project: string;
  path: string;
  verbose: boolean;
}

export function migrateI18nKeys(options: Options): Rule {
  return chain([
    messageInfoRule(`Die I18N-Tags in den HTML-Dateien werden migriert...`),
    migrateI18nKeysIntern(options),
    messageInfoRule(`Die I18N-Tags in den HTML-Dateien wurden migriert.`)
  ]);
}

function migrateI18nKeysIntern(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    iterateFilesAndModifyContent(
      tree,
      options.path,
      (filePath: string, content: string) => {
        let result = transformContent(content);

        if (result.changed) {
          logInfo(filePath + ' wurde angepasst.');
          tree.overwrite(filePath, result.content);
        }
      },
      '.html'
    );
  };
}

function transformContent(content: string) {
  let changed = false;

  // Attribute-level replacements (cases 1 & 2): i18n-attr
  // Regex explanation:
  // (\s)                       leading whitespace
  // (?:([\w:-]+)="[^"]*"\s+i18n-\2|i18n-([\w:-]+))="@@?([^"]+)"
  // Group 2 or 3 = attribute name; group 4 = key
  const attrRegex = /(\s)(?:([\w:-]+)="[^"]*"\s+i18n-\2|i18n-([\w:-]+))="@@?([^"]+)"/g;
  content = content.replace(attrRegex, (m, ws, attrWithValue, attrOnly, key) => {
    const attrName = attrWithValue || attrOnly;
    changed = true;
    return `${ws}${attrName}="{{ '${key}' | transloco }}"`;
  });

  // Element-level i18n replacement (case 3): <tag ... i18n="@@key">ExistingText</tag>
  // Caution: Avoid replacing if already contains transloco pipe.
  const elemRegex = /(<[a-zA-Z][^>]*?)\s+i18n="@@?([^"]+)"([^>]*>)([\s\S]*?<\/[a-zA-Z][^>]*?>)/g;
  content = content.replace(elemRegex, (m, startTagStart, key, startTagEnd, innerAndClose) => {
    // If inner already includes transloco pipe for this key, skip.
    if (innerAndClose.includes(`'${key}' | transloco`)) {
      return m; // idempotent
    }
    changed = true;
    // Remove any existing inner text between start and closing tag
    // Extract closing tag separately to keep structure.
    const closingTagMatch = innerAndClose.match(/<\/[a-zA-Z][^>]*?>$/);
    const closingTag = closingTagMatch ? closingTagMatch[0] : '';
    return `${startTagStart}${startTagEnd}{{ '${key}' | transloco }}${closingTag}`;
  });

  return { content, changed };
}