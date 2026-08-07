import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../testing/transloco-test.provider';
import { LuxConsoleService } from '../lux-util/lux-console.service';
import { LuxInputAcComponent } from './lux-input-ac/lux-input-ac.component';
import { LuxSelectAcComponent } from './lux-select-ac/lux-select-ac.component';

describe('Form-Controls - axe-core: zugänglicher Name bei versteckten Labels', () => {
  beforeAll(() => {
    LuxA11yTestHelper.addA11yMatchers();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  it('Suchfeld: lux-input-ac mit luxNoTopLabel hat keine axe-Verletzungen', async () => {
    const fixture = TestBed.createComponent(SearchFieldTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
  });

  it('Sortier-Dropdown: lux-select-ac nur mit luxAriaLabel hat keine axe-Verletzungen', async () => {
    const fixture = TestBed.createComponent(SortDropdownTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
  });
});

@Component({
  imports: [LuxInputAcComponent],
  template: `<lux-input-ac luxLabel="Suchbegriff eingeben" [luxNoTopLabel]="true"></lux-input-ac>`
})
class SearchFieldTestComponent {}

@Component({
  imports: [LuxSelectAcComponent],
  template: `<lux-select-ac luxAriaLabel="Liste sortieren nach" [luxOptions]="['Relevanz', 'Datum']"></lux-select-ac>`
})
class SortDropdownTestComponent {}
