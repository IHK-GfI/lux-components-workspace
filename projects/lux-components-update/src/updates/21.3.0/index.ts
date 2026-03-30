import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { iterateFilesAndModifyContent } from '../../utility/files';
import { logInfo } from '../../utility/logging';
import { Options } from '../../utility/types';
import { finish, messageInfoRule, messageSuccessRule, replaceAll } from '../../utility/util';

export function update210300(options: Options, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 21.3.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '21.3.0', false),
      updateDep('@ihk-gfi/lux-components-theme', '21.3.0', false),
      updateDep('@ihk-gfi/lux-components-icons-and-fonts', '1.11.0', false),
      updateIcons(options),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 21.3.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

export function updateIcons(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    iterateFilesAndModifyContent(
      tree,
      options.path,
      !!options.verbose,
      (filePath: string, content: string) => {
        let result = content;

        result = replaceAll(result, `icons-and-fonts/v1.2.0`, `icons-and-fonts/v1.11.0`);
        result = replaceAll(result, `icons-and-fonts/v1.3.0`, `icons-and-fonts/v1.11.0`);
        result = replaceAll(result, `icons-and-fonts/v1.4.0`, `icons-and-fonts/v1.11.0`);
        result = replaceAll(result, `icons-and-fonts/v1.5.0`, `icons-and-fonts/v1.11.0`);
        result = replaceAll(result, `icons-and-fonts/v1.6.0`, `icons-and-fonts/v1.11.0`);
        result = replaceAll(result, `icons-and-fonts/v1.7.0`, `icons-and-fonts/v1.11.0`);
        result = replaceAll(result, `icons-and-fonts/v1.8.0`, `icons-and-fonts/v1.11.0`);
        result = replaceAll(result, `icons-and-fonts/v1.9.0`, `icons-and-fonts/v1.11.0`);
        result = replaceAll(result, `icons-and-fonts/v1.10.0`, `icons-and-fonts/v1.11.0`);

        if (content !== result) {
          logInfo(filePath + ' wurde angepasst.');
          tree.overwrite(filePath, result);
        }
      },
      'styles.scss',
      'app.config.ts',
      'app.module.ts'
    );
  };
}
