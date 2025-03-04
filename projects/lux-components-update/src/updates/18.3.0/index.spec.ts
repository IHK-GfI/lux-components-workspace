import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { of as observableOf } from 'rxjs';
import { getPackageJsonDependency } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { UtilConfig } from '../../utility/util';
import { update180300 } from './index';

describe('update180300', () => {
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

    context = runner.engine.createContext(runner.engine.createSchematic('update-18.3.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] update180300', () => {
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
                "@angular/animations": "18.2.12",
                "@angular/cdk": "18.2.12",
                "@angular/common": "18.2.12",
                "@ihk-gfi/lux-components": "18.2.0",
                "@ihk-gfi/lux-components-theme": "18.2.0",
                "@angular/compiler": "18.2.12",
                "@ihk-gfi/lux-components-icons-and-fonts": "1.8.0"
              },
              "devDependencies": {
                "@angular-devkit/build-angular": "18.2.12",
                "@angular-eslint/builder": "18.3.1",
                "@angular/cli": "18.2.12",
              }
            }
        `
      );

      callRule(update180300(testOptions), observableOf(appTree), context).subscribe(
        () => {
          expect(getPackageJsonDependency(appTree, '@ihk-gfi/lux-components').version).not.toEqual('18.2.0');
          expect(getPackageJsonDependency(appTree, '@ihk-gfi/lux-components').version).toEqual('18.3.0');

          expect(getPackageJsonDependency(appTree, '@ihk-gfi/lux-components-theme').version).not.toEqual('18.2.0');
          expect(getPackageJsonDependency(appTree, '@ihk-gfi/lux-components-theme').version).toEqual('18.3.0');

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});
