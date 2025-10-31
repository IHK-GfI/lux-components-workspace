import { callRule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { updateDependencies } from '../../update-dependencies';
import { getDep } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { UtilConfig } from '../../utility/util';
import { updatePackageJson } from './index';

describe('update190000', () => {
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

    context = runner.engine.createContext(runner.engine.createSchematic('update-19.0.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] updateDependencies', () => {
    it('Sollte die Abhängigkeiten aktualisieren', (done) => {
      appTree.overwrite('/package.json', packageJson01);

      callRule(updateDependencies(), appTree, context).subscribe({
        next: (successTree: Tree) => {
          expect(getDep(successTree, '@ihk-gfi/lux-components').version).not.toEqual('18.5.0');
          expect(getDep(successTree, '@ihk-gfi/lux-components').version).toEqual('19.0.0');

          expect(getDep(successTree, '@ihk-gfi/lux-components-theme').version).not.toEqual('18.5.0');
          expect(getDep(successTree, '@ihk-gfi/lux-components-theme').version).toEqual('19.0.0');

          expect(getDep(successTree, '@angular/core').version).not.toEqual('18.2.12');
          expect(getDep(successTree, '@angular/core').version).toEqual('^19.2.4');

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });

  describe('[Rule] updatePackageJson', () => {
    it('Sollte die package.json anpassen', (done) => {
      const filePath = testOptions.path + '/package.json';

      appTree.create(filePath, packageJson02);

      callRule(updatePackageJson(testOptions), appTree, context).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();

          expect(content).not.toContain(`"start": "ng serve --public-host=http://localhost:4200",`);
          expect(content).toContain(`"start": "ng serve --no-hmr",`);

          expect(content).not.toContain(
            `"build-aot": "node --max_old_space_size=4024 ./node_modules/@angular/cli/bin/ng build --aot --single-bundle --output-hashing none && npm run move-de-files",`
          );
          expect(content).toContain(
            `"build-aot": "node --max_old_space_size=4024 ./node_modules/@angular/cli/bin/ng build --aot --output-hashing none && npm run move-de-files",`
          );

          expect(content).not.toContain(
            `"buildzentral": "node --max_old_space_size=4024 ./node_modules/@angular/cli/bin/ng build --configuration production --single-bundle --output-hashing none && npm run move-de-files",`
          );
          expect(content).toContain(
            `"buildzentral": "node --max_old_space_size=4024 ./node_modules/@angular/cli/bin/ng build --configuration production --output-hashing none && npm run move-de-files",`
          );

          expect(content).not.toContain(`"start-en": "ng serve --public-host=http://localhost:4200 --configuration en"`);
          expect(content).toContain(`"start-en": "ng serve --configuration en --no-hmr"`);

          expect(content).not.toContain(`"test_no_sm": "ng test --no-sourceMap",`);

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
                "@angular/animations": "18.2.12",
                "@angular/cdk": "18.2.12",
                "@angular/core": "18.2.12",
                "@ihk-gfi/lux-components": "18.5.0",
                "@ihk-gfi/lux-components-theme": "18.3.0",
                "@ihk-gfi/lux-components-icons-and-fonts": "1.8.0",
                "@angular/compiler": "18.2.12"
              },
              "devDependencies": {
                "@angular-devkit/build-angular": "18.2.12",
                "@angular-eslint/builder": "18.2.12"
              }
            }
        `;

const packageJson02 = `{
  "name": "PART",
  "version": "0.0.1",
  "license": "MIT",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --public-host=http://localhost:4200",
    "build": "node --max_old_space_size=4024 ./node_modules/@angular/cli/bin/ng build --source-map",
    "build-aot": "node --max_old_space_size=4024 ./node_modules/@angular/cli/bin/ng build --aot --single-bundle --output-hashing none && npm run move-de-files",
    "buildzentral": "node --max_old_space_size=4024 ./node_modules/@angular/cli/bin/ng build --configuration production --single-bundle --output-hashing none && npm run move-de-files",
    "test_no_sm": "ng test --no-sourceMap",
    "start-en": "ng serve --public-host=http://localhost:4200 --configuration en"
  }
}`;
