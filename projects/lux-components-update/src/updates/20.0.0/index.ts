import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { Node } from 'jsonc-parser';
import { deleteDep } from '../../update-dependencies';
import { updateDep } from '../../utility/dependencies';
import { deleteFile, iterateFilesAndModifyContent, moveFilesToDirectory, replaceRule } from '../../utility/files';
import { deleteJsonArray, deleteJsonValue, findStringInArray, updateJsonArray } from '../../utility/json';
import { logError, logInfo, logInfoWithDescriptor, logSuccess } from '../../utility/logging';
import { ReplaceItem } from '../../utility/replace-item';
import { addComponentProvider, addImport } from '../../utility/typescript';
import { applyRuleIf, finish, messageInfoRule, messageSuccessRule, replaceAll } from '../../utility/util';
import { validateLuxComponentsVersion, validateNodeVersion } from '../../utility/validation';

export interface Options {
  project: string;
  path: string;
  verbose: boolean;
}

export const updateMajorVersion = '20';
export const updateMinVersion = '19.4.0';
export const updateNodeMinVersion = '22.0.0';
export const addOrUpdate = false;

export function update200000(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([check(options), applyRuleIf(updateMinVersion, updateProject(options)), finish(false, `${chalk.greenBright('Fertig!')}`)]);
  };
}

export function updateProject(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`LUX-Components ${updateMajorVersion} werden aktualisiert...`),
      updatePackageJson(options),
      migrateToTransloco(options),
      messageSuccessRule(`LUX-Components ${updateMajorVersion} wurden aktualisiert.`)
    ]);
  };
}

function check(_options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    logInfoWithDescriptor(`Vorbedingungen werden geprüft...`);
    validateNodeVersion(_context, updateNodeMinVersion);
    validateLuxComponentsVersion(tree, `${updateMinVersion} || ^${updateMajorVersion}.0.0`);
    logSuccess(`Vorbedingungen wurden geprüft.`);

    return tree;
  };
}

export function updatePackageJson(options: Options): Rule {
  return chain([
    messageInfoRule(`Abhängigkeiten in der Datei "package.json" werden aktualisiert...`),
    updateDep('@ihk-gfi/lux-components', '20.0.0', addOrUpdate),
    updateDep('@ihk-gfi/lux-components-theme', '20.0.0', addOrUpdate),
    updateDep('@ihk-gfi/lux-components-icons-and-fonts', '1.10.0', addOrUpdate),
    messageSuccessRule(`Abhängigkeiten in der Datei "package.json" wurden aktualisiert.`)
  ]);
}

export function migrateToTransloco(options: Options): Rule {
  return chain([
    messageInfoRule(`I18n wird auf Transloco umgestellt...`),
    updateDep('@jsverse/transloco', '^8.0.2', addOrUpdate),
    deleteDep('@angular/localize'),
    updatePackageJsonTransloco(options),
    updateAngularJsonTransloco(options),
    updateMainTsAndTestTs(options),
    updateCompilerOptions(options),
    messageSuccessRule(`I18n wurde auf Transloco umgestellt.`)
  ]);
}

export function updatePackageJsonTransloco(options: Options): Rule {
  const packageJson = (options.path ?? '') + '/package.json';
  return chain([
    messageInfoRule(`"package.json" wird aktualisiert...`),
    deleteJsonValue(packageJson, ['scripts', 'xi18n']),
    deleteJsonValue(packageJson, ['scripts', 'start-en']),
    replaceRule(
      options,
      `--localize wird entfernt...`,
      `--localize wurde entfernt.`,
      packageJson,
      new ReplaceItem(' --localize', '', true)
    ),
    deleteFile(options.path ?? '', 'move-de-files.js'),
    moveFilesToDirectory(options, 'files/scripts', '/scripts'),
    moveFilesToDirectory(options, 'files/transloco/base', '/src/app'),
    moveFilesToDirectory(options, 'files/transloco/i18n', '/src/locale'),
    moveFilesToDirectory(options, 'files/transloco/testing', '/src/testing'),
    addTranslocoProvider(options),
    replaceRule(
      options,
      `move-de-files wird umbenannt in move-files...`,
      `move-de-files wurde umbenannt in move-files.`,
      packageJson,
      new ReplaceItem('move-de-files', 'move-files', true),
      new ReplaceItem('node move-files.js', 'node scripts/move-files.js', true)
    ),
    messageSuccessRule(`"package.json" wurde aktualisiert.`)
  ]);
}

