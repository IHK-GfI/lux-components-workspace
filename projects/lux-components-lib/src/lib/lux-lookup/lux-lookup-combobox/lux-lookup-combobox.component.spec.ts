// noinspection DuplicatedCode

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { LuxLookupComboboxComponent } from './lux-lookup-combobox.component';

describe('LuxLookupComboboxComponent', () => {
  beforeEach(async () => {
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
  });

  describe('Außerhalb einer Form', () => {
    let fixture: ComponentFixture<LuxNoFormComponent>;
    let component: LuxNoFormComponent;
    let combobox: LuxLookupComboboxComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxNoFormComponent);
      component = fixture.componentInstance;
      combobox = fixture.debugElement.query(By.directive(LuxLookupComboboxComponent)).componentInstance;
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
      expect(combobox.isUngueltig(gueltigOhne)).toBe(false);

      const gueltigMin: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000'
      };
      expect(combobox.isUngueltig(gueltigMin)).toBe(false);

      const gueltigMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigMax)).toBe(false);

      const gueltigMinMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000',
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigMinMax)).toBe(false);

      const gueltigAbGestern: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: yesterday
      };
      expect(combobox.isUngueltig(gueltigAbGestern)).toBe(false);

      const gueltigAbGesternMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: yesterday,
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigAbGesternMax)).toBe(false);

      const gueltigAbHeute: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: today
      };
      expect(combobox.isUngueltig(gueltigAbHeute)).toBe(false);

      const gueltigAbHeuteMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: today,
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigAbHeuteMax)).toBe(false);

      const gueltigAbMorgen: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: tomorrow
      };
      expect(combobox.isUngueltig(gueltigAbMorgen)).toBe(true);

      const gueltigAbMorgenMax: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: tomorrow,
        gueltigkeitBis: '99999999'
      };
      expect(combobox.isUngueltig(gueltigAbMorgenMax)).toBe(true);

      const gueltigBisGestern: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitBis: yesterday
      };
      expect(combobox.isUngueltig(gueltigBisGestern)).toBe(true);

      const gueltigBisGesternMin: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000',
        gueltigkeitBis: yesterday
      };
      expect(combobox.isUngueltig(gueltigBisGesternMin)).toBe(true);

      const gueltigBisHeute: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitBis: today
      };
      expect(combobox.isUngueltig(gueltigBisHeute)).toBe(false);

      const gueltigBisHeuteMin: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000',
        gueltigkeitBis: today
      };
      expect(combobox.isUngueltig(gueltigBisHeuteMin)).toBe(false);

      const gueltigBisMorgen: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitBis: tomorrow
      };
      expect(combobox.isUngueltig(gueltigBisMorgen)).toBe(false);

      const gueltigBisMorgenMin: LuxLookupTableEntry = {
        key: '4',
        kurzText: 'Deutschland',
        langText1: 'Deutschland',
        gueltigkeitVon: '00000000',
        gueltigkeitBis: tomorrow
      };
      expect(combobox.isUngueltig(gueltigBisMorgenMin)).toBe(false);
    });

    it('Validatoren setzen und korrekte Fehlermeldung anzeigen', async () => {
      // Vorbedingungen testen
      let errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeNull();
      expect(combobox.formControl.valid).toBeTruthy();

      // Änderungen durchführen
      component.validators.set(Validators.compose([Validators.required]));
      await LuxTestHelper.wait(fixture);
      combobox.formControl.markAsTouched();
      combobox.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeTruthy();
      expect(errorEl.nativeElement.innerText.trim()).toEqual('* Pflichtfeld');
      expect(combobox.formControl.valid).toBeFalsy();
    });

    it('Sollte den luxValue beibehalten, wenn luxRequired geändert wird', async () => {
      // Vorbedingungen testen
      component.value.set({ value: 'test', label: 'test' });
      await LuxTestHelper.wait(fixture);

      expect(combobox.luxValue()).toEqual(component.value());

      // Änderungen durchführen
      component.required.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(combobox.luxValue()).not.toBeNull();
      expect(component.value()).not.toBeNull();
    });

    it('Sollte die Optionen ausgeben wie sie geladen wurden', async () => {
      await LuxTestHelper.wait(fixture);
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      trigger.click();
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option');
      expect(options?.length).toEqual(6);
      expect(options[1].querySelector('span')?.innerText).toEqual('Afghanistan');
      expect(options[2].querySelector('span')?.innerText).toEqual('Bellux');
      expect(options[3].querySelector('span')?.innerText).toEqual('Ägypten');
      expect(options[4].querySelector('span')?.innerText).toEqual('Deutschland');
      expect(options[5].querySelector('span')?.innerText).toEqual('Algerien');
    });

    it('Sollte die Optionen sortiert nach Kurztext ausgeben', async () => {
      component.compareFn.set(luxLookupCompareKurzTextFn);
      await LuxTestHelper.wait(fixture);
      fixture.debugElement.injector.get(LuxLookupHandlerService).reloadData('test');
      await LuxTestHelper.wait(fixture);
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      trigger.click();
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option');
      expect(options?.length).toEqual(6);
      expect(options[1].querySelector('span')?.innerText).toEqual('Afghanistan');
      expect(options[2].querySelector('span')?.innerText).toEqual('Ägypten');
      expect(options[3].querySelector('span')?.innerText).toEqual('Algerien');
      expect(options[4].querySelector('span')?.innerText).toEqual('Bellux');
      expect(options[5].querySelector('span')?.innerText).toEqual('Deutschland');
    });

    it('Sollte die Optionen sortiert nach Schlüssel ausgeben', async () => {
      component.compareFn.set(luxLookupCompareKeyFn);
      await LuxTestHelper.wait(fixture);
      fixture.debugElement.injector.get(LuxLookupHandlerService).reloadData('test');
      await LuxTestHelper.wait(fixture);
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      trigger.click();
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option');
      expect(options?.length).toEqual(6);
      expect(options[1].querySelector('span')?.innerText).toEqual('Afghanistan');
      expect(options[2].querySelector('span')?.innerText).toEqual('Bellux');
      expect(options[3].querySelector('span')?.innerText).toEqual('Ägypten');
      expect(options[4].querySelector('span')?.innerText).toEqual('Deutschland');
      expect(options[5].querySelector('span')?.innerText).toEqual('Algerien');
    });
  });

  describe('Nachladen', () => {
    let fixture: ComponentFixture<LuxScrollComponent>;
    let component: LuxScrollComponent;
    let combobox: LuxLookupComboboxComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxScrollComponent);
      component = fixture.componentInstance;
      combobox = fixture.debugElement.query(By.directive(LuxLookupComboboxComponent)).componentInstance;
      fixture.detectChanges();
    });

    it('Sollte die Optionen nachladen', async () => {
      await LuxTestHelper.wait(fixture);
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      const spy = vi.spyOn(combobox, 'updateDisplayedEntries');

      trigger.click();
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option');
      expect(options?.length).toEqual(9); // 8 + Leereintrag
      expect(component.myEntries.length).toBe(mockResultTest.length);
      expect(combobox.entries.length).toEqual(mockResultTest.length);
      expect(combobox.displayedEntries.length).toEqual(8);
      expect(combobox.invisibleEntries.length).toEqual(2);

      const panel = fixture.debugElement.query(By.css('div.mat-mdc-select-panel'));
      expect(panel).toBeDefined();
      panel.nativeElement.scrollTop = 400;
      LuxTestHelper.dispatchFakeEvent(panel.nativeElement, 'scroll');
      await LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.myEntries.length).toBe(mockResultTest.length);
      expect(combobox.entries.length).toEqual(mockResultTest.length);
      expect(combobox.displayedEntries.length).toEqual(10);
      expect(combobox.invisibleEntries.length).toEqual(0);
    });

    it('Sollte solange Optionen nachladen bis der selektierte Eintrag geladen ist', () => {
      const spy = vi.spyOn(combobox, 'ensureSelectedEntriesLoaded');

      // Eintrag wählen, der initial nicht geladen ist
      const selectedKey = '1115';
      component.value.set({
        key: '1115',
        kurzText: 'Färöer',
        langText1: 'Färöer'
      });

      fixture.detectChanges();

      expect(component.combobox().displayedEntries.some((e) => e.key === selectedKey)).toBe(true);
      expect(component.combobox().luxValue()).toEqual(component.value());
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('mit aktivierter Filterfunktion', () => {
    it('rendert das Filterfeld nicht als deaktivierte mat-option', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      expect(document.querySelector('.mat-mdc-select-panel mat-option.lux-select-panel-filter-option')).toBeNull();
      expect(document.querySelector('lux-select-panel-filter')).not.toBeNull();
    });

    it('reicht placeholder, filterValue und clearAriaLabel an das Filterfeld durch', async () => {
      const fixture = TestBed.createComponent(LuxFilterInputBindingsComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('input.lux-select-panel-filter-input') as HTMLInputElement;
      expect(filterInput).toBeTruthy();
      expect(filterInput.getAttribute('aria-label')).toBe('Mein Filter');
      expect(filterInput.value).toBe('init');

      const clearBtn = document.querySelector('.lux-select-panel-filter-clear-btn button') as HTMLButtonElement;
      expect(clearBtn).toBeTruthy();
      expect(clearBtn.getAttribute('aria-label')).toBe('Filter leeren');
    });

    it('lädt bei initial aktivem Filter alle Einträge nach', async () => {
      const fixture = TestBed.createComponent(LuxFilterInitialLoadComponent);
      await LuxTestHelper.wait(fixture);

      const combobox = fixture.componentInstance.combobox();
      expect(combobox.displayedEntries.length).toBe(10);
      expect(combobox.invisibleEntries.length).toBe(0);
    });

    it('reduziert die Optionsliste anhand des Suchtexts', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'deu';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].querySelector('span')?.innerText).toBe('Deutschland');
    });

    it('navigiert mit Pfeiltasten fortlaufend über gefilterte Optionen', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'a';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      await LuxTestHelper.wait(fixture);

      const luxLookup = fixture.debugElement.query(By.directive(LuxLookupComboboxComponent))
        .componentInstance as LuxLookupComboboxComponent;
      const activeItem = (luxLookup.matSelect() as any)?._keyManager?.activeItem;
      expect(activeItem?.value?.key).toBe('1100');
    });

    it('stoppt mit Pfeiltasten an der letzten gefilterten Option', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'a';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      for (let i = 0; i < 6; i++) {
        LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      }
      await LuxTestHelper.wait(fixture);

      const luxLookup = fixture.debugElement.query(By.directive(LuxLookupComboboxComponent))
        .componentInstance as LuxLookupComboboxComponent;
      const activeItem = (luxLookup.matSelect() as any)?._keyManager?.activeItem;
      expect(activeItem?.value?.key).toBe('1100');
    });

    it('navigiert mit PageUp und PageDown über sichtbare Optionen', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const luxLookup = fixture.debugElement.query(By.directive(LuxLookupComboboxComponent))
        .componentInstance as LuxLookupComboboxComponent;
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;

      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = '';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      LuxTestHelper.dispatchEvent(filterInput, new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
      await LuxTestHelper.wait(fixture);

      let keyManager = (
        luxLookup.matSelect() as unknown as {
          _keyManager?: {
            activeItem?: {
              value?: LuxLookupTableEntry;
            };
          };
        }
      )._keyManager;
      expect(keyManager?.activeItem?.value?.key).toBe('1100');

      LuxTestHelper.dispatchEvent(filterInput, new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
      await LuxTestHelper.wait(fixture);

      keyManager = (
        luxLookup.matSelect() as unknown as {
          _keyManager?: {
            activeItem?: {
              value?: LuxLookupTableEntry;
            };
          };
        }
      )._keyManager;
      expect(keyManager?.activeItem?.value?.key).toBe('1');
    });

    it('navigiert mit Home und End zur ersten bzw. letzten sichtbaren Option', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const luxLookup = fixture.debugElement.query(By.directive(LuxLookupComboboxComponent))
        .componentInstance as LuxLookupComboboxComponent;
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;

      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = '';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      LuxTestHelper.dispatchEvent(filterInput, new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      await LuxTestHelper.wait(fixture);

      let keyManager = (
        luxLookup.matSelect() as unknown as {
          _keyManager?: {
            activeItem?: {
              value?: LuxLookupTableEntry;
            };
          };
        }
      )._keyManager;
      expect(keyManager?.activeItem?.value?.key).toBe('1100');

      LuxTestHelper.dispatchEvent(filterInput, new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      await LuxTestHelper.wait(fixture);

      keyManager = (
        luxLookup.matSelect() as unknown as {
          _keyManager?: {
            activeItem?: {
              value?: LuxLookupTableEntry;
            };
          };
        }
      )._keyManager;
      expect(keyManager?.activeItem?.value?.key).toBe('1');
    });

    it('schließt im Single-Select bei Enter auf aktiver Option und erlaubt erneute Arrow-Navigation', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const luxLookup = fixture.debugElement.query(By.directive(LuxLookupComboboxComponent))
        .componentInstance as LuxLookupComboboxComponent;
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;

      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'a';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      await LuxTestHelper.wait(fixture);

      const activeBeforeEnter = (luxLookup.matSelect() as any)?._keyManager?.activeItem;
      const activeElement = document.activeElement as HTMLElement;
      LuxTestHelper.dispatchEvent(activeElement, LuxTestHelper.createKeyboardEvent('keydown', 13, activeElement, 'Enter'));
      await LuxTestHelper.wait(fixture);

      expect(activeBeforeEnter?.value?.key).toBe('100');
      expect(luxLookup.matSelect()?.panelOpen).toBe(false);

      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInputAfterReopen = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInputAfterReopen.value = 'a';
      LuxTestHelper.dispatchFakeEvent(filterInputAfterReopen, 'input');
      LuxTestHelper.dispatchEvent(
        filterInputAfterReopen,
        LuxTestHelper.createKeyboardEvent('keydown', 40, filterInputAfterReopen, 'ArrowDown')
      );
      await LuxTestHelper.wait(fixture);

      const activeAfterReopen = (luxLookup.matSelect() as any)?._keyManager?.activeItem;
      expect(activeAfterReopen).toBeTruthy();
    });

    it('aktiviert per Tab aus dem Filter die erste sichtbare Option', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const luxLookup = fixture.debugElement.query(By.directive(LuxLookupComboboxComponent))
        .componentInstance as LuxLookupComboboxComponent;

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;

      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 9, filterInput, 'Tab'));
      await new Promise((resolve) => setTimeout(resolve, 0));
      await LuxTestHelper.wait(fixture);

      const activeItem = (luxLookup.matSelect() as any)?._keyManager?.activeItem;
      expect(activeItem?.value?.key).toBe('1');
    });

    it('funktioniert mit Filterung und Auswahl kombiniert', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      const component = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'alg';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      (visibleOptions[0] as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      expect((component.value() as LuxLookupTableEntry)?.key).toBe('1100');
    });

    it('zeigt wieder alle Optionen bei leerem Suchfeld', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'bell';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      filterInput.value = '';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(5);
    });

    it('leert den Filter per Clear-Button', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'deu';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      const clearButton = document.querySelector('.lux-select-panel-filter-clear-btn button') as HTMLButtonElement;
      clearButton.click();
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(5);
    });

    it('ordnet selektierte Einträge nach oben (stabil)', async () => {
      const fixture = TestBed.createComponent(LuxFilterComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      const deutschlandOption = visibleOptions.find((opt) => opt.querySelector('span')?.innerText === 'Deutschland');
      expect(deutschlandOption).toBeDefined();

      (deutschlandOption as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Single-Select schließt das Panel nach Auswahl – erneut öffnen und Reihenfolge prüfen.
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const optionsAfter = Array.from(document.querySelectorAll('.mat-mdc-select-panel mat-option')) as HTMLElement[];
      const selectedOptions = optionsAfter.filter((opt) => opt.classList.contains('mdc-list-item--selected'));
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].querySelector('span')?.innerText).toBe('Deutschland');
    });

    it('ordnet selektierte Einträge im Multiselect nach oben (stabil, unabhängig von Auswahlreihenfolge)', async () => {
      const fixture = TestBed.createComponent(LuxFilterMultipleComponent);
      const component = fixture.componentInstance;

      // Reihenfolge im Value ist absichtlich nicht die Originalreihenfolge.
      component.value.set([mockResultTest[3], mockResultTest[0]]);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      const texts = visibleOptions.map((opt) => opt.querySelector('span')?.innerText);

      expect(texts[0]).toBe('Afghanistan');
      expect(texts[1]).toBe('Deutschland');
    });

    it('funktioniert in Reactive Forms', async () => {
      const fixture = TestBed.createComponent(LuxFilterReactiveFormComponent);
      const component = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'afg';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      (visibleOptions[0] as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      expect(component.form.get('entry')?.value?.key).toBe('1');
    });

    it('funktioniert im Multiselect', async () => {
      const fixture = TestBed.createComponent(LuxFilterMultipleComponent);
      const component = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'deu';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      (visibleOptions[0] as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      expect(document.activeElement).toBe(filterInput);

      // In Mehrfachauswahl bleibt das Panel nach der Auswahl typischerweise geöffnet.
      // Daher können wir direkt im selben Panel weiter filtern und selektieren.
      filterInput.value = 'alg';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      const options2 = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions2 = Array.from(options2).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      (visibleOptions2[0] as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      expect(document.activeElement).toBe(filterInput);
      const selectedEntries = component.value() as LuxLookupTableEntry[];
      expect(selectedEntries.length).toBe(2);
      expect(selectedEntries[0].key).toBe('100');
      expect(selectedEntries[1].key).toBe('1100');
    });

    it('sortiert im geöffneten Multiselect nicht sofort nach Auswahl', async () => {
      const fixture = TestBed.createComponent(LuxFilterMultipleComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      let options = Array.from(document.querySelectorAll('.mat-mdc-select-panel mat-option')) as HTMLElement[];
      let visibleOptions = options.filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions[0].querySelector('span')?.innerText).toBe('Afghanistan');

      const deutschlandOption = visibleOptions.find((opt) => opt.querySelector('span')?.innerText === 'Deutschland');
      expect(deutschlandOption).toBeTruthy();
      (deutschlandOption as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      options = Array.from(document.querySelectorAll('.mat-mdc-select-panel mat-option')) as HTMLElement[];
      visibleOptions = options.filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions[0].querySelector('span')?.innerText).toBe('Afghanistan');
    });

    it('hält im gefilterten Multiselect die Arrow-Navigation auf sichtbaren Optionen', async () => {
      const fixture = TestBed.createComponent(LuxFilterMultipleComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'deu';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].querySelector('span')?.innerText).toBe('Deutschland');

      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      await LuxTestHelper.wait(fixture);

      const luxLookup = fixture.debugElement.query(By.directive(LuxLookupComboboxComponent))
        .componentInstance as LuxLookupComboboxComponent;
      const activeItem = (luxLookup.matSelect() as any)?._keyManager?.activeItem;
      expect(activeItem?.value?.key).toBe('100');
    });

    it('hält im gefilterten Multiselect nach Arrow den Fokus im Filter-Input', async () => {
      const fixture = TestBed.createComponent(LuxFilterMultipleComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'deu';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      await LuxTestHelper.wait(fixture);

      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      await LuxTestHelper.wait(fixture);

      expect(document.activeElement).toBe(filterInput);
    });

    it('begrenzt die Panelhöhe unabhängig von luxEntryBlockSize', async () => {
      // jsdom hat keine Layout-Engine: getBoundingClientRect() liefert für Optionen und Filterzeile
      // immer 0, wodurch die Panelhöhen-Berechnung nicht sinnvoll geprüft werden könnte. Feste Höhen
      // bilden das reale Browser-Verhalten (Layout mit tatsächlicher Größe) nach.
      const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        if (this.classList.contains('mat-mdc-option')) {
          return { height: 40, width: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => {} } as DOMRect;
        }
        if (this.tagName.toLowerCase() === 'lux-select-panel-filter') {
          return { height: 56, width: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => {} } as DOMRect;
        }
        return originalGetBoundingClientRect.call(this);
      });

      const fixture = TestBed.createComponent(LuxVisibleOptionCountComponent);
      await LuxTestHelper.wait(fixture);

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      await LuxTestHelper.wait(fixture);

      const panel = document.querySelector('.mat-mdc-select-panel') as HTMLElement;
      const filterHost = document.querySelector('lux-select-panel-filter') as HTMLElement;
      const options = Array.from(document.querySelectorAll('.mat-mdc-select-panel mat-option')) as HTMLElement[];
      const optionHeight = options[0].getBoundingClientRect().height;
      const filterHeight = filterHost.getBoundingClientRect().height;
      const maxHeight = parseFloat(panel.style.maxHeight);
      const combobox = fixture.componentInstance.combobox();

      expect(combobox.displayedEntries.length).toBe(5);
      expect(maxHeight).toBeCloseTo(filterHeight + optionHeight * 2, 0);
    });
  });
});

