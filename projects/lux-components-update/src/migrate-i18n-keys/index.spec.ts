import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test';
import { UtilConfig } from '../utility/util';
import { migrateI18nKeys, Options } from './index';

describe('migrateI18nKeys', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: Options = {
    project: '',
    path: '/',
    verbose: false
  };

  beforeEach(async () => {
    const collectionPath = path.join(__dirname, '../../collection.json');
    runner = new SchematicTestRunner('schematics', collectionPath);

    const collection = '@schematics/angular';
    appTree = await runner.runExternalSchematic(collection, 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic(collection, 'application', appOptions, appTree);

    context = runner.engine.createContext(runner.engine.createSchematic('migrate-i18n-keys', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] migrateI18nKeys', () => {
    it('Sollte den I18N-Tag in HTML-Dateien migrieren', (done) => {
      const fileHtml01 = (testOptions.path ?? '') + '/src/app/html01.html';
      
      appTree.create(fileHtml01, html01);

      callRule(migrateI18nKeys(testOptions), appTree, context).subscribe({
        next: (success) => {
          const contentHtml01 = success.read(fileHtml01)?.toString();
          expect(contentHtml01).toEqual(html01Expected);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });

    it('Sollte das I18N-Attribut in HTML-Dateien migrieren', (done) => {
      const fileHtml02 = (testOptions.path ?? '') + '/src/app/html02.html';
      
      appTree.create(fileHtml02, html02);

      callRule(migrateI18nKeys(testOptions), appTree, context).subscribe({
        next: (success) => {
          const contentHtml02 = success.read(fileHtml02)?.toString();
          expect(contentHtml02).toEqual(html02Expected);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });
});

const html01 = `<div">
  <span i18n="@@app.title">Partnerportal {{ suffix }}</span>
  </div>`;

const html01Expected = `<div">
  <span>{{ 'app.title' | transloco }}</span>
  </div>`;

const html02 = `<div>
  <span id="Partnerportal {{ suffix }}" i18n-id="@@app.title2">Test Attribut</span>
  </div>`;

const html02Expected = `<div>
  <span id="{{ 'app.title2' | transloco }}">Test Attribut</span>
  </div>`;
