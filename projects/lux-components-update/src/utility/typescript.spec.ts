import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test';
import { UtilConfig } from '../utility/util';
import {
  addClassProperty,
  addComponentImport,
  addConstructorContent,
  addImport,
  addInterface,
  removeComponentProvider,
  removeImport,
  removeInterface
} from './typescript';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('typescript', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;

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

  describe('[Method] addComponentimport', () => {
    it('Sollte den import zum leeren Array hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/addComponentimport.component.ts';

      appTree.create(
        filePath,
        `
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: []
})
export class HomeComponent {
}`
      );

      addComponentImport(appTree, filePath, 'Aaa', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('imports: [Aaa]');
    });

    it('Sollte den import nicht doppelt hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/addComponentimport.component.ts';

      appTree.create(
        filePath,
        `
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [ Aaa ]
})
export class HomeComponent {
}`
      );

      addComponentImport(appTree, filePath, 'Aaa', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('imports: [ Aaa ]');
    });

    it('Sollte den import hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/addComponentimport.component.ts';

      appTree.create(
        filePath,
        `
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [LuxLayoutModule, LuxIconModule]
})
export class HomeComponent {
}`
      );

      addComponentImport(appTree, filePath, 'Aaa', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('imports: [Aaa, LuxLayoutModule, LuxIconModule]');
    });

    it('Sollte den import inklusive Array hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/addComponentimport.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}`
      );

      addComponentImport(appTree, filePath, 'Aaa', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('  imports: [Aaa],');
    });
  });

  describe('[Method] removeProvider', () => {
    it('Sollte den Provider (mehrere Provider - erster Provider) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { environment } from '../environments/environment';

@NgModule({
  declarations   : [
    AppComponent
  ],
  imports        : [
    HttpClientModule,
  ],
    entryComponents: [
    LuxFilePreviewComponent
  ],
  providers      : [
    LuxStorageService,
    LuxDialogService,
    DatePipe
  ],
  bootstrap      : [
    AppComponent
  ]
})
export class AppModule {
}

        `
      );

      removeComponentProvider(appTree, filePath, 'LuxStorageService', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('providers      : [\n    LuxDialogService,\n    DatePipe\n  ],');
    });

    it('Sollte den Provider (mehrere Provider - mittlerer Provider) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { environment } from '../environments/environment';

@NgModule({
  declarations   : [
    AppComponent
  ],
  imports        : [
    HttpClientModule,
  ],
    entryComponents: [
    LuxFilePreviewComponent
  ],
  providers      : [
    LuxDialogService,
    LuxStorageService,
    DatePipe
  ],
  bootstrap      : [
    AppComponent
  ]
})
export class AppModule {
}

        `
      );

      removeComponentProvider(appTree, filePath, 'LuxStorageService', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('providers      : [\n    LuxDialogService,\n    DatePipe\n  ],');
    });

    it('Sollte den Provider (mehrere Provider - mittlerer Provider - komplexer Provider) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { environment } from '../environments/environment';

@NgModule({
  declarations   : [
    AppComponent
  ],
  imports        : [
    HttpClientModule,
  ],
    entryComponents: [
    LuxFilePreviewComponent
  ],
  providers      : [
    LuxDialogService,
    {
      provide : HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi   : true
    },
    DatePipe
  ],
  bootstrap      : [
    AppComponent
  ]
})
export class AppModule {
}

        `
      );

      removeComponentProvider(appTree, filePath, 'HTTP_INTERCEPTORS', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('providers      : [\n    LuxDialogService,\n    DatePipe\n  ],');
    });

    it('Sollte den Provider (mehrere Provider - letzter Provider) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { environment } from '../environments/environment';

@NgModule({
  declarations   : [
    AppComponent
  ],
  imports        : [
    HttpClientModule,
  ],
    entryComponents: [
    LuxFilePreviewComponent
  ],
  providers      : [
    LuxDialogService,
    DatePipe,
    LuxStorageService
  ],
  bootstrap      : [
    AppComponent
  ]
})
export class AppModule {
}

        `
      );

      removeComponentProvider(appTree, filePath, 'LuxStorageService', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('providers      : [\n    LuxDialogService,\n    DatePipe\n  ],');
    });

    it('Sollte den Provider (nicht vorhanden) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { environment } from '../environments/environment';

@NgModule({
  declarations   : [
    AppComponent
  ],
  imports        : [
    HttpClientModule,
  ],
    entryComponents: [
    LuxFilePreviewComponent
  ],
  providers      : [
    LuxDialogService,
    DatePipe
  ],
  bootstrap      : [
    AppComponent
  ]
})
export class AppModule {
}

        `
      );

      removeComponentProvider(appTree, filePath, 'LuxStorageService', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('providers      : [\n    LuxDialogService,\n    DatePipe\n  ],');
    });

    it('Sollte den Provider (Provider-Abschnitt fehlt vollständig) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { environment } from '../environments/environment';

@NgModule({
  declarations   : [
    AppComponent
  ],
  imports        : [
    HttpClientModule,
  ],
    entryComponents: [
    LuxFilePreviewComponent
  ],
  bootstrap      : [
    AppComponent
  ]
})
export class AppModule {
}

        `
      );

      removeComponentProvider(appTree, filePath, 'LuxStorageService', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).not.toContain('providers');
    });
  });

  describe('[Method] removeInterface', () => {
    it('Sollte das Interface (mehrere Interfaces - erstes Interface) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnInit, OnDestroy, Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeInterface(appTree, filePath, 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('export class AnbindungLazyComponent implements OnDestroy {');
    });

    it('Sollte das Interface (mehrere Interfaces - mittleres Interface) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnChanges, OnInit, OnDestroy, Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnChanges, OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeInterface(appTree, filePath, 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('export class AnbindungLazyComponent implements OnChanges, OnDestroy {');
    });

    it('Sollte das Interface (mehrere Interfaces - mittleres Interface - mit extends) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnChanges, OnInit, OnDestroy, Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent extends Aaa implements OnChanges, OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeInterface(appTree, filePath, 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('export class AnbindungLazyComponent extends Aaa implements OnChanges, OnDestroy {');
    });

    it('Sollte das Interface (mehrere Interfaces - letztes Interface) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnChanges, OnInit, OnDestroy, Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnChanges, OnDestroy, OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeInterface(appTree, filePath, 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('export class AnbindungLazyComponent implements OnChanges, OnDestroy {');
    });

    it('Sollte das Interface (nicht vorhanden) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnChanges, OnDestroy, Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeInterface(appTree, filePath, 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('export class AnbindungLazyComponent {');
    });
  });

  describe('[Method] addInterface', () => {
    it('Sollte das Interface (mit extends - ohne Interface) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent extends Aaa {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addInterface(appTree, filePath, 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('export class AnbindungLazyComponent extends Aaa implements OnChanges {');
    });

    it('Sollte das Interface (mit extends - mit Interface) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent extends Aaa implements Bbb {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addInterface(appTree, filePath, 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('export class AnbindungLazyComponent extends Aaa implements Bbb, OnChanges {');
    });

    it('Sollte das Interface (ohne extends - ohne Interface) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addInterface(appTree, filePath, 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('export class AnbindungLazyComponent implements OnChanges {');
    });

    it('Sollte das Interface (ohne extends - mit Interface) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addInterface(appTree, filePath, 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('export class AnbindungLazyComponent implements OnInit, OnChanges {');
    });
  });

  describe('[Method] addimport', () => {
    it('Sollte den import (mehrere imports vorhanden) nicht hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnChanges } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addImport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();

      expect(content).toContain(`import { OnChanges } from '@angular/core';
import { Input } from '@angular/core';`);
    });

    it('Sollte den import (kein import vorhanden) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addImport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();

      expect(content).toContain("import { OnChanges } from '@angular/core';");
    });

    it('Sollte den import (bereits vorhanden) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnChanges, OnDestroy, Component } from '@angular/core';        
        
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addImport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnChanges, OnDestroy, Component } from '@angular/core';");
    });

    it('Sollte den import (ein import) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnInit } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addImport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnInit, OnChanges } from '@angular/core';");
    });

    it('Sollte den import (mehrere imports - einfache Anführungszeichen) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnInit, Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addImport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnInit, Component, OnChanges } from '@angular/core';");
    });

    it('Sollte den import (mehrere imports - doppelte Anführungszeichen) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnInit, Component } from "@angular/core";

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      addImport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain(`import { OnInit, Component, OnChanges } from "@angular/core";`);
    });
  });

  describe('[Method] removeimport', () => {
    it('Sollte den import (mehrere imports - erster import) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnInit, Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeImport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { Component } from '@angular/core';");
    });

    it('Sollte den import (mehrere imports - erster import - doppelte Anführungszeichen) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnInit, Component } from "@angular/core";

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeImport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain(`import { Component } from "@angular/core";`);
    });

    it('Sollte den import (mehrere imports - mittlerer import) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnDestroy, OnInit, Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeImport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnDestroy, Component } from '@angular/core';");
    });

    it('Sollte den import (mehrere imports - mittlerer import - ohne Leerzeichen) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { OnDestroy,OnInit,Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeImport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnDestroy,Component } from '@angular/core';");
    });

    it('Sollte den import (mehrere imports - letzter import) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { Component, OnInit } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeImport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { Component } from '@angular/core';");
    });

    it('Sollte den import (nur Paketname) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import '@angular/common/locales/global/de';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeImport(appTree, filePath, '@angular/common/locales/global/de', undefined, false);

      const content = appTree.read(filePath)?.toString();
      expect(content).not.toContain('import');
    });

    it('Sollte den import (nur Paketname - nicht vorhanden) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import '@angular/common/locales/global/de';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeImport(appTree, filePath, 'nichtDaAaa', undefined, false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import '@angular/common/locales/global/de';");
    });

    it('Sollte den import (nicht vorhanden) entfernen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
import { Component } from '@angular/core';

@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {     
  }

}

        `
      );

      removeImport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { Component } from '@angular/core';");
    });
  });

  describe('[Method] addConstructorContent', () => {
    it('Sollte Inhalt im Konstruktor (mit Konstruktor - append=false) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent extends Aaa {

  constructor() {
    console.log();
  }

  ngOnInit() {     
  }

}

        `
      );

      addConstructorContent(appTree, filePath, 'router.initialNavigation();', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('constructor() {\n    router.initialNavigation();\n    console.log();\n  }');
    });

    it('Sollte Inhalt im Konstruktor (mit Konstruktor - append=true) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent extends Aaa {

  constructor() {
    console.log();
  }

  ngOnInit() {     
  }

}

        `
      );

      addConstructorContent(appTree, filePath, 'router.initialNavigation();', true);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('constructor() {\n    console.log();\n    router.initialNavigation();\n  }');
    });

    it('Sollte Inhalt im Konstruktor (mit leerem Konstruktor - append=false) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent extends Aaa {

  constructor() {}

  ngOnInit() {     
  }

}

        `
      );

      addConstructorContent(appTree, filePath, 'router.initialNavigation();', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('constructor() {\n    router.initialNavigation();\n  }');
    });

    it('Sollte Inhalt im Konstruktor (mit leerem Konstruktor - append=true) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent extends Aaa {

  constructor() {}

  ngOnInit() {     
  }

}

        `
      );

      addConstructorContent(appTree, filePath, 'router.initialNavigation();', true);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('constructor() {\n    router.initialNavigation();\n  }');
    });

    it('Sollte Inhalt im Konstruktor (ohne Konstruktor - append=false) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent extends Aaa {

  ngOnInit() {     
  }

}

        `
      );

      addConstructorContent(appTree, filePath, 'router.initialNavigation();', false);

      const content = appTree.read(filePath)?.toString();

      expect(content).toContain('constructor() {\n    router.initialNavigation();\n  }');
    });

    it('Sollte Inhalt im Konstruktor (ohne Konstruktor - append=true) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'bp-anbindung-lazy',
  templateUrl: './anbindung-lazy.component.html'
})
export class AnbindungLazyComponent extends Aaa {

