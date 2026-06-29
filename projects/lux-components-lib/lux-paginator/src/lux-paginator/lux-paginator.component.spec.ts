import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxPageEvent } from './lux-paginator-model/lux-page-event';
import { LuxPaginatorComponent } from './lux-paginator.component';

describe('LuxPaginatorComponent', () => {
  let component: LuxPaginatorComponent;
  let fixture: ComponentFixture<LuxPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxPaginatorComponent],
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should have default values', () => {
      expect(component.luxLength()).toBe(0);
      expect(component.luxPageSize()).toBe(50);
      expect(component.luxPageIndex()).toBe(0);
      expect(component.luxShowFirstLastButtons()).toBe(true);
      expect(component.luxHidePageSize()).toBe(false);
      expect(component.luxDisabled()).toBe(false);
      expect(component.luxDense()).toBe(true);
      expect(component.luxPageSizeOptions()).toEqual([10, 25, 50, 100]);
    });

    it('input signals should be callable as functions', () => {
      expect(typeof component.luxLength).toBe('function');
      expect(typeof component.luxPageSize).toBe('function');
      expect(typeof component.luxPageIndex).toBe('function');
      expect(typeof component.luxShowFirstLastButtons).toBe('function');
      expect(typeof component.luxHidePageSize).toBe('function');
      expect(typeof component.luxDisabled).toBe('function');
      expect(typeof component.luxDense).toBe('function');
      expect(typeof component.luxPageSizeOptions).toBe('function');
    });

    it('should render inputs in template', () => {
      const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance as MatPaginator;
      expect(paginator.length).toBe(0);
      expect(paginator.pageSize).toBe(50);
      expect(paginator.pageIndex).toBe(0);
    });

    it('should apply custom intl labels from inputs', () => {
      const intl = fixture.debugElement.injector.get(MatPaginatorIntl);

      fixture.componentRef.setInput('luxItemsPerPageLabel', 'Elements per page');
      fixture.componentRef.setInput('luxNextPageLabel', 'Next');
      fixture.componentRef.setInput('luxPreviousPageLabel', 'Previous');
      fixture.componentRef.setInput('luxFirstPageLabel', 'First');
      fixture.componentRef.setInput('luxLastPageLabel', 'Last');
      fixture.detectChanges();

      expect(intl.itemsPerPageLabel).toBe('Elements per page');
      expect(intl.nextPageLabel).toBe('Next');
      expect(intl.previousPageLabel).toBe('Previous');
      expect(intl.firstPageLabel).toBe('First');
      expect(intl.lastPageLabel).toBe('Last');
    });

    it('should restore default intl label when override is set back to undefined', () => {
      const intl = fixture.debugElement.injector.get(MatPaginatorIntl);
      const initialItemsPerPageLabel = intl.itemsPerPageLabel;

      fixture.componentRef.setInput('luxItemsPerPageLabel', 'Elements per page');
      fixture.detectChanges();
      expect(intl.itemsPerPageLabel).toBe('Elements per page');

      fixture.componentRef.setInput('luxItemsPerPageLabel', undefined);
      fixture.detectChanges();

      expect(intl.itemsPerPageLabel).toBe(initialItemsPerPageLabel);
    });

    it('should apply custom range label from input', () => {
      const intl = fixture.debugElement.injector.get(MatPaginatorIntl);
      const customRangeLabel = (page: number, pageSize: number, length: number) => `${page}-${pageSize}-${length}`;

      fixture.componentRef.setInput('luxGetRangeLabel', customRangeLabel);
      fixture.detectChanges();

      expect(intl.getRangeLabel).toBe(customRangeLabel);
      expect(intl.getRangeLabel(1, 25, 100)).toBe('1-25-100');
    });

    it('should restore default range label when override is set back to undefined', () => {
      const intl = fixture.debugElement.injector.get(MatPaginatorIntl);
      const initialRangeLabel = intl.getRangeLabel;
      const customRangeLabel = () => 'custom';

      fixture.componentRef.setInput('luxGetRangeLabel', customRangeLabel);
      fixture.detectChanges();
      expect(intl.getRangeLabel).toBe(customRangeLabel);

      fixture.componentRef.setInput('luxGetRangeLabel', undefined);
      fixture.detectChanges();

      expect(intl.getRangeLabel).toBe(initialRangeLabel);
    });
  });

  describe('Events', () => {
    it('should emit luxPageChange on onPageChange', (done) => {
      const pageEvent: LuxPageEvent = {
        previousPageIndex: 0,
        pageIndex: 1,
        pageSize: 50,
        length: 100
      };

      component.luxPageChange.subscribe((event) => {
        expect(event).toEqual(pageEvent);
        done();
      });

      component.onPageChange(pageEvent as any);
    });

    it('should update luxPageIndex on onPageChange', () => {
      const pageEvent: LuxPageEvent = {
        previousPageIndex: 0,
        pageIndex: 2,
        pageSize: 50,
        length: 100
      };

      component.onPageChange(pageEvent as any);

      expect(component.luxPageIndex()).toBe(2);
    });

    it('should emit correct event on page size change', (done) => {
      const pageEvent: LuxPageEvent = {
        previousPageIndex: 0,
        pageIndex: 0,
        pageSize: 25,
        length: 100
      };

      component.luxPageChange.subscribe((event) => {
        expect(event.pageSize).toBe(25);
        done();
      });

      component.onPageChange(pageEvent as any);
    });
  });

  describe('Methods', () => {
    it('should have firstPage method', () => {
      expect(typeof component.firstPage).toBe('function');
    });

    it('should have lastPage method', () => {
      expect(typeof component.lastPage).toBe('function');
    });

    it('should have nextPage method', () => {
      expect(typeof component.nextPage).toBe('function');
    });

    it('should have previousPage method', () => {
      expect(typeof component.previousPage).toBe('function');
    });

    it('should have getNumberOfPages method', () => {
      expect(typeof component.getNumberOfPages).toBe('function');
    });

    it('should have hasNextPage method', () => {
      expect(typeof component.hasNextPage).toBe('function');
    });

    it('should have hasPreviousPage method', () => {
      expect(typeof component.hasPreviousPage).toBe('function');
    });

    it('getNumberOfPages should return 0 when matPaginator is not available', () => {
      expect(component.getNumberOfPages()).toBe(0);
    });

    it('hasNextPage should return false when matPaginator is not available', () => {
      expect(component.hasNextPage()).toBe(false);
    });

    it('hasPreviousPage should return false when matPaginator is not available', () => {
      expect(component.hasPreviousPage()).toBe(false);
    });
  });

  describe('Component Integration', () => {
    it('should render mat-paginator element', () => {
      const paginatorElement = fixture.nativeElement.querySelector('mat-paginator');
      expect(paginatorElement).toBeTruthy();
    });

    it('should add lux-dense class to mat-paginator when luxDense is true', () => {
      fixture.componentRef.setInput('luxDense', true);
      fixture.detectChanges();

      const paginatorElement = fixture.nativeElement.querySelector('mat-paginator');
      expect(paginatorElement.classList).toContain('lux-dense');
    });

    it('should not add lux-dense class to mat-paginator when luxDense is false', () => {
      fixture.componentRef.setInput('luxDense', false);
      fixture.detectChanges();

      const paginatorElement = fixture.nativeElement.querySelector('mat-paginator');
      expect(paginatorElement.classList).not.toContain('lux-dense');
    });

    it('should add lux-no-wrap class to mat-paginator when luxNoWrap is true', () => {
      fixture.componentRef.setInput('luxNoWrap', true);
      fixture.detectChanges();

      const paginatorElement = fixture.nativeElement.querySelector('mat-paginator');
      expect(paginatorElement.classList).toContain('lux-no-wrap');
    });

    it('should not add lux-no-wrap class to mat-paginator when luxNoWrap is false', () => {
      fixture.componentRef.setInput('luxNoWrap', false);
      fixture.detectChanges();

      const paginatorElement = fixture.nativeElement.querySelector('mat-paginator');
      expect(paginatorElement.classList).not.toContain('lux-no-wrap');
    });
  });
});
