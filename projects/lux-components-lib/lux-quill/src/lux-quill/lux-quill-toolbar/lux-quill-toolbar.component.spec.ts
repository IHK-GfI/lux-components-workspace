import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTooltipDirective } from '@ihk-gfi/lux-components';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../../src/testing/transloco-test.provider';
import { LuxQuillHeadingMode, LuxQuillToolbarItem } from '../lux-quill-config';
import { LUX_QUILL_TOOLTIP_SHOW_DELAY, LuxQuillToolbarAction, LuxQuillToolbarComponent } from './lux-quill-toolbar.component';

describe('LuxQuillToolbarComponent', () => {
  let fixture: ComponentFixture<ToolbarHostComponent>;
  let host: ToolbarHostComponent;

  beforeAll(() => {
    LuxA11yTestHelper.addA11yMatchers();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarHostComponent],
      providers: [provideNoopAnimations(), provideLuxTranslocoTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function controls(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.lux-quill-toolbar-control'));
  }

  function keydown(key: string) {
    const toolbar: HTMLElement = fixture.nativeElement.querySelector('lux-quill-toolbar');
    toolbar.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  it('Sollte die Rolle toolbar mit Label und Verweis auf den Editor besitzen', () => {
    // Nachbedingungen prüfen
    const toolbar: HTMLElement = fixture.nativeElement.querySelector('lux-quill-toolbar');
    expect(toolbar.getAttribute('role')).toEqual('toolbar');
    expect(toolbar.getAttribute('aria-label')).toEqual('Formatierung');
    expect(toolbar.getAttribute('aria-controls')).toEqual('editor-id');
  });

  it('Sollte die Überschriften-Auswahl nur bei aktivierten Überschriften anzeigen', () => {
    // Vorbedingungen testen
    expect(fixture.nativeElement.querySelector('.lux-quill-toolbar-heading')).toBeNull();

    // Änderungen durchführen
    host.headingMode.set('semantic');
    fixture.detectChanges();

    // Nachbedingungen prüfen
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('.lux-quill-toolbar-heading');
    expect(trigger).not.toBeNull();
    expect(trigger.getAttribute('aria-label')).toEqual('Textstil: Standardtext');
    expect(trigger.getAttribute('aria-haspopup')).toEqual('menu');
  });

  it('Sollte die Buttons in der konfigurierten Reihenfolge anzeigen', () => {
    // Änderungen durchführen
    host.items.set(['link', 'bold']);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(controls().map((button) => button.getAttribute('aria-label'))).toEqual(['Link', 'Fett']);
  });

  it('Sollte aria-pressed aus den aktiven Formaten ableiten', () => {
    // Änderungen durchführen
    host.activeFormats.set({ bold: true, list: 'ordered' });
    fixture.detectChanges();

    // Nachbedingungen prüfen
    const pressed = (item: string) => fixture.nativeElement.querySelector(`.lux-quill-toolbar-${item}`).getAttribute('aria-pressed');
    expect(pressed('bold')).toEqual('true');
    expect(pressed('italic')).toEqual('false');
    expect(pressed('orderedList')).toEqual('true');
    expect(pressed('bulletList')).toEqual('false');
    expect(pressed('indent')).toBeNull();
  });

  it('Sollte alle Buttons per Tab erreichbar machen und mit Pfeiltasten, Pos1 und Ende navigieren', () => {
    // Vorbedingungen testen
    const buttons = controls();
    expect(buttons.map((button) => button.tabIndex)).toEqual(buttons.map(() => 0));
    buttons[0].focus();

    // Änderungen durchführen
    keydown('ArrowRight');

    // Nachbedingungen prüfen
    expect(document.activeElement).toBe(controls()[1]);

    // Änderungen durchführen
    keydown('End');

    // Nachbedingungen prüfen
    expect(document.activeElement).toBe(controls()[controls().length - 1]);

    // Änderungen durchführen
    keydown('ArrowRight');

    // Nachbedingungen prüfen
    expect(document.activeElement).toBe(controls()[0]);

    // Änderungen durchführen
    keydown('ArrowLeft');
    keydown('Home');

    // Nachbedingungen prüfen
    expect(document.activeElement).toBe(controls()[0]);
  });

  it('Sollte nach dem Verkleinern der Toolbar vom letzten gültigen Control aus navigieren', () => {
    // Vorbedingungen testen: Fokus auf dem letzten von zehn Controls
    controls()[controls().length - 1].focus();
    fixture.detectChanges();

    // Änderungen durchführen: Toolbar auf drei Einträge verkleinern, dann Pfeil rechts
    host.items.set(['bold', 'italic', 'underline']);
    fixture.detectChanges();
    keydown('ArrowRight');

    // Nachbedingungen prüfen: Vom letzten gültigen Control geht es zum ersten.
    expect(document.activeElement).toBe(controls()[0]);
  });

  it('Sollte beim Klick eine Aktion melden und den Fokusverlust des Editors verhindern', () => {
    // Vorbedingungen testen
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.lux-quill-toolbar-italic');
    const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });

    // Änderungen durchführen
    button.dispatchEvent(mousedown);
    button.click();

    // Nachbedingungen prüfen
    expect(mousedown.defaultPrevented).toBe(true);
    expect(host.actions).toEqual([{ item: 'italic' }]);
  });

  it('Sollte im Disabled-Zustand alle Controls deaktivieren', () => {
    // Änderungen durchführen
    host.disabled.set(true);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(controls().every((button) => button.disabled)).toBe(true);
    expect(fixture.nativeElement.querySelector('lux-quill-toolbar').getAttribute('aria-disabled')).toEqual('true');
  });

  describe('Tooltips', () => {
    function tooltips(): LuxTooltipDirective[] {
      return fixture.debugElement.queryAll(By.directive(LuxTooltipDirective)).map((element) => element.injector.get(LuxTooltipDirective));
    }

    /**
     * jsdom hat keine Layout-Engine (offsetTop ist immer 0) und keinen ResizeObserver. Die Zeilen der umbrechenden
     * Toolbar werden daher über offsetTop vorgegeben und die Neubestimmung direkt ausgelöst, wie es sonst der
     * ResizeObserver tut. Das tatsächliche Umbrechen im Browser lässt sich hier nicht prüfen.
     */
    function layoutRows(rowOf: (index: number) => number) {
      controls().forEach((control, index) => vi.spyOn(control, 'offsetTop', 'get').mockReturnValue(rowOf(index) * 40));
      const toolbar = fixture.debugElement.query(By.directive(LuxQuillToolbarComponent)).componentInstance as LuxQuillToolbarComponent;
      (toolbar as any).updateRows();
      fixture.detectChanges();
    }

    it('Sollte Tooltips erst verzögert anzeigen', () => {
      // Nachbedingungen prüfen
      expect(tooltips().length).toBeGreaterThan(0);
      expect(tooltips().every((tooltip) => tooltip.showDelay === LUX_QUILL_TOOLTIP_SHOW_DELAY)).toBe(true);
    });

    it('Sollte in einer einzeiligen Toolbar alle Tooltips nach oben öffnen', () => {
      // Änderungen durchführen
      layoutRows(() => 0);

      // Nachbedingungen prüfen
      expect(tooltips().every((tooltip) => tooltip.position === 'above')).toBe(true);
    });

    it('Sollte Tooltips unterer Zeilen nach unten öffnen und bei Größenänderung neu bestimmen', () => {
      // Änderungen durchführen: Ab dem dritten Control bricht die Toolbar um
      layoutRows((index) => (index < 2 ? 0 : 1));

      // Nachbedingungen prüfen
      const expected = controls().map((_control, index) => (index < 2 ? 'above' : 'below'));
      expect(expected, 'mehrzeilig').toContain('below');
      expect(tooltips().map((tooltip) => tooltip.position)).toEqual(expected);

      // Änderungen durchführen: wieder einzeilig
      layoutRows(() => 0);

      // Nachbedingungen prüfen
      expect(tooltips().map((tooltip) => tooltip.position)).toEqual(controls().map(() => 'above'));
    });
  });

  it('Sollte keine A11y-Fehler haben', async () => {
    host.headingMode.set('visual');
    host.activeFormats.set({ bold: true });
    fixture.detectChanges();

    await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
  });
});

@Component({
  // Über die Breite lässt sich der Zeilenumbruch der Toolbar steuern.
  template: `
    <div [style.width]="width()">
      <lux-quill-toolbar
        [luxItems]="items()"
        [luxHeadingMode]="headingMode()"
        [luxActiveFormats]="activeFormats()"
        [luxDisabled]="disabled()"
        luxEditorId="editor-id"
        luxAriaLabel="Formatierung"
        (luxAction)="actions.push($event)"
      ></lux-quill-toolbar>
      <div id="editor-id" role="textbox" aria-label="Editor" contenteditable="true"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxQuillToolbarComponent]
})
class ToolbarHostComponent {
  items = signal<LuxQuillToolbarItem[]>([
    'heading',
    'bold',
    'italic',
    'underline',
    'bulletList',
    'orderedList',
    'outdent',
    'indent',
    'link',
    'clean'
  ]);
  headingMode = signal<LuxQuillHeadingMode>('none');
  activeFormats = signal<Record<string, unknown>>({});
  disabled = signal(false);
  width = signal('600px');
  actions: LuxQuillToolbarAction[] = [];
}
