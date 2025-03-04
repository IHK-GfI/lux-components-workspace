import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { applyEdits, Edit, modify, Node } from 'jsonc-parser';
import { updateDependencies } from '../update-dependencies/index';
import { updateMajorVersion, updateNodeMinVersion } from '../updates/18.0.0/index';
import { deleteFile, iterateFilesAndModifyContent, moveFilesToDirectory } from '../utility/files';
import {
  findObjectPropertyInArray,
  jsonFormattingOptions,
  readJson,
  readJsonAsString,
  updateJsonArray,
  updateJsonValue
} from '../utility/json';
import { logInfo } from '../utility/logging';
import { finish, messageInfoRule, messageSuccessRule, replaceAll, waitForTreeCallback } from '../utility/util';
import { validateAngularVersion, validateNodeVersion } from '../utility/validation';

export function addLuxComponents(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const jsonPathAllowedCommonJS = ['projects', options.project, 'architect', 'build', 'options', 'allowedCommonJsDependencies'];
    const jsonPathBudget = ['projects', options.project, 'architect', 'build', 'configurations', 'production', 'budgets'];
    const budgetValue = {
      type: 'initial',
      maximumWarning: '1mb',
      maximumError: '2mb'
    };

    const jsonPathPolyfillsBuild = ['projects', options.project, 'architect', 'build', 'options', 'polyfills'];
    const jsonPathPolyfillsTest = ['projects', options.project, 'architect', 'test', 'options', 'polyfills'];
    const polyfillsValue = '@angular/localize/init';

    const jsonPathAssetsBuild = ['projects', options.project, 'architect', 'build', 'options', 'assets'];
    const jsonPathAssetsTest = ['projects', options.project, 'architect', 'test', 'options', 'assets'];
    const assetsValues = [
      'src/assets',
      {
        glob: '*(*min.css|*min.css.map)',
        input: './node_modules/@ihk-gfi/lux-components-theme/prebuilt-themes',
        output: './assets/themes'
      },
      {
        glob: '**/*',
        input: './node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/icons/',
        output: './assets/icons'
      }
    ];

    const jsonPathOptimization = ['projects', options.project, 'architect', 'build', 'configurations', 'production', 'optimization'];
    const jsonValueOptimization = {
      scripts: true,
      styles: {
        minify: true,
        inlineCritical: false
      },
      fonts: true
    };

    const jsonPathLang = ['projects', options.project, 'i18n'];
    const jsonValueLang = {
      sourceLocale: {
        code: 'de',
        baseHref: '/'
      },
      locales: {
        en: 'src/locale/messages.en.xlf'
      }
    };

    const findBudgetFn = (node: Node) => findObjectPropertyInArray(node, 'type', 'initial');

    return chain([
      check(),
      copyAppFiles(options),
      updatePackageJson(options),
      updateDependencies(),
      updateIndexHtml(options),
      updateApp(options),
      updateJsonValue('/tsconfig.json', ['compilerOptions', 'strict'], true),
      updateJsonValue('/angular.json', jsonPathLang, jsonValueLang),
      updateJsonValue('/angular.json', jsonPathOptimization, jsonValueOptimization),
      updateJsonArray('/angular.json', jsonPathBudget, budgetValue, true, findBudgetFn),
      updateJsonArray('/angular.json', jsonPathAssetsBuild, assetsValues[0]),
      updateJsonArray('/angular.json', jsonPathAssetsTest, assetsValues[0]),
      updateJsonArray('/angular.json', jsonPathAssetsBuild, assetsValues[1]),
      updateJsonArray('/angular.json', jsonPathAssetsTest, assetsValues[1]),
      updateJsonArray('/angular.json', jsonPathAssetsBuild, assetsValues[2]),
      updateJsonArray('/angular.json', jsonPathAssetsTest, assetsValues[2]),
      updateJsonArray('/angular.json', jsonPathPolyfillsBuild, polyfillsValue),
      updateJsonArray('/angular.json', jsonPathPolyfillsTest, polyfillsValue),
      updateJsonArray('/angular.json', jsonPathAllowedCommonJS, 'hammerjs'),
      updateJsonArray('/angular.json', jsonPathAllowedCommonJS, 'ng2-pdf-viewer'),
      updateJsonArray('/angular.json', jsonPathAllowedCommonJS, 'pdfjs-dist'),
      updateJsonArray('/angular.json', jsonPathAllowedCommonJS, 'dompurify'),
      deleteFile(options, (options.path ?? '') + '/package-lock.json'),
      finish(true, `Die LUX-Components ${updateMajorVersion} wurden erfolgreich eingerichtet.`, `${chalk.yellowBright('Fertig!')}`)
    ]);
  };
}

/**
 * Prüft ob die Versionen des Projekts mit den erforderlichen Versionen dieses Updates übereinstimmen.
 */
export function check(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return waitForTreeCallback(tree, () => {
      validateAngularVersion(tree, `^${+updateMajorVersion}.0.0`);
      validateNodeVersion(context, updateNodeMinVersion);

      return tree;
    });
  };
}

