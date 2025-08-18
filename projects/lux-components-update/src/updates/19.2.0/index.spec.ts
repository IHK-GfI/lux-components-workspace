import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getPackageJsonDependency } from '../../utility/dependencies';
import * as files from '../../utility/files';
import * as logging from '../../utility/logging';
import { appOptions, workspaceOptions } from '../../utility/test';
import { UtilConfig } from '../../utility/util';
import { update190200 } from './index';

describe('update190200', () => {
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

    context = runner.engine.createContext(runner.engine.createSchematic('update-19.2.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] update190200', () => {
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
                "@ihk-gfi/lux-components": "19.1.0",
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

      callRule(update190200(testOptions), appTree, context).subscribe(
        (successTree) => {
          expect(getPackageJsonDependency(appTree, '@ihk-gfi/lux-components').version).not.toEqual('19.1.0');
          expect(getPackageJsonDependency(appTree, '@ihk-gfi/lux-components').version).toEqual('19.2.0');

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte eine Warnung ausgeben, wenn <lux-app-content> in app.component.html fehlt', (done) => {
      const htmlPath = `${testOptions.path}/src/app/app.component.html`;
      appTree.overwrite(htmlPath, `<div cdkScrollable>Kein lux-app-content vorhanden</div>`);

      const logWarnMock = spyOn(logging, 'logWarn');

      callRule(update190200(testOptions), appTree, context).subscribe(
        () => {
          expect(logWarnMock).toHaveBeenCalledTimes(1);
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte zwei Warnung ausgeben, wenn <lux-app-content> und cdkScrollable in app.component.html fehlen', (done) => {
      const htmlPath = `${testOptions.path}/src/app/app.component.html`;
      appTree.overwrite(htmlPath, `<div>Kein lux-app-content vorhanden</div>`);

      const logWarnMock = spyOn(logging, 'logWarn');

      callRule(update190200(testOptions), appTree, context).subscribe(
        () => {
          expect(logWarnMock).toHaveBeenCalledTimes(2);
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte cdkScrollable zu <lux-app-content> in app.component.html ergänzen', (done) => {
      const htmlPath = `${testOptions.path}/src/app/app.component.html`;
      appTree.overwrite(htmlPath, `<lux-app-content></lux-app-content>`);

      callRule(update190200(testOptions), appTree, context).subscribe(
        (successTree) => {
          const htmlContent = successTree.read(htmlPath)!.toString();
          expect(htmlContent).toContain('<lux-app-content cdkScrollable');
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte nichts verändern wenn cdkScrollable bereits vorhanden ist', (done) => {
      const htmlPath = `${testOptions.path}/src/app/app.component.html`;
      appTree.overwrite(htmlPath, `<lux-app-content cdkScrollable></lux-app-content>`);

      const replaceRuleMock = spyOn(files, 'replaceRule');
      const logWarnMock = spyOn(logging, 'logWarn');

      callRule(update190200(testOptions), appTree, context).subscribe(
        (successTree) => {
          const htmlContent = successTree.read(htmlPath)!.toString();
          expect(htmlContent).toContain('<lux-app-content cdkScrollable></lux-app-content>');
          expect(logWarnMock).toHaveBeenCalledTimes(0);
          expect(replaceRuleMock).toHaveBeenCalledTimes(0);
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});
