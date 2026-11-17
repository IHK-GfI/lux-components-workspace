import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { styleText } from 'node:util';
import * as semver from 'semver';
import { getDep } from './dependencies';
import { formattedSchematicsException, logInfo } from './logging';

export function validateNodeVersion(_context: SchematicContext, minimumVersion: string) {
  if (semver.lt(process.versions.node, minimumVersion)) {
    logInfo(`Nodeversion ${process.versions.node} -> ${styleText('redBright', 'fail')}`);
    throw formattedSchematicsException(
      `Ihre Node.js Version ist ${process.versions.node}.\n` +
        `LUX benötigt allerdings die Version ${minimumVersion}.\n` +
        `Bitte aktualisieren Sie Node.js.`
    );
  }
  logInfo(`Nodeversion ${process.versions.node} -> ok`);
}

/**
 * Prüft, ob die Node-Version im angegebenen Bereich liegt (z.B. "^22.22.3 || ^24.15.0 || >=26.0.0").
 * Anders als {@link validateNodeVersion} schließt das auch Versionen zwischen den Bereichen aus (z.B. Node 23).
 *
 * @param _context Der Kontext.
 * @param versionRange Der erlaubte Versionsbereich.
 * @param nodeVersion Die geprüfte Version (Standard: die laufende Node-Version).
 */
export function validateNodeVersionRange(_context: SchematicContext, versionRange: string, nodeVersion = process.versions.node) {
  if (!semver.satisfies(nodeVersion, versionRange)) {
    logInfo(`Nodeversion ${nodeVersion} -> ${styleText('redBright', 'fail')}`);
    throw formattedSchematicsException(
      `Ihre Node.js Version ist ${nodeVersion}.\n` +
        `LUX benötigt allerdings eine Version aus dem Bereich ${versionRange}.\n` +
        `Bitte aktualisieren Sie Node.js.`
    );
  }
  logInfo(`Nodeversion ${nodeVersion} -> ok`);
}

export function validateAngularVersion(tree: Tree, angularVersion: string) {
  const currentVersion = getDep(tree, '@angular/common').version.replace(/([\^~])/g, '');
  if (!semver.satisfies(currentVersion, angularVersion)) {
    logInfo(`Angularversion ${currentVersion} -> ${styleText('redBright', 'fail')}`);
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
    logInfo(`LUX-Componentsversion ${version} -> ${styleText('redBright', 'fail')}`);
    throw formattedSchematicsException(
      `Die LUX-Componentsversion ${version} wird nicht unterstützt. ` + `Dieser Updater unterstützt die Versionen ${versionRange}.`
    );
  }
  logInfo(`LUX-Componentsversion ${version} -> ok`);
}
