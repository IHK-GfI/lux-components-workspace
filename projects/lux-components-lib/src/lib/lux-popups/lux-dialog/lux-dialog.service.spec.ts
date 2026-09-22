import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxOverlayHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { provideLuxComponentsConfig } from '../../lux-components-config/lux-components-config.provider';
import { DIALOG_WIDTH_LARGE_PX, DIALOG_WIDTH_SMALL_PX, minWidth } from './lux-dialog-model/lux-dialog-config.interface';
import { ILuxDialogPresetConfig } from './lux-dialog-model/lux-dialog-preset-config.interface';
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

  const waitForDialogClosure = async () => {
    fixture.detectChanges();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideLuxComponentsConfig({
          labelConfiguration: {
            allUppercase: true,
            notAppliedTo: []
          }
        }),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDialogComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    overlayHelper = new LuxOverlayHelper();
    fixture.detectChanges();
  });

  afterEach(async () => {
    dialogRef.closeDialog(true);
    await waitForDialogClosure();
  });

  describe('[LuxDialogPresetComponent]', () => {
    it('Sollte den Dialog öffnen', async () => {
      // Vorbedingungen testen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({});
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
    });

    it('Sollte den Titel setzen', async () => {
      dialogRef = testComponent.dialogService.open({
        title: 'Hallo Welt'
      });
      fixture.detectChanges();

      expect(overlayHelper.selectOneFromOverlay('lux-dialog-title')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('lux-dialog-title').textContent!.trim()).toEqual('Hallo Welt');
    });

    it('Sollte den Content setzen', async () => {
      dialogRef = testComponent.dialogService.open({
        content: 'Hallo Welt'
      });
      fixture.detectChanges();

      expect(overlayHelper.selectOneFromOverlay('lux-dialog-content')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('lux-dialog-content').textContent!.trim()).toEqual('Hallo Welt');
    });

    it('Sollte den Content via TemplateRef setzen', async () => {
      dialogRef = testComponent.dialogService.open({
        contentTemplate: testComponent.templateRef()
      });
      fixture.detectChanges();

      expect(overlayHelper.selectOneFromOverlay('lux-dialog-content')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('lux-dialog-content').textContent!.trim()).toEqual('Hallo Welt');
    });

    it('Sollte die ConfirmAction beachten', async () => {
      // Vorbedingungen testen
      dialogRef = testComponent.dialogService.open({
        confirmAction: undefined
      });
      fixture.detectChanges();

      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm')).toBeNull();

      // Änderungen durchführen
      dialogRef.closeDialog(true);
      await waitForDialogClosure();

      dialogRef = testComponent.dialogService.open({
        confirmAction: {
          label: 'Hallo Welt',
          raised: true
        }
      });
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm .mat-mdc-raised-button')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm .lux-button-label').textContent!.trim()).toEqual('Hallo Welt');
    });

    it('Sollte die DeclineAction beachten', async () => {
      // Vorbedingungen testen
      dialogRef = testComponent.dialogService.open({
        declineAction: undefined
      });
      fixture.detectChanges();

      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline')).toBeNull();

      // Änderungen durchführen
      dialogRef.closeDialog(true);
      await waitForDialogClosure();

      dialogRef = testComponent.dialogService.open({
        declineAction: {
          label: 'Hallo Welt',
          raised: true
        }
      });
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline .mat-mdc-raised-button')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline .lux-button-label').textContent!.trim()).toEqual('Hallo Welt');
    });

    it('Sollte die Buttons in der korrekten Reihenfolge darstellen', async () => {
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
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const buttonNodeList = overlayHelper.selectAllFromOverlay('lux-button');
      expect(buttonNodeList).not.toBeNull();

      const buttonArray = Array.from(buttonNodeList);
      expect(buttonArray.length).toEqual(2);

      expect(buttonArray[0].innerText.toLowerCase()).toContain('löschen');
      expect(buttonArray[1].innerText.toLowerCase()).toContain('abbrechen');
    });

    it('Sollte den Dialog schließen', async () => {
      // Vorbedingungen testen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({});
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();

      // Änderungen durchführen
      dialogRef.closeDialog(true);
      await waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
    });

    it('Sollte dialogConfirmed aufrufen', async () => {
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({
        confirmAction: {
          label: 'Hallo Welt'
        }
      });

      fixture.detectChanges();
      dialogRef.dialogConfirmed.subscribe(() => {
        testComponent.dialogConfirmed();
      });

      const spy = vi.spyOn(testComponent, 'dialogConfirmed').mockReturnValue(undefined);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm button').click();
      await waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Sollte declineConfirmed aufrufen', async () => {
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({
        declineAction: {
          label: 'Hallo Welt'
        }
      });

      fixture.detectChanges();
      dialogRef.dialogDeclined.subscribe(() => {
        testComponent.dialogDeclined();
      });

      const spy = vi.spyOn(testComponent, 'dialogDeclined').mockReturnValue(undefined);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.lux-dialog-preset-decline button').click();
      await waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Sollte dialogClosed aufrufen', async () => {
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.open({
        confirmAction: {
          label: 'Hallo Welt'
        }
      });

      fixture.detectChanges();
      dialogRef.dialogClosed.subscribe(() => {
        testComponent.dialogClosed();
      });

      const spy = vi.spyOn(testComponent, 'dialogClosed').mockReturnValue(undefined);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.lux-dialog-preset-confirm button').click();
      await waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Sollte bei Preset-Dialogen ohne maxWidth und mit width=auto eine Default-maxWidth setzen', async () => {
      dialogRef = testComponent.dialogService.open({
        width: 'auto',
        maxWidth: undefined
      });
      fixture.detectChanges();

      const config = (dialogRef._matDialogRef as any)._containerInstance._config;
      expect(config.maxWidth).toEqual(minWidth(DIALOG_WIDTH_SMALL_PX));
    });

    it('Sollte bei Preset-Dialogen mit konkreter width keine Default-maxWidth setzen', async () => {
      dialogRef = testComponent.dialogService.open({
        width: '700px',
        maxWidth: undefined
      });
      fixture.detectChanges();

      const config = (dialogRef._matDialogRef as any)._containerInstance._config;
      expect(config.maxWidth).toBeUndefined();
    });

    it('Sollte das übergebene Config-Objekt nicht mutieren', async () => {
      const inputConfig: ILuxDialogPresetConfig = {
        width: 'auto'
      };

      dialogRef = testComponent.dialogService.open(inputConfig);
      fixture.detectChanges();

      expect(inputConfig.maxWidth).toBeUndefined();
    });

    it('Sollte bei Nicht-Preset-Dialogen ohne maxWidth und mit width=auto eine Default-maxWidth setzen', async () => {
      dialogRef = testComponent.dialogService.openComponent(MockCustomDialogComponent, {
        width: 'auto',
        maxWidth: undefined
      });
      fixture.detectChanges();

      const config = (dialogRef._matDialogRef as any)._containerInstance._config;
      expect(config.maxWidth).toEqual(minWidth(DIALOG_WIDTH_LARGE_PX));
    });
  });

  describe('[LuxDialogStructureComponent]', () => {
    it('Sollte den Dialog öffnen', async () => {
      // Vorbedingungen testen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.openComponent(MockCustomDialogComponent);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(overlayHelper.selectOneFromOverlay('.mock-dialog-title').textContent!.trim()).toEqual('Title');
      expect(overlayHelper.selectOneFromOverlay('.mock-dialog-content').textContent!.trim()).toEqual('Content');
      expect(overlayHelper.selectOneFromOverlay('.mock-dialog-action-ok')).not.toBeNull();
    });

    it('Sollte den Dialog schließen', async () => {
      // Vorbedingungen testen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.openComponent(MockCustomDialogComponent);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.mock-dialog-action-ok button').click();
      await waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
    });

    it('Sollte dialogClosed aufrufen', async () => {
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();

      // Änderungen durchführen
      dialogRef = testComponent.dialogService.openComponent(MockCustomDialogComponent);

      fixture.detectChanges();
      dialogRef.dialogClosed.subscribe(() => {
        testComponent.dialogClosed();
      });

      const spy = vi.spyOn(testComponent, 'dialogClosed').mockReturnValue(undefined);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).not.toBeNull();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      overlayHelper.selectOneFromOverlay('.mock-dialog-action-ok button').click();
      await waitForDialogClosure();

      // Nachbedingungen prüfen
      expect(overlayHelper.selectOneFromOverlay('.lux-dialog')).toBeNull();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Sollte bei disableBackdropAndEscClose=true den Dialog über MatDialog sperren, aber den X-Button anzeigen', async () => {
      dialogRef = testComponent.dialogService.openComponent(MockCustomDialogComponent, {
        disableClose: false,
        disableBackdropAndEscClose: true
      });
      fixture.detectChanges();

      expect(dialogRef._matDialogRef.disableClose).toBe(true);
      expect(overlayHelper.selectOneFromOverlay('.lux-icon-close')).not.toBeNull();
    });

    it('Sollte bei disableClose=true den X-Button ausblenden', async () => {
      dialogRef = testComponent.dialogService.openComponent(MockCustomDialogComponent, {
        disableClose: true,
        disableBackdropAndEscClose: false
      });
      fixture.detectChanges();

      expect(dialogRef._matDialogRef.disableClose).toBe(true);
      expect(overlayHelper.selectOneFromOverlay('.lux-icon-close')).toBeNull();
    });
  });
});

@Component({
  template: ` <ng-template #testContentTemplate><span>Hallo Welt</span></ng-template> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
class MockDialogComponent {
  dialogService = inject(LuxDialogService);

  readonly templateRef = viewChild.required<TemplateRef<any>>('testContentTemplate');

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
        <lux-button class="mock-dialog-action-ok" luxLabel="OK" (luxClicked)="dialogRef.closeDialog(true)" />
      </lux-dialog-actions>
    </lux-dialog-structure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDialogStructureComponent, LuxDialogTitleComponent, LuxDialogContentComponent, LuxDialogActionsComponent, LuxButtonComponent]
})
class MockCustomDialogComponent {
  dialogRef = inject<LuxDialogRef<void>>(LuxDialogRef);

  dialogClosed() {}
}
