import { join, Path, strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  DirEntry,
  forEach,
  MergeStrategy,
  mergeWith,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { logDebug, logInfo, logInfoWithDescriptor, logSuccess } from './logging';
import { ReplaceItem } from './replace-item';
import type { Options } from './types';
import { messageInfoRule, messageSuccessRule, replaceRegEx, replaceString } from './util';

/**
 * Entfernt eine Zeile aus der Datei, die den searchString beinhaltet.
 * Gibt eine Log-Ausgabe aus, wenn die Datei nicht gefunden werden konnte.
 * @param tree
 * @param context
 * @param filePath
 * @param searchString
 */
export function deleteLineFromFile(tree: Tree, _context: SchematicContext, filePath: string, searchString: string, withLog = true) {
  let changed = false;

  const fileContent: Buffer | null = tree.read(filePath);
  if (fileContent) {
    // String der Datei erhalten
    let content: string = fileContent.toString();

    if (content.indexOf(searchString) !== -1) {
      // Standard-Separator
      let separator = '\r\n';

      // Wenn nicht gefunden, nur \n als Separator nutzen
      if (content.indexOf(separator) === -1) {
        separator = '\n';
      }

      // Alle Zeilen der Datei erhalten
      const lines: string[] = content.split(separator);

      // Lines iterieren und nach der dependency suchen
      for (let i = 0; i < lines.length; i++) {
        // Wenn gefunden, die Zeile entfernen
        if (lines[i].indexOf(searchString) > -1) {
          content = content.replace(lines[i], '');

          // Sonderbehandlung für die .json-Dateien
          // Wenn man aus einem Block die letzte Zeile entfernt,
          // muss in der Zeile davor das Komma entfernt werden.
          // Beispiel:
          // "dependencies": {
          //     "@angular/common": "9.1.0",
          //     "lux-components": "1.8.3"
          //   },
          // Entfernt man die Zeile "lux-components...",
          // muss das Komma aus der Zeile "@angular/common..." ebenfalls
          // entfernt werden, sonst ist dsa Json ungültig.
          if (filePath.endsWith('.json') && i + 1 < lines.length) {
            if (i > 0 && (lines[i + 1].trim() === '}' || lines[i + 1].trim() === '},')) {
              content = content.replace(lines[i - 1], lines[i - 1].substring(0, lines[i - 1].lastIndexOf(',')));
            }
          }
        }
      }

      tree.overwrite(filePath, content);
      changed = true;
    } else {
      if (withLog) {
        logInfo(`Die Datei "${filePath}" enthält den String "${searchString}" nicht.`);
      }
    }
  } else {
    if (withLog) {
      logInfo(`Die Datei "${filePath}" wurde nicht gefunden.`);
    }
  }

  return changed;
}

/**
 * Schreibt die übergebenen Zeilen in die Datei.
 * Wenn die Datei existiert, wird der neue Inhalt am Ende der Datei angehangen.
 * Wenn die Datei nicht exitiert, wird diese mit dem Inhalt erstellt.
 * @param tree
 * @param context
 * @param filePath
 * @param lines
 */
export function writeLinesToFile(tree: Tree, _context: SchematicContext, filePath: string, ...lines: string[]) {
  const fileContent: Buffer | null = tree.read(filePath);
  let content = '';

  lines.forEach((line: string) => {
    if (fileContent && fileContent.toString().indexOf(line) === -1) {
      content += line + '\r\n';
    }
  });

  if (fileContent !== null) {
    tree.overwrite(filePath, fileContent.toString() + '\r\n' + content);
    logInfo(`Überschreibe die Datei "${filePath}".`);
  } else {
    tree.create(filePath, content);
    logInfo(`Erstelle die Datei "${filePath}" und füge Inhalt hinzu.`);
  }
}

function isIgnoredPath(filePath: string, ignoreSpecFiles = false): boolean {
  if (
    ['/node_modules/', '/.idea/', '/coverage/', '/dist/', '/.git/', '/.angular/', '/.cache/', '/tmp/', '/out/', '/src-gen/'].some((segment) =>
      filePath.includes(segment)
    )
  ) {
    return true;
  }

  return ignoreSpecFiles && filePath.endsWith('.spec.ts');
}

/**
 * Traversiert Verzeichnisse rekursiv, bricht aber früh ab, wenn ein Verzeichnis
 * in den Ignore-Regeln ist. Dadurch wird das Betreten großer Ordner wie
 * node_modules verhindert und die Laufzeit erheblich verbessert.
 */
function visitWithPrune(tree: Tree, startDirPath: string, fileCallback: (filePath: string) => void, ignoreSpecFiles = false) {
  const dir: DirEntry | null = tree.getDir(startDirPath);
  if (!dir) {
    return;
  }

  // Prüfen, ob das gesamte Verzeichnis ignoriert werden soll
  if (isIgnoredPath(dir.path + '/', ignoreSpecFiles)) {
    return;
  }

  // Dateien im aktuellen Verzeichnis verarbeiten
  dir.subfiles.forEach((fileName) => {
    const filePath = join(dir.path, fileName) as string;
    fileCallback(filePath);
  });

  // Rekursiv in Unterverzeichnisse gehen (nur die erlaubten)
  dir.subdirs.forEach((subdir) => {
    const subdirPath = `${dir.path}/${subdir}`;
    visitWithPrune(tree, subdirPath, fileCallback, ignoreSpecFiles);
  });
}

/**
 * Iteriert über alle Dateien vom Root-Pfad aus.
 * Über die filePathEndings lassen sich Einschränkungen bzgl. des Datei-Typs festlegen (z.B. .html).
 * Wenn eine Datei die passende Endung und Inhalt hat, wird der Callback mit Pfad und Content aufgerufen.
 * @param tree
 * @param rootPath
 * @param callback(filePath, content)
 * @param filePathEndings Z.B. .html, .ts, src/styles.scss,...
 */
export function iterateFilesAndModifyContent(tree: Tree, rootPath = '', verbose = false, callback: (filePath: string, content: string) => void, ...filePathEndings: string[]) {
  const normalizedRootPath = rootPath && rootPath.trim() ? rootPath.trim() : '/';

  if (verbose) {
    logDebug(`Suche nach "${filePathEndings.length > 0 ? filePathEndings.join(', ') : 'allen'}" Dateien unter dem Pfad "${normalizedRootPath}"...`);
  }
  
  visitWithPrune(tree, normalizedRootPath, (filePath: string) => {
    // Endung der Datei mit erlaubten Endungen abgleichen
    let modifyFile = false;
    for (const fileEnding of filePathEndings) {
      if (filePath.endsWith(fileEnding)) {
        modifyFile = true;
        break;
      }
    }
    
    // Besitzt die Datei die richtige Endung?
    if (!modifyFile) {
      if (verbose) {
        logDebug(`${filePath} wurde übersprungen...`);
      }
      return;
    }

    if (verbose) {
      logDebug(`${filePath} wird verarbeitet...`);
    }
    // Inhalt auslesen
    const content = tree.read(filePath);
    // Wenn die Datei keinen Inhalt hat, die nächste Datei aufrufen
    if (!content) {
      return;
    }

    // Callback mit aktuellem Pfad + Inhalt der Datei aufrufen
    callback(filePath, content.toString());

    if (verbose) {
      logInfo(`${filePath} wurde verarbeitet.`);
    }
  });
}

/**
 * Diese Methode ersetzt die angegebene Dateien. Sollten diese nicht existieren, werden sie neu angelegt.
 *
 * Beispiele:
 *   moveFilesToDirectory(options, 'files/locale', 'src/locale')
 *   moveFilesToDirectory(options, 'files/root', '/')
 *
 * @param options Die Optionen.
 * @param sourcePath Ein Quellpfad (z.B. files/theming für alle Dateien unter /theming).
 * @param targetPath Ein Zielpfad (z.B. src/theming/).
 */
export function moveFilesToDirectory(options: Options, sourcePath: string, targetPath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }
    if (!sourcePath.startsWith('/')) {
      sourcePath = '/' + sourcePath;
    }

    targetPath = (options.path ? options.path : '') + targetPath;

    const templateSource = apply(url('.' + sourcePath), [
      template({
        ...strings,
        ...options
      }),
      forEach((file) => {
        let newTargetPath = targetPath + file.path;
        newTargetPath = newTargetPath.replace('//', '/');

        if (tree.exists(newTargetPath)) {
          tree.overwrite(newTargetPath, file.content);
          logInfo(`Datei '${newTargetPath}' aktualisiert.`);
        } else {
          tree.create(newTargetPath, file.content);
          logInfo(`Datei '${newTargetPath}' angelegt.`);
        }
        return null;
      })
    ]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}

/**
 * Diese Methode löscht die Dateien in dem angegebenen Ordner.
 *
 * @param options Die Optionen.
 * @param path Der Pfad.
 * @param exclude Ein Array mit Dateinamen, die nicht gelöscht werden sollen.
 */
export function deleteFilesInDirectory(options: Options, path: string, exclude: string[]): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    if (!path.endsWith('/')) {
      path = path + '/';
    }

    path = (options.path ? options.path : '') + path;

    const dir = tree.getDir(path);
    if (dir) {
      dir.subfiles.forEach((filePath) => {
        if (!exclude.find((excludeFilePath) => excludeFilePath === filePath)) {
          tree.delete(path + filePath);
          logInfo(filePath + ' gelöscht.');
        }
      });
    }

    return tree;
  };
}

