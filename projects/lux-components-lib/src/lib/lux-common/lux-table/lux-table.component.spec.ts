import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
// noinspection DuplicatedCode
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MockMediaObserverService } from '../../lux-util/testing/mock-media-observer.service';
import { ICustomCSSConfig } from './lux-table-custom-css-config.interface';

import { NgStyle } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { Observable, of, throwError, timer } from 'rxjs';
import { delay, ignoreElements, switchMap, tap } from 'rxjs/operators';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { ILuxTableHttpDao } from './lux-table-http/lux-table-http-dao.interface';
import { LuxTableColumnContentComponent } from './lux-table-subcomponents/lux-table-column-content.component';
import { LuxTableColumnFooterComponent } from './lux-table-subcomponents/lux-table-column-footer.component';
import { LuxTableColumnHeaderComponent } from './lux-table-subcomponents/lux-table-column-header.component';
import { LuxTableColumnComponent } from './lux-table-subcomponents/lux-table-column.component';
import { LuxTableComponent } from './lux-table.component';

declare interface TableItem {
  c1: number;
  c2: any;
}

/**
 * Führt die Change Detection aus und arbeitet nur sofort fällige Timer und Microtasks ab.
 * Anders als LuxTestHelper.wait(fixture) ohne Dauer (vi.runAllTimersAsync) werden laufende
 * Requests (z. B. delay) und der Filter-Debounce dabei nicht vorgespult, sodass sich der
 * Ladezustand währenddessen prüfen lässt.
 */
async function detectChangesAndFlush(fixture: ComponentFixture<unknown>): Promise<void> {
  fixture.detectChanges();
  await vi.advanceTimersByTimeAsync(0);
  fixture.detectChanges();
}

