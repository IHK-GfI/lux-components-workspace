import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, importProvidersFrom, inject, TemplateRef, ViewChild } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigModule } from '../../lux-components-config/lux-components-config.module';
import { LuxTestHelper } from '../../lux-util/testing/lux-test-helper';
import { LuxOverlayHelper } from '../../lux-util/testing/lux-test-overlay-helper';
import { LuxDialogRef } from './lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogActionsComponent } from './lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from './lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from './lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from './lux-dialog-structure/lux-dialog-structure.component';
import { LuxDialogService } from './lux-dialog.service';

describe('LuxDialogService', () => {
  let fixture: ComponentFixture<MockDialogComponent>;
  let testComponent: MockDialogComponent;
  let overlayHelper: LuxOverlayHelper;
  let dialogRef: LuxDialogRef<void>;

  const waitForDialogClosure = () => {
    LuxTestHelper.wait(fixture);
    flush();
    discardPeriodicTasks();
    LuxTestHelper.wait(fixture);
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        importProvidersFrom([
          LuxComponentsConfigModule.forRoot({
            labelConfiguration: {
              allUppercase: true,
              notAppliedTo: []
            }
          })
        ]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDialogComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    overlayHelper = new LuxOverlayHelper();
    fixture.detectChanges();
  });

  afterEach(fakeAsync(() => {
    dialogRef.closeDialog(true);
    waitForDialogClosure();
  }));

  describe('[LuxDialogPresetComponent]', () => {
    it('Sollte den Dialog öffnen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({});
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
    }));

    it('Sollte den Titel setzen', fakeAsync(() => {
      dialogRef = testComponent.dialogService.open({
        title: 'Hallo Welt'
      });
      LuxTestHelper.wait(fixture);

      expect(overlayHelper.selectOneFromOverlay('lux-dialog-title')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('lux-dialog-title').textContent!.trim()).toEqual('Hallo Welt');
    }));

    it('Sollte den Content setzen', fakeAsync(() => {
      dialogRef = testComponent.dialogService.open({
        content: 'Hallo Welt'
      });
      LuxTestHelper.wait(fixture);

      expect(overlayHelper.selectOneFromOverlay('lux-dialog-content')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('lux-dialog-content').textContent!.trim()).toEqual('Hallo Welt');
    }));

    it('Sollte den Content via TemplateRef setzen', fakeAsync(() => {
      dialogRef = testComponent.dialogService.open({
        contentTemplate: testComponent.templateRef
      });
      LuxTestHelper.wait(fixture);

      expect(overlayHelper.selectOneFromOverlay('lux-dialog-content')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('lux-dialog-content').textContent!.trim()).toEqual('Hallo Welt');
    }));

    it('Sollte die ConfirmAction beachten', fakeAsync(() => {
      // Vorbedingungen testen
      dialogRef = testComponent.dialogService.open({
        confirmAction: undefined
      });
      LuxTestHelper.wait(fixture);

      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm')).toBeNull();

      // Änderungen durchführen
      dialogRef.closeDialog(true);
      waitForDialogClosure();

      dialogRef = testComponent.dialogService.open({
        confirmAction: {
          label: 'Hallo Welt',
          raised: true
        }
      });
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm .mat-mdc-raised-button')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm .lux-button-label').textContent!.trim()).toEqual('Hallo Welt');
    }));

    it('Sollte die DeclineAction beachten', fakeAsync(() => {
      // Vorbedingungen testen
      dialogRef = testComponent.dialogService.open({
        declineAction: undefined
      });
      LuxTestHelper.wait(fixture);

      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline')).toBeNull();

      // Änderungen durchführen
      dialogRef.closeDialog(true);
      waitForDialogClosure();

      dialogRef = testComponent.dialogService.open({
        declineAction: {
          label: 'Hallo Welt',
          raised: true
        }
      });
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline .mat-mdc-raised-button')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline .lux-button-label').textContent!.trim()).toEqual('Hallo Welt');
    }));

    it('Sollte die Buttons in der korrekten Reihenfolge darstellen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({
        confirmAction: {
          label: 'Löschen'
        },
        declineAction: {
          label: 'Abbrechen'
        }
      });
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const buttonNodeList = overlayHelper.selectAllFromOverlay('lux-button');
      expect(buttonNodeList).not.toBeNull();

      const buttonArray = Array.from(buttonNodeList);
      expect(buttonArray.length).toEqual(2);

      expect(buttonArray[0].innerText.toLowerCase()).toContain('löschen');
      expect(buttonArray[1].innerText.toLowerCase()).toContain('abbrechen');
    }));

    it('Sollte den Dialog schließen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({});
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();

      // Änderungen durchführen
      dialogRef.closeDialog(true);
      waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
    }));

    it('Sollte dialogConfirmed aufrufen', fakeAsync(() => {
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({
        confirmAction: {
          label: 'Hallo Welt'
        }
      });

      LuxTestHelper.wait(fixture);
      dialogRef.dialogConfirmed.subscribe(() => {
        testComponent.dialogConfirmed();
      });

      const spy = spyOn(testComponent, 'dialogConfirmed');
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm button').click();
      waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
      expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('Sollte declineConfirmed aufrufen', fakeAsync(() => {
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({
        declineAction: {
          label: 'Hallo Welt'
        }
      });

      LuxTestHelper.wait(fixture);
      dialogRef.dialogDeclined.subscribe(() => {
        testComponent.dialogDeclined();
      });

      const spy = spyOn(testComponent, 'dialogDeclined');
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline button').click();
      waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
      expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('Sollte dialogClosed aufrufen', fakeAsync(() => {
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({
        confirmAction: {
          label: 'Hallo Welt'
        }
      });

      LuxTestHelper.wait(fixture);
      dialogRef.dialogClosed.subscribe(() => {
        testComponent.dialogClosed();
      });

      const spy = spyOn(testComponent, 'dialogClosed');
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm button').click();
      waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
      expect(spy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('[LuxDialogStructureComponent]', () => {
    it('Sollte den Dialog öffnen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.openComponent(MockCustomDialogComponent);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.mock-dialog-title').textContent!.trim()).toEqual('Title');
      expect(overlayHelper.selectOneFromOverlay('.mock-dialog-content').textContent!.trim()).toEqual('Content');
      expect(overlayHelper.selectOneFromOverlay('.mock-dialog-action-ok')).not.toBeNull();
    }));

    it('Sollte den Dialog schließen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.openComponent(MockCustomDialogComponent);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.mock-dialog-action-ok button').click();
      waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
    }));

    it('Sollte dialogClosed aufrufen', fakeAsync(() => {
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.openComponent(MockCustomDialogComponent);

      LuxTestHelper.wait(fixture);
      dialogRef.dialogClosed.subscribe(() => {
        testComponent.dialogClosed();
      });

      const spy = spyOn(testComponent, 'dialogClosed');
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.mock-dialog-action-ok button').click();
      waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
      expect(spy).toHaveBeenCalledTimes(1);
    }));
  });
});

@Component({
  template: ` <ng-template #testContentTemplate><span>Hallo Welt</span></ng-template> `,
  imports: []
})
class MockDialogComponent {
  dialogService = inject(LuxDialogService);

  @ViewChild('testContentTemplate') templateRef!: TemplateRef<any>;

  dialogConfirmed() {}

  dialogDeclined() {}

  dialogClosed() {}
}

@Component({
  template: `
    <lux-dialog-structure>
      <lux-dialog-title>
        <span class="mock-dialog-title">Title</span>
      </lux-dialog-title>
      <lux-dialog-content>
        <span class="mock-dialog-content">Content</span>
      </lux-dialog-content>
      <lux-dialog-actions>
        <lux-button class="mock-dialog-action-ok" luxLabel="OK" (luxClicked)="dialogRef.closeDialog(true)"></lux-button>
      </lux-dialog-actions>
    </lux-dialog-structure>
  `,
  imports: [LuxDialogStructureComponent, LuxDialogTitleComponent, LuxDialogContentComponent, LuxDialogActionsComponent, LuxButtonComponent]
})
class MockCustomDialogComponent {
  dialogRef = inject<LuxDialogRef<void>>(LuxDialogRef);

  dialogClosed() {}
}
