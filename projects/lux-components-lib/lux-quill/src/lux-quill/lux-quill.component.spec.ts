import { CdkMenuTrigger } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxDialogRef, LuxDialogService } from '@ihk-gfi/lux-components';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { TranslocoService } from '@jsverse/transloco';
import Quill from 'quill/core';
import Strike from 'quill/formats/strike';
import { of, Subject } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LUX_QUILL_CONFIG, LuxQuillConfig, LuxQuillPreset } from './lux-quill-config';
import { luxQuillNormalizeHtml } from './lux-quill-formats';
import { LuxQuillLinkDialogComponent, LuxQuillLinkDialogResult } from './lux-quill-link-dialog/lux-quill-link-dialog.component';
import { LuxQuillComponent } from './lux-quill.component';

describe('LuxQuillComponent', () => {
  beforeAll(() => {
    LuxA11yTestHelper.addA11yMatchers();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandaloneHostComponent, FormHostComponent, NgModelHostComponent],
      providers: [provideNoopAnimations(), provideLuxTranslocoTesting()]
    }).compileComponents();
  });

  function editorOf(fixture: ComponentFixture<unknown>): Quill {
    const quill = quillComponentOf(fixture).editor();
    expect(quill).withContext('Quill-Instanz').toBeTruthy();
    return quill!;
  }

  function quillComponentOf(fixture: ComponentFixture<unknown>): LuxQuillComponent {
    return fixture.debugElement.query(By.directive(LuxQuillComponent)).componentInstance;
  }

  function editorRoot(fixture: ComponentFixture<unknown>): HTMLElement {
    return fixture.nativeElement.querySelector('.ql-editor');
  }

  function clickToolbar(fixture: ComponentFixture<unknown>, item: string) {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(`.lux-quill-toolbar-${item}`);
    expect(button).withContext(`Toolbar-Button ${item}`).toBeTruthy();
    button.click();
    fixture.detectChanges();
  }

  function pressKey(fixture: ComponentFixture<unknown>, key: string, options: KeyboardEventInit = {}): boolean {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options });
    editorRoot(fixture).dispatchEvent(event);
    fixture.detectChanges();
    return event.defaultPrevented;
  }

  describe('Ohne Formular', () => {
    let fixture: ComponentFixture<StandaloneHostComponent>;
    let host: StandaloneHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandaloneHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('Sollte den Editor erzeugen', () => {
      // Nachbedingungen prüfen
      expect(editorOf(fixture)).toBeTruthy();
      expect(editorRoot(fixture).getAttribute('role')).toEqual('textbox');
      expect(editorRoot(fixture).getAttribute('aria-multiline')).toEqual('true');
    });

    it('Sollte den Wert über [(value)] setzen und Änderungen zurückmelden', () => {
      // Änderungen durchführen
      host.value.set('<p>Hallo Welt</p>');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(editorOf(fixture).getText()).toEqual('Hallo Welt\n');

      // Änderungen durchführen
      editorOf(fixture).insertText(editorOf(fixture).getLength() - 1, '!', 'user');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.value()).toEqual('<p>Hallo Welt!</p>');
    });

    it('Sollte valueChange nur bei Änderungen durch den Benutzer auslösen', () => {
      // Änderungen durchführen
      host.value.set('<p>Von außen</p>');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.valueChanges).toEqual([]);

      // Änderungen durchführen
      editorOf(fixture).insertText(0, 'Neu ', 'user');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.valueChanges).toEqual(['<p>Neu Von außen</p>']);
    });

    it('Sollte für einen leeren Editor einen leeren String liefern', () => {
      // Vorbedingungen testen
      host.value.set('<p>Text</p>');
      fixture.detectChanges();

      // Änderungen durchführen
      editorOf(fixture).deleteText(0, editorOf(fixture).getLength(), 'user');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.value()).toEqual('');
    });

    it('Sollte normale Leerzeichen statt &nbsp; liefern', () => {
      // Änderungen durchführen
      editorOf(fixture).insertText(0, 'Ein Satz mit  zwei Leerzeichen', 'user');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.value()).toEqual('<p>Ein Satz mit&nbsp; zwei Leerzeichen</p>');
    });

    it('Sollte das Label über aria-labelledby verknüpfen', () => {
      // Nachbedingungen prüfen
      const labelId = editorRoot(fixture).getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#' + labelId).textContent).toContain('Kommentar');
    });

    it('Sollte den Hinweis und den Tastaturhinweis über aria-describedby verknüpfen', () => {
      // Änderungen durchführen
      host.hint.set('Mein Hinweis');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const ids = editorRoot(fixture).getAttribute('aria-describedby')!.split(' ');
      expect(ids.length).toEqual(2);
      expect(fixture.nativeElement.querySelector('#' + ids[0]).textContent).toContain('Mein Hinweis');
      expect(fixture.nativeElement.querySelector('#' + ids[1]).textContent).toContain('Escape');
    });

    it('Sollte bei luxRequired nach dem Verlassen einen Fehler anzeigen', () => {
      // Vorbedingungen testen
      host.required.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.lux-quill-wrapper').textContent).toContain('*');
      expect(fixture.nativeElement.querySelector('mat-error')).toBeNull();

      // Änderungen durchführen
      editorRoot(fixture).dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      editorRoot(fixture).dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const error: HTMLElement = fixture.nativeElement.querySelector('mat-error');
      expect(error).not.toBeNull();
      expect(error.textContent!.trim()).toEqual(TestBed.inject(TranslocoService).translate('luxc.util.error_message.required'));
      expect(editorRoot(fixture).getAttribute('aria-invalid')).toEqual('true');
      expect(editorRoot(fixture).getAttribute('aria-describedby')).toContain(error.id);
    });

    it('Sollte luxErrorMessage vor der Standardmeldung verwenden', () => {
      // Vorbedingungen testen
      host.required.set(true);
      host.errorMessage.set('Bitte einen Kommentar eingeben.');
      fixture.detectChanges();

      // Änderungen durchführen
      editorRoot(fixture).dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(fixture.nativeElement.querySelector('mat-error').textContent.trim()).toEqual('Bitte einen Kommentar eingeben.');
    });

    it('Sollte bei luxDisabled den Editor und die Toolbar deaktivieren', () => {
      // Änderungen durchführen
      host.disabled.set(true);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(editorOf(fixture).isEnabled()).toBeFalse();
      expect(editorRoot(fixture).getAttribute('aria-disabled')).toEqual('true');
      const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.lux-quill-toolbar-control'));
      expect(buttons.length).toBeGreaterThan(0);
      expect(buttons.every((button) => button.disabled)).toBeTrue();
    });

    it('Sollte bei readonly den Editor sperren, die Toolbar ausblenden und lesbar bleiben', () => {
      // Änderungen durchführen
      host.readonly.set(true);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(editorOf(fixture).isEnabled()).toBeFalse();
      expect(fixture.nativeElement.querySelector('lux-quill-toolbar')).toBeNull();
      expect(editorRoot(fixture).getAttribute('aria-readonly')).toEqual('true');
      expect(editorRoot(fixture).getAttribute('tabindex')).toEqual('0');
    });

    it('Sollte den Placeholder setzen', () => {
      // Änderungen durchführen
      host.placeholder.set('Kommentar eingeben');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(editorRoot(fixture).getAttribute('data-placeholder')).toEqual('Kommentar eingeben');
    });

    describe('Formate', () => {
      beforeEach(() => {
        host.value.set('<p>Hallo Welt</p>');
        fixture.detectChanges();
        editorOf(fixture).setSelection(0, 5);
        fixture.detectChanges();
      });

      it('Sollte Fett, Kursiv und Unterstrichen setzen', () => {
        // Änderungen durchführen
        clickToolbar(fixture, 'bold');
        clickToolbar(fixture, 'italic');
        clickToolbar(fixture, 'underline');

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<p><strong><em><u>Hallo</u></em></strong> Welt</p>');
      });

      it('Sollte aria-pressed am Toolbar-Button nachführen', () => {
        // Vorbedingungen testen
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.lux-quill-toolbar-bold');
        expect(button.getAttribute('aria-pressed')).toEqual('false');

        // Änderungen durchführen
        clickToolbar(fixture, 'bold');

        // Nachbedingungen prüfen
        expect(button.getAttribute('aria-pressed')).toEqual('true');
      });

      it('Sollte die aktiven Formate bei unveränderten Formaten nicht neu setzen', () => {
        // Vorbedingungen testen
        editorOf(fixture).setSelection(1, 0);
        const before = quillComponentOf(fixture)['activeFormats']();

        // Änderungen durchführen: Cursorbewegung innerhalb desselben (unformatierten) Textes
        editorOf(fixture).setSelection(3, 0);

        // Nachbedingungen prüfen
        expect(quillComponentOf(fixture)['activeFormats']()).toBe(before);
      });

      it('Sollte Aufzählung und Nummerierung setzen', () => {
        // Änderungen durchführen
        clickToolbar(fixture, 'bulletList');

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<ul><li>Hallo Welt</li></ul>');

        // Änderungen durchführen
        clickToolbar(fixture, 'orderedList');

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<ol><li>Hallo Welt</li></ol>');
      });

      it('Sollte über die Toolbar ein- und ausrücken', () => {
        // Änderungen durchführen
        clickToolbar(fixture, 'indent');

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<p class="ql-indent-1">Hallo Welt</p>');

        // Änderungen durchführen
        clickToolbar(fixture, 'outdent');

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<p>Hallo Welt</p>');
      });

      it('Sollte Formatierungen entfernen', () => {
        // Vorbedingungen testen
        clickToolbar(fixture, 'bold');
        expect(host.value()).toContain('<strong>');

        // Änderungen durchführen
        clickToolbar(fixture, 'clean');

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<p>Hallo Welt</p>');
      });
    });

    describe('Tastatur', () => {
      beforeEach(() => {
        host.value.set('<p>Hallo Welt</p>');
        fixture.detectChanges();
        editorOf(fixture).focus();
        editorOf(fixture).setSelection(2, 0);
      });

      it('Sollte mit Tab und Shift+Tab ein- und ausrücken', () => {
        // Änderungen durchführen
        const prevented = pressKey(fixture, 'Tab');

        // Nachbedingungen prüfen
        expect(prevented).toBeTrue();
        expect(host.value()).toEqual('<p class="ql-indent-1">Hallo Welt</p>');

        // Änderungen durchführen
        pressKey(fixture, 'Tab', { shiftKey: true });

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<p>Hallo Welt</p>');
      });

      it('Sollte nach Escape den Tab nicht abfangen (keine Tastaturfalle)', () => {
        // Änderungen durchführen
        pressKey(fixture, 'Escape');
        const prevented = pressKey(fixture, 'Tab');

        // Nachbedingungen prüfen
        expect(prevented).toBeFalse();
        expect(host.value()).toEqual('<p>Hallo Welt</p>');
      });

      it('Sollte nach Escape und einer weiteren Taste wieder einrücken', () => {
        // Änderungen durchführen
        pressKey(fixture, 'Escape');
        pressKey(fixture, 'ArrowRight');
        const prevented = pressKey(fixture, 'Tab');

        // Nachbedingungen prüfen
        expect(prevented).toBeTrue();
        expect(host.value()).toEqual('<p class="ql-indent-1">Hallo Welt</p>');
      });

      it('Sollte Tab nicht abfangen, wenn das Einrücken nicht konfiguriert ist', () => {
        // Vorbedingungen testen
        host.config.set({ toolbar: ['bold', 'italic'] });
        fixture.detectChanges();
        editorOf(fixture).focus();
        editorOf(fixture).setSelection(2, 0);

        // Änderungen durchführen
        const prevented = pressKey(fixture, 'Tab');

        // Nachbedingungen prüfen
        expect(prevented).toBeFalse();
        expect(fixture.nativeElement.querySelector('#' + quillComponentOf(fixture).uid() + '-keyboard-hint')).toBeNull();
      });
    });

    describe('Überschriften', () => {
      beforeEach(() => {
        host.value.set('<p>Titel</p><p>Text</p>');
        fixture.detectChanges();
        editorOf(fixture).setSelection(0, 0);
      });

      function selectHeading(style: 0 | 1 | 2) {
        clickToolbarHeading();
        const items: HTMLButtonElement[] = Array.from(document.querySelectorAll('.lux-quill-heading-menu-item'));
        expect(items.length).toEqual(3);
        items[style].click();
        fixture.detectChanges();
      }

      function clickToolbarHeading() {
        const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('.lux-quill-toolbar-heading');
        expect(trigger).withContext('Überschriften-Auswahl').toBeTruthy();
        trigger.click();
        fixture.detectChanges();
      }

      it('Sollte erkennen, wenn der Fokus das geöffnete Menü direkt nach außen verlässt', async () => {
        // Vorbedingungen testen
        host.preset.set('document');
        host.required.set(true);
        host.value.set('');
        fixture.detectChanges();
        const outside = document.createElement('button');
        document.body.appendChild(outside);

        try {
          editorOf(fixture).focus();
          fixture.detectChanges();
          clickToolbarHeading();
          const item = document.querySelector<HTMLElement>('.lux-quill-heading-menu-item');
          expect(item).withContext('Menü geöffnet').toBeTruthy();

          // Änderungen durchführen: Fokus ins Menü, dann direkt auf ein Element außerhalb.
          item!.focus();
          outside.focus();
          fixture.detectChanges();

          // Nachbedingungen prüfen: Solange das Menü offen ist, gilt die Komponente nicht als verlassen.
          expect(fixture.nativeElement.querySelector('mat-error')).withContext('Menü offen').toBeNull();

          // Änderungen durchführen: Menü schließt (z.B. durch den Klick nach außen).
          fixture.debugElement.query(By.directive(CdkMenuTrigger)).injector.get(CdkMenuTrigger).close();
          await new Promise((resolve) => setTimeout(resolve));
          fixture.detectChanges();

          // Nachbedingungen prüfen
          expect(fixture.nativeElement.querySelector('mat-error')).withContext('nach dem Schließen').not.toBeNull();
        } finally {
          outside.remove();
        }
      });

      it('Sollte nach Auswahl im Menü nicht als verlassen gelten', async () => {
        // Vorbedingungen testen
        host.preset.set('document');
        host.required.set(true);
        fixture.detectChanges();
        editorOf(fixture).focus();
        editorOf(fixture).setSelection(0, 0);

        // Änderungen durchführen
        selectHeading(1);
        await new Promise((resolve) => setTimeout(resolve));
        fixture.detectChanges();

        // Nachbedingungen prüfen
        expect(quillComponentOf(fixture)['focused']()).toBeTrue();
      });

      it('Sollte im Kommentar-Preset keine Überschriften anbieten und eingefügte Überschriften zu Text machen', () => {
        // Änderungen durchführen
        host.value.set('<h1>Titel</h1><p>Text</p>');
        fixture.detectChanges();

        // Nachbedingungen prüfen
        expect(fixture.nativeElement.querySelector('.lux-quill-toolbar-heading')).toBeNull();
        expect(editorRoot(fixture).querySelector('h1')).toBeNull();
        expect(editorRoot(fixture).innerHTML).toContain('<p>Titel</p>');
      });

      it('Sollte im Modus "visual" rein optische Überschriften erzeugen', () => {
        // Vorbedingungen testen
        host.config.set({ headingMode: 'visual' });
        fixture.detectChanges();
        editorOf(fixture).setSelection(0, 0);

        // Änderungen durchführen
        selectHeading(1);

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<p class="lux-quill-heading-1">Titel</p><p>Text</p>');
      });

      it('Sollte im Dokument-Preset semantische Überschriften erzeugen', () => {
        // Vorbedingungen testen
        host.preset.set('document');
        fixture.detectChanges();
        editorOf(fixture).setSelection(0, 0);

        // Änderungen durchführen
        selectHeading(2);

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<h2 class="lux-quill-heading-2">Titel</h2><p>Text</p>');

        // Änderungen durchführen
        selectHeading(0);

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<p>Titel</p><p>Text</p>');
      });

      it('Sollte die HTML-Ebenen über headingLevels steuern', () => {
        // Vorbedingungen testen
        host.preset.set('document');
        host.config.set({ headingLevels: [2, 3] });
        fixture.detectChanges();
        editorOf(fixture).setSelection(0, 0);

        // Änderungen durchführen
        selectHeading(1);

        // Nachbedingungen prüfen
        expect(host.value()).toEqual('<h2 class="lux-quill-heading-1">Titel</h2><p>Text</p>');
      });

      it('Sollte beim Laden fremde Überschriften auf die konfigurierten Stufen abbilden', () => {
        // Vorbedingungen testen
        host.preset.set('document');
        host.config.set({ headingLevels: [2, 3] });
        fixture.detectChanges();

        // Änderungen durchführen
        host.value.set('<h1>Eins</h1><h4>Vier</h4>');
        fixture.detectChanges();

        // Nachbedingungen prüfen
        expect(editorRoot(fixture).innerHTML).toEqual('<h2 class="lux-quill-heading-1">Eins</h2><h3 class="lux-quill-heading-2">Vier</h3>');
      });

      it('Sollte die Überschriften-Auswahl als Menü mit Radio-Einträgen anbieten', () => {
        // Vorbedingungen testen
        host.preset.set('document');
        fixture.detectChanges();

        // Änderungen durchführen
        clickToolbarHeading();

        // Nachbedingungen prüfen
        const items = Array.from(document.querySelectorAll('.lux-quill-heading-menu-item'));
        expect(items.map((item) => item.getAttribute('role'))).toEqual(['menuitemradio', 'menuitemradio', 'menuitemradio']);
        expect(items[0].getAttribute('aria-checked')).toEqual('true');

        // Aufräumen
        (items[0] as HTMLElement).click();
        fixture.detectChanges();
      });
    });

    describe('Links', () => {
      let dialogResult: LuxQuillLinkDialogResult;
      let openSpy: jasmine.Spy;

      beforeEach(() => {
        dialogResult = undefined;
        openSpy = spyOn(TestBed.inject(LuxDialogService), 'openComponent').and.callFake(
          () => ({ dialogClosed: of(dialogResult) }) as unknown as LuxDialogRef
        );
        host.value.set('<p>Hallo Welt</p>');
        fixture.detectChanges();
      });

      it('Sollte das Öffnen des Link-Dialogs nicht als Verlassen der Komponente werten', () => {
        // Vorbedingungen testen
        const closed = new Subject<LuxQuillLinkDialogResult>();
        openSpy.and.callFake(() => ({ dialogClosed: closed.asObservable() }) as unknown as LuxDialogRef);
        host.required.set(true);
        host.value.set('');
        fixture.detectChanges();
        editorOf(fixture).focus();
        editorOf(fixture).setSelection(0, 0);

        // Änderungen durchführen: Der Dialog nimmt dem Editor den Fokus.
        pressKey(fixture, 'k', { ctrlKey: true });
        editorRoot(fixture).dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
        fixture.detectChanges();

        // Nachbedingungen prüfen
        expect(openSpy).toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('mat-error')).withContext('Dialog offen').toBeNull();

        // Änderungen durchführen: Dialog schließen, danach den Editor verlassen.
        closed.next(undefined);
        fixture.detectChanges();
        editorRoot(fixture).dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
        fixture.detectChanges();

        // Nachbedingungen prüfen
        expect(fixture.nativeElement.querySelector('mat-error')).withContext('nach dem Verlassen').not.toBeNull();
      });

      it('Sollte für markierten Text einen Link setzen', () => {
        // Vorbedingungen testen
        editorOf(fixture).setSelection(6, 4);
        dialogResult = { action: 'apply', url: 'https://www.ihk.de' };

        // Änderungen durchführen
        clickToolbar(fixture, 'link');

        // Nachbedingungen prüfen
        expect(openSpy).toHaveBeenCalledWith(LuxQuillLinkDialogComponent, jasmine.any(Object), {
          url: '',
          hasLink: false,
          askForText: false
        });
        expect(host.value()).toEqual('<p>Hallo <a href="https://www.ihk.de" rel="noopener noreferrer" target="_blank">Welt</a></p>');
      });

      it('Sollte ohne Markierung Linktext und Link einfügen', () => {
        // Vorbedingungen testen
        editorOf(fixture).setSelection(5, 0);
        dialogResult = { action: 'apply', url: 'https://www.ihk.de', text: ' IHK' };

        // Änderungen durchführen
        clickToolbar(fixture, 'link');

        // Nachbedingungen prüfen
        expect(openSpy.calls.mostRecent().args[2]).toEqual({ url: '', hasLink: false, askForText: true });
        expect(host.value()).toContain('<a href="https://www.ihk.de" rel="noopener noreferrer" target="_blank"> IHK</a>');
      });

      it('Sollte einen vorhandenen Link bearbeiten und entfernen', () => {
        // Vorbedingungen testen
        host.value.set('<p>Hallo <a href="https://www.ihk.de">Welt</a></p>');
        fixture.detectChanges();
        editorOf(fixture).setSelection(8, 0);
        dialogResult = { action: 'remove' };

        // Änderungen durchführen
        clickToolbar(fixture, 'link');

        // Nachbedingungen prüfen
        expect(openSpy.calls.mostRecent().args[2]).toEqual({ url: 'https://www.ihk.de', hasLink: true, askForText: false });
        expect(host.value()).toEqual('<p>Hallo Welt</p>');
      });

      it('Sollte den Link-Dialog mit Strg+K öffnen', () => {
        // Vorbedingungen testen
        editorOf(fixture).focus();
        editorOf(fixture).setSelection(0, 5);

        // Änderungen durchführen
        const prevented = pressKey(fixture, 'k', { ctrlKey: true });

        // Nachbedingungen prüfen
        expect(prevented).toBeTrue();
        expect(openSpy).toHaveBeenCalled();
      });
    });

    describe('Sanitizing', () => {
      it('Sollte Skripte, Event-Handler und unerlaubte Formate entfernen', () => {
        // Änderungen durchführen
        host.value.set(
          '<p>Text<img src="x" onerror="alert(1)"><script>alert(1)</script><span style="color: red">rot</span></p>' +
            '<p><a href="javascript:alert(1)">Klick</a></p>'
        );
        fixture.detectChanges();

        // Nachbedingungen prüfen
        const html = editorRoot(fixture).innerHTML;
        expect(html).not.toContain('<img');
        expect(html).not.toContain('onerror');
        expect(html).not.toContain('<script');
        expect(html).not.toContain('style=');
        expect(html).not.toContain('javascript:');
      });
    });

    describe('A11y', () => {
      it('Sollte keine A11y-Fehler haben', async () => {
        host.value.set('<p>Hallo <strong>Welt</strong></p>');
        fixture.detectChanges();

        await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
      });

      it('Sollte keine A11y-Fehler haben (Dokument-Preset mit Fehler)', async () => {
        host.preset.set('document');
        host.required.set(true);
        host.hint.set('Hinweis');
        fixture.detectChanges();
        editorRoot(fixture).dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
        fixture.detectChanges();

        await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
      });

      it('Sollte keine A11y-Fehler haben (disabled)', async () => {
        host.disabled.set(true);
        fixture.detectChanges();

        await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
      });

      it('Sollte keine A11y-Fehler haben (readonly)', async () => {
        host.value.set('<p>Nur lesen</p>');
        host.readonly.set(true);
        fixture.detectChanges();

        await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
      });
    });
  });

  describe('Reactive Forms', () => {
    let fixture: ComponentFixture<FormHostComponent>;
    let host: FormHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(FormHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('Sollte den Wert des FormControls übernehmen', () => {
      // Nachbedingungen prüfen
      expect(editorOf(fixture).getText()).toEqual('Start\n');
    });

    it('Sollte Wertänderungen ohne Events übernehmen und Eingaben an das FormControl melden', () => {
      // Änderungen durchführen
      host.form.controls.text.setValue('<p>Neu</p>');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(editorOf(fixture).getText()).toEqual('Neu\n');
      expect(host.form.controls.text.dirty).toBeFalse();

      // Änderungen durchführen
      editorOf(fixture).insertText(0, 'Ganz ', 'user');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.form.controls.text.value).toEqual('<p>Ganz Neu</p>');
      expect(host.form.controls.text.dirty).toBeTrue();
    });

    it('Sollte den Required-Validator erkennen und den Fehler nach touched anzeigen', () => {
      // Vorbedingungen testen
      expect(fixture.nativeElement.querySelector('.lux-form-label-authentic').textContent).toContain('*');
      expect(editorRoot(fixture).getAttribute('aria-required')).toEqual('true');

      // Änderungen durchführen
      host.form.controls.text.setValue('');
      host.form.controls.text.markAsTouched();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(fixture.nativeElement.querySelector('mat-error')).not.toBeNull();
    });

    it('Sollte beim Verlassen touched setzen', () => {
      // Änderungen durchführen
      editorRoot(fixture).dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.form.controls.text.touched).toBeTrue();
    });

    it('Sollte disable()/enable() am FormControl über [(luxDisabled)] melden', () => {
      // Änderungen durchführen
      host.form.controls.text.disable();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.disabled()).toBeTrue();

      // Änderungen durchführen
      host.form.controls.text.enable();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.disabled()).toBeFalse();
    });

    it('Sollte ein von Anfang an deaktiviertes FormControl übernehmen', () => {
      // Vorbedingungen testen
      const initialFixture = TestBed.createComponent(FormHostComponent);
      initialFixture.componentInstance.form.controls.text.disable();

      // Änderungen durchführen
      initialFixture.detectChanges();

      // Nachbedingungen prüfen
      expect(initialFixture.componentInstance.disabled()).toBeTrue();
      expect(initialFixture.componentInstance.form.controls.text.disabled).toBeTrue();
      expect(editorOf(initialFixture).isEnabled()).toBeFalse();
    });

    it('Sollte ein von Anfang an gesetztes luxDisabled bei aktivem FormControl übernehmen', () => {
      // Vorbedingungen testen
      const initialFixture = TestBed.createComponent(FormHostComponent);
      initialFixture.componentInstance.disabled.set(true);

      // Änderungen durchführen
      initialFixture.detectChanges();

      // Nachbedingungen prüfen
      expect(initialFixture.componentInstance.disabled()).toBeTrue();
      expect(initialFixture.componentInstance.form.controls.text.disabled).toBeTrue();
      expect(editorOf(initialFixture).isEnabled()).toBeFalse();
    });

    it('Sollte luxDisabled auf das FormControl übertragen', () => {
      // Änderungen durchführen
      host.disabled.set(true);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.form.controls.text.disabled).toBeTrue();
      expect(editorOf(fixture).isEnabled()).toBeFalse();

      // Änderungen durchführen
      host.disabled.set(false);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.form.controls.text.enabled).toBeTrue();
      expect(editorOf(fixture).isEnabled()).toBeTrue();
    });

    it('Sollte den Disabled-Status des FormControls übernehmen', () => {
      // Änderungen durchführen
      host.form.controls.text.disable();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(editorOf(fixture).isEnabled()).toBeFalse();

      // Änderungen durchführen
      host.form.controls.text.enable();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(editorOf(fixture).isEnabled()).toBeTrue();
    });
  });

  describe('ngModel', () => {
    it('Sollte mit ngModel funktionieren', async () => {
      // Vorbedingungen testen
      const fixture = TestBed.createComponent(NgModelHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(editorOf(fixture).getText()).toEqual('Modell\n');

      // Änderungen durchführen
      editorOf(fixture).insertText(0, 'Mein ', 'user');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(fixture.componentInstance.value).toEqual('<p>Mein Modell</p>');
    });

    it('Sollte den nach einer Konfigurationsänderung angepassten Wert an das Model melden', async () => {
      // Vorbedingungen testen
      const fixture = TestBed.createComponent(NgModelHostComponent);
      fixture.componentInstance.value = '<h1 class="lux-quill-heading-1">Titel</h1>';
      fixture.componentInstance.preset.set('document');
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      // Änderungen durchführen
      fixture.componentInstance.config.set({ headingMode: 'visual' });
      fixture.detectChanges();
      await fixture.whenStable();

      // Nachbedingungen prüfen
      expect(fixture.componentInstance.value).toEqual('<p class="lux-quill-heading-1">Titel</p>');
    });
  });

  describe('Konfiguration', () => {
    it('Sollte LUX_QUILL_CONFIG als app-weite Vorgabe verwenden', () => {
      // Vorbedingungen testen
      TestBed.overrideProvider(LUX_QUILL_CONFIG, { useValue: { toolbar: ['bold'] } });
      const fixture = TestBed.createComponent(StandaloneHostComponent);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const buttons = fixture.nativeElement.querySelectorAll('.lux-quill-toolbar-control');
      expect(buttons.length).toEqual(1);
      expect(buttons[0].classList).toContain('lux-quill-toolbar-bold');
    });

    it('Sollte den Wert nach einem Wechsel des headingMode anpassen und melden', () => {
      // Vorbedingungen testen
      const fixture = TestBed.createComponent(StandaloneHostComponent);
      const host = fixture.componentInstance;
      host.preset.set('document');
      host.value.set('<h1 class="lux-quill-heading-1">Titel</h1><p>Text</p>');
      fixture.detectChanges();
      expect(host.valueChanges).toEqual([]);

      // Änderungen durchführen
      host.config.set({ headingMode: 'visual' });
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.value()).toEqual('<p class="lux-quill-heading-1">Titel</p><p>Text</p>');
      expect(host.valueChanges).toEqual(['<p class="lux-quill-heading-1">Titel</p><p>Text</p>']);

      // Änderungen durchführen
      host.config.set({ headingMode: 'none' });
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.value()).toEqual('<p>Titel</p><p>Text</p>');
    });

    it('Sollte nicht mehr erlaubte Formate nach einer Toolbar-Änderung aus dem Wert entfernen', () => {
      // Vorbedingungen testen
      const fixture = TestBed.createComponent(StandaloneHostComponent);
      const host = fixture.componentInstance;
      host.value.set('<p><strong>Fett</strong> und <em>kursiv</em></p>');
      fixture.detectChanges();

      // Änderungen durchführen
      host.config.set({ toolbar: ['italic'] });
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.value()).toEqual('<p>Fett und <em>kursiv</em></p>');
    });

    it('Sollte den angepassten Wert im Formular übernehmen, ohne es als dirty zu markieren', () => {
      // Vorbedingungen testen
      const fixture = TestBed.createComponent(FormHostComponent);
      const host = fixture.componentInstance;
      host.preset.set('document');
      host.form.controls.text.setValue('<h2 class="lux-quill-heading-2">Titel</h2>');
      fixture.detectChanges();

      // Änderungen durchführen
      host.config.set({ headingMode: 'visual' });
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.form.controls.text.value).toEqual('<p class="lux-quill-heading-2">Titel</p>');
      expect(host.form.controls.text.dirty).toBeFalse();
    });

    it('Sollte die Quill-Instanz über luxEditorCreated liefern und bei Konfigurationsänderung neu aufbauen', () => {
      // Vorbedingungen testen
      const fixture = TestBed.createComponent(StandaloneHostComponent);
      const host = fixture.componentInstance;
      fixture.detectChanges();
      expect(host.createdEditors.length).toEqual(1);
      host.value.set('<p>Bleibt erhalten</p>');
      fixture.detectChanges();

      // Änderungen durchführen
      host.preset.set('document');
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.createdEditors.length).toEqual(2);
      expect(host.createdEditors[1].getText()).toEqual('Bleibt erhalten\n');
      expect(fixture.nativeElement.querySelectorAll('.ql-editor').length).toEqual(1);
    });
  });

  describe('Erweiterbarkeit', () => {
    it('Sollte zusätzliche Formate und Tastatur-Bindings über luxConfig unterstützen', () => {
      // Vorbedingungen testen
      Quill.register({ 'formats/strike': Strike }, true);
      const fixture = TestBed.createComponent(StandaloneHostComponent);
      const host = fixture.componentInstance;
      host.config.set({
        formats: ['strike'],
        modules: {
          keyboard: {
            bindings: {
              strike: {
                key: 'S',
                shortKey: true,
                shiftKey: true,
                handler(this: { quill: Quill }, _range: unknown, context: { format: Record<string, unknown> }) {
                  this.quill.format('strike', !context.format['strike'], 'user');
                  return false;
                }
              }
            }
          }
        }
      });
      host.value.set('<p>Hallo Welt</p>');
      fixture.detectChanges();
      editorOf(fixture).focus();
      editorOf(fixture).setSelection(0, 5);

      // Änderungen durchführen
      const prevented = pressKey(fixture, 'S', { ctrlKey: true, shiftKey: true });

      // Nachbedingungen prüfen
      expect(prevented).toBeTrue();
      expect(host.value()).toEqual('<p><s>Hallo</s> Welt</p>');
    });
  });

  describe('luxQuillNormalizeHtml', () => {
    it('Sollte einzelne &nbsp; in Leerzeichen umwandeln und Folgen sichtbar lassen', () => {
      expect(luxQuillNormalizeHtml('<p>a&nbsp;b</p>')).toEqual('<p>a b</p>');
      expect(luxQuillNormalizeHtml('<p>a&nbsp;&nbsp;b</p>')).toEqual('<p>a&nbsp; b</p>');
      expect(luxQuillNormalizeHtml('<p>a&nbsp;&nbsp;&nbsp;b</p>')).toEqual('<p>a&nbsp; &nbsp;b</p>');
    });

    it('Sollte echte geschützte Leerzeichen erhalten', () => {
      expect(luxQuillNormalizeHtml('<p>10 €</p>')).toEqual('<p>10 €</p>');
    });
  });
});

