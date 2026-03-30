import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getDep } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { Options } from '../../utility/types';
import { UtilConfig } from '../../utility/util';
import { update210300, updateIcons } from './index';

describe('update210300', () => {
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

    context = runner.engine.createContext(runner.engine.createSchematic('update-21.3.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] update210300', () => {
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

      callRule(update210300(testOptions), appTree, context).subscribe(
        () => {
          expect(getDep(appTree, '@ihk-gfi/lux-components').version).not.toEqual('20.0.0');
          expect(getDep(appTree, '@ihk-gfi/lux-components').version).toEqual('21.3.0');

          expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).not.toEqual('20.0.0');
          expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).toEqual('21.3.0');

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('[Rule] updateIcons', () => {
    it('Sollte icons-and-fonts Pfad in styles.scss, app.config.ts und app.module.ts ersetzen', (done) => {
      const oldPath = `icons-and-fonts/v1.10.0`;
      const newPath = `icons-and-fonts/v1.11.0`;

      const stylesPath = testOptions.path + '/src/updateIcons/styles.scss';
      const appConfigPath = testOptions.path + '/src/updateIcons/app.config.ts';
      const appModulePath = testOptions.path + '/src/updateIcons/app.module.ts';

      appTree.create(stylesPath, stylesScssContent);
      appTree.create(appConfigPath, appConfigContent);
      appTree.create(appModulePath, appModuleContent);

      callRule(updateIcons(testOptions), appTree, context).subscribe(
        () => {
          const s = appTree.readContent(stylesPath);
          const c = appTree.readContent(appConfigPath);
          const m = appTree.readContent(appModulePath);

          expect(s).toContain(newPath);
          expect(s).not.toContain(oldPath);

          expect(c).toContain(newPath);
          expect(c).not.toContain(oldPath);

          expect(m).toContain(newPath);
          expect(m).not.toContain(oldPath);

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

const stylesScssContent = `/* You can add global styles to this file, and also import other style files */
@use "@ihk-gfi/lux-components-theme/src/base-templates/common/luxfonts" as luxfonts;

$basepath: "https://cdn.gfi.ihk.de/lux-components/icons-and-fonts/v1.10.0/";

@include luxfonts.web-fonts($basepath);`;

const appConfigContent = `const myConfiguration: LuxComponentsConfigParameters = {
  generateLuxTagIds: environment.generateLuxTagIds,
  iconBasePath: 'https://cdn.gfi.ihk.de/lux-components/icons-and-fonts/v1.10.0/',
  labelConfiguration: {
    allUppercase: false,
    notAppliedTo: ['lux-link', 'lux-menu-item', 'lux-side-nav-item', 'lux-tab', 'lux-step']
  },
  sessionTimerConfig: {
    url: '/session'
  }
};`;

const appModuleContent = `const luxComponentsConfig: LuxComponentsConfigParameters = {
  iconBasePath: 'https://cdn.gfi.ihk.de/lux-components/icons-and-fonts/v1.10.0/',
  generateLuxTagIds: environment.generateLuxTagIds,
  displayLuxConsoleLogs: true
};`;
