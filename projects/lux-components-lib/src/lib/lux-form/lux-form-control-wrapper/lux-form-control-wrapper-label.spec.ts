import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxInputComponent } from '../lux-input/lux-input.component';

describe('LuxFormControlWrapper - Label verstecken statt entfernen', () => {
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

  // Bewusste Entscheidung: Die leere Label-Zeile bleibt auch bei einem reinen aria-Namen erhalten,
  // damit label-lose Felder in einer Flucht mit sichtbar gelabelten Nachbarfeldern stehen.
  // Wer die Zeile nicht braucht, setzt zusätzlich luxNoTopLabel.
  it('reserviert die leere Label-Zeile weiterhin, wenn nur luxAriaLabel gesetzt ist', () => {
    testComponent.label = '';
    testComponent.ariaLabel = 'Liste sortieren nach';
    fixture.detectChanges();

    const containerEl = fixture.debugElement.query(By.css('.lux-form-control-label-authentic'));
    expect(containerEl).not.toBeNull();
    expect(containerEl.nativeElement.classList).not.toContain('lux-sr-only');
  });

  it('reserviert die leere Label-Zeile weiterhin, wenn nur luxAriaLabelledby gesetzt ist', () => {
    testComponent.label = '';
    testComponent.ariaLabelledby = 'externe-label-id';
    fixture.detectChanges();

    const containerEl = fixture.debugElement.query(By.css('.lux-form-control-label-authentic'));
    expect(containerEl).not.toBeNull();
    expect(containerEl.nativeElement.classList).not.toContain('lux-sr-only');
  });

  it('kollabiert die Label-Zeile über luxNoTopLabel auch ohne gesetztes luxLabel', () => {
    testComponent.label = '';
    testComponent.ariaLabel = 'Liste sortieren nach';
    testComponent.noTopLabel = true;
    fixture.detectChanges();

    const containerEl = fixture.debugElement.query(By.css('.lux-form-control-label-authentic'));
    expect(containerEl.nativeElement.classList).toContain('lux-sr-only');
    expect(fixture.debugElement.query(By.css('label.lux-form-label-authentic'))).toBeNull();
  });
});

@Component({
  imports: [LuxInputComponent],
  template: `<lux-input
    [luxLabel]="label"
    [luxNoTopLabel]="noTopLabel"
    [luxNoLabels]="noLabels"
    [luxAriaLabel]="ariaLabel"
    [luxAriaLabelledby]="ariaLabelledby"
  ></lux-input>`
})
class WrapperLabelTestComponent {
  label = 'Nachname';
  noTopLabel = false;
  noLabels = false;
  ariaLabel?: string;
  ariaLabelledby?: string;
}
