import { callRule, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { replaceRule } from './files';
import {
  AddTransUnitItem,
  RemoveHtmlAttributeItem,
  RemoveHtmlTagAttributeItem,
  RemoveTransUnitItem,
  ReplaceHtmlAttributeItem,
  ReplaceHtmlTagAttributeItem,
  ReplaceItem
} from './replace-item';
import { appOptions, workspaceOptions } from './test';
import { UtilConfig } from './util';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('file', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: any;

  const testOptions: any = {};

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', collectionPath);

    appTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('replaceRule', () => {
    it('Sollte nur den ersten Treffer ersetzen (string)', (done) => {
      const filePath = testOptions.path + '/replaceRule/replaceStringAllFile.json';

      appTree.create(filePath, replaceStringAllFile);

      callRule(
        replaceRule(testOptions, 'startMsg', 'endMsg', 'replaceStringAllFile.json', new ReplaceItem('before', 'after', false)),
        appTree,
        context
      ).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).toContain(`"newProjectRoot": "after"`);
          expect(content).toContain(`"outputPath": "before",`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });

    it('Sollte nur den ersten Treffer ersetzen (RegExp)', (done) => {
      const filePath = testOptions.path + '/replaceRule/replaceStringAllFile.json';

      appTree.create(filePath, replaceStringAllFile);

      callRule(
        replaceRule(testOptions, 'startMsg', 'endMsg', 'replaceStringAllFile.json', new ReplaceItem(/before/m, 'after', false)),
        appTree,
        context
      ).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).toContain(`"newProjectRoot": "after"`);
          expect(content).toContain(`"outputPath": "before",`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });

    it('Sollte alle Treffer ersetzen (string)', (done) => {
      const filePath = testOptions.path + '/replaceRule/replaceStringAllFile.json';

      appTree.create(filePath, replaceStringAllFile);

      callRule(
        replaceRule(testOptions, 'startMsg', 'endMsg', 'replaceStringAllFile.json', new ReplaceItem('before', 'after', true)),
        appTree,
        context
      ).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).toContain(`"newProjectRoot": "after"`);
          expect(content).toContain(`"outputPath": "after",`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });

    it('Sollte alle Treffer ersetzen (RegExp)', (done) => {
      const filePath = testOptions.path + '/replaceRule/replaceStringAllFile.json';

      appTree.create(filePath, replaceStringAllFile);

      callRule(
        replaceRule(testOptions, 'startMsg', 'endMsg', 'replaceStringAllFile.json', new ReplaceItem(/before/gm, 'after', true)),
        appTree,
        context
      ).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).toContain(`"newProjectRoot": "after"`);
          expect(content).toContain(`"outputPath": "after",`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });

    it('Sollte alle HTML-Attribute ersetzen (RegExp)', (done) => {
      const filePath = testOptions.path + '/replaceRule/replaceHtmlAttribut.html';

      appTree.create(filePath, replaceHtmlAttribut);

      callRule(
        replaceRule(testOptions, 'startMsg', 'endMsg', 'replaceHtmlAttribut.html', new ReplaceHtmlAttributeItem('luxColor', '$1="color2"')),
        appTree,
        context
      ).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).not.toContain(`luxColor="color"`);
          expect(content).not.toContain(`[luxColor]="color"`);
          expect(content).not.toContain(`(luxColor)="color"`);
          expect(content).not.toContain(`[(luxColor)]="color"`);

          expect(content).toContain(`luxColor="color2"`);
          expect(content).toContain(`[luxColor]="color2"`);
          expect(content).toContain(`(luxColor)="color2"`);
          expect(content).toContain(`[(luxColor)]="color2"`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });

    it('Sollte alle HTML-Attribute entfernen (RegExp)', (done) => {
      const filePath = testOptions.path + '/replaceRule/replaceHtmlAttribut.html';

      appTree.create(filePath, replaceHtmlAttribut);

      callRule(
        replaceRule(testOptions, 'startMsg', 'endMsg', 'replaceHtmlAttribut.html', new RemoveHtmlAttributeItem('luxColor')),
        appTree,
        context
      ).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).not.toContain(`luxColor="color"`);
          expect(content).not.toContain(`[luxColor]="color"`);
          expect(content).not.toContain(`(luxColor)="color"`);
          expect(content).not.toContain(`[(luxColor)]="color"`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });

    it('Sollte alle HTML-Attribute eines speziellen Tags entfernen (RegExp)', (done) => {
      const filePath = testOptions.path + '/replaceRule/removeHtmlTagAttribut.html';

      appTree.create(filePath, removeHtmlTagAttribut);

      callRule(
        replaceRule(
          testOptions,
          'startMsg',
          'endMsg',
          'removeHtmlTagAttribut.html',
          new RemoveHtmlTagAttributeItem('lux-slider-ac', 'luxVertical')
        ),
        appTree,
        context
      ).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).toEqual(removeHtmlTagAttributResult);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });

    it('Sollte alle HTML-Attribute eines speziellen Tags ersetzen (RegExp)', (done) => {
      const filePath = testOptions.path + '/replaceRule/replaceHtmlTagAttribut.html';

      appTree.create(filePath, replaceHtmlTagAttribut);

      callRule(
        replaceRule(
          testOptions,
          'startMsg',
          'endMsg',
          'replaceHtmlTagAttribut.html',
          new ReplaceHtmlTagAttributeItem('lux-slider-ac', 'luxVertical', 'luxVertical2', 'color2')
        ),
        appTree,
        context
      ).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).toEqual(replaceHtmlTagAttributResult);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });

  it('Sollte eine TransUnit hinzufügen (RegExp)', (done) => {
    const filePath = testOptions.path + '/replaceRule/addTransUnitItem.html';

    appTree.create(filePath, transUnitItemHtml);

    const newTransUnit = `<trans-unit id="luxc.chips.remove" datatype="html">
        <source>entfernen</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-form/lux-chips-ac/lux-chips-ac.component.html</context>
          <context context-type="linenumber">1</context>
        </context-group>
      </trans-unit>`;

    callRule(
      replaceRule(
        testOptions,
        'startMsg',
        'endMsg',
        'addTransUnitItem.html',
        new AddTransUnitItem('luxc.message.btn.close.arialabel', newTransUnit)
      ),
      appTree,
      context
    ).subscribe({
      next: (successTree: Tree) => {
        const content = successTree.read(filePath)?.toString();
        expect(content).toContain(newTransUnit);
        expect(content).toContain('luxc.message.btn.close.arialabel');
        done();
      },
      error: (reason) => expect(reason).toBeUndefined()
    });
  });

  it('Sollte eine TransUnit löschen (RegExp)', (done) => {
    const filePath = testOptions.path + '/replaceRule/removeTransUnitItem.html';

    appTree.create(filePath, transUnitItemHtml);

    callRule(
      replaceRule(
        testOptions,
        'startMsg',
        'endMsg',
        'removeTransUnitItem.html',
        new RemoveTransUnitItem('luxc.message.btn.close.arialabel')
      ),
      appTree,
      context
    ).subscribe({
      next: (successTree: Tree) => {
        const content = successTree.read(filePath)?.toString();
        expect(content).not.toContain('luxc.message.btn.close.arialabel');

        done();
      },
      error: (reason) => expect(reason).toBeUndefined()
    });
  });
});

