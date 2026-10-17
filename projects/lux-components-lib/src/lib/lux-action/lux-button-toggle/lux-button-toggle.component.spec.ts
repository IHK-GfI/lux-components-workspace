import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Component, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { TranslocoService } from '@jsverse/transloco';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxButtonToggleComponent, LuxButtonToggleOption } from './lux-button-toggle.component';

interface TestOptionValue {
  key: string;
}

describe('LuxButtonToggleComponent', () => {
  let fixture: ComponentFixture<LuxButtonToggleComponent<TestOptionValue>>;
  let component: LuxButtonToggleComponent<TestOptionValue>;

  const options: LuxButtonToggleOption<TestOptionValue>[] = [
    { label: 'Übersicht', value: { key: 'overview' } },
    { label: 'Details', value: { key: 'details' } }
  ];

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxButtonToggleComponent<TestOptionValue>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('luxOptions', options);
    await LuxTestHelper.wait(fixture);
  });

  afterEach(async () => {
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    vi.useRealTimers();
  });

  it('rendert keine Gruppe bei weniger als zwei Optionen', () => {
    fixture.componentRef.setInput('luxOptions', [options[0]]);
    fixture.detectChanges();

    const group = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    expect(group).toBeNull();
  });

  it('propagiert Single-Select über ControlValueAccessor', () => {
    const onChange = vi.fn().mockName('onChange');
    component.registerOnChange(onChange);

    component.onSingleSelectionChange({ value: options[1].value } as any);

    expect(component.luxSelected()).toEqual(options[1].value);
    expect(onChange).toHaveBeenCalledWith(options[1].value);
  });

  it('markiert Single-Select per luxCompareWith auch bei neuem Objektreferenzwert', () => {
    fixture.componentRef.setInput('luxCompareWith', (a: TestOptionValue, b: TestOptionValue) => a?.key === b?.key);
    fixture.detectChanges();

    component.writeValue({ key: 'details' });
    fixture.detectChanges();

    expect(component.luxSelected()).toBe(options[1].value);
  });

  it('setzt Single-Select asynchron per writeValue und markiert über luxCompareWith korrekt', async () => {
    fixture.componentRef.setInput('luxCompareWith', (a: TestOptionValue, b: TestOptionValue) => a?.key === b?.key);
    await LuxTestHelper.wait(fixture);

    setTimeout(() => {
      component.writeValue({ key: 'details' });
    });

    await LuxTestHelper.wait(fixture);

    expect(component.luxSelected()).toBe(options[1].value);
  });

  it('normalisiert Single-Select bei später geladenen Optionen auf die Options-Referenz', () => {
    fixture.componentRef.setInput('luxOptions', []);
    fixture.componentRef.setInput('luxCompareWith', (a: TestOptionValue, b: TestOptionValue) => a?.key === b?.key);
    fixture.detectChanges();

    component.writeValue({ key: 'details' });
    fixture.detectChanges();
    expect(component.luxSelected()).not.toBe(options[1].value);

    fixture.componentRef.setInput('luxOptions', options);
    fixture.detectChanges();

    expect(component.luxSelected()).toBe(options[1].value);
  });

  it('normalisiert Single-Select auch bei asynchron geladenen Optionen auf die Options-Referenz', async () => {
    fixture.componentRef.setInput('luxOptions', []);
    fixture.componentRef.setInput('luxCompareWith', (a: TestOptionValue, b: TestOptionValue) => a?.key === b?.key);
    await LuxTestHelper.wait(fixture);

    component.writeValue({ key: 'details' });
    await LuxTestHelper.wait(fixture);
    expect(component.luxSelected()).not.toBe(options[1].value);

    setTimeout(() => {
      fixture.componentRef.setInput('luxOptions', options);
    });

    await LuxTestHelper.wait(fixture);

    expect(component.luxSelected()).toBe(options[1].value);
  });

  it('propagiert Multi-Select über ControlValueAccessor', () => {
    fixture.componentRef.setInput('luxMultiple', true);
    fixture.detectChanges();

    const onChange = vi.fn().mockName('onChange');
    component.registerOnChange(onChange);

    component.onMultipleSelectionChange(options[0].value, true);
    component.onMultipleSelectionChange(options[1].value, true);

    expect(component.luxSelectedValues()).toEqual([options[0].value, options[1].value]);
    expect(onChange).toHaveBeenCalledWith([options[0].value, options[1].value]);
  });

  it('zeigt Required-Fehler nach Touch mit Default-Text', () => {
    fixture.componentRef.setInput('luxRequired', true);
    fixture.detectChanges();

    const group = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    group.triggerEventHandler('focusout', {});
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('.lux-button-toggle-error'));
    expect(error).not.toBeNull();
    expect(error.nativeElement.textContent).toContain('Das ist ein Pflichtfeld');
  });

  it('aktualisiert den aria-label Fallback bei Sprachwechsel und respektiert Override', async () => {
    const tService = TestBed.inject(TranslocoService);

    let group = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    expect(group.nativeElement.getAttribute('aria-label')).toBe('Auswahl');

    tService.setActiveLang('en');
    await LuxTestHelper.wait(fixture);

    group = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    expect(group.nativeElement.getAttribute('aria-label')).toBe('Selection');

    fixture.componentRef.setInput('luxAriaLabel', 'Custom Label');
    await LuxTestHelper.wait(fixture);

    tService.setActiveLang('de');
    await LuxTestHelper.wait(fixture);

    group = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    expect(group.nativeElement.getAttribute('aria-label')).toBe('Custom Label');
  });

  describe('luxVertical', () => {
    const groupElement = (): HTMLElement => fixture.debugElement.query(By.css('mat-button-toggle-group')).nativeElement;
    const isVerticalGroup = () => {
      const classList = groupElement().classList;
      // Die Lux-Klasse (Theme) muss immer zur Material-Klasse passen.
      expect(classList.contains('lux-button-toggle-vertical')).toBe(classList.contains('mat-button-toggle-vertical'));
      return classList.contains('mat-button-toggle-vertical');
    };
    // Rendert inklusive afterNextRender-Hooks. In der Zone, damit kein zweiter Tick (onMicrotaskEmpty) verschachtelt startet.
    const render = () => TestBed.inject(NgZone).run(() => TestBed.tick());

    describe('Umschaltlogik', () => {
      // jsdom hat keine Layout-Engine (clientWidth, scrollWidth usw. liefern immer 0) und keinen ResizeObserver.
      // Der verfügbare Platz und die natürliche Breite der Gruppe werden daher vorgegeben; das tatsächliche
      // Messen im Browser prüft der visuelle Regressionstest (e2e/visual/button-toggle-wrap.spec.ts).
      const layout = { available: 1000, natural: 300 };

      /** Simuliert den ResizeObserver, der unter jsdom fehlt. */
      const resizeHost = (available: number) => {
        layout.available = available;
        component.evaluateLayout();
        render();
      };

      beforeEach(() => {
        layout.available = 1000;
        layout.natural = 300;
        vi.spyOn(component as any, 'measureAvailableWidth').mockImplementation(() => layout.available);
        vi.spyOn(component as any, 'measureNaturalWidth').mockImplementation(() => layout.natural);
      });

      it('ist ohne Angabe bei ausreichend Platz horizontal', () => {
        resizeHost(1000);

        expect(isVerticalGroup()).toBe(false);
      });

      it('rendert bei luxVertical=true vertikal', () => {
        fixture.componentRef.setInput('luxVertical', true);
        render();

        expect(isVerticalGroup()).toBe(true);
        expect(groupElement().classList).not.toContain('lux-button-toggle-auto-vertical');
      });

      it('bleibt bei luxVertical=false auf schmalem Platz horizontal und misst nach Zurücksetzen neu', () => {
        layout.available = 40;
        fixture.componentRef.setInput('luxVertical', false);
        render();
        expect(isVerticalGroup()).toBe(false);

        fixture.componentRef.setInput('luxVertical', undefined);
        render();
        expect(isVerticalGroup()).toBe(true);
      });

      it('wertet Attribut-Schreibweisen und null aus', () => {
        layout.available = 40;

        fixture.componentRef.setInput('luxVertical', '');
        render();
        expect(isVerticalGroup()).toBe(true);

        fixture.componentRef.setInput('luxVertical', 'false');
        render();
        expect(isVerticalGroup()).toBe(false);

        // null bedeutet wie undefined: abhängig vom Platz.
        fixture.componentRef.setInput('luxVertical', null);
        render();
        expect(isVerticalGroup()).toBe(true);
      });

      it('wechselt im Auto-Modus bei Größenänderung des Hosts auf vertikal und zurück', () => {
        resizeHost(1000);
        expect(isVerticalGroup()).toBe(false);

        resizeHost(40);
        expect(isVerticalGroup()).toBe(true);
        expect(groupElement().classList).toContain('lux-button-toggle-auto-vertical');

        // Vertikal gilt die zuletzt horizontal gemessene natürliche Breite.
        resizeHost(1000);
        expect(isVerticalGroup()).toBe(false);
        expect(groupElement().classList).not.toContain('lux-button-toggle-auto-vertical');
      });

      it('behält im Auto-Modus vertikal die horizontale Breite als Platzbedarf', () => {
        resizeHost(40);
        expect(isVerticalGroup()).toBe(true);

        const wrapper = fixture.debugElement.query(By.css('.lux-button-toggle-wrapper')).nativeElement as HTMLElement;
        expect(wrapper.style.width).toBe('300px');

        resizeHost(1000);
        expect(wrapper.style.width).toBe('');
      });

      it('misst im Auto-Modus neu, wenn sich die Optionen ändern', () => {
        resizeHost(400);
        expect(isVerticalGroup()).toBe(false);

        layout.natural = 800;
        fixture.componentRef.setInput('luxOptions', [
          { label: 'Eine sehr lange Beschriftung für die erste Option', value: { key: 'first' } },
          { label: 'Eine sehr lange Beschriftung für die zweite Option', value: { key: 'second' } }
        ]);
        render();
        expect(isVerticalGroup()).toBe(true);

        layout.natural = 300;
        fixture.componentRef.setInput('luxOptions', options);
        render();
        expect(isVerticalGroup()).toBe(false);
      });

      it('misst im Auto-Modus neu, wenn sich der Text der Optionen in vertikaler Darstellung ändert', async () => {
        layout.available = 400;
        layout.natural = 800;
        fixture.componentRef.setInput('luxOptions', [
          { label: 'Eine sehr lange Beschriftung für die erste Option', value: { key: 'first' } },
          { label: 'Eine sehr lange Beschriftung für die zweite Option', value: { key: 'second' } }
        ]);
        render();
        expect(isVerticalGroup()).toBe(true);

        // Vertikal gilt sonst die zuletzt gemessene Breite, nur der MutationObserver erkennt den neuen Text.
        layout.natural = 200;
        groupElement()
          .querySelectorAll('.mat-button-toggle-label-content')
          .forEach((label, index) => (label.textContent = `Option ${index + 1}`));
        // MutationObserver-Callbacks laufen als Microtask.
        await vi.advanceTimersByTimeAsync(0);
        render();
        expect(isVerticalGroup()).toBe(false);
      });
    });

    describe('Messung', () => {
      // jsdom hat keine Layout-Engine: Die Maße von Host, Gruppe und Buttons werden daher vorgegeben.
      // Geprüft wird die Berechnung aus diesen Maßen, das tatsächliche Layout prüft der VRT.
      const stubWidth = (element: HTMLElement, property: 'clientWidth' | 'offsetWidth' | 'scrollWidth', value: number) =>
        vi.spyOn(element, property, 'get').mockReturnValue(value);

      const stubGroup = () => {
        const group = groupElement();
        stubWidth(group, 'scrollWidth', 200);
        stubWidth(group, 'offsetWidth', 202);
        stubWidth(group, 'clientWidth', 200);
        // Ohne Material-CSS haben die Buttons kein Padding für das Häkchen.
        group.querySelectorAll<HTMLElement>('.mat-button-toggle-button').forEach((button) => (button.style.padding = '0px'));
        return group;
      };
      const indicatorReserve = (group: HTMLElement, count: number) =>
        group.querySelector('.mat-button-toggle-checkbox-wrapper') !== null ? 30 * count : 0;

      it('zieht das Padding des Hosts vom verfügbaren Platz ab', () => {
        const host = fixture.nativeElement as HTMLElement;
        host.style.padding = '0 20px';
        stubWidth(host, 'clientWidth', 1000);

        expect((component as any).measureAvailableWidth()).toBe(960);
      });

      it('berücksichtigt den Rahmen der Gruppe in der natürlichen Breite', () => {
        const group = stubGroup();

        expect((component as any).measureNaturalWidth(group)).toBe(202 + indicatorReserve(group, 1));
      });

      it('plant den Platz für das Häkchen ein, damit eine Auswahl die Ausrichtung nicht umschaltet', () => {
        const group = stubGroup();
        const widthWithoutSelection = (component as any).measureNaturalWidth(group);

        component.luxSelected.set(options[0].value);
        render();
        stubGroup();

        expect((component as any).measureNaturalWidth(group)).toBe(widthWithoutSelection);
      });

      it('plant bei Multi-Select den Platz für das Häkchen je Option ein', () => {
        fixture.componentRef.setInput('luxMultiple', true);
        render();
        const group = stubGroup();

        expect((component as any).measureNaturalWidth(group)).toBe(202 + indicatorReserve(group, options.length));
      });
    });
  });

  describe('Barrierefreiheit', () => {
    beforeAll(() => LuxA11yTestHelper.addA11yMatchers());

    it('hat keine A11y-Verstöße (horizontal und vertikal)', async () => {
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);

      fixture.componentRef.setInput('luxVertical', true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });

  describe('mit String-Optionswerten', () => {
    let stringFixture: ComponentFixture<LuxButtonToggleComponent<string>>;
    let stringComponent: LuxButtonToggleComponent<string>;

    const stringOptions: LuxButtonToggleOption<string>[] = [
      { label: 'Option 1', value: 'one' },
      { label: 'Option 2', value: 'two' }
    ];

    beforeEach(() => {
      stringFixture = TestBed.createComponent(LuxButtonToggleComponent<string>);
      stringComponent = stringFixture.componentInstance;
      stringFixture.componentRef.setInput('luxOptions', stringOptions);
      stringFixture.detectChanges();
    });

    it('propagiert Single-Select mit String-Werten', () => {
      const onChange = vi.fn().mockName('onChange');
      stringComponent.registerOnChange(onChange);

      stringComponent.onSingleSelectionChange({ value: 'two' } as any);

      expect(stringComponent.luxSelected()).toBe('two');
      expect(onChange).toHaveBeenCalledWith('two');
    });

    it('propagiert Multi-Select mit String-Werten', () => {
      stringFixture.componentRef.setInput('luxMultiple', true);
      stringFixture.detectChanges();

      const onChange = vi.fn().mockName('onChange');
      stringComponent.registerOnChange(onChange);

      stringComponent.onMultipleSelectionChange('one', true);
      stringComponent.onMultipleSelectionChange('two', true);

      expect(stringComponent.luxSelectedValues()).toEqual(['one', 'two']);
      expect(onChange).toHaveBeenCalledWith(['one', 'two']);
    });
  });

  describe('mit luxControlBinding', () => {
    @Component({
      selector: 'lux-button-toggle-host',
      template: `
        <form [formGroup]="form">
          <lux-button-toggle [luxOptions]="options" luxControlBinding="view"></lux-button-toggle>
        </form>
      `,
      standalone: true,
      imports: [ReactiveFormsModule, LuxButtonToggleComponent]
    })
    class HostComponent {
      options: LuxButtonToggleOption<TestOptionValue>[] = [
        { label: 'Übersicht', value: { key: 'overview' } },
        { label: 'Details', value: { key: 'details' } }
      ];

      form = new FormGroup({
        view: new FormControl<TestOptionValue | null>(null, Validators.required)
      });
    }

    let hostFixture: ComponentFixture<HostComponent>;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();
    });

    it('zeigt Required-Fehler nach markAllAsTouched()', () => {
      const form = hostFixture.componentInstance.form;
      form.markAllAsTouched();
      hostFixture.detectChanges();

      const error = hostFixture.debugElement.query(By.css('.lux-button-toggle-error'));
      expect(error).not.toBeNull();
      expect(error.nativeElement.textContent).toContain('Das ist ein Pflichtfeld');
    });
  });
});