export function updatePackageJson(_options: any): Rule {
  return chain([
    messageInfoRule(`package.json wird aktualisiert...`),
    (tree: Tree, _context: SchematicContext) => {
      const filePath = `/package.json`;

      const newValuesArr = [
        {
          path: ['scripts', 'build-prod'],
          value: 'ng build --configuration production --localize && npm run move-de-files',
          message: `Skript "build-prod" hinzugefügt.`
        },
        {
          path: ['scripts', 'test-headless'],
          value: 'ng test --watch=false --browsers=ChromeHeadless --code-coverage=true',
          message: `Skript "test-headless" hinzugefügt.`
        },
        {
          path: ['scripts', 'smoketest'],
          value: 'npm run build-prod && npm run test-headless && npm run xi18n',
          message: `Skript "smoketest" hinzugefügt.`
        },
        {
          path: ['scripts', 'move-de-files'],
          value: 'node move-de-files.js',
          message: `Skript "move-de-files" hinzugefügt.`
        },
        {
          path: ['scripts', 'xi18n'],
          value: 'ng extract-i18n --output-path src/locale',
          message: `Skript "xi18n" hinzugefügt.`
        }
      ];

      newValuesArr.forEach((change) => {
        const tsConfigJson = readJsonAsString(tree, filePath);
        const edits: Edit[] = modify(tsConfigJson, change.path, change.value, {
          formattingOptions: jsonFormattingOptions
        });

        tree.overwrite(filePath, applyEdits(tsConfigJson, edits));

        logInfo(change.message);
      });

      return tree;
    },
    messageSuccessRule(`package.json wurde aktualisiert.`)
  ]);
}

export function updateIndexHtml(options: any): Rule {
  return chain([
    messageInfoRule(`index.html wird aktualisiert...`),
    (tree: Tree, _context: SchematicContext) => {
      iterateFilesAndModifyContent(
        tree,
        options.path,
        (filePath: string, content: string) => {
          let modifiedContent = replaceAll(content, '<body>', '<body style="margin: 0">');

          if (content !== modifiedContent) {
            tree.overwrite(filePath, modifiedContent);
          }
        },
        'index.html'
      );
    },
    messageSuccessRule(`index.html wurde aktualisiert.`)
  ]);
}

export function copyAppFiles(options: any): Rule {
  return chain([
    messageInfoRule(`App-Dateien werden angelegt...`),
    moveFilesToDirectory(options, 'files/app', 'src/app'),
    moveFilesToDirectory(options, 'files/assets', 'src/assets'),
    moveFilesToDirectory(options, 'files/environments', 'src/environments'),
    moveFilesToDirectory(options, 'files/locale', '/src/locale'),
    moveFilesToDirectory(options, 'files/root', '/'),
    moveFilesToDirectory(options, 'files/src', '/src'),
    messageSuccessRule(`App-Dateien wurden angelegt.`)
  ]);
}

export function updateApp(options: any): Rule {
  return chain([
    messageInfoRule(`App-Dateien wird angepasst...`),
    (tree: Tree, _context: SchematicContext) => {
      const filePath = `/package.json`;

      const newValuesArr = [
        {
          path: ['scripts', 'move-de-files'],
          value: 'node move-de-files.js',
          message: `Skript "move-de-files" hinzugefügt.`
        },
        {
          path: ['scripts', 'build'],
          value: 'ng build --aot --localize && npm run move-de-files',
          message: `Skript "build" angepasst.`
        },
        { path: ['scripts', 'build-aot'], value: undefined, message: `` },
        { path: ['scripts', 'buildzentral'], value: undefined, message: `` },
        { path: ['devDependencies', 'fs-extra'], value: '^10.0.0', message: `devDependencies "fs-extra" hinzugefügt.` },
        { path: ['devDependencies', 'del'], value: '^6.0.0', message: `devDependencies "del" hinzugefügt.` }
      ];

      newValuesArr.forEach((change) => {
        const tsConfigJson = readJsonAsString(tree, filePath);
        const edits: Edit[] = modify(tsConfigJson, change.path, change.value, {
          formattingOptions: jsonFormattingOptions
        });

        tree.overwrite(filePath, applyEdits(tsConfigJson, edits));

        logInfo(change.message);
      });

      readJson(tree, filePath);

      return tree;
    },
    (tree: Tree, _context: SchematicContext) => {
      const filePath = `/angular.json`;

      const newValuesArr = [
        {
          path: ['projects', options.project, 'architect', 'build', 'options', 'outputPath'],
          value: 'dist',
          message: `Property "outputPath" auf "dist" gesetzt.`
        }
      ];

      newValuesArr.forEach((change) => {
        const tsConfigJson = readJsonAsString(tree, filePath);
        const edits: Edit[] = modify(tsConfigJson, change.path, change.value, {
          formattingOptions: jsonFormattingOptions
        });

        tree.overwrite(filePath, applyEdits(tsConfigJson, edits));

        logInfo(change.message);
      });

      readJson(tree, filePath);

      return tree;
    },
    messageSuccessRule(`App wurde angepasst.`)
  ]);
}