@Component({
  template: `
    <lux-lookup-combobox
      luxTableNo="5"
      [luxControlValidators]="validators()"
      [(luxValue)]="value"
      [luxCompareFn]="compareFn()"
      luxLookupId="test"
      luxRenderProp="kurzText"
      [luxParameters]="params()"
      [luxLabel]="'Label'"
      [luxRequired]="required()"
    ></lux-lookup-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxLookupComboboxComponent]
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
  required = signal(false);
  compareFn = signal<LuxLookupCompareFn | undefined>(undefined);
}

@Component({
  template: `
    <lux-lookup-combobox
      luxTableNo="11"
      [(luxValue)]="value"
      [luxEntryBlockSize]="8"
      luxLookupId="test"
      luxRenderProp="kurzText"
      [luxParameters]="params()"
      [luxLabel]="'Label'"
      (luxDataLoadedAsArray)="updateEntries($event)"
    ></lux-lookup-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxLookupComboboxComponent]
})
class LuxScrollComponent {
  params = signal(
    new LuxLookupParameters({
      knr: 101,
      fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
    })
  );
  value = signal<any>(undefined);

  readonly combobox = viewChild.required(LuxLookupComboboxComponent);

  myEntries: LuxLookupTableEntry[] = [];

  updateEntries(entries: LuxLookupTableEntry[]) {
    this.myEntries = entries;
  }
}