describe('LuxTableComponent', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        { provide: LuxMediaQueryObserverService, useClass: MockMediaObserverService },
        { provide: LuxConsoleService, useClass: MockConsoleService }
      ]
    }).compileComponents();
  });

  afterEach(async () => {
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    vi.useRealTimers();
  });

  describe('Übliche Anwendungsfälle (ohne HTTP-DAO)', () => {
    let component: TableComponent;
    let fixture: ComponentFixture<TableComponent>;
    let luxTableComponent: LuxTableComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TableComponent);
      component = fixture.componentInstance;
      luxTableComponent = fixture.debugElement.query(By.directive(LuxTableComponent)).componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('Sollte die Progressbar standardmäßig während des Filterns anzeigen', async () => {
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      component.showFilter.set(true);
      await detectChangesAndFlush(fixture);

      expect(luxTableComponent.luxShowProgress()).toBe(true);
      expect(fixture.nativeElement.querySelector('.lux-table-progress-container')).not.toBeNull();
      expect(luxTableComponent.isLoading()).toBe(false);

      luxTableComponent.filtered$.next('Hel');
      fixture.detectChanges();

      expect(luxTableComponent.isLoading()).toBe(true);
      expect(luxTableComponent.isLoadingResults).toBe(true);
      expect(fixture.nativeElement.querySelector('lux-progress')).not.toBeNull();

      await LuxTestHelper.wait(fixture, 500);

      expect(luxTableComponent.isLoading()).toBe(false);
      expect(fixture.nativeElement.querySelector('lux-progress')).toBeNull();

      await vi.runAllTimersAsync();
    });

    it('Sollte den Ladezustand beenden, wenn der Filter während des Debounce deaktiviert wird', async () => {
      component.showFilter.set(true);
      await detectChangesAndFlush(fixture);

      luxTableComponent.filtered$.next('Hel');
      fixture.detectChanges();
      expect(luxTableComponent.isLoading()).toBe(true);

      component.showFilter.set(false);
      await detectChangesAndFlush(fixture);
      expect(luxTableComponent.isLoading()).toBe(false);

      // Der abgebrochene Debounce darf den Ladezustand auch später nicht mehr ändern
      await LuxTestHelper.wait(fixture, 500);
      expect(luxTableComponent.isLoading()).toBe(false);
    });

    it('Sollte den Ladezustand beenden, wenn derselbe Filter erneut eingegeben wird', async () => {
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      component.showFilter.set(true);
      await detectChangesAndFlush(fixture);

      luxTableComponent.filtered$.next('He');
      await LuxTestHelper.wait(fixture, 500);
      expect(luxTableComponent.isLoading()).toBe(false);

      // "Hel" und zurück zu "He": Der Debounce liefert denselben Filter wie zuvor
      luxTableComponent.filtered$.next('Hel');
      await vi.advanceTimersByTimeAsync(100);
      luxTableComponent.filtered$.next('He');
      fixture.detectChanges();
      expect(luxTableComponent.isLoading()).toBe(true);

      await LuxTestHelper.wait(fixture, 500);
      expect(luxTableComponent.isLoading()).toBe(false);
      expect(luxTableComponent.dataSource.filter).toEqual('he');
    });

    it('Sollte Spalten per luxShowColumnSelector und hiddenColumns ausblenden', async () => {
      // Vorbedingungen: Zwei Spalten sichtbar
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      let cells = document.querySelectorAll('th:not(.mat-column-noData');
      expect(cells.length).toBe(2);

      // luxShowColumnSelector aktivieren und Spalte c2 ausblenden
      component.showColumnSelector.set(true);
      luxTableComponent.hiddenColumns = ['c2'];
      await LuxTestHelper.wait(fixture);

      cells = document.querySelectorAll('th:not(.mat-column-noData');
      expect(cells.length).toBe(1);
    });

    it('Sollte ausgeblendete Spalten wieder einblenden', async () => {
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);

      // Spalte c2 ausblenden
      luxTableComponent.hiddenColumns = ['c2'];
      component.showColumnSelector.set(true);
      await LuxTestHelper.wait(fixture);
      let cells = document.querySelectorAll('th:not(.mat-column-noData)');
      expect(cells.length).toBe(1);

      // Spalte c2 wieder einblenden
      luxTableComponent.hiddenColumns = [];
      // Unter OnPush löst das direkte Mutieren von hiddenColumns (ohne echtes Event der lux-select-ac)
      // keine erneute Prüfung der View aus. onHiddenColumnsChange() ist der reguläre Weg (siehe
      // (luxSelectedChange)-Handler im Template) und stößt intern die Neuberechnung + markForCheck() an.
      luxTableComponent.onHiddenColumnsChange([]);
      await LuxTestHelper.wait(fixture);
      await LuxTestHelper.wait(fixture);
      cells = document.querySelectorAll('th:not(.mat-column-noData)');
      expect(cells.length).toBe(2);
    });

    it('Sollte luxHiddenColumnsChange Event auslösen', async () => {
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      const eventSpy = vi.fn().mockName('eventSpy');
      luxTableComponent.luxHiddenColumnsChange.subscribe(eventSpy);

      // Spalte c2 ausblenden
      component.showColumnSelector.set(true);
      await LuxTestHelper.wait(fixture);
      luxTableComponent.onHiddenColumnsChange(['c2']);
      await LuxTestHelper.wait(fixture);
      expect(eventSpy).toHaveBeenCalledWith(['c2']);

      // Spalte c2 wieder einblenden
      luxTableComponent.onHiddenColumnsChange([]);
      await LuxTestHelper.wait(fixture);
      expect(eventSpy).toHaveBeenCalledWith([]);
    });

    it('Sollte erstellt werden', () => {
      expect(component).toBeTruthy();
    });

    it('Die Zeilen darstellen (inklusive Header und Footer)', async () => {
      // Vorbedingungen testen
      let contentRows = document.querySelectorAll('.mat-mdc-row'); // fixture...selectAll not working....
      let headerRow = document.querySelector('.mat-mdc-header-row');
      let footerRow = document.querySelector('.mat-mdc-footer-row');
      expect(contentRows.length).toEqual(0);
      expect(luxTableComponent.dataSource.data.length).toEqual(0);
      expect(headerRow).toBeDefined();
      expect(footerRow).toBeDefined();

      // Änderungen durchführen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      contentRows = document.querySelectorAll('.mat-mdc-row');
      headerRow = document.querySelector('.mat-mdc-header-row');
      footerRow = document.querySelector('.mat-mdc-footer-row');

      expect(contentRows.length).toEqual(2);
      expect(luxTableComponent.dataSource.data.length).toEqual(2);
      expect(headerRow).toBeDefined();
      expect(footerRow).toBeDefined();

      await LuxTestHelper.wait(fixture);
    });

    it('Die Einträge filtern', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' },
        { c1: 3, c2: 'Oxygen' },
        { c1: 4, c2: new Date() }
      ]);
      component.showFilter.set(true);

      await LuxTestHelper.wait(fixture);
      let contentRows = document.querySelectorAll('.mat-mdc-row');
      expect(contentRows.length).toEqual(4);
      expect(luxTableComponent.dataSource.data.length).toEqual(4);

      // Änderungen durchführen
      luxTableComponent.filtered$.next('he');
      await LuxTestHelper.wait(fixture, 550);

      // Nachbedingungen testen
      contentRows = document.querySelectorAll('.mat-mdc-row');
      expect(contentRows.length).toEqual(1);
      expect(luxTableComponent.dataSource.data.length).toEqual(4);

      // Änderungen durchführen
      luxTableComponent.filtered$.next('s');
      await LuxTestHelper.wait(fixture, 550);

      // Nachbedingungen testen
      contentRows = document.querySelectorAll('.mat-mdc-row');
      expect(contentRows.length).toEqual(0);
      expect(luxTableComponent.dataSource.data.length).toEqual(4);
    });

    it('Die Paginierung korrekt durchführen', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' },
        { c1: 3, c2: 'Oxygen' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' },
        { c1: 4, c2: 'Paganium' }
      ]);
      component.showPagination.set(true);
      component.pageSize.set(5);

      await LuxTestHelper.wait(fixture);
      let contentRows = document.querySelectorAll('.mat-mdc-row');
      expect(contentRows.length).toEqual(5);
      expect(luxTableComponent.dataSource.data.length).toEqual(17);
      expect(luxTableComponent.paginator).toBeDefined();
      expect(luxTableComponent.paginator!.hasPreviousPage()).toBeFalsy();

      // Änderungen durchführen
      luxTableComponent.paginator!.nextPage();
      await LuxTestHelper.wait(fixture);
      luxTableComponent.paginator!.nextPage();
      await LuxTestHelper.wait(fixture);
      luxTableComponent.paginator!.nextPage();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      contentRows = document.querySelectorAll('.mat-mdc-row');
      expect(contentRows.length).toEqual(2);
      expect(luxTableComponent.dataSource.data.length).toEqual(17);
      expect(luxTableComponent.paginator!.hasNextPage()).toBeFalsy();

      await LuxTestHelper.wait(fixture);
    });

    it('Die Pagination nachträglich aktivieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' },
        { c1: 3, c2: 'Oxygen' },
        { c1: 4, c2: 'Paganium' }
      ]);
      component.pageSize.set(2);

      await LuxTestHelper.wait(fixture);
      let contentRows = document.querySelectorAll('.mat-mdc-row');
      expect(contentRows.length).toEqual(4);
      expect(luxTableComponent.dataSource.data.length).toEqual(4);
      expect(luxTableComponent.paginator).toBeDefined();

      // Änderungen durchführen
      component.showPagination.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      contentRows = document.querySelectorAll('.mat-mdc-row');
      expect(contentRows.length).toEqual(2);
      expect(luxTableComponent.dataSource.data.length).toEqual(4);
    });

    it('Die Einträge sortieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Teta' },
        { c1: 2, c2: 'Beta' },
        { c1: 3, c2: 'Gamma' },
        { c1: 4, c2: 'Alpha' }
      ]);
      component.c1Sortable.set(false);
      component.c2Sortable.set(true);
      await LuxTestHelper.wait(fixture);

      let col2FirstElements = document.getElementsByClassName('c2-content');
      const sortHeaders = document.querySelectorAll('th.mat-sort-header:not(.lux-table-header-blocked)');
      const sortHeadersBlocked = document.querySelectorAll('.lux-table-header-blocked');

      expect(col2FirstElements.length).toBe(4);
      expect(col2FirstElements.item(3)!.textContent).toEqual('Alpha');
      expect(col2FirstElements.item(2)!.textContent).toEqual('Gamma');
      expect(col2FirstElements.item(1)!.textContent).toEqual('Beta');
      expect(col2FirstElements.item(0)!.textContent).toEqual('Teta');

      expect(sortHeaders.length).toBe(1);
      expect(sortHeadersBlocked.length).toBe(1);

      // Änderungen durchführen
      (sortHeaders.item(0) as HTMLButtonElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      col2FirstElements = document.getElementsByClassName('c2-content');

      expect(col2FirstElements.item(3)!.textContent).toEqual('Teta');
      expect(col2FirstElements.item(2)!.textContent).toEqual('Gamma');
      expect(col2FirstElements.item(1)!.textContent).toEqual('Beta');
      expect(col2FirstElements.item(0)!.textContent).toEqual('Alpha');

      // Änderungen durchführen
      (sortHeaders.item(0) as HTMLButtonElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      col2FirstElements = document.getElementsByClassName('c2-content');

      expect(col2FirstElements.item(3)!.textContent).toEqual('Alpha');
      expect(col2FirstElements.item(2)!.textContent).toEqual('Beta');
      expect(col2FirstElements.item(1)!.textContent).toEqual('Gamma');
      expect(col2FirstElements.item(0)!.textContent).toEqual('Teta');
      await LuxTestHelper.wait(fixture);
    });

    it('Die Einträge mit Sonderzeichen sortieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: '1234' },
        { c1: 2, c2: '$ Asdf' },
        { c1: 3, c2: 'Hallo' },
        { c1: 4, c2: '<<' },
        { c1: 5, c2: '  ' }
      ]);
      component.c2Sortable.set(true);
      await LuxTestHelper.wait(fixture);

      let col2Elements = document.getElementsByClassName('c2-content');
      const sortHeaders = document.querySelectorAll('th.mat-sort-header:not(.lux-table-header-blocked)');

      expect(col2Elements.length).toBe(5);
      expect(col2Elements.item(4)!.textContent).toEqual('  ');
      expect(col2Elements.item(3)!.textContent).toEqual('<<');
      expect(col2Elements.item(2)!.textContent).toEqual('Hallo');
      expect(col2Elements.item(1)!.textContent).toEqual('$ Asdf');
      expect(col2Elements.item(0)!.textContent).toEqual('1234');
      expect(sortHeaders.length).toBe(1);

      // Änderungen durchführen
      (sortHeaders.item(0) as HTMLButtonElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      col2Elements = document.getElementsByClassName('c2-content');

      expect(col2Elements.item(4)!.textContent).toEqual('Hallo');
      expect(col2Elements.item(3)!.textContent).toEqual('1234');
      expect(col2Elements.item(2)!.textContent).toEqual('$ Asdf');
      expect(col2Elements.item(1)!.textContent).toEqual('<<');
      expect(col2Elements.item(0)!.textContent).toEqual('  ');

      // Änderungen durchführen
      (sortHeaders.item(0) as HTMLButtonElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      col2Elements = document.getElementsByClassName('c2-content');

      expect(col2Elements.item(4)!.textContent).toEqual('  ');
      expect(col2Elements.item(3)!.textContent).toEqual('<<');
      expect(col2Elements.item(2)!.textContent).toEqual('$ Asdf');
      expect(col2Elements.item(1)!.textContent).toEqual('1234');
      expect(col2Elements.item(0)!.textContent).toEqual('Hallo');
      await LuxTestHelper.wait(fixture);
    });

    it('Die Breite korrekt setzen', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Teta' },
        { c1: 2, c2: 'Beta' },
        { c1: 3, c2: 'Gamma' },
        { c1: 4, c2: 'Alpha' }
      ]);
      await LuxTestHelper.wait(fixture);
      let tableHeaders = document.querySelectorAll('.mat-mdc-header-row:not(.lux-table-header-no-data) th');
      expect(tableHeaders.length).toBe(2);

      // Änderungen durchführen
      component.colWidths.set(['5', '25'] as any);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      tableHeaders = document.querySelectorAll('.mat-mdc-header-row:not(.lux-table-header-no-data) th');
      expect(tableHeaders.length).toBe(2);
      expect((tableHeaders.item(0) as HTMLElement).style.width).toEqual('5%');
      expect((tableHeaders.item(1) as HTMLElement).style.width).toEqual('25%');

      // Datenzellen müssen ebenfalls die korrekten Spaltenbreiten erhalten (Issue #232)
      const dataRows = document.querySelectorAll('.mat-mdc-row');
      expect(dataRows.length).toBe(4);
      dataRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells.length).toBe(2);
        expect((cells.item(0) as HTMLElement).style.width).toEqual('5%');
        expect((cells.item(1) as HTMLElement).style.width).toEqual('25%');
      });
    });

    it('Einzelne Spalten links und rechts fixieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      let stickyElements = document.querySelectorAll('.mat-mdc-row .mat-mdc-table-sticky');
      expect(stickyElements.length).toBe(0);

      // Änderungen durchführen
      component.c1Sticky.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      stickyElements = document.querySelectorAll('.mat-mdc-row .mat-mdc-table-sticky');
      expect(stickyElements.length).toBe(2);

      // Änderungen durchführen
      component.c2Sticky.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      stickyElements = document.querySelectorAll('.mat-mdc-row .mat-mdc-table-sticky');
      expect(stickyElements.length).toBe(4);
    });

    it('Sollte die Custom CSS-Classes einstellen', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      let rows = document.getElementsByClassName('mat-mdc-row');
      expect(rows.item(0)!.classList.toString().indexOf('my-custom-class')).toBe(-1);
      expect(rows.item(1)!.classList.toString().indexOf('my-custom-class')).toBe(-1);

      // Änderungen durchführen
      component.cssClasses.set({
        class: 'my-custom-class',
        check: (element: TableItem) => element.c1 === 1 || element.c1 === 2
      });
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      rows = document.getElementsByClassName('mat-mdc-row');
      expect(rows.item(0)!.classList.toString().indexOf('my-custom-class')).toBeGreaterThan(-1);
      expect(rows.item(1)!.classList.toString().indexOf('my-custom-class')).toBeGreaterThan(-1);

      // Änderungen durchführen
      component.cssClasses.set([
        {
          class: 'my-custom-class',
          check: (element: TableItem) => element.c1 === 1 || element.c1 === 2
        },
        {
          class: 'my-custom-class-2',
          check: (element: TableItem) => element.c2 === 'Hydrogen' || element.c2 === 'Helium'
        }
      ]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      rows = document.getElementsByClassName('mat-mdc-row');
      expect(rows.item(0)!.classList.toString().indexOf('my-custom-class-2')).toBeGreaterThan(-1);
      expect(rows.item(1)!.classList.toString().indexOf('my-custom-class-2')).toBeGreaterThan(-1);
    });

    it('Einzelne Columns sollten in speziellen MediaQueries ausgeblendet werden', inject(
      [LuxMediaQueryObserverService],
      async (mediaObserver: MockMediaObserverService) => {
        // Vorbedingungen testen
        component.dataSource.set([
          { c1: 1, c2: 'Hydrogen' },
          { c1: 2, c2: 'Helium' }
        ]);
        component.c1RespAt.set(['xs', 'sm']);
        component.c1RespBeh.set('hide');
        await LuxTestHelper.wait(fixture);
        let cells = document.getElementsByClassName('mat-mdc-cell');
        expect(cells.length).toBe(4);

        // Änderungen durchführen
        mediaObserver.mediaQueryChanged.next('sm');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        cells = document.getElementsByClassName('mat-mdc-cell');
        expect(cells.length).toBe(2);

        // Änderungen durchführen
        mediaObserver.mediaQueryChanged.next('xs');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        cells = document.getElementsByClassName('mat-mdc-cell');
        expect(cells.length).toBe(2);

        // Änderungen durchführen
        mediaObserver.mediaQueryChanged.next('gt');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        cells = document.getElementsByClassName('mat-mdc-cell');
        expect(cells.length).toBe(4);
      }
    ));

    it('Einzelne Columns sollten in speziellen MediaQueries verschoben werden', inject(
      [LuxMediaQueryObserverService],
      async (mediaObserver: MockMediaObserverService) => {
        // Vorbedingungen testen
        component.dataSource.set([
          { c1: 1, c2: 'Hydrogen' },
          { c1: 2, c2: 'Helium' }
        ]);
        component.c1RespAt.set(['xs', 'sm']);
        component.c1RespBeh.set('c2');
        await LuxTestHelper.wait(fixture);
        let cells = document.getElementsByClassName('mat-mdc-cell');
        let movedCells = document.getElementsByClassName('lux-moved-header-title');
        expect(cells.length).toBe(4);
        expect(movedCells.length).toBe(0);

        // Änderungen durchführen
        mediaObserver.mediaQueryChanged.next('sm');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        cells = document.getElementsByClassName('mat-mdc-cell');
        movedCells = document.getElementsByClassName('lux-moved-header-title');
        expect(cells.length).toBe(2);
        expect(movedCells.length).toBe(2);

        // Änderungen durchführen
        mediaObserver.mediaQueryChanged.next('xs');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        cells = document.getElementsByClassName('mat-mdc-cell');
        movedCells = document.getElementsByClassName('lux-moved-header-title');
        expect(cells.length).toBe(2);
        expect(movedCells.length).toBe(2);

        // Änderungen durchführen
        mediaObserver.mediaQueryChanged.next('gt');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        cells = document.getElementsByClassName('mat-mdc-cell');
        movedCells = document.getElementsByClassName('lux-moved-header-title');
        expect(cells.length).toBe(4);
        expect(movedCells.length).toBe(0);

        await LuxTestHelper.wait(fixture);
      }
    ));

    it('Einzelne Columns sollten in speziellen MediaQueries verschoben werden (ohne Header)', inject(
      [LuxMediaQueryObserverService],
      async (mediaObserver: MockMediaObserverService) => {
        // Vorbedingungen testen
        component.dataSource.set([
          { c1: 1, c2: 'Hydrogen' },
          { c1: 2, c2: 'Helium' }
        ]);
        component.c1RespAt.set(['xs', 'sm']);
        component.c1RespBeh.set('c2');
        component.hideHeaders.set(true);
        await LuxTestHelper.wait(fixture);
        let cells = document.getElementsByClassName('mat-mdc-cell');
        let movedCells = document.getElementsByClassName('lux-moved-header-title');
        expect(cells.length).toBe(4);
        expect(movedCells.length).toBe(0);

        // Änderungen durchführen
        mediaObserver.mediaQueryChanged.next('sm');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        cells = document.getElementsByClassName('mat-mdc-cell');
        movedCells = document.getElementsByClassName('lux-moved-header-title');
        expect(cells.length).toBe(2);
        expect(movedCells.length).toBe(2);

        // Änderungen durchführen
        mediaObserver.mediaQueryChanged.next('xs');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        cells = document.getElementsByClassName('mat-mdc-cell');
        movedCells = document.getElementsByClassName('lux-moved-header-title');
        expect(cells.length).toBe(2);
        expect(movedCells.length).toBe(2);

        // Änderungen durchführen
        mediaObserver.mediaQueryChanged.next('gt');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        cells = document.getElementsByClassName('mat-mdc-cell');
        movedCells = document.getElementsByClassName('lux-moved-header-title');
        expect(cells.length).toBe(4);
        expect(movedCells.length).toBe(0);

        await LuxTestHelper.wait(fixture);
      }
    ));

    it('Sollte eine Fehlermeldung loggen, wenn nur luxResponsiveAt oder luxResponsiveBehaviour gesetzt wurden', inject(
      [LuxConsoleService],
      async (consoleService: MockConsoleService) => {
        const respAtSpy = vi.spyOn(consoleService, 'error').mockReturnValue(undefined);
        // Vorbedingungen testen
        await LuxTestHelper.wait(fixture);
        expect(respAtSpy).toHaveBeenCalledTimes(0);

        // Änderungen durchführen
        component.c1RespBeh.set('hide');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(respAtSpy).toHaveBeenCalledTimes(1);

        // Änderungen durchführen
        component.c2RespAt.set('sm');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        // Da lux-table-column nun Signal-Inputs verwendet und change$ über einen effect() statt
        // ngOnChanges auslöst, wird updateColumnsByMediaQuery() bei einer zweiten Column-Änderung
        // (im Gegensatz zur vorherigen 1:1-Kopplung an ngOnChanges) noch einmal zusätzlich für die
        // bereits fehlkonfigurierte erste Spalte durchlaufen. Das Endergebnis (welche Spalten als
        // fehlkonfiguriert erkannt werden) bleibt unverändert, nur die Anzahl der (idempotenten)
        // Neuberechnungen steigt.
        expect(respAtSpy).toHaveBeenCalledTimes(5);
      }
    ));

    it('Den Text für leere Daten änderung', async () => {
      // Vorbedingungen testen
      await LuxTestHelper.wait(fixture);
      let noDataText = (document.getElementsByClassName('lux-no-data-text').item(0) as HTMLElement).innerText;
      expect(noDataText).toEqual('Keine Daten gefunden.');

      // Änderungen durchführen
      component.noDataText.set('Tetriandoch');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      noDataText = (document.getElementsByClassName('lux-no-data-text').item(0) as HTMLElement).innerText;
      expect(noDataText).toEqual('Tetriandoch');
    });

    it('Sollte automatisch die Pagination bei > 100 Einträgen aktivieren', async () => {
      // Vorbedingungen testen
      await LuxTestHelper.wait(fixture);
      let hiddenPaginator = document.querySelector('lux-paginator.lux-hide');
      expect(hiddenPaginator).toBeDefined();

      // Änderungen durchführen
      const data = [];
      for (let i = 0; i <= 101; i++) {
        data.push({ c1: i, c2: 'Demo ' + i });
      }
      component.dataSource.set(data);
      component.autoPaginate.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      hiddenPaginator = document.querySelector('lux-paginator.lux-hide');
      expect(hiddenPaginator).toBeFalsy();

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte nicht automatisch die Pagination bei > 100 Einträgen aktivieren', async () => {
      // Vorbedingungen testen
      await LuxTestHelper.wait(fixture);
      let hiddenPaginator = document.querySelector('lux-paginator.lux-hide');
      expect(hiddenPaginator).toBeDefined();

      // Änderungen durchführen
      const data = [];
      for (let i = 0; i <= 101; i++) {
        data.push({ c1: i, c2: 'Demo ' + i });
      }
      component.dataSource.set(data);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      hiddenPaginator = document.querySelector('lux-paginator.lux-hide');
      expect(hiddenPaginator).toBeDefined();

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte die Borders ausblenden', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      let noBorderTable = document.getElementsByClassName('lux-hide-borders');
      expect(noBorderTable.length).toBe(0);

      // Änderungen durchführen
      component.hideBorders.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      noBorderTable = document.getElementsByClassName('lux-hide-borders');
      expect(noBorderTable.length).toBe(1);

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte den luxNoDataText nicht anzeigen, wenn Daten über ein Signal gesetzt werden (Issue #217)', async () => {
      // Separates Fixture für Signal-basierte Komponente
      const signalFixture = TestBed.createComponent(TableSignalComponent);
      const signalComponent = signalFixture.componentInstance;

      // Vorbedingungen testen: Keine Daten → noDataText sichtbar
      await LuxTestHelper.wait(signalFixture);
      await LuxTestHelper.wait(fixture);
      await LuxTestHelper.wait(signalFixture);
      let noDataRow = document.querySelector('.lux-table-header-no-data');
      expect(noDataRow?.classList.contains('lux-display-none')).toBe(false);

      // Änderungen durchführen: Signal mit Daten befüllen;
      // nur einen CD-Zyklus ausführen (wie bei Signal-basiertem Angular ohne Zone.js)
      signalComponent.tableData.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(signalFixture);
      // setTimeout in luxData-Setter feuert: setzt totalElements und ruft markForCheck() auf.
      // Der nachfolgende detectChanges() verarbeitet die markForCheck()-Anforderung und
      // aktualisiert die View korrekt – noDataText muss jetzt ausgeblendet sein.
      await LuxTestHelper.wait(fixture);
      await LuxTestHelper.wait(signalFixture);

      // Nachbedingungen testen: noDataText darf NICHT sichtbar sein, da Daten vorhanden sind
      noDataRow = document.querySelector('.lux-table-header-no-data');
      expect(noDataRow?.classList.contains('lux-display-none')).toBe(true);

      await LuxTestHelper.wait(fixture);
    });
  });

  describe('Striping bei Highlight-Zeilen (Issue #269)', () => {
    let component: TableComponent;
    let fixture: ComponentFixture<TableComponent>;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TableComponent);
      component = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    const getTableContent = () => fixture.debugElement.query(By.css('.lux-table-content')).nativeElement as HTMLElement;

    it('Sollte das Striping deaktivieren, wenn einer Zeile eine Highlight-Klasse zugewiesen ist', async () => {
      // Vorbedingung: Tabelle ohne Highlight-Klassen -> kein lux-table-no-striping
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      expect(getTableContent().classList.contains('lux-table-no-striping')).toBe(false);

      // Highlight-Klasse trifft auf eine Zeile zu -> Striping deaktiviert
      component.cssClasses.set([{ class: 'lux-text-highlight-error', check: (element: any) => element.c1 === 1 }]);
      await LuxTestHelper.wait(fixture);
      expect(getTableContent().classList.contains('lux-table-no-striping')).toBe(true);
    });

    it('Sollte das Striping reaktivieren, wenn keine Highlight-Klasse mehr zugewiesen ist', async () => {
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      component.cssClasses.set([{ class: 'lux-text-highlight-alert', check: () => true }]);
      await LuxTestHelper.wait(fixture);
      expect(getTableContent().classList.contains('lux-table-no-striping')).toBe(true);

      // Alle Highlight-Klassen entfernen -> Striping kehrt ohne Neuaufbau zurueck
      component.cssClasses.set([]);
      await LuxTestHelper.wait(fixture);
      expect(getTableContent().classList.contains('lux-table-no-striping')).toBe(false);
    });

    it('Sollte das Striping beibehalten, wenn die Highlight-Klasse auf keine Zeile zutrifft', async () => {
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      component.cssClasses.set([{ class: 'lux-text-highlight-success', check: (element: any) => element.c1 === 99 }]);
      await LuxTestHelper.wait(fixture);
      expect(getTableContent().classList.contains('lux-table-no-striping')).toBe(false);
    });

    it('Sollte das Striping bei Nicht-Highlight-Klassen beibehalten', async () => {
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      component.cssClasses.set([{ class: 'meine-app-klasse', check: () => true }]);
      await LuxTestHelper.wait(fixture);
      expect(getTableContent().classList.contains('lux-table-no-striping')).toBe(false);
    });

    it('Sollte das Striping reaktivieren, wenn ein Datenwechsel die einzige passende Zeile entfernt', async () => {
      // Vorbedingung: Highlight-Klasse trifft auf eine Zeile der aktuellen Daten zu
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      component.cssClasses.set([{ class: 'lux-text-highlight-error', check: (element: any) => element.c1 === 1 }]);
      await LuxTestHelper.wait(fixture);
      expect(getTableContent().classList.contains('lux-table-no-striping')).toBe(true);

      // Datenwechsel entfernt die einzige passende Zeile, cssClasses bleibt unveraendert
      component.dataSource.set([
        { c1: 3, c2: 'Lithium' },
        { c1: 4, c2: 'Beryllium' }
      ]);
      await LuxTestHelper.wait(fixture);
      expect(getTableContent().classList.contains('lux-table-no-striping')).toBe(false);
    });
  });

  describe('HTTP-DAO', () => {
    let component: HttpDaoTableComponent;
    let fixture: ComponentFixture<HttpDaoTableComponent>;
    let luxTableComponent: LuxTableComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(HttpDaoTableComponent);
      component = fixture.componentInstance;
      luxTableComponent = fixture.debugElement.query(By.directive(LuxTableComponent)).componentInstance;
    });

    it('Sollte erstellt werden', () => {
      expect(component).toBeTruthy();
    });

    it('Sollte die Progressbar ausblenden, den Platz freigeben und die Tabelle sperren, wenn luxShowProgress false ist', async () => {
      component.showProgress.set(false);
      component.httpDao().loadData = () =>
        of({ items: component.httpDao().dataSourceFix, totalCount: component.httpDao().dataSourceFix.length }).pipe(delay(1000));

      await detectChangesAndFlush(fixture);

      expect(luxTableComponent.isLoading()).toBe(true);
      expect(fixture.nativeElement.querySelector('lux-progress')).toBeNull();
      expect(fixture.nativeElement.querySelector('.lux-table-progress-container')).toBeNull();
      expect(luxTableComponent.tableHeightCSSCalc).toContain('calc(100% - 0px');
      expect(fixture.nativeElement.querySelector('.lux-table-overlay').classList.contains('lux-table-overlay-active')).toBe(true);
      expect(fixture.nativeElement.querySelector('.lux-table.lux-pointer-events-none')).not.toBeNull();

      await LuxTestHelper.wait(fixture, 1000);

      expect(luxTableComponent.isLoading()).toBe(false);
      expect(fixture.nativeElement.querySelector('.lux-table-overlay').classList.contains('lux-table-overlay-active')).toBe(false);

      await vi.runAllTimersAsync();
    });

    it('Sollte die Progressbar während des Ladens anzeigen, wenn luxShowProgress true ist', async () => {
      component.httpDao().loadData = () =>
        of({ items: component.httpDao().dataSourceFix, totalCount: component.httpDao().dataSourceFix.length }).pipe(delay(1000));

      await detectChangesAndFlush(fixture);

      expect(luxTableComponent.isLoading()).toBe(true);
      expect(fixture.nativeElement.querySelector('lux-progress')).not.toBeNull();
      expect(luxTableComponent.tableHeightCSSCalc).toContain('calc(100% - 15px');

      await LuxTestHelper.wait(fixture, 1000);

      expect(luxTableComponent.isLoading()).toBe(false);
      expect(fixture.nativeElement.querySelector('lux-progress')).toBeNull();

      await vi.runAllTimersAsync();
    });

    it('Sollte die Progressbar ausblenden, wenn luxShowProgress während des Ladens auf false gesetzt wird', async () => {
      component.httpDao().loadData = () =>
        of({ items: component.httpDao().dataSourceFix, totalCount: component.httpDao().dataSourceFix.length }).pipe(delay(1000));

      await detectChangesAndFlush(fixture);
      expect(fixture.nativeElement.querySelector('lux-progress')).not.toBeNull();

      component.showProgress.set(false);
      await detectChangesAndFlush(fixture);

      expect(luxTableComponent.isLoading()).toBe(true);
      expect(fixture.nativeElement.querySelector('lux-progress')).toBeNull();
      expect(luxTableComponent.tableHeightCSSCalc).toContain('calc(100% - 0px');

      await vi.runAllTimersAsync();
    });

    it('Sollte den Platz der Progressbar wiederherstellen, wenn luxShowProgress wieder auf true gesetzt wird', async () => {
      component.showProgress.set(false);
      await detectChangesAndFlush(fixture);
      expect(fixture.nativeElement.querySelector('.lux-table-progress-container')).toBeNull();
      expect(luxTableComponent.tableHeightCSSCalc).toContain('calc(100% - 0px');

      component.showProgress.set(true);
      await detectChangesAndFlush(fixture);
      expect(fixture.nativeElement.querySelector('.lux-table-progress-container')).not.toBeNull();
      expect(luxTableComponent.tableHeightCSSCalc).toContain('calc(100% - 15px');

      await vi.runAllTimersAsync();
    });

    describe('luxLoadingChange', () => {
      beforeEach(() => {
        component.httpDao().loadData = () =>
          of({ items: component.httpDao().dataSourceFix, totalCount: component.httpDao().dataSourceFix.length }).pipe(delay(1000));
      });

      it('Sollte beim Laden true und danach false emittieren', async () => {
        await detectChangesAndFlush(fixture);
        expect(component.loadingChanges).toEqual([true]);

        await LuxTestHelper.wait(fixture, 1000);
        expect(component.loadingChanges).toEqual([true, false]);
      });

      it('Sollte asynchron emittieren', async () => {
        await detectChangesAndFlush(fixture);
        await LuxTestHelper.wait(fixture, 1000);
        component.loadingChanges = [];

        luxTableComponent.filtered$.next('a');
        expect(luxTableComponent.isLoading()).toBe(true);
        expect(component.loadingChanges).toEqual([]);

        await Promise.resolve();
        expect(component.loadingChanges).toEqual([true]);

        await vi.runAllTimersAsync();
      });

      it('Sollte beim Filtern nur einmal true und nach dem Laden false emittieren', async () => {
        await detectChangesAndFlush(fixture);
        await LuxTestHelper.wait(fixture, 1000);
        component.loadingChanges = [];

        luxTableComponent.filtered$.next('a');
        await vi.advanceTimersByTimeAsync(100);
        luxTableComponent.filtered$.next('al');
        fixture.detectChanges();
        await Promise.resolve();
        expect(component.loadingChanges).toEqual([true]);

        // Debounce abwarten: das anschließende Laden über das DAO darf keinen Zwischenstand false emittieren
        await LuxTestHelper.wait(fixture, 500);
        expect(component.loadingChanges).toEqual([true]);
        expect(luxTableComponent.isLoading()).toBe(true);

        await LuxTestHelper.wait(fixture, 1000);
        expect(component.loadingChanges).toEqual([true, false]);
      });

      it('Sollte beim Wechsel des luxHttpDAO per Binding ohne NG0100 emittieren', async () => {
        await detectChangesAndFlush(fixture);
        await LuxTestHelper.wait(fixture, 1000);
        component.loadingChanges = [];

        // Der Host zeigt tableLoading oberhalb der Tabelle an (normales Feld, kein Signal).
        // Eine synchrone Emission während der Change Detection würde hier NG0100 auslösen.
        const newHttpDao = new TestHttpDao();
        newHttpDao.loadData = () => of({ items: newHttpDao.dataSourceFix, totalCount: newHttpDao.dataSourceFix.length }).pipe(delay(1000));
        component.httpDao.set(newHttpDao);
        await detectChangesAndFlush(fixture);
        expect(component.loadingChanges).toEqual([true]);
        expect(fixture.nativeElement.querySelector('.host-table-loading')).not.toBeNull();

        await LuxTestHelper.wait(fixture, 1000);
        expect(component.loadingChanges).toEqual([true, false]);
        expect(fixture.nativeElement.querySelector('.host-table-loading')).toBeNull();
      });

      it('Sollte bei überlappenden Requests den alten abbrechen und erst nach dem neuesten false emittieren', async () => {
        const deliveredFilters: (string | undefined)[] = [];
        component.httpDao().loadData = (conf) => {
          const filter = conf.filter;
          return of({ items: [{ c1: 1, c2: filter }], totalCount: 1 }).pipe(
            delay(1000),
            tap(() => deliveredFilters.push(filter))
          );
        };
        await detectChangesAndFlush(fixture);
        await LuxTestHelper.wait(fixture, 1000);
        component.loadingChanges = [];
        deliveredFilters.length = 0;

        // t=0: Filter "a" -> Request startet nach dem Debounce bei t=500 und würde bis t=1500 dauern
        luxTableComponent.filtered$.next('a');
        await vi.advanceTimersByTimeAsync(600);
        // t=600: Filter "al" -> Request startet bei t=1100 (bricht "a" ab) und dauert bis t=2100
        luxTableComponent.filtered$.next('al');
        await vi.advanceTimersByTimeAsync(1000);

        // t=1600: Der Request für "a" wurde abgebrochen und hat weder Daten noch Ladezustand geändert
        expect(deliveredFilters).toEqual([]);
        expect(luxTableComponent.isLoading()).toBe(true);
        expect(component.loadingChanges).toEqual([true]);

        await vi.advanceTimersByTimeAsync(500);
        fixture.detectChanges();
        expect(deliveredFilters).toEqual(['al']);
        expect(luxTableComponent.dataSource.data[0].c2).toEqual('al');
        expect(luxTableComponent.isLoading()).toBe(false);
        expect(component.loadingChanges).toEqual([true, false]);
      });

      it('Sollte den Ladezustand beenden, wenn luxHttpDAO während des Ladens entfernt wird', async () => {
        const deliveredItems: unknown[] = [];
        component.httpDao().loadData = () =>
          of({ items: component.httpDao().dataSourceFix, totalCount: component.httpDao().dataSourceFix.length }).pipe(
            delay(1000),
            tap((data: unknown) => deliveredItems.push(data))
          );
        await detectChangesAndFlush(fixture);
        expect(component.loadingChanges).toEqual([true]);

        component.httpDao.set(undefined as unknown as TestHttpDao);
        await detectChangesAndFlush(fixture);
        expect(luxTableComponent.isLoading()).toBe(false);
        expect(component.loadingChanges).toEqual([true, false]);

        // Der abgebrochene Request darf keine veralteten Daten mehr in die Tabelle schreiben
        await vi.runAllTimersAsync();
        expect(deliveredItems).toEqual([]);
        expect(component.loadingChanges).toEqual([true, false]);
      });

      it('Sollte bei unverändertem Filter den laufenden Request abwarten', async () => {
        await detectChangesAndFlush(fixture);
        await LuxTestHelper.wait(fixture, 1000);
        component.loadingChanges = [];

        // t=0: Filter "a" -> Request von t=500 bis t=1500
        luxTableComponent.filtered$.next('a');
        await vi.advanceTimersByTimeAsync(600);
        // t=600/700: "ab" und zurück zu "a" -> Debounce liefert bei t=1200 wieder "a"
        luxTableComponent.filtered$.next('ab');
        await vi.advanceTimersByTimeAsync(100);
        luxTableComponent.filtered$.next('a');
        await vi.advanceTimersByTimeAsync(600);

        // t=1300: Der Request für "a" läuft noch
        expect(luxTableComponent.isLoading()).toBe(true);
        expect(component.loadingChanges).toEqual([true]);

        await vi.advanceTimersByTimeAsync(200);
        expect(luxTableComponent.isLoading()).toBe(false);
        expect(component.loadingChanges).toEqual([true, false]);
      });

      it('Sollte false emittieren, wenn das DAO ohne Wert abschließt', async () => {
        component.httpDao().loadData = () => timer(1000).pipe(ignoreElements());

        await detectChangesAndFlush(fixture);
        expect(component.loadingChanges).toEqual([true]);

        await LuxTestHelper.wait(fixture, 1000);
        expect(luxTableComponent.isLoading()).toBe(false);
        expect(component.loadingChanges).toEqual([true, false]);
      });

      it('Sollte false emittieren und die Tabelle entsperren, wenn das DAO einen Fehler liefert', async () => {
        component.httpDao().loadData = () => timer(1000).pipe(switchMap(() => throwError(() => new Error('Serverfehler'))));

        await detectChangesAndFlush(fixture);
        expect(component.loadingChanges).toEqual([true]);

        await LuxTestHelper.wait(fixture, 1000);
        expect(luxTableComponent.isLoading()).toBe(false);
        expect(component.loadingChanges).toEqual([true, false]);
        expect(fixture.nativeElement.querySelector('.lux-table-overlay').classList.contains('lux-table-overlay-active')).toBe(false);
        expect(luxTableComponent.dataSource.data.length).toEqual(0);
      });

      it('Sollte beim Blättern einen laufenden Request abbrechen', async () => {
        const deliveredPages: (number | undefined)[] = [];
        component.httpDao().loadData = (conf) => {
          const page = conf.page;
          return of({ items: component.httpDao().dataSourceFix, totalCount: 50 }).pipe(
            delay(1000),
            tap(() => deliveredPages.push(page))
          );
        };
        await detectChangesAndFlush(fixture);
        await LuxTestHelper.wait(fixture, 1000);
        component.loadingChanges = [];
        deliveredPages.length = 0;

        // t=0: Seite 1 anfordern, t=500: Seite 2 anfordern (bricht Seite 1 ab)
        luxTableComponent.onPaginatorPageChange({ pageIndex: 1, pageSize: 5, length: 50, previousPageIndex: 0 });
        await vi.advanceTimersByTimeAsync(500);
        luxTableComponent.onPaginatorPageChange({ pageIndex: 2, pageSize: 5, length: 50, previousPageIndex: 1 });

        // t=1200: Seite 1 wäre jetzt fertig, wurde aber abgebrochen
        await vi.advanceTimersByTimeAsync(700);
        expect(deliveredPages).toEqual([]);
        expect(luxTableComponent.isLoading()).toBe(true);
        expect(component.loadingChanges).toEqual([true]);

        // t=1500: Seite 2 ist fertig
        await vi.advanceTimersByTimeAsync(300);
        expect(deliveredPages).toEqual([2]);
        expect(luxTableComponent.isLoading()).toBe(false);
        expect(component.loadingChanges).toEqual([true, false]);
      });

      it('Sollte über den veralteten Setter isLoadingResults den Ladezustand setzen und emittieren', async () => {
        await detectChangesAndFlush(fixture);
        await LuxTestHelper.wait(fixture, 1000);
        component.loadingChanges = [];

        luxTableComponent.isLoadingResults = true;
        await detectChangesAndFlush(fixture);
        expect(luxTableComponent.isLoading()).toBe(true);
        expect(luxTableComponent.isLoadingResults).toBe(true);
        expect(fixture.nativeElement.querySelector('.lux-table-overlay').classList.contains('lux-table-overlay-active')).toBe(true);
        expect(component.loadingChanges).toEqual([true]);

        luxTableComponent.isLoadingResults = false;
        await detectChangesAndFlush(fixture);
        expect(luxTableComponent.isLoading()).toBe(false);
        expect(component.loadingChanges).toEqual([true, false]);
      });

      it('Sollte false emittieren, wenn die Tabelle während des Ladens zerstört wird', async () => {
        await detectChangesAndFlush(fixture);
        expect(component.loadingChanges).toEqual([true]);

        fixture.destroy();
        expect(component.loadingChanges).toEqual([true, false]);

        await vi.runAllTimersAsync();
        expect(component.loadingChanges).toEqual([true, false]);
      });

      it('Sollte beim Entfernen der Tabelle per @if während des Ladens mit Signal-Handler kein NG0100 auslösen', async () => {
        const toggleFixture = TestBed.createComponent(HttpDaoToggleTableComponent);
        const host = toggleFixture.componentInstance;
        host.httpDao().loadData = () =>
          of({ items: host.httpDao().dataSourceFix, totalCount: host.httpDao().dataSourceFix.length }).pipe(delay(1000));

        await detectChangesAndFlush(toggleFixture);
        expect(host.tableLoading()).toBe(true);
        expect(toggleFixture.nativeElement.querySelector('.host-table-loading')).not.toBeNull();

        // Die Tabelle wird während der Change Detection des Hosts zerstört und emittiert dabei synchron false
        host.showTable.set(false);
        await detectChangesAndFlush(toggleFixture);
        expect(host.tableLoading()).toBe(false);
        expect(toggleFixture.nativeElement.querySelector('.host-table-loading')).toBeNull();

        await vi.runAllTimersAsync();
      });
    });

    it('Die load-Data Funktion des übergebenen DAOs aufrufen', async () => {
      // Vorbedingungen testen
      let contentRows = document.querySelectorAll('.mat-mdc-row');
      let headerRow = document.querySelector('.mat-header-row');
      let footerRow = document.querySelector('.mat-footer-row');

      expect(contentRows.length).toBe(0);
      expect(luxTableComponent.dataSource.data.length).toEqual(0);
      expect(headerRow).toBeDefined();
      expect(footerRow).toBeDefined();

      // Änderungen durchführen
      // Abwarten bis das DAO geladen hat (ist asynchron)
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      contentRows = document.querySelectorAll('.mat-mdc-row');
      headerRow = document.querySelector('.mat-header-row');
      footerRow = document.querySelector('.mat-footer-row');

      expect(contentRows.length).toBe(2);
      expect(luxTableComponent.dataSource.data.length).toEqual(2);
      expect(headerRow).toBeDefined();
      expect(footerRow).toBeDefined();

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte nur die Daten nach dem aktuellen Filter setzen', async () => {
      // Vorbedingungen testen
      // Abwarten bis das DAO geladen hat (ist asynchron)
      await LuxTestHelper.wait(fixture);
      let contentRows = document.querySelectorAll('.mat-mdc-row');

      expect(contentRows.length).toBe(2);
      expect(luxTableComponent.dataSource.data.length).toEqual(2);

      // Änderungen durchführen.
      // Wir überschreiben hier absichtlich loadData um testen zu können, ob ein älterer (veralteter Filtertext) loadData-Response
      // der aber trotzdem später ankommt als eine neuere Response korrekt abgefangen und ignoriert wird.
      component.httpDao().loadData = (conf: any) => {
        if (conf.filter === 'old_filter_text_later_arrival') {
          return of({
            items: component.httpDao().dataSourceFix,
            totalCount: component.httpDao().dataSourceFix.length
          }).pipe(delay(2000));
        } else if (conf.filter === 'new_filter_text_earlier_arrival') {
          return of({ items: [component.httpDao().dataSourceFix[0]], totalCount: 1 }).pipe(delay(500));
        } else {
          throw new Error('Unreachable');
        }
      };
      await LuxTestHelper.wait(fixture);

      luxTableComponent.filtered$.next('old_filter_text_later_arrival');
      await LuxTestHelper.wait(fixture, 550);

      luxTableComponent.filtered$.next('new_filter_text_earlier_arrival');
      await LuxTestHelper.wait(fixture);

      await LuxTestHelper.wait(fixture, 2500);

      // Nachbedingungen testen.
      // Hier muss das Resultat dem der neueren Filterung entsprechend und der alte Request ("old_filter...") darf
      // keine Auswirkungen gehabt haben.
      contentRows = document.querySelectorAll('.mat-mdc-row');

      expect(contentRows.length).toBe(1);
      expect(luxTableComponent.dataSource.data.length).toEqual(1);
    });

    it('Selektion muss nach dem Setzen eines neuen DAO geleert sein.', async () => {
      await LuxTestHelper.wait(fixture);
      expect(component.selected().size).toBe(0);

      // Änderungen durchführen
      await LuxTestHelper.wait(fixture);

      const firstTd = fixture.debugElement.query(By.css('td.lux-multiselect-td')).nativeElement;
      (firstTd as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(component.selected().size).toBe(1);

      component.httpDao.set(new TestHttpDao());
      await LuxTestHelper.wait(fixture);

      expect(component.selected().size).toEqual(0);
    });

    it('HTTP-DAO Multiselect: Select-All und Counter funktionieren', async () => {
      // Vorbedingungen: Daten laden lassen
      await LuxTestHelper.wait(fixture);
      let counter = document.querySelector('.lux-selected-count') as HTMLElement;
      expect(counter.textContent?.trim()).toBe('0 / 2');

      // Select-All via Footer Row
      const footerRow = document.querySelector('.lux-footer-row') as HTMLElement;
      footerRow.click();
      await LuxTestHelper.wait(fixture);
      counter = document.querySelector('.lux-selected-count') as HTMLElement;
      expect(counter.textContent?.trim()).toBe('2 / 2');

      // Deselect all
      footerRow.click();
      await LuxTestHelper.wait(fixture);
      counter = document.querySelector('.lux-selected-count') as HTMLElement;
      expect(counter.textContent?.trim()).toBe('0 / 2');
    });

    it('multiSelect-Spalte Sortierung ist bei HTTP-DAO + MultiSelect deaktiviert', async () => {
      // Vorbedingungen: Tabelle initialisiert
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen: Der Sort-Header der multiSelect-Spalte muss die CSS-Klasse mat-sort-header-disabled tragen
      const multiSelectTh = fixture.nativeElement.querySelector('th.lux-multiselect-th');
      expect(multiSelectTh).toBeTruthy();
      expect(multiSelectTh.classList.contains('mat-sort-header-disabled')).toBe(true);

      await LuxTestHelper.wait(fixture);
    });

    it('Sort-Event auf multiSelect-Spalte mit HTTP-DAO + MultiSelect ruft loadHttpDAOData nicht auf', async () => {
      // Vorbedingungen: Tabelle initialisiert
      await LuxTestHelper.wait(fixture);

      // Spy auf loadHttpDAOData erstellen
      vi.spyOn(luxTableComponent as any, 'loadHttpDAOData').mockReturnValue(undefined);

      // handleSort aufrufen um die Subscription neu zu registrieren
      (luxTableComponent as any).handleSort();

      // Sort-Event auf multiSelect-Spalte auslösen – soll vom Guard ignoriert werden
      expect(luxTableComponent.sort).toBeTruthy();
      luxTableComponent.sort!.sortChange.emit({ active: 'multiSelect', direction: 'asc' });
      await LuxTestHelper.wait(fixture);

      // loadHttpDAOData darf NICHT aufgerufen worden sein
      expect(luxTableComponent['loadHttpDAOData']).not.toHaveBeenCalled();

      await LuxTestHelper.wait(fixture);
    });

    it('Sortierung auf normale Spalten mit HTTP-DAO + MultiSelect ruft loadHttpDAOData auf', async () => {
      // Vorbedingungen: Tabelle initialisiert (HttpDaoTableComponent hat luxMultiSelect=true und luxHttpDAO gesetzt)
      await LuxTestHelper.wait(fixture);

      // Spy auf loadHttpDAOData erstellen
      vi.spyOn(luxTableComponent as any, 'loadHttpDAOData').mockReturnValue(undefined);

      // handleSort aufrufen um die Subscription neu zu registrieren
      (luxTableComponent as any).handleSort();

      // Sort-Event auf eine normale Datenspalte auslösen
      expect(luxTableComponent.sort).toBeTruthy();
      luxTableComponent.sort!.sortChange.emit({ active: 'c2', direction: 'asc' });
      await LuxTestHelper.wait(fixture);

      // loadHttpDAOData MUSS aufgerufen worden sein
      expect(luxTableComponent['loadHttpDAOData']).toHaveBeenCalled();

      await LuxTestHelper.wait(fixture);
    });
  });

  describe('Multiselect', () => {
    let component: TableMultiselectComponent;
    let fixture: ComponentFixture<TableMultiselectComponent>;
    let luxTableComponent: LuxTableComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TableMultiselectComponent);
      component = fixture.componentInstance;
      luxTableComponent = fixture.debugElement.query(By.directive(LuxTableComponent)).componentInstance;
      fixture.detectChanges();
    });

    it('Sollte erstellt werden', () => {
      expect(component).toBeTruthy();
    });

    it('Einträge korrekt selektieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      let multiselectCheckbox = document.getElementsByClassName('lux-multiselect-toggle');
      let multiselectCheckboxAll = document.getElementsByClassName('lux-multiselect-toggle-all');
      expect(multiselectCheckbox.length).toBe(0);
      expect(multiselectCheckboxAll.length).toBe(0);
      expect(component.selected().size).toBe(0);

      // Änderungen durchführen
      component.showMultiSelect.set(true);
      await LuxTestHelper.wait(fixture);

      const multiselectRow = document.querySelectorAll('.lux-row');

      (multiselectRow[0] as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      (multiselectRow[1] as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      multiselectCheckbox = document.getElementsByClassName('lux-multiselect-toggle');
      multiselectCheckboxAll = document.getElementsByClassName('lux-multiselect-toggle-all');
      expect(multiselectCheckbox.length).toBe(2);
      expect(multiselectCheckboxAll.length).toBe(1);
      expect(component.selected().size).toBe(2);
    });

    it('Alle Einträge korrekt selektieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      expect(component.selected().size).toBe(0);

      // Änderungen durchführen
      component.showMultiSelect.set(true);
      await LuxTestHelper.wait(fixture);

      const multiselectTriggerAll = document.querySelector('.lux-footer-row');

      (multiselectTriggerAll as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(component.selected().size).toBe(2);

      // Änderungen durchführen
      (multiselectTriggerAll as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(component.selected().size).toBe(0);
    });

    it('Alle Einträge mit Filter korrekt selektieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      expect(component.selected().size).toBe(0);

      // Änderungen durchführen
      component.showMultiSelect.set(true);
      component.showFilter.set(true);
      await LuxTestHelper.wait(fixture);

      luxTableComponent.filtered$.next('he');
      await LuxTestHelper.wait(fixture, 550);

      const multiselectTriggerAll = document.querySelector('.lux-footer-row');

      (multiselectTriggerAll as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(component.selected().size).toBe(1);

      // Änderungen durchführen
      (multiselectTriggerAll as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(component.selected().size).toBe(0);
    });

    it('Filter für Multiselect-Tabelle deaktivieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      expect(component.selected().size).toBe(0);
      expect(fixture.debugElement.query(By.css('.lux-table-filter.lux-hide'))).not.toBeNull();

      // Änderungen durchführen
      component.showMultiSelect.set(true);
      component.showFilter.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-table-filter.lux-hide'))).toBeNull();

      // Änderungen durchführen
      component.showFilter.set(false);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-table-filter.lux-hide'))).not.toBeNull();
    });

    it('Alle Einträge programmatisch korrekt selektieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      // luxSelected von der TableComponent prüfen, da beim programmatischen Setzen kein Change-Event ausgeführt wird
      expect(luxTableComponent.luxSelected.size).toBe(0);

      // Änderungen durchführen
      component.showMultiSelect.set(true);
      await LuxTestHelper.wait(fixture);

      component.preselected.set(new Set([component.dataSource()[0], component.dataSource()[1]]));
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(luxTableComponent.luxSelected.size).toBe(2);

      // Änderungen durchführen
      component.preselected.set(new Set());
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(luxTableComponent.luxSelected.size).toBe(0);
    });

    it('Alle Einträge programmatisch korrekt selektieren (mit pickValueFn)', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      // luxSelected von der TableComponent prüfen, da beim programmatischen Setzen kein Change-Event ausgeführt wird
      expect(luxTableComponent.luxSelected.size).toBe(0);

      // Änderungen durchführen
      component.showMultiSelect.set(true);
      component.pickFn.set((o) => o.c2);
      await LuxTestHelper.wait(fixture);

      component.preselected.set(new Set([component.dataSource()[0], component.dataSource()[1]]));
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(luxTableComponent.luxSelected.size).toBe(2);

      // Änderungen durchführen
      component.preselected.set(new Set());
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(luxTableComponent.luxSelected.size).toBe(0);
    });

    it('Alle Einträge programmatisch korrekt selektieren (mit compareWithFn)', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      // luxSelected von der TableComponent prüfen, da beim programmatischen Setzen kein Change-Event ausgeführt wird
      expect(luxTableComponent.luxSelected.size).toBe(0);

      // Änderungen durchführen
      component.showMultiSelect.set(true);
      component.compareFn.set((o1, o2) => o1.c1 === o2.c1);
      await LuxTestHelper.wait(fixture);

      component.preselected.set(new Set([{ c1: 1, c2: 'Hydrogen' }]));
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(luxTableComponent.luxSelected.size).toBe(1);

      // Änderungen durchführen
      component.preselected.set(new Set());
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(luxTableComponent.luxSelected.size).toBe(0);
    });

    it('Alle Einträge programmatisch korrekt selektieren (mit compareWithFn und pickValueFn)', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      await LuxTestHelper.wait(fixture);
      // luxSelected von der TableComponent prüfen, da beim programmatischen Setzen kein Change-Event ausgeführt wird
      expect(luxTableComponent.luxSelected.size).toBe(0);

      // Änderungen durchführen
      component.showMultiSelect.set(true);
      component.compareFn.set((o1_c1, o2_c1) => o1_c1 === o2_c1);
      component.pickFn.set((o) => o.c1);
      await LuxTestHelper.wait(fixture);

      component.preselected.set(new Set([{ c1: 1, c2: 'Hydrogen' }]));
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(luxTableComponent.luxSelected.size).toBe(1);

      // Änderungen durchführen
      component.preselected.set(new Set());
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(luxTableComponent.luxSelected.size).toBe(0);
    });

    it('Selektierte Einträge sortieren', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Alpha' },
        { c1: 2, c2: 'Beta' }
      ]);
      await LuxTestHelper.wait(fixture);
      expect(component.selected().size).toBe(0);

      // Änderungen durchführen
      component.showMultiSelect.set(true);
      await LuxTestHelper.wait(fixture);
      const multiselectRow = document.querySelectorAll('.lux-row');

      (multiselectRow[1] as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(component.selected().size).toBe(1);

      // Änderungen durchführen body
      const sortHeader = document.querySelector('th.mat-sort-header');
      (sortHeader as HTMLButtonElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(sortHeader).toBeDefined();

      let col2FirstElements = document.getElementsByClassName('c2-content');
      expect(col2FirstElements.item(1)!.textContent).toEqual('Alpha');
      expect(col2FirstElements.item(0)!.textContent).toEqual('Beta');

      // Änderungen durchführen
      (sortHeader as HTMLButtonElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      col2FirstElements = document.getElementsByClassName('c2-content');
      expect(col2FirstElements.item(1)!.textContent).toEqual('Beta');
      expect(col2FirstElements.item(0)!.textContent).toEqual('Alpha');
    });

    it('Die korrekte Anzahl selektierter Elemente ausgeben', async () => {
      // Vorbedingungen testen
      component.dataSource.set([
        { c1: 1, c2: 'Hydrogen' },
        { c1: 2, c2: 'Helium' }
      ]);
      component.showMultiSelect.set(true);
      await LuxTestHelper.wait(fixture);
      let selectedCount = (document.getElementsByClassName('lux-selected-count').item(0) as HTMLElement).innerText;
      expect(selectedCount).toEqual('0 / 2');

      // Änderungen durchführen
      const multiselectRow = document.querySelectorAll('.lux-row');

      (multiselectRow[0] as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      selectedCount = (document.getElementsByClassName('lux-selected-count').item(0) as HTMLElement).innerText;
      expect(selectedCount).toEqual('1 / 2');

      // Änderungen durchführen
      (multiselectRow[1] as HTMLElement).click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      selectedCount = (document.getElementsByClassName('lux-selected-count').item(0) as HTMLElement).innerText;
      expect(selectedCount).toEqual('2 / 2');
    });
  });

  describe('Cursor-Hinweis', () => {
    let component: TableCursorComponent;
    let fixture: ComponentFixture<TableCursorComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TableCursorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    function getFirstRow(): HTMLElement {
      return fixture.nativeElement.querySelector('.lux-row') as HTMLElement;
    }

    it('Setzt ohne beobachtete Events und ohne Multiselect keinen Cursor', async () => {
      component.dataSource.set([{ c1: 1, c2: 'Hydrogen' }]);
      await LuxTestHelper.wait(fixture);

      const row = getFirstRow();
      expect(row.classList.contains('lux-cursor-pointer')).toBe(false);
    });

    it('Setzt ohne Multiselect bei beobachtetem luxSelectedChange einen Cursor', async () => {
      component.dataSource.set([{ c1: 1, c2: 'Hydrogen' }]);
      component.showSelectedChangeCursor.set(true);
      await LuxTestHelper.wait(fixture);

      const row = getFirstRow();
      expect(row.classList.contains('lux-cursor-pointer')).toBe(true);
    });

    it('Setzt Cursor bei beobachtetem luxSingleClicked', async () => {
      component.dataSource.set([{ c1: 1, c2: 'Hydrogen' }]);
      component.showSingleClickedCursor.set(true);
      await LuxTestHelper.wait(fixture);

      const row = getFirstRow();
      expect(row.classList.contains('lux-cursor-pointer')).toBe(true);
    });

    it('Setzt Cursor bei Multiselect mit beobachtetem luxSelectedChange nur ohne Checkbox-Only-Click', async () => {
      component.dataSource.set([{ c1: 1, c2: 'Hydrogen' }]);
      component.multiSelect.set(true);
      component.multiSelectOnlyCheckboxClick.set(false);
      component.showSelectedChangeCursor.set(true);
      await LuxTestHelper.wait(fixture);

      let row = getFirstRow();
      expect(row.classList.contains('lux-cursor-pointer')).toBe(true);

      component.multiSelectOnlyCheckboxClick.set(true);
      await LuxTestHelper.wait(fixture);

      row = getFirstRow();
      expect(row.classList.contains('lux-cursor-pointer')).toBe(false);
    });

    it('Setzt bei Multiselect ohne beobachtete Events Cursor nur ohne Checkbox-Only-Click', async () => {
      component.dataSource.set([{ c1: 1, c2: 'Hydrogen' }]);
      component.multiSelect.set(true);
      component.multiSelectOnlyCheckboxClick.set(false);
      await LuxTestHelper.wait(fixture);

      let row = getFirstRow();
      expect(row.classList.contains('lux-cursor-pointer')).toBe(true);

      component.multiSelectOnlyCheckboxClick.set(true);
      await LuxTestHelper.wait(fixture);

      row = getFirstRow();
      expect(row.classList.contains('lux-cursor-pointer')).toBe(false);
    });

    it('Setzt bei Multiselect und beobachtetem luxDoubleClicked keinen Cursor', async () => {
      component.dataSource.set([{ c1: 1, c2: 'Hydrogen' }]);
      component.multiSelect.set(true);
      component.multiSelectOnlyCheckboxClick.set(false);
      component.showDoubleClickedCursor.set(true);
      await LuxTestHelper.wait(fixture);

      const row = getFirstRow();
      expect(row.classList.contains('lux-cursor-pointer')).toBe(false);
    });
  });
});

