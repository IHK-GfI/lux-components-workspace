// noinspection DuplicatedCode

import { HttpClient, withXhr } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ILuxFileListActionConfig, ILuxFilesListActionConfig } from '../lux-file-model/lux-file-list-action-config.interface';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxOverlayHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { of, throwError } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../../testing/transloco-test.provider';
import { provideLuxComponentsConfig } from '../../../lux-components-config/lux-components-config.provider';
import { LuxConsoleService } from '../../../lux-util/lux-console.service';
import { LuxStorageService } from '../../../lux-util/lux-storage.service';
import { LuxFormFileBase } from '../../lux-form-model/lux-form-file-base.class';
import { ILuxFileActionConfig } from '../lux-file-model/lux-file-action-config.interface';
import { LuxFileErrorCause } from '../lux-file-model/lux-file-error.interface';
import { ILuxFileObject } from '../lux-file-model/lux-file-object.interface';
import { LuxFileListComponent } from './lux-file-list.component';

describe('LuxFileListComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideLuxComponentsConfig({
          labelConfiguration: {
            allUppercase: true,
            notAppliedTo: []
          }
        }),
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        {
          provide: LuxStorageService,
          useClass: MockStorage
        }
      ]
    }).compileComponents();
  });

  describe('[ReactiveForm]', () => {
    let fixture: ComponentFixture<FileFormComponent>;
    let testComponent: FileFormComponent;
    let fileComponent: LuxFileListComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(FileFormComponent);
      testComponent = fixture.componentInstance;
      fileComponent = fixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      // den LiveAnnouncer abklemmen
      fileComponent['liveAnnouncer'] = { announce: () => {} } as any;

      // Wir mocken hier den FileReader weg, da er nicht mit fakeAsync kompatibel ist
      vi.spyOn(fileComponent, 'readFile').mockResolvedValue(base64Dummy);
      // Den read-Delay für die Ladeanzeige mocken
      fileComponent.defaultReadFileDelay = 0;
      fixture.detectChanges();
    });

    it('Sollte den Startwert korrekt setzen', async () => {
      // Vorbedingungen testen
      const localFixture = TestBed.createComponent(FileFormComponent);
      const localTestComponent = localFixture.componentInstance;
      const localFileComponent = localFixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      expect(localFixture.debugElement.query(By.css('.lux-file-list-entry-label'))).toBeFalsy();
      expect(localTestComponent.formControl.value).toBeNull();
      expect(localFileComponent.value()).toBeNull();

      // Änderungen durchführen
      const files = [{ name: 'mockfile.txt', type: 'text/txt', content: base64Dummy }];
      localTestComponent.formControl.setValue(files);
      await LuxTestHelper.wait(localFixture);

      // Nachbedingungen prüfen
      expect(localFixture.debugElement.query(By.css('.lux-file-list-entry-label')).nativeElement.textContent.trim()).toEqual(
        'mockfile.txt'
      );
      expect(localTestComponent.formControl.value).toEqual(files);
      expect(localFileComponent.value()).toEqual(files);
      expect(localFileComponent.formControl.value).toEqual(files);
    });

    it('Sollte den Wert an das FormControl übergeben', async () => {
      // Vorbedingungen testen
      expect(testComponent.formControl.value).toBeNull();
      expect(fileComponent.formControl.value).toBeNull();

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.formControl.value![0].content).toEqual(base64Dummy);
      expect(fileComponent.formControl.value![0].content).toEqual(base64Dummy);

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte alle Werte an das FormControl übergeben', async () => {
      // Vorbedingungen testen
      testComponent.multiple.set(true);
      await LuxTestHelper.wait(fixture);

      expect(testComponent.formControl.value).toBeFalsy();
      expect(fileComponent.formControl.value).toBeFalsy();

      // Änderungen durchführen
      fileComponent.selectFiles([
        LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
        LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
      ]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.formControl.value![0].content).toEqual(base64Dummy);
      expect(testComponent.formControl.value![1].content).toEqual(base64Dummy);
      expect(fileComponent.formControl.value![0].content).toEqual(base64Dummy);
      expect(fileComponent.formControl.value![1].content).toEqual(base64Dummy);

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte required sein', async () => {
      // Vorbedingungen testen
      expect(fileComponent.formControl.errors).toBeNull();
      expect(fileComponent.formControl.valid).toBe(true);
      expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

      // Änderungen durchführen
      testComponent.formControl.setValidators(Validators.required);
      await LuxTestHelper.wait(fixture);
      fileComponent.formControl.markAsTouched();
      fileComponent.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.formControl.errors).not.toBeNull();
      expect(fileComponent.formControl.valid).toBe(false);
      expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
    });
  });

  describe('[Allgemein]', () => {
    let fixture: ComponentFixture<FileComponent>;
    let testComponent: FileComponent;
    let fileComponent: LuxFileListComponent;
    let overlayHelper: LuxOverlayHelper;

    beforeEach(() => {
      fixture = TestBed.createComponent(FileComponent);
      testComponent = fixture.componentInstance;
      fileComponent = fixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      // den LiveAnnouncer abklemmen
      fileComponent['liveAnnouncer'] = { announce: () => {} } as any;

      // Wir mocken hier den FileReader weg, da er nicht mit fakeAsync kompatibel ist
      vi.spyOn(fileComponent, 'readFile').mockResolvedValue(base64Dummy);
      // Den read-Delay für die Ladeanzeige mocken
      fileComponent.defaultReadFileDelay = 0;
      overlayHelper = new LuxOverlayHelper();
      fixture.detectChanges();
    });

    it('wenn zusätzliche Punkt im Dateinamen sind', async () => {
      // Vorbedingungen testen
      await LuxTestHelper.wait(fixture);
      expect(fileComponent.formControl.errors).toBeNull();
      expect(fileComponent.formControl.valid).toBe(true);
      expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

      // Änderungen durchführen,
      testComponent.accept.set('.pdf,.txt');
      testComponent.multiple.set(true);
      await LuxTestHelper.wait(fixture);

      // Änderungen durchführen,
      fileComponent.selectFiles([
        LuxTestHelper.createFileBrowserSafe('mock.file1.PDF', 'text/Pdf'),
        LuxTestHelper.createFileBrowserSafe('mock.file.2.Txt', 'text/plain'),
        LuxTestHelper.createFileBrowserSafe('Hi...........pdf', 'text/pdf'),
        LuxTestHelper.createFileBrowserSafe('Hi......pdf', 'text/plain')
      ]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.formControl.errors).toBeNull();
      expect(fileComponent.formControl.valid).toBe(true);
      expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte Label und Hint korrekt setzen', async () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-card-title')).nativeElement.textContent.trim()).toBe('');
      expect(fixture.debugElement.query(By.css('mat-hint'))).toBeNull();

      // Änderungen durchführen
      testComponent.label.set('Label');
      testComponent.hint.set('Hint');
      await LuxTestHelper.wait(fixture);

      // // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-card-title')).nativeElement.textContent.trim()).toBe('Label');
      expect(fixture.debugElement.query(By.css('mat-hint')).nativeElement.textContent.trim()).toEqual('Hint');
    });

    it('Sollte required sein', async () => {
      // Vorbedingungen testen
      expect(fileComponent.formControl.errors).toBeNull();
      expect(fileComponent.formControl.valid).toBe(true);
      expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

      // Änderungen durchführen
      testComponent.required.set(true);
      await LuxTestHelper.wait(fixture);
      fileComponent.formControl.markAsTouched();
      fileComponent.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.formControl.errors).not.toBeNull();
      expect(fileComponent.formControl.valid).toBe(false);
      expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
    });

    it('Sollte disabled sein', async () => {
      // Vorbedingungen testen
      expect(fileComponent.formControl.disabled).toBe(false);

      // Änderungen durchführen
      testComponent.disabled.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.formControl.disabled).toBe(true);
    });

    it('Sollte readonly sein', async () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-form-control-readonly'))).toBeNull();

      // Änderungen durchführen
      testComponent.readonly.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-form-control-readonly'))).not.toBeNull();
    });

    it('Sollte die Dateien an die entsprechende luxUploadUrl hochladen', async () => {
      // Vorbedingungen testen
      const httpClient = fixture.debugElement.injector.get(HttpClient);
      const spy = vi.spyOn(httpClient, 'post').mockReturnValue(of('ok'));

      testComponent.multiple.set(true);
      await LuxTestHelper.wait(fixture);

      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      await LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(0);
      expect(fileComponent.value()).toBeTruthy();

      // Änderungen durchführen
      testComponent.uploadUrl.set('/test/api/');
      await LuxTestHelper.wait(fixture);
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(1);
      expect(fileComponent.value()!.length).toBe(2);
      await LuxTestHelper.wait(fixture);
    });

    it('Sollte den Startwert korrekt setzen', async () => {
      // Vorbedingungen testen
      const localFixture = TestBed.createComponent(FileComponent);
      const localTestComponent = localFixture.componentInstance;
      const localFileComponent = localFixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      expect(localFixture.debugElement.query(By.css('.lux-file-list-entry-label'))).toBeFalsy();
      expect(localTestComponent.selected()).toBeNull();
      expect(localFileComponent.value()).toBeNull();

      // Änderungen durchführen
      const files = [{ name: 'mockfile.txt', type: 'text/txt', content: base64Dummy }];
      localTestComponent.selected.set(files);
      await LuxTestHelper.wait(localFixture);

      // Nachbedingungen prüfen
      expect(localFixture.debugElement.query(By.css('.lux-file-list-entry-label')).nativeElement.textContent.trim()).toEqual(
        'mockfile.txt'
      );
      expect(localTestComponent.selected()).toEqual(files);
      expect(localFileComponent.value()).toEqual(files);
      expect(localFileComponent.formControl.value).toEqual(files);
    });

    it('Sollte beim Klick auf den Entfernen-Button die Selektion leeren', async () => {
      // Vorbedingungen testen
      testComponent.multiple.set(true);
      await LuxTestHelper.wait(fixture);

      testComponent.selected.set([
        { name: 'mockfile1.txt', type: 'text/txt', content: base64Dummy },
        { name: 'mockfile2.txt', type: 'text/txt', content: base64Dummy }
      ]);
      await LuxTestHelper.wait(fixture);

      expect(fileComponent.value()).toEqual(testComponent.selected());
      expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry-label'))[0].nativeElement.textContent.trim()).toEqual(
        'mockfile1.txt'
      );
      expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry-label'))[1].nativeElement.textContent.trim()).toEqual(
        'mockfile2.txt'
      );

      // Änderungen durchführen
      fixture.debugElement.query(By.css('.lux-file-list-header-clear button')).nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.value()).toEqual([]);
      expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry-label')).length).toBe(0);
    });

    it('Sollte das Background-Icon + Hint darstellen, wenn keine Dateien geladen sind', async () => {
      // Vorbedingungen testen
      testComponent.hint.set('Hint');
      await LuxTestHelper.wait(fixture);

      expect(fileComponent.value()).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.lux-file-icon'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('mat-hint'))).not.toBeNull();

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.value()).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.lux-file-icon'))).toBeNull();
      expect(fixture.debugElement.query(By.css('mat-hint'))).toBeNull();

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte die dynamische Änderung von luxMaxFileCount korrekt berücksichtigen', async () => {
      // Vorbedingungen: Maximal 1 Datei erlaubt
      testComponent.maxFileCount.set(1);
      testComponent.multiple.set(true);
      await LuxTestHelper.wait(fixture);

      // Eine Datei hinzufügen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      await LuxTestHelper.wait(fixture);
      expect(fileComponent.value()!.length).toBe(1);
      expect(fileComponent.formControl.errors).toBeNull();

      // Versucht eine zweite Datei hinzuzufügen -> Error
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
      await LuxTestHelper.wait(fixture);
      expect(fileComponent.formControl.errors).not.toBeNull();
      expect(fileComponent.formControl.errors![LuxFileErrorCause.MaxFileCount]).toBeDefined();

      // MaxFileCount dynamisch erhöhen
      testComponent.maxFileCount.set(2);
      await LuxTestHelper.wait(fixture);

      // Fügt eine zweite Datei hinzu
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
      await LuxTestHelper.wait(fixture);

      // Jetzt sollten zwei Dateien erlaubt sein
      expect(fileComponent.value()!.length).toBe(2);
      expect(fileComponent.formControl.errors).toBeNull();
    });

    it('Sollte die Drag-and-Drop Events aufrufen (eine Datei)', async () => {
      // vi.spyOn() liefert bei einem bereits gespionten Prototyp-Member (z.B. durch den Test "mehrere
      // Dateien") dieselbe Mock-Instanz inkl. bisherigem Aufruf-Zähler zurück. Da der Vitest-Runner die
      // Testdateien standardmäßig nicht isoliert ausführt, muss der Zähler hier explizit genullt werden,
      // um Interferenzen mit anderen Tests zu vermeiden.
      const spyDrag = vi.spyOn(LuxFormFileBase.prototype, 'onDragOver').mockClear();
      const spyDrop = vi.spyOn(LuxFormFileBase.prototype, 'onDrop').mockClear();

      const fileInputNode = fixture.debugElement.query(By.css('lux-file-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(fileInputNode, 'dragover', true);
      await LuxTestHelper.wait(fixture);

      const mockDropEvent = LuxTestHelper.createDropEvent([{ name: 'mockfile1.txt', type: 'text/txt' }]);
      LuxTestHelper.dispatchEvent(fileInputNode, mockDropEvent);
      await LuxTestHelper.wait(fixture);

      expect(spyDrag).toHaveBeenCalledTimes(1);
      expect(spyDrop).toHaveBeenCalledTimes(1);
      expect(testComponent.selected()![0].name).toEqual('mockfile1.txt');
      expect(testComponent.selected()![0].content).toEqual(base64Dummy);
      expect(fileComponent.value()![0].name).toEqual('mockfile1.txt');
      expect(fileComponent.value()![0].content).toEqual(base64Dummy);

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte die Drag-and-Drop Events aufrufen (mehrere Dateien)', async () => {
      testComponent.multiple.set(true);
      // Siehe Kommentar im Test "eine Datei": Zähler explizit nullen, da vi.spyOn() bei einem bereits
      // gespionten Prototyp-Member dieselbe Mock-Instanz (inkl. bisherigem Aufruf-Zähler) zurückgibt.
      const spyDrag = vi.spyOn(LuxFormFileBase.prototype, 'onDragOver').mockClear();
      const spyDrop = vi.spyOn(LuxFormFileBase.prototype, 'onDrop').mockClear();

      const fileInputNode = fixture.debugElement.query(By.css('lux-file-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(fileInputNode, 'dragover', true);
      await LuxTestHelper.wait(fixture);

      const mockDropEvent = LuxTestHelper.createDropEvent([
        { name: 'mockfile1.txt', type: 'text/txt' },
        { name: 'mockfile2.pdf', type: 'text/pdf' }
      ]);
      LuxTestHelper.dispatchEvent(fileInputNode, mockDropEvent);
      await LuxTestHelper.wait(fixture);

      expect(spyDrag).toHaveBeenCalledTimes(1);
      expect(spyDrop).toHaveBeenCalledTimes(1);
      expect(testComponent.selected()![0].name).toEqual('mockfile1.txt');
      expect(testComponent.selected()![0].content).toEqual(base64Dummy);
      expect(fileComponent.value()![0].name).toEqual('mockfile1.txt');
      expect(fileComponent.value()![0].content).toEqual(base64Dummy);
      expect(testComponent.selected()![1].name).toEqual('mockfile2.pdf');
      expect(testComponent.selected()![1].content).toEqual(base64Dummy);
      expect(fileComponent.value()![1].name).toEqual('mockfile2.pdf');
      expect(fileComponent.value()![1].content).toEqual(base64Dummy);

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte eine einzelne Datei updaten', async () => {
      // Vorbedingungen testen
      testComponent.multiple.set(true);
      await LuxTestHelper.wait(fixture);

      const spy = vi.spyOn(testComponent, 'selectedChange');

      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      await LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(testComponent.selected()![0].name).toEqual('mockfile1.txt');
      expect(testComponent.selected()![0].content).toEqual(base64Dummy);
      expect(fileComponent.value()![0].name).toEqual('mockfile1.txt');
      expect(fileComponent.value()![0].content).toEqual(base64Dummy);

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/html')]);
      await LuxTestHelper.wait(fixture);

      const replaceButton = overlayHelper.selectAllFromOverlay('button')[1];
      expect(replaceButton).not.toBeNull();
      // Hier wird toContain verwendet, da im Safari ein Zeilenumbruch im String entsteht, der zu einem Fehler führt
      expect(replaceButton.innerText.toLowerCase()).toContain('ersetzen');

      replaceButton.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);
      expect(testComponent.selected()![0].name).toEqual('mockfile1.txt');
      expect(testComponent.selected()![0].content).toEqual(base64Dummy);
      expect(fileComponent.value()![0].name).toEqual('mockfile1.txt');
      expect(fileComponent.value()![0].content).toEqual(base64Dummy);

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte Image-Preview für Bilder anzeigen', async () => {
      // Vorbedingungen testen
      const localFixture = TestBed.createComponent(FileComponent);
      const localTestComponent = localFixture.componentInstance;
      const localFileComponent = localFixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      localFileComponent['liveAnnouncer'] = { announce: () => {} } as any;
      // Wir mocken hier den FileReader weg, da er nicht mit fakeAsync kompatibel ist
      vi.spyOn(localFileComponent, 'readFile').mockResolvedValue('data:image/png;base64-dummy');
      // Den read-Delay für die Ladeanzeige mocken (Standard: 1000ms), sonst greift LuxTestHelper.wait() nicht rechtzeitig
      localFileComponent.defaultReadFileDelay = 0;
      await LuxTestHelper.wait(localFixture);

      localTestComponent.multiple.set(true);
      await LuxTestHelper.wait(localFixture);
      localFileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      await LuxTestHelper.wait(localFixture);

      expect(localFixture.debugElement.queryAll(By.css('img')).length).toBe(0);

      // Änderungen durchführen
      localTestComponent.showPreview.set(true);
      await LuxTestHelper.wait(localFixture);

      // Nachbedingungen prüfen
      expect(localFixture.debugElement.queryAll(By.css('img')).length).toBe(1);
    });

    it('Sollte den Base64-String via Base64-Callback füllen', async () => {
      // Vorbedingungen testen
      testComponent.selected.set([
        {
          name: 'mockfile.txt',
          type: 'text/txt',
          contentCallback: () => 'callback base64-dummy'
        }
      ]);
      await LuxTestHelper.wait(fixture);

      expect(fixture.debugElement.query(By.css('.lux-file-list-entry-label')).nativeElement.textContent.trim()).toEqual('mockfile.txt');
      expect(fileComponent.value()![0].name).toEqual('mockfile.txt');
      expect(fileComponent.value()![0].content).toEqual(undefined);

      // Änderungen durchführen
      fixture.debugElement.queryAll(By.css('button[aria-label="Anzeigen"]'))[0].nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-file-list-entry-label')).nativeElement.textContent.trim()).toEqual('mockfile.txt');
      expect(fileComponent.value()![0].name).toEqual('mockfile.txt');
      expect(fileComponent.value()![0].content).toEqual('callback base64-dummy');
    });

    it('Sollte statt des Base64-Strings den Dateityp Blob nutzen', async () => {
      // Vorbedingungen testen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      await LuxTestHelper.wait(fixture);

      expect(typeof fileComponent.value()![0].content).toEqual('string');

      // Änderungen durchführen
      testComponent.contentsAsBlob.set(true);
      await LuxTestHelper.wait(fixture);
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      await LuxTestHelper.wait(fixture);

      const replaceButton = overlayHelper.selectAllFromOverlay('button')[1];
      expect(replaceButton).not.toBeNull();
      // Hier wird toContain verwendet, da im Safari ein Zeilenumbruch im String entsteht, der zu einem Fehler führt
      expect(replaceButton.innerText.toLowerCase()).toContain('ersetzen');

      replaceButton.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.value()![0].content instanceof Blob).toBe(true);
    });

    it('Sollte eine Datei auswählen, löschen und erneut auswählen können', async () => {
      // Vorbedingungen testen
      const spy = vi.spyOn(testComponent, 'selectedChange');
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      await LuxTestHelper.wait(fixture);

      expect(fileComponent.value()![0].name).toEqual('mockfile1.png');
      expect(fileComponent.value()![0].content).toEqual(base64Dummy);
      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      fixture.debugElement.query(By.css('button[aria-label="Löschen"]')).nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.value()).toEqual([]);
      expect(spy).toHaveBeenCalledTimes(2);

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.value()![0].name).toEqual('mockfile1.png');
      expect(fileComponent.value()![0].content).toEqual(base64Dummy);
      expect(spy).toHaveBeenCalledTimes(3);

      await LuxTestHelper.wait(fixture);
    });

    describe('Sollte die Events mit passenden Werten emitten,', () => {
      it('wenn Dateien korrekt selektiert wurden', async () => {
        // Vorbedingungen testen
        const selectedChange = vi.spyOn(testComponent, 'selectedChange');
        testComponent.multiple.set(true);
        await LuxTestHelper.wait(fixture);

        expect(selectedChange).toHaveBeenCalledTimes(0);

        // Änderungen durchführen
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(selectedChange).toHaveBeenCalledTimes(1);
        expect((testComponent.selected()![0] as any).name).toEqual('mockfile1.txt');
        expect((testComponent.selected()![0] as any).content).toEqual(base64Dummy);

        // Änderungen durchführen
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(selectedChange).toHaveBeenCalledTimes(2);
        expect(testComponent.selected()![0].name).toEqual('mockfile1.txt');
        expect(testComponent.selected()![0].content).toEqual(base64Dummy);
        expect(testComponent.selected()![1].name).toEqual('mockfile2.txt');
        expect(testComponent.selected()![1].content).toEqual(base64Dummy);

        await LuxTestHelper.wait(fixture);
      });

      it('wenn ein Fehler aufgetreten ist', async () => {
        // Der Fehlerpfad wird hier absichtlich ausgelöst; ohne Spy landet der Fehler roh in der
        // Testausgabe und sieht dort wie ein echter Testfehler aus.
        vi.spyOn(console, 'error').mockReturnValue(undefined);
        // Vorbedingungen testen
        const selectedChange = vi.spyOn(testComponent, 'selectedChange').mockReturnValue(undefined);
        const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];

        await LuxTestHelper.wait(fixture);

        expect(selectedChange).toHaveBeenCalledTimes(0);

        // Änderungen durchführen
        testComponent.accept.set('.pdf');
        await LuxTestHelper.wait(fixture);
        fileComponent.selectFiles(files);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(selectedChange).toHaveBeenCalledTimes(0);
      });
    });

    describe('Sollte eine passende Fehlermeldung abgeben,', () => {
      it('wenn die maximale Dateigröße überschritten wird', async () => {
        // Der Fehlerpfad wird hier absichtlich ausgelöst; ohne Spy landet der Fehler roh in der
        // Testausgabe und sieht dort wie ein echter Testfehler aus.
        vi.spyOn(console, 'error').mockReturnValue(undefined);
        // Vorbedingungen testen
        testComponent.multiple.set(true);
        await LuxTestHelper.wait(fixture);
        let files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
        // wir mocken erstmal 2 MB Dateigröße
        vi.spyOn(files[0], 'size', 'get').mockReturnValue(200000);

        fileComponent.selectFiles(files);
        await LuxTestHelper.wait(fixture);

        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fileComponent.value()).toBeTruthy();
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

        // Änderungen durchführen
        testComponent.maxSizeMiB.set(5);
        await LuxTestHelper.wait(fixture);

        files = [LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')];
        // wir mocken hier jetzt 20 MB Dateigröße
        vi.spyOn(files[0], 'size', 'get').mockReturnValue(20971520);

        fileComponent.selectFiles(files);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).not.toBeNull();
        expect(fileComponent.formControl.errors![LuxFileErrorCause.MaxSizeError]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fileComponent.value()![0].name).toEqual('mockfile1.txt');
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Die Datei "mockfile2.txt" überschreitet mit 20 MB die erlaubte Dateigröße von 5 MB'
        );
      });

      it('die luxUploadUrl nicht erreichbar ist', async () => {
        // Der Fehlerpfad wird hier absichtlich ausgelöst; ohne Spy landet der Fehler roh in der
        // Testausgabe und sieht dort wie ein echter Testfehler aus.
        vi.spyOn(console, 'error').mockReturnValue(undefined);
        // Vorbedingungen testen
        const httpClient = fixture.debugElement.injector.get(HttpClient);
        const spy = vi.spyOn(httpClient, 'post').mockReturnValue(throwError('404'));
        const spyLog = vi.spyOn(fileComponent, 'logError').mockReturnValue(undefined);
        testComponent.multiple.set(true);
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
        await LuxTestHelper.wait(fixture);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

        // Änderungen durchführen
        testComponent.uploadUrl.set('/test/api/');
        await LuxTestHelper.wait(fixture);
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spyLog).toHaveBeenCalledTimes(1);
        expect(fileComponent.formControl.errors).not.toBeNull();
        expect(fileComponent.formControl.errors![LuxFileErrorCause.UploadFileError]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fileComponent.value()![0].name).toEqual('mockfile1.txt');
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Das Hochladen der Datei ist fehlgeschlagen'
        );
      });

      it('wenn luxMultiple false ist und n > 1 Dateien ausgewählt werden', async () => {
        // Vorbedingungen testen
        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();
        expect(fileComponent.value()).toBeFalsy();

        // Änderungen durchführen
        const files = [
          LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
          LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
        ];
        fileComponent.selectFiles(files);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).not.toBeNull();
        expect(fileComponent.formControl.errors![LuxFileErrorCause.MultipleForbidden]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fileComponent.value()).toBeFalsy();
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Es darf nur eine Datei ausgewählt werden'
        );

        // Änderungen durchführen
        fileComponent.selectFiles([files[0]]);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();
        expect(fileComponent.value()).toBeTruthy();

        // Änderungen durchführen
        testComponent.multiple.set(true);
        await LuxTestHelper.wait(fixture);
        fileComponent.selectFiles(files);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();
        expect(fileComponent.value()).toBeTruthy();

        await LuxTestHelper.wait(fixture);
      });

      it('wenn ein Dateityp sich in der Groß- und Kleinschreibung unterscheidet', async () => {
        // Vorbedingungen testen
        await LuxTestHelper.wait(fixture);
        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

        // Änderungen durchführen,
        testComponent.accept.set('.html,.pdf,image/*,.txt');
        testComponent.multiple.set(true);
        await LuxTestHelper.wait(fixture);

        // Änderungen durchführen,
        fileComponent.selectFiles([
          LuxTestHelper.createFileBrowserSafe('mockfile1.PDF', 'text/Pdf'),
          LuxTestHelper.createFileBrowserSafe('mockfile2.Txt', 'text/plain'),
          LuxTestHelper.createFileBrowserSafe('mockfile3.PnG', 'image/pnG')
        ]);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

        await LuxTestHelper.wait(fixture);
      });

      it('wenn ein Dateityp nicht unter luxAccept geführt wird', async () => {
        // Der Fehlerpfad wird hier absichtlich ausgelöst; ohne Spy landet der Fehler roh in der
        // Testausgabe und sieht dort wie ein echter Testfehler aus.
        vi.spyOn(console, 'error').mockReturnValue(undefined);
        // Vorbedingungen testen
        await LuxTestHelper.wait(fixture);
        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

        // Änderungen durchführen,
        testComponent.accept.set('.html,.pdf,/image/*');
        await LuxTestHelper.wait(fixture);
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile.txt', 'text/txt')]);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).not.toBeNull();
        expect(fileComponent.formControl.errors![LuxFileErrorCause.FileNotAccepted]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Die Datei "mockfile.txt" hat einen nicht akzeptierten Dateityp'
        );

        // Änderungen durchführen,
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.pdf', 'text/pdf')]);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

        await LuxTestHelper.wait(fixture);
      });
    });

    describe('Sollte Action-Konfigurationen korrekt behandeln', () => {
      beforeEach(() => {
        testComponent.multiple.set(true);
        overlayHelper = new LuxOverlayHelper();
        fixture.detectChanges();
      });

      describe('[uploadActionConfig]', () => {
        it('Sollte die Upload-Buttons verstecken', async () => {
          // Vorbedingungen testen
          testComponent.multiple.set(true);
          await LuxTestHelper.wait(fixture);
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          await LuxTestHelper.wait(fixture);

          expect(fixture.debugElement.query(By.css('.lux-file-list-header-add'))).not.toBeNull();
          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="hochladen" i]')).length).toBe(3);

          // Änderungen durchführen
          testComponent.uploadActionConfig.set({ ...testComponent.uploadActionConfig(), hidden: true });
          testComponent.uploadActionConfig.set({ ...testComponent.uploadActionConfig(), hiddenHeader: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('.lux-file-list-header-add'))).toBeNull();
          const debugElements = fixture.debugElement.queryAll(By.css('button[aria-label*="hochladen" i]'));
          debugElements.forEach((debugElement) => {
            expect(debugElement.nativeElement.classList.toString()).toContain('lux-display-none');
          });
        });

        it('Sollte die Upload-Buttons deaktivieren', async () => {
          // Vorbedingungen testen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          expect(fixture.debugElement.query(By.css('lux-button.lux-file-list-header-add button')).nativeElement.disabled).toBe(false);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label="Hochladen"]'))[0].nativeElement.disabled).toBe(false);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label="Hochladen"]'))[1].nativeElement.disabled).toBe(false);

          // Änderungen durchführen
          testComponent.uploadActionConfig.set({ ...testComponent.uploadActionConfig(), disabled: true });
          testComponent.uploadActionConfig.set({ ...testComponent.uploadActionConfig(), disabledHeader: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('lux-button.lux-file-list-header-add button')).nativeElement.disabled).toBe(true);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label="Hochladen"]'))[0].nativeElement.disabled).toBe(true);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label="Hochladen"]'))[1].nativeElement.disabled).toBe(true);
        });

        it('Sollte den Callback aufrufen und die Datei ersetzen', async () => {
          // Vorbedingungen testen
          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          const spy = vi.spyOn<ILuxFilesListActionConfig, any>(testComponent.uploadActionConfig(), 'onClick').mockReturnValue(undefined);
          await LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.value());

          // Änderungen durchführen
          fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
          await LuxTestHelper.wait(fixture);

          const replaceButton = overlayHelper.selectAllFromOverlay('button')[1];
          expect(replaceButton).not.toBeNull();
          // Hier wird toContain verwendet, da im Safari ein Zeilenumbruch im String entsteht, der zu einem Fehler führt
          expect(replaceButton.innerText.toLowerCase()).toContain('ersetzen');

          replaceButton.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(2);
          expect(spy).toHaveBeenCalledWith(fileComponent.value());

          await LuxTestHelper.wait(fixture);
        });

        it('Sollte den Callback aufrufen und die Datei nicht ersetzen', async () => {
          // Vorbedingungen testen
          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          const spy = vi.spyOn<ILuxFilesListActionConfig, any>(testComponent.uploadActionConfig(), 'onClick').mockReturnValue(undefined);
          await LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.value());

          // Änderungen durchführen
          fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
          await LuxTestHelper.wait(fixture);

          const replaceButton = overlayHelper.selectAllFromOverlay('button')[0];
          expect(replaceButton).not.toBeNull();
          // Hier wird toContain verwendet, da im Safari ein Zeilenumbruch im String entsteht, der zu einem Fehler führt
          expect(replaceButton.innerText.toLowerCase()).toContain('abbrechen');

          replaceButton.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.value());

          await LuxTestHelper.wait(fixture);
        });
      });

      describe('[downloadActionConfig]', () => {
        it('Sollte die Download-Buttons verstecken', async () => {
          // Vorbedingungen testen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Downloaden" i]')).length).toBe(2);

          // Änderungen durchführen
          testComponent.downloadActionConfig.set({ ...testComponent.downloadActionConfig(), hidden: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          const debugElements = fixture.debugElement.queryAll(By.css('button[aria-label*="Downloaden" i]'));
          debugElements.forEach((debugElement) => {
            expect(debugElement.nativeElement.classList.toString()).toContain('lux-display-none');
          });
        });

        it('Sollte die Download-Buttons deaktivieren', async () => {
          // Vorbedingungen testen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          expect(fixture.debugElement.queryAll(By.css('button[aria-label="Downloaden"]'))[0].nativeElement.disabled).toBe(false);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label="Downloaden"]'))[1].nativeElement.disabled).toBe(false);

          // Änderungen durchführen
          testComponent.downloadActionConfig.set({ ...testComponent.downloadActionConfig(), disabled: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.queryAll(By.css('button[aria-label="Downloaden"]'))[0].nativeElement.disabled).toBe(true);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label="Downloaden"]'))[1].nativeElement.disabled).toBe(true);
        });

        it('Sollte den Callback aufrufen', async () => {
          // Vorbedingungen testen
          // den Download für den Test verhindern
          vi.spyOn(fileComponent.downloadLink().nativeElement, 'click').mockReturnValue(undefined);

          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          const spy = vi.spyOn<ILuxFileActionConfig, any>(testComponent.downloadActionConfig(), 'onClick').mockReturnValue(undefined);
          await LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);
          fixture.debugElement.queryAll(By.css('button[aria-label="Downloaden"]'))[0].nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.value()![0]);

          // Änderungen durchführen
          fixture.debugElement.queryAll(By.css('button[aria-label="Downloaden"]'))[1].nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(2);
          expect(spy).toHaveBeenCalledWith(fileComponent.value()![1]);
        });
      });

      describe('[deleteActionConfig]', () => {
        it('Sollte die Delete-Buttons verstecken', async () => {
          // Vorbedingungen testen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          expect(fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear'))).not.toBeNull();
          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Löschen"]')).length).toBe(2);

          // Änderungen durchführen
          testComponent.deleteActionConfig.set({ ...testComponent.deleteActionConfig(), hidden: true });
          testComponent.deleteActionConfig.set({ ...testComponent.deleteActionConfig(), hiddenHeader: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          const debugElements = fixture.debugElement.queryAll(By.css('button[aria-label*="Löschen"]'));
          debugElements.forEach((debugElement) => {
            expect(debugElement.nativeElement.classList.toString()).toContain('lux-display-none');
          });
        });

        it('Sollte die Delete-Buttons deaktivieren', async () => {
          // Vorbedingungen testen
          expect(fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear button')).nativeElement.disabled).toBe(true);

          // Änderungen durchführen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear button')).nativeElement.disabled).toBe(false);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Löschen"]'))[0].nativeElement.disabled).toBe(false);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Löschen"]'))[1].nativeElement.disabled).toBe(false);

          // Änderungen durchführen
          testComponent.deleteActionConfig.set({ ...testComponent.deleteActionConfig(), disabled: true });
          testComponent.deleteActionConfig.set({ ...testComponent.deleteActionConfig(), disabledHeader: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear button')).nativeElement.disabled).toBe(true);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Löschen"]'))[0].nativeElement.disabled).toBe(true);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Löschen"]'))[1].nativeElement.disabled).toBe(true);
        });

        it('Sollte den Callback aufrufen', async () => {
          // Vorbedingungen testen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          const spy = vi.spyOn<ILuxFileActionConfig, any>(testComponent.deleteActionConfig(), 'onClick').mockReturnValue(undefined);
          await LuxTestHelper.wait(fixture);
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);
          expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry')).length).toBe(2);

          // Änderungen durchführen
          fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear button')).nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(2);
          expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry')).length).toBe(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);
          fixture.debugElement.queryAll(By.css('button[aria-label*="Löschen"]'))[0].nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(3);
          expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry')).length).toBe(1);

          // Änderungen durchführen
          fixture.debugElement.queryAll(By.css('button[aria-label*="Löschen"]'))[0].nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(4);
          expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry')).length).toBe(0);
        });
      });

      describe('[viewActionConfig]', () => {
        it('Sollte die View-Buttons verstecken', async () => {
          // Vorbedingungen testen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Anzeigen"]')).length).toBe(2);

          // Änderungen durchführen
          testComponent.viewActionConfig.set({ ...testComponent.viewActionConfig(), hidden: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          const debugElements = fixture.debugElement.queryAll(By.css('button[aria-label*="Anzeigen"]'));
          debugElements.forEach((debugElement) => {
            expect(debugElement.nativeElement.classList.toString()).toContain('lux-display-none');
          });
        });

        it('Sollte die View-Buttons deaktivieren', async () => {
          // Vorbedingungen testen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Anzeigen"]'))[0].nativeElement.disabled).toBe(false);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Anzeigen"]'))[1].nativeElement.disabled).toBe(false);

          // Änderungen durchführen
          testComponent.viewActionConfig.set({ ...testComponent.viewActionConfig(), disabled: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Anzeigen"]'))[0].nativeElement.disabled).toBe(true);
          expect(fixture.debugElement.queryAll(By.css('button[aria-label*="Anzeigen"]'))[1].nativeElement.disabled).toBe(true);
        });

        it('Sollte den Callback aufrufen', async () => {
          // Vorbedingungen testen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          const spy = vi.spyOn<ILuxFileActionConfig, any>(testComponent.viewActionConfig(), 'onClick').mockReturnValue(undefined);
          await LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);
          fixture.debugElement.queryAll(By.css('button[aria-label*="Anzeigen"]'))[0].nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.value()![0]);

          // Änderungen durchführen
          fixture.debugElement.queryAll(By.css('button[aria-label*="Anzeigen"]'))[1].nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(2);
          expect(spy).toHaveBeenCalledWith(fileComponent.value()![1]);
        });
      });
    });
  });
});

