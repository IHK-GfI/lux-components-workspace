import { callRule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { of as observableOf } from 'rxjs';
import { updateDependencies } from '../../update-dependencies';
import { getPackageJsonDependency } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { UtilConfig } from '../../utility/util';
import { updateAngularJson, updateChips, updateFormControls, updateSlider, updateStylesCss, updateStylesScss, updateTabs } from './index';

describe('update180000', () => {
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

    context = runner.engine.createContext(runner.engine.createSchematic('update-18.0.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] updateDependencies', () => {
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
                "@angular/animations": "16.2.12",
                "@angular/cdk": "16.2.12",
                "@angular/common": "16.2.12",
                "@ihk-gfi/lux-components": "16.5.0",
                "@ihk-gfi/lux-components-theme": "16.3.0",
                "@ihk-gfi/lux-components-icons-and-fonts": "1.8.0",
                "@angular/compiler": "16.2.12"
              },
              "devDependencies": {
                "@angular-devkit/build-angular": "16.2.12",
                "@angular-eslint/builder": "16.2.12"
              }
            }
        `
      );

      callRule(updateDependencies(), observableOf(appTree), context).subscribe({
        next: (successTree: Tree) => {
          expect(getPackageJsonDependency(successTree, '@ihk-gfi/lux-components').version).not.toEqual('16.5.0');
          expect(getPackageJsonDependency(successTree, '@ihk-gfi/lux-components').version).toEqual('18.0.0');

          expect(getPackageJsonDependency(successTree, '@ihk-gfi/lux-components-theme').version).not.toEqual('16.5.0');
          expect(getPackageJsonDependency(successTree, '@ihk-gfi/lux-components-theme').version).toEqual('18.0.0');

          expect(getPackageJsonDependency(successTree, '@angular/common').version).not.toEqual('16.2.12');
          expect(getPackageJsonDependency(successTree, '@angular/common').version).toEqual('^18.2.6');

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });

  describe('[Rule] updateAngularJson', () => {
    it('Sollte die angular.json anpassen', (done) => {
      const filePath = testOptions.path + '/angular.json';

      appTree.create(filePath, angularJson01);

      callRule(updateAngularJson(testOptions), observableOf(appTree), context).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();

          expect(content).not.toContain('browserTarget');
          expect(content).toContain(`"buildTarget": "lux-components:build"`);
          expect(content).toContain(`"buildTarget": "lux-components:build:production"`);
          expect(content).toContain(`"buildTarget": "lux-components:build:development"`);
          expect(content).toContain(`"buildTarget": "lux-components:build:en"`);
          expect(content).toContain(`"buildTarget": "lux-components:build:en"`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });

  describe('[Rule] updateFormControls', () => {
    it('Sollte die FormControls anpassen', (done) => {
      const filePath = testOptions.path + '/form-controls.html';

      appTree.create(filePath, formControlsHtml);

      callRule(updateFormControls(testOptions), observableOf(appTree), context).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).not.toContain(`luxOptionMultiline`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });

  describe('[Rule] updateTabs', () => {
    it('Sollte die Tabs anpassen', (done) => {
      const filePath = testOptions.path + '/tabs.html';

      appTree.create(filePath, tabsHtml);

      callRule(updateTabs(testOptions), observableOf(appTree), context).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();
          expect(content).not.toContain(`luxTabAnimationActive`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });

  describe('[Rule] updateChips', () => {
    it('Sollte die Chips anpassen', (done) => {
      const filePath = testOptions.path + '/chips.html';

      appTree.create(filePath, chipsHtml);

      callRule(updateChips(testOptions), observableOf(appTree), context).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();

          expect(content).not.toContain(`luxMultiple`);
          expect(content).not.toContain(`luxSelected`);
          expect(content).not.toContain(`luxChipSelected`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });

  describe('[Rule] updateSlider', () => {
    it('Sollte die Slider anpassen', (done) => {
      const filePath = testOptions.path + '/slider.html';

      appTree.create(filePath, sliderHtml);

      callRule(updateSlider(testOptions), observableOf(appTree), context).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();

          expect(content).not.toContain(`luxShowThumbLabelAlways`);
          expect(content).not.toContain(`luxVertical`);
          expect(content).not.toContain(`luxInvert`);
          expect(content).not.toContain(`luxTickInterval`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });

  describe('[Rule] updateStylesScss', () => {
    it('Sollte die styles.scss anpassen', (done) => {
      const filePath = testOptions.path + '/styles.scss';

      appTree.create(filePath, styleScss01);

      callRule(updateStylesScss(testOptions), observableOf(appTree), context).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();

          expect(content).not.toContain(`@import '@ihk-gfi/lux-components-theme/src/base/luxfonts';`);
          expect(content).toContain(`@import '../node_modules/@ihk-gfi/lux-components-theme/src/base/luxfonts';`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });

  describe('[Rule] updateStylesCss', () => {
    it('Sollte die styles.css anpassen', (done) => {
      const filePath = testOptions.path + '/styles.css';

      appTree.create(filePath, styleScss01);

      callRule(updateStylesCss(testOptions), observableOf(appTree), context).subscribe({
        next: (successTree: Tree) => {
          const content = successTree.read(filePath)?.toString();

          expect(content).not.toContain(`@import '@ihk-gfi/lux-components-theme/src/base/luxfonts';`);
          expect(content).toContain(`@import '../node_modules/@ihk-gfi/lux-components-theme/src/base/luxfonts';`);

          done();
        },
        error: (reason) => expect(reason).toBeUndefined()
      });
    });
  });
});

const sliderHtml = `
<div [formGroup]="formGroup" *ngIf="formGroup">
  <lux-slider-ac
    [luxColor]="color"
    [luxVertical]="vertical"
    [luxInvert]="invert"
    [luxShowThumbLabel]="showThumbLabel"
    [luxTickInterval]="tickInterval"
    [luxMax]="max"
    [luxMin]="min"
    luxShowThumbLabelAlways="true"
    [luxStep]="step"
    (luxValuePercent)="percent = $event"
    luxControlBinding="slider"
    luxTagId="sliderform"
  >
  </lux-slider-ac>
  <p>Formular-Value: {{formGroup.value | json}}</p>
</div>
`;

const chipsHtml = `
<lux-chips-ac
  [luxInputAllowed]="true"
  [luxMultiple]="true"
  luxInputLabel="Chip-Text eingeben"
  [luxNewChipGroup]="group"
>
  <lux-chip-ac-group
    [luxLabels]="chipItems"
    luxColor="primary"
    [luxSelected]="true"
    [luxRemovable]="true"
    (luxChipSelected)="onChipSelected()"
    (luxChipAdded)="chipAdded($event)"
    (luxChipRemoved)="chipRemoved($event)"
    (luxChipClicked)="chipItemClicked($event)"
    #group
  >
  </lux-chip-ac-group>
</lux-chips-ac>

<lux-chips-ac [luxInputAllowed]="true" [luxMultiple]="true" luxInputLabel="Chip-Text eingeben" [luxNewChipGroup]="group">
  <lux-chip-ac-group [luxLabels]="chipItems" luxColor="primary" [luxSelected]="true" [luxRemovable]="true" (luxChipSelected)="onChipSelected()" (luxChipAdded)="chipAdded($event)" (luxChipRemoved)="chipRemoved($event)" (luxChipClicked)="chipItemClicked($event)" #group>
  </lux-chip-ac-group>
</lux-chips-ac>
`;

const tabsHtml = `
<lux-tabs [luxTabAnimationActive]="true">
  <lux-tab luxTitle="Informationen" luxIconName="lux-info">
    <ng-template>
      <h2>Hier finden Sie alle Informationen</h2>
    </ng-template>
  </lux-tab>
  <lux-tab luxTitle="Lesezeichen" luxIconName="lux-interface-bookmark">
    <ng-template>
      <p>Lesezeichen hier</p>
    </ng-template>
  </lux-tab>
  <lux-tab
    luxTitle="Einstellungen"
    luxIconName="lux-interface-setting-tool-box"
  >
    <ng-template>
      <p>Einstellungen hier</p>
    </ng-template>
  </lux-tab>
</lux-tabs>

<lux-tabs 
  [luxTabAnimationActive]="true">
</lux-tabs>
`;

const formControlsHtml = `
<div [formGroup]="myGroup">
  <lux-autocomplete-ac
    luxLabel="Mein Autocomplete"
    [luxOptionMultiline]="true"
    luxPlaceholder="Mein Placeholder"
    luxOptionLabelProp="label"
    [luxOptions]="options"
    luxControlBinding="autocomplete"
  >
  </lux-autocomplete-ac>
</div>
<div [formGroup]="myGroup">
  <lux-autocomplete-ac luxLabel="Mein Autocomplete" [luxOptionMultiline]="true" luxPlaceholder="Mein Placeholder" luxOptionLabelProp="label" [luxOptions]="options" luxControlBinding="autocomplete"></lux-autocomplete-ac>
</div>
<lux-select-ac
  [luxOptions]="options"
  luxOptionMultiline="true"
  [luxSelected]="selected"
  luxOptionLabelProp="label"
></lux-select-ac>
`;

const angularJson01 = `
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "lux-components": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "architect": {
        "build": {
          "builder": "ngx-build-plus:browser",
        },
        "serve": {
          "builder": "ngx-build-plus:dev-server",
          "options": {
            "browserTarget": "lux-components:build"
          },
          "configurations": {
            "production": {
              "browserTarget": "lux-components:build:production"
            },
            "development": {
              "browserTarget": "lux-components:build:development"
            },
            "en": {
              "browserTarget": "lux-components:build:en"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "lux-components:build:en"
          }
        },
        
        "lint": {
          "builder": "@angular-eslint/builder:lint",
          "options": {
            "lintFilePatterns": ["src/**/*.ts", "src/**/*.html"]
          }
        }
      }
    }
  }
}
`;

const styleScss01 = `
/* You can add global styles to this file, and also import other style files */
@import '@ihk-gfi/lux-components-theme/src/base/luxfonts';
@import "@ihk-gfi/lux-components-theme/src/base/luxfonts";
         
$basepath: 'https://cdn.gfi.ihk.de/lux-components/icons-and-fonts/v1.8.0/';

@include web-fonts($basepath);

`;
