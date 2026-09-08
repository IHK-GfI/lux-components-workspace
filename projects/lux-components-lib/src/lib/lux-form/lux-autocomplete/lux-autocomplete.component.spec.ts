// noinspection DuplicatedCode

import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxAutocompleteComponent } from './lux-autocomplete.component';

interface TestOption {
  label: string;
  value: string;
}

describe('LuxAutocompleteComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideLuxTranslocoTesting(), LuxConsoleService]
    }).compileComponents();
  });

  describe('innerhalb eines Formulars', () => {
    describe('FormGroup (not required)"', () => {
      let fixture: ComponentFixture<LuxAutoCompleteInFormAttributeComponent>;
      let component: LuxAutoCompleteInFormAttributeComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxAutoCompleteInFormAttributeComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        await new Promise((resolve) => setTimeout(resolve, fixture.componentInstance.autocomplete().luxLookupDelay()));
        fixture.detectChanges();
      });

      it('Formularwert über die Component setzen', async () => {
        // Vorbedingungen testen
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(component.formGroup.get('aufgaben')!.value).toBeNull();

        // Änderungen durchführen
        component.formGroup.get('aufgaben')!.setValue(component.options()[1]);
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.autocomplete().value()).toEqual(component.options()[1]);
        expect(component.formGroup.get('aufgaben')!.value).toEqual(component.options()[1]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('Gruppenaufgaben');
        expect(component.autocomplete().matInput()!.nativeElement.required).toBeFalsy();
      });

      it('Wert über das Textfeld setzen', async () => {
        // Vorbedingungen testen
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(component.formGroup.get('aufgaben')!.value).toBeNull();

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Vertretungsaufgaben');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.autocomplete().value()).toEqual(component.options()[3]);
        expect(component.formGroup.get('aufgaben')!.value).toEqual(component.options()[3]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('Vertretungsaufgaben');
        expect(component.autocomplete().matInput()!.nativeElement.required).toBeFalsy();
      });

      it('Wert über Popup auswählen', async () => {
        // Vorbedingungen testen
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(component.formGroup.get('aufgaben')!.value).toBeNull();

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'meine');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        const options = fixture.nativeElement.querySelectorAll('mat-option');
        options[0].click();
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.autocomplete().value()).toEqual(component.options()[0]);
        expect(component.formGroup.get('aufgaben')!.value).toEqual(component.options()[0]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('Meine Aufgaben');
      });

      it('Sollte die Optionen austauschen', async () => {
        // Vorbedingungen testen
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(component.formGroup.get('aufgaben')!.value).toBeNull();
        expect(component.options()[1].label).toEqual('Gruppenaufgaben');

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'A');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        let options = fixture.nativeElement.querySelectorAll('mat-option');
        expect(options.length).toEqual(4);
        // Hier wird toContain verwendet, da im Safari ein Zeilenumbruch im String entsteht, der zu einem Fehler führt
        expect(options[1].innerText).toContain('Gruppenaufgaben');

        // Änderungen durchführen
        const testOptions = [
          { label: 'Meine Aufgaben 2', value: 'A' },
          { label: 'Gruppenaufgaben 2', value: 'B' },
          { label: 'Zurückgestellte Aufgaben 2', value: 'C' }
        ];
        component.options.set(testOptions);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Au');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());
        options = fixture.nativeElement.querySelectorAll('mat-option');
        expect(options.length).toEqual(3);
        // Hier wird toContain verwendet, da im Safari ein Zeilenumbruch im String entsteht, der zu einem Fehler führt
        expect(options[1].innerText).toContain('Gruppenaufgaben 2');

        // Änderungen durchführen
        options[1].click();
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.autocomplete().value()).toEqual(testOptions[1]);
        expect(component.formGroup.get('aufgaben')!.value).toEqual(testOptions[1]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('Gruppenaufgaben 2');
      });
    });

    describe('String-Werte', () => {
      let fixture: ComponentFixture<LuxAutoCompleteInFormWithStringValuesComponent>;
      let component: LuxAutoCompleteInFormWithStringValuesComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxAutoCompleteInFormWithStringValuesComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        await new Promise((resolve) => setTimeout(resolve, fixture.componentInstance.autocomplete().luxLookupDelay()));
        fixture.detectChanges();
      });

      it('Wert über das Textfeld setzen', async () => {
        // Vorbedingungen testen
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(component.formGroup.get('aufgaben')!.value).toBeNull();

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Vertretungsaufgaben');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.autocomplete().value()).toEqual(component.options[3]);
        expect(component.formGroup.get('aufgaben')!.value).toEqual(component.options[3]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('Vertretungsaufgaben');
        expect(component.autocomplete().matInput()!.nativeElement.required).toBeFalsy();
      });

      it('Wert über Popup auswählen', async () => {
        // Vorbedingungen testen
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(component.formGroup.get('aufgaben')!.value).toBeNull();

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'meine');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        const options = fixture.nativeElement.querySelectorAll('mat-option');
        options[0].click();
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.autocomplete().value()).toEqual(component.options[0]);
        expect(component.formGroup.get('aufgaben')!.value).toEqual(component.options[0]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('Meine Aufgaben');
      });
    });

    describe('Should not click the save button while invalid', () => {
      let fixture: ComponentFixture<LuxAutoCompleteNotAnOptionComponent>;
      let component: LuxAutoCompleteNotAnOptionComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxAutoCompleteNotAnOptionComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        await new Promise((resolve) => setTimeout(resolve, fixture.componentInstance.autocomplete().luxLookupDelay()));
        fixture.detectChanges();
      });

      it('Wert über das Textfeld setzen', async () => {
        // Init
        const onSaveSpy = vi.spyOn(fixture.componentInstance, 'onSave').mockReturnValue(undefined);

        // Vorbedingungen testen
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(component.formGroup.get('aufgaben')!.value).toBeNull();

        // Änderungen durchführen
        const newTextValue = 'DieseOptionHierGibtEsNicht';
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, newTextValue);
        LuxTestHelper.dispatchFakeEvent(component.autocomplete().matInput()!.nativeElement, 'focusout', true);
        await LuxTestHelper.wait(fixture);

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(buttonEl.nativeElement.disabled).toBe(true);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(newTextValue);
        expect(onSaveSpy).toHaveBeenCalledTimes(0);
        expect(component.formGroup.valid).toBe(false);
      });
    });
  });

  describe('außerhalb eines Formulars', () => {
    describe('Attribut "luxValue" mit Two-Way-Binding', () => {
      let fixture: ComponentFixture<LuxValueAttributeComponent>;
      let component: LuxValueAttributeComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxValueAttributeComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        await new Promise((resolve) => setTimeout(resolve, fixture.componentInstance.autocomplete().luxLookupDelay()));
        fixture.detectChanges();
      });

      it('Wert über die Component setzen', async () => {
        // Vorbedingungen testen
        expect(component.selected()).toEqual('');

        // Änderungen durchführen
        component.selected.set(component.options[2]);
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.selected()).toEqual(component.options[2]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(component.options[2].label);
      });

      it('Wert über das Textfeld setzen', async () => {
        // Vorbedingungen testen
        expect(component.selected()).toEqual('');

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Vertretungsaufgaben');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.selected()).toEqual(component.options[3]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(component.options[3].label);
      });

      it('Wert der keiner Option entspricht', async () => {
        // Vorbedingungen testen
        expect(component.selected()).toEqual('');
        expect(component.strict()).toBeTruthy();

        // Änderungen durchführen
        component.strict.set(false);
        fixture.detectChanges();

        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'zzz');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.strict()).toBeFalsy();
        expect(component.selected()).toEqual('zzz');
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('zzz');
      });

      it('Unvollständigen Wert über das Textfeld setzen', async () => {
        // Vorbedingungen testen
        expect(component.selected()).toEqual('');

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Ver');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.selected()).toEqual(component.options[3]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(component.options[3].label);
      });

      it('Wert über Popup auswählen', async () => {
        // Vorbedingungen testen
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(component.selected()).toEqual('');

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'meine');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        const options = fixture.nativeElement.querySelectorAll('mat-option');
        options[0].click();
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.autocomplete().value()).toEqual(component.options[0]);
        expect(component.selected()).toEqual(component.options[0]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('Meine Aufgaben');
      });
    });

    describe('Two-Way-Binding mit String-Werten', () => {
      let fixture: ComponentFixture<LuxAutoCompleteTwoWayBindingWithStringValuesComponent>;
      let component: LuxAutoCompleteTwoWayBindingWithStringValuesComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxAutoCompleteTwoWayBindingWithStringValuesComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        await new Promise((resolve) => setTimeout(resolve, fixture.componentInstance.autocomplete().luxLookupDelay()));
        fixture.detectChanges();
      });

      it('Wert über die Component setzen', async () => {
        // Vorbedingungen testen
        expect(component.selected()).toEqual('');

        // Änderungen durchführen
        component.selected.set(component.options[2]);
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.selected()).toEqual(component.options[2]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(component.options[2]);
      });

      it('Wert über das Textfeld setzen', async () => {
        // Vorbedingungen testen
        expect(component.selected()).toEqual('');

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Vertretungsaufgaben');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.selected()).toEqual(component.options[3]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(component.options[3]);
      });

      it('Wert über Popup auswählen', async () => {
        // Vorbedingungen testen
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(component.selected()).toEqual('');

        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'meine');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        const options = fixture.nativeElement.querySelectorAll('mat-option');
        options[0].click();
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.autocomplete().value()).toEqual(component.options[0]);
        expect(component.selected()).toEqual(component.options[0]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('Meine Aufgaben');
      });
    });

    describe('Attribut "luxOptionSelected"', () => {
      let fixture: ComponentFixture<LuxOptionSelectedComponent>;
      let component: LuxOptionSelectedComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxOptionSelectedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, fixture.componentInstance.autocomplete().luxLookupDelay()));
        fixture.detectChanges();
      });

      it('Neue Option auswählen', async () => {
        // Vorbedingungen testen
        expect(component.selected).toBeNull();
        const spy = vi.spyOn(component, 'setSelected');

        // 1. Durchlauf mit dem Wert "Gruppenaufgaben"
        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Gruppenaufgaben');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.selected).toEqual(component.options[1]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(component.options[1].label);
        expect(spy).toHaveBeenCalledTimes(1);

        // 2. Durchlauf mit dem Wert "Meine Aufga"
        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Meine Aufga');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.selected).toEqual(component.options[0]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(component.options[0].label);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('Gleiche Option auswählen', async () => {
        // Vorbedingungen testen
        expect(component.selected).toBeNull();
        const spy = vi.spyOn(component, 'setSelected');

        // 1. Durchlauf
        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Gruppenaufgaben');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // 2. Durchlauf
        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Gruppenaufgaben');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.selected).toEqual(component.options[1]);
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(component.options[1].label);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('Option deselektieren', async () => {
        // Vorbedingungen testen
        expect(component.selected).toBeNull();
        const spy = vi.spyOn(component, 'setSelected');

        // Ein Element auswählen
        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Gruppenaufgaben');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Selektiertes Element entfernen, in dem man den Text löscht.
        // Änderungen durchführen
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, '');
        await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

        await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

        // Nachbedingungen testen
        expect(component.selected).toBeNull();
        expect(component.autocomplete().matInput()!.nativeElement.value).toEqual('');
        expect(spy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Autovervollständigung testen', () => {
    let component: MockAutocompleteComponent;
    let fixture: ComponentFixture<MockAutocompleteComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(MockAutocompleteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte erstellt werden', () => {
      expect(component).toBeTruthy();
    });

    /** Workaround mit (done) => { fixture.whenStable() bis done() um intervalTimer von RxJs funktionieren zu lassen } */

    it('sollte sich öffnen lassen', async () => {
      await fixture.whenStable().then(() => {
        LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'a');

        fixture.detectChanges();

        const options = fixture.nativeElement.querySelectorAll('mat-option');

        expect(options.length).toBeGreaterThan(0);
      });
    });

    it('sollte keine Ergebnisse haben wenn ein invalider Wert eingetippt wird', async () => {
      await LuxTestHelper.typeInElementAsync('xxx', fixture, component.autocomplete().matInput()!.nativeElement, () => {
        const options = fixture.nativeElement.querySelectorAll('mat-option') as NodeListOf<HTMLElement>;
        expect(options.length).toBe(0);
      });
    });

    it('darf nicht während der Eingabe den Wert vervollständigen, sondern erst bei FocusOut', async () => {
      await LuxTestHelper.typeInElementAsync('Vertretungsauf', fixture, component.autocomplete().matInput()!.nativeElement, () => {
        expect(component.autocomplete().formControl.value).not.toEqual({ label: 'Vertretungsaufgaben', value: 'D' });
      });
    });

    it('sollte die richtige Anzahl an Ergebnissen haben wenn ein valider Wert eingetippt wird', async () => {
      await LuxTestHelper.typeInElementAsync('Meine Aufgaben', fixture, component.autocomplete().matInput()!.nativeElement, () => {
        const options = fixture.nativeElement.querySelectorAll('mat-option') as NodeListOf<HTMLElement>;
        expect(options.length).toBe(1);
        options[0].click();
      });
    });

    it('sollte keine Fehler anzeigen wenn das Input fokussiert ist und kein Wert eingegeben ist', async () => {
      await fixture.whenStable().then(() => {
        LuxTestHelper.dispatchFakeEvent(component.autocomplete().matInput()!.nativeElement, 'focus', true);
        fixture.detectChanges();

        expect(component.autocomplete().formControl.errors).toBeNull();
        expect(component.autocomplete().formControl.valid).toBeTruthy();
      });
    });
  });

  describe('labelTemplate testen', () => {
    let component: LuxAutoCompleteWithCustomOptionTemplateComponent;
    let fixture: ComponentFixture<LuxAutoCompleteWithCustomOptionTemplateComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxAutoCompleteWithCustomOptionTemplateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte erstellt werden', () => {
      expect(component).toBeTruthy();
    });

    it('sollte custom template einbetten', async () => {
      await LuxTestHelper.typeInElementAsync('Meine Aufgaben', fixture, component.autocomplete().matInput()!.nativeElement, () => {
        const options = fixture.nativeElement.querySelectorAll('mat-option') as NodeListOf<HTMLElement>;
        expect(options.length).toBe(1);

        const customOptionContainer = options[0].querySelector('span');

        // prüfe custom template struktur
        expect(customOptionContainer).toBeTruthy();
        expect(customOptionContainer!.textContent?.indexOf('- 123')).toBeTruthy();
      });
    });
  });

  describe('luxPickValue testen', () => {
    let component: MockPickValueComponent;
    let fixture: ComponentFixture<MockPickValueComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(MockPickValueComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte erstellt werden', () => {
      expect(component).toBeTruthy();
    });

    it('Wert über Textfeld setzen', async () => {
      expect(component.selected).toBeUndefined();
      expect(component.twoWaySelected).toBeUndefined();
      const onSelectedSpy = vi.spyOn(fixture.componentInstance, 'setSelected');
      expect(onSelectedSpy).toHaveBeenCalledTimes(0);

      // Ein Element auswählen
      // Änderungen durchführen
      LuxTestHelper.typeInElement(component.autocomplete().matInput()!.nativeElement, 'Gruppenaufgaben');
      await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

      await removeFocus(fixture, component.autocomplete().matInput()!, component.autocomplete().luxLookupDelay());

      // Nachbedingungen testen
      expect(onSelectedSpy).toHaveBeenCalledTimes(1);
      expect(component.autocomplete().value()).toEqual(component.options[1].value);
      expect(component.selected).toEqual(component.options[1].value);
      expect(component.twoWaySelected).toEqual(component.options[1].value);
      expect(component.autocomplete().matInput()!.nativeElement.value).toEqual(component.options[1].label);
    });
  });

  describe('Nachladen', () => {
    let fixture: ComponentFixture<LuxScrollComponent>;
    let component: LuxScrollComponent;
    let autocomplete: LuxAutocompleteComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxScrollComponent);
      component = fixture.componentInstance;
      autocomplete = fixture.debugElement.query(By.directive(LuxAutocompleteComponent)).componentInstance;
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, autocomplete.luxLookupDelay()));
      fixture.detectChanges();
    });

    it('Sollte die Optionen nachladen', async () => {
      LuxTestHelper.typeInElement(autocomplete.matInput()!.nativeElement, 'Lorem');
      await LuxTestHelper.wait(fixture, autocomplete.luxLookupDelay());

      const options = fixture.nativeElement.querySelectorAll('mat-option');
      expect(options?.length).toEqual(8);
      expect(autocomplete.luxOptions().length).toEqual(10);
      expect(autocomplete.displayedOptions().length).toEqual(8);
      expect(autocomplete.filteredOptions().length).toEqual(2);

      const spy = vi.spyOn(autocomplete, 'updateDisplayedEntries');
      const panel = fixture.debugElement.query(By.css('div.mat-mdc-autocomplete-panel'));
      expect(panel).toBeDefined();
      panel.nativeElement.scrollTop = 200;
      LuxTestHelper.dispatchFakeEvent(panel.nativeElement, 'scroll');
      await LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(autocomplete.luxOptions().length).toEqual(10);
      expect(autocomplete.displayedOptions().length).toEqual(10);
      expect(autocomplete.filteredOptions().length).toEqual(0);
    });
  });

  describe('luxClearable', () => {
    describe('innerhalb eines Formulars', () => {
      let fixture: ComponentFixture<LuxAutoCompleteClearableInFormComponent>;
      let component: LuxAutoCompleteClearableInFormComponent;
      let autocomplete: LuxAutocompleteComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxAutoCompleteClearableInFormComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        autocomplete = fixture.debugElement.query(By.directive(LuxAutocompleteComponent)).componentInstance;
        await new Promise((resolve) => setTimeout(resolve, autocomplete.luxLookupDelay()));
        fixture.detectChanges();
      });

      it('Sollte den Clear-Button anzeigen wenn ein Wert gesetzt ist', async () => {
        // Vorbedingungen testen
        expect(fixture.debugElement.query(By.css('.lux-input-clear-btn button'))).toBeNull();

        // Änderungen durchführen
        component.formGroup.get('aufgaben')!.setValue(component.options[1]);
        await LuxTestHelper.wait(fixture, autocomplete.luxLookupDelay());

        // Nachbedingungen testen
        expect(fixture.debugElement.query(By.css('.lux-input-clear-btn button'))).toBeTruthy();
      });

      it('Sollte den Wert über den Clear-Button zurücksetzen', async () => {
        // Vorbedingungen testen
        component.formGroup.get('aufgaben')!.setValue(component.options[1]);
        await LuxTestHelper.wait(fixture, autocomplete.luxLookupDelay());

        expect(component.formGroup.get('aufgaben')!.value).toEqual(component.options[1]);
        expect(fixture.debugElement.query(By.css('.lux-input-clear-btn button'))).toBeTruthy();

        // Änderungen durchführen
        fixture.debugElement.query(By.css('.lux-input-clear-btn button')).nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(autocomplete.formControl.value).toBeNull();
        expect(autocomplete.matInput()!.nativeElement.value).toEqual('');
        expect(fixture.debugElement.query(By.css('.lux-input-clear-btn button'))).toBeNull();
      });

      it('Sollte den Clear-Button nicht anzeigen wenn luxClearable=false', async () => {
        // Änderungen durchführen
        component.clearable.set(false);
        component.formGroup.get('aufgaben')!.setValue(component.options[0]);
        await LuxTestHelper.wait(fixture, autocomplete.luxLookupDelay());

        // Nachbedingungen testen
        expect(fixture.debugElement.query(By.css('.lux-input-clear-btn button'))).toBeNull();
      });
    });

    describe('außerhalb eines Formulars', () => {
      let fixture: ComponentFixture<LuxAutoCompleteClearableOutsideFormComponent>;
      let component: LuxAutoCompleteClearableOutsideFormComponent;
      let autocomplete: LuxAutocompleteComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxAutoCompleteClearableOutsideFormComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        autocomplete = fixture.debugElement.query(By.directive(LuxAutocompleteComponent)).componentInstance;
        await new Promise((resolve) => setTimeout(resolve, autocomplete.luxLookupDelay()));
        fixture.detectChanges();
      });

      it('Sollte den Wert über den Clear-Button zurücksetzen', async () => {
        // Vorbedingungen testen
        component.selected.set(component.options[2]);
        await LuxTestHelper.wait(fixture, autocomplete.luxLookupDelay());

        expect(component.selected()).toEqual(component.options[2]);
        expect(fixture.debugElement.query(By.css('.lux-input-clear-btn button'))).toBeTruthy();

        // Änderungen durchführen
        fixture.debugElement.query(By.css('.lux-input-clear-btn button')).nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(autocomplete.value()).toBeNull();
        expect(autocomplete.matInput()!.nativeElement.value).toEqual('');
        expect(fixture.debugElement.query(By.css('.lux-input-clear-btn button'))).toBeNull();
      });
    });
  });

  describe('Single option focus handling', () => {
    let fixture: ComponentFixture<LuxAutoCompleteSingleOptionComponent>;
    let component: LuxAutoCompleteSingleOptionComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxAutoCompleteSingleOptionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, component.autocomplete().luxLookupDelay()));
      fixture.detectChanges();
    });

    it('should not auto-select the only option on focusout', async () => {
      expect(component.formGroup.get('aufgaben')!.value).toBeNull();

      LuxTestHelper.dispatchFakeEvent(component.autocomplete().matInput()!.nativeElement, 'focus', true);
      LuxTestHelper.dispatchFakeEvent(component.autocomplete().matInput()!.nativeElement, 'focusout', true);
      await LuxTestHelper.wait(fixture, component.autocomplete().luxLookupDelay());

      expect(component.formGroup.get('aufgaben')!.value).toBeNull();
      expect(component.autocomplete().value()).toBeNull();
    });
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxAutocompleteA11yComponent>;
    let testComponent: LuxAutocompleteA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxAutocompleteA11yComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (mit Wert)', async () => {
      testComponent.value.set(testComponent.options[0]);
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
  template: `
    <form [formGroup]="formGroup">
      <lux-autocomplete
        luxLabel="Autocomplete"
        [luxOptions]="options"
        luxControlBinding="aufgaben"
        [luxClearable]="clearable()"
      ></lux-autocomplete>
    </form>
  `,
  imports: [ReactiveFormsModule, LuxAutocompleteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
class LuxAutoCompleteClearableInFormComponent {
  clearable = signal(true);

  options: TestOption[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  formGroup = new FormGroup({
    aufgaben: new FormControl<TestOption | null>(null)
  });
}

@Component({
  template: `
    <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options" [(luxValue)]="selected" [luxClearable]="true"></lux-autocomplete>
  `,
  imports: [LuxAutocompleteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
class LuxAutoCompleteClearableOutsideFormComponent {
  selected = signal<TestOption | null>(null);

  options: TestOption[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

@Component({
  selector: 'lux-autocomplete-in-form-with-string-values-component',
  template: `
    <form [formGroup]="formGroup">
      <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options" luxControlBinding="aufgaben"> </lux-autocomplete>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxAutocompleteComponent]
})
class LuxAutoCompleteInFormWithStringValuesComponent {
  options: string[] = ['Meine Aufgaben', 'Gruppenaufgaben', 'Zurückgestellte Aufgaben', 'Vertretungsaufgaben'];

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);

  formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup({
      aufgaben: new FormControl<string | null>(null)
    });
  }
}

@Component({
  selector: 'lux-autocomplete-two-way-binding-with-string-values-component',
  template: `
    <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options" [(luxValue)]="selected" [luxStrict]="strict"> </lux-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAutocompleteComponent]
})
class LuxAutoCompleteTwoWayBindingWithStringValuesComponent {
  selected = signal('');
  strict = true;

  options = ['Meine Aufgaben', 'Gruppenaufgaben', 'Zurückgestellte Aufgaben', 'Vertretungsaufgaben'];

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);
}

@Component({
  selector: 'lux-autocomplete-with-custom-option-template-component',
  template: `
    <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options" [(luxValue)]="selected" [luxStrict]="strict"> </lux-autocomplete>

    <ng-template let-option #labelTemplate>
      <div>
        <span>{{ option }} - 123</span>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAutocompleteComponent]
})
class LuxAutoCompleteWithCustomOptionTemplateComponent {
  selected = '';
  strict = true;

  options = ['Meine Aufgaben', 'Gruppenaufgaben', 'Zurückgestellte Aufgaben', 'Vertretungsaufgaben'];

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);
}

@Component({
  template: ` <lux-autocomplete luxLabel="Label" [luxOptions]="options" [luxOptionBlockSize]="8"></lux-autocomplete> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAutocompleteComponent]
})
class LuxScrollComponent {
  options: {
    label: string;
    value: string;
  }[] = [
    { label: 'Lorem ipsum A', value: 'A' },
    { label: 'Lorem ipsum B', value: 'B' },
    { label: 'Lorem ipsum C', value: 'C' },
    { label: 'Lorem ipsum D', value: 'D' },
    { label: 'Lorem ipsum E', value: 'E' },
    { label: 'Lorem ipsum F', value: 'F' },
    { label: 'Lorem ipsum G', value: 'G' },
    { label: 'Lorem ipsum H', value: 'H' },
    { label: 'Lorem ipsum I', value: 'I' },
    { label: 'Lorem ipsum J', value: 'J' }
  ];
}

@Component({
  selector: 'lux-autocomplete-in-form-attribute-component',
  template: `
    <form [formGroup]="formGroup">
      <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options()" luxControlBinding="aufgaben"> </lux-autocomplete>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxAutocompleteComponent]
})
class LuxAutoCompleteInFormAttributeComponent {
  options = signal<TestOption[]>([
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ]);

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);

  formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup({
      aufgaben: new FormControl<TestOption | null>(null)
    });
  }
}

@Component({
  selector: 'lux-value-attribute-component',
  template: `
    <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options" [(luxValue)]="selected" [luxStrict]="strict()"> </lux-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAutocompleteComponent]
})
class LuxValueAttributeComponent {
  selected = signal<TestOption | string>('');
  strict = signal(true);

  options: TestOption[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);
}

@Component({
  template: `
    <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options" (luxOptionSelected)="setSelected($event)"> </lux-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAutocompleteComponent]
})
class LuxOptionSelectedComponent {
  selected: TestOption | null = null;

  options: TestOption[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);

  setSelected(selected: TestOption | null) {
    this.selected = selected;
  }
}

@Component({
  template: `
    <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options" luxOptionLabelProp="label" [luxLookupDelay]="0"> </lux-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAutocompleteComponent]
})
class MockAutocompleteComponent {
  options: TestOption[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);
}

@Component({
  template: `
    <lux-autocomplete
      luxLabel="Autocomplete"
      [luxOptions]="options"
      [(luxValue)]="twoWaySelected"
      [luxPickValue]="valueFn"
      [luxStrict]="true"
      (luxValueChange)="setSelected($event)"
    >
    </lux-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAutocompleteComponent]
})
class MockPickValueComponent {
  selected?: string;
  twoWaySelected?: string;

  options: TestOption[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);

  setSelected(selected: string) {
    this.selected = selected;
  }

  valueFn(option: TestOption): string {
    return option ? option.value : '';
  }
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options" luxControlBinding="aufgaben"> </lux-autocomplete>
    </form>

    <lux-button luxLabel="Speichern" [luxDisabled]="!formGroup.valid"></lux-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxAutocompleteComponent, LuxButtonComponent]
})
class LuxAutoCompleteNotAnOptionComponent {
  options: TestOption[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);

  formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup<any>({
      aufgaben: new FormControl<TestOption | null>(null)
    });
  }

  onSave() {}
}

@Component({
  selector: 'lux-autocomplete-single-option-component',
  template: `
    <form [formGroup]="formGroup">
      <lux-autocomplete luxLabel="Autocomplete" [luxOptions]="options" luxControlBinding="aufgaben"></lux-autocomplete>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxAutocompleteComponent]
})
class LuxAutoCompleteSingleOptionComponent {
  options: TestOption[] = [{ label: 'Einzige Aufgabe', value: 'ONLY' }];

  readonly autocomplete = viewChild.required(LuxAutocompleteComponent);

  formGroup = new FormGroup({
    aufgaben: new FormControl<TestOption | null>(null)
  });
}

@Component({
  template: `
    <lux-autocomplete
      luxLabel="Autocomplete"
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [luxLookupDelay]="0"
      [luxDisabled]="disabled()"
      [luxReadonly]="readonly()"
      [luxRequired]="required()"
      [luxValue]="value()"
    ></lux-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAutocompleteComponent]
})
class LuxAutocompleteA11yComponent {
  options: TestOption[] = [{ label: 'Meine Aufgaben', value: 'A' }];

  disabled = signal(false);
  readonly = signal(false);
  required = signal(false);
  value = signal<TestOption | undefined>(undefined);
}

/**
 * Das LUX-Autocomplete muss in manchen Situationen den Fokus verlieren,
 * damit die Änderungen übernommen werden können. Die folgende Methode sorgt dafür,
 * dass das LUX-Autocomplete den Fokus verliert.
 * @param fixture Ein ComponentFixture.
 * @param inputElement Ein Input-Element.
 * @param delay Ein Delay.
 */
async function removeFocus(fixture: ComponentFixture<any>, inputElement: ElementRef, delay: number): Promise<void> {
  LuxTestHelper.dispatchFakeEvent(inputElement.nativeElement, 'focusout');
  await LuxTestHelper.wait(fixture, delay);
}
