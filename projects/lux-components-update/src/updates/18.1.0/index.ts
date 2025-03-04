import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { finish, messageInfoRule, messageSuccessRule } from '../../utility/util';

export function update180100(_options: any, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 18.1.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '18.1.0', false),
      updateDep('@ihk-gfi/lux-components-theme', '18.1.0', false),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 18.1.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}