function addTranslocoProvider(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const appConfigTs = (options.path ?? '') + '/src/app/app.config.ts';
    const appComponentTs = (options.path ?? '') + '/src/app/app.component.ts';

    const tsFile = tree.exists(appConfigTs) ? appConfigTs : appComponentTs;

    if (!tree.exists(tsFile)) {
      logError(`Weder "app.config.ts" noch "app.component.ts" wurde im Pfad "${options.path}/src/app/" gefunden.`);
      logError(`Der Transloco-Provider konnte nicht hinzugefügt werden.`);
      return tree;
    }

    addImport(tree, tsFile, '@angular/core', 'inject');
    addImport(tree, tsFile, '@angular/core', 'provideAppInitializer');
    addImport(tree, tsFile, './transloco-root.config', 'provideLuxTranslocoRoot');
    addImport(tree, tsFile, 'ngx-cookie-service', 'CookieService');
    addImport(tree, tsFile, '@jsverse/transloco', 'LangDefinition');
    addImport(tree, tsFile, '@jsverse/transloco', 'TranslocoService');
    addImport(tree, tsFile, 'rxjs', 'firstValueFrom');

    addComponentProvider(tree, tsFile, `provideLuxTranslocoRoot()`);
    addComponentProvider(tree, tsFile, `CookieService`);
    addComponentProvider(
      tree,
      tsFile,
      `provideAppInitializer(() => {
      // Dependencies per inject() to avoid deprecated APP_INITIALIZER pattern.
      const t = inject(TranslocoService);
      const cookieService = inject(CookieService);

      // Sprache aus CookieService auslesen (gleiches Cookie wie LuxLangSelectAcComponent)
      const cookieLang = cookieService.get('X-GFI-LANGUAGE');
      const available = t.getAvailableLangs().map((l) => (l as LangDefinition).id);
      const chosen = cookieLang && available.includes(cookieLang) ? cookieLang : 'de';

      // Sprache setzen bevor Komponenten erstellt werden.
      t.setActiveLang(chosen);
      // Sicherstellen, dass Ressourcen geladen sind bevor Bootstrap finalisiert.
      return firstValueFrom(t.load(chosen));
    })`
    );

    return tree;
  };
}

export function updateAngularJsonTransloco(options: Options): Rule {
  const angularJson = (options.path ?? '') + '/angular.json';

  const i18nComponents = {
    glob: '*.json',
    input: 'node_modules/@ihk-gfi/lux-components/locale',
    output: './assets/i18n'
  };

  const i18nApp = {
    glob: '*.json',
    input: 'src/locale',
    output: './assets/i18n'
  };

  const angularInitFn = (node: Node) => findStringInArray(node, '@angular/localize/init');

  return chain([
    messageInfoRule(`"angular.json" wird aktualisiert...`),
    deleteJsonValue(angularJson, ['projects', options.project, 'i18n']),
    updateJsonArray(angularJson, ['projects', options.project, 'architect', 'build', 'options', 'assets'], i18nComponents),
    updateJsonArray(angularJson, ['projects', options.project, 'architect', 'build', 'options', 'assets'], i18nApp),
    updateJsonArray(angularJson, ['projects', options.project, 'architect', 'test', 'options', 'assets'], i18nComponents),
    updateJsonArray(angularJson, ['projects', options.project, 'architect', 'test', 'options', 'assets'], i18nApp),
    deleteJsonArray(angularJson, ['projects', options.project, 'architect', 'build', 'options', 'polyfills'], angularInitFn),
    deleteJsonArray(angularJson, ['projects', options.project, 'architect', 'test', 'options', 'polyfills'], angularInitFn),
    deleteJsonValue(angularJson, ['projects', options.project, 'architect', 'build', 'options', 'localize']),
    deleteJsonValue(angularJson, ['projects', options.project, 'architect', 'build', 'options', 'i18nMissingTranslation']),
    deleteJsonValue(angularJson, ['projects', options.project, 'architect', 'build', 'configurations', 'en']),
    deleteJsonValue(angularJson, ['projects', options.project, 'architect', 'extract-i18n']),
    messageSuccessRule(`"angular.json" wurde aktualisiert.`)
  ]);
}

function updateMainTsAndTestTs(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    iterateFilesAndModifyContent(
      tree,
      options.path,
      (filePath: string, content: string) => {
        let result = content;

        result = replaceAll(result, `/// <reference types="@angular/localize" />`, ``);

        if (content !== result) {
          logInfo(filePath + ' wurde angepasst.');
          tree.overwrite(filePath, result);
        }
      },
      'main.ts',
      'test.ts'
    );
  };
}

function updateCompilerOptions(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const paths = ['/tsconfig.json', '/tsconfig.spec.json', '/tsconfig.app.json'];
    const prePath = options.path ?? '';

    const rules: Rule[] = [];

    for (const filePath of paths) {
      const path1 = prePath + filePath;
      if (tree.exists(path1)) {
        rules.push(deleteJsonArray(path1, ['compilerOptions', 'types'], (node: Node) => findStringInArray(node, '@angular/localize')));
      }
      const path2 = prePath + `/src` + filePath;
      if (tree.exists(path2)) {
        rules.push(deleteJsonArray(path2, ['compilerOptions', 'types'], (node: Node) => findStringInArray(node, '@angular/localize')));
      }
    }

    return chain(rules);
  };
}
