// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxErrorCallbackFnType, ValidatorFnType } from '../lux-form-model/lux-form-component-base.class';
import { LuxTextareaComponent } from './lux-textarea.component';

describe('LuxTextareaComponent', () => {
  let textarea: LuxTextareaComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  describe('[ReactiveForm]', () => {
    let component: LuxMockFormTextareaComponent;
    let fixture: ComponentFixture<LuxMockFormTextareaComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxMockFormTextareaComponent);
      component = fixture.componentInstance;
      textarea = fixture.debugElement.query(By.directive(LuxTextareaComponent)).componentInstance;
    });

    it('Sollte value über das FormControl aktualisieren', fakeAsync(() => {
      // Given
      fixture.detectChanges();
      const formControl = component.form.get('control')!;
      const textareaEl = fixture.debugElement.query(By.css('textarea')).nativeElement;
      // When
      // Then
      expect(component.value()).toBeFalsy();
      expect(formControl.value).toBeFalsy();

      // When
      formControl.setValue('Test');
      LuxTestHelper.wait(fixture);
      // Then
      expect(component.value()).toEqual('Test');
      expect(textareaEl.value).toEqual('Test');
    }));

    it('Sollte invalid sein wenn Validators.required', fakeAsync(() => {
      // Given
      const formControl = component.form.get('control')!;
      formControl.setValidators(Validators.required);
      component.value.set('Test');
      fixture.detectChanges();
      // When
      // Then
      expect(formControl.errors).toBeFalsy();
      expect(formControl.valid).toBeTruthy();

      // When
      component.value.set('');
      fixture.detectChanges();
      // Then
      expect(formControl.errors).toBeTruthy();
      expect(formControl.errors!['required']).toBeTruthy();
      expect(formControl.valid).toBeFalsy();
    }));

    it('Sollte Validatoren setzen und korrekte Fehlermeldungen anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      let errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeFalsy();

      // Änderungen durchführen
      component.form.get('control')!.setValidators(Validators.maxLength(1));
      component.form.get('control')!.setValue('12');
      LuxTestHelper.wait(fixture);
      textarea.formControl.markAsTouched();
      textarea.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeTruthy();
      expect(errorEl.nativeElement.innerText.trim()).toEqual('Die Maximallänge ist 1');
      expect(textarea.formControl.valid).toBeFalsy();
    }));
  });

  describe('[Allgemein]', () => {
    let component: LuxMockTextareaComponent;
    let fixture: ComponentFixture<LuxMockTextareaComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxMockTextareaComponent);
      component = fixture.componentInstance;
      textarea = fixture.debugElement.query(By.directive(LuxTextareaComponent)).componentInstance;
    });

    it('Sollte value über Two-Way-Binding aktualisieren', fakeAsync(() => {
      // Given
      fixture.detectChanges();
      const textareaEl = fixture.debugElement.query(By.css('textarea')).nativeElement;
      // When
      // Then
      expect(component.value()).toBeFalsy();
      expect(textarea.value()).toBeFalsy();

      // When
      component.value.set('Test');
      LuxTestHelper.wait(fixture);
      // Then
      expect(textarea.value()).toEqual('Test');
      expect(textareaEl.value).toEqual('Test');
    }));

    it('Sollte label und placeholder setzen', fakeAsync(() => {
      // Given
      component.label.set('Label');
      component.placeholder.set('Placeholder');
      fixture.detectChanges();

      const labelEl = fixture.debugElement.query(By.css('.lux-label-authentic')).nativeElement;
      const textareaEl = fixture.debugElement.query(By.css('textarea')).nativeElement;
      // When
      // Then
      expect(labelEl.innerText.trim()).toEqual('Label');
      expect(textareaEl.placeholder).toEqual('Placeholder');
    }));

    it('Sollte invalid sein wenn luxRequired = true', fakeAsync(() => {
      // Given
      component.required.set(true);
      component.value.set('Test');
      fixture.detectChanges();
      // When
      // Then
      expect(textarea.formControl.errors).toBeFalsy();
      expect(textarea.formControl.valid).toBeTruthy();

      // When
      component.value.set('');
      fixture.detectChanges();
      // Then
      expect(textarea.formControl.errors).toBeTruthy();
      expect(textarea.formControl.errors!['required']).toBeTruthy();
      expect(textarea.formControl.valid).toBeFalsy();
    }));

    it('Sollte Validatoren setzen und korrekte Fehlermeldungen anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      fixture.detectChanges();
      let errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeFalsy();

      // Änderungen durchführen
      component.validators.set(Validators.maxLength(1));
      component.value.set('12');
      LuxTestHelper.wait(fixture);
      textarea.formControl.markAsTouched();
      textarea.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeTruthy();
      expect(errorEl.nativeElement.innerText.trim()).toEqual('Die Maximallänge ist 1');
      expect(textarea.formControl.valid).toBeFalsy();
    }));

    it('Sollte einen Startwert haben', fakeAsync(() => {
      component.value.set('Praise the sun');
      LuxTestHelper.wait(fixture);
      expect(textarea.value()).toEqual('Praise the sun');
      expect(fixture.debugElement.query(By.css('textarea')).nativeElement.value.trim()).toEqual('Praise the sun');
    }));

    it('Sollte den Hint setzen', fakeAsync(() => {
      // Vorbedingungen testen
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('mat-hint'))).toBeNull();

      // Änderungen durchführen
      component.hint.set('Hint');
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(fixture.debugElement.query(By.css('mat-hint')).nativeElement.textContent.trim()).toEqual('Hint');
    }));

    it('Sollte disabled sein', fakeAsync(() => {
      // Vorbedingungen testen
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('textarea')).nativeElement.disabled).toBe(false);
      expect(textarea.luxDisabled()).toBe(false);

      // Änderungen durchführen
      component.disabled.set(true);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(fixture.debugElement.query(By.css('textarea')).nativeElement.disabled).toBe(true);
      expect(textarea.luxDisabled()).toBe(true);
    }));

    it('Sollte die luxErrorMessage anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

      // Änderungen durchführen
      component.validators.set(Validators.required);
      component.errorMessage.set('Alle meine Entchen');
      LuxTestHelper.wait(fixture);

      textarea.formControl.markAsTouched();
      textarea.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual('Alle meine Entchen');
      expect(textarea.formControl.errors!['required']).toBeDefined();
    }));

    it('Sollte den Fehler über luxErrorCallback anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('mat-error'))).toBeNull();

      // Änderungen durchführen
      component.validators.set(Validators.required);
      const spy = jasmine.createSpy('errorCb').and.returnValue('Alle meine Entchen');
      component.errorCb.set(spy);
      LuxTestHelper.wait(fixture);

      textarea.formControl.markAsTouched();
      textarea.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(fixture.debugElement.query(By.css('mat-error'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual('Alle meine Entchen');
      expect(textarea.formControl.errors!['required']).toBeDefined();
      expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('Sollte nicht null/undefined im Label anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('mat-label'))).toBeNull();

      // Änderungen durchführen
      component.label.set(null);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-label-authentic')).nativeElement.textContent.trim()).toEqual('');

      // Änderungen durchführen
      component.label.set(undefined);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-label-authentic')).nativeElement.textContent.trim()).toEqual('');
    }));

    it('Sollte readonly sein', fakeAsync(() => {
      // Vorbedingungen testen
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('textarea')).attributes['readonly']).toBeFalsy();

      // Änderungen durchführen
      component.readonly.set(true);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(fixture.debugElement.query(By.css('textarea')).attributes['readonly']).toBe('true');
    }));

    it('Sollte maximal und minimal n-Zeilen erlauben', fakeAsync(() => {
      // Vorbedingungen testen
      component.minRows.set(0);
      component.maxRows.set(1);
      LuxTestHelper.wait(fixture);
      let textareaNode = fixture.debugElement.query(By.css('textarea'));
      const lineHeight = textareaNode.nativeElement.style.maxHeight;

      // Änderungen durchführen
      component.maxRows.set(3);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      textareaNode = fixture.debugElement.query(By.css('textarea'));
      expect(textareaNode.nativeElement.style.maxHeight).toEqual(lineHeight.replace('px', '') * 3 + 'px');

      // Änderungen durchführen
      component.minRows.set(2);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      textareaNode = fixture.debugElement.query(By.css('textarea'));
      expect(textareaNode.nativeElement.style.minHeight).toEqual(lineHeight.replace('px', '') * 2 + 'px');
    }));

    it('Sollte luxValueChange angemessen oft aufrufen', fakeAsync(() => {
      // Vorbedingungen testen
      const spy = spyOn(component, 'valueChanged');
      LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      component.value.set('a');
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      component.value.set('b');
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);

      // Änderungen durchführen
      // Absichtlich denselben Wert nochmal, sollte nichts auslösen
      component.value.set('b');
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);
    }));
  });

  describe('LuxCounterLabel', () => {
    let fixture: ComponentFixture<LuxTextareaCounterLabelComponent>;
    let testComponent: LuxTextareaCounterLabelComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(LuxTextareaCounterLabelComponent);
      testComponent = fixture.componentInstance;
      textarea = fixture.debugElement.query(By.directive(LuxTextareaComponent)).componentInstance;
      fixture.detectChanges();
    }));

    it('sollte Counter-Label bei focused=true anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      testComponent.maxLength.set(50);
      fixture.detectChanges();
      const textareaEl = fixture.debugElement.query(By.css('textarea'));

      // Fokus aktivieren
      const formControlEl = fixture.debugElement.query(By.directive(LuxFormControlWrapperComponent))!;
      const formControlComponent = formControlEl.injector.get<LuxFormControlWrapperComponent>(LuxFormControlWrapperComponent);
      formControlComponent.focused.set(true);
      // // Wert ändern
      LuxTestHelper.typeInElement(textareaEl.nativeElement, 'Lorem ipsum');
      LuxTestHelper.wait(fixture);
      // // Prüfen
      let labelEl = fixture.debugElement.query(By.css('.lux-form-control-character-counter-authentic'));
      expect(labelEl.nativeElement.innerHTML.trim()).toContain('11/50');
      // Fokus deaktivieren
      formControlComponent.focused.set(false);
      fixture.detectChanges();
      // Prüfen
      labelEl = fixture.debugElement.query(By.css('.lux-form-control-character-counter-authentic'));
      expect(labelEl.nativeElement.innerHTML.trim()).not.toContain('11/50');
    }));

    it('sollte Counter-Label bei leerem Value anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      testComponent.maxLength.set(50);
      fixture.detectChanges();
      const textareaEl = fixture.debugElement.query(By.css('textarea'));

      // Fokus aktivieren
      const formControlEl = fixture.debugElement.query(By.directive(LuxFormControlWrapperComponent))!;
      const formControlComponent = formControlEl.injector.get<LuxFormControlWrapperComponent>(LuxFormControlWrapperComponent);
      formControlComponent.focused.set(true);
      // // Wert ändern
      LuxTestHelper.typeInElement(textareaEl.nativeElement, '');
      LuxTestHelper.wait(fixture);
      // // Prüfen
      const labelEl = fixture.debugElement.query(By.css('.lux-form-control-character-counter-authentic'));
      expect(labelEl.nativeElement.innerHTML.trim()).toContain('0/50');
    }));

    it('bei disabled sollte kein Wert gezeigt werden', fakeAsync(() => {
      // Vorbedingungen testen
      testComponent.maxLength.set(50);
      fixture.detectChanges();
      const textareaEl = fixture.debugElement.query(By.css('textarea'));

      // Fokus aktivieren
      const formControlEl = fixture.debugElement.query(By.directive(LuxFormControlWrapperComponent))!;
      const formControlComponent = formControlEl.injector.get<LuxFormControlWrapperComponent>(LuxFormControlWrapperComponent);
      formControlComponent.focused.set(true);

      // Wert ändern
      LuxTestHelper.typeInElement(textareaEl.nativeElement, 'Lorem ipsum');
      LuxTestHelper.wait(fixture);

      // Prüfen
      let labelEl = fixture.debugElement.query(By.css('.lux-form-control-character-counter-authentic'));
      expect(labelEl.nativeElement.innerHTML.trim()).toContain('11/50');

      // Fokus deaktivieren
      testComponent.disabled.set(true);
      formControlComponent.focused.set(false);
      fixture.detectChanges();
      // Prüfen
      labelEl = fixture.debugElement.query(By.css('.lux-form-control-character-counter-authentic'));
      expect(textareaEl.nativeElement.disabled).toBe(true);
      expect(labelEl.nativeElement.innerHTML.trim()).not.toContain('11/50');
    }));
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxTextareaA11yComponent>;
    let testComponent: LuxTextareaA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(LuxTextareaA11yComponent);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  selector: 'lux-mock-textarea',
  template: `<lux-textarea
    [(luxValue)]="value"
    [luxLabel]="label()"
    [luxPlaceholder]="placeholder()"
    [luxControlValidators]="validators()"
    [luxReadonly]="readonly()"
    [luxRequired]="required()"
    [luxMaxRows]="maxRows()"
    [luxMinRows]="minRows()"
    [luxDisabled]="disabled()"
    [luxHint]="hint()"
    [luxErrorMessage]="errorMessage()"
    [luxErrorCallback]="errorCb()"
    (luxValueChange)="valueChanged()"
  ></lux-textarea>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTextareaComponent]
})
class LuxMockTextareaComponent {
  value = signal<string | undefined>(undefined);
  label = signal<string | null | undefined>(undefined);
  placeholder = signal<string | undefined>(undefined);
  hint = signal<string | undefined>(undefined);
  disabled = signal<boolean | undefined>(undefined);
  errorMessage = signal<string | undefined>(undefined);

  readonly = signal(false);
  required = signal(false);

  maxRows = signal<number | undefined>(undefined);
  minRows = signal<number | undefined>(undefined);

  validators = signal<ValidatorFnType>(undefined);
  errorCb = signal<LuxErrorCallbackFnType>(() => undefined);

  valueChanged() {}
}

@Component({
  selector: 'lux-mock-form-textarea',
  template: `<form [formGroup]="form">
    <lux-textarea
      [(luxValue)]="value"
      [luxLabel]="label"
      [luxPlaceholder]="placeholder"
      [luxReadonly]="readonly"
      [luxRequired]="required"
      [luxMaxRows]="maxRows"
      [luxMinRows]="minRows"
      luxControlBinding="control"
    ></lux-textarea>
  </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxTextareaComponent]
})
class LuxMockFormTextareaComponent {
  value = signal<string | undefined>(undefined);
  label?: string;
  placeholder?: string;
  readonly = false;
  required = false;

  maxRows?: number;
  minRows?: number;

  form: FormGroup;

  constructor() {
    this.form = new FormGroup<any>({
      control: new FormControl<string | null>(null)
    });
  }
}

@Component({
  selector: 'lux-textarea-counter-label',
  template: ` <lux-textarea luxLabel="Label" [luxHint]="hint" [luxDisabled]="disabled()" [luxMaxLength]="maxLength()"> </lux-textarea> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTextareaComponent]
})
class LuxTextareaCounterLabelComponent {
  hint?: string;
  disabled = signal<boolean | undefined>(undefined);
  maxLength = signal<number | undefined>(undefined);
}

@Component({
  template: `
    <lux-textarea luxLabel="Label" [luxDisabled]="disabled()" [luxReadonly]="readonly()" [luxRequired]="required()"></lux-textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTextareaComponent]
})
class LuxTextareaA11yComponent {
  disabled = signal(false);
  readonly = signal(false);
  required = signal(false);
}
