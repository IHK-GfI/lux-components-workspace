// noinspection DuplicatedCode

import { HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { of, throwError } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../../lux-util/lux-console.service';
import { LuxStorageService } from '../../../lux-util/lux-storage.service';
import { LuxFormFileBase } from '../../lux-form-model/lux-form-file-base.class';
import { ILuxFileActionConfig } from '../lux-file-model/lux-file-action-config.interface';
import { LuxFileErrorCause } from '../lux-file-model/lux-file-error.interface';
import { ILuxFileObject } from '../lux-file-model/lux-file-object.interface';
import { LuxFileInputComponent } from './lux-file-input.component';

describe('LuxFileInputComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
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
    let fileComponent: LuxFileInputComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(FileFormComponent);
      testComponent = fixture.componentInstance;
      fileComponent = fixture.debugElement.query(By.directive(LuxFileInputComponent)).componentInstance;

      // den LiveAnnouncer abklemmen
      fileComponent['liveAnnouncer'] = {
        announce: () => {}
      } as any;

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
      const localFileComponent = localFixture.debugElement.query(By.directive(LuxFileInputComponent)).componentInstance;

      expect(localFixture.debugElement.query(By.css('.lux-file-visible-input'))).toBeFalsy();
      expect(localTestComponent.formControl.value).toBeNull();
      expect(localFileComponent.value()).toBeNull();

      // Änderungen durchführen
      const fileObject = { name: 'mockfile.txt', type: 'text/txt', content: base64Dummy };
      localTestComponent.formControl.setValue(fileObject);
      await LuxTestHelper.wait(localFixture);

      // Nachbedingungen prüfen
      expect(localFixture.debugElement.query(By.css('.lux-file-visible-input')).nativeElement.value).toEqual('mockfile.txt');
      expect(localTestComponent.formControl.value).toEqual(fileObject);
      expect(localFileComponent.value()).toEqual(fileObject);
      expect(localFileComponent.formControl.value).toEqual(fileObject);
    });

    it('Sollte den Wert an das FormControl übergeben', async () => {
      // Vorbedingungen testen
      expect(testComponent.formControl.value).toBeFalsy();
      expect(fileComponent.formControl.value).toBeFalsy();

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.formControl.value.content).toEqual(base64Dummy);
      expect(fileComponent.formControl.value!.content).toEqual(base64Dummy);
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
    let fileComponent: LuxFileInputComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(FileComponent);
      testComponent = fixture.componentInstance;
      fileComponent = fixture.debugElement.query(By.directive(LuxFileInputComponent)).componentInstance;

      // den LiveAnnouncer abklemmen
      fileComponent['liveAnnouncer'] = {
        announce: () => {}
      } as any;

      // Wir mocken hier den FileReader weg, da er nicht mit fakeAsync kompatibel ist
      vi.spyOn(fileComponent, 'readFile').mockResolvedValue(base64Dummy);
      // Den read-Delay für die Ladeanzeige mocken
      fileComponent.defaultReadFileDelay = 0;
      fixture.detectChanges();
    });

    it('Sollte Label, Placeholder und Hint korrekt setzen', async () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-form-label-authentic'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.lux-file-visible-input')).nativeElement.placeholder).toEqual('');
      expect(fixture.debugElement.query(By.css('mat-hint'))).toBeNull();

      // Änderungen durchführen
      testComponent.label.set('Label');
      testComponent.hint.set('Hint');
      testComponent.placeholder.set('Placeholder');
      await LuxTestHelper.wait(fixture);

      // // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-form-label-authentic')).nativeElement.textContent.trim()).toEqual('Label');
      expect(fixture.debugElement.query(By.css('.lux-file-visible-input')).nativeElement.placeholder).toEqual('Placeholder');
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
      expect(fixture.debugElement.query(By.css('.lux-form-control-readonly-authentic'))).toBeNull();

      // Änderungen durchführen
      testComponent.readonly.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-form-control-readonly-authentic'))).not.toBeNull();
    });

    it('Sollte Drag-and-Drop deaktivieren', async () => {
      // Vorbedingungen testen
      const spyDrag = vi.spyOn(LuxFormFileBase.prototype, 'handleDragOver');
      const spyDrop = vi.spyOn(LuxFormFileBase.prototype, 'handleDrop');

      const fileInputNode = fixture.debugElement.query(By.css('lux-file-input')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(fileInputNode, 'dragover', true);
      await LuxTestHelper.wait(fixture);

      let mockDropEvent = LuxTestHelper.createDropEvent([{ name: 'mockfile1.txt', type: 'text/txt' }]);
      LuxTestHelper.dispatchEvent(fileInputNode, mockDropEvent);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spyDrag).toHaveBeenCalledTimes(1);
      expect(spyDrop).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      testComponent.dndActive.set(false);
      await LuxTestHelper.wait(fixture);

      LuxTestHelper.dispatchFakeEvent(fileInputNode, 'dragover', true);
      await LuxTestHelper.wait(fixture);
      mockDropEvent = LuxTestHelper.createDropEvent([{ name: 'mockfile1.txt', type: 'text/txt' }]);
      LuxTestHelper.dispatchEvent(fileInputNode, mockDropEvent);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spyDrag).toHaveBeenCalledTimes(1);
      expect(spyDrop).toHaveBeenCalledTimes(1);
      expect(testComponent.selected()!.name).toEqual('mockfile1.txt');
      expect(testComponent.selected()!.content).toEqual(base64Dummy);
      expect(fileComponent.value()!.name).toEqual('mockfile1.txt');
      expect(fileComponent.value()!.content).toEqual(base64Dummy);
    });

    it('Sollte die Dateien an die entsprechende luxUploadUrl hochladen', async () => {
      // Vorbedingungen testen
      const httpClient = fixture.debugElement.injector.get(HttpClient);
      const spy = vi.spyOn(httpClient, 'post').mockReturnValue(of());
      const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];

      fileComponent.selectFiles(files);
      await LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      testComponent.uploadUrl.set('/test/api/');
      await LuxTestHelper.wait(fixture);
      fileComponent.selectFiles(files);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(1);
      expect(fileComponent.value()).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.lux-file-visible-input')).nativeElement.value.trim()).toEqual('mockfile1.txt');
    });

    it('Sollte den Startwert korrekt setzen', async () => {
      // Vorbedingungen testen
      const localFixture = TestBed.createComponent(FileComponent);
      const localTestComponent = localFixture.componentInstance;
      const localFileComponent = localFixture.debugElement.query(By.directive(LuxFileInputComponent)).componentInstance;

      expect(localFixture.debugElement.query(By.css('.lux-file-visible-input'))).toBeFalsy();
      expect(localTestComponent.selected()).toBeNull();
      expect(localFileComponent.value()).toBeNull();

      // Änderungen durchführen
      const fileObject = { name: 'mockfile.txt', type: 'text/txt', content: base64Dummy };
      localTestComponent.selected.set(fileObject);
      await LuxTestHelper.wait(localFixture);

      // Nachbedingungen prüfen
      expect(localFixture.debugElement.query(By.css('.lux-file-visible-input')).nativeElement.value.trim()).toEqual('mockfile.txt');
      expect(localTestComponent.selected()).toEqual(fileObject);
      expect(localFileComponent.value()).toEqual(fileObject);
      expect(localFileComponent.formControl.value).toEqual(fileObject);
    });

    it('Sollte beim Klick auf den Entfernen-Button die Selektion leeren', async () => {
      // Vorbedingungen testen
      testComponent.selected.set({ name: 'mockfile.txt', type: 'text/txt', content: base64Dummy });
      await LuxTestHelper.wait(fixture);

      expect(fileComponent.value()).toEqual(testComponent.selected());
      expect(fixture.debugElement.query(By.css('.lux-file-visible-input')).nativeElement.value.trim()).toEqual('mockfile.txt');

      // Änderungen durchführen
      fixture.debugElement.query(By.css('button[aria-label="Löschen"]')).nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.value()).toBeNull();
      expect(fixture.debugElement.query(By.css('.lux-file-visible-input')).nativeElement.value.trim()).toEqual('');
    });

    it('Sollte den Base64-String via Base64-Callback füllen', async () => {
      // Vorbedingungen testen
      testComponent.selected.set({
        name: 'mockfile.txt',
        type: 'text/txt',
        contentCallback: () => 'callback base64-dummy'
      });
      await LuxTestHelper.wait(fixture);

      expect(fixture.debugElement.query(By.css('.lux-file-visible-input')).nativeElement.value.trim()).toEqual('mockfile.txt');
      expect(fileComponent.value()!.name).toEqual('mockfile.txt');
      expect(fileComponent.value()!.content).toEqual(undefined);

      // Änderungen durchführen
      fixture.debugElement.query(By.css('button[aria-label*="Anzeigen" i]')).nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-file-visible-input')).nativeElement.value.trim()).toEqual('mockfile.txt');
      expect(fileComponent.value()!.name).toEqual('mockfile.txt');
      expect(fileComponent.value()!.content).toEqual('callback base64-dummy');
    });

    it('Sollte statt des Base64-Strings den Dateityp Blob nutzen', async () => {
      // Vorbedingungen testen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      await LuxTestHelper.wait(fixture);

      expect(typeof fileComponent.value()!.content).toEqual('string');

      // Änderungen durchführen
      testComponent.contentsAsBlob.set(true);
      await LuxTestHelper.wait(fixture);
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.value()!.content instanceof Blob).toBe(true);
    });

    it('Sollte eine Datei auswählen, löschen und erneut auswählen können', async () => {
      // Vorbedingungen testen
      const spy = vi.spyOn(testComponent, 'selectedChange');
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);

      await LuxTestHelper.wait(fixture);

      expect(fileComponent.value()!.name).toEqual('mockfile1.png');
      expect(fileComponent.value()!.content).toEqual(base64Dummy);
      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      fixture.debugElement.query(By.css('button[aria-label*="Löschen" i]')).nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.value()).toBeNull();
      expect(spy).toHaveBeenCalledTimes(2);

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.value()!.name).toEqual('mockfile1.png');
      expect(fileComponent.value()!.content).toEqual(base64Dummy);
      expect(spy).toHaveBeenCalledTimes(3);

      await LuxTestHelper.wait(fixture);
    });

    describe('Sollte die Events mit passenden Werten emitten,', () => {
      it('wenn Dateien korrekt selektiert wurden', async () => {
        // Vorbedingungen testen
        const selectedChange = vi.spyOn(testComponent, 'selectedChange');
        const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];

        await LuxTestHelper.wait(fixture);

        expect(selectedChange).toHaveBeenCalledTimes(0);

        // Änderungen durchführen
        fileComponent.selectFiles(files);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(selectedChange).toHaveBeenCalledTimes(1);
        expect(testComponent.selected()!.name).toEqual('mockfile1.txt');
      });

      it('wenn ein Fehler aufgetreten ist', async () => {
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
      it('wenn die maximale Dateigröße überschritten wird (luxClearOnError = true)', async () => {
        // Vorbedingungen testen
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
        expect(fileComponent.value()).toBeNull();
        expect(fileComponent.formControl.value).toBeNull();
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Die Datei "mockfile2.txt" überschreitet mit 20 MB die erlaubte Dateigröße von 5 MB'
        );
      });

      it('wenn die maximale Dateigröße überschritten wird (luxClearOnError = false)', async () => {
        // Vorbedingungen testen
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
        testComponent.clearOnError.set(false);
        await LuxTestHelper.wait(fixture);

        files = [LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')];
        // wir mocken hier jetzt 20 MB Dateigröße
        vi.spyOn(files[0], 'size', 'get').mockReturnValue(20971520);

        fileComponent.selectFiles(files);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.luxClearOnError()).toBe(false);
        expect(fileComponent.formControl.errors).not.toBeNull();
        expect(fileComponent.formControl.errors![LuxFileErrorCause.MaxSizeError]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fileComponent.value()!.name).toBe('mockfile1.txt');
        expect(fileComponent.value()!.type).toBe('text/txt');
        expect(fileComponent.formControl.value!.name).toBe('mockfile1.txt');
        expect(fileComponent.formControl.value!.type).toBe('text/txt');
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Die Datei "mockfile2.txt" überschreitet mit 20 MB die erlaubte Dateigröße von 5 MB'
        );
      });

      it('die luxUploadUrl nicht erreichbar ist', async () => {
        // Vorbedingungen testen
        const httpClient = fixture.debugElement.injector.get(HttpClient);
        const spy = vi.spyOn(httpClient, 'post').mockReturnValue(throwError('404'));
        const spyLog = vi.spyOn(fileComponent, 'logError').mockReturnValue(undefined);
        const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];

        fileComponent.selectFiles(files);
        await LuxTestHelper.wait(fixture);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(fileComponent.formControl.errors).toBeNull();
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

        // Änderungen durchführen
        testComponent.uploadUrl.set('/test/api/');
        await LuxTestHelper.wait(fixture);
        fileComponent.selectFiles(files);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spyLog).toHaveBeenCalledTimes(1);
        expect(fileComponent.formControl.errors).not.toBeNull();
        expect(fileComponent.formControl.errors![LuxFileErrorCause.UploadFileError]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fileComponent.value()).toBeNull();
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Das Hochladen der Datei ist fehlgeschlagen'
        );
      });

      it('wenn ein Dateityp nicht unter luxAccept geführt wird', async () => {
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
      });
    });

    describe('Sollte Action-Konfigurationen korrekt behandeln', () => {
      beforeEach(async () => {});

      describe('[uploadActionConfig]', () => {
        it('Sollte den Upload-Button verstecken', async () => {
          // Vorbedingungen testen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Hochladen" i]'))).not.toBeNull();

          // Änderungen durchführen
          testComponent.uploadActionConfig.set({ ...testComponent.uploadActionConfig(), hidden: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Hochladen" i]'))).toBeNull();
        });

        it('Sollte den Upload-Button deaktivieren', async () => {
          // Vorbedingungen testen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Hochladen" i]')).nativeElement.disabled).toBe(false);

          // Änderungen durchführen
          testComponent.uploadActionConfig.set({ ...testComponent.uploadActionConfig(), disabled: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Hochladen" i]')).nativeElement.disabled).toBe(true);
        });

        it('Sollte den Callback aufrufen', async () => {
          // Vorbedingungen testen
          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          const spy = vi.spyOn<ILuxFileActionConfig, any>(testComponent.uploadActionConfig(), 'onClick').mockReturnValue(undefined);
          await LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.value());
        });
      });

      describe('[downloadActionConfig]', () => {
        it('Sollte den Download-Button verstecken', async () => {
          // Vorbedingungen testen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Downloaden" i]'))).not.toBeNull();

          // Änderungen durchführen
          testComponent.downloadActionConfig.set({ ...testComponent.downloadActionConfig(), hidden: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Downloaden" i]'))).toBeNull();
        });

        it('Sollte den Download-Button deaktivieren', async () => {
          // Vorbedingungen testen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Downloaden" i]')).nativeElement.disabled).toBe(true);

          // Änderungen durchführen
          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Downloaden" i]')).nativeElement.disabled).toBe(false);

          // Änderungen durchführen
          testComponent.downloadActionConfig.set({ ...testComponent.downloadActionConfig(), disabled: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Downloaden" i]')).nativeElement.disabled).toBe(true);
        });

        it('Sollte den Callback aufrufen', async () => {
          // Vorbedingungen testen
          // den Download für den Test verhindern
          vi.spyOn(fileComponent.downloadLink().nativeElement, 'click').mockReturnValue(undefined);

          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          const spy = vi.spyOn<ILuxFileActionConfig, any>(testComponent.downloadActionConfig(), 'onClick').mockReturnValue(undefined);
          await LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);
          fixture.debugElement.query(By.css('button[aria-label*="Downloaden" i]')).nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.value());
        });
      });

      describe('[deleteActionConfig]', () => {
        it('Sollte den Delete-Button verstecken', async () => {
          // Vorbedingungen testen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Löschen" i]'))).not.toBeNull();

          // Änderungen durchführen
          testComponent.deleteActionConfig.set({ ...testComponent.deleteActionConfig(), hidden: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Löschen" i]'))).toBeNull();
        });

        it('Sollte den Delete-Button deaktivieren', async () => {
          // Vorbedingungen testen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Löschen" i]')).nativeElement.disabled).toBe(true);

          // Änderungen durchführen
          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Löschen" i]')).nativeElement.disabled).toBe(false);

          // Änderungen durchführen
          testComponent.deleteActionConfig.set({ ...testComponent.deleteActionConfig(), disabled: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Löschen" i]')).nativeElement.disabled).toBe(true);
        });

        it('Sollte den Callback aufrufen', async () => {
          // Vorbedingungen testen
          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          const spy = vi.spyOn<ILuxFileActionConfig, any>(testComponent.deleteActionConfig(), 'onClick').mockReturnValue(undefined);
          await LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);
          fixture.debugElement.query(By.css('button[aria-label*="Löschen" i]')).nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });

      describe('[viewActionConfig]', () => {
        it('Sollte den View-Button verstecken', async () => {
          // Vorbedingungen testen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Anzeigen" i]'))).not.toBeNull();

          // Änderungen durchführen
          testComponent.viewActionConfig.set({ ...testComponent.viewActionConfig(), hidden: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Anzeigen" i]'))).toBeNull();
        });

        it('Sollte den View-Button deaktivieren', async () => {
          // Vorbedingungen testen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Anzeigen" i]')).nativeElement.disabled).toBe(true);

          // Änderungen durchführen
          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Anzeigen" i]')).nativeElement.disabled).toBe(false);

          // Änderungen durchführen
          testComponent.viewActionConfig.set({ ...testComponent.viewActionConfig(), disabled: true });
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('button[aria-label*="Anzeigen" i]')).nativeElement.disabled).toBe(true);
        });

        it('Sollte den Callback aufrufen', async () => {
          // Vorbedingungen testen
          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          const spy = vi.spyOn<ILuxFileActionConfig, any>(testComponent.viewActionConfig(), 'onClick').mockReturnValue(undefined);
          await LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          await LuxTestHelper.wait(fixture);
          fixture.debugElement.query(By.css('button[aria-label*="Anzeigen" i]')).nativeElement.click();
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.value());
        });
      });
    });
  });
});

@Component({
  selector: 'lux-file-component-test',
  template: `
    <lux-file-input
      [luxLabel]="label()"
      [luxPlaceholder]="placeholder()"
      [luxHint]="hint()"
      [luxRequired]="required()"
      [luxReadonly]="readonly()"
      [luxDisabled]="disabled()"
      [luxAccept]="accept()"
      [luxCapture]="capture"
      [luxDnDActive]="dndActive()"
      [luxMaxSizeMiB]="maxSizeMiB()"
      [luxUploadUrl]="uploadUrl()"
      [luxSelected]="selected()"
      [luxUploadActionConfig]="uploadActionConfig()"
      [luxDownloadActionConfig]="downloadActionConfig()"
      [luxDeleteActionConfig]="deleteActionConfig()"
      [luxViewActionConfig]="viewActionConfig()"
      [luxContentsAsBlob]="contentsAsBlob()"
      [luxClearOnError]="clearOnError()"
      (luxSelectedChange)="selectedChange($event)"
    >
    </lux-file-input>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxFileInputComponent]
})
class FileComponent {
  label = signal<string | undefined>(undefined);
  placeholder = signal<string | undefined>(undefined);
  hint = signal<string | undefined>(undefined);
  required = signal<boolean | undefined>(undefined);
  readonly = signal<boolean | undefined>(undefined);
  disabled = signal<boolean | undefined>(undefined);
  accept = signal<string | undefined>(undefined);
  capture?: string;
  dndActive = signal(true);
  iconName?: string;
  maxSizeMiB = signal(10);
  uploadUrl = signal<string | undefined>(undefined);
  contentsAsBlob = signal<boolean | undefined>(undefined);
  clearOnError = signal(true);

  selected = signal<ILuxFileObject | null>(null);

  uploadActionConfig = signal<ILuxFileActionConfig>({
    disabled: false,
    hidden: false,
    iconName: 'lux-programming-cloud-upload',
    label: 'Hochladen',
    onClick: () => null
  });
  deleteActionConfig = signal<ILuxFileActionConfig>({
    disabled: false,
    hidden: false,
    iconName: 'lux-interface-delete-bin-5',
    label: 'Löschen',
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

  selectedChange(file: ILuxFileObject) {
    this.selected.set(file);
  }
}

@Component({
  selector: 'lux-file-component-form-test',
  template: `
    <div [formGroup]="form">
      <lux-file-input
        [luxLabel]="label"
        [luxPlaceholder]="placeholder"
        [luxHint]="hint"
        [luxControlBinding]="'file'"
        [luxReadonly]="readonly"
        [luxDisabled]="disabled"
        [luxAccept]="accept"
        [luxCapture]="capture"
        [luxDnDActive]="dndActive"
        [luxMaxSizeMiB]="maxSizeMiB"
        [luxUploadUrl]="uploadUrl"
        [luxClearOnError]="clearOnError"
      >
      </lux-file-input>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxFileInputComponent]
})
class FileFormComponent {
  form: FormGroup;
  formControl: AbstractControl;

  label?: string;
  placeholder?: string;
  hint?: string;
  readonly?: boolean;
  disabled?: boolean;
  accept?: string;
  capture?: string;
  dndActive = true;
  iconName?: string;
  maxSizeMiB = 10;
  uploadUrl?: string;
  clearOnError = true;

  constructor() {
    this.form = new FormGroup({
      file: new FormControl<ILuxFileObject | null>(null)
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
