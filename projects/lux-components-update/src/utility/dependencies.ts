import { Rule, Tree } from '@angular-devkit/schematics';
import { findNodeAtLocation } from 'jsonc-parser';
import { readJson, updateJsonValue } from './json';
import { formattedSchematicsException } from './logging';

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
export function hasDep(tree: Tree, name: string): NodeDependency | undefined {
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
export function getDep(tree: Tree, name: string): NodeDependency {
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
