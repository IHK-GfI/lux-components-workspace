import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { finish, messageInfoRule, messageSuccessRule, updateI18nFile } from '../../utility/util';

export function update180300(_options: any, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 18.3.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '18.3.0', false),
      updateDep('@ihk-gfi/lux-components-theme', '18.3.0', false),
      updateI18NFiles(),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 18.3.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

export function updateI18NFiles(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    messageInfoRule(`I18n-Dateien werden angepasst...`), updateI18nFile(tree, 'de', 'luxc.datepicker.error_message.min', i18nDe);
    updateI18nFile(tree, 'en', 'luxc.datepicker.error_message.min', i18nEn);
    messageInfoRule(`I18n-Dateien wurden angepasst.`);
  };
}

export const i18nDe = `<trans-unit id="luxc.datepicker.prev.month.arialabel" datatype="html">
        <source>vorheriger Monat</source>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-form/lux-datepicker-ac/lux-datepicker-ac-custom-header/lux-datepicker-ac-custom-header.component.html</context>
          <context context-type="linenumber">7</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.datepicker.next.month.arialabel" datatype="html">
        <source>nächster Monat</source>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-form/lux-datepicker-ac/lux-datepicker-ac-custom-header/lux-datepicker-ac-custom-header.component.html</context>
          <context context-type="linenumber">16</context>
        </context-group>
      </trans-unit>`;

export const i18nEn = `<trans-unit id="luxc.datepicker.prev.month.arialabel" datatype="html">
        <source>vorheriger Monat</source>
        <target>previous month</target>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-form/lux-datepicker-ac/lux-datepicker-ac-custom-header/lux-datepicker-ac-custom-header.component.html</context>
          <context context-type="linenumber">6</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.datepicker.next.month.arialabel" datatype="html">
        <source>nächster Monat</source>
        <target>next month</target>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-form/lux-datepicker-ac/lux-datepicker-ac-custom-header/lux-datepicker-ac-custom-header.component.html</context>
          <context context-type="linenumber">14</context>
        </context-group>
      </trans-unit>`;
