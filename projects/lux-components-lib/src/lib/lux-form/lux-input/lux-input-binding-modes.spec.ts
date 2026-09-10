import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, form, minLength, required } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LUX_FORMS_COMPAT } from '../lux-form-model/lux-form-legacy/lux-control-value-accessor.directive';
import { LuxInputComponent } from './lux-input.component';

/**
 * Prüft die drei Bindungsarten, die eine LUX-FormComponent nach der Signal-Forms-Umstellung
 * unterstützt, an der echten Komponente. Die bisherige API (luxControlBinding, luxValue) deckt
 * lux-input.component.spec.ts unverändert ab.
 */

@Component({
  template: `<lux-input luxLabel="Name" [formField]="testForm.name" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInputComponent, FormField]
})
class SignalFormHostComponent {
  readonly model = signal({ name: '' });
  readonly testForm = form(this.model, (path) => {
    required(path.name, { message: 'Name ist ein Pflichtfeld' });
    minLength(path.name, 3);
  });
}

@Component({
  template: `<lux-input luxLabel="Name" [(value)]="name" [disabled]="disabled()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInputComponent]
})
class TwoWayHostComponent {
  readonly name = signal('Anna');
  readonly disabled = signal(false);
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-input luxLabel="Name" formControlName="name" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInputComponent, ReactiveFormsModule, ...LUX_FORMS_COMPAT]
})
class ReactiveFormHostComponent {
  readonly formGroup = new FormGroup({
    name: new FormControl('Anna', Validators.required)
  });
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-input luxLabel="Name" luxControlBinding="name" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInputComponent, ReactiveFormsModule]
})
class LuxControlBindingHostComponent {
  readonly formGroup = new FormGroup({
    name: new FormControl('Anna', Validators.required)
  });
}

