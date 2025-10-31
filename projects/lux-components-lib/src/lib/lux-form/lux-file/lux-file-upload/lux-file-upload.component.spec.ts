import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideLuxTranslocoTesting } from '../../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../../lux-util/lux-console.service';
import { LuxStorageService } from '../../../lux-util/lux-storage.service';
import { LuxTestHelper } from '../../../lux-util/testing/lux-test-helper';
import { LuxOverlayHelper } from '../../../lux-util/testing/lux-test-overlay-helper';
import { ILuxFileActionConfig } from '../lux-file-model/lux-file-action-config.interface';
import { LuxFileErrorCause } from '../lux-file-model/lux-file-error.interface';
import { ILuxFileListActionConfig, ILuxFilesListActionConfig } from '../lux-file-model/lux-file-list-action-config.interface';
import { ILuxFileObject } from '../lux-file-model/lux-file-object.interface';
import { LuxFileUploadComponent } from './lux-file-upload.component';

describe('LuxFileUploadComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        LuxConsoleService,
        {
          provide: LuxStorageService,
          useClass: MockStorage
        }
      ]
    }).compileComponents();
  });

  describe('[Allgemein]', () => {
    let fixture: ComponentFixture<FileComponent>;
    let testComponent: FileComponent;
    let fileComponent: LuxFileUploadComponent;
    let overlayHelper: LuxOverlayHelper;

    beforeEach(() => {
      fixture = TestBed.createComponent(FileComponent);
      testComponent = fixture.componentInstance;
      fileComponent = fixture.debugElement.query(By.directive(LuxFileUploadComponent)).componentInstance;

      // den LiveAnnouncer abklemmen
      fileComponent['liveAnnouncer'] = { announce: () => {} } as any;

      // Wir mocken hier den FileReader weg, da er nicht mit fakeAsync kompatibel ist
      spyOn(fileComponent, 'readFile').and.returnValue(Promise.resolve(base64Dummy));
      // Den read-Delay für die Ladeanzeige mocken
      fileComponent.defaultReadFileDelay = 0;
      overlayHelper = new LuxOverlayHelper();
      fixture.detectChanges();
    });

    it('Sollte die dynamische Änderung von luxMaxFileCount korrekt berücksichtigen', fakeAsync(() => {
      // Vorbedingungen: Maximal 1 Datei erlaubt
      fileComponent.luxMaxFileCount = 1;
      fileComponent.luxMultiple = true;
      fixture.detectChanges();

      // Eine Datei hinzufügen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      flush();
      LuxTestHelper.wait(fixture);
      expect(fileComponent.luxSelected!.length).toBe(1);
      expect(fileComponent.formControl.errors).toBeNull();

      // Versucht eine zweite Datei hinzuzufügen -> Error
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
      flush();
      LuxTestHelper.wait(fixture);
      expect(fileComponent.formControl.errors).not.toBeNull();
      expect(fileComponent.formControl.errors![LuxFileErrorCause.MaxFileCount]).toBeDefined();

      // MaxFileCount dynamisch erhöhen
      fileComponent.luxMaxFileCount = 2;
      fixture.detectChanges();

      // Fügt eine zweite Datei hinzu
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
      flush();
      LuxTestHelper.wait(fixture);

      // Jetzt sollten zwei Dateien erlaubt sein
      expect(fileComponent.luxSelected!.length).toBe(2);
      expect(fileComponent.formControl.errors).toBeNull();
    }));
  });
});

class MockStorage {
  getItem(key: string): string {
    return '';
  }

  setItem(key: string, value: string, sensitive: boolean) {}
}

@Component({
  template: `
    <lux-file-upload
      [luxLabel]="label"
      [luxHint]="hint"
      [luxRequired]="required"
      [luxReadonly]="readonly"
      [luxDisabled]="disabled"
      [luxAccept]="accept"
      [luxCapture]="capture"
      [luxMaxSizeMB]="maxSizeMb"
      [luxUploadUrl]="uploadUrl"
      [luxSelected]="selected"
      [luxMultiple]="multiple"
      [luxUploadActionConfig]="uploadActionConfig"
      [luxDownloadActionConfig]="downloadActionConfig"
      [luxDeleteActionConfig]="deleteActionConfig"
      [luxViewActionConfig]="viewActionConfig"
      [luxContentsAsBlob]="contentsAsBlob"
      (luxSelectedChange)="selectedChange($event)"
    >
    </lux-file-upload>
  `,
  imports: [LuxFileUploadComponent]
})
class FileComponent {
  label?: string;
  hint?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  accept?: string;
  capture?: string;
  iconName?: string;
  maxSizeMb = 10;
  uploadUrl?: string;
  multiple?: boolean;
  contentsAsBlob?: boolean;

