import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { finish, messageInfoRule, messageSuccessRule, updateI18nFile } from '../../utility/util';

export function update180200(_options: any, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 18.2.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '18.2.0', false),
      updateDep('@ihk-gfi/lux-components-theme', '18.2.0', false),
      updateI18NFiles(),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 18.2.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

export function updateI18NFiles(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    messageInfoRule(`I18n-Dateien werden angepasst...`), updateI18nFile(tree, 'de', 'luxc.table.multiselect.chk.arialabel', i18nDe);
    updateI18nFile(tree, 'en', 'luxc.table.multiselect.chk.arialabel', i18nEn);
    messageInfoRule(`I18n-Dateien wurden angepasst.`);
  };
}

export const i18nDe = `<trans-unit id="luxc.progress.arialabel" datatype="html">
        <source>Ladeanzeige</source>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-common/lux-progress/lux-progress.component.ts</context>
          <context context-type="linenumber">24</context>
        </context-group>
      </trans-unit>`;

export const i18nEn = `<trans-unit id="luxc.progress.arialabel" datatype="html">
        <source>Ladeanzeige</source>
        <target>Loading indicator</target>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-common/lux-progress/lux-progress.component.ts</context>
          <context context-type="linenumber">24</context>
        </context-group>
      </trans-unit>`;