@Component({
  template: `
    <lux-lookup-combobox
      luxTableNo="5"
      [(luxValue)]="value"
      [luxEnableFilter]="true"
      [luxWithEmptyEntry]="false"
      luxLookupId="filtercombo"
      luxRenderProp="kurzText"
      [luxParameters]="params()"
      [luxLabel]="'Label'"
    ></lux-lookup-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxLookupComboboxComponent]
})
class LuxFilterComponent {
  params = signal(
    new LuxLookupParameters({
      knr: 101,
      fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
    })
  );
  value = signal<LuxLookupTableEntry | null | undefined>(undefined);
}

@Component({
  template: `
    <lux-lookup-combobox
      luxTableNo="5"
      [(luxValue)]="value"
      [luxEnableFilter]="true"
      luxFilterPlaceholder="Mein Filter"
      luxFilterValue="init"
      luxFilterClearAriaLabel="Filter leeren"
      [luxWithEmptyEntry]="false"
      luxLookupId="filtercombobindings"
      luxRenderProp="kurzText"
      [luxParameters]="params()"
      [luxLabel]="'Label'"
    ></lux-lookup-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxLookupComboboxComponent]
})
class LuxFilterInputBindingsComponent {
  readonly combobox = viewChild.required(LuxLookupComboboxComponent);
  params = signal(
    new LuxLookupParameters({
      knr: 101,
      fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
    })
  );
  value = signal<LuxLookupTableEntry | null | undefined>(undefined);
}