  ngOnInit() {     
  }

}

        `
      );

      addConstructorContent(appTree, filePath, 'router.initialNavigation();', true);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('constructor() {\n    router.initialNavigation();\n  }');
    });
  });

  describe('[Method] addClassProperty', () => {
    it('Sollte eine Property (mit Properties) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  luxVersion = '';
  isMaintenanceOrUnauthorized = false;

  constructor(private readonly fachService: AccountFacadeService,
              public router: Router, public window: Window,
              private appService: LuxAppService) {
  }

  ngOnInit(): void {
  }

}
        `
      );

      addClassProperty(appTree, filePath, "@Input() luxAppHeader: 'normal' | 'minimal' | 'none' = 'normal';");

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("  @Input() luxAppHeader: 'normal' | 'minimal' | 'none' = 'normal';");
    });

    it('Sollte eine Property (ohne Properties) hinzufügen', async () => {
      const filePath = testOptions.path + '/src/app/test.component.ts';

      appTree.create(
        filePath,
        `
@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  constructor(private readonly fachService: AccountFacadeService,
              public router: Router, public window: Window,
              private appService: LuxAppService) {
  }

  ngOnInit(): void {
  }

}
        `
      );

      addClassProperty(appTree, filePath, "@Input() luxAppHeader: 'normal' | 'minimal' | 'none' = 'normal';");

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("  @Input() luxAppHeader: 'normal' | 'minimal' | 'none' = 'normal';");
    });
  });
});