@Component({
  template: `
    <lux-quill
      [(value)]="value"
      luxLabel="Kommentar"
      [luxHint]="hint()"
      [luxPlaceholder]="placeholder()"
      [luxRequired]="required()"
      [luxDisabled]="disabled()"
      [readonly]="readonly()"
      [luxErrorMessage]="errorMessage()"
      [luxPreset]="preset()"
      [luxConfig]="config()"
      (valueChange)="valueChanges.push($event)"
      (luxEditorCreated)="createdEditors.push($event)"
    ></lux-quill>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxQuillComponent]
})
class StandaloneHostComponent {
  value = signal('');
  hint = signal('');
  placeholder = signal('');
  required = signal(false);
  disabled = signal(false);
  readonly = signal(false);
  errorMessage = signal<string | undefined>(undefined);
  preset = signal<LuxQuillPreset>('comment');
  config = signal<Partial<LuxQuillConfig> | undefined>(undefined);
  createdEditors: Quill[] = [];
  valueChanges: string[] = [];
}

@Component({
  template: `
    <form [formGroup]="form">
      <lux-quill formControlName="text" luxLabel="Beschreibung" [(luxDisabled)]="disabled" [luxPreset]="preset()" [luxConfig]="config()"></lux-quill>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxQuillComponent, ReactiveFormsModule]
})
class FormHostComponent {
  disabled = signal(false);
  preset = signal<LuxQuillPreset>('comment');
  config = signal<Partial<LuxQuillConfig> | undefined>(undefined);
  form = new FormGroup({
    text: new FormControl('<p>Start</p>', { nonNullable: true, validators: Validators.required })
  });
}

@Component({
  template: `<lux-quill [(ngModel)]="value" luxLabel="Notiz" [luxPreset]="preset()" [luxConfig]="config()"></lux-quill>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxQuillComponent, FormsModule]
})
class NgModelHostComponent {
  value = '<p>Modell</p>';
  preset = signal<LuxQuillPreset>('comment');
  config = signal<Partial<LuxQuillConfig> | undefined>(undefined);
}
