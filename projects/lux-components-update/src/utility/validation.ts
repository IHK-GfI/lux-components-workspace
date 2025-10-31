import { SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import * as semver from 'semver';
import { getDep } from './dependencies';
import { formattedSchematicsException, logInfo } from './logging';

export function validateNodeVersion(_context: SchematicContext, minimumVersion: string) {
  if (semver.lt(process.versions.node, minimumVersion)) {
    logInfo(`Nodeversion ${process.versions.node} -> ${chalk.redBright('fail')}`);
    throw formattedSchematicsException(
      `Ihre Node.js Version ist ${process.versions.node}.\n` +
        `LUX benötigt allerdings die Version ${minimumVersion}.\n` +
        `Bitte aktualisieren Sie Node.js.`
    );
  }
  logInfo(`Nodeversion ${process.versions.node} -> ok`);
}

export function validateAngularVersion(tree: Tree, angularVersion: string) {
  const currentVersion = getDep(tree, '@angular/common').version.replace(/([\^~])/g, '');
  if (!semver.satisfies(currentVersion, angularVersion)) {
    logInfo(`Angularversion ${currentVersion} -> ${chalk.redBright('fail')}`);
    throw formattedSchematicsException(
      `Sie nutzen die Angular Version ${currentVersion}.`,
      `Dieser Generator benötigt allerdings eine ${angularVersion}.`,
      `Bitte nutzen Sie eine neuere Schematic für Ihr Update.`
    );
  }
  logInfo(`Angularversion ${currentVersion} -> ok`);
}

export function validateLuxComponentsVersion(tree: Tree, versionRange: string) {
  const version = getDep(tree, '@ihk-gfi/lux-components').version.replace(/([\^~])/g, '');
  if (!semver.satisfies(version, versionRange)) {
    logInfo(`LUX-Componentsversion ${version} -> ${chalk.redBright('fail')}`);
    throw formattedSchematicsException(
      `Die LUX-Componentsversion ${version} wird nicht unterstützt. ` + `Dieser Updater unterstützt die Versionen ${versionRange}.`
    );
  }
  logInfo(`LUX-Componentsversion ${version} -> ok`);
}
