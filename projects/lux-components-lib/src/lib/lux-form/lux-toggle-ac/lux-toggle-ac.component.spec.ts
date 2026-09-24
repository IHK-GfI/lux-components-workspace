// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { ValidatorFnType } from '../lux-form-model/lux-form-component-base.class';
import { LuxToggleAcComponent } from './lux-toggle-ac.component';

describe('LuxToggleAcComponent', () => {
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

  describe('innerhalb eines Formulars', () => {
    describe('FormGroup (not required)"', () => {
      let fixture: ComponentFixture<LuxToggleInFormAttributeComponent>;
      let testComponent: LuxToggleInFormAttributeComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxToggleInFormAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('Formularwert über die Component setzen', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toEqual(true);

        // Änderungen durchführen
        fixture.componentInstance.formGroup.get('eula')!.setValue(false);
        fixture.detectChanges();

        // Nachbedingungen testen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();
        expect(toggleEl.nativeElement.classList).toContain('mdc-switch--unselected');
        expect(toggleEl.nativeElement.required).toBeFalsy();
      }));
    });

    describe('FormGroup (required)"', () => {
      let fixture: ComponentFixture<LuxToggleRequiredInFormAttributeComponent>;
      let testComponent: LuxToggleRequiredInFormAttributeComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxToggleRequiredInFormAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('Formularwert über die Component setzen', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toEqual(null);

        // Änderungen durchführen
        fixture.componentInstance.formGroup.get('eula')!.setValue(true);
        fixture.detectChanges();

        // Nachbedingungen testen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeTruthy();
        expect(toggleEl.nativeElement.classList).toContain('mdc-switch--selected');
      }));

      it('Label anklicken', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();

        // Änderungen durchführen
        const toggleEl = fixture.debugElement.query(By.css('label'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();
        flush();

        // Nachbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeTruthy();
      }));

      it('Toggle anklicken', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();

        // Änderungen durchführen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeTruthy();
      }));

      it('Sollte die korrekte Fehlermeldung anzeigen', () => {
        let errorElement = fixture.debugElement.query(By.css('mat-error'));

        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        testComponent.formGroup.get('eula')!.markAsTouched();
        fixture.detectChanges();

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      });

      it('Sollte einen Fehler bei Startwert "" anzeigen können', fakeAsync(() => {
        testComponent.formGroup.get('eula')!.setValue('');
        let errorElement = fixture.debugElement.query(By.css('mat-error'));
        LuxTestHelper.wait(fixture);

        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        testComponent.formGroup.get('eula')!.markAsTouched();
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      }));

      it('Sollte einen Fehler bei Startwert false anzeigen können', fakeAsync(() => {
        testComponent.formGroup.get('eula')!.setValue(false);
        let errorElement = fixture.debugElement.query(By.css('mat-error'));
        LuxTestHelper.wait(fixture);

        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        testComponent.formGroup.get('eula')!.markAsTouched();
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      }));

      it('Sollte einen Fehler bei Startwert true anzeigen können', fakeAsync(() => {
        testComponent.formGroup.get('eula')!.setValue(true);
        let errorElement = fixture.debugElement.query(By.css('mat-error'));
        LuxTestHelper.wait(fixture);

        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeTruthy();
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        testComponent.formGroup.get('eula')!.setValue(false);
        testComponent.formGroup.get('eula')!.markAsTouched();
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      }));
    });
  });

  describe('außerhalb eines Formulars', () => {
    describe('Attribut "luxChecked" mit Two-Way-Binding', () => {
      let fixture: ComponentFixture<LuxCheckedAttributeComponent>;
      let testComponent: LuxCheckedAttributeComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxCheckedAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('Wert über die Component setzen', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.eula).toBeUndefined();

        // Änderungen durchführen
        fixture.componentInstance.eula = true;
        fixture.detectChanges();

        // Nachbedingungen testen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        expect(toggleEl.nativeElement.classList).toContain('mdc-switch--selected');
      }));

      it('Label anklicken', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.eula).toBeFalsy();

        // Änderungen durchführen
        const toggleEl = fixture.debugElement.query(By.css('label'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();
        flush();

        // Nachbedingungen testen
        expect(fixture.componentInstance.eula).toBeTruthy();
      }));

      it('Toggle anklicken', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.eula).toBeFalsy();

        // Änderungen durchführen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.eula).toBeTruthy();
      }));
    });

    describe('Attribut "luxDisabled"', () => {
      let fixture: ComponentFixture<LuxDisabledAttributeComponent>;
      let testComponent: LuxDisabledAttributeComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxDisabledAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('Wert über die Component setzen', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.disabled).toBeUndefined();

        // Änderungen durchführen
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();

        const toggleEl = fixture.debugElement.query(By.css('button'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.disabled).toBeTruthy();
        expect(toggleEl.nativeElement.disabled).toBeTruthy();
      }));
    });

    describe('Attribut "luxLabel"', () => {
      let fixture: ComponentFixture<LuxLabelAttributeComponent>;
      let testComponent: LuxLabelAttributeComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxLabelAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('Wert über die Component setzen', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.label).toBeUndefined();

        // Änderungen durchführen
        const newLabel = 'A4711';
        fixture.componentInstance.label = newLabel;
        fixture.detectChanges();

        const labelEl = fixture.debugElement.query(By.css('label'));
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.label).toEqual(newLabel);
        expect(labelEl.nativeElement.innerHTML.trim().indexOf(newLabel) !== -1).toBeTruthy();
      }));
    });

    describe('Attribut "luxCheckedChange"', () => {
      let fixture: ComponentFixture<LuxCheckedChangeComponent>;
      let testComponent: LuxCheckedChangeComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxCheckedChangeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('Check Event', fakeAsync(() => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.eula).toBeNull();

        // Änderungen durchführen
        // 1. Click => true
        const toggleEl = fixture.debugElement.query(By.css('button'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.eula).toBeTruthy();

        // Änderungen durchführen
        // 2. Click => false
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.eula).toBeFalsy();
      }));

      it('Sollte den Change-Event nach einer stillen (emitEvent:false) Wertänderung nicht verschlucken', fakeAsync(() => {
        const toggleComponent: LuxToggleAcComponent = fixture.debugElement.query(By.directive(LuxToggleAcComponent)).componentInstance;
        const toggleEl = fixture.debugElement.query(By.css('button'));
        const changeSpy = spyOn(testComponent, 'onCheckedChange').and.callThrough();

        // Änderungen durchführen
        // 1. Click => true (echte User-Interaktion, löst Change-Event aus)
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(fixture.componentInstance.eula).toBeTruthy();

        // Änderungen durchführen
        // 2. Wert intern ohne Event auf false setzen (z.B. um eine Two-Way-Binding-Loop zu brechen)
        toggleComponent.luxFormControl.setValue(false, { emitEvent: false });
        fixture.detectChanges();

        // Nachbedingungen testen: Kein zusätzlicher Change-Event, da bewusst ohne emit gesetzt
        expect(changeSpy).toHaveBeenCalledTimes(1);

        // Änderungen durchführen
        // 3. Click => true (echte User-Interaktion, muss trotz identischem End-Wert erneut feuern)
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(changeSpy).toHaveBeenCalledTimes(2);
        expect(fixture.componentInstance.eula).toBeTruthy();
      }));
    });

    describe('Attribut "luxRequired"', () => {
      let fixture: ComponentFixture<LuxRequiredAttributeComponent>;
      let testComponent: LuxRequiredAttributeComponent;
      let toggleComponent: LuxToggleAcComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxRequiredAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
        toggleComponent = fixture.debugElement.query(By.directive(LuxToggleAcComponent)).componentInstance;
      }));

      it('Sollte die korrekte Fehlermeldung anzeigen', fakeAsync(() => {
        let errorElement = fixture.debugElement.query(By.css('mat-error'));

        // Vorbedingungen testen
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        toggleComponent.formControl.markAsTouched();
        fixture.detectChanges();
        tick();

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      }));
    });

    describe('Error-Message', () => {
      let fixture: ComponentFixture<LuxValidatorsComponent>;
      let testComponent: LuxValidatorsComponent;
      let toggleComponent: LuxToggleAcComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxValidatorsComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
        toggleComponent = fixture.debugElement.query(By.directive(LuxToggleAcComponent)).componentInstance;
      }));

      it('Validatoren setzen und die Fehlermeldungen korrekt anzeigen', fakeAsync(() => {
        // Vorbedingungen testen
        let errorEl = fixture.debugElement.query(By.css('mat-error'));
        expect(errorEl).toBeNull();

        // Änderungen durchführen
        testComponent.validators = Validators.required;
        LuxTestHelper.wait(fixture);
        toggleComponent.formControl.markAsTouched();
        toggleComponent.formControl.updateValueAndValidity();
        LuxTestHelper.wait(fixture, 100);

        // Nachbedingungen testen
        errorEl = fixture.debugElement.query(By.css('mat-error'));
        expect(errorEl.nativeElement.innerText.trim().length).toBeGreaterThan(0);
        expect(toggleComponent.formControl.valid).toBeFalsy();
      }));
    });

    describe('Neubewertung der Validatoren (Issue #284)', () => {
      let fixture: ComponentFixture<LuxRevalidationComponent>;
      let testComponent: LuxRevalidationComponent;
      let toggleComponent: LuxToggleAcComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxRevalidationComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
        toggleComponent = fixture.debugElement.query(By.directive(LuxToggleAcComponent)).componentInstance;
        LuxTestHelper.wait(fixture);
      }));

      it('Sollte beim Aktivieren von [luxRequired] kein luxCheckedChange auslösen', fakeAsync(() => {
        // Vorbedingungen testen
        expect(testComponent.changeCount).toBe(0);

        // Änderungen durchführen
        // Bewusst ohne vorherige Wertänderung: Die Komponente hat bis hierhin noch nichts
        // ausgeliefert. Trotzdem darf die reine Neubewertung kein Event erzeugen.
        testComponent.required = true;
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(toggleComponent.formControl.invalid).toBeTrue();
        expect(testComponent.changeCount).toBe(0);
      }));

      it('Sollte bei geänderten [luxControlValidators] kein weiteres luxCheckedChange auslösen', fakeAsync(() => {
        const toggleEl = fixture.debugElement.query(By.css('button'));

        // Änderungen durchführen
        // Erst eine echte User-Interaktion, damit die Komponente einen Wert kennt.
        toggleEl.nativeElement.click();
        LuxTestHelper.wait(fixture);

        // Vorbedingungen testen
        expect(testComponent.changeCount).toBe(1);

        // Änderungen durchführen
        testComponent.validators = Validators.requiredTrue;
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen: Die Validatoren sind aktiv, es gab aber keine Wertänderung
        expect(toggleComponent.formControl.hasValidator(Validators.requiredTrue)).toBeTrue();
        expect(testComponent.changeCount).toBe(1);
      }));

      it('Sollte beim Schließen der Fehlermeldung kein luxCheckedChange auslösen', fakeAsync(() => {
        const wrapper: LuxFormControlWrapperComponent = fixture.debugElement.query(
          By.directive(LuxFormControlWrapperComponent)
        ).componentInstance;

        // Änderungen durchführen
        toggleComponent.formControl.setValue(true);
        LuxTestHelper.wait(fixture);
        wrapper.onCloseErrorMessage();
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen: Das Schließen wertet nur neu aus, der Wert bleibt unverändert.
        expect(testComponent.changeCount).toBe(1);
      }));

      it('Sollte ein stilles setValue mit sofortiger Rückkehr auf den alten Wert nicht verschlucken', fakeAsync(() => {
        // Änderungen durchführen
        toggleComponent.formControl.setValue(true);
        LuxTestHelper.wait(fixture);

        // Vorbedingungen testen
        expect(testComponent.changeCount).toBe(1);

        // Änderungen durchführen
        // Still auf false und im selben Tick zurück auf true - ohne Change Detection dazwischen.
        // Genau hier hat das frühere distinctUntilChanged() das Event verschluckt (Issue #284).
        toggleComponent.formControl.setValue(false, { emitEvent: false });
        toggleComponent.formControl.setValue(true);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(testComponent.changeCount).toBe(2);
      }));

      it('Sollte bei wiederholtem updateValueAndValidity() kein weiteres luxCheckedChange auslösen', fakeAsync(() => {
        // Änderungen durchführen
        toggleComponent.formControl.setValue(true);
        LuxTestHelper.wait(fixture);

        // Vorbedingungen testen
        expect(testComponent.changeCount).toBe(1);

        // Änderungen durchführen
        toggleComponent.formControl.updateValueAndValidity();
        toggleComponent.formControl.updateValueAndValidity();
        toggleComponent.formControl.updateValueAndValidity();
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(testComponent.changeCount).toBe(1);
      }));

      it('Sollte nach einem setValidators() von außen weiter korrekt ausliefern', fakeAsync(() => {
        // Änderungen durchführen
        // setValidators() ersetzt die Validatoren komplett. Die Beobachtung hängt bewusst nicht
        // an den Validatoren, sondern an registerOnChange(), und bleibt davon unberührt.
        toggleComponent.formControl.setValidators(Validators.requiredTrue);
        LuxTestHelper.wait(fixture);
        toggleComponent.formControl.setValue(true);
        LuxTestHelper.wait(fixture);

        // Vorbedingungen testen
        expect(testComponent.changeCount).toBe(1);

        // Änderungen durchführen
        // Stille Änderung und Rückkehr: Funktioniert nur, wenn der Beobachter wieder hängt.
        toggleComponent.formControl.setValue(false, { emitEvent: false });
        toggleComponent.formControl.setValue(true);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(testComponent.changeCount).toBe(2);
      }));
    });

    describe('Zyklus über mehrere Komponenten (Issue #284)', () => {
      let fixture: ComponentFixture<LuxMutualUpdateComponent>;
      let testComponent: LuxMutualUpdateComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(LuxMutualUpdateComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
        LuxTestHelper.wait(fixture);
      }));

      it('Sollte sich gegenseitig aktualisierende Change-Handler nicht in eine Endlosschleife laufen lassen', fakeAsync(() => {
        // Vorbedingungen testen
        expect(testComponent.countA).toBe(0);
        expect(testComponent.countB).toBe(0);

        // Änderungen durchführen
        // Beide Handler rufen updateValueAndValidity() auf dem jeweils anderen FormControl auf.
        // Ohne Filterung schaukelt sich das synchron endlos hoch.
        fixture.debugElement.queryAll(By.css('button'))[0].nativeElement.click();
        LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        // A hat sich wirklich geändert und liefert genau einmal aus. B nicht: Dort wurden nur die
        // Validatoren neu ausgewertet, der Wert ist derselbe geblieben.
        expect(testComponent.notbremse).toBeFalse();
        expect(testComponent.countA).toBe(1);
        expect(testComponent.countB).toBe(0);
      }));
    });
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxToggleA11yComponent>;
    let testComponent: LuxToggleA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(LuxToggleA11yComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled = true;
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly = true;
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required = true;
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  template: ` <lux-toggle-ac luxLabel="Magst du Pommes?" [luxChecked]="true" [luxDisabled]="disabled"></lux-toggle-ac> `,
  imports: [LuxToggleAcComponent]
})
class LuxDisabledAttributeComponent {
  disabled?: boolean;
}

