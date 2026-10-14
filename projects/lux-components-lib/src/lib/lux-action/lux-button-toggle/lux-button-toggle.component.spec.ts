import { Component, NgZone } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
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
    await TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxButtonToggleComponent<TestOptionValue>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('luxOptions', options);
    fixture.detectChanges();
  });

  it('rendert keine Gruppe bei weniger als zwei Optionen', () => {
    fixture.componentRef.setInput('luxOptions', [options[0]]);
    fixture.detectChanges();

    const group = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    expect(group).toBeNull();
  });

  it('propagiert Single-Select über ControlValueAccessor', () => {
    const onChange = jasmine.createSpy('onChange');
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

  it('setzt Single-Select asynchron per writeValue und markiert über luxCompareWith korrekt', fakeAsync(() => {
    fixture.componentRef.setInput('luxCompareWith', (a: TestOptionValue, b: TestOptionValue) => a?.key === b?.key);
    fixture.detectChanges();

    setTimeout(() => {
      component.writeValue({ key: 'details' });
    });

    tick();
    fixture.detectChanges();

    expect(component.luxSelected()).toBe(options[1].value);
  }));

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

  it('normalisiert Single-Select auch bei asynchron geladenen Optionen auf die Options-Referenz', fakeAsync(() => {
    fixture.componentRef.setInput('luxOptions', []);
    fixture.componentRef.setInput('luxCompareWith', (a: TestOptionValue, b: TestOptionValue) => a?.key === b?.key);
    fixture.detectChanges();

    component.writeValue({ key: 'details' });
    fixture.detectChanges();
    expect(component.luxSelected()).not.toBe(options[1].value);

    setTimeout(() => {
      fixture.componentRef.setInput('luxOptions', options);
    });

    tick();
    fixture.detectChanges();

    expect(component.luxSelected()).toBe(options[1].value);
  }));

  it('propagiert Multi-Select über ControlValueAccessor', () => {
    fixture.componentRef.setInput('luxMultiple', true);
    fixture.detectChanges();

    const onChange = jasmine.createSpy('onChange');
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

  it('aktualisiert den aria-label Fallback bei Sprachwechsel und respektiert Override', fakeAsync(() => {
    const tService = TestBed.inject(TranslocoService);

    let group = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    expect(group.nativeElement.getAttribute('aria-label')).toBe('Auswahl');

    tService.setActiveLang('en');
    tick();
    fixture.detectChanges();

    group = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    expect(group.nativeElement.getAttribute('aria-label')).toBe('Selection');

    fixture.componentRef.setInput('luxAriaLabel', 'Custom Label');
    fixture.detectChanges();

    tService.setActiveLang('de');
    tick();
    fixture.detectChanges();

    group = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    expect(group.nativeElement.getAttribute('aria-label')).toBe('Custom Label');
  }));

  describe('luxVertical', () => {
    const groupElement = (): HTMLElement => fixture.debugElement.query(By.css('mat-button-toggle-group')).nativeElement;
    const isVerticalGroup = () => {
      const classList = groupElement().classList;
      // Die Lux-Klasse (Theme) muss immer zur Material-Klasse passen.
      expect(classList.contains('lux-button-toggle-vertical')).toBe(classList.contains('mat-button-toggle-vertical'));
      return classList.contains('mat-button-toggle-vertical');
    };
    // Ohne Theme ist der Host ein Inline-Element ohne messbare Breite.
    const setHostWidth = (width: number) => {
      fixture.nativeElement.style.display = 'block';
      fixture.nativeElement.style.width = `${width}px`;
    };
    // Rendert inklusive afterNextRender-Hooks. In der Zone, damit kein zweiter Tick (onMicrotaskEmpty) verschachtelt startet.
    const render = () => TestBed.inject(NgZone).run(() => TestBed.tick());
    const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

    it('ist ohne Angabe bei ausreichend Platz horizontal', () => {
      setHostWidth(1000);
      render();

      expect(isVerticalGroup()).toBeFalse();
    });

    it('rendert bei luxVertical=true vertikal', () => {
      setHostWidth(1000);
      fixture.componentRef.setInput('luxVertical', true);
      render();

      expect(isVerticalGroup()).toBeTrue();
      expect(groupElement().classList).not.toContain('lux-button-toggle-auto-vertical');
    });

    it('bleibt bei luxVertical=false auf schmalem Platz horizontal und misst nach Zurücksetzen neu', () => {
      setHostWidth(40);
      fixture.componentRef.setInput('luxVertical', false);
      render();
      expect(isVerticalGroup()).toBeFalse();

      fixture.componentRef.setInput('luxVertical', undefined);
      render();
      expect(isVerticalGroup()).toBeTrue();
    });

    it('wertet Attribut-Schreibweisen und null aus', () => {
      setHostWidth(40);

      fixture.componentRef.setInput('luxVertical', '');
      render();
      expect(isVerticalGroup()).toBeTrue();

      fixture.componentRef.setInput('luxVertical', 'false');
      render();
      expect(isVerticalGroup()).toBeFalse();

      // null bedeutet wie undefined: abhängig vom Platz.
      fixture.componentRef.setInput('luxVertical', null);
      render();
      expect(isVerticalGroup()).toBeTrue();
    });

    it('wechselt im Auto-Modus bei Größenänderung des Hosts auf vertikal und zurück', async () => {
      setHostWidth(1000);
      render();
      expect(isVerticalGroup()).toBeFalse();

      setHostWidth(40);
      await nextFrame();
      render();
      expect(isVerticalGroup()).toBeTrue();
      expect(groupElement().classList).toContain('lux-button-toggle-auto-vertical');

      setHostWidth(1000);
      await nextFrame();
      render();
      expect(isVerticalGroup()).toBeFalse();
      expect(groupElement().classList).not.toContain('lux-button-toggle-auto-vertical');
    });

    it('misst im Auto-Modus neu, wenn sich die Optionen ändern', () => {
      setHostWidth(400);
      render();
      expect(isVerticalGroup()).toBeFalse();

      fixture.componentRef.setInput('luxOptions', [
        { label: 'Eine sehr lange Beschriftung für die erste Option', value: { key: 'first' } },
        { label: 'Eine sehr lange Beschriftung für die zweite Option', value: { key: 'second' } }
      ]);
      render();
      expect(isVerticalGroup()).toBeTrue();

      fixture.componentRef.setInput('luxOptions', options);
      render();
      expect(isVerticalGroup()).toBeFalse();
    });

    it('misst im Auto-Modus neu, wenn sich der Text der Optionen in vertikaler Darstellung ändert', async () => {
      setHostWidth(400);
      fixture.componentRef.setInput('luxOptions', [
        { label: 'Eine sehr lange Beschriftung für die erste Option', value: { key: 'first' } },
        { label: 'Eine sehr lange Beschriftung für die zweite Option', value: { key: 'second' } }
      ]);
      render();
      expect(isVerticalGroup()).toBeTrue();

      // Vertikal gilt sonst die zuletzt gemessene Breite, nur der MutationObserver erkennt den neuen Text.
      groupElement()
        .querySelectorAll('.mat-button-toggle-label-content')
        .forEach((label, index) => (label.textContent = `Option ${index + 1}`));
      await nextFrame();
      render();
      expect(isVerticalGroup()).toBeFalse();
    });

    it('berücksichtigt den Rahmen der Gruppe und das Padding des Hosts', async () => {
      setHostWidth(1000);
      render();
      const widthWithoutSelection = groupElement().offsetWidth;

      // Inhaltsbreite des Hosts 1px zu schmal für Gruppe inklusive Rahmen und Häkchen.
      fixture.nativeElement.style.padding = '0 20px';
      setHostWidth(widthWithoutSelection + 30 - 1);
      await nextFrame();
      render();
      expect(isVerticalGroup()).toBeTrue();

      setHostWidth(widthWithoutSelection + 30);
      await nextFrame();
      render();
      expect(isVerticalGroup()).toBeFalse();
    });

    it('plant den Platz für das Häkchen ein, damit eine Auswahl die Ausrichtung nicht umschaltet', async () => {
      setHostWidth(1000);
      render();
      const widthWithoutSelection = groupElement().offsetWidth;

      // Passt ohne Häkchen, aber nicht mit.
      setHostWidth(widthWithoutSelection + 10);
      await nextFrame();
      render();
      expect(isVerticalGroup()).toBeTrue();

      component.luxSelected.set(options[0].value);
      render();
      expect(isVerticalGroup()).toBeTrue();
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
      const onChange = jasmine.createSpy('onChange');
      stringComponent.registerOnChange(onChange);

      stringComponent.onSingleSelectionChange({ value: 'two' } as any);

      expect(stringComponent.luxSelected()).toBe('two');
      expect(onChange).toHaveBeenCalledWith('two');
    });

    it('propagiert Multi-Select mit String-Werten', () => {
      stringFixture.componentRef.setInput('luxMultiple', true);
      stringFixture.detectChanges();

      const onChange = jasmine.createSpy('onChange');
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
