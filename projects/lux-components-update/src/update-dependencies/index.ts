import { chain, Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '../utility/dependencies';
import { updateJsonValue } from '../utility/json';
import { messageInfoRule, messageSuccessRule } from '../utility/util';

const addOrUpdate = false;
const updateIfExists = true;

export function updateDependencies(): Rule {
  return chain([
    messageInfoRule(`Abhängigkeiten in der Datei "package.json" werden aktualisiert...`),
    deleteDep('@ihk-gfi/lux-stammdaten'),
    deleteDep('@angular/flex-layout'),
    deleteDevDep('node-sass'),

    updateDep('@ihk-gfi/lux-components', '18.0.0', addOrUpdate),
    updateDep('@ihk-gfi/lux-components-theme', '18.0.0', addOrUpdate),
    updateDep('@ihk-gfi/lux-components-icons-and-fonts', '1.8.0', addOrUpdate),
    updateDep('@angular/animations', '^18.2.6', addOrUpdate),
    updateDep('@angular/common', '^18.2.6', addOrUpdate),
    updateDep('@angular/core', '^18.2.6', addOrUpdate),
    updateDep('@angular/compiler', '^18.2.6', addOrUpdate),
    updateDep('@angular/localize', '^18.2.6', addOrUpdate),
    updateDep('@angular/forms', '^18.2.6', addOrUpdate),
    updateDep('@angular/platform-browser', '^18.2.6', addOrUpdate),
    updateDep('@angular/platform-browser-dynamic', '^18.2.6', addOrUpdate),
    updateDep('@angular/router', '^18.2.6', addOrUpdate),
    updateDep('@angular/cdk', '^18.2.6', addOrUpdate),
    updateDep('@angular/material', '^18.2.6', addOrUpdate),
    updateDep('rxjs', '~7.8.1', addOrUpdate),
    updateDep('dompurify', '~3.1.6', addOrUpdate),
    updateDep('marked', '4.0.15', addOrUpdate),
    updateDep('zone.js', '~0.14.10', addOrUpdate),
    updateDep('tslib', '^2.3.0', updateIfExists),
    updateDep('hammerjs', '2.0.8', addOrUpdate),
    updateDep('ng2-pdf-viewer', '10.3.1', addOrUpdate),
    updateDep('pdfjs-dist', '4.6.82', addOrUpdate),
    updateDep('ngx-cookie-service', '^18.0.0', addOrUpdate),
    updateDep('ngx-build-plus', '^18.0.0', addOrUpdate),

    updateDevDep('@ihk-gfi/lux-components-update', '^18.0.0', addOrUpdate),
    updateDevDep('@angular-eslint/builder', '^18.3.1', updateIfExists),
    updateDevDep('@angular-eslint/eslint-plugin', '^18.3.1', updateIfExists),
    updateDevDep('@angular-eslint/eslint-plugin-template', '^18.3.1', updateIfExists),
    updateDevDep('@angular-eslint/schematics', '^18.3.1', updateIfExists),
    updateDevDep('@angular-eslint/template-parser', '^18.3.1', updateIfExists),
    updateDevDep('@typescript-eslint/eslint-plugin', '^7.2.0', updateIfExists),
    updateDevDep('@typescript-eslint/parser', '^7.2.0', updateIfExists),
    updateDevDep('eslint', '^8.57.0', updateIfExists),
    updateDevDep('eslint-plugin-import', '2.29.1', updateIfExists),
    updateDevDep('eslint-plugin-jsdoc', '48.2.2', updateIfExists),
    updateDevDep('eslint-plugin-prefer-arrow', '1.2.3', updateIfExists),
    updateDevDep('@angular-devkit/build-angular', '^18.2.4', addOrUpdate),
    updateDevDep('@angular/compiler-cli', '^18.2.6', addOrUpdate),
    updateDevDep('@angular/cli', '^18.2.6', addOrUpdate),
    updateDevDep('@angular/language-service', '^18.2.6', addOrUpdate),
    updateDevDep('@angular/elements', '^18.2.6', addOrUpdate),
    updateDevDep('@compodoc/compodoc', '^1.1.25', updateIfExists),
    updateDevDep('@types/jasmine', '~5.1.0', addOrUpdate),
    updateDevDep('@types/marked', '4.0.3', addOrUpdate),
    updateDevDep('jasmine-core', '~5.2.0', addOrUpdate),
    updateDevDep('karma', '~6.4.0', addOrUpdate),
    updateDevDep('karma-coverage', '~2.2.0', addOrUpdate),
    updateDevDep('karma-chrome-launcher', '~3.2.0', addOrUpdate),
    updateDevDep('karma-firefox-launcher', '2.1.3', updateIfExists),
    updateDevDep('karma-jasmine', '~5.1.0', addOrUpdate),
    updateDevDep('karma-jasmine-html-reporter', '~2.1.0', addOrUpdate),
    updateDevDep('karma-safari-launcher', '1.0.0', updateIfExists),
    updateDevDep('typescript', '~5.5.2', addOrUpdate),
    updateDevDep('fs-extra', '11.2.0', updateIfExists),
    updateDevDep('del', '6.0.0', updateIfExists),
    messageSuccessRule(`Abhängigkeiten in der Datei "package.json" wurden aktualisiert.`)
  ]);
}

export function updateDep(name: string, version: string, onlyUpdate: boolean): Rule {
  return updateJsonValue('/package.json', [NodeDependencyType.Default, name], version, onlyUpdate);
}

export function deleteDep(name: string): Rule {
  return updateJsonValue('/package.json', [NodeDependencyType.Default, name], void 0, true);
}

export function updateDevDep(name: string, version: string | null, onlyUpdate: boolean): Rule {
  return updateJsonValue('/package.json', [NodeDependencyType.Dev, name], version, onlyUpdate);
}

export function deleteDevDep(name: string): Rule {
  return updateJsonValue('/package.json', [NodeDependencyType.Dev, name], void 0, true);
}