@Component({
  template: ` <lux-toggle-ac luxLabel="Eula gelesen?" (luxCheckedChange)="onCheckedChange($event)"></lux-toggle-ac> `,
  imports: [LuxToggleAcComponent]
})
class LuxCheckedChangeComponent {
  eula: boolean | null = null;

  onCheckedChange(value: boolean) {
    this.eula = value;
  }
}

@Component({
  template: ` <lux-toggle-ac luxLabel="Eula gelesen?" [(luxChecked)]="eula"></lux-toggle-ac> `,
  imports: [LuxToggleAcComponent]
})
class LuxCheckedAttributeComponent {
  eula?: boolean;
}

@Component({
  template: ` <lux-toggle-ac [luxLabel]="label" [luxChecked]="false"></lux-toggle-ac> `,
  imports: [LuxToggleAcComponent]
})
class LuxLabelAttributeComponent {
  label?: string;
}

@Component({
  template: ` <lux-toggle-ac [luxLabel]="label" [luxRequired]="true"></lux-toggle-ac> `,
  imports: [LuxToggleAcComponent]
})
class LuxRequiredAttributeComponent {
  label?: string;
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-toggle-ac luxLabel="Eula gelesen?" luxControlBinding="eula" [luxRequired]="required"></lux-toggle-ac>
    </form>
  `,
  imports: [ReactiveFormsModule, LuxToggleAcComponent]
})
class LuxToggleInFormAttributeComponent {
  formGroup: FormGroup;
  required?: boolean;

  constructor() {
    this.formGroup = new FormGroup<any>({
      eula: new FormControl<boolean>(true)
    });
  }
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-toggle-ac luxLabel="Eula gelesen?" luxControlBinding="eula"></lux-toggle-ac>
    </form>
  `,
  imports: [ReactiveFormsModule, LuxToggleAcComponent]
})
class LuxToggleRequiredInFormAttributeComponent {
  formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup<any>({
      eula: new FormControl<boolean | null>(null, Validators.requiredTrue)
    });
  }
}

