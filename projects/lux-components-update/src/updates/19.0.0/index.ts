import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { Node } from 'jsonc-parser';
import { updateDependencies } from '../../update-dependencies/index';
import { deleteFile, moveFilesToDirectory, replaceRule } from '../../utility/files';
import { deleteJsonArray, deleteJsonValue, findObjectContainsInArray, findStringInArray, updateJsonArray, updateJsonValue } from '../../utility/json';
import { logInfoWithDescriptor, logSuccess } from '../../utility/logging';
import { AddTransUnitItem, RemoveTransUnitItem, ReplaceItem } from '../../utility/replace-item';
import { applyRuleIf, finish, messageInfoRule, messageSuccessRule } from '../../utility/util';
import { validateLuxComponentsVersion, validateNodeVersion } from '../../utility/validation';

export interface Options {
  project: string,
  path: string,
  verbose: boolean
};

export const updateMajorVersion = '19';
export const updateMinVersion = '18.5.0';
export const updateNodeMinVersion = '22.0.0';

export function update190000(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      check(options),
      applyRuleIf(updateMinVersion, updateProject(options)),
      finish(
        false,
        ``,
        `${chalk.yellowBright('Nur für JAST-Apps')}`,
        `${chalk.yellowBright('----------------------------------------------------------------------')}`,
        `${chalk.yellowBright('1. Bitte die Node-Version 22 verwenden.')}`,
        `${chalk.yellowBright('2. Bitte die pipeline.yaml anpassen:')}`,
        `${chalk.yellowBright('   a. Den Parameter --no-optional entfernen.')}`,
        `${chalk.yellowBright('   b. Das Image von "node:18-alpine" auf "node:22-alpine" ändern.')}`,
        ``,
        `${chalk.greenBright('Fertig!')}`
      )
    ]);
  };
}

export function updateProject(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`LUX-Components ${updateMajorVersion} werden aktualisiert...`),
      updateDependencies(),
      copyFiles(options),
      updatePackageJson(options),
      updateAngularJson(options),
      updateTsConfigAppJson(options),
      updateTsConfigSpecJson(options),
      updateKarmaConfJs(options),
      updateMainTs(options),
      updateTestTs(options),
      deleteFile(options.path ?? '', '.eslintrc.json'),
      updateMessages(options),
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

export function copyFiles(options: any): Rule {
  return chain([
    messageInfoRule(`Dateien werden kopiert...`),
    moveFilesToDirectory(options, 'files/root', '/'),
    messageSuccessRule(`Dateien wurden kopiert.`)
  ]);
}

export function updatePackageJson(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const filePath = (options.path ?? '') + '/package.json';

    const startScriptJsonPath = ['scripts', 'start'];
    const startScriptJsonValue = 'ng serve --no-hmr';

    const buildAotScriptJsonPath = ['scripts', 'build-aot'];
    const buildAotScriptJsonValue =
      'node --max_old_space_size=4024 ./node_modules/@angular/cli/bin/ng build --aot --output-hashing none && npm run move-de-files';

    const buildZentralScriptJsonPath = ['scripts', 'buildzentral'];
    const buildZentralScriptJsonValue =
      'node --max_old_space_size=4024 ./node_modules/@angular/cli/bin/ng build --configuration production --output-hashing none && npm run move-de-files';

    const startEnScriptJsonPath = ['scripts', 'start-en'];
    const startEnScriptJsonValue = 'ng serve --configuration en --no-hmr';

    return chain([
      messageInfoRule(`package.json wird angepasst...`),
      updateJsonValue(filePath, startScriptJsonPath, startScriptJsonValue, true),
      updateJsonValue(filePath, buildAotScriptJsonPath, buildAotScriptJsonValue, true),
      updateJsonValue(filePath, buildZentralScriptJsonPath, buildZentralScriptJsonValue, true),
      updateJsonValue(filePath, startEnScriptJsonPath, startEnScriptJsonValue, true),
      deleteJsonValue(filePath, ['scripts', 'test_no_sm']),
      replaceRule(
      options,
        `lint --fix wird angepasst...`,
        `lint --fix wurde angepasst.`,
        filePath,
        new ReplaceItem('lint --fix', 'lint', true)
      ),
      messageSuccessRule(`package.json wurde angepasst.`)
    ]);
  };
}

