import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { iterateFilesAndModifyContent } from '../../utility/files';
import { logInfo } from '../../utility/logging';
import { Options } from '../../utility/types';
import { addImport, removeImport } from '../../utility/typescript';
import { finish, messageInfoRule, messageSuccessRule } from '../../utility/util';

export function update210800(options: Options, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 21.8.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '21.8.0', false),
      updateDep('@ihk-gfi/lux-components-theme', '21.8.0', false),
      messageInfoRule(`Die Imports von "LuxTestHelper" und "LuxOverlayHelper" werden auf den neuen Entry Point "test-utils" umgestellt...`),
      updateTestUtilsImports(options),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 21.8.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

/**
 * LuxTestHelper und LuxOverlayHelper wurden aus dem Haupt-Entry-Point "@ihk-gfi/lux-components" in den
 * neuen Secondary-Entry-Point "@ihk-gfi/lux-components/test-utils" verschoben, damit test-only Abhängigkeiten
 * (z.B. jasmine-axe) nicht mehr im produktiven Bundle landen. Diese Regel schreibt betroffene Imports in allen
 * .ts-Dateien des Projekts entsprechend um.
 */
const TEST_UTILS_SYMBOLS = ['LuxTestHelper', 'LuxOverlayHelper'];

export function updateTestUtilsImports(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    iterateFilesAndModifyContent(
      tree,
      options.path,
      !!options.verbose,
      (filePath: string, content: string) => {
        const movedSymbols = TEST_UTILS_SYMBOLS.filter((symbol) => content.includes(symbol)).filter((symbol) =>
          removeImport(tree, filePath, '@ihk-gfi/lux-components', symbol, false)
        );

        movedSymbols.forEach((symbol) => addImport(tree, filePath, '@ihk-gfi/lux-components/test-utils', symbol, false));

        if (movedSymbols.length > 0) {
          logInfo(`${filePath}: Import(s) [${movedSymbols.join(', ')}] auf "@ihk-gfi/lux-components/test-utils" umgestellt.`);
        }
      },
      '.spec.ts'
    );

    return tree;
  };
}
