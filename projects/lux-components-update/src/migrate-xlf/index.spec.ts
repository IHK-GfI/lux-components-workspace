import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test';
import { UtilConfig } from '../utility/util';
import { migrateXlf, Options } from './index';

describe('migrateXlf', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: Options = {
    project: '',
    path: '/',
    namespace: false,
    verbose: false
  };

  beforeEach(async () => {
    const collectionPath = path.join(__dirname, '../../collection.json');
    runner = new SchematicTestRunner('schematics', collectionPath);

    const collection = '@schematics/angular';
    appTree = await runner.runExternalSchematic(collection, 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic(collection, 'application', appOptions, appTree);

    context = runner.engine.createContext(runner.engine.createSchematic('migrate-xlf', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.namespace = false;
    testOptions.verbose = true;
  });

  describe('[Rule] migrateXlf', () => {
    it('Sollte die englische Übersetzungen aktualisieren', (done) => {
      const filePathDe = (testOptions.path ?? '') + '/src/locale/messages.xlf';
      const filePathEn = (testOptions.path ?? '') + '/src/locale/messages.en.xlf';

      appTree.create(filePathDe, xlfDe);
      appTree.create(filePathEn, xlfEn);

      callRule(migrateXlf(testOptions), appTree, context).subscribe({
        next: (success) => {
          const contentDe = success.read((testOptions.path ?? '') + '/src/locale/de.json')?.toString()?.replace(/\s/g, '');
          expect(contentDe).toEqual(jsonDe.replace(/\s/g, ''));

          const contentEn = success.read((testOptions.path ?? '') + '/src/locale/en.json')?.toString()?.replace(/\s/g, '');
          expect(contentEn).toEqual(jsonEn.replace(/\s/g, ''));

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });
});

const xlfDe = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="de" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="luxc.title" datatype="html">
        <source>Meine App</source>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
      <trans-unit id="app.title" datatype="html">
        <source>Meine App</source>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
      <trans-unit id="app.home.title" datatype="html">
        <source>Startseite</source>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-stammdaten/lux-stammdaten-kontakt/lux-stammdaten-kontakt.component.ts</context>
          <context context-type="linenumber">42</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

const jsonDe = `{
      "app.home.title": "Startseite",
      "app.title": "Meine App"
    }
`;

const xlfEn = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="de" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="luxc.title" datatype="html">
        <source>Meine App</source>
        <target>My App</target>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
      <trans-unit id="app.title" datatype="html">
        <source>Meine App</source>
        <target>My App</target>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
      <trans-unit id="app.home.title" datatype="html">
        <source>Startseite</source>
        <target>Home</target>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-stammdaten/lux-stammdaten-kontakt/lux-stammdaten-kontakt.component.ts</context>
          <context context-type="linenumber">42</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

const jsonEn = `{
      "app.home.title": "Home",
      "app.title": "My App"
    }
`;