const transUnitItemHtml = `
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="de" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="luxc.menu.trigger.btn" datatype="html">
        <source>Menü</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-action/lux-menu/lux-menu.component.ts</context>
          <context context-type="linenumber">97</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.message.btn.close.arialabel" datatype="html">
        <source>Meldung schließen</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-common/lux-message-box/lux-message-box-subcomponents/lux-message.component.html</context>
          <context context-type="linenumber">1,2</context>
        </context-group>
      </trans-unit>
      <trans-unit id="luxc.message.container.arialabel" datatype="html">
        <source>Meldungen</source>
        <context-group purpose="location">
          <context context-type="sourcefile">projects/lux-components-lib/core/lib/lux-common/lux-message-box/lux-message-box.component.html</context>
          <context context-type="linenumber">1,3</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>

`;

const replaceStringAllFile = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "before",
  "projects": {
    "lux-components": {
      "root": "",
      "architect": {
        "build": {
          "options": {
            "outputPath": "before",
            "i18nMissingTranslation": "error"
          }
        }
      }
    }
  }
}`;

const replaceHtmlAttribut = `
<lux-slider-ac
  luxColor="color"
  [luxColor]="color"
  (luxColor)="color"
  [(luxColor)]="color"
  [luxDisabled]="disabled"
  luxColor ="color"
  [luxColor]= "color"
  (luxColor) = "color"
  [(luxColor)]="color"
  luxColor="color" [luxColor]="color" (luxColor)="color" [(luxColor)]="color">
</lux-slider-ac>
`;

const removeHtmlTagAttribut = `
<lux-select-ac
  [luxDisabled]="disabled"
  luxVertical="color"
  [luxVertical]="color"
  (luxVertical)="color"
  [(luxVertical)]="color"
  [luxDisabled]="disabled"
  luxVertical ="color"
  [luxVertical]= "color"
  (luxVertical) = "color"
  [(luxVertical)]="color"
  luxVertical="color" [luxVertical]="color" (luxVertical)="color" [(luxVertical)]="color">
</lux-select-ac>
<lux-slider-ac luxVertical ="color" aaa="bbb"></lux-slider-ac>
<lux-slider-ac [luxVertical] = "color" ></lux-slider-ac>
<lux-slider-ac aaa="bbb" (luxVertical)= "color"></lux-slider-ac>
<lux-slider-ac [(luxVertical)]="color"></lux-slider-ac>

<lux-slider-ac
luxVertical ="color"
aaa="bbb"></lux-slider-ac>
<lux-slider-ac
[luxVertical] = "color"
></lux-slider-ac>
<lux-slider-ac
aaa="bbb"
(luxVertical)= "color"
></lux-slider-ac>
<lux-slider-ac
[(luxVertical)]="color"
></lux-slider-ac>
<lux-select-ac
  luxVertical="color"
  [luxVertical]="color"
  (luxVertical)="color"
  [(luxVertical)]="color"
  [luxDisabled]="disabled"
  luxVertical ="color"
  [luxVertical]= "color"
  (luxVertical) = "color"
  [(luxVertical)]="color"
  luxVertical="color" [luxVertical]="color" (luxVertical)="color" [(luxVertical)]="color">