export function updateAngularJson(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const filePath = (options.path ?? '') + '/angular.json';

    const localizePath = ['projects', options.project, "architect", 'build', 'options', 'localize'];
    const localizeValue = true;

    const polyfillsI18nPath = ['projects', options.project, 'architect', 'build', 'options', 'polyfills'];
    const polyfillsI18nTestPath = ['projects', options.project, 'architect', 'test', 'options', 'polyfills'];
    const polyfillsI18nValue = '@angular/localize/init';

    const assetsPath = ['projects', options.project, 'architect', 'build', 'options', 'assets'];
    const assetsTestPath = ['projects', options.project, 'architect', 'test', 'options', 'assets'];
    const assetsFindBuildFn = (node: Node) => findObjectContainsInArray(node, 'input', 'pdfjs-dist/build');
    const assetsFindCmapsFn = (node: Node) => findObjectContainsInArray(node, 'input', 'pdfjs-dist/cmaps');

    const allowedPath = ['projects', options.project, 'architect', 'build', 'options', 'allowedCommonJsDependencies'];
    const allowedPdfViewerFn = (node: Node) => findStringInArray(node, 'ng2-pdf-viewer');
    const allowedPdfDistFn = (node: Node) => findStringInArray(node, 'pdfjs-dist');

    const enPath = ['projects', options.project, 'architect', 'build', 'configurations', 'en', 'localize'];

    const lintPatternPath = ['projects', options.project, 'architect', 'lint', 'options', 'lintFilePatterns'];
    const lintPatternValue = ["src/app/**/*.ts", "src/app/**/*.html"];

    const lintConfigPath = ['projects', options.project, 'architect', 'lint', 'options', 'eslintConfig'];
    const lintConfigValue = 'eslint.config.js';

    const cliPath = ['cli', 'schematicCollections'];
    const cliFn = (node: Node) => findStringInArray(node, '@angular-eslint/schematics');
    
    return chain([
      messageInfoRule(`angular.json wird angepasst...`),
      replaceRule(
        options,
        'Attribut "browserTarget" wird umbenannt in "buildTarget"...',
        'Attribut "luxOptionMultiline" wurde entfernt.',
        (options.path ?? '') +'angular.json',
        new ReplaceItem('browserTarget', 'buildTarget', true)
      ),
      updateJsonValue(filePath, localizePath, localizeValue),
      updateJsonArray(filePath, polyfillsI18nPath, polyfillsI18nValue),
      updateJsonArray(filePath, polyfillsI18nTestPath, polyfillsI18nValue),
      deleteJsonArray(filePath, assetsPath, assetsFindBuildFn),
      deleteJsonArray(filePath, assetsPath, assetsFindCmapsFn),
      deleteJsonArray(filePath, assetsTestPath, assetsFindBuildFn),
      deleteJsonArray(filePath, assetsTestPath, assetsFindCmapsFn),
      deleteJsonArray(filePath, allowedPath, allowedPdfViewerFn),
      deleteJsonArray(filePath, allowedPath, allowedPdfDistFn),
      deleteJsonValue(filePath, enPath),
      updateJsonValue(filePath, lintPatternPath, lintPatternValue),
      updateJsonValue(filePath, lintConfigPath, lintConfigValue),
      deleteJsonArray(filePath, cliPath, cliFn),
      messageSuccessRule(`angular.json wurde angepasst.`)
    ]);
  };
}

export function updateKarmaConfJs(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const filePath = (options.path ?? '') + '/karma.conf.js';

    return chain([
      messageInfoRule(`karma.conf.js wird angepasst...`),
      replaceRule(
        options,
        'Reporters wird angepasst...',
        'Reporters wurde angepasst.',
        filePath,
        new ReplaceItem("'progress', 'coverage'", "'progress', 'kjhtml'")
      ),
      messageSuccessRule(`karma.conf.js wurde angepasst.`)
    ]);
  };
}

export function updateTsConfigAppJson(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const filePath = (options.path ?? '') + '/src/tsconfig.app.json';

    const i18nPath = ['compilerOptions', 'types'];
    const i18nValue = '@angular/localize';

    return chain([
      messageInfoRule(`tsconfig.app.json wird angepasst...`),
      updateJsonArray(filePath, i18nPath, i18nValue),
      messageSuccessRule(`tsconfig.app.json wurde angepasst.`)
    ]);
  };
}

export function updateTsConfigSpecJson(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const filePath = (options.path ?? '') + '/src/tsconfig.spec.json';

    const testPath = ['files'];
    const testFn = (node: Node) => findStringInArray(node, 'test.ts');

    const i18nPath = ['compilerOptions', 'types'];
    const i18nValue = '@angular/localize';

    return chain([
      messageInfoRule(`tsconfig.spec.json wird angepasst...`),
      deleteJsonArray(filePath, testPath, testFn),
      updateJsonArray(filePath, i18nPath, i18nValue),
      messageSuccessRule(`tsconfig.spec.json wurde angepasst.`)
    ]);
  };
}

export function updateMainTs(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const filePath = (options.path ?? '') + '/src/main.ts';
    

    return chain([
      messageInfoRule(`main.ts wird angepasst...`),
      replaceRule(
        options,
        'I18N wird angepasst...',
        'I18N wurde angepasst.',
        filePath,
        new ReplaceItem("import '@angular/localize/init';", '/// <reference types="@angular/localize" />')
      ),
      messageSuccessRule(`main.ts wurde angepasst.`)
    ]);
  };
}

