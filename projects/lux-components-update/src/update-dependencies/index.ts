import { chain, Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '../utility/dependencies';
import { updateJsonValue } from '../utility/json';
import { messageInfoRule, messageSuccessRule } from '../utility/util';

const addOrUpdate = false;
const updateIfExists = true;

export function updateDependencies(): Rule {
  return chain([
    messageInfoRule(`Abhängigkeiten in der Datei "package.json" werden aktualisiert...`),

    updateDep('@ihk-gfi/lux-components', '19.0.0', addOrUpdate),
    updateDep('@ihk-gfi/lux-components-theme', '19.0.0', addOrUpdate),
    updateDep('@ihk-gfi/lux-components-icons-and-fonts', '1.8.0', addOrUpdate),

    deleteDep('ng2-pdf-viewer'),
    deleteDep('pdfjs-dist'),
    deleteDevDep('@types/marked'),
    deleteDevDep('@angular-eslint/builder'),
    deleteDevDep('@angular-eslint/eslint-plugin'),
    deleteDevDep('@angular-eslint/eslint-plugin-template'),
    deleteDevDep('@angular-eslint/schematics'),
    deleteDevDep('@angular-eslint/template-parser'),
    deleteDevDep('@types/marked'),
    deleteDevDep('@typescript-eslint/eslint-plugin'),
    deleteDevDep('@typescript-eslint/parser'),
    deleteDevDep('del'),
    deleteDevDep('eslint-plugin-import'),
    deleteDevDep('eslint-plugin-jsdoc'),
    deleteDevDep('eslint-plugin-prefer-arrow'),

    updateDep('@angular/animations', '^19.2.4', addOrUpdate),
    updateDep('@angular/cdk', '^19.2.7', addOrUpdate),
    updateDep('@angular/common', '^19.2.4', addOrUpdate),
    updateDep('@angular/compiler', '^19.2.4', addOrUpdate),
    updateDep('@angular/core', '^19.2.4', addOrUpdate),
    updateDep('@angular/forms', '^19.2.4', addOrUpdate),
    updateDep('@angular/localize', '^19.2.4', addOrUpdate),
    updateDep('@angular/material', '^19.2.7', addOrUpdate),
    updateDep('@angular/platform-browser', '^19.2.4', addOrUpdate),
    updateDep('@angular/platform-browser-dynamic', '^19.2.4', addOrUpdate),
    updateDep('@angular/router', '^19.2.4', addOrUpdate),
    updateDep('dompurify', '^3.0.0', updateIfExists),
    updateDep('hammerjs', '2.0.8', addOrUpdate),
    updateDep('marked', '^15.0.0', updateIfExists),
    updateDep('ngx-build-plus', '^19.0.0', addOrUpdate),
    updateDep('ngx-cookie-service', '^19.0.0', addOrUpdate),
    updateDep('rxjs', '~7.8.1', addOrUpdate),
    updateDep('tslib', '^2.8.1', updateIfExists),
    updateDep('zone.js', '~0.15.0', addOrUpdate),

    updateDevDep('@angular-devkit/build-angular', '^19.2.5', addOrUpdate),
    updateDevDep('angular-eslint', '^19.2.0', addOrUpdate),
    updateDevDep('@angular/cli', '^19.2.5', addOrUpdate),
    updateDevDep('@angular/compiler-cli', '^19.2.4', addOrUpdate),
    updateDevDep('@angular/elements', '^19.2.4', addOrUpdate),
    updateDevDep('@angular/language-service', '^19.2.4', addOrUpdate),
    updateDevDep('@compodoc/compodoc', '^1.1.26', updateIfExists),
    updateDevDep('@ihk-gfi/lux-components-update', '^19.0.0', addOrUpdate),
    updateDevDep('@types/jasmine', '~5.1.5', addOrUpdate),
    updateDevDep('typescript-eslint', '8.16.0', addOrUpdate),
    updateDevDep('eslint', '^9.21.0', updateIfExists),
    updateDevDep('fs-extra', '11.2.0', updateIfExists),
    updateDevDep('jasmine-core', '~5.2.0', addOrUpdate),
    updateDevDep('karma', '~6.4.4', addOrUpdate),
    updateDevDep('karma-chrome-launcher', '~3.2.0', addOrUpdate),
    updateDevDep('karma-coverage', '~2.2.1', addOrUpdate),
    updateDevDep('karma-firefox-launcher', '2.1.3', updateIfExists),
    updateDevDep('karma-jasmine', '~5.1.0', addOrUpdate),
    updateDevDep('karma-jasmine-html-reporter', '~2.1.0', addOrUpdate),
    updateDevDep('karma-safari-launcher', '1.0.0', updateIfExists),
    updateDevDep('typescript', '~5.5.2', addOrUpdate),

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
