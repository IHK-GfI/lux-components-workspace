import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxInputAcComponent } from '../lux-input-ac/lux-input-ac.component';

describe('LuxFormComponentBase - Namenskaskade (labelledBy)', () => {
  let fixture: ComponentFixture<AriaBaseTestComponent>;
  let testComponent: AriaBaseTestComponent;

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

  beforeEach(() => {
    fixture = TestBed.createComponent(AriaBaseTestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('liefert luxAriaLabelledby, wenn gesetzt (höchste Priorität)', () => {
    testComponent.input.luxAriaLabelledby = 'externes-label-id';
    testComponent.input.luxAriaLabel = 'Suche';
    expect(testComponent.input.labelledBy()).toBe('externes-label-id');
  });

  it('liefert undefined, wenn nur luxAriaLabel gesetzt ist (aria-label soll greifen)', () => {
    testComponent.input.luxAriaLabel = 'Suche';
    expect(testComponent.input.labelledBy()).toBeUndefined();
  });

  it('liefert uid + "-label", wenn nur luxLabel gesetzt ist', () => {
    expect(testComponent.input.labelledBy()).toBe(testComponent.input.uid + '-label');
  });

  it('liefert undefined, wenn weder Label noch Aria-Inputs gesetzt sind', () => {
    testComponent.input.luxLabel = '';
    expect(testComponent.input.labelledBy()).toBeUndefined();
  });
});

@Component({
  imports: [LuxInputAcComponent],
  template: `<lux-input-ac luxLabel="Nachname"></lux-input-ac>`
})
class AriaBaseTestComponent {
  @ViewChild(LuxInputAcComponent, { static: true }) input!: LuxInputAcComponent;
}
