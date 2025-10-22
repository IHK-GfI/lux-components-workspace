import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, Injectable, NgModule } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLuxTranslocoTesting } from '../../../../testing/transloco-test.provider';
import { LuxMenuItemComponent } from '../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxAppHeaderRightNavComponent } from '../../../lux-layout/lux-app-header/lux-app-header-subcomponents/lux-app-header-right-nav/lux-app-header-right-nav.component';
import { LuxSideNavComponent } from '../../../lux-layout/lux-app-header/lux-app-header-subcomponents/lux-side-nav/lux-side-nav.component';
import { LuxAppHeaderComponent } from '../../../lux-layout/lux-app-header/lux-app-header.component';
import { LuxDialogContentComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxStorageService } from '../../../lux-util/lux-storage.service';
import { LuxTestHelper } from '../../../lux-util/testing/lux-test-helper';
import { LuxSnackbarService } from '../lux-snackbar.service';

describe('LuxSnackbarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockSnackbarModule],
      providers: [provideNoopAnimations(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()],
    });
  });

  let fixture: ComponentFixture<MockSnackbarComponent>;
  let testComponent: MockSnackbarComponent;
  let snackbarService: LuxSnackbarService;

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(MockSnackbarComponent);
    testComponent = fixture.componentInstance;
    LuxTestHelper.wait(fixture);
    flush();
    discardPeriodicTasks();
  }));

  beforeEach(inject([LuxSnackbarService], (service: LuxSnackbarService) => {
    snackbarService = service;
  }));

  it('Sollte nicht den lux-app-header überlagern', fakeAsync(() => {
    // Vorbedingungen testen
    const rightNavTrigger: HTMLButtonElement = fixture.debugElement.query(By.css('.lux-menu-trigger')).nativeElement;
    const spy = spyOn(rightNavTrigger, 'click').and.callThrough();
    const x = rightNavTrigger.getBoundingClientRect().left;
    const y = rightNavTrigger.getBoundingClientRect().top;

    const toggleElement = findToggleElement(document.elementFromPoint(x, y) as any);

    toggleElement.click();
    LuxTestHelper.wait(fixture);
    expect(spy).toHaveBeenCalledTimes(1);

    // Änderungen durchführen
    snackbarService.open(10000, {
      text: 'Hallo Test'
    });
    LuxTestHelper.wait(fixture);

    // Nachbedingungen testen
    toggleElement.click();
    LuxTestHelper.wait(fixture, 11000);

    expect(spy).toHaveBeenCalledTimes(2);
  }));
});

const findToggleElement = (toggleElement: any) => {
  // Wenn das Element nicht die richtige CSS-Klasse hat, prüfe den Parent und
  // die Children (browserabhängig welches gecatched wird).
  if (toggleElement.className.indexOf('lux-menu-trigger') === -1) {
    if (toggleElement.parentElement.className.indexOf('lux-menu-trigger') > -1) {
      toggleElement = toggleElement.parentElement;
    } else {
      if (toggleElement.children) {
        for (let i = 0; i < toggleElement.children.length; i++) {
          const child = toggleElement.children.item(i);
          if (child.className.indexOf('lux-menu-trigger') > -1) {
            toggleElement = child;
          }
        }
      }
    }
  }
  return toggleElement;
};

@Component({
  template: `
    <lux-app-header>
      <lux-side-nav></lux-side-nav>
      <lux-app-header-right-nav>
        <lux-menu-item luxLabel="Test"></lux-menu-item>
      </lux-app-header-right-nav>
    </lux-app-header>
  `,
  providers: [],
  imports: [LuxAppHeaderComponent, LuxSideNavComponent, LuxAppHeaderRightNavComponent, LuxMenuItemComponent]
})
class MockSnackbarComponent {}

@Injectable()
class MockStorageService {
  getItem() {
    return 1;
  }
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
