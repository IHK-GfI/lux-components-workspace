import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as semver from 'semver';
import { getPackageJsonDependency } from './dependencies';
import { logInfo, logInfoWithDescriptor, logSuccess } from './logging';

/**
 * Konfig-Objekt für einige Util-Methoden.
 * Ermöglicht z.B. die Standard-Dauer des waitForTreeCallback-Aufrufs zu ändern
 */
export const UtilConfig = {
  defaultWaitMS: 4000
};

export function escapeRegExp(str: string) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

export function replaceRegEx(str: string, expression: RegExp, replace: string) {
  return str.replace(expression, replace);
}

export function replaceString(str: string, find: string, replace: string, isReplaceAll: boolean = true): string {
  return isReplaceAll ? replaceAll(str, find, replace) : replaceFirst(str, find, replace);
}

export function replaceFirst(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(escapeRegExp(find), 'm'), replace);
}

export function replaceAll(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(escapeRegExp(find), 'gm'), replace);
}

/**
 * Wartet die übergebene Zeitspanne und ruft dann den Callback auf.
 * Gibt anschließend den Tree über ein Observable zurück.
 * @param _tree
 * @param callback
 * @param waitMS
 */
export const waitForTreeCallback = (_tree: Tree, callback: Function, waitMS: number = UtilConfig.defaultWaitMS) => {
  return new Observable<Tree>((subscriber) => {
    of(callback())
      .pipe(delay(waitMS))
      .subscribe(
        (callbackResult) => {
          if (callbackResult instanceof Observable) {
            callbackResult.subscribe((result: Tree) => {
              subscriber.next(result);
              subscriber.complete();
            });
          } else {
            subscriber.next(<Tree>callbackResult);
            subscriber.complete();
          }
        },
        (error) => {
          subscriber.error(error.message);
        }
      );
  });
};

/**
 * Führt npm install aus und wartet auf den Abschluss des Prozess für diese Schematic.
 * Wenn dieses eintritt, werden die Hinweise und ToDos ausgegeben.
 * @param context
 * @param messages
 */
export const runInstallAndLogToDos: (context: SchematicContext, messages: string[], runNpmInstall: boolean) => void = (
  context: SchematicContext,
  messages,
  runNpmInstall
) => {
  // diese log-Ausgaben werden erst ganz zum Schluss ausgeführt (nach Update und npm-install logs)
  process.addListener('exit', () => {
    if (messages) {
      messages.forEach((message: string) => {
        logInfo(message);
      });
    }
  });

  if (runNpmInstall) {
    // npm install starten
    context.addTask(new NodePackageInstallTask());
  }
};

export function updateI18nFile(tree: Tree, language: string, insertTransUnitId: string, translations: string) {
  let filePath: string;
  if (language === 'en') {
    filePath = '/src/locale/messages.en.xlf';
  } else if (language === 'fr') {
    filePath = '/src/locale/messages.fr.xlf';
  } else {
    filePath = '/src/locale/messages.xlf';
  }

  if (tree.exists(filePath)) {
    let insertTranslation = `<trans-unit id="${insertTransUnitId}" datatype="html">`;
    let content = (tree.read(filePath) as Buffer).toString();
    let modifiedContent = replaceAll(content, insertTranslation, translations + '\n      ' + insertTranslation);

    if (content !== modifiedContent) {
      tree.overwrite(filePath, modifiedContent);
      logInfo(`Sprachdatei ${filePath} angepasst.`);
    }
  }
}

export function applyRuleIfFileExists(rule: Rule, path: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (tree.exists(path)) {
      return rule;
    } else {
      return tree;
    }
  };
}

export function applyRuleIf(minVersion: string, rule: Rule): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    let version = getPackageJsonDependency(tree, '@ihk-gfi/lux-components').version;

    if (semver.satisfies(minVersion, version)) {
      return rule;
    } else {
      return tree;
    }
  };
}

export function messageDebugRule(message: any, options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    if (options && options.verbose) {
      logInfo(message);
    }
  };
}

export function messageInfoRule(message: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    logInfoWithDescriptor(message);
  };
}

export function messageInfoInternRule(message: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    logInfo(message);
  };
}

export function messageSuccessRule(message: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    logSuccess(message);
  };
}

export function finish(runNpmInstall: boolean, ...messages: string[]): Rule {
  return (tree: Tree, context: SchematicContext) => {
    runInstallAndLogToDos(context, messages, runNpmInstall);
    return tree;
  };
}
