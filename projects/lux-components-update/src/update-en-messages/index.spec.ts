import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { of as observableOf } from 'rxjs';
import { appOptions, workspaceOptions } from '../utility/test';
import { UtilConfig } from '../utility/util';
import { updateEnMessages } from './index';

describe('updateEnMessages', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: { project: string; path: string; verbose: boolean } = {
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

    context = runner.engine.createContext(
      runner.engine.createSchematic('update-en-messages', runner.engine.createCollection(collectionPath))
    );

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] updateEnMessages', () => {
    it('Sollte die englische Übersetzungen aktualisieren', (done) => {
      const filePathDe = '/src/locale/messages.xlf';
      const filePathEn = '/src/locale/messages.en.xlf';

      appTree.create(filePathDe, i18nDeApp);
      appTree.create(filePathEn, i18nEnApp);

      const filePathLCEn = '/node_modules/@ihk-gfi/lux-components/src/locale/messages.en.xlf';
      const filePathSDEn = '/node_modules/@ihk-gfi/lux-stammdaten/src/locale/messages.en.xlf';

      appTree.create(filePathLCEn, i18nEnLuxC);
      appTree.create(filePathSDEn, i18nEnStamm);

      callRule(updateEnMessages(), observableOf(appTree), context).subscribe({
        next: (success) => {
          expect(success.exists(filePathDe)).toBeTrue();
          expect(success.exists(filePathEn)).toBeTrue();
          expect(success.exists(filePathLCEn)).toBeTrue();
          expect(success.exists(filePathSDEn)).toBeTrue();

          expect(success.read(filePathEn)?.toString()).toEqual(i18nEnAppResult);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });
});

const i18nDeApp = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="de" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="luxc.menu.trigger.btn" datatype="html">
        <source>Menü</source>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxsd.contact.email" datatype="html">
        <source>E-Mail</source>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-stammdaten/lux-stammdaten-kontakt/lux-stammdaten-kontakt.component.ts</context>
          <context context-type="linenumber">42</context>
        </context-group>
      </trans-unit>
      <trans-unit id="test.001" datatype="html">
        <source>test 001 De</source>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

const i18nEnApp = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="test.001" datatype="html">
        <source>test 001 De</source>
        <target>test 001 En</target>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

const i18nEnStamm = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="luxsd.contact.email" datatype="html">
        <source>E-Mail</source>
        <target>E-mail</target>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-stammdaten/lux-stammdaten-kontakt/lux-stammdaten-kontakt.component.ts</context>
          <context context-type="linenumber">42</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

const i18nEnLuxC = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="luxc.menu.trigger.btn" datatype="html">
        <source>Menü</source>
        <target>Menu</target>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

const i18nEnAppResult = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="luxc.menu.trigger.btn" datatype="html">
        <source>Menü</source>
        <target>Menu</target>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxsd.contact.email" datatype="html">
        <source>E-Mail</source>
        <target>E-mail</target>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/modules/lux-stammdaten/lux-stammdaten-kontakt/lux-stammdaten-kontakt.component.ts</context>
          <context context-type="linenumber">42</context>
        </context-group>
      </trans-unit>
      <trans-unit id="test.001" datatype="html">
        <source>test 001 De</source>
        <target>test 001 En</target>
        <context-group purpose="location">
          <context context-type="sourcefile">node_modules/@ihk-gfi/src/app/modules/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">64</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;