</lux-select-ac>
`;

const removeHtmlTagAttributResult = `
<lux-select-ac
  [luxDisabled]="disabled"
  luxVertical="color"
  [luxVertical]="color"
  (luxVertical)="color"
  [(luxVertical)]="color"
  [luxDisabled]="disabled"
  luxVertical ="color"
  [luxVertical]= "color"
  (luxVertical) = "color"
  [(luxVertical)]="color"
  luxVertical="color" [luxVertical]="color" (luxVertical)="color" [(luxVertical)]="color">
</lux-select-ac>
<lux-slider-ac  aaa="bbb"></lux-slider-ac>
<lux-slider-ac  ></lux-slider-ac>
<lux-slider-ac aaa="bbb" ></lux-slider-ac>
<lux-slider-ac ></lux-slider-ac>

<lux-slider-ac

aaa="bbb"></lux-slider-ac>
<lux-slider-ac

></lux-slider-ac>
<lux-slider-ac
aaa="bbb"

></lux-slider-ac>
<lux-slider-ac

></lux-slider-ac>
<lux-select-ac
  luxVertical="color"
  [luxVertical]="color"
  (luxVertical)="color"
  [(luxVertical)]="color"
  [luxDisabled]="disabled"
  luxVertical ="color"
  [luxVertical]= "color"
  (luxVertical) = "color"
  [(luxVertical)]="color"
  luxVertical="color" [luxVertical]="color" (luxVertical)="color" [(luxVertical)]="color">
</lux-select-ac>
`;

const replaceHtmlTagAttribut = `
<lux-select-ac
  luxVertical="color"
  [luxVertical]="color"
  (luxVertical)="color"
  [(luxVertical)]="color"
  [luxDisabled]="disabled"
  luxVertical ="color"
  [luxVertical]= "color"
  (luxVertical) = "color"
  [(luxVertical)]="color"
  luxVertical="color" [luxVertical]="color" (luxVertical)="color" [(luxVertical)]="color">
</lux-select-ac>
<lux-slider-ac luxVertical="color" aaa="bbb"></lux-slider-ac>
<lux-slider-ac [luxVertical]="color" ></lux-slider-ac>
<lux-slider-ac aaa="bbb" (luxVertical)="color"></lux-slider-ac>
<lux-slider-ac [(luxVertical)]="color"></lux-slider-ac>

<lux-slider-ac
luxVertical="color"
aaa="bbb"></lux-slider-ac>
<lux-slider-ac 
[luxVertical]="color"></lux-slider-ac>
<lux-slider-ac
aaa="bbb"
(luxVertical)="color"
></lux-slider-ac>
<lux-slider-ac
[(luxVertical)]="color"></lux-slider-ac>
<lux-select-ac
  luxVertical="color"
  [luxVertical]="color"
  (luxVertical)="color"
  [(luxVertical)]="color"
  [luxDisabled]="disabled"
  luxVertical ="color"
  [luxVertical]= "color"
  (luxVertical) = "color"
  [(luxVertical)]="color"
  luxVertical="color" [luxVertical]="color" (luxVertical)="color" [(luxVertical)]="color">
</lux-select-ac>
`;

const replaceHtmlTagAttributResult = `
<lux-select-ac
  luxVertical="color"
  [luxVertical]="color"
  (luxVertical)="color"
  [(luxVertical)]="color"
  [luxDisabled]="disabled"
  luxVertical ="color"
  [luxVertical]= "color"
  (luxVertical) = "color"
  [(luxVertical)]="color"
  luxVertical="color" [luxVertical]="color" (luxVertical)="color" [(luxVertical)]="color">
</lux-select-ac>
<lux-slider-ac luxVertical2="color2" aaa="bbb"></lux-slider-ac>
<lux-slider-ac [luxVertical2]="color2" ></lux-slider-ac>
<lux-slider-ac aaa="bbb" (luxVertical2)="color2"></lux-slider-ac>
<lux-slider-ac [(luxVertical2)]="color2"></lux-slider-ac>

<lux-slider-ac
luxVertical2="color2"
aaa="bbb"></lux-slider-ac>
<lux-slider-ac 
[luxVertical2]="color2"></lux-slider-ac>
<lux-slider-ac
aaa="bbb"
(luxVertical2)="color2"
></lux-slider-ac>
<lux-slider-ac
[(luxVertical2)]="color2"></lux-slider-ac>
<lux-select-ac
  luxVertical="color"
  [luxVertical]="color"
  (luxVertical)="color"
  [(luxVertical)]="color"
  [luxDisabled]="disabled"
  luxVertical ="color"
  [luxVertical]= "color"
  (luxVertical) = "color"
  [(luxVertical)]="color"
  luxVertical="color" [luxVertical]="color" (luxVertical)="color" [(luxVertical)]="color">
</lux-select-ac>
`;