@Component({
  template: `
    <lux-lookup-combobox
      luxTableNo="10"
      [(luxValue)]="value"
      [luxEnableFilter]="true"
      [luxEntryBlockSize]="5"
      luxFilterValue="init"
      [luxWithEmptyEntry]="false"
      luxLookupId="filtercomboloadall"
      luxRenderProp="kurzText"
      [luxParameters]="params()"
      [luxLabel]="'Label'"
    ></lux-lookup-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxLookupComboboxComponent]
})
class LuxFilterInitialLoadComponent {
  readonly combobox = viewChild.required(LuxLookupComboboxComponent);
  params = signal(
    new LuxLookupParameters({
      knr: 101,
      fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
    })
  );
  value = signal<LuxLookupTableEntry | null | undefined>(undefined);
}

@Component({
  template: `
    <form [formGroup]="form">
      <lux-lookup-combobox
        luxTableNo="5"
        [luxEnableFilter]="true"
        [luxWithEmptyEntry]="false"
        luxLookupId="filtercomboform"
        luxRenderProp="kurzText"
        [luxParameters]="params()"
        luxControlBinding="entry"
      ></lux-lookup-combobox>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxLookupComboboxComponent]
})
class LuxFilterReactiveFormComponent {
  params = signal(
    new LuxLookupParameters({
      knr: 101,
      fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
    })
  );

