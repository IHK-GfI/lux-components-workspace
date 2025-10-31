import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getDep } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { UtilConfig } from '../../utility/util';
import { update190100 } from './index';

describe('update190100', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: any = {};

  beforeEach(async () => {
    const collectionPath = path.join(__dirname, '../../../collection.json');
    runner = new SchematicTestRunner('schematics', collectionPath);

    const collection = '@schematics/angular';
    appTree = await runner.runExternalSchematic(collection, 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic(collection, 'application', appOptions, appTree);

    context = runner.engine.createContext(runner.engine.createSchematic('update-19.1.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] update190100', () => {
    it('Sollte die Abhängigkeiten aktualisieren', (done) => {
      appTree.overwrite(
        '/package.json',
        `
            {
              "name": "Lorem ipsum",
              "version": "0.0.32",
              "scripts": {
                "build": "tsc -p tsconfig.json",
                "test": "npm run build && jasmine src/**/*_spec.js"
              },
              "dependencies": {
                "@angular/animations": "19.2.12",
                "@angular/cdk": "19.2.12",
                "@angular/common": "19.2.12",
                "@ihk-gfi/lux-components": "19.0.0",
                "@ihk-gfi/lux-components-theme": "19.0.0",
                "@angular/compiler": "19.2.12",
                "@ihk-gfi/lux-components-icons-and-fonts": "1.8.0"
              },
              "devDependencies": {
                "@angular-devkit/build-angular": "19.2.12",
                "@angular-eslint/builder": "19.3.1",
                "@angular/cli": "19.2.12",
              }
            }
        `
      );

      callRule(update190100(testOptions), appTree, context).subscribe(
        (successTree) => {
          expect(getDep(appTree, '@ihk-gfi/lux-components').version).not.toEqual('19.0.0');
          expect(getDep(appTree, '@ihk-gfi/lux-components').version).toEqual('19.1.0');

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});