export function searchInComponentAndModifyModule(
  tree: Tree,
  rootPath: string,
  searchStrings: string[],
  callback: (filePath: string, content: string) => void,
  ...filePathEndings: string[]
) {
  visitWithPrune(tree, rootPath, (filePath: string) => {
    // Endung der Datei mit erlaubten Endungen abgleichen
    let modifyFile = false;
    for (const fileEnding of filePathEndings) {
      if (filePath.endsWith(fileEnding)) {
        modifyFile = true;
        break;
      }
    }
    // Besitzt die Datei die richtige Endung?
    if (!modifyFile) {
      return;
    }
    // Inhalt auslesen
    const content = tree.read(filePath);
    // Wenn die Datei keinen Inhalt hat, die nächste Datei aufrufen
    if (!content) {
      return;
    }

    let foundSearchString = '';
    searchStrings.forEach((searchString: string) => {
      if (!foundSearchString && content.toString().indexOf(searchString) > -1) {
        foundSearchString = searchString;
      }
    });

    if (!foundSearchString) {
      return;
    }

    // den Ordner der gefundenen Datei nehmen
    const fileDir = filePath.substring(0, filePath.lastIndexOf('/'));
    const modulePath: Path = findModule(tree, fileDir);
    const moduleContent = tree.read(modulePath);
    if (moduleContent) {
      // Callback mit aktuellem Pfad + Inhalt der Datei aufrufen
      callback(modulePath, moduleContent.toString());
    }
  }, true);
}

