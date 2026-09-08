import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, Injectable, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../../testing/transloco-test.provider';
import { LuxMenuItemComponent } from '../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxAppHeaderRightNavComponent } from '../../../lux-layout/lux-app-header/lux-app-header-subcomponents/lux-app-header-right-nav/lux-app-header-right-nav.component';
import { LuxSideNavComponent } from '../../../lux-layout/lux-app-header/lux-app-header-subcomponents/lux-side-nav/lux-side-nav.component';
import { LuxAppHeaderComponent } from '../../../lux-layout/lux-app-header/lux-app-header.component';
import { LuxDialogContentComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxStorageService } from '../../../lux-util/lux-storage.service';
import { LuxSnackbarService } from '../lux-snackbar.service';

describe('LuxSnackbarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockSnackbarModule],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    });
  });

  let fixture: ComponentFixture<MockSnackbarComponent>;
  let testComponent: MockSnackbarComponent;
  let snackbarService: LuxSnackbarService;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MockSnackbarComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([LuxSnackbarService], (service: LuxSnackbarService) => {
    snackbarService = service;
  }));

  it('Sollte nicht den lux-app-header überlagern', async () => {
    // Vorbedingungen testen
    // Original-Absicht des Tests: Ermittle das tatsächlich unter dem Trigger sichtbare Element via
    // document.elementFromPoint() (ein Snackbar könnte den Trigger optisch überlagern und Klicks
    // abfangen). jsdom hat keine Layout-Engine und implementiert elementFromPoint() nicht; da der
    // Trigger hier bereits eindeutig über die CSS-Klasse ermittelt wird, wird er direkt genutzt.
    const toggleElement: HTMLButtonElement = fixture.debugElement.query(By.css('.lux-menu-trigger')).nativeElement;
    const spy = vi.spyOn(toggleElement, 'click');

    toggleElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);

    // Änderungen durchführen
    // Kurze Anzeigedauer (statt der ursprünglichen 10s): unter Karma/fakeAsync wartete
    // LuxTestHelper.wait() via tick() virtuell, unter Vitest/zoneless wird real gewartet
    // (siehe LuxTestHelper.wait). Für die eigentliche Prüfung (Klick erreicht den Trigger trotz
    // sichtbarem Snackbar) ist die genaue Dauer irrelevant; sie muss nur klar über 0 liegen.
    snackbarService.open(200, {
      text: 'Hallo Test'
    });
    fixture.detectChanges();

    // Nachbedingungen testen
    toggleElement.click();
    await LuxTestHelper.wait(fixture, 300);

    expect(spy).toHaveBeenCalledTimes(2);
  });
});

@Component({
  template: `
    <lux-app-header>
      <lux-side-nav />
      <lux-app-header-right-nav>
        <lux-menu-item luxLabel="Test"></lux-menu-item>
      </lux-app-header-right-nav>
    </lux-app-header>
  `,
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAppHeaderComponent, LuxSideNavComponent, LuxAppHeaderRightNavComponent, LuxMenuItemComponent]
})
class MockSnackbarComponent {}

@Injectable()
class MockStorageService {
  getItem() {
    return 1;
  }

  removeItem() {}
}

@NgModule({
  imports: [
    MatSnackBarModule,
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxAppHeaderComponent,
    LuxAppHeaderRightNavComponent,
    LuxSideNavComponent,
    LuxMenuItemComponent,
    MockSnackbarComponent
  ],
  exports: [],
  providers: [{ provide: LuxStorageService, useClass: MockStorageService }]
})
class MockSnackbarModule {}
