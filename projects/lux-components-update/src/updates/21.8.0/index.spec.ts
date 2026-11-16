import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { lastValueFrom } from 'rxjs';
import { getDep } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { Options } from '../../utility/types';
import { UtilConfig } from '../../utility/util';
import { update210800, updateTestUtilsImports } from './index';

describe('update210800', () => {
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

    context = runner.engine.createContext(runner.engine.createSchematic('update-21.8.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] update210800', () => {
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
                "@angular/animations": "^21.0.0",
                "@angular/cdk": "^21.0.0",
                "@angular/common": "^21.0.0",
                "@ihk-gfi/lux-components": "21.7.0",
                "@ihk-gfi/lux-components-theme": "21.7.0",
                "@angular/compiler": "^21.0.0",
                "@ihk-gfi/lux-components-icons-and-fonts": "1.11.0"
              },
              "devDependencies": {
                "@angular-devkit/build-angular": "^21.0.0",
                "@angular-eslint/builder": "^21.0.0",
                "@angular/cli": "^21.0.0",
              }
            }
        `
      );

      await lastValueFrom(callRule(update210800(testOptions), appTree, context));
      expect(getDep(appTree, '@ihk-gfi/lux-components').version).not.toEqual('21.7.0');
      expect(getDep(appTree, '@ihk-gfi/lux-components').version).toEqual('21.8.0');

      expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).not.toEqual('21.7.0');
      expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).toEqual('21.8.0');
    });
  });

  describe('[Rule] updateTestUtilsImports', () => {
    it('Sollte "LuxTestHelper" und "LuxOverlayHelper" auf den Entry Point "test-utils" umstellen und andere Imports unangetastet lassen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.spec.ts';

      appTree.create(
        filePath,
        `
import { LuxButtonComponent, LuxOverlayHelper, LuxTestHelper } from '@ihk-gfi/lux-components';

describe('TestComponent', () => {
  it('sollte funktionieren', () => {
    LuxTestHelper.wait(null as any);
    const helper = new LuxOverlayHelper();
  });
});
        `
      );

      await lastValueFrom(callRule(updateTestUtilsImports(testOptions), appTree, context));
      const content = appTree.read(filePath)?.toString() ?? '';

      expect(content).toContain(`import { LuxTestHelper, LuxOverlayHelper } from '@ihk-gfi/lux-components/test-utils';`);
      expect(content).toContain(`import { LuxButtonComponent } from '@ihk-gfi/lux-components';`);
      expect(content).not.toContain(`LuxTestHelper } from '@ihk-gfi/lux-components';`);
    });

    it('Sollte eine Datei ohne "LuxTestHelper"/"LuxOverlayHelper" unverändert lassen', async () => {
      const filePath = testOptions.path + '/src/app/untouched.component.spec.ts';

      const originalContent = `
import { LuxButtonComponent } from '@ihk-gfi/lux-components';

export class UntouchedComponent {}
        `;

      appTree.create(filePath, originalContent);

      await lastValueFrom(callRule(updateTestUtilsImports(testOptions), appTree, context));
      expect(appTree.read(filePath)?.toString()).toEqual(originalContent);
    });
  });
});
