import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { styleText } from 'node:util';
import * as semver from 'semver';
import { getDep, hasDep, updateDep } from '../../utility/dependencies';
import { iterateFilesAndModifyContent, moveFilesToDirectory, replaceRule } from '../../utility/files';
import { HtmlManipulator } from '../../utility/html/html-manipulator';
import { removeAttrInStartTagFn } from '../../utility/html/manipulator-functions';
import { logInfo, logInfoWithDescriptor, logSuccess } from '../../utility/logging';
import { ReplaceItem } from '../../utility/replace-item';
import type { Options } from '../../utility/types';
import { addImport, removeImport } from '../../utility/typescript';
import { finish, messageInfoRule, messageSuccessRule } from '../../utility/util';
import { validateAngularVersion, validateLuxComponentsVersion, validateNodeVersionRange } from '../../utility/validation';
import { checkBreakingChanges } from './checks';

export const updateMajorVersion = '22';
export const updateLuxVersionRange = '^21.11.0 || ^22.0.0';
export const updateNodeVersionRange = '^22.22.3 || ^24.15.0 || >=26.0.0';
export const translocoMinVersion = '8.3.0';
export const addOrUpdate = false;
export const updateIfExists = true;

const LUX_PACKAGE = '@ihk-gfi/lux-components';

export function update220000(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([check(options), updateProject(options), finish(false, `${styleText('greenBright', 'Fertig!')}`)]);
  };
}

export function updateProject(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`LUX-Components ${updateMajorVersion} werden aktualisiert...`),
      updatePackageJson(options),
      renameMaxSize(options),
      renameFlexColReverse(options),
      updateTranslations(options),
      migrateConfigProvider(options),
      removeCardIconName(options),
      addPrompt(options),
      checkBreakingChanges(options),
      messageSuccessRule(`LUX-Components ${updateMajorVersion} wurden aktualisiert.`)
    ]);
  };
}

function check(_options: Options): Rule {
  return (tree: Tree, context: SchematicContext) => {
    logInfoWithDescriptor(`Vorbedingungen werden geprüft...`);
    validateNodeVersionRange(context, updateNodeVersionRange);
    validateAngularVersion(tree, '^22.0.0');
    validateLuxComponentsVersion(tree, updateLuxVersionRange);
    logSuccess(`Vorbedingungen wurden geprüft.`);

    return tree;
  };
}

export function updatePackageJson(_options: Options): Rule {
  return chain([
    messageInfoRule(`Abhängigkeiten in der Datei "package.json" werden aktualisiert...`),
    updateDep(LUX_PACKAGE, '22.0.0', addOrUpdate),
    updateDep('@ihk-gfi/lux-components-theme', '22.0.0', addOrUpdate),
    updateTransloco(),
    // Erst hier und nicht vor "ng update": ng update prüft die installierten Pakete per "npm list" und bricht ab,
    // wenn die Version in der package.json nicht zur installierten Version passt ("invalid: ngx-cookie-service@21...").
    updateDep('ngx-cookie-service', '^22.0.0', updateIfExists),
    // lux-markdown setzt marked ^18 voraus (optionale Abhängigkeit, daher nur anheben, wenn vorhanden).
    updateDep('marked', '^18.0.0', updateIfExists),
    messageSuccessRule(`Abhängigkeiten in der Datei "package.json" wurden aktualisiert.`)
  ]);
}

/**
 * Hebt @jsverse/transloco auf ^8.3.0 an, aber nur, wenn die eingetragene Version älter ist (kein Downgrade).
 */
function updateTransloco(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const name = '@jsverse/transloco';
    if (!hasDep(tree, name)) {
      return updateDep(name, `^${translocoMinVersion}`, addOrUpdate);
    }

    const version = getDep(tree, name).version;
    let minVersion: semver.SemVer | null = null;
    try {
      minVersion = semver.minVersion(version);
    } catch {
      minVersion = null;
    }

    if (!minVersion) {
      logInfo(`${name} ${version} kann nicht geprüft werden und bleibt unverändert (mindestens ^${translocoMinVersion} nötig).`);
      return tree;
    }

    if (semver.gte(minVersion, translocoMinVersion)) {
      logInfo(`${name} ${version} -> ok`);
      return tree;
    }

    return updateDep(name, `^${translocoMinVersion}`, addOrUpdate);
  };
}

export function renameMaxSize(options: Options): Rule {
  return chain(
    ['.html', '.ts'].map((ending) =>
      replaceRule(
        options,
        `luxMaxSizeMB wird in "${ending}"-Dateien in luxMaxSizeMiB umbenannt...`,
        `luxMaxSizeMB wurde in "${ending}"-Dateien umbenannt.`,
        ending,
        new ReplaceItem(/\bluxMaxSizeMB\b/g, 'luxMaxSizeMiB')
      )
    )
  );
}

