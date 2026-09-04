// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { ValidatorFnType } from '../../lux-form/lux-form-model/lux-form-component-base.class';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxLookupCompareFn, luxLookupCompareKeyFn, luxLookupCompareKurzTextFn } from '../lux-lookup-model/lux-lookup-component';
import { LuxFieldValues, LuxLookupParameters } from '../lux-lookup-model/lux-lookup-parameters';
import { LuxLookupTableEntry } from '../lux-lookup-model/lux-lookup-table-entry';
import { LuxLookupHandlerService } from '../lux-lookup-service/lux-lookup-handler.service';
import { LuxLookupService } from '../lux-lookup-service/lux-lookup.service';
import { LuxLookupAutocompleteComponent } from './lux-lookup-autocomplete.component';

describe('LuxLookupAutocompleteComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideLuxTranslocoTesting(),
        LuxLookupHandlerService,
        LuxConsoleService,
        { provide: LuxLookupService, useClass: MockLookupService }
      ]
    }).compileComponents();
  }));

  describe('Außerhalb einer Form', () => {
    let fixture: ComponentFixture<LuxNoFormComponent>;
    let component: LuxNoFormComponent;
    let autocomplete: LuxLookupAutocompleteComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(LuxNoFormComponent);
      component = fixture.componentInstance;
      autocomplete = fixture.debugElement.query(By.directive(LuxLookupAutocompleteComponent)).componentInstance;
      fixture.detectChanges();
      tick(autocomplete.luxDebounceTime());
    }));

    it('Validatoren setzen und korrekte Fehlermeldung anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      let errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeNull();
      expect(autocomplete.formControl.valid).toBeTruthy();

      // Änderungen durchführen
      component.validators.set(Validators.compose([Validators.required]));
      LuxTestHelper.wait(fixture);
      autocomplete.formControl.markAsTouched();
      autocomplete.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeTruthy();
      expect(errorEl.nativeElement.innerText.trim()).toEqual('* Pflichtfeld');
      expect(autocomplete.formControl.valid).toBeFalsy();

      discardPeriodicTasks();
    }));

    it('Sollte die Optionen ausgeben wie sie geladen wurden', fakeAsync(() => {
      expect(autocomplete.matInput()!.nativeElement.value).toEqual('');

      // Änderungen durchführen
      LuxTestHelper.typeInElement(autocomplete.matInput()!.nativeElement, 'A');
      LuxTestHelper.wait(fixture, autocomplete.luxDebounceTime());

      // Nachbedingungen testen
      const options = fixture.nativeElement.querySelectorAll('mat-option');

      expect(options?.length).toEqual(5);
      expect(options[0].querySelector('span')?.innerText).toEqual('Afghanistan');
      expect(options[1].querySelector('span')?.innerText).toEqual('Armenien');
      expect(options[2].querySelector('span')?.innerText).toEqual('Angola');
      expect(options[3].querySelector('span')?.innerText).toEqual('Andorra');
      expect(options[4].querySelector('span')?.innerText).toEqual('Algerien');

      discardPeriodicTasks();
    }));

    it('Sollte die Optionen sortiert nach Kurztext ausgeben', fakeAsync(() => {
      expect(autocomplete.matInput()!.nativeElement.value).toEqual('');

      // Änderungen durchführen
      component.compareFn.set(luxLookupCompareKurzTextFn);
      fixture.detectChanges();
      fixture.debugElement.injector.get(LuxLookupHandlerService).reloadData('test');
      fixture.detectChanges();
      LuxTestHelper.typeInElement(autocomplete.matInput()!.nativeElement, 'A');
      LuxTestHelper.wait(fixture, autocomplete.luxDebounceTime());

      // Nachbedingungen testen
      const options = fixture.nativeElement.querySelectorAll('mat-option');

      expect(options?.length).toEqual(5);
      expect(options[0].querySelector('span')?.innerText).toEqual('Afghanistan');
      expect(options[1].querySelector('span')?.innerText).toEqual('Algerien');
      expect(options[2].querySelector('span')?.innerText).toEqual('Andorra');
      expect(options[3].querySelector('span')?.innerText).toEqual('Angola');
      expect(options[4].querySelector('span')?.innerText).toEqual('Armenien');

      discardPeriodicTasks();
    }));

    it('Sollte die Optionen sortiert nach Schlüssel ausgeben', fakeAsync(() => {
      expect(autocomplete.matInput()!.nativeElement.value).toEqual('');

      // Änderungen durchführen
      component.compareFn.set(luxLookupCompareKeyFn);
      fixture.detectChanges();
      fixture.debugElement.injector.get(LuxLookupHandlerService).reloadData('test');
      fixture.detectChanges();
      LuxTestHelper.typeInElement(autocomplete.matInput()!.nativeElement, 'A');
      LuxTestHelper.wait(fixture, autocomplete.luxDebounceTime());

      // Nachbedingungen testen
      const options = fixture.nativeElement.querySelectorAll('mat-option');

      expect(options?.length).toEqual(5);
      expect(options[0].querySelector('span')?.innerText).toEqual('Afghanistan');
      expect(options[1].querySelector('span')?.innerText).toEqual('Armenien');
      expect(options[2].querySelector('span')?.innerText).toEqual('Angola');
      expect(options[3].querySelector('span')?.innerText).toEqual('Andorra');
      expect(options[4].querySelector('span')?.innerText).toEqual('Algerien');

      discardPeriodicTasks();
    }));

    describe('Clear-Button', () => {
      beforeEach(fakeAsync(() => {
        component.clearable.set(true);
        fixture.detectChanges();
      }));

      it('Sollte den Wert über den Clear-Button zurücksetzen', fakeAsync(() => {
        LuxTestHelper.typeInElement(autocomplete.matInput()!.nativeElement, 'A');
        LuxTestHelper.wait(fixture, autocomplete.luxDebounceTime());

        expect(autocomplete.formControl.value as any).toEqual('A');
        expect(fixture.debugElement.query(By.css('.lux-input-clear-btn button'))).toBeTruthy();

        fixture.debugElement.query(By.css('.lux-input-clear-btn button')).nativeElement.click();
        LuxTestHelper.wait(fixture);

        expect(autocomplete.formControl.value).toBeNull();
        expect(autocomplete.matInput()!.nativeElement.value).toEqual('');

        discardPeriodicTasks();
      }));
    });
  });
});

