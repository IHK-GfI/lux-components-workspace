import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { load } from 'cheerio';
import { logInfo } from '../utility/logging';
import { messageInfoRule } from '../utility/util';

const TRANS_UNIT_SELECTOR: string = 'trans-unit';

export function updateEnMessages(): Rule {
  return chain([
    messageInfoRule(`Die englischen Übersetzungen im Projekt werden aktualisiert...`),
    updateEnMessagesIntern(),
    messageInfoRule(`Die englischen Übersetzungen im Projekt wurden aktualisiert.`)
  ]);
}

function updateEnMessagesIntern(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const filePathLCEn = '/node_modules/@ihk-gfi/lux-components/src/locale/messages.en.xlf';
    const filePathSDEn = '/node_modules/@ihk-gfi/lux-stammdaten/src/locale/messages.en.xlf';
    const filePathAPPEn = '/src/locale/messages.en.xlf';
    const filePathAPPDe = '/src/locale/messages.xlf';

    const contentLCEn = readTransUnitFile(tree, filePathLCEn);
    const contentSDEn = readTransUnitFile(tree, filePathSDEn);
    const contentAPPEn = readTransUnitFile(tree, filePathAPPEn);
    const contentAPPDe = readTransUnitFile(tree, filePathAPPDe);

    const fnLCEEn = load(contentLCEn, { xmlMode: true, decodeEntities: false });
    const fnSDEn = load(contentSDEn, { xmlMode: true, decodeEntities: false });
    const fnAPPEn = load(contentAPPEn, { xmlMode: true, decodeEntities: false });
    const fnAPPDe = load(contentAPPDe, { xmlMode: true, decodeEntities: false });

    let newContent = headerContent;

    fnAPPDe(TRANS_UNIT_SELECTOR).each((_i, element) => {
      const id = fnAPPDe(element).attr('id');
      if (id?.startsWith('luxc.')) {
        const transUnit = fnLCEEn(`trans-unit[id="${id}"]`).first();
        fnAPPDe('\n        ' + fnLCEEn(transUnit).find('target').toString()).insertAfter(fnAPPDe(`trans-unit[id="${id}"]`).find('source'));
        newContent += '\n      ' + fnAPPDe(element).toString();
      } else if (id?.startsWith('luxsd.')) {
        const transUnit = fnSDEn(`trans-unit[id="${id}"]`).first();
        fnAPPDe('\n        ' + fnSDEn(transUnit).find('target').toString()).insertAfter(fnAPPDe(`trans-unit[id="${id}"]`).find('source'));
        newContent += '\n      ' + fnAPPDe(element).toString();
      } else {
        const transUnit = fnAPPEn(`trans-unit[id="${id}"]`).first();
        fnAPPDe('\n        ' + fnAPPEn(transUnit).find('target').toString()).insertAfter(fnAPPDe(`trans-unit[id="${id}"]`).find('source'));
        newContent += '\n      ' + fnAPPDe(element).toString();
      }
    });

    newContent += footerContent;

    logInfo(`Die Datei '${filePathAPPEn}' wurde aktualisiert.`);
    if (!tree.exists(filePathAPPEn)) {
      tree.create(filePathAPPEn, newContent);
    } else {
      tree.overwrite(filePathAPPEn, newContent);
    }
  };
}

function readTransUnitFile(tree: Tree, filePath: string): string {
  let content = '';

  if (tree.exists(filePath)) {
    const buffer = tree.read(filePath);
    content = buffer ? buffer.toString() : '';
  }

  return content;
}

const headerContent = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>`;

const footerContent = `
    </body>
  </file>
</xliff>
`;
