import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test';
import { UtilConfig } from '../utility/util';
import {
  addClassProperty,
  addComponentimport,
  addConstructorContent,
  addimport,
  addInterface,
  removeComponentProvider,
  removeimport,
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
    it('Sollte den import zum leeren Array hinzufügen', (done) => {
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

      addComponentimport(appTree, filePath, 'Aaa', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('imports: [Aaa]');

      done();
    });

    it('Sollte den import nicht doppelt hinzufügen', (done) => {
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

      addComponentimport(appTree, filePath, 'Aaa', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('imports: [ Aaa ]');

      done();
    });

    it('Sollte den import hinzufügen', (done) => {
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

      addComponentimport(appTree, filePath, 'Aaa', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('imports: [Aaa, LuxLayoutModule, LuxIconModule]');

      done();
    });

    it('Sollte den import inklusive Array hinzufügen', (done) => {
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

      addComponentimport(appTree, filePath, 'Aaa', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain('  imports: [Aaa],');

      done();
    });
  });

  describe('[Method] removeProvider', () => {
    it('Sollte den Provider (mehrere Provider - erster Provider) entfernen', (done) => {
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

      done();
    });

    it('Sollte den Provider (mehrere Provider - mittlerer Provider) entfernen', (done) => {
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

      done();
    });

    it('Sollte den Provider (mehrere Provider - mittlerer Provider - komplexer Provider) entfernen', (done) => {
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

      done();
    });

    it('Sollte den Provider (mehrere Provider - letzter Provider) entfernen', (done) => {
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

      done();
    });

    it('Sollte den Provider (nicht vorhanden) entfernen', (done) => {
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

      done();
    });

    it('Sollte den Provider (Provider-Abschnitt fehlt vollständig) entfernen', (done) => {
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

      done();
    });
  });

  describe('[Method] removeInterface', () => {
    it('Sollte das Interface (mehrere Interfaces - erstes Interface) entfernen', (done) => {
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

      done();
    });

    it('Sollte das Interface (mehrere Interfaces - mittleres Interface) entfernen', (done) => {
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

      done();
    });

    it('Sollte das Interface (mehrere Interfaces - mittleres Interface - mit extends) entfernen', (done) => {
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

      done();
    });

    it('Sollte das Interface (mehrere Interfaces - letztes Interface) entfernen', (done) => {
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

      done();
    });

    it('Sollte das Interface (nicht vorhanden) entfernen', (done) => {
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

      done();
    });
  });

  describe('[Method] addInterface', () => {
    it('Sollte das Interface (mit extends - ohne Interface) hinzufügen', (done) => {
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

      done();
    });

    it('Sollte das Interface (mit extends - mit Interface) hinzufügen', (done) => {
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

      done();
    });

    it('Sollte das Interface (ohne extends - ohne Interface) hinzufügen', (done) => {
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

      done();
    });

    it('Sollte das Interface (ohne extends - mit Interface) hinzufügen', (done) => {
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

      done();
    });
  });

  describe('[Method] addimport', () => {
    it('Sollte den import (mehrere imports vorhanden) nicht hinzufügen', (done) => {
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

      addimport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();

      expect(content).toContain(`import { OnChanges } from '@angular/core';
import { Input } from '@angular/core';`);

      done();
    });

    it('Sollte den import (kein import vorhanden) hinzufügen', (done) => {
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

      addimport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();

      expect(content).toContain("import { OnChanges } from '@angular/core';");

      done();
    });

    it('Sollte den import (bereits vorhanden) hinzufügen', (done) => {
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

      addimport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnChanges, OnDestroy, Component } from '@angular/core';");

      done();
    });

    it('Sollte den import (ein import) hinzufügen', (done) => {
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

      addimport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnInit, OnChanges } from '@angular/core';");

      done();
    });

    it('Sollte den import (mehrere imports - einfache Anführungszeichen) hinzufügen', (done) => {
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

      addimport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnInit, Component, OnChanges } from '@angular/core';");

      done();
    });

    it('Sollte den import (mehrere imports - doppelte Anführungszeichen) hinzufügen', (done) => {
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

      addimport(appTree, filePath, '@angular/core', 'OnChanges', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain(`import { OnInit, Component, OnChanges } from "@angular/core";`);

      done();
    });
  });

  describe('[Method] removeimport', () => {
    it('Sollte den import (mehrere imports - erster import) entfernen', (done) => {
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

      removeimport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { Component } from '@angular/core';");

      done();
    });

    it('Sollte den import (mehrere imports - erster import - doppelte Anführungszeichen) entfernen', (done) => {
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

      removeimport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain(`import { Component } from "@angular/core";`);

      done();
    });

    it('Sollte den import (mehrere imports - mittlerer import) entfernen', (done) => {
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

      removeimport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnDestroy, Component } from '@angular/core';");

      done();
    });

    it('Sollte den import (mehrere imports - mittlerer import - ohne Leerzeichen) entfernen', (done) => {
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

      removeimport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { OnDestroy,Component } from '@angular/core';");

      done();
    });

    it('Sollte den import (mehrere imports - letzter import) entfernen', (done) => {
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

      removeimport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { Component } from '@angular/core';");

      done();
    });

    it('Sollte den import (nur Paketname) entfernen', (done) => {
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

      removeimport(appTree, filePath, '@angular/common/locales/global/de', undefined, false);

      const content = appTree.read(filePath)?.toString();
      expect(content).not.toContain('import');

      done();
    });

    it('Sollte den import (nur Paketname - nicht vorhanden) entfernen', (done) => {
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

      removeimport(appTree, filePath, 'nichtDaAaa', undefined, false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import '@angular/common/locales/global/de';");

      done();
    });

    it('Sollte den import (nicht vorhanden) entfernen', (done) => {
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

      removeimport(appTree, filePath, '@angular/core', 'OnInit', false);

      const content = appTree.read(filePath)?.toString();
      expect(content).toContain("import { Component } from '@angular/core';");

      done();
    });
  });

  describe('[Method] addConstructorContent', () => {
    it('Sollte Inhalt im Konstruktor (mit Konstruktor - append=false) hinzufügen', (done) => {
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

      done();
    });

    it('Sollte Inhalt im Konstruktor (mit Konstruktor - append=true) hinzufügen', (done) => {
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

      done();
    });

    it('Sollte Inhalt im Konstruktor (mit leerem Konstruktor - append=false) hinzufügen', (done) => {
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

      done();
    });

    it('Sollte Inhalt im Konstruktor (mit leerem Konstruktor - append=true) hinzufügen', (done) => {
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

      done();
    });

    it('Sollte Inhalt im Konstruktor (ohne Konstruktor - append=false) hinzufügen', (done) => {
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

      done();
    });

    it('Sollte Inhalt im Konstruktor (ohne Konstruktor - append=true) hinzufügen', (done) => {
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

      done();
    });
  });

  describe('[Method] addClassProperty', () => {
    it('Sollte eine Property (mit Properties) hinzufügen', (done) => {
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

      done();
    });

    it('Sollte eine Property (ohne Properties) hinzufügen', (done) => {
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

      done();
    });
  });
});