/**
 * Function to find the "closest" module to a generated file's path.
 *
 * Source: https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/utility/find-module.ts
 */
export function findModule(host: Tree, generateDir: string, moduleExt = '.module.ts', routingModuleExt = '-routing.module.ts'): Path {
  let dir: DirEntry | null = host.getDir('/' + generateDir);
  let foundRoutingModule = false;

  while (dir) {
    const allMatches = dir.subfiles.filter((p) => p.endsWith(moduleExt));
    const filteredMatches = allMatches.filter((p) => !p.endsWith(routingModuleExt));

    foundRoutingModule = foundRoutingModule || allMatches.length !== filteredMatches.length;

    if (filteredMatches.length == 1) {
      return join(dir.path, filteredMatches[0]);
    } else if (filteredMatches.length > 1) {
      throw new Error('More than one module matches. Use skip-import option to skip importing ' + 'the component into the closest module.');
    }

    dir = dir.parent;
  }

  const errorMsg = foundRoutingModule
    ? 'Could not find a non Routing NgModule.' +
      `\nModules with suffix '${routingModuleExt}' are strictly reserved for routing.` +
      '\nUse the skip-import option to skip importing in NgModule.'
    : 'Could not find an NgModule. Use the skip-import option to skip importing in NgModule.';

  throw new Error(errorMsg);
}

/**
 * Löscht die Datei aus dem gegebenen Pfad.
 * @param options
 * @param targetPath
 */
export function deleteFile(options: Options, targetPath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    logInfoWithDescriptor('Lösche Datei ' + targetPath + '.');
    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }

    targetPath = (options.path ? options.path : '') + targetPath;

    if (tree.exists(targetPath)) {
      tree.delete(targetPath);
      logSuccess(targetPath + ' erfolgreich gelöscht.');
    } else {
      logSuccess(targetPath + ' konnte nicht gefunden werden.');
    }
    return tree;
  };
}

export function replaceRule(options: Options, startMsg: string, endMsg: string, filePattern: string, ...replaceItems: ReplaceItem[]): Rule {
  return chain([
    messageInfoRule(startMsg),
    (tree: Tree, _context: SchematicContext) => {
      iterateFilesAndModifyContent(
        tree,
        options.path,
        !!options.verbose,
        (filePath: string, content: string) => {
          let result = content;

          replaceItems.forEach((item: ReplaceItem) => {
            if (typeof item.find === 'string') {
              result = replaceString(result, item.find, item.replacement, item.replaceAll);
            } else {
              result = replaceRegEx(result, item.find, item.replacement);
            }
          });

          if (content !== result) {
            logInfo(filePath + ' wurde angepasst.');
            tree.overwrite(filePath, result);
          }
        },
        filePattern
      );
    },
    messageSuccessRule(endMsg)
  ]);
}

export function readFile(tree: Tree, path: string) {
  const fileContent: Buffer | null = tree.read(path);

  return fileContent ? fileContent.toString() : '';
}
