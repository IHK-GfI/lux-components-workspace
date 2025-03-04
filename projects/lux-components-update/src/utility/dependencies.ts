import { SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { applyEdits, findNodeAtLocation, modify } from 'jsonc-parser';
import { deleteLineFromFile } from './files';
import { jsonFormattingOptions, readJson, readJsonAsString } from './json';
import { formattedSchematicsException, logInfo } from './logging';

export enum NodeDependencyType {
  Default = 'dependencies',
  Dev = 'devDependencies',
  Peer = 'peerDependencies',
  Optional = 'optionalDependencies'
}

export interface NodeDependency {
  type: NodeDependencyType;
  name: string;
  version: string;
}

/**
 * Liefert die Dependency zurück, wenn es sie gibt, undefined sonst.
 * @param tree
 * @param name
 */
export function hasPackageJsonDependency(tree: Tree, name: string): NodeDependency | undefined {
  const packageJsonNode = readJson(tree, '/package.json');
  let dependency: NodeDependency | undefined = undefined;

  [NodeDependencyType.Default, NodeDependencyType.Dev, NodeDependencyType.Optional, NodeDependencyType.Peer].forEach((depType) => {
    let node = findNodeAtLocation(packageJsonNode, [depType.toString(), name]);
    if (node) {
      dependency = {
        type: depType,
        name: name,
        version: node.value
      };
    }
  });

  return dependency;
}

/**
 * Versucht eine Dependency aus der package.json auslesen und gibt diese zurück.
 * @param tree
 * @param name
 */
export function getPackageJsonDependency(tree: Tree, name: string): NodeDependency {
  const packageJsonNode = readJson(tree, '/package.json');
  let dependency: NodeDependency | null = null;

  [NodeDependencyType.Default, NodeDependencyType.Dev, NodeDependencyType.Optional, NodeDependencyType.Peer].forEach((depType) => {
    let node = findNodeAtLocation(packageJsonNode, [depType.toString(), name]);
    if (node) {
      dependency = {
        type: depType,
        name: name,
        version: node.value
      };
    }
  });

  if (dependency) {
    return dependency;
  } else {
    throw formattedSchematicsException(`Dependency ${name} nicht in der package.json gefunden.`);
  }
}

/**
 * Aktualisiert eine Dependency in der package.json bzw. fügt diese hinzu, falls sie noch nicht vorhanden ist.
 * @param tree
 * @param name
 * @param verion
 */
export function updateDependency(tree: Tree, name: string, version: string): void {
  updatePackageJsonDependency(tree, { type: NodeDependencyType.Default, name: name, version: version });
}

/**
 * Aktualisiert eine Dependency in der package.json bzw. fügt diese hinzu, falls sie noch nicht vorhanden ist.
 * @param tree
 * @param name
 * @param verion
 */
export function updateDependencyDev(tree: Tree, name: string, version: string): void {
  updatePackageJsonDependency(tree, { type: NodeDependencyType.Dev, name: name, version: version });
}

/**
 * Aktualisiert eine Dependency in der package.json bzw. fügt diese hinzu, falls sie noch nicht vorhanden ist.
 * @param tree
 * @param dependency
 */
export function updatePackageJsonDependency(tree: Tree, dependency: NodeDependency): void {
  const packageJsonAsNode = readJson(tree, '/package.json');
  let node = findNodeAtLocation(packageJsonAsNode, [dependency.type.toString(), dependency.name]);
  if (node) {
    if (node && node.value !== dependency.version) {
      logInfo(`Dependency ` + chalk.yellowBright(`${dependency.name}`) + ` ${node.value} wird ersetzt durch ${dependency.version}.`);
    }
  } else {
    logInfo(
      `Dependency ` + chalk.yellowBright(`${dependency.name}`) + ` ${dependency.version} wird im Abschnitt ${dependency.type} hinzugefügt.`
    );
  }

  if (!node || node.value !== dependency.version) {
    const packageJonsAsString = readJsonAsString(tree, '/package.json');
    const edits = modify(packageJonsAsString, [dependency.type.toString(), dependency.name], dependency.version, {
      formattingOptions: jsonFormattingOptions
    });

    if (edits) {
      tree.overwrite('/package.json', applyEdits(packageJonsAsString, edits));
    }
  }
}

export function deletePackageJsonDependency(tree: Tree, context: SchematicContext, dependency: NodeDependency) {
  const changed = deleteLineFromFile(tree, context, '/package.json', dependency.name, false);
  if (changed) {
    logInfo(`Dependency ` + chalk.yellowBright(`${dependency.name}`) + ` wurde aus dem Abschnitt ${dependency.type} gelöscht.`);
  }
}