  form = new FormGroup({
    entry: new FormControl<LuxLookupTableEntry | null>(null)
  });
}

@Component({
  template: `
    <lux-lookup-combobox
      luxTableNo="5"
      [(luxValue)]="value"
      [luxEnableFilter]="true"
      [luxMultiple]="true"
      luxLookupId="filtercombomulti"
      luxRenderProp="kurzText"
      [luxParameters]="params()"
      [luxLabel]="'Label'"
    ></lux-lookup-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxLookupComboboxComponent]
})
class LuxFilterMultipleComponent {
  params = signal(
    new LuxLookupParameters({
      knr: 101,
      fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
    })
  );
  value = signal<LuxLookupTableEntry[]>([]);
}

@Component({
  template: `
    <lux-lookup-combobox
      luxTableNo="11"
      [(luxValue)]="value"
      [luxEnableFilter]="true"
      [luxEntryBlockSize]="5"
      [luxVisibleOptionCount]="2"
      [luxWithEmptyEntry]="false"
      luxLookupId="visiblecountcombo"
      luxRenderProp="kurzText"
      [luxParameters]="params()"
      [luxLabel]="'Label'"
    ></lux-lookup-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxLookupComboboxComponent]
})
class LuxVisibleOptionCountComponent {
  readonly combobox = viewChild.required(LuxLookupComboboxComponent);

  params = signal(
    new LuxLookupParameters({
      knr: 101,
      fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
    })
  );

  value = signal<LuxLookupTableEntry | null | undefined>(undefined);
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
