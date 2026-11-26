import { callRule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { lastValueFrom } from 'rxjs';
import {
  addPrompt,
  migrateConfigProvider,
  removeCardIconName,
  renameFlexColReverse,
  renameMaxSize,
  updatePackageJson,
  updateTranslations
} from '.';
import { getDep } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { UtilConfig } from '../../utility/util';
import { checkBreakingChanges, createReport, findV22Findings, PROMPT_FILE, REPORT_FILE } from './checks';

describe('update220000', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: { project: string; path: string; verbose: boolean } = {
    project: '',
    path: '/',
    verbose: false
  };

  const run = async (rule: (options: typeof testOptions) => any): Promise<Tree> =>
    lastValueFrom(callRule(rule(testOptions), appTree, context));

  const file = (name: string) => `${testOptions.path}/src/app/${name}`;

  beforeEach(async () => {
    const collectionPath = path.join(__dirname, '../../../collection.json');
    runner = new SchematicTestRunner('schematics', collectionPath);

    const collection = '@schematics/angular';
    appTree = await runner.runExternalSchematic(collection, 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic(collection, 'application', appOptions, appTree);

    context = runner.engine.createContext(runner.engine.createSchematic('update-22.0.0', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = false;
  });

  describe('[Rule] updatePackageJson', () => {
    it('Sollte die LUX-Versionen setzen und Transloco anheben', async () => {
      appTree.overwrite('/package.json', packageJson('^8.0.2'));

      const tree = await run(updatePackageJson);

      expect(getDep(tree, '@ihk-gfi/lux-components').version).toEqual('22.0.0');
      expect(getDep(tree, '@ihk-gfi/lux-components-theme').version).toEqual('22.0.0');
      expect(getDep(tree, '@jsverse/transloco').version).toEqual('^8.3.0');
    });

    it('Sollte eine neuere Transloco-Version nicht herabsetzen', async () => {
      appTree.overwrite('/package.json', packageJson('^8.4.0'));

      const tree = await run(updatePackageJson);

      expect(getDep(tree, '@jsverse/transloco').version).toEqual('^8.4.0');
    });

    it('Sollte ngx-cookie-service aktualisieren, wenn es vorhanden ist', async () => {
      appTree.overwrite(
        '/package.json',
        packageJson('^8.3.0').replace('"dependencies": {', '"dependencies": {\n    "ngx-cookie-service": "^21.3.1",')
      );

      const tree = await run(updatePackageJson);

      expect(getDep(tree, 'ngx-cookie-service').version).toEqual('^22.0.0');
    });

    it('Sollte ngx-cookie-service nicht hinzufügen, wenn es fehlt', async () => {
      appTree.overwrite('/package.json', packageJson('^8.3.0'));

      const tree = await run(updatePackageJson);

      expect(tree.readText('/package.json')).not.toContain('ngx-cookie-service');
    });

    it('Sollte marked aktualisieren, wenn es vorhanden ist', async () => {
      appTree.overwrite('/package.json', packageJson('^8.3.0').replace('"dependencies": {', '"dependencies": {\n    "marked": "^15.0.0",'));

      const tree = await run(updatePackageJson);

      expect(getDep(tree, 'marked').version).toEqual('^18.0.0');
    });

    it('Sollte marked nicht hinzufügen, wenn es fehlt', async () => {
      appTree.overwrite('/package.json', packageJson('^8.3.0'));

      const tree = await run(updatePackageJson);

      expect(tree.readText('/package.json')).not.toContain('"marked"');
    });
  });

  describe('[Rule] renameMaxSize', () => {
    it('Sollte luxMaxSizeMB in Templates und TypeScript umbenennen', async () => {
      appTree.create(file('upload.component.html'), '<lux-file-input [luxMaxSizeMB]="5" />\n<lux-file-list luxMaxSizeMB="2" />');
      appTree.create(file('upload.component.ts'), 'template: `<lux-file-upload [luxMaxSizeMB]="max" />`');

      const tree = await run(renameMaxSize);

      expect(tree.readText(file('upload.component.html'))).toEqual(
        '<lux-file-input [luxMaxSizeMiB]="5" />\n<lux-file-list luxMaxSizeMiB="2" />'
      );
      expect(tree.readText(file('upload.component.ts'))).toEqual('template: `<lux-file-upload [luxMaxSizeMiB]="max" />`');
    });
  });

  describe('[Rule] renameFlexColReverse', () => {
    it('Sollte lux-flex-col-revers umbenennen und lux-flex-col-reverse unverändert lassen', async () => {
      appTree.create(
        file('layout.component.html'),
        '<div class="lux-flex-col-revers md:lux-flex-col-revers"></div>\n<div class="lux-flex-col-reverse"></div>'
      );
      appTree.create(file('layout.component.scss'), '.a { @extend .lux-flex-col-revers; }');

      const tree = await run(renameFlexColReverse);

      expect(tree.readText(file('layout.component.html'))).toEqual(
        '<div class="lux-flex-col-reverse md:lux-flex-col-reverse"></div>\n<div class="lux-flex-col-reverse"></div>'
      );
      expect(tree.readText(file('layout.component.scss'))).toEqual('.a { @extend .lux-flex-col-reverse; }');
    });
  });

  describe('[Rule] updateTranslations', () => {
    it('Sollte die Platzhalter der Dateigröße umbenennen', async () => {
      const localeFile = `${testOptions.path}/src/locale/luxc-de.json`;
      appTree.create(
        localeFile,
        '{ "a": "Die Datei {{fileName}} überschreitet mit {{ fileSizeInMB }} MB die erlaubte Dateigröße von {{maxSizeMB}} MB" }'
      );

      const tree = await run(updateTranslations);

      expect(tree.readText(localeFile)).toEqual(
        '{ "a": "Die Datei {{fileName}} überschreitet mit {{fileSizeInMiB}} MB die erlaubte Dateigröße von {{maxSizeMiB}} MB" }'
      );
    });
  });

  describe('[Rule] migrateConfigProvider', () => {
    it('Sollte importProvidersFrom mit Array durch provideLuxComponentsConfig ersetzen', async () => {
      appTree.overwrite(file('app.config.ts'), appConfigWithArray);

      const tree = await run(migrateConfigProvider);
      const content = tree.readText(file('app.config.ts'));

      expect(content).toContain('provideLuxComponentsConfig(myConfiguration)');
      expect(content).not.toContain('LuxComponentsConfigModule');
      expect(content).not.toContain('importProvidersFrom');
      expect(content).toMatch(/import \{[^}]*provideLuxComponentsConfig[^}]*\} from '@ihk-gfi\/lux-components'/);
      expect(content).toMatch(/import \{[^}]*LuxComponentsConfigParameters[^}]*\} from '@ihk-gfi\/lux-components'/);
    });

    it('Sollte importProvidersFrom ohne Array ersetzen und weitere importProvidersFrom behalten', async () => {
      appTree.overwrite(file('app.config.ts'), appConfigWithoutArray);

      const tree = await run(migrateConfigProvider);
      const content = tree.readText(file('app.config.ts'));

      expect(content).toContain('provideLuxComponentsConfig({ displayLuxConsoleLogs: false })');
      expect(content).toContain('importProvidersFrom(OtherModule)');
      expect(content).toMatch(/import \{[^}]*importProvidersFrom[^}]*\} from '@angular\/core'/);
      expect(content).not.toContain('LuxComponentsConfigModule');
    });

    it('Sollte NgModule-Imports unverändert lassen', async () => {
      const content = `import { LuxComponentsConfigModule } from '@ihk-gfi/lux-components';\n\n@NgModule({ imports: [LuxComponentsConfigModule.forRoot(config)] })\nexport class AppModule {}\n`;
      appTree.create(file('app.module.ts'), content);

      const tree = await run(migrateConfigProvider);

      expect(tree.readText(file('app.module.ts'))).toEqual(content);
    });
  });

  describe('[Rule] removeCardIconName', () => {
    it('Sollte luxIconName nur an lux-card entfernen', async () => {
      appTree.create(
        file('card.component.html'),
        [
          '<lux-card luxTitle="Titel" [luxIconName]="icon">',
          '  <lux-card-content>',
          '    <lux-icon luxIconName="lux-save"></lux-icon>',
          '  </lux-card-content>',
          '</lux-card>',
          '<lux-button luxIconName="lux-cogs"></lux-button>'
        ].join('\n')
      );

      const tree = await run(removeCardIconName);

      expect(tree.readText(file('card.component.html'))).toEqual(
        [
          '<lux-card luxTitle="Titel">',
          '  <lux-card-content>',
          '    <lux-icon luxIconName="lux-save"></lux-icon>',
          '  </lux-card-content>',
          '</lux-card>',
          '<lux-button luxIconName="lux-cogs"></lux-button>'
        ].join('\n')
      );
    });
  });

  describe('[Rule] addPrompt', () => {
    it('Sollte den KI-Prompt im Projekt anlegen', async () => {
      const tree = await run(addPrompt);
      const prompt = tree.readText(`${testOptions.path}/${PROMPT_FILE}`);

      expect(prompt).toContain('mode: agent');
      expect(prompt).toContain(REPORT_FILE);
    });
  });

  describe('[Rule] checkBreakingChanges', () => {
    it('Sollte die offenen Stellen nach Kategorien in den Bericht schreiben', async () => {
      appTree.create(
        file('termin.component.html'),
        [
          '<lux-datetimepicker luxLabel="Termin" />',
          '<lux-input-ac luxLabel="Name"></lux-input-ac>',
          '<span class="lux-bold">x</span>'
        ].join('\n')
      );
      appTree.create(
        file('termin.component.spec.ts'),
        [
          "import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';",
          "import { LuxComponentsConfigModule, LuxErrorStoreService } from '@ihk-gfi/lux-components';",
          "import { provideNoopAnimations } from '@angular/platform-browser/animations';",
          'const steps = { alignIconWithLabel: true };'
        ].join('\n')
      );

      const tree = await run(checkBreakingChanges);
      const report = tree.readText(`${testOptions.path}/${REPORT_FILE}`);

      expect(report).toContain('## Konfiguration (1)');
      expect(report).toContain('## Signal-Inputs und -Outputs (1)');
      expect(report).toContain('## Animationen (1)');
      expect(report).toContain('## Entfernte Optionen (1)');
      expect(report).toContain('## Styling (1)');
      expect(report).toContain('## Test-Utilities (1)');
      expect(report).toContain('## Komponenten ohne "-ac" (optional) (1)');
      expect(report).toContain('## Datums- und Zeitwerte ohne Zeitzone');
      expect(report).toContain('- `src/app/termin.component.html:1`: lux-datetimepicker entfällt');
      expect(report).toContain('Update-Guide-v22#konfiguration');
    });

    it('Sollte Karma und jasmine-axe melden', async () => {
      appTree.overwrite(
        '/package.json',
        packageJson('^8.3.0').replace('"devDependencies": {', '"devDependencies": {\n    "jasmine-axe": "^1.1.0",')
      );
      appTree.create('/karma.conf.js', 'module.exports = function (config) {};');

      const findings = findV22Findings(appTree, '');

      expect(findings.filter((finding) => finding.category === 'tests').map((finding) => finding.filePath)).toEqual([
        '/karma.conf.js',
        '/package.json'
      ]);
    });

    it('Sollte Zugriffe auf die entfallenen Felder der LuxTooltipDirective melden', () => {
      appTree.create(
        file('hilfe.component.ts'),
        [
          'const button = this.tooltip.luxButton;',
          'this.myTooltipDirective()?.luxMenu?.close();',
          'const link = this.tooltipRef!.luxLinkPlain;',
          'this.luxMenu.close();',
          'const nav = this.navigation.luxActionNav;'
        ].join('\n')
      );

      const findings = findV22Findings(appTree, testOptions.path).filter((finding) => finding.category === 'options');

      expect(findings.map((finding) => finding.line)).toEqual([1, 2, 3]);
    });

    it('Sollte einen Bericht ohne Stellen erzeugen', () => {
      expect(createReport([], '/')).toContain('Es wurden keine Stellen gefunden.');
    });
  });
});

const packageJson = (translocoVersion: string) => `{
  "name": "lorem-ipsum",
  "version": "0.0.1",
  "dependencies": {
    "@angular/common": "^22.0.0",
    "@angular/core": "^22.0.0",
    "@ihk-gfi/lux-components": "21.11.0",
    "@ihk-gfi/lux-components-theme": "21.11.0",
    "@jsverse/transloco": "${translocoVersion}"
  },
  "devDependencies": {
    "@angular/cli": "^22.0.0"
  }
}
`;

const appConfigWithArray = `import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { LuxComponentsConfigModule, LuxComponentsConfigParameters } from '@ihk-gfi/lux-components';

const myConfiguration: LuxComponentsConfigParameters = { displayLuxConsoleLogs: false };

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom([LuxComponentsConfigModule.forRoot(myConfiguration)])]
};
`;

const appConfigWithoutArray = `import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { LuxComponentsConfigModule } from '@ihk-gfi/lux-components';
import { OtherModule } from './other.module';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(LuxComponentsConfigModule.forRoot({ displayLuxConsoleLogs: false })),
    importProvidersFrom(OtherModule)
  ]
};
`;
