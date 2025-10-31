import { callRule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { updatePackageJson } from '.';
import { getDep } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { UtilConfig } from '../../utility/util';

describe('update200000', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: { project: string; path: string; verbose: boolean } = {
    project: '',
    path: '/',
    verbose: false
  };

  beforeEach(async () => {
    const collectionPath = path.join(__dirname, '../../../collection.json');
    runner = new SchematicTestRunner('schematics', collectionPath);

    const collection = '@schematics/angular';
    appTree = await runner.runExternalSchematic(collection, 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic(collection, 'application', appOptions, appTree);

    context = runner.engine.createContext(runner.engine.createSchematic('update-20.0.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] updatePackageJson', () => {
    it('Sollte die Abhängigkeiten aktualisieren', (done) => {
      appTree.overwrite('/package.json', packageJson01);

      callRule(updatePackageJson(testOptions), appTree, context).subscribe({
        next: (successTree: Tree) => {
          expect(getDep(successTree, '@ihk-gfi/lux-components').version).not.toEqual('19.4.0');
          expect(getDep(successTree, '@ihk-gfi/lux-components').version).toEqual('20.0.0');

          expect(getDep(successTree, '@ihk-gfi/lux-components-theme').version).not.toEqual('19.2.0');
          expect(getDep(successTree, '@ihk-gfi/lux-components-theme').version).toEqual('20.0.0');

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });
});

const packageJson01 = `
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
                "@angular/core": "19.2.12",
                "@ihk-gfi/lux-components": "19.4.0",
                "@ihk-gfi/lux-components-theme": "19.2.0",
                "@ihk-gfi/lux-components-icons-and-fonts": "1.10.0",
                "@angular/compiler": "19.2.12"
              },
              "devDependencies": {
                "@angular-devkit/build-angular": "19.2.12",
                "@angular-eslint/builder": "19.2.12"
              }
            }
        `;