@Component({
  template: `
    <lux-table [luxData]="tableData()" [luxShowPagination]="false" luxNoDataText="Keine Daten gefunden.">
      <lux-table-column luxColumnDef="c1">
        <lux-table-column-content>
          <ng-template let-element
            ><span>{{ element.c1 }}</span></ng-template
          >
        </lux-table-column-content>
      </lux-table-column>
    </lux-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTableComponent, LuxTableColumnComponent, LuxTableColumnContentComponent]
})
class TableSignalComponent {
  tableData = signal<TableItem[]>([]);
}

@Component({
  template: `
    <div [ngStyle]="{ height: containerHeight() + 'px', width: containerWidth() + 'px' }">
      <lux-table
        [luxShowColumnSelector]="showColumnSelector()"
        luxColumnStorageKey="test-table"
        [luxData]="dataSource()"
        [luxShowPagination]="showPagination()"
        [luxColWidthsPercent]="colWidths()"
        [luxShowFilter]="showFilter()"
        [luxPageSize]="pageSize()"
        [luxClasses]="cssClasses()"
        [luxNoDataText]="noDataText()"
        [luxMinWidthPx]="minWidth()"
        [luxAutoPaginate]="autoPaginate()"
        [luxHideBorders]="hideBorders()"
      >
        <lux-table-column
          luxColumnDef="c1"
          [luxSortable]="c1Sortable()"
          [luxSticky]="c1Sticky()"
          [luxResponsiveAt]="c1RespAt()"
          [luxResponsiveBehaviour]="c1RespBeh()"
        >
          @if (!hideHeaders()) {
            <lux-table-column-header>
              <ng-template>C1</ng-template>
            </lux-table-column-header>
          }
          <lux-table-column-content>
            <ng-template let-element>
              <span>{{ element.c1 }}</span>
            </ng-template>
          </lux-table-column-content>
          <lux-table-column-footer>
            <ng-template>C1 Footer</ng-template>
          </lux-table-column-footer>
        </lux-table-column>
        <lux-table-column
          luxColumnDef="c2"
          [luxSortable]="c2Sortable()"
          [luxSticky]="c2Sticky()"
          [luxResponsiveAt]="c2RespAt()"
          [luxResponsiveBehaviour]="c2RespBeh()"
        >
          @if (!hideHeaders()) {
            <lux-table-column-header>
              <ng-template>C2</ng-template>
            </lux-table-column-header>
          }
          <lux-table-column-content>
            <ng-template let-element
              ><span class="c2-content">{{ element.c2 }}</span></ng-template
            >
          </lux-table-column-content>
          <lux-table-column-footer>
            <ng-template>C2 Footer</ng-template>
          </lux-table-column-footer>
        </lux-table-column>
      </lux-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgStyle,
    LuxTableComponent,
    LuxTableColumnComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnContentComponent,
    LuxTableColumnFooterComponent
  ]
})
class TableComponent {
  dataSource = signal<TableItem[]>([]);

