import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Options, updateStandAloneImports } from '.';
import { appOptions, workspaceOptions } from '../utility/test';
import { UtilConfig } from '../utility/util';

describe('updateStandAloneImports', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: Options = {
    path: '/',
    module: true
  };

  beforeEach(async () => {
    const collectionPath = path.join(__dirname, '../../collection.json');
    runner = new SchematicTestRunner('schematics', collectionPath);

    const collection = '@schematics/angular';
    appTree = await runner.runExternalSchematic(collection, 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic(collection, 'application', appOptions, appTree);

    context = runner.engine.createContext(
      runner.engine.createSchematic('update-standalone-imports', runner.engine.createCollection(collectionPath))
    );

    UtilConfig.defaultWaitMS = 0;

    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
  });

  describe('[Rule] updateStandAloneImports', () => {
    it('Sollte die Regel updateStandAloneimports ausführen', (done) => {

      callRule(updateStandAloneImports(testOptions), appTree, context).subscribe({
        next: (success) => {
          expect(success).toBeDefined();
          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });
});

