import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LuxSelectFilterDirective } from './lux-select-filter.directive';

@Component({
  selector: 'lux-test-component',
  template: `
    <mat-select
      [luxSelectFilter]="enableFilter"
      [luxFilterLabelFn]="labelFn"
      (luxFilteredIndexesChange)="onFilteredIndexesChange($event)"
      (luxFilteredItemsChange)="onFilteredItemsChange($event)"
      (luxFilterActiveChange)="onFilterActiveChange($event)"
    >
      @for (item of items; track item) {
        <mat-option [value]="item">{{ item }}</mat-option>
      }
    </mat-select>
  `,
  standalone: true,
  imports: [MatSelectModule, LuxSelectFilterDirective]
})
class TestComponent {
  enableFilter = true;
  items = ['Deutschland', 'Belgien', 'Frankreich'];
  labelFn = (item: string) => item;
  filteredIndexes = new Set<number>();
  filteredItems = new Set<string>();
  filterActive = false;

  onFilteredIndexesChange(indexes: Set<number>) {
    this.filteredIndexes = indexes;
  }

  onFilteredItemsChange(items: Set<string>) {
    this.filteredItems = items;
  }

  onFilterActiveChange(active: boolean) {
    this.filterActive = active;
  }
}

describe('LuxSelectFilterDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: LuxSelectFilterDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const matSelect = fixture.debugElement.query((el) => el.componentInstance instanceof MatSelect);
    directive = matSelect?.injector.get(LuxSelectFilterDirective);
  });

  it('sollte erstellt werden', () => {
    expect(directive).toBeTruthy();
  });

  it('sollte Items setzen können', () => {
    directive.setItems(['A', 'B', 'C']);
    expect(directive.filteredIndexes.size).toBe(3);
  });

  it('sollte filtern wenn filterValue gesetzt wird', () => {
    directive.setItems(['Deutschland', 'Belgien', 'Frankreich']);
    directive.onFilterInput('deu');

    expect(directive.filteredItems.size).toBe(1);
    expect(directive.filteredItems.has('Deutschland')).toBeTrue();
  });

  it('sollte case-insensitive filtern', () => {
    directive.setItems(['Deutschland', 'Belgien', 'Frankreich']);
    directive.onFilterInput('DEU');

    expect(directive.filteredItems.has('Deutschland')).toBeTrue();
  });

  it('sollte alle Items zurückgeben bei leerem Filter', () => {
    directive.setItems(['Deutschland', 'Belgien', 'Frankreich']);
    directive.onFilterInput('');

    expect(directive.filteredItems.size).toBe(3);
  });

  it('sollte isFilterActive korrekt zurückgeben', () => {
    directive.filterValue = '';
    expect(directive.isFilterActive()).toBeFalse();

    directive.filterValue = 'test';
    expect(directive.isFilterActive()).toBeTrue();

    directive.filterValue = '   ';
    expect(directive.isFilterActive()).toBeFalse();
  });

  it('sollte isItemVisible korrekt prüfen', () => {
    directive.setItems(['Deutschland', 'Belgien']);
    directive.onFilterInput('deu');

    expect(directive.isItemVisible('Deutschland')).toBeTrue();
    expect(directive.isItemVisible('Belgien')).toBeFalse();
  });

  it('sollte isIndexVisible korrekt prüfen', () => {
    directive.setItems(['Deutschland', 'Belgien']);
    directive.onFilterInput('deu');

    expect(directive.isIndexVisible(0)).toBeTrue();
    expect(directive.isIndexVisible(1)).toBeFalse();
  });
});

