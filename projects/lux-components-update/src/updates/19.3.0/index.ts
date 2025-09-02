import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { AddTransUnitItem } from '../../utility/replace-item';
import { finish, messageInfoRule, messageSuccessRule, updateMessages } from '../../utility/util';
import { Options } from '../19.0.0';

export function update190300(options: any, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 19.3.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '19.3.0', false),
      updateDep('@ihk-gfi/lux-components-theme', '19.0.2', false),
      addMessageMaxFileCount(options),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 19.3.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

function addMessageMaxFileCount(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const insertAfterId = `luxc.form-file-base.error_message.max_file_size`;

    return updateMessages(
      options,
      [
        new AddTransUnitItem(
          insertAfterId,
          `<trans-unit id="luxc.form-file-base.error_message.max_file_count" datatype="html">
        <source>Es dürfen maximal <x id="PH" equiv-text="this.luxMaxFileCount"/> Dateien ausgewählt werden</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-form/lux-form-model/lux-form-file-base.class.ts</context>
          <context context-type="linenumber">485</context>
        </context-group>
      </trans-unit>`
        )
      ],
      [
        new AddTransUnitItem(
          insertAfterId,
          `<trans-unit id="luxc.form-file-base.error_message.max_file_count" datatype="html">
        <source>Es dürfen maximal <x id="PH" equiv-text="this.luxMaxFileCount"/> Dateien ausgewählt werden</source>
        <target>A maximum of <x id="PH" equiv-text="this.luxMaxFileCount"/> files may be selected</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-form/lux-form-model/lux-form-file-base.class.ts</context>
          <context context-type="linenumber">485</context>
        </context-group>
      </trans-unit>`
        )
      ]
    );
  };
}
