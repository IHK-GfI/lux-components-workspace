import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { replaceRule } from '../../utility/files';
import { AddTransUnitItem, ReplaceItem } from '../../utility/replace-item';
import { finish, messageInfoRule, messageSuccessRule } from '../../utility/util';
import { Options } from '../19.0.0';

export function update190400(options: Options, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Die LUX-Components werden auf die Version 19.4.0 aktualisiert...`),
      messageInfoRule(`Die Datei "package.json" wird angepasst...`),
      updateDep('@ihk-gfi/lux-components', '19.4.0', false),
      updateDep('@ihk-gfi/lux-components-theme', '19.2.0', false),
      updateMessages(options),
      fixEmptySchematicArray(options),
      messageSuccessRule(`Die LUX-Components wurden auf die Version 19.4.0 aktualisiert.`),
      finish(runNpmInstall, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

function updateMessages(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const deFilePath = (options.path ?? '') + '/src/locale/messages.xlf';
    const enFilePath = (options.path ?? '') + '/src/locale/messages.en.xlf';

    const beforeId = `luxc.filter.title`;
    const deFilterButton = `<trans-unit id="luxc.filter.trigger.btn" datatype="html">
        <source>Filtereinstellungen</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-filter/lux-filter-form/lux-filter-form.component.html</context>
          <context context-type="linenumber">1</context>
        </context-group>
      </trans-unit>`;
    const enFilterButton = `<trans-unit id="luxc.filter.trigger.btn" datatype="html">
        <source>Filtereinstellungen</source>
        <target>Filter Settings</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-filter/lux-filter-form/lux-filter-form.component.html</context>
          <context context-type="linenumber">1</context>
        </context-group>
      </trans-unit>`;

    return chain([
      replaceRule(
        options,
        `Messages (de) werden angepasst...`,
        `Messages (de) wurden angepasst.`,
        deFilePath,
        new AddTransUnitItem(beforeId, deFilterButton),
      ),

      replaceRule(
        options,
        `Messages (en) werden angepasst...`,
        `Messages (en) wurden angepasst.`,
        enFilePath,
        new AddTransUnitItem(beforeId, enFilterButton),
      )
    ]);
  };
}

export function fixEmptySchematicArray(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const angularJsonPath = (options.path ?? '') + '/angular.json';
    if (tree.exists(angularJsonPath)) {
      return chain([
        replaceRule(
          options,
          'angular.json wird aktualisiert...',
          'angular.json wurde aktualisiert.',
          angularJsonPath,
          new ReplaceItem(/"schematicCollections"\s*:\s*\[\s*\]\s*,?/g, '')
        )
      ]);
    } else {
      return tree;
    }
  };
}