  showPagination = signal(false);
  showColumnSelector = signal(false);
  showFilter = signal(false);
  colWidths = signal<number[]>([]);
  pageSize = signal<number>(10);
  cssClasses = signal<ICustomCSSConfig | ICustomCSSConfig[]>([]);
  noDataText = signal('Keine Daten gefunden.');
  minWidth = signal<number>(-1);
  containerHeight = signal<number | undefined>(undefined);
  containerWidth = signal<number | undefined>(undefined);
  autoPaginate = signal(false);
  hideBorders = signal(false);
  hideHeaders = signal(false);
  c1Sortable = signal<boolean>(false);
  c1Sticky = signal<boolean>(false);
  c2Sortable = signal<boolean>(false);
  c2Sticky = signal<boolean>(false);
  c1RespAt = signal<string | string[] | null>(null);
  c2RespAt = signal<string | string[] | null>(null);
  c1RespBeh = signal<string>('');
  c2RespBeh = signal<string>('');

  constructor() {}
}

@Component({
  template: `
    <lux-table
      [luxData]="dataSource()"
      [luxMultiSelect]="multiSelect()"
      [luxMultiSelectOnlyCheckboxClick]="multiSelectOnlyCheckboxClick()"
      [luxShowSelectedChangeCursor]="showSelectedChangeCursor()"
      [luxShowSingleClickedCursor]="showSingleClickedCursor()"
      [luxShowDoubleClickedCursor]="showDoubleClickedCursor()"
    >
      <lux-table-column luxColumnDef="c1">
        <lux-table-column-header>
          <ng-template>C1</ng-template>
        </lux-table-column-header>
        <lux-table-column-content>
          <ng-template let-element>
            <span>{{ element.c1 }}</span>
          </ng-template>
        </lux-table-column-content>
      </lux-table-column>
      <lux-table-column luxColumnDef="c2">
        <lux-table-column-header>
          <ng-template>C2</ng-template>
        </lux-table-column-header>
        <lux-table-column-content>
          <ng-template let-element>
            <span>{{ element.c2 }}</span>
          </ng-template>
        </lux-table-column-content>
      </lux-table-column>
    </lux-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTableComponent, LuxTableColumnComponent, LuxTableColumnHeaderComponent, LuxTableColumnContentComponent]
})
class TableCursorComponent {
  dataSource = signal<TableItem[]>([]);
  multiSelect = signal(false);
  multiSelectOnlyCheckboxClick = signal(false);
  showSelectedChangeCursor = signal(false);
  showSingleClickedCursor = signal(false);
  showDoubleClickedCursor = signal(false);

  constructor() {}
}

@Component({
  template: `
    @if (tableLoading) {
      <span class="host-table-loading"></span>
    }
    <lux-table
      [luxHttpDAO]="httpDao()"
      [luxShowProgress]="showProgress()"
      (luxLoadingChange)="onLoadingChange($event)"
      [luxShowColumnSelector]="showColumnSelector"
      luxColumnStorageKey="test-table"
      [luxShowPagination]="true"
      [luxShowFilter]="true"
      [luxPageSize]="5"
      [(luxSelected)]="selected"
      [luxMultiSelect]="true"
    >
      <lux-table-column luxColumnDef="c1" [luxSortable]="true">
        <lux-table-column-header>
          <ng-template> C1 </ng-template>
        </lux-table-column-header>
        <lux-table-column-content>
          <ng-template let-element>
            <span>{{ element.c1 }}</span>
          </ng-template>
        </lux-table-column-content>
        <lux-table-column-footer>
          <ng-template> C1 Footer </ng-template>
        </lux-table-column-footer>
      </lux-table-column>
      <lux-table-column luxColumnDef="c2" [luxSortable]="true">
        <lux-table-column-header>
          <ng-template> C2 </ng-template>
        </lux-table-column-header>
        <lux-table-column-content>
          <ng-template let-element
            ><span class="c2-content">{{ element.c2 }}</span></ng-template
          >
        </lux-table-column-content>
        <lux-table-column-footer>
          <ng-template> C2 Footer </ng-template>
        </lux-table-column-footer>
      </lux-table-column>
    </lux-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxTableComponent,
    LuxTableColumnComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnContentComponent,
    LuxTableColumnFooterComponent
  ]
})
class HttpDaoTableComponent {
  httpDao = signal<TestHttpDao>(new TestHttpDao());
  showProgress = signal(true);
  loadingChanges: boolean[] = [];
  tableLoading = false;
  selected = signal(new Set());
  showColumnSelector = false;