  selected: ILuxFileObject[] | null = null;

  uploadActionConfig: ILuxFilesListActionConfig = {
    disabled: false,
    disabledHeader: false,
    hidden: false,
    hiddenHeader: false,
    iconName: 'lux-programming-cloud-upload',
    iconNameHeader: 'lux-programming-cloud-upload',
    label: 'Hochladen',
    labelHeader: 'Neue Dateien hochladen',
    onClick: () => null
  };
  deleteActionConfig: ILuxFileListActionConfig = {
    disabled: false,
    disabledHeader: false,
    hidden: false,
    hiddenHeader: false,
    iconName: 'lux-interface-delete-bin-5',
    iconNameHeader: 'lux-interface-delete-bin-5',
    label: 'Löschen',
    labelHeader: 'Alle Dateien entfernen',
    onClick: () => null
  };
  viewActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: false,
    iconName: 'lux-interface-edit-view',
    label: 'Anzeigen',
    onClick: () => null
  };
  downloadActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: false,
    iconName: 'lux-interface-download-button-2',
    label: 'Downloaden',
    onClick: () => null
  };

  selectedChange(files: ILuxFileObject[] | null) {
    this.selected = files;
  }
}

const base64Dummy = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABLCAIAAAAJerXgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANbSURBVHhe7ZrLkeIwFEUnlolnyqF4RxgkQAqsJgDKWy+cABs2riIAJ0DLepJl/Yyu+TTtvqe0aNwP8XRaelYb/bmRYigLgLIAKAuAsgAoC4CyACgLgLIAKAuAsgAoC+Atsob+Yn56Hiv6HI7V/39/u9a8xMnJaneqX79Vzf5w7c3vy7nu9dv3J/P6Gazr88Wy6qrb76Q1RtnuaiJKkYE1x2dOrnV9vliW96e7vGLY7+SdsjIXfw6fIOtyPU6LVK3c3bn1pl4qxeAtVWffooOrs6qM/aGrXZ9BrcwMe0UmEMgyPOvsg2HLRVvdxmxUmy/VOEVTnm1BbGoXL7JMPxJglGmDltSw12QCghX4qvMLlny8V8X6UzdGuvtAmGJ/GLuqD4N57SHBOt71Gd/74mGvyQRmWVbc1Nx2f+EwGyHIKUyxQJY3ZoW8ZWnYqzKBQZbh1cxtm5MZg5t9punl4K8sL0W3DNtLoCwzHnHhVmIYtjYTEKjABxsck2K6LaboVeJmf5qUZcYj9eiurHT7Nlnyeea6pJhZUBMLKQ6qrJiqbDrJBJfNrAcyKeMRWZlKEXAvRZk1ppN0sJk4cM0KeK8sc39xn5fZ06tVll9Z7W6+7oJxSrCOn/pM/OcQD3tNJjDLsmZbB7dz8QwafWqNNLOaujQLpGcbL7UmKCtNrT+r1gFRh4rUsPFMYJZl+a2J9sSa8S7p6mutcj0NixvIoZ3vzt32XTEFD2oC2hh/Jo5khg1nApKT9U08PJ6XQlkAlAVAWQAfJuuzoSwAygKgLADKAqAsAMoCoCwAygJ4WFZwQKNwCy5h0eOnDycnK/GIpooPhpivHmZPuH6xrPB7Q9W8h3AlzzCTbFGW91C06GAIZVmSF30oyxJdjNWkZfWns32Er5b2ub1sXlbiYEiZLPtVgvcFxNi2JavsYMiyrMQdUzrfmqy4eQdDSmTJtPIODCkkbMvLMDwYUiIr88X65mWNBLsHytJkZMkgp+uUpXmWLP8ow8QvkBUdDCmQlf2XKLj4E1iWde9gSIkse2BovJOOWxC9z2r0XmRbsvwWHwwpkqWYDq2pJpsPbXArskgCygKgLADKAqAsAMoCoCwAygKgLADKAqAsAMoCoCwAygKgLADKAqAsAMoq5nb7AliHaouRRXA9AAAAAElFTkSuQmCC`;
