import { callRule, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { deleteJsonArray, findObjectPropertyInArray, findStringInArray, updateJsonArray, updateJsonValue } from './json';
import { appOptions, workspaceOptions } from './test';
import { UtilConfig } from './util';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('json', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: any;

  const testOptions: any = {};

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', collectionPath);

    appTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('updateJsonValue', () => {
    it('Sollte den neuen Wert hinzufügen', () => {
      const filePath = testOptions.path + '/updateJsonValue/updateJsonValueAdd.json';

      appTree.create(filePath, updateJsonValueAdd);

      callRule(
        updateJsonValue(filePath, ['projects', 'lux-components', 'architect', 'build', 'options', 'aaa'], 'bbb'),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain('"aaa": "bbb');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte den neuen Wert ersetzen', () => {
      const filePath = testOptions.path + '/updateJsonValue/updateJsonValueReplace.json';

      appTree.create(filePath, updateJsonValueReplace);

      callRule(
        updateJsonValue(filePath, ['projects', 'lux-components', 'architect', 'build', 'options', 'aaa'], false),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain('"aaa": false');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('updateJsonArr', () => {
    it('Sollte das Array inklusive dem neuen Wert hinzufügen', () => {
      const filePath = testOptions.path + '/updateJsonArray/updateJsonArrNoArray.json';

      appTree.create(filePath, updateJsonArrNoArray);

      callRule(
        updateJsonArray(filePath, ['projects', 'lux-components', 'architect', 'build', 'options', 'assets'], 'aaa'),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain('"assets": [\n              "aaa"\n            ]\n');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte den neuen Wert im vorhandenen leeren Array hinzufügen', () => {
      const filePath = testOptions.path + '/updateJsonArray/updateJsonArrEmptyArray.json';

      appTree.create(filePath, updateJsonArrEmptyArray);

      callRule(
        updateJsonArray(filePath, ['projects', 'lux-components', 'architect', 'build', 'options', 'assets'], 'aaa'),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain('"assets": [\n              "aaa"\n            ],\n');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte den Wert im vorhandenen leeren Array nicht doppelt hinzufügen', () => {
      const filePath = testOptions.path + '/updateJsonArray/updateJsonArrDoubleEntry.json';

      appTree.create(filePath, updateJsonArrDoubleEntry);

      callRule(
        updateJsonArray(filePath, ['projects', 'lux-components', 'architect', 'build', 'options', 'assets'], 'aaa'),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain(
            '"assets": [\n' + '              "aaa",\n' + '              "bbb",\n' + '              "ccc"\n' + '            ]'
          );
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte den neuen Wert am Ende des vorhanden Arrays hinzufügen', () => {
      const filePath = testOptions.path + '/updateJsonArray/updateJsonArrAppendArray.json';

      appTree.create(filePath, updateJsonArrAppendArray);

      callRule(
        updateJsonArray(filePath, ['projects', 'lux-components', 'architect', 'build', 'options', 'assets'], 'bbb'),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain(
            '"assets": [\n' + '              "aaa",\n' + '              "bbb",\n' + '              "ccc"\n' + '            ]'
          );
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte den Wert im Array ersetzen', () => {
      const filePath = testOptions.path + '/updateJsonArray/updateJsonArrReplaceValue.json';

      appTree.create(filePath, updateJsonArrReplaceValue);

      callRule(
        updateJsonArray(
          filePath,
          ['projects', 'lux-components', 'architect', 'build', 'options', 'assets'],
          'new',
          true,
          (node) => node.value === 'bbb'
        ),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain(
            '"assets": [\n' + '              "aaa",\n' + '              "new",\n' + '              "ccc"\n' + '            ]'
          );
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte das Object im Array ersetzen', () => {
      const filePath = testOptions.path + '/updateJsonArray/updateJsonArrReplaceObject.json';

      appTree.create(filePath, updateJsonArrReplaceObject);

      const newValue = {
        type: 'initial',
        maximumWarning: '1mb',
        maximumError: '2mb'
      };

      callRule(
        updateJsonArray(filePath, ['projects', 'lux-components', 'architect', 'build', 'options', 'budgets'], newValue, true, (node) =>
          findObjectPropertyInArray(node, 'type', 'initial')
        ),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain('"maximumWarning": "1mb"');
          expect(content).toContain('"maximumError": "2mb"');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte den neuen Wert im Array nur ersetzen, wenn der alte Wert vorhanden war', () => {
      const filePath = testOptions.path + '/updateJsonArray/updateJsonArrReplaceValue.json';

      appTree.create(filePath, updateJsonArrReplaceValue);

      callRule(
        updateJsonArray(
          filePath,
          ['projects', 'lux-components', 'architect', 'build', 'options', 'assets'],
          'new',
          true,
          (node) => node.value === 'notThere'
        ),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain(
            '"assets": [\n' + '              "aaa",\n' + '              "bbb",\n' + '              "ccc"\n' + '            ]'
          );
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('deleteJsonArr', () => {
    it('Sollte einen String-Wert aus einem Array löschen', () => {
      const filePath = testOptions.path + '/deleteJsonArray/deleteJsonArrayStringValue.json';

      appTree.create(filePath, deleteJsonArrayStringValue);

      callRule(
        deleteJsonArray(filePath, ['files'], (node) => findStringInArray(node, 'polyfills.ts')),
        appTree,
        context
      ).subscribe(
        (success: Tree) => {
          const content = success.read(filePath)?.toString();
          expect(content).toContain('  "files": [\n    "test.ts"\n  ],\n');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

const deleteJsonArrayStringValue = `{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/spec",
    "baseUrl": "./",
    "types": [
      "jasmine",
      "node"
    ]
  },
  "files": [
    "test.ts",
    "polyfills.ts"
  ],
  "include": [
    "**/*.spec.ts",
    "**/*.d.ts"
  ]
}`;

const updateJsonValueAdd = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "lux-components": {
      "root": "",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist",
            "i18nMissingTranslation": "error"
          }
        }
      }
    }
  }
}`;

const updateJsonValueReplace = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "lux-components": {
      "root": "",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist",
            "aaa": true,
            "i18nMissingTranslation": "error"
          }
        }
      }
    }
  }
}`;

const updateJsonArrNoArray = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "lux-components": {
      "root": "",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist",
            "i18nMissingTranslation": "error"
          }
        }
      }
    }
  }
}`;

const updateJsonArrEmptyArray = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "lux-components": {
      "root": "",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist",
            "assets": [],
            "i18nMissingTranslation": "error",
          }
        }
      }
    }
  }
}`;

const updateJsonArrAppendArray = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "lux-components": {
      "root": "",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist",
            "i18nMissingTranslation": "error",
            "assets": [
              "aaa",
              "bbb",
              "ccc"
            ],
          }
        }
      }
    }
  }
}`;

const updateJsonArrReplaceObject = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "lux-components": {
      "root": "",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist",
            "budgets": [
              {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
            ],
            "i18nMissingTranslation": "error",
          }
        }
      }
    }
  }
}
`;

const updateJsonArrReplaceValue = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "lux-components": {
      "root": "",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist",
            "assets": [
              "aaa",
              "bbb",
              "ccc"
            ],
            "i18nMissingTranslation": "error",
          }
        }
      }
    }
  }
}`;

const updateJsonArrDoubleEntry = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "lux-components": {
      "root": "",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist",
            "i18nMissingTranslation": "error",
            "assets": [
              "aaa",
              "bbb",
              "ccc"
            ],
          }
        }
      }
    }
  }
}`;
