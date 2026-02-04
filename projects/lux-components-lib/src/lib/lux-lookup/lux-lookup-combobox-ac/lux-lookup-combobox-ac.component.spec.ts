// noinspection DuplicatedCode

import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { ValidatorFnType } from '../../lux-form/lux-form-model/lux-form-component-base.class';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxTestHelper } from '../../lux-util/testing/lux-test-helper';
import { LuxLookupCompareFn, luxLookupCompareKeyFn, luxLookupCompareKurzTextFn } from '../lux-lookup-model/lux-lookup-component';
import { LuxFieldValues, LuxLookupParameters } from '../lux-lookup-model/lux-lookup-parameters';
import { LuxLookupTableEntry } from '../lux-lookup-model/lux-lookup-table-entry';
import { LuxLookupHandlerService } from '../lux-lookup-service/lux-lookup-handler.service';
import { LuxLookupService } from '../lux-lookup-service/lux-lookup.service';
import { LuxLookupComboboxAcComponent } from './lux-lookup-combobox-ac.component';

describe('LuxLookupComboboxAcComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
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
    let combobox: LuxLookupComboboxAcComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxNoFormComponent);
      component = fixture.componentInstance;
      combobox = fixture.debugElement.query(By.directive(LuxLookupComboboxAcComponent)).componentInstance;
      fixture.detectChanges();
    });

    it('isUngueltig sollte korrekt funktionieren', () => {
      const todayAsDate = new Date();

      const yesterdayAsDate = new Date();
      yesterdayAsDate.setDate(todayAsDate.getDate() - 1);

      const tomorrowAsDate = new Date();
      tomorrowAsDate.setDate(todayAsDate.getDate() + 1);

      const yesterday = yesterdayAsDate.toISOString().slice(0, 10).replace(/-/g, '');
      const today = todayAsDate.toISOString().slice(0, 10).replace(/-/g, '');
      const tomorrow = tomorrowAsDate.toISOString().slice(0, 10).replace(/-/g, '');

      const gueltigOhne: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland'
      };
      expect(combobox.isUngueltig(gueltigOhne)).toBeFalse();

      const gueltigMin: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000'
      };
      expect(combobox.isUngueltig(gueltigMin)).toBeFalse();

      const gueltigMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigMax)).toBeFalse();

      const gueltigMinMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000',
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigMinMax)).toBeFalse();

      const gueltigAbGestern: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: yesterday
      };
      expect(combobox.isUngueltig(gueltigAbGestern)).toBeFalse();

      const gueltigAbGesternMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: yesterday,
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigAbGesternMax)).toBeFalse();

      const gueltigAbHeute: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: today
      };
      expect(combobox.isUngueltig(gueltigAbHeute)).toBeFalse();

      const gueltigAbHeuteMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: today,
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigAbHeuteMax)).toBeFalse();

      const gueltigAbMorgen: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: tomorrow
      };
      expect(combobox.isUngueltig(gueltigAbMorgen)).toBeTrue();

      const gueltigAbMorgenMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: tomorrow,
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigAbMorgenMax)).toBeTrue();

      const gueltigBisGestern: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitBis: yesterday
      };
      expect(combobox.isUngueltig(gueltigBisGestern)).toBeTrue();

      const gueltigBisGesternMin: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000',
        gueltigkeitBis: yesterday
      };
      expect(combobox.isUngueltig(gueltigBisGesternMin)).toBeTrue();

      const gueltigBisHeute: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitBis: today
      };
      expect(combobox.isUngueltig(gueltigBisHeute)).toBeFalse();

      const gueltigBisHeuteMin: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000',
        gueltigkeitBis: today
      };
      expect(combobox.isUngueltig(gueltigBisHeuteMin)).toBeFalse();

      const gueltigBisMorgen: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitBis: tomorrow
      };
      expect(combobox.isUngueltig(gueltigBisMorgen)).toBeFalse();

      const gueltigBisMorgenMin: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000',
        gueltigkeitBis: tomorrow
      };
      expect(combobox.isUngueltig(gueltigBisMorgenMin)).toBeFalse();
    });

    it('Validatoren setzen und korrekte Fehlermeldung anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      let errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeNull();
      expect(combobox.formControl.valid).toBeTruthy();

      // Änderungen durchführen
      component.validators = Validators.compose([Validators.required]);
      LuxTestHelper.wait(fixture);
      combobox.formControl.markAsTouched();
      combobox.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeTruthy();
      expect(errorEl.nativeElement.innerText.trim()).toEqual('* Pflichtfeld');
      expect(combobox.formControl.valid).toBeFalsy();

      discardPeriodicTasks();
    }));

    it('Sollte den luxValue beibehalten, wenn luxRequired geändert wird', fakeAsync(() => {
      // Vorbedingungen testen
      component.value = { value: 'test', label: 'test' };
      LuxTestHelper.wait(fixture);

      expect(combobox.luxValue).toEqual(component.value);

      // Änderungen durchführen
      component.required = true;
      LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(combobox.luxValue).not.toBeNull();
      expect(component.value).not.toBeNull();
    }));

    it('Sollte die Optionen ausgeben wie sie geladen wurden', fakeAsync(() => {
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      const options = fixture.nativeElement.querySelectorAll('mat-option');
      expect(options?.length).toEqual(6);
      expect(options[1].querySelector('span')?.innerText).toEqual('Afghanistan');
      expect(options[2].querySelector('span')?.innerText).toEqual('Bellux');
      expect(options[3].querySelector('span')?.innerText).toEqual('Ägypten');
      expect(options[4].querySelector('span')?.innerText).toEqual('Deutschland');
      expect(options[5].querySelector('span')?.innerText).toEqual('Algerien');

      discardPeriodicTasks();
    }));

    it('Sollte die Optionen sortiert nach Kurztext ausgeben', fakeAsync(() => {
      component.compareFn = luxLookupCompareKurzTextFn;
      fixture.detectChanges();
      fixture.debugElement.injector.get(LuxLookupHandlerService).reloadData('test');
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      const options = fixture.nativeElement.querySelectorAll('mat-option');
      expect(options?.length).toEqual(6);
      expect(options[1].querySelector('span')?.innerText).toEqual('Afghanistan');
      expect(options[2].querySelector('span')?.innerText).toEqual('Ägypten');
      expect(options[3].querySelector('span')?.innerText).toEqual('Algerien');
      expect(options[4].querySelector('span')?.innerText).toEqual('Bellux');
      expect(options[5].querySelector('span')?.innerText).toEqual('Deutschland');

      discardPeriodicTasks();
    }));

    it('Sollte die Optionen sortiert nach Schlüssel ausgeben', fakeAsync(() => {
      component.compareFn = luxLookupCompareKeyFn;
      fixture.detectChanges();
      fixture.debugElement.injector.get(LuxLookupHandlerService).reloadData('test');
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      const options = fixture.nativeElement.querySelectorAll('mat-option');
      expect(options?.length).toEqual(6);
      expect(options[1].querySelector('span')?.innerText).toEqual('Afghanistan');
      expect(options[2].querySelector('span')?.innerText).toEqual('Bellux');
      expect(options[3].querySelector('span')?.innerText).toEqual('Ägypten');
      expect(options[4].querySelector('span')?.innerText).toEqual('Deutschland');
      expect(options[5].querySelector('span')?.innerText).toEqual('Algerien');

      discardPeriodicTasks();
    }));
  });

  describe('Nachladen', () => {
    let fixture: ComponentFixture<LuxScrollComponent>;
    let component: LuxScrollComponent;
    let combobox: LuxLookupComboboxAcComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxScrollComponent);
      component = fixture.componentInstance;
      combobox = fixture.debugElement.query(By.directive(LuxLookupComboboxAcComponent)).componentInstance;
      fixture.detectChanges();
    });

    it('Sollte die Optionen nachladen', fakeAsync(() => {
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      const spy = spyOn(combobox, 'updateDisplayedEntries').and.callThrough();

      trigger.click();
      fixture.detectChanges();
      flush();

      const options = fixture.nativeElement.querySelectorAll('mat-option');
      expect(options?.length).toEqual(9); // 8 + Leereintrag
      expect(component.myEntries.length).toBe(mockResultTest.length);
      expect(combobox.entries.length).toEqual(mockResultTest.length);
      expect(combobox.displayedEntries.length).toEqual(8);
      expect(combobox.invisibleEntries.length).toEqual(2);

      const panel = fixture.debugElement.query(By.css('div.mat-mdc-select-panel'));
      expect(panel).toBeDefined();
      panel.nativeElement.scrollTop = 400;
      LuxTestHelper.dispatchFakeEvent(panel.nativeElement, 'scroll');
      LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.myEntries.length).toBe(mockResultTest.length);
      expect(combobox.entries.length).toEqual(mockResultTest.length);
      expect(combobox.displayedEntries.length).toEqual(10);
      expect(combobox.invisibleEntries.length).toEqual(0);

      discardPeriodicTasks();
    }));

    it('Sollte solange Optionen nachladen bis der selektierte Eintrag geladen ist', () => {
      const spy = spyOn(combobox, 'ensureSelectedEntriesLoaded').and.callThrough();

      // Eintrag wählen, der initial nicht geladen ist
      const selectedKey = '1115';
      component.value = {
        key: '1115',
        kurzText: 'Färöer',
        langText1: 'Färöer'
      };

      fixture.detectChanges();

      expect(component.combobox.displayedEntries.some((e) => e.key === selectedKey)).toBeTrue();
      expect(component.combobox.luxValue).toEqual(component.value);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

@Component({
  template: `
    <lux-lookup-combobox-ac
      luxTableNo="5"
      [luxControlValidators]="validators"
      [(luxValue)]="value"
      [luxCompareFn]="compareFn"
      luxLookupId="test"
      luxRenderProp="kurzText"
      [luxParameters]="params"
      [luxLabel]="'Label'"
      [luxRequired]="required"
    ></lux-lookup-combobox-ac>
  `,
  imports: [LuxLookupComboboxAcComponent]
})
class LuxNoFormComponent {
  params = new LuxLookupParameters({
    knr: 101,
    fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
  });
  validators?: ValidatorFnType;
  value?: any;
  required?: boolean;
  compareFn?: LuxLookupCompareFn;
}

@Component({
  template: `
    <lux-lookup-combobox-ac
      luxTableNo="11"
      [(luxValue)]="value"
      [luxEntryBlockSize]="8"
      luxLookupId="test"
      luxRenderProp="kurzText"
      [luxParameters]="params"
      [luxLabel]="'Label'"
      (luxDataLoadedAsArray)="updateEntries($event)"
    ></lux-lookup-combobox-ac>
  `,
  imports: [LuxLookupComboboxAcComponent]
})
class LuxScrollComponent {
  params = new LuxLookupParameters({
    knr: 101,
    fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
  });
  value?: any;

  @ViewChild(LuxLookupComboboxAcComponent) combobox!: LuxLookupComboboxAcComponent;

  myEntries: LuxLookupTableEntry[] = [];

  updateEntries(entries: LuxLookupTableEntry[]) {
    this.myEntries = entries;
  }
}

const mockResultTest = [
  {
    key: '1',
    kurzText: 'Afghanistan',
    langText1:
      'Lorem ipsum dolor \n sit amet consectetur adipisicing elit. Nulla officiis consectetur natus id iusto asperiores cum eum sint esse in?'
  },
  {
    key: '10',
    kurzText: 'Bellux',
    langText1: 'Belgien und Luxemburg',
    gueltigkeitVon: '19900101',
    gueltigkeitBis: '20090101'
  },
  {
    key: '11',
    kurzText: 'Ägypten',
    langText1: 'Ägypten'
  },
  {
    key: '100',
    kurzText: 'Deutschland',
    langText1: 'Deutschland'
  },
  {
    key: '1100',
    kurzText: 'Algerien',
    langText1: 'Algerien'
  },
  {
    key: '1111',
    kurzText: 'Finnland',
    langText1: 'Finnland'
  },
  {
    key: '1112',
    kurzText: 'Liechtenstein',
    langText1: 'Liechtenstein'
  },
  {
    key: '1113',
    kurzText: 'Österreich',
    langText1: 'Österreich'
  },
  {
    key: '1114',
    kurzText: 'Schweiz',
    langText1: 'Schweiz'
  },
  {
    key: '1115',
    kurzText: 'Färöer',
    langText1: 'Färöer'
  }
];

class MockLookupService {
  getLookupTable(tableNo: string, _parameters: LuxLookupParameters, _url: string): Observable<LuxLookupTableEntry[]> {
    return of(mockResultTest.slice(0, +tableNo));
  }
}