export function updateTestTs(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const filePath = (options.path ?? '') + '/src/main.ts';
    

    return chain([
      messageInfoRule(`test.ts wird angepasst...`),
      replaceRule(
        options,
        'I18N wird angepasst...',
        'I18N wurde angepasst.',
        filePath,
        new ReplaceItem("import '@angular/localize/init';", '/// <reference types="@angular/localize" />')
      ),
      messageSuccessRule(`test.ts wurde angepasst.`)
    ]);
  };
}

function updateMessages(options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const deFilePath = (options.path ?? '') + '/src/locale/messages.xlf';
    const enFilePath = (options.path ?? '') + '/src/locale/messages.en.xlf';
    
    const zoomId = 'luxc.file-preview.pdfviewer.zoom.arialabel';
    
    const chipRemoveBeforeId = `luxc.chips.input.placeholder.lbl`;
    const deChipRemove = `<trans-unit id="luxc.chips.remove" datatype="html">
        <source>entfernen</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-form/lux-chips-ac/lux-chips-ac.component.html</context>
          <context context-type="linenumber">1</context>
        </context-group>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-form/lux-chips-ac/lux-chips-ac.component.html</context>
          <context context-type="linenumber">1</context>
        </context-group>
      </trans-unit>`;
      const enChipRemove = `<trans-unit id="luxc.chips.remove" datatype="html">
        <source>entfernen</source>
        <target>remove</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-form/lux-chips-ac/lux-chips-ac.component.html</context>
          <context context-type="linenumber">1</context>
        </context-group>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-form/lux-chips-ac/lux-chips-ac.component.html</context>
          <context context-type="linenumber">1</context>
        </context-group>
      </trans-unit>`;

    const stepperNotCompletedBeforeId = `luxc.lookup-autocomplete.error_message.not_available`;
    const deStepperNotCompleted = `<trans-unit id="luxc.stepper-large.error_message.steps_not_completed" datatype="html">
        <source>Die Angaben in Schritt <x id="PH" equiv-text="i + 1"/> sind unvollständig oder fehlerhaft. Bitte korrigieren Sie erst Ihre Angaben in diesem Schritt.</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-layout/lux-stepper-large/lux-stepper-large.component.ts</context>
          <context context-type="linenumber">244</context>
        </context-group>
      </trans-unit>`;
    const enStepperNotCompleted = `<trans-unit id="luxc.stepper-large.error_message.steps_not_completed" datatype="html">
      <source>Die Angaben in Schritt <x id="PH" equiv-text="i + 1"/> sind unvollständig oder fehlerhaft. Bitte korrigieren Sie erst Ihre Angaben in diesem Schritt.</source>
      <target>The information in step <x id="PH" equiv-text="i + 1"/> is incomplete or incorrect. Please correct your information in this step first.</target>
      <context-group purpose="location">
        <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-layout/lux-stepper-large/lux-stepper-large.component.ts</context>
        <context context-type="linenumber">244</context>
      </context-group>
    </trans-unit>`;

    const listBeforeId = `luxc.master-detail.back-to-master-label`;
    const deList = `<trans-unit id="luxc.list.arialabel" datatype="html">
        <source>Liste</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-layout/lux-list/lux-list.component.ts</context>
          <context context-type="linenumber">43</context>
        </context-group>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-layout/lux-list/lux-list.component.ts</context>
          <context context-type="linenumber">49</context>
        </context-group>
      </trans-unit>`;
    const enList = `<trans-unit id="luxc.list.arialabel" datatype="html">
        <source>Liste</source>
        <target>List</target>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-layout/lux-list/lux-list.component.ts</context>
          <context context-type="linenumber">43</context>
        </context-group>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/src/lib/lux-layout/lux-list/lux-list.component.ts</context>
          <context context-type="linenumber">49</context>
        </context-group>
      </trans-unit>`;

    return chain([
      replaceRule(
        options,
        `Messages (de) werden angepasst...`,
        `Messages (de) wurden angepasst.`,
        deFilePath,
        new RemoveTransUnitItem(zoomId),
        new AddTransUnitItem(chipRemoveBeforeId, deChipRemove),
        new AddTransUnitItem(stepperNotCompletedBeforeId, deStepperNotCompleted),
        new AddTransUnitItem(listBeforeId, deList)
      ),
      
      replaceRule(
        options,
        `Messages (en) werden angepasst...`,
        `Messages (en) wurden angepasst.`,
        enFilePath,
        new RemoveTransUnitItem(zoomId),
        new AddTransUnitItem(chipRemoveBeforeId, enChipRemove),
        new AddTransUnitItem(stepperNotCompletedBeforeId, enStepperNotCompleted),
        new AddTransUnitItem(listBeforeId, enList)
      )
    ]);
  };
}