@Component({
  template: ` <lux-toggle-ac luxLabel="Eula gelesen?" [(luxChecked)]="eula" [luxControlValidators]="validators"></lux-toggle-ac> `,
  imports: [LuxToggleAcComponent]
})
class LuxValidatorsComponent {
  eula?: boolean;
  validators: ValidatorFnType;
}

@Component({
  template: `
    <lux-toggle-ac
      luxLabel="Eula gelesen?"
      [luxControlValidators]="validators"
      [luxRequired]="required"
      (luxCheckedChange)="onCheckedChange()"
    ></lux-toggle-ac>
  `,
  imports: [LuxToggleAcComponent]
})
class LuxRevalidationComponent {
  validators: ValidatorFnType;
  required = false;
  changeCount = 0;

  onCheckedChange() {
    this.changeCount++;
  }
}

@Component({
  template: `
    <lux-toggle-ac #a luxLabel="A" [(luxChecked)]="a" (luxCheckedChange)="onA()"></lux-toggle-ac>
    <lux-toggle-ac #b luxLabel="B" [(luxChecked)]="b" (luxCheckedChange)="onB()"></lux-toggle-ac>
  `,
  imports: [LuxToggleAcComponent]
})
class LuxMutualUpdateComponent {
  @ViewChild('a') toggleA!: LuxToggleAcComponent;
  @ViewChild('b') toggleB!: LuxToggleAcComponent;

  a = false;
  b = false;
  countA = 0;
  countB = 0;
  /** Verhindert, dass ein Fehlverhalten den Testlauf aufhängt statt fehlzuschlagen. */
  notbremse = false;

  onA() {
    this.countA++;
    if (this.countA + this.countB > 50) {
      this.notbremse = true;
      return;
    }
    this.toggleB.formControl.updateValueAndValidity();
  }

  onB() {
    this.countB++;
    if (this.countA + this.countB > 50) {
      this.notbremse = true;
      return;
    }
    this.toggleA.formControl.updateValueAndValidity();
  }
}

@Component({
  template: `
    <lux-toggle-ac luxLabel="Eula gelesen?" [luxDisabled]="disabled" [luxReadonly]="readonly" [luxRequired]="required"></lux-toggle-ac>
  `,
  imports: [LuxToggleAcComponent]
})
class LuxToggleA11yComponent {
  disabled = false;
  readonly = false;
  required = false;
}
