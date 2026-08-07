import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxInputAcComponent } from '../lux-input-ac/lux-input-ac.component';

describe('LuxFormControlWrapper – Label verstecken statt entfernen', () => {
  let fixture: ComponentFixture<WrapperLabelTestComponent>;
  let testComponent: WrapperLabelTestComponent;

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
    fixture = TestBed.createComponent(WrapperLabelTestComponent);
    testComponent = fixture.componentInstance;
  });

  it('rendert das Label sichtbar, wenn kein luxNoTopLabel gesetzt ist', () => {
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('label.lux-form-label-authentic'));
    const containerEl = fixture.debugElement.query(By.css('.lux-form-control-label-authentic'));
    expect(labelEl).not.toBeNull();
    expect(labelEl.nativeElement.textContent).toContain('Nachname');
    expect(containerEl.nativeElement.classList).not.toContain('lux-sr-only');
  });

  it('behält das Label bei luxNoTopLabel im DOM und versteckt es nur visuell', () => {
    testComponent.noTopLabel = true;
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('label.lux-form-label-authentic'));
    const containerEl = fixture.debugElement.query(By.css('.lux-form-control-label-authentic'));
    const inputEl = fixture.debugElement.query(By.css('input'));

    expect(labelEl).not.toBeNull();
    expect(containerEl.nativeElement.classList).toContain('lux-sr-only');
    // for/id-Verknüpfung und die referenzierbare Label-ID bleiben erhalten
    expect(labelEl.nativeElement.getAttribute('for')).toEqual(inputEl.nativeElement.id);
    expect(labelEl.nativeElement.id).toEqual(inputEl.nativeElement.id + '-label');
  });

  it('behält das Top-Label bei luxNoLabels im DOM, der untere Block bleibt entfernt', () => {
    testComponent.noLabels = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('label.lux-form-label-authentic'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.lux-form-control-label-authentic')).nativeElement.classList).toContain('lux-sr-only');
    expect(fixture.debugElement.query(By.css('.lux-form-control-misc-authentic'))).toBeNull();
  });

  it('rendert kein Label-Element, wenn gar kein luxLabel gesetzt ist', () => {
    testComponent.label = '';
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('label.lux-form-label-authentic'))).toBeNull();
  });
});

@Component({
  imports: [LuxInputAcComponent],
  template: `<lux-input-ac [luxLabel]="label" [luxNoTopLabel]="noTopLabel" [luxNoLabels]="noLabels"></lux-input-ac>`
})
class WrapperLabelTestComponent {
  label = 'Nachname';
  noTopLabel = false;
  noLabels = false;
}