@Component({
  selector: 'lux-no-form-component',
  template: `
    <lux-lookup-autocomplete
      luxTableNo="1004"
      [luxParameters]="params()"
      luxRenderProp="kurzText"
      [luxCompareFn]="compareFn()"
      [luxControlValidators]="validators()"
      [luxClearable]="clearable()"
      [luxClearAriaLabel]="clearAriaLabel()"
      [(luxValue)]="value"
      luxLookupId="test"
      [luxLabel]="'Label'"
    ></lux-lookup-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxLookupAutocompleteComponent]
})
class LuxNoFormComponent {
  params = signal(
    new LuxLookupParameters({
      knr: 101,
      fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
    })
  );
  validators = signal<ValidatorFnType | undefined>(undefined);
  value = signal<any>(undefined);
  compareFn = signal<LuxLookupCompareFn | undefined>(undefined);
  clearable = signal(false);
  clearAriaLabel = signal('Wert leeren');
}

class MockLookupService {
  getLookupTable(_tableNo: string, _parameters: LuxLookupParameters, _url: string): Observable<LuxLookupTableEntry[]> {
    return of([
      {
        key: '1',
        kurzText: 'Afghanistan',
        langText1:
          'Lorem ipsum dolor \n sit amet consectetur adipisicing elit. Nulla officiis consectetur natus id iusto asperiores cum eum sint esse in?'
      },
      {
        key: '10',
        kurzText: 'Armenien',
        langText1: 'Armenien'
      },
      {
        key: '11',
        kurzText: 'Angola',
        langText1: 'Angola'
      },
      {
        key: '100',
        kurzText: 'Andorra',
        langText1: 'Andorra'
      },
      {
        key: '1100',
        kurzText: 'Algerien',
        langText1: 'Algerien'
      }
    ]);
  }
}