describe('LuxInputComponent - Bindungsarten', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        LuxConsoleService
      ]
    });
  });

  const inputOf = (fixture: ComponentFixture<unknown>): LuxInputComponent =>
    fixture.debugElement.query(By.directive(LuxInputComponent)).componentInstance;
  const nativeOf = (fixture: ComponentFixture<unknown>): HTMLInputElement => fixture.debugElement.query(By.css('input')).nativeElement;
  const type = (fixture: ComponentFixture<unknown>, text: string) => {
    const native = nativeOf(fixture);
    native.value = text;
    native.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  describe('Signal Form ([formField])', () => {
    let fixture: ComponentFixture<SignalFormHostComponent>;
    let host: SignalFormHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(SignalFormHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte den Modellwert im Eingabefeld anzeigen', () => {
      host.model.set({ name: 'Berta' });
      fixture.detectChanges();

      expect(nativeOf(fixture).value).toBe('Berta');
    });

    it('sollte eine Eingabe in das Modell zurückschreiben', () => {
      type(fixture, 'Cäsar');

      expect(host.model().name).toBe('Cäsar');
    });

    it('sollte required aus dem Schema übernehmen', () => {
      expect(inputOf(fixture).isRequired()).toBe(true);
      expect(nativeOf(fixture).required).toBe(true);
    });

    it('sollte die Fehlermeldung des Schemas erst nach dem Verlassen anzeigen', () => {
      expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

      nativeOf(fixture).dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(host.testForm.name().touched()).toBe(true);
      expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toBe('Name ist ein Pflichtfeld');
    });

    it('sollte bei einem anderen Validator die Standardmeldung anzeigen', () => {
      type(fixture, 'ab');
      nativeOf(fixture).dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toBe('Die Mindestlänge ist 3');
    });
  });

  describe('freistehend ([(value)])', () => {
    let fixture: ComponentFixture<TwoWayHostComponent>;
    let host: TwoWayHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TwoWayHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte den gebundenen Wert anzeigen', () => {
      expect(nativeOf(fixture).value).toBe('Anna');
    });

    it('sollte eine Eingabe nach aussen melden', () => {
      type(fixture, 'Berta');

      expect(host.name()).toBe('Berta');
    });

    it('sollte eine Änderung von aussen übernehmen', () => {
      host.name.set('Cäsar');
      fixture.detectChanges();

      expect(nativeOf(fixture).value).toBe('Cäsar');
    });

    it('sollte disabled als einfachen Input unterstützen', () => {
      host.disabled.set(true);
      fixture.detectChanges();

      expect(nativeOf(fixture).disabled).toBe(true);
    });

    it('sollte ohne Formular keine Fehlermeldung anzeigen', () => {
      type(fixture, '');
      nativeOf(fixture).dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();
    });
  });

  describe('klassische Reactive Forms (formControlName)', () => {
    let fixture: ComponentFixture<ReactiveFormHostComponent>;
    let host: ReactiveFormHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(ReactiveFormHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte den Wert des FormControls anzeigen', () => {
      expect(nativeOf(fixture).value).toBe('Anna');
    });

    it('sollte eine Eingabe in das FormControl schreiben', () => {
      type(fixture, 'Berta');

      expect(host.formGroup.controls.name.value).toBe('Berta');
    });

    it('sollte eine Änderung am FormControl anzeigen', () => {
      host.formGroup.controls.name.setValue('Cäsar');
      fixture.detectChanges();

      expect(nativeOf(fixture).value).toBe('Cäsar');
    });

    it('sollte den Required-Validator des Formulars übernehmen', () => {
      expect(inputOf(fixture).isRequired()).toBe(true);
    });

    it('sollte das FormControl beim Verlassen als berührt markieren', () => {
      expect(host.formGroup.controls.name.touched).toBe(false);

      nativeOf(fixture).dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(host.formGroup.controls.name.touched).toBe(true);
    });

    it('sollte den Fehler des Formulars anzeigen', () => {
      type(fixture, '');
      nativeOf(fixture).dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toBe('* Pflichtfeld');
    });

    it('sollte auf formGroup.disable() reagieren', () => {
      host.formGroup.disable();
      fixture.detectChanges();

      expect(inputOf(fixture).isDisabled()).toBe(true);
      expect(nativeOf(fixture).disabled).toBe(true);
    });
  });
  /**
   * dirty und touched des gebundenen AbstractControls.
   *
   * Vor der Signal-Forms-Umstellung erledigte das Angulars Value-Accessor-Maschinerie, die am
   * nativen Input über [formControl] hing. Ohne diese Bindung müssen die Brücken die beiden
   * Zustände selbst zurückspiegeln.
   */
  describe('dirty/touched des Formulars', () => {
    it('sollte im luxControlBinding-Modus touched setzen', () => {
      const fixture = TestBed.createComponent(LuxControlBindingHostComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.formGroup.touched).toBe(false);

      nativeOf(fixture).dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(fixture.componentInstance.formGroup.controls.name.touched).toBe(true);
      expect(fixture.componentInstance.formGroup.touched).toBe(true);
    });

    it('sollte im luxControlBinding-Modus dirty setzen', () => {
      const fixture = TestBed.createComponent(LuxControlBindingHostComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.formGroup.dirty).toBe(false);

      type(fixture, 'Berta');

      expect(fixture.componentInstance.formGroup.controls.name.dirty).toBe(true);
      expect(fixture.componentInstance.formGroup.dirty).toBe(true);
    });

    it('sollte im luxControlBinding-Modus ohne Zutun des Nutzers nicht dirty werden', () => {
      const fixture = TestBed.createComponent(LuxControlBindingHostComponent);
      fixture.detectChanges();

      fixture.componentInstance.formGroup.controls.name.setValue('Programmatisch');
      fixture.detectChanges();

      expect(fixture.componentInstance.formGroup.dirty).toBe(false);
    });

    it('sollte im formControlName-Modus dirty und touched setzen', () => {
      const fixture = TestBed.createComponent(ReactiveFormHostComponent);
      fixture.detectChanges();

      type(fixture, 'Berta');
      nativeOf(fixture).dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(fixture.componentInstance.formGroup.dirty).toBe(true);
      expect(fixture.componentInstance.formGroup.touched).toBe(true);
    });

    it('sollte im Signal Form dirty und touched setzen', () => {
      const fixture = TestBed.createComponent(SignalFormHostComponent);
      fixture.detectChanges();

      type(fixture, 'Berta');
      nativeOf(fixture).dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(fixture.componentInstance.testForm.name().dirty()).toBe(true);
      expect(fixture.componentInstance.testForm.name().touched()).toBe(true);
    });
  });
});