  constructor() {}

  onLoadingChange(loading: boolean) {
    this.loadingChanges.push(loading);
    this.tableLoading = loading;
  }
}

@Component({
  template: `
    @if (tableLoading()) {
      <span class="host-table-loading"></span>
    }
    @if (showTable()) {
      <lux-table [luxHttpDAO]="httpDao()" (luxLoadingChange)="tableLoading.set($event)">
        <lux-table-column luxColumnDef="c1">
          <lux-table-column-header>
            <ng-template>C1</ng-template>
          </lux-table-column-header>
          <lux-table-column-content>
            <ng-template let-element>
              <span>{{ element.c1 }}</span>
            </ng-template>
          </lux-table-column-content>
        </lux-table-column>
      </lux-table>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTableComponent, LuxTableColumnComponent, LuxTableColumnHeaderComponent, LuxTableColumnContentComponent]
})
class HttpDaoToggleTableComponent {
  httpDao = signal<TestHttpDao>(new TestHttpDao());
  showTable = signal(true);
  tableLoading = signal(false);
}

@Component({
  template: `
    <lux-table
      [luxData]="dataSource()"
      [luxShowPagination]="showPagination()"
      [luxShowFilter]="showFilter()"
      [luxMultiSelect]="showMultiSelect()"
      [luxSelected]="preselected()"
      [luxPickValue]="pickFn()"
      [luxCompareWith]="compareFn()"
      (luxSelectedChange)="selected.set($event)"
    >
      <lux-table-column luxColumnDef="c1">
        <lux-table-column-header>
          <ng-template>C1</ng-template>
        </lux-table-column-header>
        <lux-table-column-content>
          <ng-template let-element>
            <span>{{ element.c1 }}</span>
          </ng-template>
        </lux-table-column-content>
        <lux-table-column-footer>
          <ng-template>C1 Footer</ng-template>
        </lux-table-column-footer>
      </lux-table-column>
      <lux-table-column luxColumnDef="c2">
        <lux-table-column-header>
          <ng-template>C2</ng-template>
        </lux-table-column-header>
        <lux-table-column-content>
          <ng-template let-element
            ><span class="c2-content">{{ element.c2 }}</span></ng-template
          >
        </lux-table-column-content>
        <lux-table-column-footer>
          <ng-template>C2 Footer</ng-template>
        </lux-table-column-footer>
      </lux-table-column>
    </lux-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxTableComponent,
    LuxTableColumnComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnContentComponent,
    LuxTableColumnFooterComponent
  ]
})
class TableMultiselectComponent {
  dataSource = signal<TableItem[]>([]);
  selected = signal(new Set());
  preselected = signal<Set<TableItem>>(new Set<TableItem>());
  showPagination = signal(false);
  showFilter = signal(false);
  showMultiSelect = signal(false);
  pickFn = signal<(o: any) => any>((o: any) => o);
  compareFn = signal<(o1: any, o2: any) => boolean>((o1: any, o2: any) => o1 === o2);

  constructor() {}
}

class TestHttpDao implements ILuxTableHttpDao {
  dataSourceFix: any[] = [
    { c1: 1, c2: 'Alpha' },
    { c1: 2, c2: 'Beta' }
  ];

  constructor() {}

  loadData(conf: { page: number; pageSize: number; filter?: string; sort?: string; order?: string }): Observable<any> {
    // Beispiel; bis zum return würde das alles hier serverseitig stattfinden
    return of({ items: this.dataSourceFix, totalCount: this.dataSourceFix.length });
  }
}

class MockConsoleService {
  error(param: any) {}
}
