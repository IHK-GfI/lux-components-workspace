import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getDep } from '../../utility/dependencies';
import * as files from '../../utility/files';
import * as logging from '../../utility/logging';
import { appOptions, workspaceOptions } from '../../utility/test';
import { UtilConfig } from '../../utility/util';
import { update190200 } from './index';
import { lastValueFrom } from 'rxjs';

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
    it('Sollte die Abhängigkeiten aktualisieren', async () => {
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

      const successTree = await lastValueFrom(callRule(update190200(testOptions), appTree, context));
      expect(getDep(appTree, '@ihk-gfi/lux-components').version).not.toEqual('19.1.0');
      expect(getDep(appTree, '@ihk-gfi/lux-components').version).toEqual('19.2.0');

      expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).not.toEqual('19.0.0');
      expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).toEqual('19.0.1');
    });

    it('Sollte eine Warnung ausgeben, wenn <lux-app-content> in app.component.html fehlt', async () => {
      const htmlPath = `${testOptions.path}/src/app/app.component.html`;
      const newContent = `<div cdkScrollable>Kein lux-app-content vorhanden</div>`;
      if (appTree.exists(htmlPath)) {
        appTree.overwrite(htmlPath, newContent);
      } else {
        appTree.create(htmlPath, newContent);
      }

      const logWarnMock = vi.spyOn(logging, 'logWarn').mockImplementation(() => undefined);

      await lastValueFrom(callRule(update190200(testOptions), appTree, context));
      expect(logWarnMock).toHaveBeenCalledTimes(1);
    });

    it('Sollte zwei Warnung ausgeben, wenn <lux-app-content> und cdkScrollable in app.component.html fehlen', async () => {
      const htmlPath = `${testOptions.path}/src/app/app.component.html`;
      const newContent = `<div>Kein lux-app-content vorhanden</div>`;
      if (appTree.exists(htmlPath)) {
        appTree.overwrite(htmlPath, newContent);
      } else {
        appTree.create(htmlPath, newContent);
      }

      const logWarnMock = vi.spyOn(logging, 'logWarn').mockImplementation(() => undefined);

      await lastValueFrom(callRule(update190200(testOptions), appTree, context));
      expect(logWarnMock).toHaveBeenCalledTimes(2);
    });

    it('Sollte cdkScrollable zu <lux-app-content> in app.component.html ergänzen', async () => {
      const htmlPath = `${testOptions.path}/src/app/app.component.html`;
      const htmlNewContent = `<lux-app-content></lux-app-content>`;
      if (appTree.exists(htmlPath)) {
        appTree.overwrite(htmlPath, htmlNewContent);
      } else {
        appTree.create(htmlPath, htmlNewContent);
      }

      const tsPath = `${testOptions.path}/src/app/app.component.ts`;
      const tsNewContent = `@Component({
  selector: 'app-root',
  imports: [
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}`;
      if (appTree.exists(tsPath)) {
        appTree.overwrite(tsPath, tsNewContent);
      } else {
        appTree.create(tsPath, tsNewContent);
      }

      const successTree = await lastValueFrom(callRule(update190200(testOptions), appTree, context));
      const htmlContent = successTree.read(htmlPath)!.toString();
      expect(htmlContent).toContain('<lux-app-content cdkScrollable');
    });

    it('Sollte nichts verändern wenn cdkScrollable bereits vorhanden ist', async () => {
      const htmlPath = `${testOptions.path}/src/app/app.component.html`;
      const newContent = `<lux-app-content cdkScrollable></lux-app-content>`;
      if (appTree.exists(htmlPath)) {
        appTree.overwrite(htmlPath, newContent);
      } else {
        appTree.create(htmlPath, newContent);
      }

      const replaceRuleMock = vi.spyOn(files, 'replaceRule').mockImplementation(() => (tree) => tree);
      const logWarnMock = vi.spyOn(logging, 'logWarn').mockImplementation(() => undefined);

      const successTree = await lastValueFrom(callRule(update190200(testOptions), appTree, context));
      const htmlContent = successTree.read(htmlPath)!.toString();
      expect(htmlContent).toContain('<lux-app-content cdkScrollable></lux-app-content>');
      expect(logWarnMock).toHaveBeenCalledTimes(0);
      expect(replaceRuleMock).toHaveBeenCalledTimes(0);
    });
  });
});
