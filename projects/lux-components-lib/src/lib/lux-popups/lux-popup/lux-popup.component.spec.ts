import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, importProvidersFrom, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxComponentsConfigModule } from '../../lux-components-config/lux-components-config.module';
import { LuxTestHelper } from '../../lux-util/testing/lux-test-helper';
import { LuxOverlayHelper } from '../../lux-util/testing/lux-test-overlay-helper';
import { LuxPopupTriggerDirective } from './lux-popup-trigger.directive';
import { LuxPopupComponent } from './lux-popup.component';
import { LuxPopupCloseReason, LuxPopupPosition } from './lux-popup.types';

describe('LuxPopupComponent', () => {
  let fixture: ComponentFixture<LuxPopupHostComponent>;
  let hostComponent: LuxPopupHostComponent;
  let overlayHelper: LuxOverlayHelper;

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
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxPopupHostComponent);
    hostComponent = fixture.componentInstance;
    overlayHelper = new LuxOverlayHelper();
    fixture.detectChanges();
  });

  it('should open popup and render projected body', fakeAsync(() => {
    hostComponent.title = 'Popup Title';
    hostComponent.content = 'Projected Content';

    hostComponent.popup.open(hostComponent.trigger);
    LuxTestHelper.wait(fixture);

    const popupElement = overlayHelper.selectOneFromOverlay('.lux-popup');

    expect(popupElement).not.toBeNull();
    expect(popupElement?.textContent).toContain('Projected Content');
    expect(hostComponent.openedCount).toBe(1);
    expect(hostComponent.popup.isOpen()).toBeTrue();

    hostComponent.popup.close('program');
    LuxTestHelper.wait(fixture);
  }));

  it('should close popup with provided reason', fakeAsync(() => {
    hostComponent.popup.open(hostComponent.trigger);
    LuxTestHelper.wait(fixture);

    hostComponent.popup.close('escape');
    LuxTestHelper.wait(fixture);

    expect(overlayHelper.selectOneFromOverlay('.lux-popup')).toBeNull();
    expect(hostComponent.closedReasons).toEqual(['escape']);
    expect(hostComponent.popup.isOpen()).toBeFalse();
  }));

  it('should apply persistent attributes and classes', fakeAsync(() => {
    hostComponent.persistent = true;
    fixture.detectChanges();

    hostComponent.popup.open(hostComponent.trigger);
    LuxTestHelper.wait(fixture);

    const panelElement = overlayHelper.selectOneFromOverlay('.lux-popup-panel--persistent');
    const popupElement = overlayHelper.selectOneFromOverlay('.lux-popup');

    expect(panelElement).not.toBeNull();
    expect(popupElement?.getAttribute('role')).toBe('dialog');
    expect(popupElement?.getAttribute('tabindex')).toBe('0');
    expect(popupElement?.getAttribute('aria-modal')).toBe('false');

    hostComponent.popup.close('program');
    LuxTestHelper.wait(fixture);
  }));

  it('should close when clicking outside the overlay', fakeAsync(() => {
    hostComponent.popup.open(hostComponent.trigger);
    LuxTestHelper.wait(fixture);

    LuxTestHelper.dispatchEvent(document.body, LuxTestHelper.createFakeEvent('pointerdown', true));
    LuxTestHelper.wait(fixture);

    expect(hostComponent.closedReasons).toContain('outside');
    expect(hostComponent.popup.isOpen()).toBeFalse();
  }));
});

@Component({
  imports: [LuxPopupComponent, LuxPopupTriggerDirective],
  template: `
    <lux-popup
      #popupRef="luxPopup"
      [luxTitle]="title"
      [luxPersistent]="persistent"
      [luxMinWidth]="minWidth"
      [luxMaxWidth]="maxWidth"
      (luxOpened)="handleOpened()"
      (luxClosed)="handleClosed($event)"
    >
      <div class="popup-body">{{ content }}</div>

      <ng-template luxPopupActions>
        <button class="popup-action" (click)="handleAction()">Action</button>
      </ng-template>
    </lux-popup>

    <button type="button" class="popup-trigger" [luxPopupTriggerFor]="popupRef" [luxPopupPosition]="popupPosition">Trigger</button>
  `
})
class LuxPopupHostComponent {
  title = 'Popup';
  content = 'Content';
  popupPosition: LuxPopupPosition = 'below';
  persistent = false;
  minWidth = 220;
  maxWidth = 360;
  openedCount = 0;
  closedReasons: LuxPopupCloseReason[] = [];
  actionClicks = 0;

  @ViewChild(LuxPopupComponent, { static: true }) popup!: LuxPopupComponent;
  @ViewChild(LuxPopupTriggerDirective, { static: true }) trigger!: LuxPopupTriggerDirective;

  handleOpened() {
    this.openedCount++;
  }

  handleClosed(reason: LuxPopupCloseReason) {
    this.closedReasons.push(reason);
  }

  handleAction() {
    this.actionClicks++;
  }
}
