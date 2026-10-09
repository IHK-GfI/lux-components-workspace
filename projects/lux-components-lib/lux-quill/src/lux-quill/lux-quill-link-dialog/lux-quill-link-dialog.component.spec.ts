import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxDialogService } from '@ihk-gfi/lux-components';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../../src/testing/transloco-test.provider';
import {
  LUX_QUILL_URL_ERROR,
  LuxQuillLinkDialogComponent,
  LuxQuillLinkDialogData,
  LuxQuillLinkDialogResult,
  luxQuillNormalizeUrl,
  luxQuillUrlValidator
} from './lux-quill-link-dialog.component';

describe('LuxQuillLinkDialogComponent', () => {
  let fixture: ComponentFixture<DialogHostComponent>;
  let overlay: HTMLElement;
  let result: LuxQuillLinkDialogResult | 'offen';

  beforeAll(() => {
    LuxA11yTestHelper.addA11yMatchers();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHostComponent],
      providers: [provideNoopAnimations(), provideLuxTranslocoTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogHostComponent);
    fixture.detectChanges();
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    result = 'offen';
  });

  afterEach(() => {
    TestBed.inject(OverlayContainer).ngOnDestroy();
  });

  async function open(data: LuxQuillLinkDialogData) {
    fixture.componentInstance.dialogService
      .openComponent(LuxQuillLinkDialogComponent, undefined, data)
      .dialogClosed.subscribe((value: LuxQuillLinkDialogResult) => (result = value));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function click(selector: string) {
    const button: HTMLButtonElement = overlay.querySelector(`${selector} button`)!;
    expect(button).withContext(selector).toBeTruthy();
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function type(selector: string, value: string) {
    const input: HTMLInputElement = overlay.querySelector(`${selector} input`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('Sollte einen neuen Link mit https-Präfix übernehmen', async () => {
    // Vorbedingungen testen
    await open({ url: '', hasLink: false, askForText: false });
    expect(overlay.textContent).toContain('Link einfügen');
    expect(overlay.querySelector('.lux-quill-link-dialog-remove')).toBeNull();
    expect(overlay.querySelector('.lux-quill-link-dialog-text')).toBeNull();

    // Änderungen durchführen
    type('.lux-quill-link-dialog-url', 'www.ihk.de');
    await click('.lux-quill-link-dialog-apply');

    // Nachbedingungen prüfen
    expect(result).toEqual({ action: 'apply', url: 'https://www.ihk.de' });
  });

  it('Sollte eine ungültige URL nicht übernehmen und einen Fehler anzeigen', async () => {
    // Vorbedingungen testen
    await open({ url: '', hasLink: false, askForText: false });

    // Änderungen durchführen
    type('.lux-quill-link-dialog-url', 'javascript:alert(1)');
    await click('.lux-quill-link-dialog-apply');

    // Nachbedingungen prüfen
    expect(result).toEqual('offen');
    expect(overlay.textContent).toContain('Bitte eine gültige Adresse');
  });

  it('Sollte ohne Markierung einen Linktext verlangen', async () => {
    // Vorbedingungen testen
    await open({ url: '', hasLink: false, askForText: true });
    expect(overlay.querySelector('.lux-quill-link-dialog-text')).not.toBeNull();
    type('.lux-quill-link-dialog-url', 'https://www.ihk.de');

    // Änderungen durchführen
    await click('.lux-quill-link-dialog-apply');

    // Nachbedingungen prüfen
    expect(result).toEqual('offen');

    // Änderungen durchführen
    type('.lux-quill-link-dialog-text', 'IHK');
    await click('.lux-quill-link-dialog-apply');

    // Nachbedingungen prüfen
    expect(result).toEqual({ action: 'apply', url: 'https://www.ihk.de', text: 'IHK' });
  });

  it('Sollte einen vorhandenen Link entfernen können', async () => {
    // Vorbedingungen testen
    await open({ url: 'https://www.ihk.de', hasLink: true, askForText: false });
    expect(overlay.textContent).toContain('Link bearbeiten');
    expect((overlay.querySelector('.lux-quill-link-dialog-url input') as HTMLInputElement).value).toEqual('https://www.ihk.de');

    // Änderungen durchführen
    await click('.lux-quill-link-dialog-remove');

    // Nachbedingungen prüfen
    expect(result).toEqual({ action: 'remove' });
  });

  it('Sollte beim Abbrechen kein Ergebnis liefern', async () => {
    // Vorbedingungen testen
    await open({ url: '', hasLink: false, askForText: false });

    // Änderungen durchführen
    await click('.lux-quill-link-dialog-cancel');

    // Nachbedingungen prüfen
    expect(result).toBeUndefined();
  });

  it('Sollte keine A11y-Fehler haben', async () => {
    await open({ url: 'https://www.ihk.de', hasLink: true, askForText: false });

    await LuxA11yTestHelper.expectNoA11yViolations(overlay);
  });

  describe('URL-Hilfsfunktionen', () => {
    it('Sollte URLs ohne Schema um https:// ergänzen', () => {
      expect(luxQuillNormalizeUrl(' www.ihk.de ')).toEqual('https://www.ihk.de');
      expect(luxQuillNormalizeUrl('http://ihk.de')).toEqual('http://ihk.de');
      expect(luxQuillNormalizeUrl('mailto:info@ihk.de')).toEqual('mailto:info@ihk.de');
      expect(luxQuillNormalizeUrl('')).toEqual('');
    });

    it('Sollte nur http(s)-, mailto- und tel-Links erlauben', () => {
      const validate = (value: string) => luxQuillUrlValidator(new FormControl(value));

      expect(validate('https://www.ihk.de/pfad?x=1')).toBeNull();
      expect(validate('www.ihk.de')).toBeNull();
      expect(validate('mailto:info@ihk.de')).toBeNull();
      expect(validate('tel:+49 30 123456')).toBeNull();
      expect(validate('')).toBeNull();
      expect(validate('javascript:alert(1)')).toEqual({ [LUX_QUILL_URL_ERROR]: true });
      expect(validate('ftp://ihk.de')).toEqual({ [LUX_QUILL_URL_ERROR]: true });
      expect(validate('https://')).toEqual({ [LUX_QUILL_URL_ERROR]: true });
    });
  });
});

@Component({
  selector: 'lux-quill-link-dialog-test-host',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
class DialogHostComponent {
  readonly dialogService = inject(LuxDialogService);
}
