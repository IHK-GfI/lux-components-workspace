import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { finish, messageInfoRule, messageSuccessRule, updateI18nFile } from '../../utility/util';

export function update180400(_options: any, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 18.4.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '18.4.0', false),
      updateDep('@ihk-gfi/lux-components-theme', '18.4.0', false),
      updateI18NFiles(),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 18.4.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

export function updateI18NFiles(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    messageInfoRule(`I18n-Dateien werden angepasst...`), updateI18nFile(tree, 'de', 'luxc.datetimepicker.invalid.date', i18nDeDatepicker);
    updateI18nFile(tree, 'en', 'luxc.datetimepicker.invalid.date', i18nEnDatepicker);
    messageInfoRule(`I18n-Dateien wurden angepasst.`);
  };
}

export const i18nDeDatepicker = `<trans-unit id="luxc.datetimepicker.panel.hours.arialabel" datatype="html">
        <source>Stunden</source>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-form/lux-datetimepicker-ac/lux-datetime-overlay-ac/lux-datetime-overlay-content-ac.component.html</context>
          <context context-type="linenumber">21</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.datetimepicker.panel.minutes.arialabel" datatype="html">
        <source>Minuten</source>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-form/lux-datetimepicker-ac/lux-datetime-overlay-ac/lux-datetime-overlay-content-ac.component.html</context>
          <context context-type="linenumber">39</context>
        </context-group>
      </trans-unit>`;

export const i18nEnDatepicker = `<trans-unit id="luxc.datetimepicker.panel.hours.arialabel" datatype="html">
        <source>Stunden</source>
        <target>Hours</target>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-form/lux-datetimepicker-ac/lux-datetime-overlay-ac/lux-datetime-overlay-content-ac.component.html</context>
          <context context-type="linenumber">21</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.datetimepicker.panel.minutes.arialabel" datatype="html">
        <source>Minuten</source>
        <target>Minutes</target>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-form/lux-datetimepicker-ac/lux-datetime-overlay-ac/lux-datetime-overlay-content-ac.component.html</context>
          <context context-type="linenumber">39</context>
        </context-group>
      </trans-unit>`;