@Component({
  template: `
    <lux-file-list
      [luxLabel]="label()"
      [luxHint]="hint()"
      [luxRequired]="required()"
      [luxReadonly]="readonly()"
      [luxDisabled]="disabled()"
      [luxAccept]="accept()"
      [luxCapture]="capture"
      [luxMaxSizeMiB]="maxSizeMiB()"
      [luxUploadUrl]="uploadUrl()"
      [luxSelected]="selected()"
      [luxShowPreview]="showPreview()"
      [luxMultiple]="multiple()"
      [luxMaxFileCount]="maxFileCount()"
      [luxUploadActionConfig]="uploadActionConfig()"
      [luxDownloadActionConfig]="downloadActionConfig()"
      [luxDeleteActionConfig]="deleteActionConfig()"
      [luxViewActionConfig]="viewActionConfig()"
      [luxContentsAsBlob]="contentsAsBlob()"
      (luxSelectedChange)="selectedChange($event)"
    >
    </lux-file-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxFileListComponent]
})
class FileComponent {
  label = signal<string>('');
  hint = signal<string>('');
  required = signal<boolean>(false);
  readonly = signal<boolean>(false);
  disabled = signal<boolean>(false);
  accept = signal<string | undefined>(undefined);
  capture = '';
  iconName?: string;
  maxSizeMiB = signal(10);
  uploadUrl = signal<string>('');
  showPreview = signal<boolean>(false);
  multiple = signal<boolean>(false);
  maxFileCount = signal(100);
  contentsAsBlob = signal<boolean>(false);

  selected = signal<ILuxFileObject[] | null>(null);

  uploadActionConfig = signal<ILuxFilesListActionConfig>({
    disabled: false,
    disabledHeader: false,
    hidden: false,
    hiddenHeader: false,
    iconName: 'lux-programming-cloud-upload',
    iconNameHeader: 'lux-programming-cloud-upload',
    label: 'Hochladen',
    labelHeader: 'Neue Dateien hochladen',
    onClick: () => null
  });
  deleteActionConfig = signal<ILuxFileListActionConfig>({
    disabled: false,
    disabledHeader: false,
    hidden: false,
    hiddenHeader: false,
    iconName: 'lux-interface-delete-bin-5',
    iconNameHeader: 'lux-interface-delete-bin-5',
    label: 'Löschen',
    labelHeader: 'Alle Dateien entfernen',
    onClick: () => null
  });
  viewActionConfig = signal<ILuxFileActionConfig>({
    disabled: false,
    hidden: false,
    iconName: 'lux-interface-edit-view',
    label: 'Anzeigen',
    onClick: () => null
  });
  downloadActionConfig = signal<ILuxFileActionConfig>({
    disabled: false,
    hidden: false,
    iconName: 'lux-interface-download-button-2',
    label: 'Downloaden',
    onClick: () => null
  });

  selectedChange(files: ILuxFileObject[] | null) {
    this.selected.set(files);
  }
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-file-list
        [luxLabel]="label"
        [luxHint]="hint"
        [luxControlBinding]="'file'"
        [luxReadonly]="readonly"
        [luxDisabled]="disabled"
        [luxAccept]="accept"
        [luxCapture]="capture"
        [luxMultiple]="multiple()"
        [luxMaxSizeMiB]="maxSizeMiB"
        [luxUploadUrl]="uploadUrl"
      >
      </lux-file-list>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxFileListComponent]
})
class FileFormComponent {
  form: FormGroup;
  formControl: AbstractControl<ILuxFileObject[] | null>;

  label = '';
  hint = '';
  readonly = false;
  disabled = false;
  accept?: string;
  capture = '';
  iconName?: string;
  maxSizeMiB = 10;
  uploadUrl = '';
  multiple = signal<boolean>(false);

  constructor() {
    this.form = new FormGroup({
      file: new FormControl<ILuxFileObject[] | null>(null)
    });
    this.formControl = this.form.get('file')!;
  }
}

class MockStorage {
  getItem(key: string): string {
    return '';
  }

  setItem(key: string, value: string, sensitive: boolean) {}

  removeItem(key: string) {}
}

const base64Dummy = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABLCAIAAAAJerXgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANbSURBVHhe7ZrLkeIwFEUnlolnyqF4RxgkQAqsJgDKWy+cABs2riIAJ0DLepJl/Yyu+TTtvqe0aNwP8XRaelYb/bmRYigLgLIAKAuAsgAoC4CyACgLgLIAKAuAsgAoC+Atsob+Yn56Hiv6HI7V/39/u9a8xMnJaneqX79Vzf5w7c3vy7nu9dv3J/P6Gazr88Wy6qrb76Q1RtnuaiJKkYE1x2dOrnV9vliW96e7vGLY7+SdsjIXfw6fIOtyPU6LVK3c3bn1pl4qxeAtVWffooOrs6qM/aGrXZ9BrcwMe0UmEMgyPOvsg2HLRVvdxmxUmy/VOEVTnm1BbGoXL7JMPxJglGmDltSw12QCghX4qvMLlny8V8X6UzdGuvtAmGJ/GLuqD4N57SHBOt71Gd/74mGvyQRmWVbc1Nx2f+EwGyHIKUyxQJY3ZoW8ZWnYqzKBQZbh1cxtm5MZg5t9punl4K8sL0W3DNtLoCwzHnHhVmIYtjYTEKjABxsck2K6LaboVeJmf5qUZcYj9eiurHT7Nlnyeea6pJhZUBMLKQ6qrJiqbDrJBJfNrAcyKeMRWZlKEXAvRZk1ppN0sJk4cM0KeK8sc39xn5fZ06tVll9Z7W6+7oJxSrCOn/pM/OcQD3tNJjDLsmZbB7dz8QwafWqNNLOaujQLpGcbL7UmKCtNrT+r1gFRh4rUsPFMYJZl+a2J9sSa8S7p6mutcj0NixvIoZ3vzt32XTEFD2oC2hh/Jo5khg1nApKT9U08PJ6XQlkAlAVAWQAfJuuzoSwAygKgLADKAqAsAMoCoCwAygJ4WFZwQKNwCy5h0eOnDycnK/GIpooPhpivHmZPuH6xrPB7Q9W8h3AlzzCTbFGW91C06GAIZVmSF30oyxJdjNWkZfWns32Er5b2ub1sXlbiYEiZLPtVgvcFxNi2JavsYMiyrMQdUzrfmqy4eQdDSmTJtPIODCkkbMvLMDwYUiIr88X65mWNBLsHytJkZMkgp+uUpXmWLP8ow8QvkBUdDCmQlf2XKLj4E1iWde9gSIkse2BovJOOWxC9z2r0XmRbsvwWHwwpkqWYDq2pJpsPbXArskgCygKgLADKAqAsAMoCoCwAygKgLADKAqAsAMoCoCwAygKgLADKAqAsAMoq5nb7AliHaouRRXA9AAAAAElFTkSuQmCC`;