export function renameFlexColReverse(options: Options): Rule {
  return chain(
    ['.html', '.ts', '.scss', '.css'].map((ending) =>
      replaceRule(
        options,
        `lux-flex-col-revers wird in "${ending}"-Dateien in lux-flex-col-reverse umbenannt...`,
        `lux-flex-col-revers wurde in "${ending}"-Dateien umbenannt.`,
        ending,
        new ReplaceItem(/lux-flex-col-revers\b/g, 'lux-flex-col-reverse')
      )
    )
  );
}

export function updateTranslations(options: Options): Rule {
  return replaceRule(
    options,
    `Platzhalter der Dateigröße in eigenen Übersetzungen werden umbenannt...`,
    `Platzhalter der Dateigröße wurden umbenannt.`,
    '.json',
    new ReplaceItem(/\{\{\s*maxSizeMB\s*\}\}/g, '{{maxSizeMiB}}'),
    new ReplaceItem(/\{\{\s*fileSizeInMB\s*\}\}/g, '{{fileSizeInMiB}}')
  );
}

/**
 * Ersetzt importProvidersFrom([LuxComponentsConfigModule.forRoot(config)]) durch provideLuxComponentsConfig(config).
 * Andere Schreibweisen (NgModule-Imports, gemischtes importProvidersFrom, TestBed) bleiben unverändert und werden gemeldet.
 */
export function migrateConfigProvider(options: Options): Rule {
  return chain([
    messageInfoRule(`LuxComponentsConfigModule wird durch provideLuxComponentsConfig ersetzt...`),
    (tree: Tree, _context: SchematicContext) => {
      const pattern = /importProvidersFrom\(\s*\[?\s*LuxComponentsConfigModule\.forRoot\(([^()]*)\)\s*,?\s*\]?\s*\)/g;

      iterateFilesAndModifyContent(
        tree,
        options.path,
        !!options.verbose,
        (filePath: string, content: string) => {
          if (filePath.endsWith('.spec.ts') || !content.includes('LuxComponentsConfigModule')) {
            return;
          }

          const result = content.replace(pattern, (_match, config: string) => `provideLuxComponentsConfig(${config.trim()})`);
          if (result === content) {
            return;
          }

          tree.overwrite(filePath, result);
          if (!/\bLuxComponentsConfigModule\b/.test(result.replace(/^import[\s\S]*?;$/gm, ''))) {
            removeImport(tree, filePath, LUX_PACKAGE, 'LuxComponentsConfigModule', false);
          }
          addImport(tree, filePath, LUX_PACKAGE, 'provideLuxComponentsConfig', false);
          if (
            !tree
              .readText(filePath)
              .replace(/^import[\s\S]*?;$/gm, '')
              .includes('importProvidersFrom(')
          ) {
            removeImport(tree, filePath, '@angular/core', 'importProvidersFrom', false);
          }
          logInfo(`${filePath} wurde angepasst.`);
        },
        '.ts'
      );
    },
    messageSuccessRule(`LuxComponentsConfigModule wurde ersetzt.`)
  ]);
}

/**
 * Entfernt das wirkungslose luxIconName an lux-card (nur im Start-Tag, Icons in der Karte bleiben unverändert).
 */
export function removeCardIconName(options: Options): Rule {
  return chain([
    messageInfoRule(`luxIconName wird an lux-card entfernt...`),
    (tree: Tree, _context: SchematicContext) => {
      iterateFilesAndModifyContent(
        tree,
        options.path,
        !!options.verbose,
        (filePath: string, content: string) => {
          if (!content.includes('<lux-card') || !content.includes('luxIconName')) {
            return;
          }

          const result = HtmlManipulator.transform(content, 'lux-card', removeAttrInStartTagFn('luxIconName'));
          if (result !== content) {
            tree.overwrite(filePath, result);
            logInfo(`${filePath} wurde angepasst.`);
          }
        },
        '.html'
      );
    },
    messageSuccessRule(`luxIconName wurde an lux-card entfernt.`)
  ]);
}

/**
 * Legt den KI-Prompt für die übrigen Stellen im Projekt an.
 */
export function addPrompt(options: Options): Rule {
  return chain([
    messageInfoRule(`KI-Prompt für das Update wird angelegt...`),
    moveFilesToDirectory(options, 'files/prompts', '/.github/prompts'),
    messageSuccessRule(`KI-Prompt wurde angelegt.`)
  ]);
}
