import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getDep } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { Options } from '../../utility/types';
import { UtilConfig } from '../../utility/util';
import { update210200 } from './index';

describe('update210200', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: Options = { project: '', path: '', verbose: false };

  beforeEach(async () => {
    const collectionPath = path.join(__dirname, '../../../collection.json');
    runner = new SchematicTestRunner('schematics', collectionPath);

    const collection = '@schematics/angular';
    appTree = await runner.runExternalSchematic(collection, 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic(collection, 'application', appOptions, appTree);

    context = runner.engine.createContext(runner.engine.createSchematic('update-21.2.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] update210200', () => {
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
                "@angular/animations": "^21.0.0",
                "@angular/cdk": "^21.0.0",
                "@angular/common": "^21.0.0",
                "@ihk-gfi/lux-components": "21.0.0",
                "@ihk-gfi/lux-components-theme": "21.0.0",
                "@angular/compiler": "^21.0.0",
                "@ihk-gfi/lux-components-icons-and-fonts": "1.10.0"
              },
              "devDependencies": {
                "@angular-devkit/build-angular": "^21.0.0",
                "@angular-eslint/builder": "^21.0.0",
                "@angular/cli": "^21.0.0",
              }
            }
        `
      );

      callRule(update210200(testOptions), appTree, context).subscribe(
        () => {
          expect(getDep(appTree, '@ihk-gfi/lux-components').version).not.toEqual('20.0.0');
          expect(getDep(appTree, '@ihk-gfi/lux-components').version).toEqual('21.2.0');

          expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).not.toEqual('20.0.0');
          expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).toEqual('21.2.0');

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});
