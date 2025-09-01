import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { replaceRule } from '../../utility/files';
import { logWarn } from '../../utility/logging';
import { ReplaceItem } from '../../utility/replace-item';
import { addComponentImport, addImport } from '../../utility/typescript';
import { applyRuleIfFileExists, applyRuleIfFileNotExists, finish, messageInfoRule, messageSuccessRule } from '../../utility/util';

export function update190200(options: any, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 19.2.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '19.2.0', false),
      updateDep('@ihk-gfi/lux-components-theme', '19.0.1', false),
      addCdkScrollable(options),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 19.2.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

export function addCdkScrollable(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    let returnRule = chain([]);

    const appHtmlPath = (options.path ?? '') + '/src/app/app.component.html';
    const appTsPath = (options.path ?? '') + '/src/app/app.component.ts';
    const appModuleTsPath = (options.path ?? '') + '/src/app/app.module.ts';

    if (tree.exists(appHtmlPath)) {
      const buffer = tree.read(appHtmlPath)?.toString();
      if (buffer) {
        if (buffer.includes('<lux-app-content') && !buffer.includes('cdkScrollable')) {
          returnRule = chain([
            messageInfoRule(`Die Directive cdkScrollable wird ergänzt...`),
            replaceRule(
              options,
              `app.component.html wird angepasst...`,
              `app.component.html wurde angepasst.`,
              appHtmlPath,
              new ReplaceItem('<lux-app-content', '<lux-app-content cdkScrollable', true)
            ),
            applyRuleIfFileExists((tree: Tree, _context: SchematicContext) => {
              addImport(tree, appModuleTsPath, '@angular/cdk/scrolling', 'CdkScrollable', false);
              addComponentImport(tree, appModuleTsPath, 'CdkScrollable', false);
            }, appModuleTsPath),
            applyRuleIfFileNotExists((tree: Tree, _context: SchematicContext) => {
              addImport(tree, appTsPath, '@angular/cdk/scrolling', 'CdkScrollable', false);
              addComponentImport(tree, appTsPath, 'CdkScrollable', false);
            }, appModuleTsPath),
            messageSuccessRule(`Die Directive cdkScrollable wurde ergänzt.`)
          ]);
        } else {
          if (!buffer.includes('<lux-app-content')) {
            logWarn(`Die Datei ${appHtmlPath} enthält nicht den Tag lux-app-content.`);
          }
          if (!buffer.includes('cdkScrollable')) {
            logWarn(`Die Directive cdkScrollable muss manuell dem Content-Container hinzugefügt werden!!!`);
          }
        }
      }
    }

    return returnRule;
  };
}
